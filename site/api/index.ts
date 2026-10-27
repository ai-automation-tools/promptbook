import "dotenv/config";
import express from "express";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import net from "net";
import crypto from "crypto";
import matter from "../lib/frontmatter.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import archiver from "archiver";
import { forkExtra, InvalidPromptError, myLibrary, PromptConflictError, pullUpstream, READ_ONLY, upstreamStatus, type UserPrompt } from "../lib/my-library.js";
import { filesUnder, resolveInside } from "../lib/safe-path.js";
import { LIBRARY_PATH, SKILLS_SECTION, carriedFrontmatter, checkedOf, extractFirstHeading, readLibraryItem, sourceOf, sourceUrlOf, type IndexEntry, type LibraryIndex } from "../lib/library.js";
import type { IncomingMessage, ServerResponse } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize app.
// Exported so `server.ts` can mount this exact app behind Vite in development.
// It used to keep a hand-maintained copy of every handler below, which drifted:
// dev lost `lightweight`, never gained `GET /api/prompts/:id`, and still filtered
// the GitHub tree on a `prompts/` folder that was renamed to `library/`.
export const app = express();

// Response headers only: no CSP, because Vite's build emits inline module
// preloads and the themes pull from Google Fonts, and in production the static
// assets never pass through Express anyway. HSTS is left to Vercel, which sets
// it on the edge for custom domains.
app.use(helmet({ contentSecurityPolicy: false, strictTransportSecurity: false }));

// Prompt bodies are user content and some library prompts run long, but nothing
// legitimate approaches a megabyte.
app.use(express.json({ limit: '1mb' }));

/**
 * Hostnames this server answers to. Same rule as Vite's `allowedHosts`, so dev
 * and `npm start` agree: localhost, *.localhost, any IP literal, and the
 * ALLOWED_HOSTS names (a leading dot allows subdomains too). A DNS-rebinding
 * page reaches the server under its own domain name, which none of these match.
 */
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS ?? '').split(',').map(h => h.trim().toLowerCase()).filter(Boolean);
const isTrustedHost = (host: string | undefined) => {
  if (!host) return true; // HTTP/1.0 clients; a browser always sends Host
  let name: string;
  try {
    name = new URL(`http://${host}`).hostname.toLowerCase().replace(/^\[|\]$/g, '');
  } catch {
    return false;
  }
  if (name === 'localhost' || name.endsWith('.localhost') || net.isIP(name)) return true;
  return ALLOWED_HOSTS.some(h => h.startsWith('.') ? name === h.slice(1) || name.endsWith(h) : name === h);
};

/** Browsers send Origin on cross-site writes; ours always matches the Host it was served from. */
const isCrossSite = (req: express.Request) => {
  const origin = req.headers.origin;
  if (!origin) return false; // curl and other non-browser clients
  try {
    return new URL(origin).host !== req.headers.host;
  } catch {
    return true; // "null" from sandboxed frames and file:// pages
  }
};

/**
 * The one trust boundary, in front of every route on this app: the prompt API,
 * the skill-packs handler server.ts mounts, Vite and the built `dist/`.
 * - An unknown Host is refused on every method (DNS rebinding). Vercel is
 *   skipped: its edge routes by domain and the demo is read-only.
 * - A cross-site Origin is refused on every write, so no page you visit can
 *   post at localhost:3010 (copy-to-my-prompts needs no body, so it is a
 *   simple request the browser sends without asking).
 */
app.use((req, res, next) => {
  if (!process.env.VERCEL && !isTrustedHost(req.headers.host)) {
    res.status(403).json({ error: 'Unknown Host refused. Add it to ALLOWED_HOSTS if it is yours.' });
    return;
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && isCrossSite(req)) {
    res.status(403).json({ error: 'Cross-site request refused' });
    return;
  }
  next();
});

// Debug middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

/** Every route that writes to My Library. Host and Origin are checked above, for every route. */
// Takes no typed req, so each route's params are still inferred from its path
const requireWritable = (_req: unknown, res: express.Response, next: express.NextFunction) => {
  if (READ_ONLY) {
    res.status(403).json({ error: 'This copy of the library is read-only. Clone the repo to keep your own prompts.' });
    return;
  }
  next();
};

