/**
 * Promptbook as an MCP server (stdio).
 *
 *   npm run mcp            # from site/
 *
 * An agent can search the Public Library and My Library, read any item, pull a
 * skill with its support files, browse Skill Packs, use library prompts as MCP
 * prompts, and (unless READ_ONLY is set) save to My Library. It reads the same
 * folders the app does; nothing here needs the web server running.
 *
 * Design and tool contracts: docs/features/MCP-SERVER.md.
 */
import './setup.js'; // first: stdout guard and .env, before anything can log
import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';
import matter from 'gray-matter';
import * as z from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import {
  LIBRARY_PATH, SECTIONS, SECTION_KEYS, SKILLS_SECTION, carriedFrontmatter, loadIndex, readLibraryItem, sourceOf,
  type IndexEntry, type SectionKey,
} from '../lib/library.js';
import { forkExtra, myLibrary, PromptConflictError, pullUpstream, READ_ONLY, upstreamStatus, type UserPrompt } from '../lib/my-library.js';
import { filesUnder, resolveInside } from '../lib/safe-path.js';
import { getAllPacks } from '../api/skill-packs.js';

const MAX_FILE = 500 * 1024;
const PREVIEW = 200;

type Result = { content: { type: 'text'; text: string }[]; isError?: boolean };
const text = (t: string): Result => ({ content: [{ type: 'text', text: t }] });
const fail = (t: string): Result => ({ content: [{ type: 'text', text: t }], isError: true });

/**
 * Folders the `file` argument of the write tools may read from (IMPORT_ROOTS, split on
 * the platform's path delimiter). Unset, `file` is refused: without a root the tool would
 * read any markdown file the server can reach into My Library.
 */
const IMPORT_ROOTS = (process.env.IMPORT_ROOTS || '').split(path.delimiter).filter(Boolean);

/**
 * A markdown file under IMPORT_ROOTS, read by the server so a caller never has to pass a
 * long body through the tool call. Real paths on both sides, so a junction can't step out.
 * The file's own frontmatter becomes `extra` (a skill's name and description).
 */
function readImport(file: string): { content: string; extra: Record<string, unknown> } | string {
  if (!IMPORT_ROOTS.length) return 'File import is off: set IMPORT_ROOTS to the folders it may read.';
  let real: string;
  try { real = fs.realpathSync(file); } catch { return `No file "${file}".`; }
  if (!/\.md$/i.test(real)) return 'Only markdown (.md) files can be imported.';
  const inside = IMPORT_ROOTS.some(root => {
    try { return resolveInside(fs.realpathSync(root), real) !== null; } catch { return false; }
  });
  if (!inside) return `"${file}" is outside IMPORT_ROOTS.`;
  if (fs.statSync(real).size > MAX_FILE) return `"${file}" is over ${MAX_FILE / 1024} KB.`;
  const raw = fs.readFileSync(real, 'utf-8');
  return { content: raw, extra: carriedFrontmatter(matter(raw).data) };
}

/** `content`, if given, goes above the imported file as a preface (a source line, say). */
const withPreface = (preface: string | undefined, body: string) =>
  (preface?.trim() ? `${preface.trimEnd()}\n\n${body}` : body);

const folderOf = (key?: SectionKey) => (key ? SECTIONS[key].folder : undefined);
const keyOf = (folder: string) => SECTION_KEYS.find(k => SECTIONS[k].folder === folder) ?? folder;

/** One searchable row: a Public Library index entry or a My Library prompt. */
interface Row extends IndexEntry { library: 'public' | 'my' }

const myRow = (p: UserPrompt): Row => ({
  id: p.id, title: p.title, section: p.section, category: p.category, subcategory: p.subcategory,
  tags: p.tags, contentPreview: p.content.slice(0, PREVIEW), lastModified: p.updated_at, library: 'my',
});

const publicRows = (): Row[] => (loadIndex()?.prompts ?? []).map(e => ({ ...e, library: 'public' as const }));

