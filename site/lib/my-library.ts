import fs from 'fs';
import path from 'path';
import matter from './frontmatter.js';
import { createHash, randomBytes } from 'node:crypto';
import { fileURLToPath } from 'url';
import { carriedFrontmatter, loadIndex, readLibraryItem, SECTIONS, type LibraryItem } from './library.js';

/**
 * My Library: the user's own prompts, one markdown file each, in a local folder.
 *
 * This app runs on the user's own machine, so there are no accounts — whoever
 * can reach the server owns the library. Files rather than a database so the
 * folder can be git-versioned, synced, or edited by hand; the frontmatter holds
 * what the old `user_prompts` table did.
 */

export interface UserPrompt {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  /** Where the item stems from (a GitHub repo or a site), `source_url` in the file. */
  sourceUrl?: string | null;
  created_at: string;
  updated_at: string;
  /**
   * Frontmatter keys this store does not manage, kept as they were. A skill's
   * `name` and `description` live here: without them its SKILL.md will not load,
   * and before 2026-10-21 every save dropped them.
   */
  extra?: Record<string, unknown>;
  /**
   * A hash of the file as it is on disk. An update that names the version it
   * started from is refused once the file has changed, whoever changed it: the
   * app in another tab, the MCP server, or a text editor that never touches `updated`.
   */
  version?: string;
}

type PromptFields = Omit<UserPrompt, 'id' | 'created_at' | 'updated_at' | 'version'>;

/** The keys `write()` owns; everything else in a file's frontmatter is `extra`. */
const MANAGED = new Set(['title', 'section', 'category', 'subcategory', 'tags', 'source_url', 'created', 'updated']);
const extraOf = (data: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(data).filter(([k]) => !MANAGED.has(k)));

const APP_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Absolute `MY_LIBRARY_DIR` is used as-is; a relative one resolves against site/. */
export const MY_LIBRARY_DIR = path.resolve(APP_ROOT, process.env.MY_LIBRARY_DIR || 'my-library');

/**
 * The hosted demo (Vercel sets `VERCEL`) has no writable disk and is shared by
 * every visitor, so it serves the Public Library only. `READ_ONLY=true` does the
 * same anywhere else.
 */
export const READ_ONLY = process.env.READ_ONLY === 'true' || Boolean(process.env.VERCEL);

// Ids are file names. Restricting them to this alphabet is what keeps an id
// from ever naming a path outside the folder.
const ID_PATTERN = /^[a-z0-9-]+$/;

const fileFor = (id: string): string | null =>
  ID_PATTERN.test(id) ? path.join(MY_LIBRARY_DIR, `${id}.md`) : null;

// YAML turns an unquoted ISO date into a Date and "123" into a number; the
// frontmatter is hand-editable, so normalise on the way in.
const asString = (value: unknown): string =>
  value instanceof Date ? value.toISOString() : value == null ? '' : String(value);

function read(id: string): UserPrompt | null {
  const file = fileFor(id);
  if (!file || !fs.existsSync(file)) return null;
  return parse(id, fs.readFileSync(file, 'utf-8'), () => fs.statSync(file).mtime);
}

/** A file's text as a prompt; `mtime` stands in for a missing `updated`. */
function parse(id: string, raw: string, mtime: () => Date): UserPrompt {
  const { data, content } = matter(raw);
  const updated = asString(data.updated) || mtime().toISOString();
  return {
    id,
    title: asString(data.title) || id,
    section: asString(data.section) || '4_Prompts',
    category: asString(data.category) || 'Uncategorized',
    subcategory: data.subcategory ? asString(data.subcategory) : null,
    tags: Array.isArray(data.tags) ? data.tags.map(asString) : [],
    content,
    sourceUrl: data.source_url ? asString(data.source_url) : null,
    created_at: asString(data.created) || updated,
    updated_at: updated,
    extra: extraOf(data),
    version: versionOf(raw),
  };
}

const versionOf = (raw: string | Buffer) => createHash('sha256').update(raw).digest('hex').slice(0, 16);

/**
 * Writes the file and returns its new version. A replacement goes to a temp file
 * in the same folder and is renamed over the old one, so a crash mid-write leaves
 * the old file whole. The temp name doesn't end in `.md`, so `list()` never sees it.
 */
