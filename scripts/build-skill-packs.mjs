#!/usr/bin/env node
/**
 * Keep `site/library/3_Skills/packs/` in step with the skills tree.
 *
 * Two jobs, both deterministic, so the Monthly Upkeep runs this instead of asking
 * a model to write JSON:
 *
 *   1. Generated packs. Every `Category/Subcategory` (or bare `Category`) folder
 *      under 3_Skills with at least MIN skills gets a pack, `generated: true`, at
 *      `packs/<category>/<category>-<sub>-pack.json`, listing every skill in it
 *      with name and description read from its SKILL.md. Re-running rewrites only
 *      files marked `generated`; a group that drops below MIN loses its pack.
 *      `version` bumps (patch) and `updated_at` moves only when the skill list or
 *      a listed name/description changed, so a no-op run leaves no diff.
 *   2. Hand packs. Every other pack's `skills[].path` must exist. With --write a
 *      dead path is dropped (version patch bump, updated_at today); without it the
 *      dead path is reported. Hand packs are never otherwise edited.
 *
 * Usage (from the repo root):
 *   node scripts/build-skill-packs.mjs            # report what would change
 *   node scripts/build-skill-packs.mjs --write
 *
 * Prints one `PACK <action> <id>` line per pack it would touch and a final
 * `RUN SUMMARY:` line. Exit 0 whenever it ran.
 */
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const MIN = 6;
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const SITE = path.join(ROOT, "site");
const SKILLS = path.join(SITE, "library", "3_Skills");
const PACKS = path.join(SKILLS, "packs");
const TODAY = new Date().toISOString().slice(0, 10);
const EMOJI = {
  AI_ML: "🤖", Business: "💼", Content: "✍️", Data: "📊", Design: "🎨", Development: "💻",
  Enterprise: "🏢", Finance: "💰", Platform_Integrations: "🔌", Security: "🛡️",
};
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const human = (s) => s.replace(/_/g, " ");

