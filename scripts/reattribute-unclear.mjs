#!/usr/bin/env node
/**
 * Second pass at provenance for the skills and agents attribute-upstream.mjs
 * could not pin to one repo (`match: unknown` / `match: ambiguous`).
 *
 * attribute-upstream.mjs needs large local clones and a mirror; this pass needs
 * only a GitHub token, so it can be re-run whenever the unclear pile grows:
 *
 *   unknown   → GitHub code search for a few distinctive lines of the body. Every
 *               hit outside this repo and outside forks is fetched and compared.
 *   ambiguous → the recorded candidates are each looked up (stars, fork flag,
 *               default branch) and searched for a file of the same name.
 *
 * A candidate counts only if its body really matches: identical after
 * normalising (`exact`), or each side holding at least 75% of the other's lines
 * (`similar`, the same threshold check-upstream-drift.mjs calls drifted). When
 * several repos match, the most-starred wins and the rest are recorded under
 * `candidates`. Nothing found means nothing changes: the item stays `unknown`
 * and lands on the report's "no source found" list, which is the review list
 * for deletion. This script never deletes.
 *
 * Usage (repo root):
 *   GITHUB_TOKEN=… node scripts/reattribute-unclear.mjs --report attribution.md --cache attribution.json
 *   GITHUB_TOKEN=… node scripts/reattribute-unclear.mjs --report … --cache … --write   # also stamp the matches
 *
 * Code search allows 10 requests a minute, so the unknown pass takes about an hour.
 * `--cache` saves each item's result as it goes; a re-run skips what is already in it.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const REPORT = args.includes("--report") ? args[args.indexOf("--report") + 1] : null;
const CACHE = args.includes("--cache") ? args[args.indexOf("--cache") + 1] : null;
const cache = CACHE && fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const LIB = path.join(ROOT, "site", "library");
const SELF = "ai-automation-tools/promptbook";

const TOKEN = process.env.GITHUB_TOKEN || "";
if (!TOKEN) { console.error("GITHUB_TOKEN is required (code search needs auth)"); process.exit(2); }
const api = { "User-Agent": "promptbook-reattribute", Accept: "application/vnd.github+json", Authorization: `Bearer ${TOKEN}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex");
const lines = (s) => s.split("\n").map(norm).filter(Boolean);
const absentFrom = (a, b) => {
  if (!a.length) return 0;
  const have = new Map();
  for (const l of b) have.set(l, (have.get(l) || 0) + 1);
  let unmatched = 0;
  for (const l of a) {
    const n = have.get(l) || 0;
    if (n > 0) have.set(l, n - 1); else unmatched++;
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
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
};
const isSkill = (p) => /(^|\/)SKILL\.md$/i.test(p);
const nameOf = (p) => isSkill(p) ? p.split("/").slice(-2)[0] : p.split("/").pop().replace(/(\.agent)?\.md$/i, "");

/** fetch that rides out dropped connections instead of killing an hour-long run. */
async function get(url, headers) {
  for (let attempt = 0; ; attempt++) {
    try { return await fetch(url, { headers }); } catch (e) {
      if (attempt >= 5) throw e;
      console.error(`  network error (${e.cause?.code || e.message}), retrying`);
      await sleep(5000 * (attempt + 1));
    }
  }
}

async function gh(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await get(url, api);
    if (r.status === 403 || r.status === 429) {
      const reset = Number(r.headers.get("x-ratelimit-reset")) * 1000;
      const wait = Math.max(reset ? reset - Date.now() : 0, 30_000);
      console.error(`  rate limited, waiting ${Math.round(wait / 1000)}s`);
      await sleep(Math.min(wait, 600_000));
      continue;
    }
    if (!r.ok) return null;
    return r.json();
  }
  return null;
}

const repoMeta = new Map();
async function meta(repo) {
  if (!repoMeta.has(repo)) {
    const j = await gh(`https://api.github.com/repos/${repo}`);
    repoMeta.set(repo, j && { stars: j.stargazers_count, fork: j.fork, branch: j.default_branch, archived: j.archived, license: j.license?.spdx_id ?? null });
  }
  return repoMeta.get(repo);
}
const heads = new Map();
async function headSha(repo, branch) {
  if (!heads.has(repo)) heads.set(repo, (await gh(`https://api.github.com/repos/${repo}/commits/${branch}`))?.sha ?? null);
  return heads.get(repo);
}
async function raw(repo, branch, p) {
  const r = await get(`https://raw.githubusercontent.com/${repo}/${branch}/${p.split("/").map(encodeURIComponent).join("/")}`, {});
  return r.ok ? r.text() : null;
}

/** How well an upstream body matches ours, or null if it does not. */
function compare(localBody, upText) {
  const up = splitFrontmatter(upText).body;
  if (sha1(norm(localBody)) === sha1(norm(up))) return "exact";
  const ll = lines(localBody), ul = lines(up);
  return absentFrom(ul, ll) < 0.25 && absentFrom(ll, ul) < 0.25 ? "similar" : null;
}

