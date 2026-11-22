#!/usr/bin/env node
/**
 * Build a static index of all prompts for faster cold starts
 * Run this during build: npm run build:index
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { LIBRARY_PATH, PREVIEW_LENGTH, walkLibrary } from '../lib/library.ts';

const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../api/prompt-index.json');

console.log('Building prompt index...');
const startTime = Date.now();

// The walk is lib/library.ts's walkLibrary(), the same one the API's full listing uses (PB-26).
// Directory order differs by filesystem (case-insensitive on NTFS, hash order on ext4), so the
// entries are sorted by id: the same library gives the same file anywhere. The app sorts
// client-side (default title-asc), so this order is not what anyone sees.
const prompts = (await walkLibrary())
  .map(({ entry, content, mtime }) => ({
    ...entry,
    contentPreview: content.substring(0, PREVIEW_LENGTH), // Just preview for lightweight mode
    lastModified: mtime.toISOString(),
    isUserOwned: false,
  }))
  .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

// A checkout stamps every file's mtime with the checkout time, so a plain
// rebuild rewrote `lastModified` for every prompt and `buildTime` besides —
// a whole-file diff on a library nobody touched, and the Newest/Oldest sort
// scrambled with it. So a rebuild carries the previous index's timestamps
// forward for every entry that has not changed: same metadata, and the file
// has no uncommitted edits. Only what was actually edited gets a new mtime,
// and a rebuild of an unchanged library leaves the file byte-identical.
function readPreviousIndex() {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

// Library files that differ from HEAD, as index ids. The git check is what
// catches an edit below the 200-character preview, which changes no field of
// the entry. Without git (not a checkout) it is empty and the comparison
// falls back to the metadata alone.
function editedIds() {
  try {
    const out = execFileSync('git', ['diff', 'HEAD', '--name-only', '--relative', '-z', '--', '.'], {
      cwd: LIBRARY_PATH,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return new Set(out.split('\0').filter(Boolean));
  } catch {
    return new Set();
  }
}

const sameEntry = (a, b) =>
  JSON.stringify({ ...a, lastModified: null }) === JSON.stringify({ ...b, lastModified: null });

const previous = readPreviousIndex();
if (previous?.prompts) {
  const before = new Map(previous.prompts.map(p => [p.id, p]));
  const edited = editedIds();
  for (const p of prompts) {
    const old = before.get(p.id);
    if (old && !edited.has(p.id) && sameEntry(old, p)) p.lastModified = old.lastModified;
  }
}
const unchanged = previous?.prompts
  && JSON.stringify(previous.prompts) === JSON.stringify(prompts);

const index = {
  version: 1,
  buildTime: unchanged ? previous.buildTime : new Date().toISOString(),
  promptCount: prompts.length,
  prompts: prompts,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));

const duration = Date.now() - startTime;
console.log(`✓ Built index with ${prompts.length} prompts in ${duration}ms`);
console.log(`✓ Saved to: ${OUTPUT_PATH}`);