// ---------- read the skills tree ----------
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (p !== PACKS) walk(p, out); }
    else if (e.name === "SKILL.md") out.push(p);
  }
  return out;
};
const frontmatter = (raw) => {
  const t = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!t.startsWith("---\n")) return {};
  const end = t.indexOf("\n---", 3);
  const fm = end === -1 ? "" : t.slice(4, end);
  const get = (k) => {
    const m = fm.match(new RegExp(`^${k}:[ \\t]*(.*)$`, "m"));
    if (!m) return "";
    let v = m[1].trim();
    if (/^[>|]/.test(v)) { // block scalar: first non-empty continuation line
      const after = fm.slice(m.index + m[0].length).split("\n").find((l) => l.trim());
      v = after ? after.trim() : "";
    }
    return v.replace(/^["']|["']$/g, "");
  };
  const tags = (() => {
    const m = fm.match(/^tags:[ \t]*(\[.*\])/m);
    if (m) { try { return JSON.parse(m[1].replace(/'/g, '"')); } catch { return []; } }
    const block = fm.match(/^tags:[ \t]*\n((?:[ \t]+-.*\n?)*)/m);
    return block ? block[1].split("\n").map((l) => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean) : [];
  })();
  return { name: get("name"), title: get("title"), description: get("description"), tags };
};
const stripEmoji = (s) => s.replace(/^[^\p{L}\p{N}"'\[]+/u, "").replace(/^["']|["']$/g, "").trim();

const groups = new Map(); // key "Development/Git" -> [{rel, name, description, tags}]
for (const f of walk(SKILLS)) {
  const rel = path.relative(SKILLS, path.dirname(f)).split(path.sep).join("/");
  const parts = rel.split("/");
  parts.pop(); // the skill folder itself
  if (!parts.length) continue;
  const key = parts.slice(0, 2).join("/");
  const fm = frontmatter(fs.readFileSync(f, "utf8"));
  const name = fm.name ? human(fm.name).replace(/\b\w/g, (c) => c.toUpperCase()) : stripEmoji(fm.title) || human(path.basename(rel));
  const description = (fm.description || "").split(/(?<=\.)\s/)[0].slice(0, 220);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push({ rel, name, description, tags: fm.tags || [] });
}

// ---------- existing packs ----------
const packFiles = (d, out = []) => {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) packFiles(p, out);
    else if (e.name.endsWith(".json")) out.push(p);
  }
  return out;
};
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
const writeJson = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n", "utf8"); };
const bump = (v) => { const [a = 1, b = 0, c = 0] = String(v || "1.0.0").split(".").map(Number); return `${a}.${b}.${c + 1}`; };
const sameSkills = (a, b) => JSON.stringify(a.map((s) => [s.path, s.name, s.description])) === JSON.stringify(b.map((s) => [s.path, s.name, s.description]));

const existing = new Map(packFiles(PACKS).map((p) => [p, readJson(p)]));
const generatedById = new Map([...existing].filter(([, j]) => j.generated).map(([p, j]) => [j.id, p]));
const written = [], unchanged = [], removed = [], fixed = [], dead = [];

// 1. generated packs
const wanted = new Set();
for (const [key, skills] of [...groups].sort()) {
  if (skills.length < MIN) continue;
  const [category, sub] = key.split("/");
  const id = `${slug(category)}${sub ? "-" + slug(sub) : ""}-pack`;
  wanted.add(id);
  const file = generatedById.get(id) || path.join(PACKS, slug(category), `${id}.json`);
  const prev = existing.get(file);
  skills.sort((a, b) => a.rel.localeCompare(b.rel));
  const tagCount = new Map();
  for (const s of skills) for (const t of s.tags) if (!["skill", slug(category), sub && slug(sub)].includes(t)) tagCount.set(t, (tagCount.get(t) || 0) + 1);
  const topTags = [...tagCount].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  const pack = {
    name: `${human(sub || category)} Pack`,
    id,
    description: `Every skill under 3_Skills/${key} (${skills.length}), bundled so the whole folder installs in one click. Generated from the library tree; see the folder for the individual skills.`,
    icon: EMOJI[category] || "🧰",
    version: prev?.version || "1.0.0",
    author: "promptbook",
    generated: true,
    tags: [slug(category), sub && slug(sub), ...topTags].filter(Boolean),
    category,
    skills: skills.map((s) => ({ path: `library/3_Skills/${s.rel}/SKILL.md`, name: s.name, description: s.description })),
    created_at: prev?.created_at || TODAY,
    updated_at: prev?.updated_at || TODAY,
  };
  if (prev && sameSkills(prev.skills || [], pack.skills) && prev.name === pack.name && prev.description === pack.description) { unchanged.push(id); continue; }
  if (prev) { pack.version = bump(prev.version); pack.updated_at = TODAY; }
  if (WRITE) writeJson(file, pack);
  written.push(id);
  console.log(`PACK ${prev ? "UPDATED" : "CREATED"} ${id} (${skills.length} skills, 3_Skills/${key})`);
}
for (const [id, file] of generatedById) {
  if (wanted.has(id)) continue;
  if (WRITE) fs.rmSync(file);
  removed.push(id);
  console.log(`PACK REMOVED ${id} (group fell below ${MIN} skills)`);
}

// 2. hand packs: dead paths
for (const [file, pack] of existing) {
  if (pack.generated) continue;
  const bad = (pack.skills || []).filter((s) => !fs.existsSync(path.join(SITE, s.path)));
  if (!bad.length) continue;
  for (const b of bad) console.log(`PACK DEAD-PATH ${pack.id}: ${b.path}`);
  if (WRITE) {
    pack.skills = pack.skills.filter((s) => !bad.includes(s));
    pack.version = bump(pack.version);
    pack.updated_at = TODAY;
    writeJson(file, pack);
    fixed.push(pack.id);
    console.log(`PACK FIXED ${pack.id} (dropped ${bad.length})`);
  } else dead.push(pack.id);
}

console.log(`RUN SUMMARY: generated ${written.length} written, ${unchanged.length} unchanged, ${removed.length} removed; hand packs ${WRITE ? `${fixed.length} fixed` : `${dead.length} with dead paths`}${WRITE ? "" : " (dry run)"}`);