function write(prompt: UserPrompt, flag: 'w' | 'wx' = 'w'): string {
  fs.mkdirSync(MY_LIBRARY_DIR, { recursive: true });
  // Unmanaged keys first, so a skill's file still opens with name/description.
  const frontmatter = {
    ...extraOf(prompt.extra ?? {}),
    title: prompt.title,
    section: prompt.section,
    category: prompt.category,
    subcategory: prompt.subcategory,
    tags: prompt.tags,
    ...(prompt.sourceUrl ? { source_url: prompt.sourceUrl } : {}),
    created: prompt.created_at,
    updated: prompt.updated_at,
  };
  const raw = matter.stringify(prompt.content, frontmatter);
  writeFile(prompt.id, raw, flag);
  return versionOf(raw);
}

function writeFile(id: string, raw: string | Buffer, flag: 'w' | 'wx') {
  const file = fileFor(id)!;
  if (flag === 'wx') {
    fs.writeFileSync(file, raw, { flag }); // a new id: nothing to lose, and wx keeps it exclusive
    return;
  }
  replaceFile(file, raw);
}

/** Temp file in the same folder, renamed over the target: a crash mid-write leaves the old file whole. */
function replaceFile(file: string, raw: string | Buffer) {
  const tmp = path.join(MY_LIBRARY_DIR, `.${path.basename(file)}.${randomBytes(4).toString('hex')}.tmp`);
  try {
    fs.writeFileSync(tmp, raw);
    fs.renameSync(tmp, file); // replaces the target on Windows too
  } catch (err) {
    fs.rmSync(tmp, { force: true });
    throw err;
  }
}

/** A write the store refuses. The message names the field; callers send it back as a 400. */
export class InvalidPromptError extends Error {}

/** An update made from a version the file has since moved past. Callers send back a 409 with `current`. */
export class PromptConflictError extends Error {
  constructor(public current: UserPrompt) {
    super('This prompt was changed somewhere else since you opened it');
  }
}

// Well above anything in the Public Library (longest title 172, category 21,
// subcategory 42, 10 tags of up to 40 characters). 500 KB is the size the
// prompt index already skips.
const LIMITS = { title: 300, label: 100, tags: 50, tag: 100, url: 2000, contentBytes: 500 * 1024 };
const SECTION_FOLDERS: string[] = Object.values(SECTIONS).map(s => s.folder);

/**
 * The one field check for every write: HTTP create and update, the MCP tools,
 * copies and pack installs all come through `create` and `update`, so they cannot
 * disagree. `undefined` means "not given", which only an update allows.
 */
function checkFields(f: Partial<PromptFields>, creating: boolean) {
  const fail = (msg: string): never => { throw new InvalidPromptError(msg); };
  const text = (name: string, value: unknown, max: number) => {
    if (value === undefined) return creating ? fail(`${name} is required`) : undefined;
    if (typeof value !== 'string') return fail(`${name} must be text`);
    if (!value.trim()) fail(`${name} can't be empty`);
    if (value.length > max) fail(`${name} is over ${max} characters`);
  };
  text('title', f.title, LIMITS.title);
  text('category', f.category, LIMITS.label);
  if (f.subcategory != null && f.subcategory !== '') {
    if (typeof f.subcategory !== 'string') fail('subcategory must be text');
    if (f.subcategory.length > LIMITS.label) fail(`subcategory is over ${LIMITS.label} characters`);
  }
  if (f.sourceUrl != null && f.sourceUrl !== '') {
    // Rendered as a link, so only http(s): a javascript: URL would run on click.
    if (typeof f.sourceUrl !== 'string') fail('source link must be text');
    if (f.sourceUrl.length > LIMITS.url) fail(`source link is over ${LIMITS.url} characters`);
    let protocol = '';
    try { protocol = new URL(f.sourceUrl).protocol; } catch { /* not a URL */ }
    if (protocol !== 'https:' && protocol !== 'http:') fail('source link must be an http(s) URL');
  }
  if (f.section !== undefined || creating) {
    if (typeof f.section !== 'string' || !SECTION_FOLDERS.includes(f.section)) {
      fail(`section must be one of ${SECTION_FOLDERS.join(', ')}`);
    }
  }
  if (f.tags !== undefined) {
    if (!Array.isArray(f.tags)) fail('tags must be a list of text');
    if (f.tags.length > LIMITS.tags) fail(`more than ${LIMITS.tags} tags`);
    for (const tag of f.tags) {
      if (typeof tag !== 'string' || !tag.trim()) fail('each tag must be non-empty text');
      if (tag.length > LIMITS.tag) fail(`a tag is over ${LIMITS.tag} characters`);
    }
  }
  // An empty body is refused, not ignored: the old `||` reported success and kept the old one.
  text('content', f.content, Infinity);
  if (typeof f.content === 'string' && Buffer.byteLength(f.content) > LIMITS.contentBytes) {
    fail('content is over 500 KB');
  }
}

