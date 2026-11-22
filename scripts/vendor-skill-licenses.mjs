#!/usr/bin/env node
// Give every copied item its licence: `license:` (SPDX) in its upstream block (PB-17), and for a
// skill also a LICENSE file beside SKILL.md, so a skill ZIP or Skill Pack carries the terms it
// was copied under. Skills, agents, prompts and system prompts alike.
// A skill's own licence file wins; otherwise the source repo's licence is fetched with `gh`.
// A licence already stamped stands: a changed upstream licence is the drift check's
// `relicensed` verdict, for a person to look at, never silently re-stamped here.
// A repo with no licence gets `license: NONE`: upstream.test.mjs then fails until the item is
// archived or the licence is cleared. A system prompt quoted from the vendor's own page
// (`match: vendor`, no repo) gets `license: NOASSERTION`: no licence is claimed for it.
//
// Usage (repo root, needs an authenticated `gh`):
//   node scripts/vendor-skill-licenses.mjs           # report
//   node scripts/vendor-skill-licenses.mjs --write   # then: cd site && npm run build:index
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WRITE = process.argv.includes("--write");
const LIB = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "site", "library");
/** The sections whose items are copied from elsewhere; guides and MCP cards are written here. */
const COPIED = ["2_Agents", "3_Skills", "4_Prompts", "5_System_Prompts"];
export const LICENSE_FILE = /^(LICENSE|COPYING)(\.(md|txt))?$/i;

/** SPDX id from a licence text; NOASSERTION when it is not plain MIT or Apache-2.0. */
const spdxOf = (text) =>
  /^\s*MIT License\s*\n/.test(text) ? "MIT"
  : /^\s*Apache License\s*\n\s*Version 2\.0/.test(text) ? "Apache-2.0"
  : "NOASSERTION";

const gh = (p) => JSON.parse(execFileSync("gh", ["api", p], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
const isSkill = (p) => path.basename(p) === "SKILL.md";
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (d.includes(`${path.sep}3_Skills`) ? isSkill(p) : e.name.endsWith(".md") && e.name.toLowerCase() !== "readme.md") out.push(p);
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
for (const file of COPIED.flatMap((sec) => walk(path.join(LIB, sec)))) {
  const raw = fs.readFileSync(file, "utf8");
  const block = raw.match(/^upstream:\n((?:[ \t]+.*\n)*)/m);
  if (!block) continue;
  const repo = block[1].match(/^\s+repo:\s*(\S+)/m)?.[1];
  const vendor = /^\s+match:\s*vendor\s*$/m.test(block[1]);
  if (!repo && !vendor) continue;
  const skill = isSkill(file);
  const dir = path.dirname(file);
  const own = skill ? fs.readdirSync(dir).find((n) => LICENSE_FILE.test(n)) : undefined;
  // A licence already stamped stands (a rerun reads back the file it wrote, whose text
  // spdxOf may not name, CC0 for one).
  const stamped = block[1].match(/^\s+license:\s*(\S+)/m)?.[1];
  const lic = !repo ? { spdx: "NOASSERTION", text: null }
    : own ? { spdx: stamped && stamped !== "NONE" ? stamped : spdxOf(fs.readFileSync(path.join(dir, own), "utf8")), text: null }
    : !skill && stamped && stamped !== "NONE" ? { spdx: stamped, text: null }
    : repoLicense(repo);
  const lines = block[1].split("\n").filter((l) => l && !/^\s+license:/.test(l));
  const next = stamped === lic.spdx ? raw // already right, wherever in the block it sits
    : raw.replace(block[0], ["upstream:", ...lines, `  license: ${lic.spdx}`].join("\n") + "\n");
  const addFile = skill && !own && lic.text;
  if (next === raw && !addFile) continue;
  changed++;
  const rel = path.relative(LIB, skill ? dir : file).split(path.sep).join("/");
  const why = own ? ` (own ${own})` : addFile ? ` (LICENSE from ${repo})` : !repo ? " (vendor page)" : lic.spdx === "NONE" ? ` (${repo} has no licence)` : "";
  console.log(`${WRITE ? "WROTE" : "WOULD WRITE"} ${rel}: ${lic.spdx}${why}`);
  if (!WRITE) continue;
  fs.writeFileSync(file, next);
  if (addFile) fs.writeFileSync(path.join(dir, "LICENSE"), lic.text);
}
console.log(`RUN SUMMARY: ${changed} item(s) ${WRITE ? "updated" : "to update"}`);
