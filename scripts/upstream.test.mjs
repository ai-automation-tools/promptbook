// Self-check for the frontmatter handling both upstream scripts depend on.
// Run: node scripts/upstream.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Mirrors of the helpers in check-upstream-drift.mjs. Kept inline so the check
// runs standalone; if these drift from the originals the assertions below are
// what catches it.
const splitFrontmatter = (raw) => {
  const t = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return { fm: "", body: t };
  const end = t.indexOf("\n---", 3);
  if (end === -1) return { fm: "", body: t };
  return { fm: t.slice(4, end), body: t.slice(end + 4) };
};

const readUpstream = (fm) => {
  const m = fm.match(/^upstream:\n((?:[ \t]+.*\n?)*)/m);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s+([a-z_]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
};

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

// --- frontmatter splitting ---
const doc = "---\nname: x\nupstream:\n  match: exact\n  repo: a/b\n  path: skills/x/SKILL.md\n---\n\n# Title\n\nbody\n";
assert.equal(splitFrontmatter(doc).body.trim(), "# Title\n\nbody");
assert.ok(splitFrontmatter(doc).fm.includes("upstream:"));

// CRLF is the norm in this library — 2,131 of 2,132 files.
assert.deepEqual(splitFrontmatter(doc.replace(/\n/g, "\r\n")), splitFrontmatter(doc));

// A BOM must not stop the frontmatter being recognised.
assert.ok(splitFrontmatter("﻿" + doc).fm.includes("name: x"));

// No frontmatter at all: everything is body, nothing blows up.
assert.equal(splitFrontmatter("# Just a heading\n").fm, "");
assert.equal(readUpstream(""), null);

// --- upstream block parsing ---
const u = readUpstream(splitFrontmatter(doc).fm);
assert.equal(u.match, "exact");
assert.equal(u.repo, "a/b");
assert.equal(u.path, "skills/x/SKILL.md");

// The block must be read even when it is not the last key.
const mid = "---\nupstream:\n  match: similar\n  repo: c/d\nname: y\n---\nbody\n";
assert.equal(readUpstream(splitFrontmatter(mid).fm).repo, "c/d");

// --- body comparison ignores frontmatter ---
// This is the whole point: local copies carry an emoji name and an upstream
// block, so comparing raw files would flag every skill as drifted forever.
const local = "---\nname: \"🛠️ thing\"\nupstream:\n  match: exact\n---\n\n# Thing\n\nSame body.\n";
const remote = "---\nname: thing\n---\n\n# Thing\n\nSame body.\n";
assert.equal(norm(splitFrontmatter(local).body), norm(splitFrontmatter(remote).body));

// A real content change must still register.
const changed = remote.replace("Same body.", "Different body entirely.");
assert.notEqual(norm(splitFrontmatter(local).body), norm(splitFrontmatter(changed).body));

// --- stamping is idempotent ---
// Re-running the backfill must replace the block, never stack a second one.
const LIB = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..", "site", "library", "3_Skills");
if (fs.existsSync(LIB)) {
  const sample = path.join(LIB, "Content", "General", "humanizer", "SKILL.md");
  if (fs.existsSync(sample)) {
    const fm = splitFrontmatter(fs.readFileSync(sample, "utf8")).fm;
    assert.equal((fm.match(/^upstream:$/gm) || []).length, 1, "exactly one upstream block");
    assert.ok(readUpstream(fm).repo, "stamped file has a repo");
  }
}

// --- resync re-stamping ---
// Mirror of stampUpstream in resync-upstream.mjs. The risk it guards is a
// resync that rewrites 68 files and quietly corrupts the one block the drift
// checker reads next week: a duplicated key, a dropped `repo`, or curation
// outside the block getting eaten.
const stampUpstream = (fm, { ref, checked }) =>
  fm.replace(/^upstream:\n((?:[ \t]+.*\n?)*)/m, (_all, block) => {
    const keep = block.split("\n").filter((l) => l.trim() && !/^\s+(ref|checked|match):/.test(l));
    return ["upstream:", "  match: exact", ...keep, `  ref: ${ref}`, `  checked: ${checked}`]
      .join("\n") + "\n";
  }).replace(/\n?$/, "\n");

const before = "name: \"🛠️ thing\"\ntags: [\"a\"]\nupstream:\n  match: similar\n" +
  "  repo: a/b\n  path: skills/thing/SKILL.md\n  ref: old\n  checked: 2020-01-01\n";
const after = stampUpstream(before, { ref: "newsha", checked: "2026-08-26" });
const su = readUpstream(after);
assert.equal(su.match, "exact", "a resynced body is an exact match");
assert.equal(su.ref, "newsha");
assert.equal(su.checked, "2026-08-26");
assert.equal(su.repo, "a/b", "repo survives re-stamping");
assert.equal(su.path, "skills/thing/SKILL.md", "path survives re-stamping");
assert.equal((after.match(/^upstream:$/gm) || []).length, 1, "still exactly one upstream block");
assert.equal((after.match(/^\s+ref:/gm) || []).length, 1, "no duplicated ref");
assert.ok(after.includes("tags: [\"a\"]"), "local curation outside the block is untouched");

// Idempotent: stamping the result again changes nothing.
assert.equal(stampUpstream(after, { ref: "newsha", checked: "2026-08-26" }), after);

// `tags:` after the block, the way splitFrontmatter hands it over (no trailing
// newline, as in 2_Agents/AI_ML/Other/model-evaluator.md): `---` gets its own line.
const tagsLast = "name: model-evaluator\nupstream:\n  match: exact\n  repo: a/b\n" +
  "  path: agents/model-evaluator.md\n  ref: old\n  checked: 2020-01-01\ntags: [\"agent\"]";
const restamped = `---\n${stampUpstream(tagsLast, { ref: "newsha", checked: "2026-10-23" })}---\nbody`;
assert.ok(restamped.endsWith("\ntags: [\"agent\"]\n---\nbody"), "frontmatter closes on its own line");
assert.equal(readUpstream(stampUpstream(tagsLast, { ref: "newsha", checked: "2026-10-23" })).ref, "newsha");

// --- the `match:` vocabulary is attribution confidence, never a drift verdict ---
// `behind` is check-upstream-drift.mjs's verdict for "a quarter or more of
// upstream's lines are absent from this copy".
// attribute-upstream.mjs used to stamp the same word as a confidence label, so
// seven skills sat in the library looking like a live problem that was not one.
// Renamed to `similar` on 2026-08-29; this assertion is what stops it coming back.
{
  const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^[/]([A-Za-z]:)/, "$1"));
  const LIB = path.join(HERE, "..", "site", "library");
  // `vendor`: a system prompt the vendor publishes only on its own page (`url`, no repo).
  const KNOWN = new Set(["exact", "prefix", "similar", "ambiguous", "unknown", "fork", "vendor"]);
  const walk = (dir, match, out = []) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, match, out);
      else if (match(e.name)) out.push(p);
    }
    return out;
  };
  const bad = [];
  let stamped = 0;
  // Agents carry the same block since 2026-10-17 (attribute-upstream.mjs --agents).
  const files = [
    ...walk(path.join(LIB, "3_Skills"), (n) => n === "SKILL.md"),
    ...walk(path.join(LIB, "2_Agents"), (n) => n.endsWith(".md")),
    // System prompts since 2026-10-23 (attribute-system-prompts.mjs).
    ...walk(path.join(LIB, "5_System_Prompts"), (n) => n.endsWith(".md") && n.toLowerCase() !== "readme.md"),
  ];
  for (const f of files) {
    const u = readUpstream(splitFrontmatter(fs.readFileSync(f, "utf8")).fm);
    if (!u || !u.match) continue;
    stamped++;
    if (!KNOWN.has(u.match)) bad.push(path.relative(LIB, f) + ": match: " + u.match);
  }
  assert.deepEqual(bad, [], "every upstream.match must be a known attribution verdict");
  console.log("  " + stamped + " stamped skills, agents and system prompts, every match: value in the vocabulary");

  // --- every vendored item names its source (Mike, 2026-10-23) ---
  // Skills, agents and system prompts carry an `upstream:` block with a GitHub
  // `repo` (unknown/ambiguous do not count: they name no single repo), or, for a
  // system prompt a vendor publishes only on its own page, `match: vendor` + `url`.
  // MCP cards name theirs in `server.repo`. Folder README files are not items.
  const unsourced = [];
  const block = (fm, key) => {
    const m = fm.match(new RegExp(`^${key}:\\n((?:[ \\t]+.*\\n?)*)`, "m"));
    return m ? Object.fromEntries(m[1].split("\n").map((l) => l.match(/^\s+([a-z_]+):\s*(.*)$/)).filter(Boolean)
      .map(([, k, v]) => [k, v.trim().replace(/^["']|["']$/g, "")])) : null;
  };
  for (const f of files) {
    if (path.basename(f).toLowerCase() === "readme.md") continue;
    const u = readUpstream(splitFrontmatter(fs.readFileSync(f, "utf8")).fm);
    const named = u && ((u.repo && u.match !== "unknown" && u.match !== "ambiguous") || (u.match === "vendor" && u.url));
    if (!named) unsourced.push(path.relative(LIB, f).split(path.sep).join("/"));
  }
  for (const f of walk(path.join(LIB, "6_MCP_Servers"), (n) => n.endsWith(".md") && n.toLowerCase() !== "readme.md")) {
    if (!block(splitFrontmatter(fs.readFileSync(f, "utf8")).fm, "server")?.repo) unsourced.push(path.relative(LIB, f).split(path.sep).join("/"));
  }
  // Guides and prompts too (Mike, 2026-10-26: every card shows a repo link, the unlinked ones
  // were archived). A prompt copied from a collection carries `upstream.repo`; a guide is
  // written here, so it names the tool it documents in a bare `repo:` line.
  const isMd = (n) => n.endsWith(".md") && n.toLowerCase() !== "readme.md";
  for (const f of walk(path.join(LIB, "4_Prompts"), isMd)) {
    const u = readUpstream(splitFrontmatter(fs.readFileSync(f, "utf8")).fm);
    if (!u?.repo || u.match === "unknown" || u.match === "ambiguous") unsourced.push(path.relative(LIB, f).split(path.sep).join("/"));
  }
  // Skill library cards (3_Skills/Libraries, one per repo since 2026-10-27) are written here
  // too, so like a guide they name their repo in a bare `repo:` line.
  for (const f of [...walk(path.join(LIB, "1_Guides"), isMd), ...walk(path.join(LIB, "3_Skills", "Libraries"), isMd)]) {
    if (!/^repo:\s*[\w.-]+\/[\w.-]+\s*$/m.test(splitFrontmatter(fs.readFileSync(f, "utf8")).fm)) unsourced.push(path.relative(LIB, f).split(path.sep).join("/"));
  }
  assert.deepEqual(unsourced, [], "every item must name a repo (upstream.repo, match: vendor + url, server.repo, or a guide's repo:)");
  console.log("  every skill, agent, system prompt, MCP card, prompt and guide names a repo");
}

console.log("upstream: all checks passed");
