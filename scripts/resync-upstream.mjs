#!/usr/bin/env node
/**
 * Pull a vendored skill back level with its upstream.
 *
 * `check-upstream-drift.mjs` reports; this one repairs. It is the other half of
 * the same pair and shares its resolution logic on purpose: read the `upstream:`
 * block, find the skill in the upstream tree by directory name (stamped paths
 * come from a mirror whose layout is not the origin repo's), then replace the
 * local body with upstream's.
 *
 * What it does NOT touch: the local frontmatter. `title` carries the decorated
 * emoji form the site renders, and `tags`/`category`/`subcategory`/`source` are
 * this library's own curation — none of that exists upstream, and the drift
 * check strips frontmatter before comparing anyway, so syncing the body is what
 * actually moves a skill from `behind` to `current`. Only the `upstream:` block
 * is rewritten: `ref` to the sha we synced from, `checked` to today, `match` to
 * `exact` because after this run the body genuinely is.
 *
 * Support files (`references/`, `scripts/`, `examples/`, language dirs) are
 * mirrored wholesale. Upstreams reorganise them — Anthropic's claude-api moved
 * `python/agent-sdk/` to `python/managed-agents/` and split each language's
 * single file into a directory — so stale locals are pruned unless --keep-extra.
 * Nothing outside the named skill directories is ever written.
 *
 * Line endings follow the local SKILL.md (this library is CRLF throughout and
 * normalising it is a separate, deliberate decision).
 *
 * Usage:
 *   node scripts/resync-upstream.mjs Development/code-tour Content/brainstorming
 *   node scripts/resync-upstream.mjs --dry-run Development/API/claude-api
 *
 * Paths are relative to site/library/3_Skills. Auth: uses GITHUB_TOKEN if set.
 *
 * Agents: a path starting `2_Agents/` (as the drift report prints it) is a
 * single-file subagent definition. Same rules — local frontmatter, upstream
 * body — but there are no support files, and upstream names it by file
 * (`x.md`, `x.agent.md`), not by directory:
 *   node scripts/resync-upstream.mjs 2_Agents/AI_ML/Other/model-evaluator.md
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const KEEP_EXTRA = argv.includes("--keep-extra");
// The drift report prints skills as `.../SKILL.md`; accept that as the directory.
const skills = argv.filter((a) => !a.startsWith("--")).map((a) => a.replace(/\/SKILL\.md$/i, ""));

if (!skills.length) {
  console.error("usage: node scripts/resync-upstream.mjs [--dry-run] [--keep-extra] <skill-dir>...");
  process.exit(2);
}

const ROOT = path.join(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..",
);
const LIB = path.join(ROOT, "site", "library");
const SKILLS = path.join(LIB, "3_Skills");

const TOKEN = process.env.GITHUB_TOKEN || "";
const api = { "User-Agent": "promptbook-resync", Accept: "application/vnd.github+json" };
if (TOKEN) api.Authorization = `Bearer ${TOKEN}`;

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

/** Rewrite ref/checked/match inside the existing upstream: block, leaving every
 *  other key (declared, path, repo) and the rest of the frontmatter untouched.
 *  splitFrontmatter's `fm` has no trailing newline, so when a key such as `tags:`
 *  follows the block the result must still end on one, or the file closes as
 *  `tags: [...]---`. */
const stampUpstream = (fm, { ref, checked }) =>
  fm.replace(/^upstream:\n((?:[ \t]+.*\n?)*)/m, (_all, block) => {
    const keep = block
      .split("\n")
      .filter((l) => l.trim() && !/^\s+(ref|checked|match):/.test(l));
    return ["upstream:", "  match: exact", ...keep, `  ref: ${ref}`, `  checked: ${checked}`]
      .join("\n") + "\n";
  }).replace(/\n?$/, "\n");

const walk = (dir, out = []) => {
  let es;
  try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of es) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};

const pruneEmpty = (dir, stopAt) => {
  let cur = dir;
  while (cur.startsWith(stopAt) && cur !== stopAt) {
    if (fs.readdirSync(cur).length) return;
    fs.rmdirSync(cur);
    cur = path.dirname(cur);
  }
};

const trees = new Map();
async function tree(repo) {
  if (trees.has(repo)) return trees.get(repo);
  const meta = await fetch(`https://api.github.com/repos/${repo}`, { headers: api });
  if (!meta.ok) throw new Error(`repo ${repo}: HTTP ${meta.status}`);
  const branch = (await meta.json()).default_branch;
  const head = await fetch(`https://api.github.com/repos/${repo}/commits/${branch}`, { headers: api });
  if (!head.ok) throw new Error(`head ${repo}: HTTP ${head.status}`);
  const sha = (await head.json()).sha;
  const tr = await fetch(
    `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`, { headers: api });
  if (!tr.ok) throw new Error(`tree ${repo}: HTTP ${tr.status}`);
  const blobs = ((await tr.json()).tree || []).filter((x) => x.type === "blob").map((x) => x.path);
  const t = { repo, branch, sha, blobs };
  trees.set(repo, t);
  return t;
}

const today = new Date().toISOString().slice(0, 10);
let failed = 0;