const slugify = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'prompt';

export const myLibrary = {
  list(): UserPrompt[] {
    if (!fs.existsSync(MY_LIBRARY_DIR)) return [];
    return fs
      .readdirSync(MY_LIBRARY_DIR)
      .filter(name => name.endsWith('.md'))
      .flatMap(name => {
        try {
          return read(name.slice(0, -3)) ?? [];
        } catch {
          console.warn(`[MY-LIBRARY] Skipping unreadable ${name}`);
          return [];
        }
      })
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  },

  get: read,

  create(fields: PromptFields): UserPrompt {
    checkFields(fields, true);
    const now = new Date().toISOString();
    // The suffix keeps two prompts with the same title apart; the file name
    // never changes after this, so a rename doesn't break links to it.
    const prompt: UserPrompt = {
      ...fields,
      subcategory: fields.subcategory || null,
      tags: fields.tags || [],
      sourceUrl: fields.sourceUrl?.trim() || null,
      id: `${slugify(fields.title)}-${randomBytes(3).toString('hex')}`,
      created_at: now,
      updated_at: now,
    };
    prompt.version = write(prompt, 'wx');
    return prompt;
  },

  /** `version`, when given, must match the file on disk (see `UserPrompt.version`). */
  update(id: string, updates: Partial<PromptFields>, version?: string): UserPrompt | null {
    const existing = read(id);
    if (!existing) return null;
    if (version !== undefined && version !== existing.version) throw new PromptConflictError(existing);
    checkFields(updates, false);

    const prompt: UserPrompt = {
      ...existing,
      title: updates.title ?? existing.title,
      section: updates.section ?? existing.section,
      category: updates.category ?? existing.category,
      subcategory: updates.subcategory !== undefined ? updates.subcategory || null : existing.subcategory,
      tags: updates.tags ?? existing.tags,
      content: updates.content ?? existing.content,
      sourceUrl: updates.sourceUrl !== undefined ? updates.sourceUrl?.trim() || null : existing.sourceUrl,
      extra: { ...existing.extra, ...updates.extra },
      updated_at: new Date().toISOString(),
    };
    prompt.version = write(prompt);
    return prompt;
  },

  delete(id: string): boolean {
    const file = fileFor(id);
    if (!file || !fs.existsSync(file)) return false;
    fs.unlinkSync(file);
    try {
      favorites.remove(id);
    } catch {
      console.warn(`[MY-LIBRARY] Could not unstar ${id}: ${FAVORITES_FILE} is unreadable`);
    }
    return true;
  },
};

/*
 * Favorites: the starred My Library items and Skill Packs (`pack:<id>`), one
 * JSON list in `favorites.json` beside the prompt files. They used to live in
 * each browser's localStorage, which is kept per address, so 127.0.0.1,
 * localhost and a Tailscale name each had their own list. On the server, every
 * browser and device that reaches My Library sees the same stars, and they go
 * wherever the folder goes. Not a `.md`, so `list()` never reads it as a prompt.
 */
export const FAVORITES_FILE = 'favorites.json';
/** My Library ids and pack ids share the id alphabet, so a favorite can't name a path either. */
export const FAVORITE_ID = /^(pack:)?[a-z0-9-]{1,200}$/;
const FAVORITES_MAX = 5000;
const favoritesFile = () => path.join(MY_LIBRARY_DIR, FAVORITES_FILE);

/** A favorites list as parsed from JSON: valid ids once each, in order; null if it isn't a list. */
function favoritesOf(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && FAVORITE_ID.test(id)))];
}

/**
 * The saved list. A missing file is no stars. A file broken by hand reads as no
 * stars too, but a write refuses it rather than overwrite what is in it.
 */