/** Up to three long, wordy lines: specific enough for an exact-phrase search. */
function probes(body) {
  return [...new Set(body.split("\n").map((l) => l.replace(/^[#>*\-\s\d.]+/, "").trim())
    .filter((l) => l.length >= 50 && l.length <= 140 && /^[\w ,.'()-]+$/.test(l) && l.split(" ").length >= 8))]
    .sort((a, b) => b.length - a.length)
    .slice(0, 3);
}

// ---------- collect ----------
const items = [];
for (const f of [...walk(path.join(LIB, "3_Skills")).filter((p) => p.endsWith("SKILL.md")), ...walk(path.join(LIB, "2_Agents"))]) {
  const rawText = fs.readFileSync(f, "utf8");
  const { fm, body } = splitFrontmatter(rawText);
  const u = readUpstream(fm);
  if (!u || (u.match !== "unknown" && u.match !== "ambiguous")) continue;
  const rel = path.relative(LIB, f).split(path.sep).join("/");
  const candidates = (u.candidates || "").replace(/[[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean);
  items.push({ file: f, rel, u, body, name: nameOf(rel), candidates });
}
console.error(`unclear: ${items.filter((i) => i.u.match === "unknown").length} unknown, ${items.filter((i) => i.u.match === "ambiguous").length} ambiguous`);

// ---------- resolve ----------
const results = [];
for (const [n, it] of items.entries()) {
  if (cache[it.rel]) { results.push({ ...it, ...cache[it.rel] }); continue; }
  const found = new Map(); // repo -> { path, match }
  const consider = async (repo, p) => {
    if (repo === SELF || found.has(repo)) return;
    const m = await meta(repo);
    if (!m || m.fork) return;
    const text = await raw(repo, m.branch, p);
    const match = text && compare(it.body, text);
    if (match) found.set(repo, { path: p, match, ...m });
  };

  if (it.u.match === "ambiguous") {
    for (const repo of it.candidates) {
      const m = await meta(repo);
      if (!m || m.fork) continue;
      const tree = await gh(`https://api.github.com/repos/${repo}/git/trees/${m.branch}?recursive=1`);
      const hit = (tree?.tree || []).find((x) => x.type === "blob" && isSkill(x.path) === isSkill(it.rel) && /\.md$/i.test(x.path) && nameOf(x.path) === it.name);
      if (hit) await consider(repo, hit.path);
    }
  } else {
    for (const probe of probes(it.body)) {
      const q = encodeURIComponent(`"${probe}" ${isSkill(it.rel) ? "filename:SKILL.md" : "extension:md"}`);
      const res = await gh(`https://api.github.com/search/code?q=${q}&per_page=20`);
      await sleep(6500); // code search: 10 requests a minute
      for (const hit of (res?.items || []).slice(0, 10)) await consider(hit.repository.full_name, hit.path);
      if (found.size) break;
    }
  }

  const ranked = [...found.entries()].sort((a, b) => (b[1].match === "exact") - (a[1].match === "exact") || b[1].stars - a[1].stars);
  const best = ranked[0];
  const result = { best: best && { repo: best[0], ...best[1] }, others: ranked.slice(1).map(([r]) => r) };
  results.push({ ...it, ...result });
  if (CACHE) { cache[it.rel] = result; fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1)); }
  console.error(`[${n + 1}/${items.length}] ${it.rel}: ${best ? `${best[0]} (${best[1].match}, ★${best[1].stars})` : "no source found"}`);
}

// ---------- write ----------
const today = new Date().toISOString().slice(0, 10);
if (WRITE) {
  for (const r of results.filter((x) => x.best)) {
    const sha = await headSha(r.best.repo, r.best.branch);
    if (!sha) continue;
    const text = fs.readFileSync(r.file, "utf8");
    const crlf = text.includes("\r\n");
    const t = text.replace(/\r\n/g, "\n");
    const block = [
      "upstream:",
      `  match: ${r.best.match}`,
      `  repo: ${r.best.repo}`,
      `  path: ${r.best.path}`,
      `  ref: ${sha}`,
      `  checked: ${today}`,
      `  was: ${r.u.match}`,
      ...(r.others.length ? [`  candidates: [${r.others.join(", ")}]`] : []),
    ].join("\n") + "\n";
    let out = t.replace(/^upstream:\n(?:[ \t]+.*\n?)*/m, block);
    if (crlf) out = out.replace(/\n/g, "\r\n");
    fs.writeFileSync(r.file, out);
  }
}

// ---------- report ----------
const md = [`# Attribution pass — ${today}`, ""];
const hit = results.filter((r) => r.best), miss = results.filter((r) => !r.best);
md.push(`Re-checked **${results.length}** skills and agents that had no single upstream (` +
  `${results.filter((r) => r.u.match === "unknown").length} \`unknown\`, ${results.filter((r) => r.u.match === "ambiguous").length} \`ambiguous\`). ` +
  `**${hit.length}** now resolve to a repo; **${miss.length}** still have no source found.`, "");
md.push(`Generated by \`scripts/reattribute-unclear.mjs\`${WRITE ? "; the matches below are stamped into frontmatter" : ""}.`, "");
md.push(`## Resolved (${hit.length})`, "", "| item | was | repo | match | ★ | licence |", "|:---|:---|:---|:---|---:|:---|");
for (const r of hit) md.push(`| \`${r.rel}\` | ${r.u.match} | [${r.best.repo}](https://github.com/${r.best.repo}/blob/${r.best.branch}/${r.best.path}) | ${r.best.match} | ${r.best.stars} | ${r.best.license ?? "none"} |`);
md.push("", `## No source found — review for deletion (${miss.length})`, "",
  "Nothing on GitHub outside this repo holds a matching copy. Keep (mark as ours), replace with a maintained equivalent, or delete.", "",
  "| item | was | note |", "|:---|:---|:---|");
for (const r of miss) md.push(`| \`${r.rel}\` | ${r.u.match} | ${r.u.declared ? `declared ${r.u.declared}` : r.candidates.length ? `${r.candidates.length} candidates, none still hold it` : ""} |`);
const text = md.join("\n") + "\n";
if (REPORT) { fs.writeFileSync(REPORT, text); console.error(`wrote ${REPORT}`); } else console.log(text);
