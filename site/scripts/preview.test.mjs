/**
 * Self-check for card blurbs: a README that opens with badge rows must still give
 * the card text, not "[](LICENSE.md) [](https://arxiv.org/".
 * previewOf (api/index.ts) cuts the My Library preview; stripMarkdown
 * (src/components/PromptCard.tsx) turns a preview into the blurb.
 *
 * Run: npm run test:preview   (from site/)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

process.env.MY_LIBRARY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "preview-test-"));
const { previewOf } = await import("../api/index.ts");
globalThis.__READ_ONLY__ = false; // Vite defines it at build time; PromptCard reads it via src/lib/mode
const { stripMarkdown } = await import("../src/components/PromptCard.tsx");

const readme = [
  "# Scientific Agent Skills",
  "",
  "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)",
  "[![arXiv](https://img.shields.io/badge/arXiv-2609.00065-b31b1b.svg)](https://arxiv.org/abs/2609.00065)",
  "![Logo](logo.png)",
  "",
  "A collection of **177 scientific and research skills** for AI agents.",
].join("\n");

const blurb = stripMarkdown(previewOf(readme));
assert.equal(blurb, "A collection of 177 scientific and research skills for AI agents.");

// Badges inline with text, and a preview cut off inside a link
assert.equal(stripMarkdown("See [![CI](b.svg)](ci) the [docs](d.md) and"), "See the docs and");
assert.equal(stripMarkdown("Read the guide [![arXiv](https://img.shields.io/b.svg)](https://arxiv.org/"), "Read the guide");
assert.equal(stripMarkdown("Cut mid [link text"), "Cut mid");

// A body with no badges is untouched by previewOf
assert.equal(previewOf("Plain body"), "Plain body");

console.log("preview: badge rows and cut-off links leave a clean blurb");
process.exit(0);
