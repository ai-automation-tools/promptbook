/**
 * Self-check for READ_ONLY: the server serves the Public Library only, so a
 * personal prompt in MY_LIBRARY_DIR is never listed, served or counted.
 *
 * READ_ONLY is read once at import, which is why this is its own process.
 * Runs against a throwaway folder, never site/my-library.
 * Run: npm run test:read-only   (from site/)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "read-only-test-"));
process.env.MY_LIBRARY_DIR = dir;
process.env.READ_ONLY = "true";

const { myLibrary, READ_ONLY } = await import("../lib/my-library.ts");
const { app } = await import("../api/index.ts");
const { default: skillPacksHandler, getAllPacks } = await import("../api/skill-packs.ts");
assert.equal(READ_ONLY, true);

// Seed straight through the store (the HTTP writes are refused in this mode)
const [pack] = await getAllPacks();
const secret = myLibrary.create({
  title: "Private Notes", section: "4_Prompts", category: "Dev", subcategory: null,
  tags: [`skill-pack:${pack.id}`], content: "PRIVATE-BODY\n",
});
assert.ok(myLibrary.get(secret.id), "seeded prompt exists on disk");

app.all(/^\/api\/skill-packs(\/|$)/, (req, res) => skillPacksHandler(req, res));
const server = app.listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
const get = (p) => fetch(base + p);

try {
  // Private reads: nothing comes back
  for (const q of ["?library=my", "?library=my&lightweight=true"]) {
    const res = await get(`/api/prompts${q}`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), [], `My Library list ${q} is empty`);
  }
  const detail = await get(`/api/prompts/${secret.id}`);
  assert.ok(!detail.ok, `My Library detail is not served (got ${detail.status})`);
  assert.doesNotMatch(await detail.text(), /PRIVATE-BODY/);
  const packs = await get("/api/skill-packs?library=my");
  assert.deepEqual(await packs.json(), [], "installed packs are not disclosed");

  // Public reads still work
  const list = await (await get("/api/prompts?library=public&lightweight=true")).json();
  assert.ok(list.length > 0, "public list");
  // O02: the prebuilt index (lightweight) and the live walk (full) agree on `checked` and
  // `inputs`, and every copied item carries its check date.
  const full = await (await get("/api/prompts?library=public")).json();
  const pick = (rows) => Object.fromEntries(rows.map((p) => [p.id, JSON.stringify([p.checked, p.inputs])]));
  assert.deepEqual(pick(list), pick(full), "index and walk give the same checked and inputs");
  const agents = list.filter((p) => p.section === "2_Agents");
  assert.ok(agents.length && agents.every((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.checked)), "every agent has its upstream.checked date");
  const { isStale } = await import("../src/lib/freshness.ts");
  const now = Date.parse("2026-10-27");
  assert.equal(isStale("2026-07-29", now), false, "90 days is not stale");
  assert.equal(isStale("2026-07-28", now), true, "91 days is");
  assert.equal(isStale(undefined, now), false, "undated is not stale");
  assert.equal((await get(`/api/prompts/${encodeURIComponent("1_Guides/README.md")}`)).status, 200, "public detail");
  const zip = await get(`/api/skills/download/${encodeURIComponent("3_Skills/Business/copy-editing")}`);
  assert.equal(zip.status, 200, "public skill download");
  // A ZIP stores entry names uncompressed, so the licence's name shows in the bytes. A skill
  // ZIP's entries sit at its root, a pack's under each skill's folder.
  const hasLicense = (bytes, dir = "") => new RegExp(`${dir && `${dir}[/\\\\]`}LICENSE`).test(bytes.toString("latin1"));
  assert.ok(hasLicense(Buffer.from(await zip.arrayBuffer())), "a skill ZIP carries its LICENSE");
  const publicPacks = await (await get("/api/skill-packs")).json();
  assert.ok(publicPacks.length > 0, "public pack list");
  // F17: every pack ZIP carries each of its skills' licences (upstream.test.mjs puts one beside every SKILL.md).
  for (const p of await getAllPacks()) {
    const bytes = Buffer.from(await (await get(`/api/skill-packs/${p.id}/download`)).arrayBuffer());
    for (const s of p.skills) {
      const dir = s.path.split("/").at(-2);
      assert.ok(hasLicense(bytes, dir), `${p.id}.zip carries ${dir}/LICENSE`);
    }
  }
} finally {
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log("read-only: My Library list, detail and pack membership hidden; public list, detail, download and packs served");
