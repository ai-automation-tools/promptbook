<h1 align="center">🗺️ Roadmap</h1>

<p align="center">
  <em>From a local-first prompt library you browse, to one your agents can search and use directly over MCP.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/now-after_public_release-F59E0B?style=for-the-badge" alt="Now: after public release">
  <img src="https://img.shields.io/badge/stage-public_since_2026--10--12-2ea44f?style=for-the-badge" alt="Stage: public since 2026-10-12">
  <a href="README.md"><img src="https://img.shields.io/badge/↩-docs_home-6B7280?style=for-the-badge" alt="Back to docs"></a>
</p>

---

The Prompt-Library roadmap routine works this file top to bottom every Saturday night, once
the weekly upstream-drift issue has no `behind` entries: it takes the first open item that
isn't `🔒 Needs Mike`, builds it, ticks it, and adds the matching line to the
[changelog](CHANGELOG.md). **Every item above `## After public release` is a release gate**
for the next release; the repo itself has been public since 2026-10-12. Ticking an item adds
its line to the changelog and updates any doc it made stale, in the same commit.

Markers: `- [ ]` open, `- [-]` claimed by a run in progress, `- [x]` done, `- [!]` blocked
(the reason follows on the line). `small` marks an item a check verifies; `🔒 Needs Mike`
marks one only Mike can do.

> [!NOTE]
> **Where we are, 2026-10-27.** The app is local-first (clone and run; My Library is a folder
> of markdown files) with a read-only demo at `promptbook-demo.ai-automation-tools.dev`, and a
> local MCP server lets an agent search the library and pull items into its work. The library
> holds 2,162 indexed items, every one naming its source repo. Skill libraries are one card each
> (30 in `3_Skills/Libraries/`); the 28 single skills each ship with a redistributable licence
> beside `SKILL.md`; prompts can declare `[placeholder]` inputs that MCP clients ask for.
> What took items out of the library is in `archive/` at the repo root.
>
> Phases 1 and 2 are done, and so are Phase 3's framework majors (Express 5, Vite 8 and
> TypeScript 7, 2026-10-27). The open work an agent can take is the after-release features
> (starter collections, O01, O04); what is left in Phase 3 is Mike's. Every release gate is done (F04 and
> F10 closed 2026-10-27). Mike's calls: the Node 24 and Actions v7 moves, the Awesome ChatGPT
> and Skill Packs decisions, and the public MCP endpoint and npm package.

## 🔌 Phase 1: MCP server for the library (done 2026-10-21)

The stdio server (`site/mcp/server.ts`, `npm run mcp`, design in
[features/MCP-SERVER.md](features/MCP-SERVER.md)): search, browse, skill and Skill Pack tools,
My Library writes (not registered under `READ_ONLY`), library prompts as MCP prompts, and the
install docs, all proved by `npm run test:mcp` in CI. See the 2026-10-21 changelog entries. Its
three hosting and publishing items (a remote endpoint, an npm package, the MCP registry) moved
to **Publish and promote** on 2026-10-27, since none of them gates a release.

## 🛡️ Phase 2: Audit fixes (done 2026-10-23)

