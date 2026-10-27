/**
 * Self-check for toMarkdownFile (src/lib/markdown-file.ts), the Download button's
 * file: it must read back through the My Library store unchanged — YAML-awkward
 * titles, tags as a list, the body exactly, and a skill's extra frontmatter.
 *
 * Runs against a throwaway folder, never site/my-library.
 * Run: npm run test:markdown-file   (from site/)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "markdown-file-test-"));
process.env.MY_LIBRARY_DIR = dir;
const { myLibrary } = await import("../lib/my-library.ts");
const { toMarkdownFile } = await import("../src/lib/markdown-file.ts");

const base = { id: "x", section: "4_Prompts", category: "Dev: Tools", subcategory: null, lastModified: "2026-10-23T00:00:00.000Z" };
const cases = [
  { ...base, title: "Code Review: Strict!", tags: ["a, b", "c"], content: "# Body\n\nLine two: with colon\n" },
  { ...base, title: 'She said "hi" — it\'s #1', tags: [], content: "---\nnot frontmatter, just a rule\n---\nend" },
  { ...base, title: "Line one\nline two", subcategory: "Sub: Cat", tags: ["😀", "naïve"], content: "Ünïcode 🚀" },
  { ...base, title: "my-skill", section: "3_Skills", tags: ["skill"], content: "Do the thing.\n",
    extra: { name: "my-skill", description: "Use when: testing.", license: "MIT", "allowed-tools": ["Read", "Grep"], metadata: { version: 2 } } },
];

try {
  for (const [i, prompt] of cases.entries()) {
    const file = toMarkdownFile(prompt);
    const id = `case-${i}`;
    fs.writeFileSync(path.join(dir, `${id}.md`), file);
    const back = myLibrary.get(id);
    assert.equal(back.title, prompt.title, `title ${i}`);
    assert.equal(back.category, prompt.category, `category ${i}`);
    assert.equal(back.subcategory, prompt.subcategory, `subcategory ${i}`);
    assert.deepEqual(back.tags, prompt.tags, `tags stay a list ${i}`);
    assert.equal(back.content, prompt.content, `body exact ${i}`);
    for (const [k, v] of Object.entries(prompt.extra ?? {})) assert.deepEqual(back.extra[k], v, `extra ${k}`);
  }
  // A skill's file still opens with name and description, so it loads as a skill
  assert.match(toMarkdownFile(cases[3]), /^---\nname: "my-skill"\ndescription: /);
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log(`markdown-file: ${cases.length} downloads read back unchanged (colons, quotes, newlines, list tags, skill frontmatter)`);
