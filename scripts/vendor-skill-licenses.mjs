#!/usr/bin/env node
// Give every vendored skill its licence: a LICENSE file beside SKILL.md and `license:` (SPDX)
// in its upstream block, so a skill ZIP or Skill Pack carries the terms it was copied under.
// A licence file already in the folder wins (it is the skill's own); otherwise the source
// repo's licence is fetched with `gh`. A repo with no licence gets `license: NONE` and no
// file: upstream.test.mjs then fails until the skill is archived or the licence is cleared.
//
// Usage (repo root, needs an authenticated `gh`):
//   node scripts/vendor-skill-licenses.mjs           # report
//   node scripts/vendor-skill-licenses.mjs --write   # then: cd site && npm run build:index
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WRITE = process.argv.includes("--write");
const SKILLS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "site", "library", "3_Skills");
export const LICENSE_FILE = /^(LICENSE|COPYING)(\.(md|txt))?$/i;

/** SPDX id from a licence text; NOASSERTION when it is not plain MIT or Apache-2.0. */
const spdxOf = (text) =>
  /^\s*MIT License\s*\n/.test(text) ? "MIT"
  : /^\s*Apache License\s*\n\s*Version 2\.0/.test(text) ? "Apache-2.0"
  : "NOASSERTION";

const gh = (p) => JSON.parse(execFileSync("gh", ["api", p], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name === "SKILL.md") out.push(p);
  }
  return out;
};

const cache = new Map();
function repoLicense(repo) {
  if (!cache.has(repo)) {
    try {
      const r = gh(`repos/${repo}/license`);
      const text = Buffer.from(r.content, "base64").toString("utf8").replace(/\r\n?/g, "\n");
      const id = r.license?.spdx_id;
      cache.set(repo, { text, spdx: id && id !== "NOASSERTION" ? id : spdxOf(text) });
    } catch { cache.set(repo, { text: null, spdx: "NONE" }); }
  }
  return cache.get(repo);
}

let changed = 0;
for (const file of walk(SKILLS)) {
  const raw = fs.readFileSync(file, "utf8");
  const block = raw.match(/^upstream:\n((?:[ \t]+.*\n)*)/m);
  const repo = block?.[1].match(/^\s+repo:\s*(\S+)/m)?.[1];
  if (!repo) continue;
  const dir = path.dirname(file);
  const own = fs.readdirSync(dir).find((n) => LICENSE_FILE.test(n));
  // A licence already stamped stands (a rerun reads back the file it wrote, whose text
  // spdxOf may not name, CC0 for one).
  const stamped = block[1].match(/^\s+license:\s*(\S+)/m)?.[1];
  const lic = own
    ? { spdx: stamped && stamped !== "NONE" ? stamped : spdxOf(fs.readFileSync(path.join(dir, own), "utf8")), text: null }
    : repoLicense(repo);
  const lines = block[1].split("\n").filter((l) => l && !/^\s+license:/.test(l));
  const next = raw.replace(block[0], ["upstream:", ...lines, `  license: ${lic.spdx}`].join("\n") + "\n");
  const addFile = !own && lic.text;
  if (next === raw && !addFile) continue;
  changed++;
  const rel = path.relative(SKILLS, dir).split(path.sep).join("/");
  console.log(`${WRITE ? "WROTE" : "WOULD WRITE"} ${rel}: ${lic.spdx}${own ? ` (own ${own})` : addFile ? ` (LICENSE from ${repo})` : ` (${repo} has no licence)`}`);
  if (!WRITE) continue;
  fs.writeFileSync(file, next);
  if (addFile) fs.writeFileSync(path.join(dir, "LICENSE"), lic.text);
}
console.log(`RUN SUMMARY: ${changed} skill(s) ${WRITE ? "updated" : "to update"}`);