/** The wire shape of a My Library prompt. */
const toApiPrompt = (p: UserPrompt) => ({
  id: p.id,
  title: p.title,
  section: p.section,
  category: p.category,
  subcategory: p.subcategory,
  tags: p.tags,
  content: p.content,
  sourceUrl: p.sourceUrl ?? undefined,
  lastModified: p.updated_at,
  isUserOwned: true,
  version: p.version,
});

/** A public listing row: index metadata, with `content` emptied in lightweight mode. */
type ListedPrompt = Omit<IndexEntry, 'contentPreview'> & { content: string; isUserOwned?: boolean };

// Public listings, cached as the bytes that get sent, with their ETag: the full
// one reads every file in the library (10 MB), and even sending a cached string
// costs a 10 MB Buffer copy plus Express hashing it for an ETag on every hit.
// The promise is what's cached, so requests that arrive while a listing is
// being built share it.
// ponytail: 5-minute TTL, so a library edit shows up within 5 minutes locally; watch the folder if that matters.
type Listing = { body: Buffer; etag: string };
const listingCache = new Map<boolean, { listing: Promise<Listing>; at: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function cachedListing(lightweight: boolean, build: () => Promise<ListedPrompt[]>): Promise<Listing> {
  const hit = listingCache.get(lightweight);
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.listing;
  const listing = build().then(async rows => {
    // Row by row, yielding every 200: one JSON.stringify of 10 MB held the loop ~150 ms.
    const parts: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      parts.push(JSON.stringify(rows[i]));
      if (i % 200 === 199) await new Promise(setImmediate);
    }
    const body = Buffer.from(`[${parts.join(',')}]`);
    return { body, etag: `"${crypto.createHash('sha1').update(body).digest('base64url')}"` };
  });
  listingCache.set(lightweight, { listing, at: Date.now() });
  listing.catch(() => listingCache.delete(lightweight)); // a failed build isn't kept
  return listing;
}

// Load prebuilt index if available (for faster cold starts)
let prebuiltIndex: LibraryIndex | null = null;
try {
  const indexPath = path.join(__dirname, 'prompt-index.json');
  if (fs.existsSync(indexPath)) {
    const loaded: LibraryIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    prebuiltIndex = loaded;
    console.log(`[INDEX] Loaded prebuilt index with ${loaded.promptCount} prompts (built: ${loaded.buildTime})`);
  }
} catch (err) {
  console.warn('[INDEX] Failed to load prebuilt index:', err);
}

// How many characters of a prompt body a card blurb gets. Mirrors the same
// constant in scripts/build-prompt-index.js, which bakes `contentPreview` in.
const PREVIEW_LENGTH = 200;

// A README opens with rows of badges (`[![License](…svg)](LICENSE.md)`), which fill
// all 200 characters and leave the card nothing to show. Lines made only of
// images, linked or not, are dropped before the cut.
const IMAGE_ONLY_LINE = /^[ \t]*(?:\[?!\[[^\]\n]*\]\([^)\n]*\)(?:\]\([^)\n]*\))?[ \t]*)+\r?\n?/gm;
export const previewOf = (content: string): string =>
  content.replace(IMAGE_ONLY_LINE, '').substring(0, PREVIEW_LENGTH);

// id → contentPreview, built once from the prebuilt index.
// The listing no longer ships previews (they were 632 KB of its 2.2 MB, and only
// the ~50 cards on screen ever render one), so POST /api/prompts/previews serves
// them per page out of this map.
let previewIndex: Map<string, string> | null = null;
const getPreviewIndex = (): Map<string, string> => {
  if (!previewIndex) {
    previewIndex = new Map(
      (prebuiltIndex?.prompts ?? []).map((p): [string, string] => [p.id, p.contentPreview ?? '']),
    );
  }
  return previewIndex;
};

// LIBRARY_PATH, SKILLS_SECTION and the single-item reader live in lib/library.ts,
// shared with the MCP server.
// Pre-rename *_OLD trees — kept in the repo, never served
const LEGACY_SECTION = 'Legacy';

