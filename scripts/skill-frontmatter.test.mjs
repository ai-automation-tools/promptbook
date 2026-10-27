// Self-check for the frontmatter rewriting in fix-skill-frontmatter.mjs.
// Both quote cases below are real files in this library that the first version
// of the script corrupted, so they are regression tests, not hypotheticals.
// Run: node scripts/skill-frontmatter.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "../site/lib/frontmatter.js";

// Mirrors of the helpers under test.
const hasKey = (fm, key) => new RegExp(`^${key}:`, "m").test(fm);

const readKey = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:[ \\t]*(.*)$`, "m"));
  if (!m) return null;
  const v = m[1].trim();
  const wrapped = v.length >= 2 && (v[0] === '"' || v[0] === "'") && v.at(-1) === v[0];
  return wrapped ? v.slice(1, -1) : v;
};

const deriveDescription = (body) => {
  const lines = body.replace(/^\s+/, "").split("\n");
  let i = 0;
  while (i < lines.length && (!lines[i].trim() || lines[i].startsWith("#"))) i++;
  const para = [];
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) break;
    if (/^(#|\||```|>|[-*+]\s|\d+\.\s)/.test(l)) break;
    para.push(l);
  }
  return para.join(" ").replace(/\*\*(.+?)\*\*/g, "$1").replace(/[*_`]/g, "")
    .replace(/\s+/g, " ").trim();
};

// --- quoted vs quote-containing values ---
assert.equal(readKey(`name: "mcp-builder"`, "name"), "mcp-builder", "fully wrapped -> unwrap");
assert.equal(readKey(`name: mcp-builder`, "name"), "mcp-builder", "bare -> unchanged");
// Regression: an unquoted scalar that contains quotes must NOT lose its last char.
assert.equal(readKey(`name: 🐛 "playwright"`, "name"), `🐛 "playwright"`);
assert.equal(readKey(`title: 'a'`, "title"), "a");
assert.equal(readKey(`title: it's fine`, "title"), "it's fine", "apostrophe is not a wrapper");

// --- present-but-empty vs absent ---
// Regression: `description:` with indented continuation lines is a real value.
// Reading it as missing and inserting a new line orphans the continuation and
// makes the file unparseable, which silently drops the skill from the index.
const multiline = `name: x\ndescription:\n  Line one of the value\n  and line two\nusage:\n  something`;
assert.equal(readKey(multiline, "description"), "", "multi-line reads as empty");
assert.equal(hasKey(multiline, "description"), true, "...but is present");
assert.equal(hasKey(`name: x`, "description"), false);
assert.equal(readKey(`name: x`, "description"), null);

// The nested upstream block must not be mistaken for a top-level key.
const withUpstream = `name: x\nupstream:\n  match: exact\n  repo: a/b`;
assert.equal(hasKey(withUpstream, "match"), false, "indented keys are not top-level");
assert.equal(hasKey(withUpstream, "repo"), false);

// --- description derivation, both body shapes ---
assert.equal(deriveDescription("# Title\n\nA one line summary.\n\n## Overview\nmore"),
  "A one line summary.");
assert.equal(deriveDescription("# Title\n\n## Overview\nThe summary lives here.\n\n## Next"),
  "The summary lives here.");
// Leading "**Purpose**: ..." is prose, not a list item.
assert.equal(deriveDescription("# T\n\n## Overview\n\n**Purpose**: Does a thing\n"),
  "Purpose: Does a thing");
// A real list marker still stops it.
assert.equal(deriveDescription("# T\n\n- bullet one\n- bullet two"), "");

// --- every shipped file still parses, and the spec holds ---
const LIB = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..", "site", "library", "3_Skills");
if (fs.existsSync(LIB)) {
  const walk = (d, out = []) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (e.name === "SKILL.md") out.push(p);
    }
    return out;
  };
  let checked = 0, badName = [], unparseable = [], noName = [];
  for (const f of walk(LIB)) {
    let data;
    try { data = matter(fs.readFileSync(f, "utf8")).data; }
    catch { unparseable.push(path.relative(LIB, f)); continue; }
    checked++;
    const dir = path.basename(path.dirname(f));
    const want = dir.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!data.name) { noName.push(path.relative(LIB, f)); continue; }
    if (String(data.name) !== want) badName.push(`${path.relative(LIB, f)}: ${data.name} != ${want}`);
  }
  assert.deepEqual(unparseable, [], "every SKILL.md must parse");
  assert.deepEqual(noName, [], "every SKILL.md must have a name");
  assert.deepEqual(badName.slice(0, 5), [], "name must equal the directory slug");
  console.log(`  ${checked} SKILL.md files parse, all names match their directory`);
}

// site/lib/frontmatter.js turns off gray-matter's eval engine: a `---js` file
// must fail to parse, never run. And nothing in site/ may bypass the wrapper.
{
  globalThis.__fmRan = false;
  assert.throws(() => matter(["---js", "{ x: globalThis.__fmRan = true }", "---", "body"].join("\n")), /not allowed/);
  assert.throws(() => matter(["---javascript", "{ x: 1 }", "---", "body"].join("\n")), /not allowed/);
  assert.equal(globalThis.__fmRan, false, "JavaScript front matter must never run");
  assert.equal(matter(["---", "name: x", "---", "body"].join("\n")).data.name, "x", "YAML still parses");

  const SITE = path.resolve("site");
  const direct = [];
  for (const dir of ["api", "lib", "mcp", "scripts", "src"]) {
    const root = path.join(SITE, dir);
    if (!fs.existsSync(root)) continue;
    for (const f of fs.readdirSync(root, { recursive: true })) {
      if (!/\.(m?[jt]sx?)$/.test(f) || f === "frontmatter.js") continue;
      if (/from ["']gray-matter["']/.test(fs.readFileSync(path.join(root, f), "utf8"))) direct.push(`${dir}/${f}`);
    }
  }
  assert.deepEqual(direct, [], "import site/lib/frontmatter.js, not gray-matter");
  console.log("  JavaScript front matter is refused; every site/ parse goes through the wrapper");
}

console.log("skill-frontmatter: all checks passed");