function readFavorites(forWrite: boolean): string[] {
  let raw: string;
  try {
    raw = fs.readFileSync(favoritesFile(), 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  let ids: string[] | null = null;
  try { ids = favoritesOf(JSON.parse(raw)); } catch { /* not JSON */ }
  if (ids) return ids;
  if (forWrite) throw new Error(`${FAVORITES_FILE} in My Library is not a JSON list of ids. Fix or delete it.`);
  console.warn(`[MY-LIBRARY] ${FAVORITES_FILE} is not a JSON list of ids; showing no favorites`);
  return [];
}

function writeFavorites(ids: string[]) {
  fs.mkdirSync(MY_LIBRARY_DIR, { recursive: true });
  replaceFile(favoritesFile(), JSON.stringify(ids, null, 2) + '\n');
}

export const favorites = {
  list: (): string[] => readFavorites(false),

  /**
   * Stars the ids not starred yet and returns the list. A My Library id needs its
   * file: an old browser list can name prompts deleted since, and those are skipped.
   */
  add(ids: unknown): string[] {
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string' || !FAVORITE_ID.test(id))) {
      throw new InvalidPromptError('ids must be a list of My Library ids or pack:<id>');
    }
    const current = readFavorites(true);
    const fresh = favoritesOf(ids)!.filter(id =>
      !current.includes(id) && (id.startsWith('pack:') || fs.existsSync(fileFor(id)!)));
    if (!fresh.length) return current;
    if (current.length + fresh.length > FAVORITES_MAX) throw new InvalidPromptError(`more than ${FAVORITES_MAX} favorites`);
    const next = [...current, ...fresh];
    writeFavorites(next);
    return next;
  },

  remove(id: string): string[] {
    const current = readFavorites(true);
    if (!current.includes(id)) return current;
    const next = current.filter(x => x !== id);
    writeFavorites(next);
    return next;
  },
};

/**
 * A copy remembers where it came from in two `extra` keys: `forked_from` (the
 * Public Library id) and `forked_hash` (the public content as it was copied).
 * That base is what tells "the public one changed" apart from "you edited yours".
 */
const hashOf = (content: string) => createHash('sha256').update(content.trim()).digest('hex').slice(0, 16);

/** The `extra` a fresh copy of a library item carries. */
export const forkExtra = (item: LibraryItem) => ({
  ...carriedFrontmatter(item.frontmatter),
  forked_from: item.id,
  forked_hash: hashOf(item.content),
});

export interface UpstreamStatus {
  source: string;
  /** The public content changed since this copy was made (or, with no base, differs). */
  updateAvailable: boolean;
  /** This copy was edited since it was made. Unknown without a base, so true. */
  localEdits: boolean;
}

/**
 * The public item a copy came from. Copies made before 2026-10-22 carry no
 * `forked_from`, so they are matched by place and title, as the duplicate check does.
 */
function sourceOf(prompt: UserPrompt): LibraryItem | null {
  const recorded = typeof prompt.extra?.forked_from === 'string' ? prompt.extra.forked_from : null;
  const title = prompt.title.trim().toLowerCase();
  const id = recorded ?? loadIndex()?.prompts.find(e =>
    e.section === prompt.section && e.category === prompt.category
    && (e.subcategory || null) === (prompt.subcategory || null)
    && e.title.trim().toLowerCase() === title)?.id;
  if (!id) return null;
  const item = readLibraryItem(id);
  return item && item !== 'invalid' ? item : null;
}

export function upstreamStatus(prompt: UserPrompt): UpstreamStatus | null {
  const item = sourceOf(prompt);
  if (!item) return null;
  const upstream = hashOf(item.content);
  const mine = hashOf(prompt.content);
  const base = typeof prompt.extra?.forked_hash === 'string' ? prompt.extra.forked_hash : null;
  return {
    source: item.id,
    updateAvailable: upstream !== mine && (base ? upstream !== base : true),
    localEdits: base ? mine !== base : upstream !== mine,
  };
}

/** Replace a copy's content with the current public version. Never touches the public file. */
export function pullUpstream(id: string): UserPrompt | null {
  const prompt = myLibrary.get(id);
  const item = prompt && sourceOf(prompt);
  if (!prompt || !item) return null;
  return myLibrary.update(id, { content: item.content, extra: forkExtra(item) });
}

/*
 * Export and import: a ZIP of the folder's `<id>.md` files, byte for byte, so a
 * library round-trips exactly (frontmatter the store does not manage included).
 * An import is planned first and writes nothing; applying it writes the new files
 * and replaces a changed one only when the caller hands back the token of the
 * plan that listed it, so nothing is overwritten that was not shown first.
 */

/** Every prompt file in the folder as it is on disk, and favorites.json when there is one. */
export function libraryFiles(): { name: string; data: Buffer }[] {
  if (!fs.existsSync(MY_LIBRARY_DIR)) return [];
  const isFile = (name: string) => fs.statSync(path.join(MY_LIBRARY_DIR, name)).isFile();
  return fs.readdirSync(MY_LIBRARY_DIR)
    .filter(name => (name === FAVORITES_FILE || (name.endsWith('.md') && fileFor(name.slice(0, -3)))) && isFile(name))
    .sort()
    .map(name => ({ name, data: fs.readFileSync(path.join(MY_LIBRARY_DIR, name)) }));
}

/** Room for a full 500 KB body plus its frontmatter. */
export const IMPORT_LIMITS = { entries: 5000, entryBytes: LIMITS.contentBytes + 64 * 1024, totalBytes: 100 * 1024 * 1024 };

export interface ImportPlan {
  added: { id: string; title: string }[];
  unchanged: { id: string; title: string }[];
  /** Files that exist here with different contents; replaced only with `token`. */
  conflicts: { id: string; title: string; currentTitle: string }[];
  skipped: { name: string; reason: string }[];
  /**
   * Stars from the zip's favorites.json that are not starred here yet. Applying
   * adds them (never removes one), for items that exist once the files are written.
   */
  favorites: number;
  /** Names the conflicts and the versions they would replace. */
  token: string;
}

/** An apply whose token no longer matches: a file changed since the preview. */
export class ImportChangedError extends Error {}

function planImport(entries: { name: string; data: Buffer }[]) {
  const plan: ImportPlan = { added: [], unchanged: [], conflicts: [], skipped: [], favorites: 0, token: '' };
  const files = new Map<string, Buffer>();
  const utf8 = new TextDecoder('utf-8', { fatal: true });
  const tokenHash = createHash('sha256');
  let stars: string[] | null = null;

  for (const { name, data } of entries) {
    const id = /^([a-z0-9-]+)\.md$/.exec(name)?.[1];
    const skip = (reason: string) => { plan.skipped.push({ name, reason }); };
    if (name === FAVORITES_FILE) {
      try { stars = favoritesOf(JSON.parse(utf8.decode(data))); } catch { stars = null; }
      if (!stars) skip('not a JSON list of favorite ids');
      continue;
    }
    if (!id) { skip('not a My Library file (expected <id>.md at the top of the zip)'); continue; }
    if (files.has(id)) { skip('appears twice in the zip'); continue; }

    let prompt: UserPrompt;
    try {
      prompt = parse(id, utf8.decode(data), () => new Date());
      checkFields(prompt, true);
    } catch (err) {
      skip(err instanceof InvalidPromptError ? err.message : err instanceof TypeError ? 'not UTF-8 text' : 'its frontmatter does not parse');
      continue;
    }

    files.set(id, data);
    const file = fileFor(id)!;
    const current = fs.existsSync(file) ? fs.readFileSync(file) : null;
    if (!current) plan.added.push({ id, title: prompt.title });
    else if (current.equals(data)) plan.unchanged.push({ id, title: prompt.title });
    else {
      plan.conflicts.push({ id, title: prompt.title, currentTitle: read(id)?.title ?? id });
      tokenHash.update(`${id}:${versionOf(current)}:${versionOf(data)};`);
    }
  }
  plan.token = tokenHash.digest('hex').slice(0, 16);
  // Counted against the files as they will be: here already, or arriving in this zip.
  const starred = new Set(readFavorites(false));
  const newStars = (stars ?? []).filter(id => !starred.has(id)
    && (id.startsWith('pack:') || files.has(id) || fs.existsSync(fileFor(id)!)));
  plan.favorites = newStars.length;
  return { plan, files, newStars };
}

export const previewImport = (entries: { name: string; data: Buffer }[]): ImportPlan => planImport(entries).plan;

/**
 * Writes the plan's new files, and its conflicts too when `overwrite` is the
 * token a preview returned. Without it, conflicts keep the file that is here.
 */
export function applyImport(entries: { name: string; data: Buffer }[], overwrite?: string) {
  const { plan, files, newStars } = planImport(entries);
  if (overwrite !== undefined && overwrite !== plan.token) {
    throw new ImportChangedError('My Library changed since the preview. Preview the import again.');
  }
  fs.mkdirSync(MY_LIBRARY_DIR, { recursive: true });
  for (const { id } of plan.added) writeFile(id, files.get(id)!, 'wx');
  if (overwrite !== undefined) for (const { id } of plan.conflicts) writeFile(id, files.get(id)!, 'w');
  // After the files, so a star on an item this zip brings finds its file.
  const before = newStars.length ? readFavorites(true).length : 0;
  const starred = newStars.length ? favorites.add(newStars).length - before : 0;
  return { plan, written: plan.added.length + (overwrite !== undefined ? plan.conflicts.length : 0), starred };
}