// API to list all prompts (with optional lightweight mode)
app.get("/api/prompts", async (req, res) => {
  const libraryMode = req.query.library as string;
  const lightweight = req.query.lightweight === 'true'; // Only return metadata, not full content

  if (libraryMode === 'my') {
    // Read-only serves the Public Library only: personal prompts stay private too
    if (READ_ONLY) return res.json([]);
    // My Library keeps its inline preview where the public listing dropped one:
    // it is one person's own prompts, not 3,088, so the bytes are not worth a
    // round trip — and /api/prompts/previews only knows about library files.
    return res.json(myLibrary.list().map(p => ({
      ...toApiPrompt(p),
      content: lightweight ? previewOf(p.content) : p.content,
    })));
  }

  // Lightweight comes from the prebuilt index when there is one. Previews are
  // deliberately left out: nothing the client does with the whole listing
  // (search, tag/category filters, sort, pagination) reads `content`, and
  // shipping all 3,088 of them cost more gzipped than the entire JS bundle.
  // Cards fetch the ~50 they actually render from /api/prompts/previews.
  const index = prebuiltIndex;
  const build = lightweight && index
    ? async () => index.prompts.map(({ contentPreview, ...p }): ListedPrompt => ({ ...p, content: '' }))
    : () => walkLibrary(lightweight);

  try {
    const { body, etag } = await cachedListing(lightweight, build);
    // Setting ETag first stops Express hashing the body again; it still answers 304s.
    res.type('json').set('ETag', etag).send(body);
  } catch (error) {
    console.error("Error listing prompts:", error);
    res.json([]);
  }
});

/**
 * Every listable file under library/, read with async I/O so a full listing
 * (every body, ~10 MB) yields between files instead of holding the event loop
 * for a second. Directory order is kept, so the output matches the old walk.
 */
async function walkLibrary(lightweight: boolean, dir: string = LIBRARY_PATH): Promise<ListedPrompt[]> {
  let names: string[];
  try { names = await fs.promises.readdir(dir); } catch { return []; }

  const rows = await Promise.all(names.map(async (file): Promise<ListedPrompt[]> => {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      if (dir === LIBRARY_PATH && file === LEGACY_SECTION) return [];
      return walkLibrary(lightweight, filePath);
    }
    if (!file.endsWith('.md') || file.toLowerCase() === 'readme.md') return []; // as the index builder skips them

    const relativePath = path.relative(LIBRARY_PATH, filePath);

    // For Skills section, only include SKILL.md files and the Libraries/ cards (as the index does)
    if (relativePath.startsWith(SKILLS_SECTION + path.sep) && !file.endsWith('SKILL.md')
      && !relativePath.startsWith(path.join(SKILLS_SECTION, 'Libraries') + path.sep)) return [];

    // Skip files larger than 500KB (likely bulk collections, not individual prompts)
    if (stat.size > 500 * 1024) {
      console.log(`[SKIP] Large file: ${relativePath} (${(stat.size / 1024).toFixed(0)}KB)`);
      return [];
    }

    const rawContent = await fs.promises.readFile(filePath, 'utf-8');

    // One file with malformed frontmatter must not empty the whole library
    let data: Record<string, unknown>;
    let content: string;
    try {
      ({ data, content } = matter(rawContent));
    } catch (err) {
      console.warn(`[WARN] Failed to parse frontmatter in ${relativePath}, skipping`);
      return [];
    }

    const pathParts = relativePath.replace('.md', '').split(path.sep);

    // For Skills, use 'name' field instead of 'title'
    const str = (v: unknown) => (typeof v === 'string' && v) || null;
    const title = str(data.title) || str(data.name)
      || extractFirstHeading(content) || path.basename(file, '.md');

    return [{
      // Ids are URL/path keys — always forward-slashed, even on Windows
      id: relativePath.split(path.sep).join('/'),
      title,
      section: pathParts[0] || 'General',
      category: pathParts[1] || 'Uncategorized',
      subcategory: pathParts.length > 2 ? pathParts[2] : null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      // Same optional fields, in the same order, as the prebuilt index
      ...(Array.isArray(data.inputs) && { inputs: data.inputs }),
      ...(checkedOf(data) && { checked: checkedOf(data)! }),
      content: lightweight ? '' : content, // Lightweight drops the body; cards fetch previews
      lastModified: stat.mtime.toISOString(),
      isUserOwned: false,
    }];
  }));
  return rows.flat();
}

