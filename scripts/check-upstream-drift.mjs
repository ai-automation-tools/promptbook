#!/usr/bin/env node
/**
 * Compare every vendored skill and agent against its upstream and report what
 * has moved.
 *
 * Reads the `upstream:` block that `attribute-upstream.mjs` stamped, resolves
 * the file in the upstream repo, and compares bodies with frontmatter stripped.
 * That last part matters: local copies carry an emoji in `name:` and an
 * `upstream:` block, so a raw file comparison would report all ~350 skills as
 * drifted every week and the report would be worthless.
 *
 * Path resolution, not path trust: attributions sourced through the mirror carry
 * the mirror's own layout, not the origin repo's — the mirror stores Anthropic's
 * claude-api at `claude-api/SKILL.md` while the repo has it at
 * `skills/claude-api/SKILL.md`. Taking those paths at face value reported 72
 * live files as deleted. So each repo's tree is fetched once and the skill is
 * located by directory name, which costs fewer API calls than per-file fetching
 * anyway.
 *
 * Skips `match: unknown`, `match: ambiguous` and `match: fork` — there is no
 * single live upstream to compare against, and guessing would produce confident
 * nonsense. `behind` here is a freshness *verdict* this script assigns; it is
 * not an `upstream.match` value (attribute-upstream.mjs calls that `similar`).
 *
 * The verdict is set from the share of upstream's lines this copy does not
 * contain, not from the ratio of the two word counts. The ratio was the wrong
 * instrument: it goes to 1 whenever the local copy is the larger file, so an
 * upstream rewrite into tighter prose read as a perfect match. See `absentFrom`.
 *
 * Reports, never edits. Curation is the product; an auto-merge that reflowed 300
 * files into the wrong categories would destroy it.
 *
 * Usage:
 *   node scripts/check-upstream-drift.mjs                 # markdown to stdout
 *   node scripts/check-upstream-drift.mjs --out drift.md
 *   node scripts/check-upstream-drift.mjs --out drift.md --json site/api/upstream-status.json
 *
 * `--json` also writes each checked file's verdict, its real upstream path and
 * branch, and the local-only share (`extra`). The site reads it for the Source
 * panel on an item; the weekly workflow reads `extra` to pick what it may resync
 * unattended (see .github/workflows/upstream-drift.yml).
 *
 * Agents are the `2_Agents` files carrying an `upstream:` block — the subagent
 * definitions `attribute-upstream.mjs --agents` stamped, not the role-play
 * prompts beside them. An upstream names an agent by its file (`x.md`,
 * `x.agent.md`) where it names a skill by its directory; that is the only
 * difference, and `nameOf` is where it lives. Agent rows keep their `2_Agents/`
 * prefix in the report, which is also the argument resync-upstream.mjs takes.
 *
 * Auth: uses GITHUB_TOKEN if set (60 req/h anonymous, 5000 authenticated).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const OUT = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const JSON_OUT = args.includes("--json") ? args[args.indexOf("--json") + 1] : null;
const LIB = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..", "site", "library");

const TOKEN = process.env.GITHUB_TOKEN || "";
const api = { "User-Agent": "promptbook-drift-check", Accept: "application/vnd.github+json" };
if (TOKEN) api.Authorization = `Bearer ${TOKEN}`;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex");
const words = (s) => norm(s).split(" ").filter(Boolean).length;

// Content divergence, measured on normalized non-empty lines rather than on the
// two word counts. A size ratio cannot tell a rewrite from a match: when upstream
// restructures a skill into denser prose the local copy stays larger, the ratio
// reads >= 1, and the file sorts to the bottom of the report as "0% missing" —
// which is how the most-diverged skills in the library hid for three weeks.
// Two directions, because they need different decisions: `missing` is upstream
// content this copy does not have (a resync candidate), `extra` is local content
// upstream does not have (curation we would destroy by resyncing).
const lines = (s) => s.split("\n").map(norm).filter(Boolean);
const absentFrom = (a, b) => {
  if (!a.length) return 0;
  const have = new Map();
  for (const l of b) have.set(l, (have.get(l) || 0) + 1);
  let unmatched = 0;
  for (const l of a) {
    const n = have.get(l) || 0;
    if (n > 0) have.set(l, n - 1);
    else unmatched++;
  }
  return unmatched / a.length;
};

const splitFrontmatter = (raw) => {
  const t = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return { fm: "", body: t };
  const end = t.indexOf("\n---", 3);
  if (end === -1) return { fm: "", body: t };
  return { fm: t.slice(4, end), body: t.slice(end + 4) };
};

// Small reader for the one nested block we write ourselves. A YAML dependency
// for five known keys is a dependency we would have to keep patched forever.
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

const walk = (dir, match, out = []) => {
  let es;
  try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of es) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, match, out);
    else if (match(e.name)) out.push(p);
  }
  return out;
};

const isSkill = (p) => /(^|\/)SKILL\.md$/i.test(p);
// What an upstream calls the thing: a skill's directory, an agent's file name.
const nameOf = (p) => isSkill(p)
  ? p.split("/").slice(-2)[0]
  : p.split("/").pop().replace(/(\.agent)?\.md$/i, "");

// ---------- collect targets ----------
const targets = [], skipped = { unknown: 0, ambiguous: 0, fork: 0, none: 0 };
const files = [
  ...walk(path.join(LIB, "3_Skills"), (n) => n === "SKILL.md"),
  ...walk(path.join(LIB, "2_Agents"), (n) => n.endsWith(".md")),
  // System prompts, stamped since 2026-10-23. Named by file like agents. Reported
  // here and shown on the item page, never auto-resynced: each is a dated capture.
  ...walk(path.join(LIB, "5_System_Prompts"), (n) => n.endsWith(".md")),
];
let unstampedAgents = 0; // real subagent definitions (`name:` frontmatter) with no upstream block
for (const f of files) {
  const { fm, body } = splitFrontmatter(fs.readFileSync(f, "utf8"));
  const u = readUpstream(fm);
  if (!u) {
    if (isSkill(f)) skipped.none++;
    else if (/^name:/m.test(fm)) unstampedAgents++;
    continue;  // other unstamped agents are role-play prompts
  }
  if (u.match === "unknown") { skipped.unknown++; continue; }
  if (u.match === "ambiguous") { skipped.ambiguous++; continue; }
  if (u.match === "fork") { skipped.fork++; continue; }  // upstream deleted the file; this copy is ours now
  if (u.match === "vendor") continue;  // a vendor docs page, no repo to diff against
  if (!u.repo) { skipped.none++; continue; }
  const rel = path.relative(LIB, f).split(path.sep).join("/");
  targets.push({ file: rel, u, body, name: nameOf(rel) });
}

console.error(`attributed skills and agents to check: ${targets.length}`);
console.error(`skipping ${skipped.unknown} unknown, ${skipped.ambiguous} ambiguous, ${skipped.fork} fork, ${skipped.none} unstamped`);
if (!TOKEN) console.error("no GITHUB_TOKEN — anonymous limit is 60/h, expect throttling");

// ---------- one tree per repo ----------
const repos = [...new Set(targets.map((t) => t.u.repo))];
console.error(`upstream repos: ${repos.length}`);

const trees = new Map();
let rateLimited = false;
for (const repo of repos) {
  if (rateLimited) break;
  try {
    const meta = await fetch(`https://api.github.com/repos/${repo}`, { headers: api });
    if (meta.status === 404) { trees.set(repo, { gone: true }); continue; }
    if (meta.status === 403 || meta.status === 429) { rateLimited = true; break; }
    if (!meta.ok) { trees.set(repo, { error: `HTTP ${meta.status}` }); continue; }
    const branch = (await meta.json()).default_branch;
    const tr = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`, { headers: api });
    if (!tr.ok) { trees.set(repo, { error: `tree HTTP ${tr.status}` }); continue; }
    const data = await tr.json();
    const paths = (data.tree || []).filter((x) => x.type === "blob" && /\.md$/i.test(x.path))
      .map((x) => x.path);
    trees.set(repo, { branch, paths });
  } catch (e) {
    trees.set(repo, { error: String(e.message || e) });
  }
}
if (rateLimited) console.error("rate limited while fetching trees — report will be partial");

// ---------- resolve + compare ----------
const rows = [];
for (const t of targets) {
  const tree = trees.get(t.u.repo);
  if (!tree) { rows.push({ ...t, verdict: "error", detail: "not fetched" }); continue; }
  if (tree.gone) { rows.push({ ...t, verdict: "repo-gone" }); continue; }
  if (tree.error) { rows.push({ ...t, verdict: "error", detail: tree.error }); continue; }

  // Prefer the stamped path when it really exists upstream; otherwise locate the
  // skill by its directory name (an agent by its file name), which survives the
  // mirror's re-layout.
  let resolved = tree.paths.includes(t.u.path) ? t.u.path : null;
  if (!resolved) {
    const pool = tree.paths.filter((p) => isSkill(p) === isSkill(t.file));
    const wanted = t.u.path ? nameOf(t.u.path) : t.name;
    resolved = pool.find((p) => nameOf(p) === wanted)
      || pool.find((p) => nameOf(p) === t.name)
      || null;
  }
  if (!resolved) { rows.push({ ...t, verdict: "upstream-gone" }); continue; }

  // raw.githubusercontent does not consume the API quota.
  let text;
  try {
    const r = await fetch(`https://raw.githubusercontent.com/${t.u.repo}/${tree.branch}/${resolved}`);
    if (!r.ok) { rows.push({ ...t, resolved, verdict: "error", detail: `raw HTTP ${r.status}` }); continue; }
    text = await r.text();
  } catch (e) {
    rows.push({ ...t, resolved, verdict: "error", detail: String(e.message || e) });
    continue;
  }

  const up = splitFrontmatter(text);
  const lw = words(t.body), uw = words(up.body);
  const moved = resolved !== t.u.path;
  if (sha1(norm(t.body)) === sha1(norm(up.body))) {
    rows.push({ ...t, resolved, moved, verdict: "current", lw, uw, missing: 0, extra: 0 });
  } else {
    const ll = lines(t.body), ul = lines(up.body);
    const missing = absentFrom(ul, ll), extra = absentFrom(ll, ul);
    rows.push({ ...t, resolved, moved, lw, uw, missing, extra,
      verdict: missing >= 0.25 ? "behind" : "drifted" });
  }
}

// ---------- report ----------
const by = (v) => rows.filter((r) => r.verdict === v);
const MEAN = {
  "repo-gone": "the whole upstream repo 404s",
  "upstream-gone": "nothing of this name left in the upstream repo",
  behind: "a quarter or more of upstream's lines are not in this copy",
  drifted: "bodies differ, but this copy holds over 75% of upstream's lines",
  error: "could not be fetched",
  current: "body identical to upstream",
};
const order = ["repo-gone", "upstream-gone", "behind", "drifted", "error", "current"];

const md = [`# Upstream drift — ${new Date().toISOString().slice(0, 10)}`, ""];
md.push(`Checked **${rows.length}** attributed skills and agents across **${repos.length}** upstream repos. ` +
  `Skipped ${skipped.unknown} \`unknown\` and ${skipped.ambiguous} \`ambiguous\` — no single upstream to compare against — ` +
  `and ${skipped.fork} \`fork\` whose upstream deleted the file.`);
md.push("");
md.push("| verdict | count | meaning |");
md.push("|:---|---:|:---|");
for (const v of order) if (by(v).length) md.push(`| \`${v}\` | ${by(v).length} | ${MEAN[v]} |`);
md.push("");

// ---------- library health ----------
// Per section, from the committed index: how much is there, how much moved in the
// last 30 days (lastModified is carried forward on rebuilds, so it is real), how
// much the tag filter cannot see, and how much has no provenance. Here so the gaps
// the content jobs leave show up every Monday instead of being found by hand.
try {
  const index = JSON.parse(fs.readFileSync(path.join(LIB, "..", "api", "prompt-index.json"), "utf8"));
  const prompts = Array.isArray(index) ? index : index.prompts || [];
  const cut = Date.now() - 30 * 86400000;
  const health = {};
  for (const p of prompts) {
    const s = p.section || p.id.split("/")[0];
    const h = (health[s] ??= { files: 0, recent: 0, untagged: 0 });
    h.files++;
    if (new Date(p.lastModified).getTime() > cut) h.recent++;
    if (!p.tags || p.tags.length === 0) h.untagged++;
  }
  const unstamped = { "3_Skills": skipped.none, "2_Agents": unstampedAgents };
  md.push("## Library health", "");
  md.push(`Sections as the index sees them (${prompts.length} files). *Changed* is \`lastModified\` within 30 days; ` +
    "*untagged* files are invisible to the tag filter and ⌘K; *no provenance* counts skills, and real agent definitions, without an `upstream:` block.", "");
  md.push("| section | files | changed <30d | untagged | no provenance |");
  md.push("|:---|---:|---:|---:|---:|");
  for (const s of Object.keys(health).sort()) {
    const h = health[s];
    md.push(`| \`${s}\` | ${h.files} | ${h.recent} | ${h.untagged} | ${s in unstamped ? unstamped[s] : "—"} |`);
  }
  md.push("");
} catch (e) {
  md.push(`_Library health table skipped: ${String(e.message || e)}_`, "");
}

for (const v of ["repo-gone", "upstream-gone", "behind", "drifted", "error"]) {
  const list = by(v);
  if (!list.length) continue;
  md.push(`## ${v} (${list.length})`, "");
  if (v === "behind" || v === "drifted") {
    md.push("| skill | upstream | missing | extra | local words | upstream words |");
    md.push("|:---|:---|---:|---:|---:|---:|");
    for (const r of list.sort((a, b) => b.missing - a.missing)) {
      const link = `[${r.u.repo}/${r.resolved}](https://github.com/${r.u.repo}/blob/${trees.get(r.u.repo).branch}/${r.resolved})`;
      const pc = (x) => `${Math.round(x * 100)}%`;
      md.push(`| \`${r.file.replace(/^3_Skills\//, "")}\` | ${link} | ${pc(r.missing)} | ${pc(r.extra)} | ${r.lw} | ${r.uw} |`);
    }
  } else {
    md.push("| skill | upstream | detail |");
    md.push("|:---|:---|:---|");
    for (const r of list) {
      md.push(`| \`${r.file.replace(/^3_Skills\//, "")}\` | ${r.u.repo} | ${r.detail || ""} |`);
    }
  }
  md.push("");
}

if (by("current").length) {
  md.push(`<details><summary>${by("current").length} current</summary>`, "");
  for (const r of by("current")) md.push(`- \`${r.file.replace(/^3_Skills\//, "")}\` — ${r.u.repo}`);
  md.push("", "</details>");
}

const text = md.join("\n") + "\n";
if (OUT) { fs.writeFileSync(OUT, text); console.error(`wrote ${OUT}`); }
else console.log(text);

if (JSON_OUT) {
  // Sorted keys and rounded shares, so a week with no upstream movement is a no-op diff.
  const items = {};
  for (const r of [...rows].sort((a, b) => a.file.localeCompare(b.file))) {
    const tree = trees.get(r.u.repo);
    items[r.file] = {
      verdict: r.verdict,
      repo: r.u.repo,
      ...(r.resolved ? { path: r.resolved } : {}),
      ...(tree?.branch ? { branch: tree.branch } : {}),
      ...(r.extra !== undefined ? { extra: Math.round(r.extra * 100) / 100 } : {}),
    };
  }
  fs.writeFileSync(JSON_OUT, JSON.stringify({ checked: new Date().toISOString().slice(0, 10), items }, null, 2) + "\n");
  console.error(`wrote ${JSON_OUT}`);
}

// Drift is the expected output, so finding it is not a failure. A red X every
// week just teaches people to ignore the job.
process.exit(by("error").length > rows.length / 2 ? 1 : 0);
