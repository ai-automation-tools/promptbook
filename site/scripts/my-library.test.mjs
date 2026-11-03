/**
 * Self-check for the My Library file store (lib/my-library.ts).
 *
 * Runs against a throwaway folder, never site/my-library.
 * Run: npm run test:my-library   (from site/)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import zlib from "node:zlib";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "my-library-test-"));
process.env.MY_LIBRARY_DIR = dir;
const { myLibrary, InvalidPromptError, PromptConflictError } = await import("../lib/my-library.ts");

try {
  assert.deepEqual(myLibrary.list(), []);

  const a = myLibrary.create({ title: "Code Review: Strict!", section: "4_Prompts", category: "Dev", subcategory: null, tags: ["x"], content: "Body A\n" });
  assert.match(a.id, /^code-review-strict-[0-9a-f]{6}$/);
  assert.ok(fs.existsSync(path.join(dir, `${a.id}.md`)));

  // Round-trips through the file, YAML-awkward title included
  const read = myLibrary.get(a.id);
  assert.equal(read.title, "Code Review: Strict!");
  assert.deepEqual(read.tags, ["x"]);
  assert.equal(read.content.trim(), "Body A");
  assert.equal(typeof read.updated_at, "string");

  // Same title twice is two prompts, not an overwrite
  const b = myLibrary.create({ title: "Code Review: Strict!", section: "4_Prompts", category: "Dev", subcategory: "Sub", tags: [], content: "Body B" });
  assert.notEqual(a.id, b.id);
  assert.equal(myLibrary.list().length, 2);

  // Update keeps the id (and file name) and what wasn't sent
  const updated = myLibrary.update(a.id, { title: "Renamed", subcategory: undefined });
  assert.equal(updated.id, a.id);
  assert.equal(updated.title, "Renamed");
  assert.equal(updated.content.trim(), "Body A");
  assert.equal(myLibrary.get(a.id).title, "Renamed");

  // Frontmatter the store does not manage survives create and update: a skill
  // without name/description will not load, and saves used to drop them.
  const skill = myLibrary.create({ title: "my-skill", section: "3_Skills", category: "Dev", subcategory: null, tags: [], content: "Do the thing.\n", extra: { name: "my-skill", description: "Use when testing." } });
  myLibrary.update(skill.id, { tags: ["edited"] });
  const skillRead = myLibrary.get(skill.id);
  assert.equal(skillRead.extra.name, "my-skill");
  assert.equal(skillRead.extra.description, "Use when testing.");
  assert.deepEqual(skillRead.tags, ["edited"]);
  assert.match(fs.readFileSync(path.join(dir, `${skill.id}.md`), "utf-8"), /^---\nname: my-skill\n/);
  myLibrary.delete(skill.id);

  // The source link round-trips, survives an update that doesn't send it, and clears with ""
  const linked = myLibrary.create({ title: "Linked", section: "4_Prompts", category: "Dev", subcategory: null, tags: [], content: "Body", sourceUrl: "https://github.com/f/awesome-chatgpt-prompts" });
  assert.match(fs.readFileSync(path.join(dir, `${linked.id}.md`), "utf-8"), /\nsource_url: '?https:\/\/github\.com\/f\/awesome-chatgpt-prompts'?\n/);
  myLibrary.update(linked.id, { tags: ["t"] });
  assert.equal(myLibrary.get(linked.id).sourceUrl, "https://github.com/f/awesome-chatgpt-prompts");
  assert.equal(myLibrary.get(linked.id).extra.source_url, undefined, "managed, not extra");
  myLibrary.update(linked.id, { sourceUrl: "" });
  assert.equal(myLibrary.get(linked.id).sourceUrl, null);
  assert.doesNotMatch(fs.readFileSync(path.join(dir, `${linked.id}.md`), "utf-8"), /source_url/);
  myLibrary.delete(linked.id);

  // Field checks, shared by HTTP and MCP: a refused write changes no file
  const valid = { title: "Ok", section: "4_Prompts", category: "Dev", subcategory: null, tags: [], content: "Body" };
  const badCreates = {
    "object category": { category: { a: 1 } },
    "number title": { title: 42 },
    "blank title": { title: "   " },
    "missing content": { content: undefined },
    "empty content": { content: " \t " },
    "unknown section": { section: "../etc" },
    "folder-less section": { section: "prompts" },
    "tags not a list": { tags: "a,b" },
    "non-text tag": { tags: ["ok", 7] },
    "empty tag": { tags: [""] },
    "too many tags": { tags: Array.from({ length: 51 }, (_, i) => `t${i}`) },
    "long title": { title: "t".repeat(301) },
    "long subcategory": { subcategory: "s".repeat(101) },
    "oversized content": { content: "x".repeat(500 * 1024 + 1) },
    "javascript source link": { sourceUrl: "javascript:alert(1)" },
    "non-URL source link": { sourceUrl: "github.com/x/y" },
  };
  const filesBefore = fs.readdirSync(dir).length;
  for (const [name, change] of Object.entries(badCreates)) {
    assert.throws(() => myLibrary.create({ ...valid, ...change }), InvalidPromptError, `create refuses ${name}`);
  }
  assert.equal(fs.readdirSync(dir).length, filesBefore, "no file written by a refused create");
  const aBefore = fs.readFileSync(path.join(dir, `${a.id}.md`), "utf-8");
  for (const change of [{ content: "" }, { title: "" }, { category: ["x"] }, { section: "Nope" }, { tags: [null] }]) {
    assert.throws(() => myLibrary.update(a.id, change), InvalidPromptError, `update refuses ${JSON.stringify(change)}`);
  }
  assert.equal(fs.readFileSync(path.join(dir, `${a.id}.md`), "utf-8"), aBefore, "a refused update leaves the file alone");
  const uni = myLibrary.create({ ...valid, title: "Résumé: 日本語 ✓", category: "Café", tags: ["naïve", "😀"], content: "Ünïcode body 🚀" });
  const uniRead = myLibrary.get(uni.id);
  assert.equal(uniRead.title, "Résumé: 日本語 ✓");
  assert.deepEqual(uniRead.tags, ["naïve", "😀"]);
  assert.equal(uniRead.content.trim(), "Ünïcode body 🚀");
  myLibrary.delete(uni.id);

  // Versions: two editors open v1; the first save wins, the stale one is refused
  const v = myLibrary.create({ ...valid, content: "v1 body" });
  const v1 = myLibrary.get(v.id).version;
  assert.equal(v.version, v1, "create returns the version a read sees");
  const saved = myLibrary.update(v.id, { content: "tab A" }, v1);
  assert.notEqual(saved.version, v1);
  assert.throws(() => myLibrary.update(v.id, { content: "tab B" }, v1), PromptConflictError, "stale writer refused");
  assert.equal(myLibrary.get(v.id).content.trim(), "tab A", "the first save survives");
  // A text editor changes the body but not `updated`: still a new version
  const vFile = path.join(dir, `${v.id}.md`);
  fs.writeFileSync(vFile, fs.readFileSync(vFile, "utf-8").replace("tab A", "hand edit"));
  assert.throws(() => myLibrary.update(v.id, { content: "tab A again" }, saved.version), PromptConflictError, "hand edit detected");
  assert.equal(myLibrary.update(v.id, { tags: ["no-version"] }).tags[0], "no-version", "no version given = no check");

  // Replacement is atomic: a failed rename leaves the old file whole and no temp behind
  const beforeCrash = fs.readFileSync(vFile, "utf-8");
  const realRename = fs.renameSync;
  fs.renameSync = () => { throw Object.assign(new Error("simulated crash"), { code: "EIO" }); };
  try {
    assert.throws(() => myLibrary.update(v.id, { content: "never lands" }), /simulated crash/);
  } finally {
    fs.renameSync = realRename;
  }
  assert.equal(fs.readFileSync(vFile, "utf-8"), beforeCrash, "old file intact after a failed write");
  assert.deepEqual(fs.readdirSync(dir).filter(n => n.endsWith(".tmp")), [], "temp file cleaned up");
  myLibrary.delete(v.id);

  // Ids can't climb out of the folder
  for (const bad of ["../x", "..\\x", "a/b", "A", ""]) {
    assert.equal(myLibrary.get(bad), null, bad);
    assert.equal(myLibrary.delete(bad), false, bad);
    assert.equal(myLibrary.update(bad, { title: "t" }), null, bad);
  }

  assert.equal(myLibrary.delete(b.id), true);
  assert.equal(myLibrary.delete(b.id), false);
  assert.equal(myLibrary.list().length, 1);

  // A copy tracks its public source: fresh is in sync, an edit is local, a pull
  // restores the public body. The public file itself is only ever read.
  const { forkExtra, upstreamStatus, pullUpstream } = await import("../lib/my-library.ts");
  const { readLibraryItem } = await import("../lib/library.ts");
  const pub = readLibraryItem("1_Guides/README.md");
  const pubBefore = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", "library", "1_Guides", "README.md"), "utf-8");
  const fork = myLibrary.create({ title: pub.title, section: pub.section, category: pub.category, subcategory: pub.subcategory, tags: [], content: pub.content, extra: forkExtra(pub) });
  assert.deepEqual(upstreamStatus(myLibrary.get(fork.id)), { source: pub.id, updateAvailable: false, localEdits: false });
  myLibrary.update(fork.id, { content: "my edit" });
  assert.deepEqual(upstreamStatus(myLibrary.get(fork.id)), { source: pub.id, updateAvailable: false, localEdits: true });
  // The public one moved on since the copy: simulated by an older base hash
  myLibrary.update(fork.id, { content: pub.content, extra: { forked_hash: "0000000000000000" } });
  assert.equal(upstreamStatus(myLibrary.get(fork.id)).updateAvailable, false, "same body is in sync whatever the base");
  myLibrary.update(fork.id, { content: "stale public body" });
  assert.deepEqual(upstreamStatus(myLibrary.get(fork.id)), { source: pub.id, updateAvailable: true, localEdits: true });
  const pulled = pullUpstream(fork.id);
  assert.equal(pulled.content.trim(), pub.content.trim());
  assert.deepEqual(upstreamStatus(pulled), { source: pub.id, updateAvailable: false, localEdits: false });
  assert.equal(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", "library", "1_Guides", "README.md"), "utf-8"), pubBefore, "public file untouched");
  assert.equal(pullUpstream(a.id), null, "no source, nothing to pull");
  myLibrary.delete(fork.id);
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}

// The trust boundary: a page on another site can't post into My Library, and a
// DNS-rebinding page (a foreign Host) can't reach the server at all.
process.env.ALLOWED_HOSTS = "my-pc, .tailnet.ts.net";
const { app } = await import("../api/index.ts");
const { default: skillPacksHandler, getAllPacks } = await import("../api/skill-packs.ts");
app.all(/^\/api\/skill-packs(\/|$)/, (req, res) => skillPacksHandler(req, res)); // as server.ts mounts it
const server = app.listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const copy = `${base}/api/prompts/${encodeURIComponent("1_Guides/README.md")}/copy-to-my-prompts`;
  const foreign = await fetch(copy, { method: "POST", headers: { Origin: "https://evil.example" } });
  assert.equal(foreign.status, 403, "cross-site write refused");
  const nullOrigin = await fetch(copy, { method: "POST", headers: { Origin: "null" } });
  assert.equal(nullOrigin.status, 403, "null-origin write refused");
  const sameSite = await fetch(copy, { method: "POST", headers: { Origin: base } });
  assert.notEqual(sameSite.status, 403, "same-origin write allowed");

  // fetch() won't send a custom Host header, so these go through node:http
  const port = server.address().port;
  const raw = (method, urlPath, headers = {}, body) => new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, method, path: urlPath, agent: false,
      headers: body ? { ...headers, "Content-Length": Buffer.byteLength(body) } : headers }, (res) => {
      res.resume();
      res.on("end", () => resolve(res.statusCode));
    });
    req.on("error", reject);
    req.end(body);
  });
  const json = { "Content-Type": "application/json" };
  assert.equal(await raw("GET", "/api/prompts?library=my", { Host: "evil.example" }), 403, "foreign Host refused on reads");
  assert.equal(await raw("POST", "/api/prompts", { Host: "evil.example:3010", ...json }, "{}"), 403, "foreign Host refused on writes");
  assert.equal(await raw("GET", "/api/skill-packs", { Host: "rebind.attacker.test" }), 403, "foreign Host refused on packs");
  for (const host of [`localhost:${port}`, `127.0.0.1:${port}`, `[::1]:${port}`, "192.168.1.20:3010", "app.localhost", "my-pc", "box.tailnet.ts.net"]) {
    assert.equal(await raw("GET", "/api/prompts?library=my", { Host: host }), 200, `trusted Host ${host}`);
  }

  // The store's field checks come back as 400s over HTTP
  const created = await fetch(`${base}/api/prompts`, { method: "POST", headers: json, body: JSON.stringify({ title: "Http", section: "4_Prompts", category: { x: 1 }, content: "b" }) });
  assert.equal(created.status, 400, "object category refused over HTTP");
  assert.match((await created.json()).error, /category must be text/);
  const good = await (await fetch(`${base}/api/prompts`, { method: "POST", headers: json, body: JSON.stringify({ title: "Http", section: "4_Prompts", category: "Dev", content: "kept" }) })).json();
  const emptied = await fetch(`${base}/api/prompts/${good.id}`, { method: "PUT", headers: json, body: JSON.stringify({ content: "" }) });
  assert.equal(emptied.status, 400, "empty content refused over HTTP");
  assert.equal(myLibrary.get(good.id).content.trim(), "kept");
  const stale = await fetch(`${base}/api/prompts/${good.id}`, { method: "PUT", headers: json, body: JSON.stringify({ content: "stale", version: "0000000000000000" }) });
  assert.equal(stale.status, 409, "stale version refused over HTTP");
  assert.equal((await stale.json()).current.content.trim(), "kept", "409 carries the saved version");
  const fresh = await (await fetch(`${base}/api/prompts/${good.id}`)).json();
  const ok = await fetch(`${base}/api/prompts/${good.id}`, { method: "PUT", headers: json, body: JSON.stringify({ content: "new", version: fresh.version }) });
  assert.equal(ok.status, 200, "current version accepted");
  myLibrary.delete(good.id);

  // Export and import: a mixed library round-trips byte for byte, a preview writes
  // nothing, conflicts are replaced only with the preview's token, and bad archives
  // (traversal, oversized or lying entries, not a ZIP) are refused whole.
  const { readZip } = await import("../lib/zip.ts");
  const zipOf = (entries) => { // a minimal ZIP writer, so the test can build hostile archives
    const locals = [], centrals = [];
    let offset = 0;
    for (const { name, data, deflate = true, claim } of entries) {
      const body = deflate ? zlib.deflateRawSync(data) : data;
      const size = claim ?? data.length, crc = zlib.crc32(data), n = Buffer.from(name);
      const head = (sig, len) => { const b = Buffer.alloc(len); b.writeUInt32LE(sig, 0); return b; };
      const l = head(0x04034b50, 30);
      l.writeUInt16LE(deflate ? 8 : 0, 8); l.writeUInt32LE(crc, 14); l.writeUInt32LE(body.length, 18); l.writeUInt32LE(size, 22); l.writeUInt16LE(n.length, 26);
      const c = head(0x02014b50, 46);
      c.writeUInt16LE(deflate ? 8 : 0, 10); c.writeUInt32LE(crc, 16); c.writeUInt32LE(body.length, 20); c.writeUInt32LE(size, 24); c.writeUInt16LE(n.length, 28); c.writeUInt32LE(offset, 42);
      locals.push(l, n, body); centrals.push(c, n);
      offset += 30 + n.length + body.length;
    }
    const cd = Buffer.concat(centrals), end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
    return Buffer.concat([...locals, cd, end]);
  };
  const snapshot = () => Object.fromEntries(fs.readdirSync(dir).filter(n => n.endsWith(".md")).map(n => [n, fs.readFileSync(path.join(dir, n))]));
  const importZip = (zip, query = "") => fetch(`${base}/api/my-library/import${query}`, { method: "POST", headers: { "Content-Type": "application/zip" }, body: zip });

  const valid = { section: "4_Prompts", category: "Dev", subcategory: null, tags: [], content: "b" };
  for (const p of myLibrary.list()) myLibrary.delete(p.id);
  myLibrary.create({ ...valid, title: "Résumé: 日本語 ✓ — \"quoted\" #1", category: "Café", tags: ["naïve", "😀", "skill-pack:x"], content: "Ünïcode body 🚀\n" });
  myLibrary.create({ ...valid, title: "my-skill", section: "3_Skills", tags: [], content: "Do it.\n", extra: { name: "my-skill", description: "Use when: testing", license: "MIT", upstream: { repo: "o/r", checked: "2026-10-31" } } });
  myLibrary.create({ ...valid, title: "Long", content: "long line of text ".repeat(25000) + "\n" }); // ~450 KB
  fs.writeFileSync(path.join(dir, "hand-written.md"), "---\nzeta: 1\ntitle: By hand\ncategory: Dev\nsection: 4_Prompts\n---\r\nCRLF body\r\n");
  const original = snapshot();
  assert.equal(Object.keys(original).length, 4);

  const exported = await fetch(`${base}/api/my-library/export`);
  assert.equal(exported.status, 200);
  assert.match(exported.headers.get("content-disposition"), /my-library-\d{4}-\d{2}-\d{2}\.zip/);
  const zip = Buffer.from(await exported.arrayBuffer());
  const inZip = readZip(zip, { maxEntries: 10, maxEntryBytes: 600 * 1024 });
  assert.deepEqual(inZip.map(e => e.name).sort(), Object.keys(original).sort(), "every file exported");
  for (const e of inZip) assert.ok(e.data.equals(original[e.name]), `${e.name} exported byte for byte`);

  const same = await (await importZip(zip)).json();
  assert.equal(same.unchanged.length, 4, "re-importing the same library changes nothing");
  assert.deepEqual([same.added.length, same.conflicts.length, same.skipped.length], [0, 0, 0]);

  for (const n of Object.keys(original)) fs.unlinkSync(path.join(dir, n));
  const preview = await (await importZip(zip)).json();
  assert.equal(preview.added.length, 4, "an emptied library would get all four back");
  assert.deepEqual(snapshot(), {}, "a preview (a cancelled import) writes nothing");
  const applied = await (await importZip(zip, "?apply=true")).json();
  assert.equal(applied.written, 4);
  const restored = snapshot();
  assert.deepEqual(Object.keys(restored).sort(), Object.keys(original).sort());
  for (const n of Object.keys(original)) assert.ok(restored[n].equals(original[n]), `${n} round-trips byte for byte`);
  assert.equal(myLibrary.list().find(p => p.title === "my-skill").extra.upstream.repo, "o/r", "extra frontmatter survives");

  // Conflicts: kept by default, replaced only with the token of the preview that showed them
  const handFile = path.join(dir, "hand-written.md");
  fs.writeFileSync(handFile, "---\ntitle: Edited here\ncategory: Dev\nsection: 4_Prompts\n---\nmine\n");
  const conflictPlan = await (await importZip(zip)).json();
  assert.deepEqual(conflictPlan.conflicts, [{ id: "hand-written", title: "By hand", currentTitle: "Edited here" }]);
  assert.equal(conflictPlan.unchanged.length, 3);
  const kept = await (await importZip(zip, "?apply=true")).json();
  assert.equal(kept.written, 0, "no token: the conflict is skipped");
  assert.match(fs.readFileSync(handFile, "utf-8"), /mine/, "local file kept");
  assert.equal((await importZip(zip, "?apply=true&overwrite=0000000000000000")).status, 409, "a made-up token is refused");
  fs.writeFileSync(handFile, "---\ntitle: Edited again\ncategory: Dev\nsection: 4_Prompts\n---\nmine 2\n");
  assert.equal((await importZip(zip, `?apply=true&overwrite=${conflictPlan.token}`)).status, 409, "the file changed after the preview: refused");
  assert.match(fs.readFileSync(handFile, "utf-8"), /mine 2/);
  const fresh2 = await (await importZip(zip)).json();
  const replaced = await (await importZip(zip, `?apply=true&overwrite=${fresh2.token}`)).json();
  assert.equal(replaced.written, 1);
  assert.ok(fs.readFileSync(handFile).equals(original["hand-written.md"]), "replaced with the zip's file");

  // Entries that are not prompt files are skipped and named; the rest still import
  const mixed = zipOf([
    { name: "notes/readme.txt", data: Buffer.from("x") },
    { name: "Bad Name.md", data: Buffer.from("---\ntitle: t\n---\nb") },
    { name: "bad-section.md", data: Buffer.from("---\ntitle: t\nsection: Nope\n---\nb") },
    { name: "not-utf8.md", data: Buffer.from([0xff, 0xfe, 0x00]) },
    { name: "good-one.md", data: Buffer.from("---\ntitle: Good\ncategory: Dev\n---\nbody\n"), deflate: false },
  ]);
  const mixedPlan = await (await importZip(mixed)).json();
  assert.deepEqual(mixedPlan.added.map(a => a.id), ["good-one"]);
  assert.deepEqual(mixedPlan.skipped.map(s => s.name), ["notes/readme.txt", "Bad Name.md", "bad-section.md", "not-utf8.md"]);
  assert.match(mixedPlan.skipped[2].reason, /section must be one of/);
  assert.match(mixedPlan.skipped[3].reason, /UTF-8/);

  // Hostile archives are refused whole: nothing from them is written anywhere
  const before = snapshot();
  const hostile = {
    "traversal": zipOf([{ name: "ok.md", data: Buffer.from("---\ntitle: t\n---\nb") }, { name: "../evil.md", data: Buffer.from("---\ntitle: t\n---\nb") }]),
    "nested traversal": zipOf([{ name: "a/../../evil.md", data: Buffer.from("b") }]),
    "absolute path": zipOf([{ name: "/evil.md", data: Buffer.from("b") }]),
    "drive path": zipOf([{ name: "C:evil.md", data: Buffer.from("b") }]),
    "backslash": zipOf([{ name: "..\\evil.md", data: Buffer.from("b") }]),
    "oversized entry": zipOf([{ name: "big.md", data: Buffer.alloc(700 * 1024, 97) }]),
    "entry lying about its size": zipOf([{ name: "bomb.md", data: Buffer.alloc(5 * 1024 * 1024, 97), claim: 10 }]),
    "not a zip": Buffer.from("just text, no archive"),
  };
  for (const [what, body] of Object.entries(hostile)) {
    const res = await importZip(body, "?apply=true");
    assert.equal(res.status, 400, `${what} refused`);
    assert.ok((await res.json()).error, `${what} says why`);
  }
  assert.deepEqual(Object.keys(snapshot()).sort(), Object.keys(before).sort(), "no hostile archive wrote a file");
  assert.ok(!fs.existsSync(path.join(dir, "..", "evil.md")), "nothing written outside the folder");
  assert.equal(await raw("POST", "/api/my-library/import?apply=true", { Origin: "https://evil.example", "Content-Type": "application/zip" }, zip), 403, "cross-site import refused");
  for (const p of myLibrary.list()) myLibrary.delete(p.id);

  // Pack writes go through the same Origin check as prompt writes
  const [pack] = await getAllPacks();
  const confirm = JSON.stringify({ confirm: true });
  const addPath = `/api/skill-packs/${encodeURIComponent(pack.id)}/add-to-library`;
  const removePath = `/api/skill-packs/${encodeURIComponent(pack.id)}/remove-from-library`;
  assert.equal(await raw("POST", addPath, { Origin: "https://evil.example", ...json }, confirm), 403, "cross-site pack add refused");
  assert.equal(await raw("DELETE", removePath, { Origin: "https://evil.example", ...json }, confirm), 403, "cross-site pack remove refused");
  assert.equal(await raw("POST", addPath, { Origin: base, ...json }, confirm), 200, "same-origin pack add allowed");
  assert.ok(myLibrary.list().some(p => p.tags.includes(`skill-pack:${pack.id}`)), "pack installed");
  assert.equal(await raw("DELETE", removePath, { Origin: base, ...json }, confirm), 200, "same-origin pack remove allowed");

  // A pack install that fails part-way takes back what it wrote; a retry adds each skill once
  const big = (await getAllPacks()).find(p => p.skills.length >= 2);
  const bigAdd = `/api/skill-packs/${encodeURIComponent(big.id)}/add-to-library`;
  const countBefore = myLibrary.list().length;
  const realCreate = myLibrary.create;
  let calls = 0;
  myLibrary.create = (f) => { if (++calls === 2) throw new Error("simulated failure"); return realCreate(f); };
  try {
    assert.equal(await raw("POST", bigAdd, { Origin: base, ...json }, confirm), 500, "failed install reports failure");
  } finally {
    myLibrary.create = realCreate;
  }
  assert.equal(myLibrary.list().length, countBefore, "nothing left behind by the failed install");
  assert.equal(await raw("POST", bigAdd, { Origin: base, ...json }, confirm), 200, "retry succeeds");
  const installed = myLibrary.list().filter(p => p.tags.includes(`skill-pack:${big.id}`));
  assert.equal(new Set(installed.map(p => p.title)).size, installed.length, "no duplicates after the retry");
  for (const p of installed) myLibrary.delete(p.id);
} finally {
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log("my-library: file store round-trips, updates in place, rejects path ids, bad fields and stale versions, writes atomically, rolls back failed pack installs, exports and re-imports byte for byte (conflicts only with the preview token, hostile ZIPs refused), refuses cross-site writes (packs too) and foreign Hosts");
