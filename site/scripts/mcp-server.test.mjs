/**
 * End-to-end check of the MCP server (mcp/server.ts) over real stdio.
 *
 *   npm run test:mcp        # from site/
 *
 * Spawns the server twice with the SDK client: once writable (My Library in a
 * temp folder, so nothing real is touched) and once with READ_ONLY=true. A
 * handshake that succeeds also proves nothing else wrote to stdout. Exits 1 on
 * the first failure.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TSX = path.join(SITE, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const index = JSON.parse(fs.readFileSync(path.join(SITE, 'api', 'prompt-index.json'), 'utf-8'));

async function connect(env) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [TSX, 'mcp/server.ts'],
    cwd: SITE,
    env: { ...process.env, ...env },
    stderr: 'pipe',
  });
  transport.stderr?.on('data', () => {}); // keep the pipe drained
  const client = new Client({ name: 'mcp-server-test', version: '1.0.0' });
  await client.connect(transport);
  return client;
}

const textOf = (r) => r.content.map((c) => c.text ?? '').join('\n');
const call = async (client, name, args = {}) => client.callTool({ name, arguments: args });
const ok = async (client, name, args) => {
  const r = await call(client, name, args);
  assert.ok(!r.isError, `${name} failed: ${textOf(r)}`);
  return textOf(r);
};
const refused = async (client, name, args) => {
  const r = await call(client, name, args);
  // Never echo what came back: a broken guard returns the file it should not
  // have read (in development that can be site/.env).
  assert.ok(r.isError, `${name} should have refused ${JSON.stringify(args)}; it returned ${textOf(r).length} characters instead`);
};

// A skill that has support files, found on disk so the test follows the library.
const skillsRoot = path.join(SITE, 'library', '3_Skills');
function findSkillWithFiles(dir = skillsRoot) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory() || e.name === 'packs') continue;
    if (fs.existsSync(path.join(p, 'SKILL.md'))) {
      const extra = fs.readdirSync(p, { withFileTypes: true }).find((f) => f.isFile() && f.name !== 'SKILL.md' && /\.(md|txt|py|js|ts|json)$/.test(f.name));
      if (extra) return { dir: path.relative(path.join(SITE, 'library'), p).split(path.sep).join('/'), file: extra.name };
    } else {
      const found = findSkillWithFiles(p);
      if (found) return found;
    }
  }
  return null;
}

// The server keeps its own section list (lib/library.ts) so it never imports the
// React app. Fail here if a section is added to the app without the server.
const appFolders = [...fs.readFileSync(path.join(SITE, 'src', 'lib', 'sections.ts'), 'utf-8').matchAll(/folder: '(\d_[A-Za-z_]+)'/g)].map((m) => m[1]).sort();
const serverFolders = [...fs.readFileSync(path.join(SITE, 'lib', 'library.ts'), 'utf-8').matchAll(/folder: '(\d_[A-Za-z_]+)'/g)].map((m) => m[1]).sort();
assert.ok(appFolders.length >= 6, `found the app's sections (${appFolders.length})`);
assert.deepEqual(serverFolders, appFolders, 'lib/library.ts SECTIONS must list the same folders as src/lib/sections.ts');

// ---------- declared prompt inputs (O03) ----------
const { declaredInputs, fillInputs } = await import('../lib/prompt-inputs.ts');
{
  const body = 'Teach [topic] to [target audience]. Skip [N] tips, keep [dict] and [link](x).';
  const { inputs, problems } = declaredInputs({ inputs: ['topic', { name: 'target audience', description: 'Who reads it' }, 'missing', 'input', '../x'] }, body);
  assert.deepEqual(inputs.map((i) => i.arg), ['topic', 'target_audience']);
  assert.equal(inputs[1].description, 'Who reads it');
  assert.equal(problems.length, 3, 'names not in the body (missing, input) and a malformed one are dropped');
  assert.equal(declaredInputs({ inputs: 'topic' }, body).problems.length, 1, 'a non-list is refused');
  assert.equal(declaredInputs({}, body).inputs.length, 0, 'no declaration, no inputs');
  const out = fillInputs(body, inputs, { topic: 'Rust [target audience] $& ${x}', target_audience: 'beginners' });
  assert.equal(out, 'Teach Rust [target audience] $& ${x} to beginners. Skip [N] tips, keep [dict] and [link](x).',
    'one literal pass: values are not filled again, $ patterns stay, undeclared brackets stay');
  assert.match(declaredInputs({ inputs: ['input'] }, 'use [input]').problems[0], /clashes/);
}
// Every declaration in the library must be valid, so a typo fails CI instead of silently dropping.
for (const e of index.prompts.filter((p) => p.inputs)) {
  const raw = fs.readFileSync(path.join(SITE, 'library', e.id), 'utf-8');
  const matter = (await import('gray-matter')).default(raw);
  assert.deepEqual(declaredInputs(matter.data, matter.content).problems, [], `${e.id}: inputs`);
}
const withInputs = index.prompts.find((p) => p.inputs && p.section === '4_Prompts');
assert.ok(withInputs, 'the library has a prompt that declares inputs');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-my-library-'));
// A My Library prompt with inputs, there before connect (My Library prompts are registered then).
fs.writeFileSync(path.join(tmp, 'brief-abc123.md'), ['---', 'title: Brief', 'section: 4_Prompts', 'category: Test', 'subcategory: null',
  'tags: []', 'inputs: [audience]', "created: '2026-10-27T00:00:00.000Z'", "updated: '2026-10-27T00:00:00.000Z'", '---', '', 'Write for [audience].', ''].join('\n'));
let client;
try {
  // ---------- writable ----------
  client = await connect({ MY_LIBRARY_DIR: tmp, READ_ONLY: 'false', VERCEL: '', IMPORT_ROOTS: '' });

  const listed = (await client.listTools()).tools;
  const tools = listed.map((t) => t.name).sort();
  // Every write tool says whether it can lose data; the ones that overwrite or delete say so.
  const destructive = { save_to_my_library: false, update_my_prompt: true, update_from_public: true, delete_my_prompt: true };
  for (const [name, hint] of Object.entries(destructive)) {
    const a = listed.find((t) => t.name === name)?.annotations;
    assert.equal(a?.readOnlyHint, false, `${name} readOnlyHint`);
    assert.equal(a?.destructiveHint, hint, `${name} destructiveHint`);
  }
  assert.deepEqual(tools, [
    'delete_my_prompt', 'get_item', 'get_skill', 'get_skill_file', 'get_skill_pack', 'list_categories',
    'list_sections', 'list_skill_packs', 'save_to_my_library', 'search_library', 'update_from_public', 'update_my_prompt',
  ]);

  const search = await ok(client, 'search_library', { query: 'code review', section: 'prompts', limit: 5 });
  assert.match(search, /result/);
  assert.match(search, /`4_Prompts\//);
  assert.match(await ok(client, 'search_library', { section: 'mcp-servers', limit: 50 }), /6_MCP_Servers\//);

  const agent = index.prompts.find((p) => p.section === '2_Agents');
  assert.ok(agent, 'index has an agent');
  assert.match(await ok(client, 'get_item', { id: agent.id }), new RegExp(agent.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await refused(client, 'get_item', { id: '../../.env' });
  await refused(client, 'get_item', { id: '4_Prompts/../../package.json' });
  await refused(client, 'get_item', { id: '4_Prompts/does-not-exist.md' });

  assert.match(await ok(client, 'list_sections'), /MCP Servers/);
  assert.match(await ok(client, 'list_categories', { section: 'skills' }), /Development/);

  const skill = findSkillWithFiles();
  assert.ok(skill, 'library has a skill with a support file');
  const skillText = await ok(client, 'get_skill', { id: skill.dir });
  assert.match(skillText, /Support files/);
  assert.ok(skillText.includes(skill.file), 'get_skill lists the support file');
  await ok(client, 'get_skill_file', { skill: skill.dir, path: skill.file });
  await refused(client, 'get_skill_file', { skill: skill.dir, path: '../../../../../.env' });
  await refused(client, 'get_skill_file', { skill: skill.dir, path: '../../../../api/index.ts' });
  await refused(client, 'get_skill', { id: '4_Prompts/Awesome_ChatGPT' });
  await refused(client, 'get_skill', { id: '3_Skills/../../api' });

  assert.match(await ok(client, 'list_skill_packs'), /developer-essentials-pack/);
  assert.match(await ok(client, 'get_skill_pack', { id: 'developer-essentials-pack' }), /3_Skills\//);
  await refused(client, 'get_skill_pack', { id: 'no-such-pack' });

  const prompts = (await client.listPrompts()).prompts.map((p) => p.name);
  assert.ok(prompts.includes('library_prompt'), 'library_prompt is listed');
  assert.ok(prompts.length > 1, 'featured prompts are listed');
  const libPrompt = index.prompts.find((p) => p.section === '4_Prompts');
  const got = await client.getPrompt({ name: 'library_prompt', arguments: { id: libPrompt.id, input: 'MY-INPUT-MARKER' } });
  assert.match(got.messages[0].content.text, /MY-INPUT-MARKER/);

  // Declared inputs are required named arguments, filled in place; `input` still appends.
  const listedPrompts = (await client.listPrompts()).prompts;
  const named = listedPrompts.find((p) => p.arguments?.some((a) => a.name === 'topic'));
  assert.ok(named, `${withInputs.id} is listed with a topic argument`);
  assert.equal(named.arguments.find((a) => a.name === 'topic').required, true, 'a declared input is required');
  assert.equal(named.arguments.find((a) => a.name === 'input').required, false, 'input stays optional');
  const filledIn = (await client.getPrompt({ name: named.name, arguments: { topic: 'TOPIC-MARKER', input: 'EXTRA' } })).messages[0].content.text;
  assert.match(filledIn, /TOPIC-MARKER/);
  assert.doesNotMatch(filledIn, /\[topic\]/);
  assert.match(filledIn, /---\n\nEXTRA$/);
  await assert.rejects(client.getPrompt({ name: named.name, arguments: {} }), 'a missing required input is refused');
  const mine = listedPrompts.find((p) => p.name.startsWith('my-brief'));
  assert.equal(mine?.arguments?.find((a) => a.name === 'audience')?.required, true, 'My Library prompts get their inputs too');
  assert.equal((await client.getPrompt({ name: mine.name, arguments: { audience: 'CFOs' } })).messages[0].content.text, 'Write for CFOs.');

  // My Library round trip, in the temp folder
  const saved = await ok(client, 'save_to_my_library', { id: libPrompt.id });
  const myId = saved.match(/`([a-z0-9-]+)`/)?.[1];
  assert.ok(myId, `save returned an id: ${saved}`);
  assert.equal(fs.readdirSync(tmp).filter((f) => f !== 'brief-abc123.md').length, 1, 'one file written to MY_LIBRARY_DIR');
  await refused(client, 'save_to_my_library', { id: libPrompt.id }); // duplicate
  await refused(client, 'save_to_my_library', { title: 'no content' });
  assert.match(await ok(client, 'search_library', { library: 'my' }), new RegExp(myId));
  await ok(client, 'update_my_prompt', { id: myId, content: 'UPDATED-BODY' });
  await refused(client, 'update_my_prompt', { id: myId, content: '' }); // the store's field check, as over HTTP
  await refused(client, 'update_my_prompt', { id: myId, content: 'STALE', version: '0000000000000000' }); // changed since that version
  assert.match(await ok(client, 'get_item', { id: myId }), /UPDATED-BODY/);
  const fresh = await ok(client, 'save_to_my_library', { title: 'Fresh prompt', content: 'Hello', section: 'prompts', tags: ['t1'], source_url: 'https://github.com/owner/repo' });
  assert.match(fresh, /Saved to My Library/);
  const freshId = fresh.match(/`([a-z0-9-]+)`/)?.[1];
  assert.match(await ok(client, 'get_item', { id: freshId }), /source: https:\/\/github\.com\/owner\/repo/);
  await refused(client, 'update_my_prompt', { id: freshId, source_url: 'javascript:alert(1)' });
  await ok(client, 'update_my_prompt', { id: freshId, source_url: '' });
  assert.doesNotMatch(await ok(client, 'get_item', { id: freshId }), /source:/);
  // A skill keeps its frontmatter through save, edit and read-back.
  const skillSaved = await ok(client, 'save_to_my_library', {
    title: 'test-skill', section: 'skills', category: 'Development', tags: ['t'],
    content: '---\nname: test-skill\ndescription: Use when testing the MCP server.\n---\n\n# Test skill\n\nDo it.\n',
  });
  const skillId = skillSaved.match(/`([a-z0-9-]+)`/)?.[1];
  await ok(client, 'update_my_prompt', { id: skillId, tags: ['t', 'edited'] });
  const skillBack = await ok(client, 'get_item', { id: skillId });
  assert.match(skillBack, /name: test-skill/, 'skill name survives an edit');
  assert.match(skillBack, /description: Use when testing the MCP server\./, 'skill description survives an edit');

  // Copying a Public Library skill carries its name and description too.
  const libSkill = index.prompts.find((p) => p.section === '3_Skills' && p.id.endsWith('/SKILL.md'));
  const copied = await ok(client, 'save_to_my_library', { id: libSkill.id });
  const copiedId = copied.match(/`([a-z0-9-]+)`/)?.[1];
  assert.match(await ok(client, 'get_item', { id: copiedId }), /\nname: /, 'copied skill keeps its name');
  await ok(client, 'delete_my_prompt', { id: skillId });
  await ok(client, 'delete_my_prompt', { id: copiedId });

  await ok(client, 'delete_my_prompt', { id: myId });
  await refused(client, 'get_item', { id: myId });
  await refused(client, 'delete_my_prompt', { id: '../escape' });
  await client.close();

  // ---------- file import ----------
  // Off unless IMPORT_ROOTS is set; inside a root, the server reads the file so a long
  // body never travels through the tool call; outside one, or not markdown, it refuses.
  const importRoot = path.join(tmp, 'import-root');
  fs.mkdirSync(importRoot);
  const skillFile = path.join(importRoot, 'SKILL.md');
  fs.writeFileSync(skillFile, '---\nname: file-skill\ndescription: Use when testing file import.\n---\n\n# File skill\n\nFILE-BODY-V1\n');
  const outside = path.join(tmp, 'outside.md');
  fs.writeFileSync(outside, 'secret');
  client = await connect({ MY_LIBRARY_DIR: tmp, READ_ONLY: 'false', VERCEL: '', IMPORT_ROOTS: '' });
  await refused(client, 'save_to_my_library', { title: 'off', file: skillFile });
  await client.close();
  client = await connect({ MY_LIBRARY_DIR: tmp, READ_ONLY: 'false', VERCEL: '', IMPORT_ROOTS: importRoot });
  await refused(client, 'save_to_my_library', { title: 'outside', file: outside });
  await refused(client, 'save_to_my_library', { title: 'climb', file: path.join(importRoot, '..', 'outside.md') });
  await refused(client, 'save_to_my_library', { file: skillFile }); // no title
  const imported = await ok(client, 'save_to_my_library', {
    title: 'file-skill', section: 'skills', category: 'Development', file: skillFile, content: '> Source: test',
  });
  const importedId = imported.match(/as `([a-z0-9-]+)`/)?.[1];
  const importedBack = await ok(client, 'get_item', { id: importedId });
  assert.match(importedBack, /> Source: test/, 'content is kept as a preface');
  assert.match(importedBack, /FILE-BODY-V1/, 'file body imported');
  assert.match(importedBack, /description: Use when testing file import\./, 'file frontmatter kept');
  fs.writeFileSync(skillFile, '---\nname: file-skill\ndescription: Changed description.\n---\n\nFILE-BODY-V2\n');
  await ok(client, 'update_my_prompt', { id: importedId, file: skillFile, content: '> Source: test' });
  const updatedBack = await ok(client, 'get_item', { id: importedId });
  assert.match(updatedBack, /FILE-BODY-V2/, 'update re-reads the file');
  assert.doesNotMatch(updatedBack, /FILE-BODY-V1/);
  assert.match(updatedBack, /description: Changed description\./, 'update takes the new frontmatter');
  await refused(client, 'update_my_prompt', { id: importedId, file: outside });
  await ok(client, 'delete_my_prompt', { id: importedId });
  await client.close();

  // ---------- read-only ----------
  client = await connect({ MY_LIBRARY_DIR: tmp, READ_ONLY: 'true' });
  const roTools = (await client.listTools()).tools.map((t) => t.name);
  for (const w of ['save_to_my_library', 'update_my_prompt', 'update_from_public', 'delete_my_prompt']) {
    assert.ok(!roTools.includes(w), `${w} must not be offered read-only`);
  }
  await ok(client, 'search_library', { query: 'git' });
  await client.close();
  client = null;

  console.log('mcp-server: 11 tools, prompts (with declared inputs), traversal refusals, My Library round trip and read-only mode all pass');
} catch (err) {
  console.error('mcp-server test FAILED:', err?.message ?? err);
  process.exitCode = 1;
} finally {
  await client?.close().catch(() => {});
  fs.rmSync(tmp, { recursive: true, force: true });
}
