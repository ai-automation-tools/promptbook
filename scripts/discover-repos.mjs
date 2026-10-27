#!/usr/bin/env node
/**
 * Find new and popular GitHub repos of the kinds this library vendors (skills,
 * prompts, agent definitions, MCP servers) and queue them in `docs/DISCOVERY.md`
 * for a human to accept or reject. Nothing is vendored here: that is the Catalog
 * Refresh job's work once a row says `accept`, and only after it has read the
 * licence. Rows that say `link` get a Resources-menu entry
 * (`site/library/resources.json`) from this script, so the top-right menu grows
 * without anyone editing React.
 *
 * Why a ledger and not an auto-import: a public library that copies a repo is
 * republishing it. Licence, quality and fit are a person's call; finding the
 * candidates and remembering what was already decided is the script's.
 *
 * Usage (from the repo root, needs the gh CLI signed in):
 *   node scripts/discover-repos.mjs                 # report
 *   node scripts/discover-repos.mjs --write         # append pending rows, add resource links
 *   node scripts/discover-repos.mjs --min-stars 300 --days 180
 *
 * "New": created within --days (default 365) and at least --min-stars (default 200).
 * "Popular": any age, at least 10x --min-stars. Anything the library already
 * tracks (an `upstream.repo` or bare `repo:` in frontmatter, a row in the ledger, a link in
 * resources.json, a row in docs/UPSTREAMS.md) is skipped.
 *
 * Prints `FOUND`, `LINKED`, `SKIPPED` lines and a final `RUN SUMMARY:`.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const arg = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const WRITE = args.includes("--write");
const MIN_STARS = Number(arg("--min-stars", 500));
const DAYS = Number(arg("--days", 365));
const LIMIT = Number(arg("--limit", 25)); // rows appended per run, top by stars; the rest surface next week

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const LIB = path.join(ROOT, "site", "library");
const LEDGER = path.join(ROOT, "docs", "DISCOVERY.md");
const RESOURCES = path.join(LIB, "resources.json");
const UPSTREAMS = path.join(ROOT, "docs", "UPSTREAMS.md");
const TODAY = new Date().toISOString().slice(0, 10);
const since = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);

// What to look for. `kind` is the library section it would feed; `group` the
// Resources-menu column an accepted repo is linked under.
const QUERIES = [
  { kind: "skills", q: "claude skills", group: "skills" },
  { kind: "skills", q: "agent skills SKILL.md", group: "skills" },
  { kind: "skills", topic: "claude-skills", group: "skills" },
  { kind: "skills", topic: "agent-skills", group: "skills" },
  { kind: "prompts", q: "prompt library", group: "prompt-libraries" },
  { kind: "prompts", topic: "awesome-prompts", group: "prompt-libraries" },
  { kind: "prompts", topic: "system-prompts", group: "system-prompts" },
  { kind: "agents", q: "claude code subagents", group: "agents" },
  { kind: "agents", topic: "claude-code-agents", group: "agents" },
  { kind: "mcp", topic: "mcp-server", group: "agents" },
  { kind: "mcp", q: "awesome mcp servers", group: "agents" },
];
// Noise: repos that are about the subject but are tools, not content, and the
// leaked / extracted system-prompt dumps the catalog job must never vendor.
const EXCLUDE = /\b(cli|sdk|desktop|extension|plugin-marketplace|boilerplate|starter|template-repo)\b|leak|extract|jailbreak|system[-_]prompts[-_]and[-_]models/i;

const gh = (ghArgs) => {
  try { return JSON.parse(execFileSync("gh", ghArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) || "[]"); }
  catch (e) { console.error(`WARN: gh ${ghArgs.slice(0, 3).join(" ")} failed: ${String(e.stderr || e.message).trim().split("\n")[0]}`); return []; }
};

// ---------- what is already known ----------
const known = new Set();
const addKnown = (s) => { const m = String(s).match(/(?:github\.com\/)?([\w.-]+\/[\w.-]+?)(?:\.git|\/|$|\)|\s)/); if (m) known.add(m[1].toLowerCase()); };
const walkMd = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkMd(p, out); else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
};
for (const f of walkMd(LIB)) {
  const head = fs.readFileSync(f, "utf8").slice(0, 4000);
  // `upstream.repo` / `server.repo` (indented), and a bare `repo:` (guides, skill library cards).
  for (const m of head.matchAll(/^\s*repo:\s*["']?([\w.-]+\/[\w.-]+)/gm)) known.add(m[1].toLowerCase());
}
if (fs.existsSync(RESOURCES)) for (const g of JSON.parse(fs.readFileSync(RESOURCES, "utf8")).groups) for (const l of g.links) if (/github\.com/.test(l.href)) addKnown(l.href);
if (fs.existsSync(UPSTREAMS)) for (const m of fs.readFileSync(UPSTREAMS, "utf8").matchAll(/github\.com\/([\w.-]+\/[\w.-]+)/g)) known.add(m[1].toLowerCase());

const ledgerRaw = fs.existsSync(LEDGER) ? fs.readFileSync(LEDGER, "utf8") : "";
const rows = [...ledgerRaw.matchAll(/^\| \[?([\w.-]+\/[\w.-]+)\]?(?:\([^)]*\))? \| (\w+) \| ([\d,]+) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| (\w+) \| ([^|]*) \|$/gm)]
  .map((m) => ({ repo: m[1], kind: m[2], stars: m[3], licence: m[4].trim(), pushed: m[5].trim(), found: m[6].trim(), status: m[7], note: m[8].trim() }));
for (const r of rows) known.add(r.repo.toLowerCase());

// ---------- search ----------
const found = new Map();
let seen = 0;
for (const spec of QUERIES) {
  const ghArgs = ["search", "repos", ...(spec.q ? [spec.q] : []), ...(spec.topic ? ["--topic", spec.topic] : []),
    "--sort", "stars", "--limit", "30", `--stars=>=${MIN_STARS}`, "--json", "fullName,stargazersCount,createdAt,pushedAt,license,description,url"];
  for (const r of gh(ghArgs)) {
    seen++;
    const name = r.fullName.toLowerCase();
    if (known.has(name) || found.has(name)) continue;
    if (EXCLUDE.test(`${r.fullName} ${r.description || ""}`) && !/awesome/i.test(r.fullName)) continue;
    const isNew = r.createdAt >= since;
    const isPopular = r.stargazersCount >= MIN_STARS * 10;
    if (!isNew && !isPopular) continue;
    found.set(name, { ...r, kind: spec.kind, group: spec.group, why: isNew ? "new" : "popular" });
  }
}

const licenceOf = (r) => r.license?.key && r.license.key !== "other" ? r.license.key : (r.license?.name || "none");
const picked = [...found.values()].sort((a, b) => b.stargazersCount - a.stargazersCount).slice(0, LIMIT);
for (const r of picked) {
  console.log(`FOUND ${r.fullName} (${r.stargazersCount}★, ${r.kind}, ${licenceOf(r)}, ${r.why}) ${(r.description || "").slice(0, 90)}`);
}

// ---------- resources.json: link every `link` row that is not there yet ----------
// (accepted repos show up in the library itself, so they are not linked as well)
const linked = [];
if (fs.existsSync(RESOURCES)) {
  const res = JSON.parse(fs.readFileSync(RESOURCES, "utf8"));
  const have = new Set(res.groups.flatMap((g) => g.links.map((l) => l.href.toLowerCase().replace(/\/$/, ""))));
  const GROUP_FOR_KIND = { skills: "skills", prompts: "prompt-libraries", agents: "agents", mcp: "agents" };
  for (const r of rows) {
    if (r.status !== "link") continue;
    const href = `https://github.com/${r.repo}`;
    if (have.has(href.toLowerCase())) continue;
    const g = res.groups.find((x) => x.id === GROUP_FOR_KIND[r.kind]);
    if (!g) continue;
    g.links.push({ label: r.repo.split("/")[1].replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 28), href, icon: "github" });
    linked.push(r.repo);
    console.log(`LINKED ${r.repo} -> Resources › ${g.label}`);
  }
  if (WRITE && linked.length) fs.writeFileSync(RESOURCES, JSON.stringify(res, null, 2) + "\n", "utf8");
}

// ---------- ledger ----------
if (WRITE && picked.length) {
  const line = (r) => `| [${r.fullName}](${r.url}) | ${r.kind} | ${r.stargazersCount.toLocaleString("en-US")} | ${licenceOf(r)} | ${r.pushedAt.slice(0, 10)} | ${TODAY} | pending | ${r.why}${licenceOf(r) === "none" ? "; no licence, ask before vendoring" : ""} |`;
  const newLines = picked.map(line);
  const marker = "<!-- discover-repos: new rows go above this line -->";
  const at = ledgerRaw.indexOf(marker);
  if (at === -1) { console.error(`ERROR: ${path.relative(ROOT, LEDGER)} has no "${marker}" marker`); process.exit(2); }
  fs.writeFileSync(LEDGER, ledgerRaw.slice(0, at) + newLines.join("\n") + "\n" + ledgerRaw.slice(at), "utf8");
}

console.log(`RUN SUMMARY: found ${found.size} new (${picked.length} queued, top by stars), ${seen - found.size} already known or filtered, ${linked.length} linked into Resources${WRITE ? "" : " (dry run)"}`);
