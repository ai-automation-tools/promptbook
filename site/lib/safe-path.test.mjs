// Self-check for resolveInside() and filesUnder(). Run: npx tsx lib/safe-path.test.mjs (from site/)
//
// The link cases make real directory junctions (symlinks on Linux) that point
// outside the library, the shape a string-only check can't see. Two of them are
// made inside site/library/3_Skills for the HTTP checks and always removed after.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { filesUnder, resolveInside } from "./safe-path.ts";

const root = path.resolve("library");
const inside = (p) => resolveInside(root, p) !== null;

// Allowed
assert.ok(inside("3_Skills/AI_ML/gemini"));
assert.ok(inside("1_Guides/API_Providers/anthropic-api-guide.md"));
assert.ok(inside("3_Skills/../3_Skills/AI_ML"), "in-bounds .. is fine");
assert.equal(resolveInside(root, "3_Skills"), path.join(root, "3_Skills"));
assert.ok(inside("3_Skills/does-not-exist/SKILL.md"), "a missing path keeps the string check");

// Rejected — these are the shapes that got past the old startsWith() guard
assert.ok(!inside("3_Skills/../../db"), "the confirmed exploit");
assert.ok(!inside("../package.json"));
assert.ok(!inside("../.env"));
assert.ok(!inside("3_Skills/../../../../../../etc/passwd"));
assert.ok(!inside(path.resolve("/etc/passwd")), "absolute path escapes");
assert.ok(!inside("../library-other"), "sibling prefix is not containment");

// ---------- links pointing out ----------
const outside = fs.mkdtempSync(path.join(os.tmpdir(), "safe-path-outside-"));
fs.writeFileSync(path.join(outside, "SKILL.md"), "---\nname: leaked\n---\nOUTSIDE-SECRET\n");
fs.writeFileSync(path.join(outside, "secret.txt"), "OUTSIDE-SECRET\n");
const link = (target, at) => fs.symlinkSync(target, at, "junction"); // "junction" is ignored off Windows
const unlink = (at) => { try { fs.unlinkSync(at); } catch { try { fs.rmdirSync(at); } catch { /* gone */ } } };

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "safe-path-root-"));
fs.mkdirSync(path.join(sandbox, "skill"));
fs.writeFileSync(path.join(sandbox, "skill", "SKILL.md"), "inside\n");
link(outside, path.join(sandbox, "skill", "out"));
assert.equal(resolveInside(sandbox, "skill/out"), null, "a junction out is refused");
assert.equal(resolveInside(sandbox, "skill/out/secret.txt"), null, "a file through a junction out is refused");
assert.ok(resolveInside(sandbox, "skill/SKILL.md"), "a plain file beside it is fine");
assert.deepEqual(filesUnder(path.join(sandbox, "skill")).map((p) => path.basename(p)), ["SKILL.md"], "walks skip links");
let fileLinks = true;
try { fs.symlinkSync(path.join(outside, "secret.txt"), path.join(sandbox, "skill", "file-link.txt"), "file"); }
catch { fileLinks = false; } // Windows without Developer Mode can't make file symlinks
if (fileLinks) {
  assert.equal(resolveInside(sandbox, "skill/file-link.txt"), null, "a file symlink out is refused");
  assert.deepEqual(filesUnder(path.join(sandbox, "skill")).map((p) => path.basename(p)), ["SKILL.md"]);
}

// ---------- over HTTP: detail, ZIP, packs ----------
process.env.MY_LIBRARY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "safe-path-my-"));
process.env.READ_ONLY = "false";
process.env.VERCEL = "";
const { app } = await import("../api/index.ts");
const { default: skillPacksHandler } = await import("../api/skill-packs.ts");
app.all(/^\/api\/skill-packs(\/|$)/, (req, res) => skillPacksHandler(req, res));
const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
const base = `http://127.0.0.1:${server.address().port}`;

const linkedSkill = path.join(root, "3_Skills", "zz-safe-path-link");
const realSkill = path.dirname(filesUnder(path.join(root, "3_Skills")).find((p) => p.endsWith(`${path.sep}SKILL.md`)));
const linkInReal = path.join(realSkill, "zz-safe-path-link");
try {
  link(outside, linkedSkill);
  link(outside, linkInReal);

  const detail = await fetch(`${base}/api/prompts/${encodeURIComponent("3_Skills/zz-safe-path-link/SKILL.md")}`);
  assert.notEqual(detail.status, 200, "detail through a linked skill folder is refused");
  assert.ok(!(await detail.text()).includes("OUTSIDE-SECRET"));

  const zipOut = await fetch(`${base}/api/skills/download/3_Skills/zz-safe-path-link`);
  assert.equal(zipOut.status, 400, "a linked skill folder can't be zipped");

  const relReal = path.relative(root, realSkill).split(path.sep).join("/");
  const zip = await fetch(`${base}/api/skills/download/${relReal}`);
  assert.equal(zip.status, 200, `a real skill (${relReal}) still zips`);
  const bytes = Buffer.from(await zip.arrayBuffer());
  assert.ok(!bytes.includes("zz-safe-path-link") && !bytes.includes("OUTSIDE-SECRET"), "the ZIP leaves the link out");
} finally {
  unlink(linkedSkill);
  unlink(linkInReal);
  unlink(path.join(sandbox, "skill", "out"));
  unlink(path.join(sandbox, "skill", "file-link.txt"));
  server.close();
  for (const d of [outside, sandbox, process.env.MY_LIBRARY_DIR]) fs.rmSync(d, { recursive: true, force: true });
}
assert.ok(!fs.existsSync(linkedSkill) && !fs.existsSync(linkInReal), "test links removed");
assert.ok(fs.existsSync(path.join(realSkill, "SKILL.md")), "the real skill is untouched");

console.log(`safe-path: string and link containment pass (file symlinks ${fileLinks ? "checked" : "skipped: not permitted here"})`);
