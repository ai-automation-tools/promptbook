#!/usr/bin/env node
/**
 * Build a static index of all prompts for faster cold starts
 * Run this during build: npm run build:index
 */

import fs from 'fs';
import path from 'path';
import matter from '../lib/frontmatter.js';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIBRARY_PATH = path.join(__dirname, '../library');
const OUTPUT_PATH = path.join(__dirname, '../api/prompt-index.json');

// Library section folder holding skills (numbered layout)
const SKILLS_SECTION = '3_Skills';
const LIBRARIES_FOLDER = path.join(SKILLS_SECTION, 'Libraries');

/** upstream.checked, server.checked (MCP cards) or a guide's checked:, as YYYY-MM-DD; YAML reads a bare date as a Date. */
function checkedOf(data) {
  const v = data.upstream?.checked ?? data.server?.checked ?? data.checked;
  const day = v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === 'string' ? v.slice(0, 10) : null;
  return day && /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
}

function extractFirstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function walkDir(dir, baseDir = LIBRARY_PATH) {
  if (!fs.existsSync(dir)) return [];
  
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Legacy/ holds the pre-rename *_OLD trees — not indexed, not shipped
      if (dir === baseDir && file === 'Legacy') {
        return;
      }
      results = results.concat(walkDir(filePath, baseDir));
    } else if (file.endsWith('.md')) {
      if (file.toLowerCase() === 'readme.md') {
        return;
      }

      const relativePath = path.relative(baseDir, filePath);
      
      // For Skills section, only include SKILL.md files, plus the one-card-per-repo
      // skill libraries in Libraries/ (a library is a card, not copies of its skills)
      if (relativePath.startsWith(SKILLS_SECTION + path.sep)) {
        if (!file.endsWith('SKILL.md') && !relativePath.startsWith(LIBRARIES_FOLDER + path.sep)) {
          return;
        }
      }
      
      // Skip files larger than 500KB
      if (stat.size > 500 * 1024) {
        console.log(`[SKIP] Large file: ${relativePath} (${(stat.size / 1024).toFixed(0)}KB)`);
        return;
      }
      
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      
      let data, content;
      try {
        ({ data, content } = matter(rawContent));
      } catch (err) {
        console.warn(`[WARN] Failed to parse frontmatter in ${relativePath}, skipping`);
        return;
      }
      
      const pathParts = relativePath.replace('.md', '').split(path.sep);
      
      const section = pathParts[0] || 'General';
      const category = pathParts[1] || 'Uncategorized';
      const subcategory = pathParts.length > 2 ? pathParts[2] : null;
      
      // Skills prefer `title` too. `name` is now the spec-required slug
      // (lowercase-hyphen, matching the directory), so reading it here would
      // show "mcp-builder" where the site used to show the decorated form.
      // That decorated form lives in `title`; `name` stays the fallback.
      const title = data.title
        || data.name
        || extractFirstHeading(content)
        || path.basename(file, '.md');
      
      results.push({
        // Ids are URL/path keys — always forward-slashed, even on Windows
        id: relativePath.split(path.sep).join('/'),
        title: title,
        section,
        category,
        subcategory,
        tags: data.tags || [],
        // A prompt's declared fill-ins (lib/prompt-inputs.ts); the MCP server makes them arguments.
        ...(Array.isArray(data.inputs) && { inputs: data.inputs }),
        // When the item was last checked against its source (O02); same rule as checkedOf() in lib/library.ts.
        ...(checkedOf(data) && { checked: checkedOf(data) }),
        contentPreview: content.substring(0, 200), // Just preview for lightweight mode
        lastModified: stat.mtime.toISOString(),
        isUserOwned: false,
      });
    }
  });
  
  return results;
}

console.log('Building prompt index...');
const startTime = Date.now();

// fs.readdirSync returns whatever order the filesystem hands back — case-
// insensitive alphabetical on NTFS, hash order on ext4 — so the same library
// produced a differently-ordered index on Windows than on a Linux CI runner and
// the freshness gate failed on ordering alone. Sorting by id makes the file
// reproducible anywhere. The app sorts client-side (default title-asc), so this
// order is not what anyone sees.
const prompts = walkDir(LIBRARY_PATH).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

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
