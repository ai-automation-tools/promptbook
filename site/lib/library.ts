import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { resolveInside } from './safe-path.js';

/**
 * Read access to the Public Library (`site/library/`) and its prebuilt index,
 * shared by the Express API and the MCP server (`mcp/server.ts`).
 *
 * Nothing in this module writes to stdout: the MCP server speaks JSON-RPC on
 * stdout, so a stray `console.log` here would corrupt every client session.
 */

const APP_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Always resolve from this file, never process.cwd(): on Vercel the function
 * runs with cwd=/var/task while the app (Root Directory = site) is bundled at
 * /var/task/site, so a cwd-based path misses library/ entirely.
 */
export const LIBRARY_PATH = [path.join(APP_ROOT, 'library'), path.join(process.cwd(), 'library')]
  .find(p => fs.existsSync(p)) ?? path.join(APP_ROOT, 'library');

export const SKILLS_SECTION = '3_Skills';

/** The sections by the short key a caller types, and the folder each one is. */
export const SECTIONS = {
  prompts: { folder: '4_Prompts', label: 'Prompts', description: 'Reusable prompt templates, organised by domain and task.' },
  agents: { folder: '2_Agents', label: 'Agents', description: 'Installable subagent definitions for .claude/agents/.' },
  guides: { folder: '1_Guides', label: 'Guides', description: 'Setup and usage guides for the tools and providers the prompts target.' },
  'system-prompts': { folder: '5_System_Prompts', label: 'System Prompts', description: 'An archive of production system prompts, for study and reuse.' },
  skills: { folder: '3_Skills', label: 'Skills', description: 'SKILL.md bundles with their support files.' },
  'mcp-servers': { folder: '6_MCP_Servers', label: 'MCP Servers', description: 'MCP servers worth installing, with verified install lines.' },
} as const;

export type SectionKey = keyof typeof SECTIONS;
export const SECTION_KEYS = Object.keys(SECTIONS) as [SectionKey, ...SectionKey[]];

export interface IndexEntry {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  contentPreview?: string;
  lastModified: string;
}

export interface LibraryIndex {
  promptCount: number;
  buildTime: string;
  prompts: IndexEntry[];
}

let cachedIndex: LibraryIndex | null | undefined;

/** The prebuilt `api/prompt-index.json`, or null if it was never built. Read once. */
export function loadIndex(): LibraryIndex | null {
  if (cachedIndex !== undefined) return cachedIndex;
  try {
    const file = path.join(APP_ROOT, 'api', 'prompt-index.json');
    cachedIndex = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : null;
  } catch {
    cachedIndex = null;
  }
  return cachedIndex ?? null;
}

export const extractFirstHeading = (content: string): string | null => {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : null;
};

/** section / category / subcategory from a forward-slashed library id. */
export function placeOf(id: string) {
  const parts = id.replace(/\.md$/, '').split('/');
  return {
    section: parts[0] || 'General',
    category: parts[1] || 'Uncategorized',
    subcategory: parts.length > 2 ? parts[2] : null,
  };
}

/**
 * The part of a library file's frontmatter a copy in My Library keeps: a skill's
 * `name`, `description`, `license`, `allowed-tools` and the like. Provenance and
 * the keys My Library manages itself are left behind.
 */
export function carriedFrontmatter(frontmatter: Record<string, unknown>): Record<string, unknown> {
  const drop = new Set(['title', 'tags', 'section', 'category', 'subcategory', 'upstream', 'created', 'updated']);
  return Object.fromEntries(Object.entries(frontmatter).filter(([k]) => !drop.has(k)));
}

/** An MCP server card's source on GitHub, from `server.repo` (and `server.path` for a monorepo). */
export function sourceUrlOf(frontmatter: Record<string, unknown>): string | undefined {
  const server = frontmatter.server as { repo?: unknown; path?: unknown } | undefined;
  if (typeof server?.repo !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(server.repo)) return undefined;
  const base = `https://github.com/${server.repo}`;
  return typeof server.path === 'string' && server.path ? `${base}/tree/HEAD/${server.path}` : base;
}

/** Freshness verdicts check-upstream-drift.mjs writes into api/upstream-status.json. */
export type SourceVerdict = 'current' | 'drifted' | 'behind' | 'upstream-gone' | 'repo-gone' | 'error';

interface StatusFile {
  checked: string;
  items: Record<string, { verdict: SourceVerdict; path?: string; branch?: string }>;
}