const line = (r: Row) =>
  `- **${r.title}** — \`${r.id}\` (${keyOf(r.section)} › ${[r.category, r.subcategory].filter(Boolean).join(' › ')})` +
  (r.library === 'my' ? ' · My Library' : '') + (r.tags.length ? ` · tags: ${r.tags.slice(0, 6).join(', ')}` : '');

/** Skill folder (inside 3_Skills) from a folder path or a SKILL.md id. */
function skillDir(id: string): string | null {
  const rel = id.replace(/\\/g, '/').replace(/\/SKILL\.md$/i, '');
  const dir = resolveInside(LIBRARY_PATH, rel);
  const root = path.join(LIBRARY_PATH, SKILLS_SECTION);
  if (!dir || !dir.startsWith(root + path.sep)) return null;
  return fs.existsSync(path.join(dir, 'SKILL.md')) ? dir : null;
}

const listFiles = (dir: string) => filesUnder(dir).map(p => ({
  path: path.relative(dir, p).split(path.sep).join('/'), bytes: fs.statSync(p).size,
}));

const slug = (s: string) => s.toLowerCase().replace(/\.md$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

/** Library prompt text with the caller's input appended, as one user message. */
const promptMessages = (body: string, input?: string) => ({
  messages: [{
    role: 'user' as const,
    content: { type: 'text' as const, text: input ? `${body.trim()}\n\n---\n\n${input}` : body.trim() },
  }],
});

const INSTRUCTIONS = `Promptbook: ${loadIndex()?.promptCount ?? 'thousands of'} prompts, agent definitions, guides, system prompts, skills and MCP server cards, plus the user's own My Library.
Use search_library to find items (filter by section: ${SECTION_KEYS.join(', ')}), then get_item for the full text.
Skills: get_skill returns SKILL.md and its file list; get_skill_file reads one support file.
Ids are library paths like "4_Prompts/Awesome_ChatGPT/General/x.md"; My Library ids are bare slugs.
${READ_ONLY ? 'This server is read-only.' : 'save_to_my_library, update_my_prompt and delete_my_prompt change the user\'s own files; confirm with the user before deleting.'}`;

export function createServer(): McpServer {
  const server = new McpServer(
    { name: 'promptbook', version: '1.0.0' },
    { instructions: INSTRUCTIONS },
  );
  const readOnlyHints = { readOnlyHint: true, openWorldHint: false } as const;

  // ---------- search and read ----------

  server.registerTool('search_library', {
    title: 'Search the library',
    description: 'Search prompts, agents, guides, system prompts, skills and MCP server cards, plus My Library. Returns ids, titles, places and tags; call get_item for the full text. With no query, lists items matching the filters.',
    inputSchema: z.object({
      query: z.string().optional().describe('Words to match against title, tags, category and the opening text'),
      section: z.enum(SECTION_KEYS).optional().describe('Limit to one section'),
      tags: z.array(z.string()).optional().describe('Every tag listed must be present'),
      category: z.string().optional().describe('Category folder name, e.g. "Engineering"'),
      library: z.enum(['all', 'public', 'my']).optional().describe('Which library to search (default all)'),
      limit: z.number().int().min(1).max(50).optional().describe('Maximum results (default 10)'),
    }),
    annotations: readOnlyHints,
  }, async ({ query, section, tags, category, library = 'all', limit = 10 }) => {
    let rows: Row[] = [
      ...(library !== 'my' ? publicRows() : []),
      ...(library !== 'public' ? myLibrary.list().map(myRow) : []),
    ];
    const folder = folderOf(section);
    if (folder) rows = rows.filter(r => r.section === folder);
    if (category) rows = rows.filter(r => r.category.toLowerCase() === category.toLowerCase());
    if (tags?.length) rows = rows.filter(r => tags.every(t => r.tags.includes(t)));

    const hits = query?.trim()
      ? new Fuse(rows, {
          keys: [{ name: 'title', weight: 3 }, { name: 'tags', weight: 2 }, 'category', 'subcategory', 'contentPreview'],
          threshold: 0.35, ignoreLocation: true,
        }).search(query.trim(), { limit }).map(h => h.item)
      : rows.sort((a, b) => a.title.localeCompare(b.title)).slice(0, limit);

    if (!hits.length) return text('No matches. Try fewer words, another section, or no filters.');
    return text(`${hits.length} result${hits.length === 1 ? '' : 's'}:\n${hits.map(line).join('\n')}`);
  });

  server.registerTool('get_item', {
    title: 'Get a library item',
    description: 'The full markdown of one item by id: a library path such as "2_Agents/Development/git-workflow-manager.md", or a My Library id. Skills: pass the SKILL.md path, or use get_skill for the file list too.',
    inputSchema: z.object({ id: z.string().describe('Id from search_library') }),
    annotations: readOnlyHints,
  }, async ({ id }) => {
    if (!id.includes('/')) {
      const mine = myLibrary.get(id);
      if (!mine) return fail(`No My Library item "${id}".`);
      // A skill is only usable with its frontmatter (name, description), so return
      // the whole SKILL.md; other items read fine as their body.
      const body = mine.section === SKILLS_SECTION && mine.extra && Object.keys(mine.extra).length
        ? matter.stringify(mine.content, mine.extra)
        : mine.content;
      const up = upstreamStatus(mine);
      const note = up?.updateAvailable
        ? `\nPublic version \`${up.source}\` has changed${up.localEdits ? ' (this copy is edited too)' : ''}; update_from_public pulls it.`
        : '';
      return text(`# ${mine.title}\n\nMy Library · ${keyOf(mine.section)} › ${mine.category}${mine.tags.length ? ` · tags: ${mine.tags.join(', ')}` : ''} · version: ${mine.version}${note}\n\n${body}`);
    }
    const item = readLibraryItem(id);
    if (item === 'invalid') return fail(`"${id}" is not a library path. Ids look like "4_Prompts/<Category>/<file>.md".`);
    if (!item) return fail(`No library item "${id}".`);
    const head = `${keyOf(item.section)} › ${[item.category, item.subcategory].filter(Boolean).join(' › ')}${item.tags.length ? ` · tags: ${item.tags.join(', ')}` : ''}`;
    const src = sourceOf(item.id, item.frontmatter);
    const from = src ? ` · source: ${src.url}${src.verdict ? ` (${src.verdict} at the ${src.checked} check)` : ''}` : '';
    return text(`# ${item.title}\n\n\`${item.id}\` · ${head}${from}\n\n${item.content}`);
  });

  // ---------- browse ----------

  server.registerTool('list_sections', {
    title: 'List library sections',
    description: 'The library sections with what each holds and how many items it has, plus the My Library count.',
    inputSchema: z.object({}),
    annotations: readOnlyHints,
  }, async () => {
    const rows = publicRows();
    const lines = SECTION_KEYS.map(k => {
      const n = rows.filter(r => r.section === SECTIONS[k].folder).length;
      return `- **${SECTIONS[k].label}** (\`${k}\`, ${n}): ${SECTIONS[k].description}`;
    });
    return text(`${lines.join('\n')}\n- **My Library** (${myLibrary.list().length}): the user's own prompts${READ_ONLY ? ' (read-only here)' : ''}.`);
  });

  server.registerTool('list_categories', {
    title: 'List categories in a section',
    description: 'The category and subcategory folders of one section, with item counts. Use the names as search_library filters.',
    inputSchema: z.object({ section: z.enum(SECTION_KEYS) }),
    annotations: readOnlyHints,
  }, async ({ section }) => {
    const tree = new Map<string, Map<string, number>>();
    for (const r of publicRows().filter(r => r.section === SECTIONS[section].folder)) {
      const subs = tree.get(r.category) ?? new Map<string, number>();
      const sub = r.subcategory ?? '';
      subs.set(sub, (subs.get(sub) ?? 0) + 1);
      tree.set(r.category, subs);
    }
    if (!tree.size) return text(`${SECTIONS[section].label} has no items.`);
    const out = [...tree].sort(([a], [b]) => a.localeCompare(b)).map(([cat, subs]) => {
      const total = [...subs.values()].reduce((a, b) => a + b, 0);
      const named = [...subs].filter(([s]) => s).sort(([a], [b]) => a.localeCompare(b)).map(([s, n]) => `${s} (${n})`);
      return `- **${cat}** (${total})${named.length ? `: ${named.join(', ')}` : ''}`;
    });
    return text(`${SECTIONS[section].label} categories:\n${out.join('\n')}`);
  });

  // ---------- skills and packs ----------

  server.registerTool('get_skill', {
    title: 'Get a skill',
    description: 'A skill\'s SKILL.md and the list of its support files. Pass the skill folder ("3_Skills/Development/Git/git-commit-helper") or its SKILL.md id.',
    inputSchema: z.object({ id: z.string() }),
    annotations: readOnlyHints,
  }, async ({ id }) => {
    const dir = skillDir(id);
    if (!dir) return fail(`"${id}" is not a skill folder under 3_Skills/.`);
    const rel = path.relative(LIBRARY_PATH, dir).split(path.sep).join('/');
    const item = readLibraryItem(`${rel}/SKILL.md`);
    if (!item || item === 'invalid') return fail(`Could not read ${rel}/SKILL.md.`);
    const files = listFiles(dir).filter(f => f.path !== 'SKILL.md');
    const list = files.length
      ? files.map(f => `- \`${f.path}\` (${Math.ceil(f.bytes / 1024)} KB)`).join('\n')
      : '- none';
    return text(`# ${item.title}\n\n\`${rel}\`\n\n## Support files (read with get_skill_file)\n${list}\n\n## SKILL.md\n\n${item.content}`);
  });

  server.registerTool('get_skill_file', {
    title: 'Get a skill support file',
    description: 'One text file from inside a skill folder, by its path relative to the folder (as get_skill lists it).',
    inputSchema: z.object({
      skill: z.string().describe('Skill folder or SKILL.md id'),
      path: z.string().describe('File path inside the skill, e.g. "references/api.md"'),
    }),
    annotations: readOnlyHints,
  }, async ({ skill, path: rel }) => {
    const dir = skillDir(skill);
    if (!dir) return fail(`"${skill}" is not a skill folder under 3_Skills/.`);
    const file = resolveInside(dir, rel.replace(/\\/g, '/'));
    if (!file || file === dir) return fail(`"${rel}" is outside the skill folder.`);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return fail(`No file "${rel}" in this skill.`);
    if (fs.statSync(file).size > MAX_FILE) return fail(`"${rel}" is over 500 KB; download the skill instead.`);
    const buf = fs.readFileSync(file);
    if (buf.subarray(0, 8192).includes(0)) return fail(`"${rel}" is a binary file.`);
    return text(buf.toString('utf-8'));
  });

  server.registerTool('list_skill_packs', {
    title: 'List Skill Packs',
    description: 'Every Skill Pack: id, name, skill count and what it covers.',
    inputSchema: z.object({}),
    annotations: readOnlyHints,
  }, async () => {
    const packs = await getAllPacks();
    if (!packs.length) return text('No Skill Packs.');
    const out = packs.sort((a, b) => String(a.name).localeCompare(String(b.name))).map(p =>
      `- **${p.name}** (\`${p.id}\`, ${p.skills?.length ?? 0} skills${p.generated ? ', generated from a folder' : ''}): ${p.description ?? ''}`);
    return text(out.join('\n'));
  });

  server.registerTool('get_skill_pack', {
    title: 'Get a Skill Pack',
    description: 'One Skill Pack with every skill in it (name, description, SKILL.md id for get_skill).',
    inputSchema: z.object({ id: z.string() }),
    annotations: readOnlyHints,
  }, async ({ id }) => {
    const pack = (await getAllPacks()).find(p => p.id === id);
    if (!pack) return fail(`No Skill Pack "${id}". list_skill_packs shows the ids.`);
    const skills = (pack.skills ?? []).map((s: { path: string; name: string; description?: string }) =>
      `- **${s.name}** — \`${s.path.replace(/^library\//, '')}\`${s.description ? `: ${s.description}` : ''}`);
    return text(`# ${pack.icon ?? ''} ${pack.name}\n\n${pack.description ?? ''}\n\n${skills.join('\n')}`);
  });

  // ---------- My Library writes (never registered when read-only) ----------

  if (!READ_ONLY) {
    const writeHints = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const;

    server.registerTool('save_to_my_library', {
      title: 'Save to My Library',
      description: 'Copy a library item into My Library (pass id), or write a new prompt (pass title and content, or title and file). Returns the new My Library id.',
      inputSchema: z.object({
        id: z.string().optional().describe('Library id to copy'),
        title: z.string().optional(),
        content: z.string().optional().describe('The body; with file, a preface placed above the file'),
        file: z.string().optional().describe('Absolute path of a local .md file to use as the body, read by the server (only under IMPORT_ROOTS). Its frontmatter is kept'),
        section: z.enum(SECTION_KEYS).optional().describe('Default prompts'),
        category: z.string().optional(),
        subcategory: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
      annotations: writeHints,
    }, async ({ id, title, content, file, section, category, subcategory, tags }) => {
      if (READ_ONLY) return fail('This library is read-only.');
      if (file && !id) {
        const imported = readImport(file);
        if (typeof imported === 'string') return fail(imported);
        if (!title?.trim()) return fail('Pass a title with file.');
        const saved = myLibrary.create({
          title: title.trim(), content: withPreface(content, imported.content), section: folderOf(section) ?? '4_Prompts',
          category: category || 'Uncategorized', subcategory: subcategory || null, tags: tags ?? [], extra: imported.extra,
        });
        return text(`Saved \`${file}\` to My Library as \`${saved.id}\`.`);
      }
      if (id) {
        const item = readLibraryItem(id);
        if (item === 'invalid' || !item) return fail(`No library item "${id}" to copy.`);
        const dup = myLibrary.list().find(p => p.section === item.section && p.category === item.category
          && p.title.trim().toLowerCase() === item.title.trim().toLowerCase());
        if (dup) return fail(`Already in My Library as "${dup.id}".`);
        const saved = myLibrary.create({
          title: title || item.title, section: item.section, category: item.category,
          subcategory: item.subcategory, tags: tags ?? item.tags, content: item.content,
          extra: forkExtra(item),
        });
        return text(`Copied to My Library as \`${saved.id}\`.`);
      }
      if (!title?.trim() || !content?.trim()) return fail('Pass an id to copy, or both title and content.');
      const saved = myLibrary.create({
        title: title.trim(), content, section: folderOf(section) ?? '4_Prompts',
        category: category || 'Uncategorized', subcategory: subcategory || null, tags: tags ?? [],
      });
      return text(`Saved to My Library as \`${saved.id}\`.`);
    });

    server.registerTool('update_my_prompt', {
      title: 'Update a My Library prompt',
      description: 'Change the title, content, tags or place of a My Library prompt. Fields left out stay as they are. Pass file to replace the body with a local .md file the server reads.',
      inputSchema: z.object({
        id: z.string().describe('My Library id'),
        title: z.string().optional(),
        content: z.string().optional().describe('The new body; with file, a preface placed above the file'),
        file: z.string().optional().describe('Absolute path of a local .md file to use as the new body (only under IMPORT_ROOTS). Its frontmatter is merged into the prompt\'s'),
        category: z.string().optional(),
        subcategory: z.string().optional(),
        tags: z.array(z.string()).optional(),
        version: z.string().optional().describe('The version get_item showed; the update is refused if the file changed since'),
      }),
      // Destructive: it replaces the body, including wholesale from `file`.
      annotations: { ...writeHints, destructiveHint: true, idempotentHint: true },
    }, async ({ id, file, version, ...fields }) => {
      if (READ_ONLY) return fail('This library is read-only.');
      let changes: Parameters<typeof myLibrary.update>[1] = fields;
      if (file) {
        const imported = readImport(file);
        if (typeof imported === 'string') return fail(imported);
        changes = { ...fields, content: withPreface(fields.content, imported.content), extra: imported.extra };
      }
      let updated;
      try {
        updated = myLibrary.update(id, changes, version);
      } catch (err) {
        if (err instanceof PromptConflictError) return fail(`\`${id}\` changed since version ${version}; it is now ${err.current.version}. get_item it again before updating.`);
        throw err;
      }
      return updated ? text(`Updated \`${updated.id}\`.`) : fail(`No My Library prompt "${id}".`);
    });

    server.registerTool('update_from_public', {
      title: 'Update a My Library copy from the Public Library',
      description: 'Replace a My Library copy\'s content with the current public version it was saved from. Overwrites edits made to the copy; ask the user first if get_item says it is edited. The public item is never changed.',
      inputSchema: z.object({ id: z.string().describe('My Library id') }),
      annotations: { ...writeHints, destructiveHint: true, idempotentHint: true },
    }, async ({ id }) => {
      if (READ_ONLY) return fail('This library is read-only.');
      const pulled = pullUpstream(id);
      return pulled ? text(`Updated \`${pulled.id}\` from \`${pulled.extra?.forked_from}\`.`) : fail(`No My Library copy "${id}" with a public source.`);
    });

    server.registerTool('delete_my_prompt', {
      title: 'Delete a My Library prompt',
      description: 'Delete one of the user\'s own prompts. It removes the file; ask the user first.',
      inputSchema: z.object({ id: z.string().describe('My Library id') }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    }, async ({ id }) => {
      if (READ_ONLY) return fail('This library is read-only.');
      return myLibrary.delete(id) ? text(`Deleted \`${id}\`.`) : fail(`No My Library prompt "${id}".`);
    });
  }

  // ---------- MCP prompts ----------
  // Every library prompt would be ~2,200 slash commands; clients list them all.
  // So: one generic prompt that takes any id, plus the featured prompts and the
  // user's own by name.

  const inputArg = z.string().optional().describe('Your material or request, appended after the prompt');

  server.registerPrompt('library_prompt', {
    title: 'Use a library prompt',
    description: 'Any prompt, system prompt or agent from the library by id (find ids with search_library).',
    argsSchema: z.object({ id: z.string().describe('Library or My Library id'), input: inputArg }),
  }, ({ id, input }) => {
    const mine = !id.includes('/') ? myLibrary.get(id) : null;
    const item = mine ? null : readLibraryItem(id);
    const body = mine?.content ?? (item && item !== 'invalid' ? item.content : null);
    if (body == null) throw new Error(`No library item "${id}".`);
    return promptMessages(body, input);
  });

  const used = new Set(['library_prompt']);
  const uniqueName = (base: string) => {
    let name = base || 'prompt';
    for (let i = 2; used.has(name); i++) name = `${base}-${i}`;
    used.add(name);
    return name;
  };

  const featured = publicRows().filter(r =>
    r.tags.includes('featured') && (r.section === '4_Prompts' || r.section === '5_System_Prompts'));
  for (const r of featured) {
    server.registerPrompt(uniqueName(slug(path.basename(r.id))), {
      title: r.title.replace(/^[^\p{L}\p{N}]+/u, ''),
      description: `${keyOf(r.section)} › ${r.category} (featured)`,
      argsSchema: z.object({ input: inputArg }),
    }, ({ input }) => {
      const item = readLibraryItem(r.id);
      if (!item || item === 'invalid') throw new Error(`${r.id} is gone from the library.`);
      return promptMessages(item.content, input);
    });
  }

  for (const p of myLibrary.list()) {
    server.registerPrompt(uniqueName(`my-${p.id}`), {
      title: p.title,
      description: `My Library › ${p.category}`,
      argsSchema: z.object({ input: inputArg }),
    }, ({ input }) => {
      const fresh = myLibrary.get(p.id);
      if (!fresh) throw new Error(`My Library prompt "${p.id}" was deleted.`);
      return promptMessages(fresh.content, input);
    });
  }

  return server;
}

// A fresh instance per connection, from the factory, so My Library prompts
// registered above reflect the folder at connect time.
serveStdio(createServer, { onerror: err => console.error('[mcp]', err) });
console.error(`[mcp] promptbook ready: ${loadIndex()?.promptCount ?? 0} indexed items, My Library at ${process.env.MY_LIBRARY_DIR || 'site/my-library'}${READ_ONLY ? ' (read-only)' : ''}`);