The 2026-10-23 audit's findings F01–F03, F05–F09, F11–F16 and F18–F20 are fixed, each with a
check that fails when its fix is reverted (PRs #415–#428; changelog, 2026-10-23). The
reports are kept outside the repo in `.claude/temp/audits/2026-10-23/` because the secret-scan
appendix must stay private. F04 (branch protection) and F10 (the secret scan) are release
gates and sit under **Public release**, F11, F12 and F16 are ticked under Phase 3, and F17 and
O01–O04 are under **After public release**.

## 🧹 Phase 3: Loose ends

- [x] Resolve the near-duplicates the byte-level dedupe cannot see among the 49 backend specialists in `2_Agents/Development/Backend/`. Each merge or removal gets a changelog reason. (The two skill groups this item also named, `skill-creator` and `brand-guidelines`, were archived with their libraries on 2026-10-27.) — done 2026-10-27, nothing merged or removed: a 4-word-shingle overlap across all 77 agents found one pair above 15% (`microsoft-agent-framework-python` and `semantic-kernel-python`, 26%), the same template for two different frameworks. The same-role groups (C# ×3, Rust ×3, C++ ×2) are different authors' agents with different instructions, kept as alternatives. `CSharpExpert.md` broke the lowercase rule and is now `csharp-expert.md`; `scripts/upstream.test.mjs` now fails on a case-only path clash or an uppercase item file name
- [ ] Move off Node 22 before its end of life on 2027-04-30: CI and `upstream-drift.yml` on `node-version: "24"` (or "26": Node 26 became LTS on 2026-10-28 and is Vercel's default since 2026-10-29, nodejs.org/en/about/previous-releases, vercel.com/changelog; Node 24 has been in maintenance since 2026-10-20), `@types/node` to the same major, `engines` pinned in `site/package.json`, CI green. The Vercel project's Node setting is part of done 🔒 Needs Mike (dashboard)
- [ ] Take the dependency majors `site/package.json` is behind on: `dotenv` 17→18, `archiver` 7→8, `motion` 12→14 and `lucide-react` 0.577→1.x (npm `latest` 18.0.9, 8.0.0, 14.9.0, 1.65.0). Why: lucide 1.0 removed the brand icons, so `Github` (used in `PromptDetail`, `ResourcesNav`, `SourceBar`, `SourcePanel`) no longer exists and needs a replacement (github.com/lucide-icons/lucide/releases/tag/1.0.1); dotenv 18 moves its injecting message to stderr and drops preloading and `.env.vault` (github.com/motdotla/dotenv/blob/master/CHANGELOG.md; `site/mcp/setup.ts` keeps `quiet: true`); archiver 8 needs Node 18+ and is ESM (github.com/archiverjs/node-archiver/releases/tag/8.0.0; `site/api/skill-packs.ts`); motion 13 and 14 remove internal APIs and the `@emotion/is-prop-valid` dependency (github.com/motiondivision/motion/blob/main/CHANGELOG.md). Done when `lint`, `build`, `test:routes`, `test:mcp` and `test:browser` pass, the MCP handshake still writes nothing but JSON-RPC to stdout, a skill-pack ZIP downloads, and no card, panel or menu lost an icon or animation
- [ ] Move `actions/checkout@v4` and `actions/setup-node@v4` in `ci.yml` and `upstream-drift.yml` to v7 (`homepage.yml` already uses checkout@v7). Why: v7.0.1 and v7.1.0 are current (github.com/actions/checkout/releases, github.com/actions/setup-node/releases) and v4 still runs on Node 20, which is past its end of life (nodejs.org schedule, 2026-04-30). Done when CI is green on the new tags 🔒 Needs Mike (`.github/workflows/` is a hold path)
- [x] Move to Express 5 (`site/package.json` has `^4.22.3`; npm `latest` is 5.3.0, registry.npmjs.org/express). Why: v4 is the old major. Touches `site/api/index.ts`, `site/api/skill-packs.ts`, `site/server.ts` (path-to-regexp wildcard syntax such as `/api/(.*)`, async error handling, `req.query`) and `@types/express`. Done when `lint`, `test:routes`, `test:my-library` and `test:mcp` pass and the dev server and a production start both serve every route — done 2026-10-27: 5.3.0 with `@types/express` 5. The two wildcard routes use the new `*name` syntax (Express 5 hands the segments over as an array, joined back into the path), the SPA fallbacks in `server.ts` and the browser smoke test are `/{*splat}`, and `POST`/`PUT /api/prompts` read `req.body ?? {}` because Express 5 leaves the body undefined when none is sent (that was a 500, it is a 400 again). `test:routes` reads `app.router`, which replaced `app._router`. Both copy forms (encoded and raw slashes), both ZIP forms and the `..%2F` refusal checked against the live app; the dev server and `npm start` serve every route
- [x] Move to Vite 8 with `@vitejs/plugin-react` 6 and check `@tailwindcss/vite` against it (`site/package.json` has Vite `^6.4.5`, plugin-react `^5.2.0`; npm `latest` is 8.3.5 and 6.1.2, which needs Node `^20.19.0 || >=22.12.0`). Touches `site/vite.config.ts` (`__READ_ONLY__` define) and `site/server.ts` (Vite middleware mode). Done when `npm run build` and `npm run dev` work and the demo build is unchanged in behaviour — done 2026-10-27: Vite 8.3.5 (Rolldown) and plugin-react 6.1.2; `@tailwindcss/vite` 4.3.3 already allows `^8`. Nothing in the config needed changing beyond `import.meta.dirname` for `__dirname`, which Vite's native config loader will require. `manualChunks` still splits `react-vendor` and `motion`; Rolldown also splits the markdown stack into its own 358 kB chunk, and every chunk stays under 500 kB. `test:browser` (built app, CSP hash unchanged) and the dev server in Chrome pass with no console errors
- [x] Try TypeScript 7 (`~5.9.3` today; npm `latest` is 7.0.2, registry.npmjs.org/typescript). Touches `site/tsconfig.json` and every file `npm run lint` checks. Done when `npm run lint` passes on the new major with no `any` added, or the blockers are written down here — done 2026-10-27: 7.0.2 (the native compiler; `lint` takes about 3 s). One diagnostic: TypeScript 7 checks side-effect imports, so `import './index.css'` needed `vite/client`'s declarations, referenced from `src/main.tsx`. `tsconfig.json` is unchanged and no `any` was added. Nothing imports the `typescript` package's API, so the Go port's missing JS API does not matter here
- [ ] Delete the stale `roadmap/auto-2026-08-31` branch (its PR #332 was closed unmerged) or recover its one commit 🔒 Needs Mike
- [ ] Decide what happens to `4_Prompts/Awesome_ChatGPT/` (about 1,350 files from one upstream corpus, now renamed `f/prompts.chat` on GitHub; four other collections, 437 prompts, sit beside it; the Prompts & Agents Refresh re-checks their repos but never edits bodies): resync it on a schedule like the agents (the drift check would need to read `prompts.csv`, one file for all of them), or freeze it as the dated capture it is 🔒 Needs Mike
- [x] `small` **F16** The Resources menu is reachable below 1536px: its groups appear in the section sheet the menu button opens, so phones and narrow windows get the links too. Checked at 390, 1280 and 1600px, by touch and keyboard, with no horizontal overflow or lost focus — done 2026-10-23: the menu button and sheet now last until 1536px (they stopped at 1360px, leaving 1360–1535px with neither), and the sheet lists every Resources group under the sections; the section buttons in it hide from 1360px, where the bar shows them. Checked at 390, 1280, 1440 and 1600px: keyboard reaches the links, no horizontal overflow
- [x] `small` **F11** Turn on `strict` in `site/tsconfig.json` and fix what it reports (the audit counted three diagnostics, plus explicit `any` at the API and UI boundaries), with no blanket `@ts-ignore`. `npm run lint` and `npm run build` both pass — done 2026-10-23: the three diagnostics fixed (`loadIndex`'s return, an editor `PromptDraft` type, `@types/react-dom`), and the boundary `any`s typed (`ListedPrompt`, `LibraryIndex`, `SkillPack`, `catch (error)` narrowed)
- [x] **F12** Measure, then bound, the expensive endpoints: record p50/p95 and bytes for the metadata list, a detail read and representative skill ZIPs under a small concurrency test, then stop the full public list from parsing every body synchronously and stop ZIPs recompressing at level 9 on every request (cache or lower the level). A full export must not block ordinary reads. Budgets come from the measured baseline — done 2026-10-23: `npm run bench` and `docs/development/PERFORMANCE.md` (baseline, after, budgets). The full listing walks asynchronously, listings are cached as bytes with their ETag (concurrent requests share one build), and ZIPs use zlib level 6. A detail read during a cold export went from p95 927 ms to 128 ms, the export's event-loop stall from 989 ms to 126 ms (once per 5 minutes), and a warm export from 3.6 s to 149 ms
- [x] `small` The hero counters name what a section holds ("servers", "skills", "agents") instead of "prompts" everywhere, from a field in `sections.ts` — done 2026-10-23: `noun` on each section
- [x] `small` `scripts/resync-upstream.mjs` writes `tags: [...]---` on one line when `tags:` is the last frontmatter key of an agent (`stampUpstream` drops the newline), which breaks the frontmatter; hit on 3 agents on 2026-10-22. Fix it to always end the block with a newline. Done when resyncing `2_Agents/AI_ML/Other/model-evaluator.md` from a pre-sync copy yields valid frontmatter, with a case in `scripts/upstream.test.mjs` — done 2026-10-23: `stampUpstream` always ends on a newline; a real resync of `model-evaluator.md` closed its frontmatter correctly

## 🚦 Public release

- [x] CI green on push and PR: lint, the route table, the My Library store and safe-path tests, the homepage test, provenance self-checks and prompt-index freshness — done 2026-08-27, extended since: `.github/workflows/ci.yml`
- [x] `LICENSE` (Apache 2.0), `NOTICE` for vendored content, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md` — done 2026-10-05: see the changelog
- [x] Live: homepage at `promptbook.ai-automation-tools.dev` — done 2026-10-12; the app at `promptbook-demo.ai-automation-tools.dev` since 2026-10-19, read-only since 2026-10-21: see the changelog
- [x] **F04** `main` requires a pull request and the CI `check` job before merge. Done when a throwaway PR with a failing check cannot merge and the PR sweep still merges a passing one without bypassing it — done 2026-10-27: the existing `main` ruleset ("Rule1", which already blocked deletion and force pushes) now also requires a pull request (0 approvals, since the sweep merges as Mike) and the `check` and `secrets` CI jobs, with no bypass actors; merge, squash and rebase stay allowed and branches need not be up to date. Set in the browser with Mike's confirmation. A throwaway PR with `secrets` failing (#466) was refused by `gh pr merge --squash` ("the base branch policy prohibits the merge"), and this item's own PR, with both checks green, merged with the sweep's exact command (`gh pr merge --squash --delete-branch`, no `--admin`)
- [x] **F10** A full-history secret scan with every finding dispositioned. The scan ran on 2026-10-23 (Gitleaks 8.30.1, 1,103 commits): 138 redacted candidates over 40 file/rule pairs, mostly prompt examples and vendored docs, none confirmed live. Left: classify each pair privately, revoke any real credential at its issuer before closing, add narrow per-fingerprint allowlists for reviewed examples, and scan new commits in CI (proved with a seeded fake secret that the job catches without printing). The disposition record stays out of this public repo. The old Neon credential is already closed: that database was deleted on 2026-10-21 — done 2026-10-27 (Mike's sign-off on the triage): a fresh full-history scan (Gitleaks 8.30.1, 1,168 commits) found 142 candidates, all from four loose pattern rules; no fixed-format key rule (private key, AWS, GitHub, Stripe, OpenAI, Anthropic…) matched in any commit, so nothing needed revoking. 132 were example tokens, placeholder headers, sample JWTs and "LinkedIn" in library text (every place the library has lived, the built index files, `archive/`); 10 were a made-up `abc123_<timestamp>` session token in the March `docs/API.md` and `docs/DATABASE.md`, since deleted. `.gitleaks.toml` turns the four loose rules off for library paths only and allowlists those two commits in those two files; the strict rules still scan everything (a fake AWS key and a private key under `site/library/` were caught). CI's new `secrets` job scans the history on every push and PR; a seeded fake secret on a throwaway PR failed it without printing the value. The triage detail stays in the private scan reports, outside the repo

## After public release

Nothing below blocks go-live.

### 🧾 Content provenance

- [ ] Decide whether a skill's `description:` is our curation or upstream content. Resync keeps the whole local frontmatter, so bodies match upstream while some descriptions are a year old, and the drift check strips frontmatter so it cannot see the gap. Done when resync and the drift report both handle `description` per the decision 🔒 Needs Mike
- [x] **O02** Freshness on the listing cards. The item page's Source panel already shows the repo, the copied-at commit, the last check date and the drift verdict (2026-10-26); the cards in the grid show none of it. The index carries `upstream.checked` (`server.checked` for MCP cards) and a card shows a stale badge when the last check is over 90 days old, with no "verified" claim the data cannot back. The index stays reproducible, no private path reaches a public payload, and the CI freshness gate knows the new field — done 2026-10-27: the index and the live walk carry `checked` (`checkedOf()` in `lib/library.ts`: `upstream.checked`, `server.checked` or a guide's `checked:`), on 2,071 of 2,162 items. A card shows "checked <date>" in place of the file's mtime, and a `stale` chip past 90 days (`src/lib/freshness.ts`); undated items (most guides, the library cards) show neither. `test:read-only` checks the index and the walk agree and pins the 90-day edge. The walk also stopped listing three lowercase `readme.md` files the index skips
- [ ] `lastModified` from `git log` instead of file mtime, so an item without a check date shows when it last changed rather than when the checkout wrote it. Needs a Vercel preview to prove the shallow clone has the history 🔒 Needs Mike
- [x] Stamp `upstream:` provenance on `4_Prompts` and `5_System_Prompts` files that came from a public repo, with `attribute-upstream.mjs` learning single-file prompts. Done when the Monday health table's "no provenance" column drops for both sections — done 2026-10-26, differently: system prompts were stamped on 2026-10-23 (`attribute-system-prompts.mjs`), the 1,349 Awesome ChatGPT prompts carry `upstream: f/awesome-chatgpt-prompts` (one corpus, so no per-file matcher was needed), and the 669 prompts with no public source were archived rather than attributed. CI (`upstream.test.mjs`) now fails on an unstamped prompt or guide, which is a stronger gate than the health column
- [x] Raise skill attribution above its current share: 60 skills are `ambiguous` and 163 `unknown`. Matching support files as well as `SKILL.md` against the mirror is the likely lever — done 2026-10-27, differently: the unattributed skills all came from multi-skill repos, which became library cards (each names its repo), and the copies were archived. The 32 single skills left are 25 `exact`, 5 `similar` and 2 `fork`, none `ambiguous` or `unknown`
- [x] **F17** The provenance self-check tells original, attributed and unresolved records apart and checks each has the metadata its kind needs, and a sampled Skill Pack ZIP is verified to carry its `LICENSE`/`NOTICE` files. Today the frontmatter tests prove syntax and vocabulary, not that content may be redistributed — done 2026-10-27: `scripts/upstream.test.mjs` checks originals (guides, library cards: no upstream block), attributed records (`repo`, `checked`, a fork's `note`, a vendor's `url`) and fails on unresolved ones, and every skill needs a redistributable `license:` and a LICENSE beside it (`scripts/vendor-skill-licenses.mjs`; 26 were added). `test:read-only` opens a skill ZIP and every pack ZIP and checks each skill's LICENSE is in it. Four skills had no redistributable licence and were archived with one unindexed `SKILL.MD`, to `archive/unlicensed-2026-10-27/`. The repo's own `NOTICE` is not added to ZIPs

### ✨ Features

- [ ] Decide what Skill Packs are for, now that three small hand-picked packs are left (`developer-essentials-pack` 2 skills, `writing-documentation-pack` 2, `prediction-markets-pack` 1): grow them, fold them into the starter collections below, or retire the Packs view 🔒 Needs Mike
- [ ] Role-based starter collections for prompts and agents (a "frontend engineer" or "founder" set), installable into My Library in one step the way a Skill Pack is. Done when at least three collections exist, each installs and uninstalls cleanly in a test, and the read-only demo serves them without the install button. Wait for the Skill Packs decision above, which may make the two one feature
- [ ] **O01** Export My Library as a zip, and import one, from Settings. Done when a mixed library (Unicode names, tags, extra frontmatter, long bodies) round-trips identically, an import never overwrites without showing the conflicts first, archive traversal and oversized entries are refused, and a cancelled import changes nothing. Its prerequisites F05–F07 are done
- [x] **O03** Library prompts with `[placeholder]` fields expose them as MCP prompt arguments, so a client asks for each value instead of one free-text `input`. Driven by an explicit, optional `inputs:` list in frontmatter, not by guessing at every bracketed phrase: declared inputs are required, unknown placeholders and literals are left alone, no template code runs, and the free-text `input` keeps working for existing clients — done 2026-10-27: `lib/prompt-inputs.ts` validates the list and fills in one literal pass; the index carries `inputs` for prompts that declare it, and the MCP server registers each such prompt by name with a required argument per input (My Library prompts too). Two Awesome ChatGPT prompts declare `[topic]` to start. `test:mcp` covers parsing, filling, required arguments and a My Library prompt, and fails on an invalid declaration in the library. `library_prompt` keeps `id` + `input` only
- [ ] **O04** Export selected prompts as an evaluation project (versioned prompt files plus synthetic examples) that an evaluator the user configures can run. Paths are relative and safe, and the export makes no network call and needs no provider key. Depends on O01

### 📣 Publish and promote

- [ ] Remote read-only endpoint on the demo: Streamable HTTP at `/api/mcp` on Vercel, read tools and MCP prompts only, no write tools registered, a per-IP rate limit, and the CSP and headers the rest of the API has. Proved by a deployed smoke test with a real MCP client 🔒 Needs Mike (it opens a new public endpoint)
- [ ] Publish the stdio server as an npm package so `npx promptbook-mcp` works without a clone, with the library bundled or fetched from the demo 🔒 Needs Mike (npm account and package name)
- [ ] List the server in the official MCP registry (`modelcontextprotocol/registry`) once it is on npm 🔒 Needs Mike
- [ ] Launch post for the MCP server once it installs without a clone (the npm item above), linked from the org landing page card 🔒 Needs Mike

---

### 🗓️ Kept current by

Recurring work, not items. Schedules belong to the Routines fleet; this table only says which
job owns which part of the library.

| Job | Owns |
|:---|:---|
| Add Prompts (weekly) | New `4_Prompts` and `1_Guides` files |
| Discovery (weekly, no model) | New GitHub repos into [`DISCOVERY.md`](DISCOVERY.md); `link` rows into the Resources menu |
| Guides Refresh (biweekly) | Fixing `1_Guides` against official docs |
| Catalog Refresh (biweekly) | `5_System_Prompts`, `2_Agents`, `6_MCP_Servers`, and the ledger's `accept` rows (a multi-skill repo becomes a library card; a single skill is vendored with its licence) |
| Prompts & Agents Refresh (biweekly) | Resyncing drifted `2_Agents` definitions, and re-checking the collection repos `4_Prompts` is copied from |
| Upstream Check (biweekly) | The app's own dependencies and platforms in [`UPSTREAMS.md`](UPSTREAMS.md); bigger changes become items here |
| Library Cards Refresh (weekly, no model) | The skill library cards' descriptions and READMEs (`site/scripts/refresh-library-cards.mjs --write`), and dead hand-pack paths, as a `library-cards/auto-*` PR |
| Weekly Roadmap | This file, and resyncing skills and agents the drift issue marks `behind` |
| Monthly Upkeep | Updates and removals, hand-written Skill Packs (dead paths: `build-skill-packs.mjs`), skill library cards (`3_Skills/Libraries/`, READMEs refreshed with `site/scripts/refresh-library-cards.mjs --write`), Resources links, MCP cards, `featured` and tags |
| `upstream-drift.yml` (weekly, GitHub Actions) | The rolling drift issue with its per-section health table |

---

<p align="center">
  <a href="README.md">← Docs home</a> ·
  <a href="CHANGELOG.md">Changelog →</a>
</p>