let cachedStatus: StatusFile | null | undefined;
/** The weekly drift check's per-file verdicts, or null before the first run. Read once. */
function loadStatus(): StatusFile | null {
  if (cachedStatus !== undefined) return cachedStatus;
  try {
    const file = path.join(APP_ROOT, 'api', 'upstream-status.json');
    cachedStatus = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : null;
  } catch {
    cachedStatus = null;
  }
  return cachedStatus ?? null;
}

/** Where a library item comes from on GitHub, and how it stands against it. */
export interface ItemSource {
  repo: string;
  /** The repo, or the file in it when its real path is known. */
  url: string;
  /** Commit we copied from, with the GitHub compare from there to the default branch. */
  ref?: string;
  compareUrl?: string;
  /** `fork`: upstream deleted the file and this copy is ours now. */
  match?: string;
  verdict?: SourceVerdict;
  checked?: string;
}

const REPO = /^[\w.-]+\/[\w.-]+$/;

/**
 * An item's source: the `upstream:` block attribute-upstream.mjs stamps on skills,
 * agents, system prompts and prompts, an MCP card's `server.repo`, or a guide's bare
 * `repo:` (the tool it documents), plus the weekly verdict where there is one.
 * Undefined when no single repo is known (`unknown`, `ambiguous`, nothing stamped).
 */
export function sourceOf(id: string, frontmatter: Record<string, unknown>): ItemSource | undefined {
  const up = frontmatter.upstream as Record<string, unknown> | undefined;
  const server = frontmatter.server as Record<string, unknown> | undefined;
  // A system prompt published on the vendor's own docs page: no repo, so no commit or drift.
  if (up?.match === 'vendor' && typeof up.url === 'string' && /^https:\/\//.test(up.url)) {
    const checked = up.checked instanceof Date ? up.checked.toISOString().slice(0, 10) : typeof up.checked === 'string' ? up.checked : undefined;
    return { repo: new URL(up.url).hostname, url: up.url, match: 'vendor', ...(checked ? { checked } : {}) };
  }
  const repo = [up?.repo, server?.repo, frontmatter.repo].find((r): r is string => typeof r === 'string');
  if (!repo || !REPO.test(repo)) return undefined;
  if (up && (up.match === 'unknown' || up.match === 'ambiguous')) return undefined;

  const status = loadStatus();
  const s = status?.items[id];
  const base = `https://github.com/${repo}`;
  const filePath = s?.path ?? (typeof server?.path === 'string' && server.path ? server.path : undefined);
  const url = filePath ? `${base}/${s?.path ? 'blob' : 'tree'}/${s?.branch ?? 'HEAD'}/${filePath}` : base;
  // gray-matter reads a bare 40-hex sha as a string, but a short all-digit one as a number.
  const ref = up?.ref !== undefined && /^[0-9a-f]{7,40}$/.test(String(up.ref)) ? String(up.ref) : undefined;
  const checked = s ? status!.checked : up?.checked instanceof Date ? up.checked.toISOString().slice(0, 10) : typeof up?.checked === 'string' ? up.checked : undefined;

  return {
    repo,
    url,
    ...(ref ? { ref } : {}),
    // Compare needs a real branch name; the status file has it once the drift check has run.
    ...(ref && s?.branch ? { compareUrl: `${base}/compare/${ref}...${s.branch}` } : {}),
    ...(typeof up?.match === 'string' ? { match: up.match } : {}),
    ...(s ? { verdict: s.verdict } : {}),
    ...(checked ? { checked } : {}),
  };
}

export interface LibraryItem {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  frontmatter: Record<string, unknown>;
  content: string;
  lastModified: string;
}

/**
 * One library file by id (`4_Prompts/…/x.md`). `invalid` for an id that escapes
 * the library or is not markdown, null for one that does not exist.
 */
export function readLibraryItem(id: string): LibraryItem | null | 'invalid' {
  const clean = id.replace(/\\/g, '/');
  if (!clean.endsWith('.md')) return 'invalid';
  const file = resolveInside(LIBRARY_PATH, clean);
  if (!file) return 'invalid';
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;

  const { data, content } = matter(fs.readFileSync(file, 'utf-8'));
  return {
    id: clean,
    // Skills keep the decorated form in `title`; `name` is the spec slug.
    title: data.title || data.name || extractFirstHeading(content) || path.basename(clean, '.md'),
    ...placeOf(clean),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    frontmatter: data,
    content,
    lastModified: fs.statSync(file).mtime.toISOString(),
  };
}