// Card blurbs for a batch of library ids.
//
// POST rather than GET because ids are library paths ~70 characters long and a
// page asks for 50 of them at once — well past what is safe in a query string.
// Returns { [id]: preview }; ids it cannot resolve are simply absent, so one bad
// id never fails the batch.
const MAX_PREVIEW_IDS = 200;

app.post("/api/prompts/previews", (req, res) => {
  const requested: unknown = req.body?.ids;
  if (!Array.isArray(requested)) {
    return res.status(400).json({ error: 'Expected { ids: string[] }' });
  }

  const previews = getPreviewIndex();
  const out: Record<string, string> = {};

  for (const id of requested.slice(0, MAX_PREVIEW_IDS)) {
    if (typeof id !== 'string') continue;

    const indexed = previews.get(id);
    if (indexed !== undefined) {
      out[id] = indexed;
      continue;
    }

    // Not in the prebuilt index (stale index, or none was built). Fall back to
    // the file — `resolveInside` is what keeps "../../.env" out of this.
    if (!id.endsWith('.md')) continue;
    const filePath = resolveInside(LIBRARY_PATH, id);
    if (!filePath || !fs.existsSync(filePath)) continue;

    try {
      const { content } = matter(fs.readFileSync(filePath, 'utf-8'));
      out[id] = content.substring(0, PREVIEW_LENGTH);
    } catch {
      // Malformed frontmatter — the file has no preview, same as the indexer.
    }
  }

  res.json(out);
});

// Get single prompt with full content
app.get("/api/prompts/:id", async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);

    // My Library ids are bare file names; library ids are always section/…/file.md
    if (!promptId.includes('/') && !READ_ONLY) {
      const prompt = myLibrary.get(promptId);
      if (prompt) {
        return res.json({ ...toApiPrompt(prompt), extra: prompt.extra ?? {}, upstream: upstreamStatus(prompt) });
      }
    }

    const item = readLibraryItem(promptId);
    if (item === 'invalid') {
      return res.status(400).json({ error: 'Invalid prompt path' });
    }
    if (!item) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const { frontmatter, ...rest } = item;
    // `extra` lets a download keep the file's own frontmatter (a skill's name, licence…)
    return res.json({ ...rest, extra: carriedFrontmatter(frontmatter), isUserOwned: false, sourceUrl: sourceUrlOf(frontmatter), source: sourceOf(item.id, frontmatter) });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    res.status(500).json({ error: "Failed to fetch prompt" });
  }
});

// Create prompt
app.post("/api/prompts", requireWritable, async (req, res) => {
  try {
    const { title, section, category, subcategory, tags, content, sourceUrl } = req.body ?? {}; // Express 5 leaves body undefined with no JSON

    // Field checks live in the store (InvalidPromptError → 400 below), shared with MCP
    const prompt = myLibrary.create({
      title,
      section,
      category,
      subcategory: subcategory || null,
      tags: tags ?? [],
      content,
      sourceUrl,
    });

    res.json({ ...toApiPrompt(prompt), message: "Prompt created successfully" });
  } catch (error) {
    if (error instanceof InvalidPromptError) return res.status(400).json({ error: error.message });
    console.error("Error creating prompt:", error);
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

// Update prompt
app.put("/api/prompts/:id", requireWritable, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);
    const { title, tags, content, category, subcategory, section, sourceUrl, version } = req.body ?? {};
    if (version !== undefined && typeof version !== 'string') {
      return res.status(400).json({ error: 'version must be text' });
    }

    const prompt = myLibrary.update(promptId, {
      title,
      tags,
      content,
      category,
      subcategory,
      section,
      sourceUrl,
    }, version);

    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    res.json({ ...toApiPrompt(prompt), message: "Prompt updated successfully" });
  } catch (error) {
    if (error instanceof InvalidPromptError) return res.status(400).json({ error: error.message });
    if (error instanceof PromptConflictError) {
      return res.status(409).json({ error: error.message, current: { ...toApiPrompt(error.current), extra: error.current.extra ?? {} } });
    }
    console.error("Error updating prompt:", error);
    res.status(500).json({ error: "Failed to update prompt" });
  }
});

