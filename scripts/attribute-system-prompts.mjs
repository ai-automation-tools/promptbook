#!/usr/bin/env node
/**
 * Find where each file in `5_System_Prompts/` came from, and stamp it.
 *
 * The archive was assembled from the public system-prompt collections on GitHub,
 * but without provenance, so nothing could tell when a vendor's prompt moved on.
 * This compares every local file against shallow clones of those collections and
 * writes the same `upstream:` block skills and agents carry (`match`, `repo`,
 * `path`, `ref`, `checked`), so check-upstream-drift.mjs and the item page's
 * Source panel treat system prompts like everything else.
 *
 * Matching is by line containment, not equality: a local file wraps the prompt in
 * a title and a sentence of description, and a collection often holds a longer
 * or slightly later capture. A file matches the candidate holding the largest
 * share of its lines (normalised, 20+ characters, so blank lines and "```" don't
 * count), if that share is at least 60%. 95%+ both ways is `exact`, else `similar`.
 *
 * `--history` also indexes every earlier version of every file in each clone's git
 * history (full clones only). Collections replace a capture when the vendor's
 * prompt changes and the old one leaves HEAD, so many of ours only match history.
 * Those are stamped `match: fork` with the commit they were last seen in: the copy
 * here is an archived capture, and the drift check rightly leaves it alone.
 *
 * Files with an `upstream:` block already are left alone, and so are Anthropic's
 * vendor-published ones whose body cites docs.anthropic.com (Mike, 2026-10-23:
 * vendor pages count as a source); those get `upstream: { match: vendor, url }`.
 *
 * Usage (repo root), with clones made by `git clone --depth 1`:
 *   node scripts/attribute-system-prompts.mjs --clone <dir>=<owner/repo> [--clone …] [--write] [--report out.md]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const HISTORY = args.includes("--history");
const REPORT = args.includes("--report") ? args[args.indexOf("--report") + 1] : null;
const clones = args.flatMap((a, i) => (a === "--clone" ? [args[i + 1]] : [])).map((s) => {
  const [dir, repo] = s.split("=");
  // A folder fetched file by file (a repo too big to clone here) carries its commit in `.ref`.
  const refFile = path.join(dir, ".ref");
  const ref = fs.existsSync(refFile) ? fs.readFileSync(refFile, "utf8").trim()
    : execFileSync("git", ["-C", dir, "rev-parse", "HEAD"]).toString().trim();
  return { dir, repo, ref };
});
if (!clones.length) { console.error("usage: --clone <dir>=<owner/repo> ..."); process.exit(2); }

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const SP = path.join(ROOT, "site", "library", "5_System_Prompts");
const today = new Date().toISOString().slice(0, 10);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const sig = (text) => [...new Set(text.split("\n").map(norm).filter((l) => l.length >= 20))];
const split = (raw) => {
  const t = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return { fm: "", body: t };
  const end = t.indexOf("\n---", 3);
  return end === -1 ? { fm: "", body: t } : { fm: t.slice(4, end), body: t.slice(end + 4) };
};
const walk = (dir, keep, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, keep, out); else if (keep(e.name)) out.push(p);
  }
  return out;
};

// ---------- index every upstream line ----------
const files = [];                 // { repo, ref, path, lines: Set, blob?, dir? } — `blob` marks a historical version
const byLine = new Map();         // line -> [file index]
const TEXT = (n) => /\.(md|txt|xml|js|ts|json|yaml|yml)$/i.test(n) && !/(^|\/)readme/i.test(n);
const add = (entry, text) => {
  const lines = sig(text);
  if (!lines.length) return;
  const i = files.push({ ...entry, lines: new Set(lines) }) - 1;
  for (const l of lines) (byLine.get(l) ?? byLine.set(l, []).get(l)).push(i);
};
for (const c of clones) {
  const current = new Set();
  for (const f of walk(c.dir, TEXT)) {
    if (fs.statSync(f).size > 2_000_000) continue;
    const p = path.relative(c.dir, f).split(path.sep).join("/");
    add({ repo: c.repo, ref: c.ref, path: p }, fs.readFileSync(f, "utf8"));
  }
  if (!HISTORY || !fs.existsSync(path.join(c.dir, ".git"))) continue;
  for (const l of execFileSync("git", ["-C", c.dir, "ls-tree", "-r", "HEAD"]).toString().split("\n")) if (l) current.add(l.split(/\s+/)[2]);
  // Every blob any commit ever had at a text path, minus the ones still at HEAD.
  const objs = execFileSync("git", ["-C", c.dir, "rev-list", "--objects", "--all"], { maxBuffer: 1 << 28 }).toString()
    .split("\n").map((l) => l.split(" ")).filter(([sha, p]) => sha && p && TEXT(p) && !current.has(sha));
  const seen = new Set();
  const want = objs.filter(([sha]) => !seen.has(sha) && seen.add(sha));
  const out = spawnSync("git", ["-C", c.dir, "cat-file", "--batch"], { input: want.map(([s]) => s).join("\n") + "\n", maxBuffer: 1 << 30 }).stdout;
  let at = 0;
  for (const [sha, p] of want) {
    const nl = out.indexOf(10, at);
    const size = Number(out.subarray(at, nl).toString().split(" ")[2]);
    const body = out.subarray(nl + 1, nl + 1 + size).toString("utf8");
    at = nl + 1 + size + 1;
    if (size <= 2_000_000) add({ repo: c.repo, path: p, blob: sha, dir: c.dir }, body);
  }
}
console.error(`indexed ${files.length} upstream files from ${clones.length} repos`);

// ---------- match ----------
const rows = [];
for (const f of walk(SP, (n) => n.endsWith(".md") && n !== "README.md")) {
  const rel = path.relative(path.join(SP, ".."), f).split(path.sep).join("/");
  const raw = fs.readFileSync(f, "utf8");
  const { fm, body } = split(raw);
  if (/^upstream:/m.test(fm)) { rows.push({ rel, verdict: "already" }); continue; }

  const vendor = body.match(/https:\/\/docs\.anthropic\.com\/[^\s>)]+/);
  const mine = sig(body);
  const hits = new Map();
  for (const l of mine) for (const i of byLine.get(l) ?? []) hits.set(i, (hits.get(i) || 0) + 1);
  let best = null;
  for (const [i, n] of hits) {
    const cover = n / mine.length, back = n / files[i].lines.size;
    // Same coverage: a file still at HEAD beats an old version of one.
    const better = !best || cover > best.cover
      || (cover === best.cover && (!!files[best.i].blob > !!files[i].blob || back > best.back));
    if (better) best = { i, cover, back };
  }

  let block = null, verdict;
  if (best && best.cover >= 0.6) {
    const u = files[best.i];
    // A historical version: the commit that added that blob is one that holds it at that path.
    const ref = u.blob
      ? execFileSync("git", ["-C", u.dir, "log", "--all", "-1", "--format=%H", `--find-object=${u.blob}`]).toString().trim()
      : u.ref;
    const match = u.blob ? "fork" : best.cover >= 0.95 && best.back >= 0.95 ? "exact" : "similar";
    block = ["upstream:", `  match: ${match}`, ...(u.blob ? ["  note: an earlier capture; the collection has since replaced or removed it"] : []),
      `  repo: ${u.repo}`, `  path: ${u.path}`, `  ref: ${ref}`, `  checked: ${today}`];
    verdict = { repo: u.repo, path: u.path, match, cover: best.cover };
  } else if (vendor) {
    block = ["upstream:", "  match: vendor", `  url: ${vendor[0]}`, `  checked: ${today}`];
    verdict = { vendor: vendor[0] };
  } else {
    verdict = { none: true, cover: best?.cover ?? 0, near: best ? `${files[best.i].repo}/${files[best.i].path}` : "" };
  }
  rows.push({ rel, ...verdict });

  if (WRITE && block) {
    const crlf = raw.includes("\r\n");
    const t = raw.replace(/\r\n/g, "\n");
    let out = t.startsWith("---\n")
      ? t.replace(/^---\n([\s\S]*?)\n---/, (_a, f0) => `---\n${f0}\n${block.join("\n")}\n---`)
      : `---\n${block.join("\n")}\n---\n\n${t}`;
    if (crlf) out = out.replace(/\n/g, "\r\n");
    fs.writeFileSync(f, out);
  }
}

// ---------- report ----------
const got = rows.filter((r) => r.repo), ven = rows.filter((r) => r.vendor), none = rows.filter((r) => r.none);
const md = [`# System prompt attribution — ${today}`, "",
  `${rows.length} files: **${got.length}** matched a GitHub collection, **${ven.length}** vendor-published (docs.anthropic.com), ` +
  `**${none.length}** no source found, ${rows.filter((r) => r.verdict === "already").length} already stamped.`, "",
  "## No source found", "", "| file | best overlap | nearest |", "|:---|---:|:---|",
  ...none.map((r) => `| \`${r.rel}\` | ${Math.round(r.cover * 100)}% | ${r.near} |`), "",
  "## Matched", "", "| file | repo | path | match | overlap |", "|:---|:---|:---|:---|---:|",
  ...got.map((r) => `| \`${r.rel}\` | ${r.repo} | ${r.path} | ${r.match} | ${Math.round(r.cover * 100)}% |`), ""];
if (REPORT) fs.writeFileSync(REPORT, md.join("\n")); else console.log(md.join("\n"));
console.error(`matched ${got.length}, vendor ${ven.length}, none ${none.length}`);