for (const rel of skills) {
  if (rel.startsWith("2_Agents/")) {
    const local = path.join(LIB, rel.split("/").join(path.sep));
    if (!fs.existsSync(local)) { console.error(`✗ ${rel}: no such file`); failed++; continue; }
    const raw = fs.readFileSync(local, "utf8");
    const { fm } = splitFrontmatter(raw);
    const u = readUpstream(fm);
    if (!u?.repo) { console.error(`✗ ${rel}: no upstream: block`); failed++; continue; }
    let t;
    try { t = await tree(u.repo); } catch (e) { console.error(`✗ ${rel}: ${e.message}`); failed++; continue; }
    const nameOf = (p) => p.split("/").pop().replace(/(\.agent)?\.md$/i, "");
    const wanted = nameOf(u.path || rel);
    const up = t.blobs.includes(u.path)
      ? u.path
      : t.blobs.find((p) => /\.md$/i.test(p) && !/(^|\/)SKILL\.md$/i.test(p) && nameOf(p) === wanted);
    if (!up) { console.error(`✗ ${rel}: not found in ${u.repo}`); failed++; continue; }
    const r = await fetch(`https://raw.githubusercontent.com/${t.repo}/${t.sha}/${up}`);
    if (!r.ok) { console.error(`✗ ${rel}: raw ${up}: HTTP ${r.status}`); failed++; continue; }
    const body = splitFrontmatter(await r.text()).body;
    let out = `---\n${stampUpstream(fm, { ref: t.sha, checked: today })}---${body}`;
    if (raw.includes("\r\n")) out = out.replace(/\r?\n/g, "\r\n");
    if (!DRY) fs.writeFileSync(local, out);
    console.log(`${DRY ? "· " : "✓ "}${rel} ← ${t.repo}/${up} @ ${t.sha.slice(0, 7)}`);
    continue;
  }

  const localDir = path.join(SKILLS, rel.split("/").join(path.sep));
  const localSkill = path.join(localDir, "SKILL.md");
  if (!fs.existsSync(localSkill)) { console.error(`✗ ${rel}: no SKILL.md`); failed++; continue; }

  const raw = fs.readFileSync(localSkill, "utf8");
  const crlf = raw.includes("\r\n");
  const { fm } = splitFrontmatter(raw);
  const u = readUpstream(fm);
  if (!u?.repo) { console.error(`✗ ${rel}: no upstream: block`); failed++; continue; }

  let t;
  try { t = await tree(u.repo); } catch (e) { console.error(`✗ ${rel}: ${e.message}`); failed++; continue; }

  // Same resolution as the drift checker: stamped path if it exists, else by
  // directory name, which survives the mirror's re-layout.
  const wanted = (u.path || "").split("/").slice(-2)[0] || path.basename(localDir);
  const upSkill = t.blobs.includes(u.path)
    ? u.path
    : t.blobs.find((p) => /(^|\/)SKILL\.md$/i.test(p) && p.split("/").slice(-2)[0] === wanted)
      || t.blobs.find((p) => /(^|\/)SKILL\.md$/i.test(p)
        && p.split("/").slice(-2)[0] === path.basename(localDir));
  if (!upSkill) { console.error(`✗ ${rel}: not found in ${u.repo}`); failed++; continue; }

  const upDir = upSkill.slice(0, upSkill.lastIndexOf("/"));
  const members = t.blobs.filter((p) => p.startsWith(upDir + "/"));

  const get = async (p) => {
    const r = await fetch(`https://raw.githubusercontent.com/${t.repo}/${t.sha}/${p}`);
    if (!r.ok) throw new Error(`raw ${p}: HTTP ${r.status}`);
    return Buffer.from(await r.arrayBuffer());
  };

  let files;
  try {
    files = await Promise.all(members.map(async (p) => ({ rel: p.slice(upDir.length + 1), buf: await get(p) })));
  } catch (e) { console.error(`✗ ${rel}: ${e.message}`); failed++; continue; }

  const written = new Set();
  for (const f of files) {
    const dest = path.join(localDir, f.rel.split("/").join(path.sep));
    written.add(dest);
    let out = f.buf;
    if (f.rel === "SKILL.md") {
      // Local frontmatter, upstream body.
      const body = splitFrontmatter(f.buf.toString("utf8")).body;
      out = Buffer.from(`---\n${stampUpstream(fm, { ref: t.sha, checked: today })}---${body}`, "utf8");
    }
    if (crlf && /\.(md|txt|json|ya?ml|sh|js|cjs|mjs|py|html)$/i.test(f.rel)) {
      out = Buffer.from(out.toString("utf8").replace(/\r?\n/g, "\r\n"), "utf8");
    }
    if (DRY) { console.log(`  would write ${path.relative(SKILLS, dest).split(path.sep).join("/")}`); continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out);
  }

  // A LICENSE beside SKILL.md that upstream keeps at its repo root was vendored here on
  // purpose (vendor-skill-licenses.mjs); it is not stale.
  const vendoredLicense = (p) => path.dirname(p) === localDir && /^(LICENSE|COPYING)(\.(md|txt))?$/i.test(path.basename(p));
  const extra = walk(localDir).filter((p) => !written.has(p) && !vendoredLicense(p));
  for (const p of extra) {
    const show = path.relative(SKILLS, p).split(path.sep).join("/");
    if (KEEP_EXTRA) { console.log(`  kept local-only ${show}`); continue; }
    if (DRY) { console.log(`  would prune ${show}`); continue; }
    fs.unlinkSync(p);
    pruneEmpty(path.dirname(p), localDir);
  }

  console.log(`${DRY ? "· " : "✓ "}${rel} ← ${t.repo}/${upDir} @ ${t.sha.slice(0, 7)} ` +
    `(${files.length} file${files.length === 1 ? "" : "s"}, ${extra.length} stale)`);
}

process.exit(failed ? 1 : 0);
