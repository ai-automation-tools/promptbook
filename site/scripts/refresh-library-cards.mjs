#!/usr/bin/env node
/**
 * Refresh every skill library card from GitHub: the repo's description and its whole
 * README, under the card's own header. Public cards are library/3_Skills/Libraries/*.md
 * (`repo:` in the frontmatter); My Library cards are items tagged `skill-library` whose
 * `source_url` is a GitHub repo. Only the body is rewritten (and My Library's `updated`);
 * a README that has not changed keeps its "copied" date, so a no-op run leaves no diff.
 *
 * Relative links and images in a README point into its repo, so they are made absolute
 * (blob URLs for links, raw URLs for images); otherwise they break on the card.
 *
 * Usage (from site/, needs an authenticated `gh`):
 *   node scripts/refresh-library-cards.mjs           # report what would change
 *   node scripts/refresh-library-cards.mjs --write   # then: npm run build:index
 *   ... --mine                                       # My Library cards only
 *   ... --add-mine owner/repo [--add-mine ...]       # create a My Library card first if it has none
 *                                                    # (AI Tools Sync does this for org repos with 2+ skills)
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const MINE_ONLY = argv.includes('--mine');
const ADD_MINE = argv.flatMap((a, i) => (a === '--add-mine' && argv[i + 1] ? [argv[i + 1]] : []));
const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CARDS = path.join(SITE, 'library', '3_Skills', 'Libraries');
const MY = path.resolve(SITE, process.env.MY_LIBRARY_DIR || 'my-library');
const TODAY = new Date().toISOString().slice(0, 10);
const MARK = /^\*The repo's README, copied (\d{4}-\d{2}-\d{2}):\*\n\n/m;

const gh = (...args) => execFileSync('gh', ['api', ...args], { encoding: 'utf8', maxBuffer: 16 << 20, stdio: ['ignore', 'pipe', 'pipe'] });

/** Make a README's repo-relative links and images absolute. */
function absolutize(md, repo, branch, dir) {
  const rel = (u) => !/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(u);
  const resolve = (u, kind) => {
    const clean = path.posix.normalize(u.startsWith('/') ? u.slice(1) : path.posix.join(dir, u));
    return kind === 'raw'
      ? `https://raw.githubusercontent.com/${repo}/${branch}/${clean}`
      : `https://github.com/${repo}/blob/${branch}/${clean}`;
  };
  return md
    .replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (m, pre, u) => (rel(u) ? pre + resolve(u, 'raw') : m))
    .replace(/(\]\()([^)\s]+)/g, (m, pre, u) => (rel(u) ? pre + resolve(u, 'blob') : m))
    .replace(/(<img\b[^>]*?\bsrc=["'])([^"']+)/gi, (m, pre, u) => (rel(u) ? pre + resolve(u, 'raw') : m))
    .replace(/(<a\b[^>]*?\bhref=["'])([^"']+)/gi, (m, pre, u) => (rel(u) ? pre + resolve(u, 'blob') : m))
    .replace(/^(\[[^\]]+\]:\s*)(\S+)/gm, (m, pre, u) => (rel(u) ? pre + resolve(u, 'blob') : m));
}

// The rewrite runs on third-party markdown, so it checks itself before every run.
{
  const a = (md) => absolutize(md, 'o/r', 'main', 'docs');
  assert.equal(a('![x](img/a.png)'), '![x](https://raw.githubusercontent.com/o/r/main/docs/img/a.png)');
  assert.equal(a('[x](./b.md#h)'), '[x](https://github.com/o/r/blob/main/docs/b.md#h)');
  assert.equal(a('[x](/LICENSE)'), '[x](https://github.com/o/r/blob/main/LICENSE)');
  assert.equal(a('[x](https://e.com) [y](#top) [z](mailto:a@b.c)'), '[x](https://e.com) [y](#top) [z](mailto:a@b.c)');
  assert.equal(a('<img src="logo.svg">'), '<img src="https://raw.githubusercontent.com/o/r/main/docs/logo.svg">');
  assert.equal(a('[![b](https://s.io/b.svg)](CONTRIBUTING.md)'), '[![b](https://s.io/b.svg)](https://github.com/o/r/blob/main/docs/CONTRIBUTING.md)');
}

function cardBody(repo, description, readme, oldBody) {
  const head = `# ${repo}\n\n${description}\n\nA skill library: browse and install its skills from ` +
    `[the repo on GitHub](https://github.com/${repo}). Promptbook keeps one card for it rather than a copy of each skill.\n`;
  if (readme == null) return `\n${head}`;
  const old = oldBody.match(MARK);
  const date = old && oldBody.slice(old.index + old[0].length).trimEnd() === readme.trimEnd() ? old[1] : TODAY;
  return `\n${head}\n---\n\n*The repo's README, copied ${date}:*\n\n${readme.trimEnd()}\n`;
}

function fetchRepo(repo) {
  const meta = JSON.parse(gh(`repos/${repo}`));
  let readme = null;
  try {
    const r = JSON.parse(gh(`repos/${repo}/readme`));
    const text = Buffer.from(r.content, 'base64').toString('utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    readme = absolutize(text, meta.full_name, meta.default_branch, path.posix.dirname(r.path));
  } catch { /* no README: the card keeps its header only */ }
  return { repo: meta.full_name, description: meta.description?.trim() || 'A collection of agent skills, published on GitHub.', readme };
}

/** Split at the closing `---` of the frontmatter; the body is everything after it. */
const split = (raw) => {
  const end = raw.indexOf('\n---', 4);
  return [raw.slice(0, end + 4), raw.slice(end + 4)];
};

/** The repo a My Library file is a card for (tagged `skill-library`, a GitHub `source_url`), else null. */
const mineRepo = (fm) =>
  (/^\s+- skill-library$/m.test(fm) && fm.match(/^source_url: '?https:\/\/github\.com\/([\w.-]+\/[\w.-]+?)'?$/m)?.[1]) || null;

// A new My Library card is just its frontmatter, in the store's format; the loop below fills
// the body. Same file naming as lib/my-library.ts: a slug plus a short random suffix.
for (const want of ADD_MINE) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(want)) throw new Error(`--add-mine wants owner/repo, got ${want}`);
  fs.mkdirSync(MY, { recursive: true });
  const has = fs.readdirSync(MY).filter(f => f.endsWith('.md'))
    .some(f => mineRepo(split(fs.readFileSync(path.join(MY, f), 'utf8'))[0])?.toLowerCase() === want.toLowerCase());
  if (has) continue;
  const repo = JSON.parse(gh(`repos/${want}`)).full_name;
  const id = `${repo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)}-${Math.random().toString(16).slice(2, 8)}`;
  const now = new Date().toISOString();
  console.log(`${WRITE ? 'ADDED' : 'WOULD ADD'} my-library/${id}.md (${repo})`);
  if (WRITE) {
    fs.writeFileSync(path.join(MY, `${id}.md`), [
      '---', `title: ${repo}`, 'section: 3_Skills', 'category: Libraries', 'subcategory: null', 'tags:', '  - skill-library',
      `source_url: 'https://github.com/${repo}'`, `created: '${now}'`, `updated: '${now}'`, '---', '',
    ].join('\n'));
  }
}

let changed = 0;
const targets = [
  ...(MINE_ONLY ? [] : fs.readdirSync(CARDS)).filter(f => f.endsWith('.md')).map(f => ({ file: path.join(CARDS, f), mine: false })),
  ...(fs.existsSync(MY) ? fs.readdirSync(MY).filter(f => f.endsWith('.md')).map(f => ({ file: path.join(MY, f), mine: true })) : []),
];
for (const { file, mine } of targets) {
  const raw = fs.readFileSync(file, 'utf8');
  const [fm, body] = split(raw);
  const repo = mine ? mineRepo(fm) : fm.match(/^repo: (\S+)$/m)?.[1];
  if (!repo) continue;
  const r = fetchRepo(repo);
  // Public cards were written with the description in frontmatter; keep the two in step.
  let nextFm = mine ? fm : fm.replace(/^description: .*$/m, `description: ${JSON.stringify(r.description)}`);
  const next = cardBody(r.repo, r.description, r.readme, body);
  if (nextFm + next === raw) continue;
  if (mine) nextFm = nextFm.replace(/^updated: .*$/m, `updated: '${new Date().toISOString()}'`);
  changed++;
  console.log(`${WRITE ? 'WROTE' : 'WOULD WRITE'} ${path.relative(SITE, file)} (${r.readme == null ? 'no README' : `${Math.round(r.readme.length / 1024)} KB README`})`);
  if (WRITE) fs.writeFileSync(file, nextFm + next);
}
console.log(`RUN SUMMARY: ${changed} card(s) ${WRITE ? 'written' : 'to write'}`);