// Overwrite a My Library copy with the current Public Library version
app.post("/api/prompts/:id/pull-upstream", requireWritable, async (req, res) => {
  try {
    const prompt = pullUpstream(decodeURIComponent(req.params.id));
    if (!prompt) {
      return res.status(404).json({ error: "No public source for this prompt" });
    }
    res.json({ ...toApiPrompt(prompt), upstream: upstreamStatus(prompt), message: "Updated from the Public Library" });
  } catch (error) {
    console.error("Error pulling upstream prompt:", error);
    res.status(500).json({ error: "Failed to update from the Public Library" });
  }
});

// Delete prompt
app.delete("/api/prompts/:id", requireWritable, async (req, res) => {
  try {
    const promptId = decodeURIComponent(req.params.id);

    if (!myLibrary.delete(promptId)) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    res.json({
      message: "Prompt deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    res.status(500).json({ error: "Failed to delete prompt" });
  }
});

// Copy from public library
app.post("/api/prompts/*path/copy-to-my-prompts", requireWritable, async (req, res) => {
  try {
    // Express 5 hands a `*path` wildcard over as its decoded segments
    const promptId = decodeURIComponent(req.params.path.join('/'));

    const item = readLibraryItem(promptId);
    if (item === 'invalid') {
      return res.status(400).json({ error: "Invalid prompt path" });
    }
    if (!item) {
      return res.status(404).json({ error: "Prompt not found in public library" });
    }

    // Parsed content, without the library file's own frontmatter
    const { title, section, category, subcategory, tags, content } = item;

    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = myLibrary.list().find(p =>
      p.section === section &&
      p.category === category &&
      (p.subcategory || null) === (subcategory || null) &&
      p.title.trim().toLowerCase() === normalizedTitle
    );

    if (duplicate) {
      return res.status(409).json({ error: "This prompt already exists in your library" });
    }

    const copiedPrompt = myLibrary.create({
      title,
      section,
      category,
      subcategory,
      tags,
      content,
      extra: forkExtra(item),
    });

    return res.json({ ...toApiPrompt(copiedPrompt), message: "Prompt copied to My Library" });
  } catch (error) {
    console.error("Error copying prompt to My Library:", error);
    return res.status(500).json({ error: (error instanceof Error && error.message) || "Failed to copy prompt to My Library" });
  }
});

// Download skill as zip
app.get("/api/skills/download/*skillPath", async (req, res) => {
  try {
    const skillPath = decodeURIComponent(req.params.skillPath.join('/')).replace(/\\/g, '/');

    // Resolve first, then check containment — a raw startsWith() on skillPath is
    // satisfied by "3_Skills/../../db" and hands out the whole bundle.
    const skillsRoot = path.join(LIBRARY_PATH, SKILLS_SECTION);
    const fullPath = resolveInside(LIBRARY_PATH, skillPath);

    if (!fullPath || !fullPath.startsWith(skillsRoot + path.sep)) {
      return res.status(400).json({ error: "Invalid skill path. Must be under 3_Skills/ directory." });
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "Skill directory not found" });
    }

    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ error: "Path must be a directory" });
    }

    const skillDirName = path.basename(fullPath);
    const zipFilename = `${skillDirName}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

    const archive = archiver('zip', {
      // zlib default: measured 40% faster than 9 on the largest skill for 0.15% more bytes
      zlib: { level: 6 }
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to create archive' });
      }
    });

    archive.pipe(res);
    // File by file rather than archive.directory(), which would follow a link out of the library
    for (const file of filesUnder(fullPath)) {
      archive.file(file, { name: path.relative(fullPath, file).split(path.sep).join('/') });
    }
    await archive.finalize();
  } catch (error) {
    console.error("Error creating skill download:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: (error instanceof Error && error.message) || "Failed to create download" });
    }
  }
});

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
