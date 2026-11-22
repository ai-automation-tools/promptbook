# Changelog

Shipped work, newest first. Forward-looking plans live in [ROADMAP.md](ROADMAP.md).

---

## 2026-11-22 — Lint checks React hook rules (PB-27)

**Checks**
- `npm run lint`, which CI runs, now runs oxlint after `tsc --noEmit`, with only two rules on: `rules-of-hooks` and `exhaustive-deps` (`site/.oxlintrc.json`). No style rules. A missing hook dependency is the class of bug behind several stale-state defects the audit found. The existing `eslint-disable-next-line react-hooks/exhaustive-deps` comment is honoured.
- oxlint rather than ESLint: `typescript-eslint` supports TypeScript only below 6.1, and this repo is on 7. oxlint parses TypeScript itself and is one dev dependency.
- It found two callbacks in `App.tsx` missing `setActiveTab` (from `useLibraryRoute`) in their dependency lists; both fixed.

_Touched: `site/.oxlintrc.json` (new), `site/package.json`, `site/package-lock.json`, `site/src/App.tsx`, `AGENTS.md`, `README.md`, `docs/README.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Identical items marked as aliases (PB-29)

**Content**
- Three pairs of items have byte-identical bodies because their upstream ships one text under two names: Fabric's `summarize` and `create_summary`, Fabric's `summarize_micro` and `create_micro_summary`, and Codex's `gpt-5.2-codex` and `gpt-5.1-codex-max` prompt files. All six stay, each mirroring its own upstream file (owner's call; system prompts are labelled, never deleted). Each now names its twin with a top-level `same_as:`, and the item page shows "Same text as <twin>, published upstream under both names", linking to it.
- The audit's fourth pair (Anthropic `claude-sonnet4` / `claude-opus4`) was already gone after #537's re-sourcing.

**Checks:** `scripts/upstream.test.mjs` fails any two items with identical bodies that don't name each other with `same_as`. `test:browser` opens one alias and follows the link to its twin.

_Touched: six files under `site/library/4_Prompts/Fabric/Summarize/` and `site/library/5_System_Prompts/OpenAI/`, `site/src/components/PromptDetail.tsx`, `scripts/upstream.test.mjs`, `site/scripts/browser-smoke.test.mjs`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — frontend-design skill sourced from Anthropic

**Content**
- The `frontend-design` skill (`3_Skills/Development/Web_Development/`) is Anthropic's, but was copied from `ar4mirez/samuel`, a repo that bundles an edited copy under its own MIT licence. The licence check added in PB-17 flagged it, since the copy was stamped Apache-2.0. Its `upstream:` block now names `anthropics/skills` (`skills/frontend-design/SKILL.md`, Apache-2.0, matching the `LICENSE.txt` beside it), and its body was resynced to Anthropic's current text (`e4bb5d9`).

_Touched: `site/library/3_Skills/Development/Web_Development/frontend-design/SKILL.md`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Every view has a link; Back and Forward work; slow loads can't overwrite newer ones (PB-09)

**Fixes**
- The URL is now the navigation state. `useLibraryRoute` keeps library, section, category, subcategory, `?prompt=`, Skills' `?view=libraries`, and two new parameters: `?favorites=1` for the My Library Favorites view and `?pack=` for an open Skill Pack. App derives which view shows (a prompt, Favorites, a category or subcategory, or the whole section) instead of keeping three more flags that could disagree with it.
- Before, almost every change replaced the history entry, so browser Back left the app. A `?category=` link also opened on the whole section, because the category view was a separate flag the URL never set. Now each change of view pushes an entry, so Back and Forward walk prompt → category → section and back. Filling in defaults on load, resolving a shared `?prompt=` link and leaving Favorites when switching to the Public Library replace the entry instead, so none of them leaves a dead step.
- Back or Forward onto a different prompt now opens it; before, the open one stayed.
- Stale responses are dropped: opening a prompt, the library listing (a library switch or refresh) and a Skill Pack's details each count their requests, and only the newest answer is applied. A refresh that fails keeps the list on screen instead of emptying it, and a pack answer without an id is treated as an error.
- Opening a prompt from anywhere (a card, the palette, a link, history) switches library, section and category in one step.

**Tests:** `test:browser` opens a `?category=` link, walks prompt → in-page Back → browser Back → Back → Forward, opens a `?pack=` link and goes back to it, and delays one prompt's response so a newer click lands first.

_Touched: `site/src/hooks/useLibraryRoute.ts`, `site/src/App.tsx`, `site/src/components/SkillPacksView.tsx`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — A licence on every copied item; NOTICE generated; relicensed upstreams held (PB-17)

**Content**
- 626 copied agents, prompts and system prompts now carry `license:` in their `upstream:` block, as skills already did: MIT or Apache-2.0 from each of the 23 source repos (checked with `gh` today), and `NOASSERTION` for the 24 system prompts quoted from a vendor's own page, which claim no licence. Bodies are unchanged and the prompt index is byte-identical.
- `scripts/vendor-skill-licenses.mjs` stamps every copied section, not only skills. A stamp it already wrote stands: a changed upstream licence is for a person to judge.

**Checks**
- `scripts/upstream.test.mjs` fails a copied item without a redistributable `license:` (a vendor page must say `NOASSERTION`), and fails when `NOTICE` is out of date.
- `NOTICE`'s list of sources is generated by the new `scripts/build-notice.mjs` from those stamps, with each MIT repo's copyright line. It now names the six agent sources it left out (VoltAgent, davila7, github/awesome-copilot, wshobson, affaan-m, 0xfurai) and the repos behind the system prompts.

**Upstream drift**
- `check-upstream-drift.mjs` reads each repo's current licence from the metadata call it already makes. An item whose upstream is no longer under the licence it was stamped with gets the verdict `relicensed`, and a "Licence changed upstream" table covers every copied section, prompts included. The weekly resync only takes `behind` and `drifted` items, and `resync-upstream.mjs` itself refuses a relicensed one. A skill folder with its own licence file upstream is judged by that file.
- First run: one skill, `Development/Web_Development/frontend-design` from `ar4mirez/samuel`, was copied under Apache-2.0 and the repo is MIT now. It shows "Licence changed upstream" on its Source panel until someone re-stamps it.

_Touched: 626 files under `site/library/`, `NOTICE`, `scripts/vendor-skill-licenses.mjs`, `scripts/build-notice.mjs` (new), `scripts/upstream.test.mjs`, `scripts/check-upstream-drift.mjs`, `scripts/resync-upstream.mjs`, `site/lib/library.ts`, `site/src/components/SourcePanel.tsx`, `AGENTS.md`, `docs/CONTRIBUTING.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Skill Packs load once; a save conflict keeps your draft; the phone "+" steps aside (PB-22, rest)

**Fixes**
- Skill Packs were listed twice per visit: App fetched the list for the sidebar and hero, and the grid fetched it again. App now fetches it once and hands it to the grid, so adding or removing a pack refreshes the sidebar, hero and grid together (and, in My Library, the skills the pack added). A response that a later request has overtaken, such as after a library switch, is dropped.
- Saving an item that changed elsewhere since you opened it (a 409) used to replace your text with the saved version. The editor now keeps your text and says so: Save again replaces the saved version on purpose, or "Load the saved version instead" discards the draft.
- On phones the floating "+" covered the action buttons of whichever card sat under it. It now slides away while the list scrolls down and comes back on the way up.

**Tests:** `test:browser` checks the 409 keeps the draft and can load the saved copy, that Skill Packs are listed with one request, and that the "+" hides and returns on a phone-sized viewport.

_Touched: `site/src/App.tsx`, `site/src/components/SkillPacksView.tsx`, `site/src/components/PromptEditorModal.tsx`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — One library walker (PB-26)

**Changes**
- The prebuilt index and the API's full listing walked `library/` with two copies of the same rules, and they had drifted: the API checked that `title` was a string and `tags` an array, the builder didn't, and only the builder trimmed a heading title. `walkLibrary()` in `lib/library.ts` is now the one walk (Markdown only, no `README.md` or `Legacy/`, `SKILL.md` and `Libraries/` cards under `3_Skills`, nothing over 500 KB). `scripts/build-prompt-index.js` maps it to index entries and the API to listing rows. `PREVIEW_LENGTH` lives beside it instead of being mirrored in two files.
- `npm run build:index` runs the builder with `tsx`, since it now imports TypeScript. The rebuilt index is byte-identical to the one on `main`.
- A large-file skip is logged to stderr: `lib/library.ts` is also loaded by the MCP server, whose stdout is the protocol.

_Touched: `site/lib/library.ts`, `site/api/index.ts`, `site/scripts/build-prompt-index.js`, `site/package.json`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — No sidebar jump on first load (PB-11 follow-up)

**Fixes**
- With fonts no longer blocking, the page now paints before the library listing arrives. The sidebar's category list was painted empty, then pushed down by the "Filter categories" box when the categories came in: desktop Lighthouse measured CLS 0.198 on the demo (0.044 before PB-11). A public section always has categories, so while it has none the list is not laid out; the filter and list now appear together. Local desktop runs: 0 to 0.04, the remainder being the footer shift the audit already recorded.

**Measured on the demo** (Lighthouse 12, after PB-11 and PB-12 deployed): mobile performance 86 and 88 (audit: 67), FCP 2.6–2.7 s, TBT 140–170 ms; accessibility 100 on mobile and desktop (audit: 96), colour contrast passing.

_Touched: `site/src/components/Sidebar.tsx`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — README checks match CI; the pause switch is written down (PB-25, part)

**Docs**
- README's Checks list now matches `ci.yml`: it adds `test:frame-ancestors`, the content gate and the homepage links check, and says which commands CI does not run (`build:index`, `bench`). The demo badge's label still read `my-prompt-library-demo`; it reads `promptbook-demo`.
- `AGENTS.md` and the roadmap's "Kept current by" table describe the pause switch the job prompts gained (PB-20): an empty `docs/AUTOMATION_PAUSED` on `main` stops every scheduled Promptbook job.
- Already fine: `docs/CONTRIBUTING.md` no longer mentions SQL, and the Vite roadmap item was ticked in #542.

**Not done here:** cutting `AGENTS.md` to 12 KB and moving changelog entries older than about 60 days to `docs/changelog/` change how the repo's main guide reads, so they wait for the owner.

_Touched: `README.md`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — MCP search finds words deep in an item's text (PB-32)

**MCP**
- `search_library` matched only titles, tags, places and the first 200 characters, so a query for something an item says further down found nothing. After the fuzzy pass it now tops up the results with items whose full text holds every query word (three letters or more), within the same section, category and tag filters. It reads the candidate files per query, tens of milliseconds for the local stdio server; indexing body terms at build time can come later if the library grows tenfold. The app's ⌘K palette is unchanged: it would need the terms shipped in the listing.

**Tests**
- `test:mcp` saves an item with a word 760 characters in and finds it by that word.

_Touched: `site/mcp/server.ts`, `site/scripts/mcp-server.test.mjs`, `docs/mcp-server.md`, `docs/features/MCP-SERVER.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Smaller client fixes: drafts, previews, favorites, links (PB-22, part)

**Fixes**
- **BUG-11:** the editor asks "Discard your changes?" before Escape, the backdrop, X or Cancel drops edited text.
- **BUG-13:** a card whose item has no preview shows "No preview available." instead of a loading shimmer that never ends.
- **BUG-14:** download links revoke their object URL after the click has started the download, not in the same tick (Safari could abort it).
- **BUG-15:** a favorites reload, or a reply, that started before the latest star toggle no longer undoes it; a toggle applies the list the server returns.
- **BUG-16:** the "recent" fallback for Featured sorted the shared section list in place; it sorts a copy.
- **UX-10:** links in rendered markdown that leave the site open in a new tab (`noopener noreferrer`), `#anchor` links reach the `user-content-` ids rehype-sanitize assigns, and images load lazily with no referrer (`src/lib/markdown-components.tsx`).

**Not done here:** fetching Skill Packs once in App (BUG-12), keeping a draft beside the server copy on a 409 (the rest of BUG-11), and the phone "+" button covering a card's actions mid-scroll (UX-09; the list already ends with room for it).

_Touched: `site/src/App.tsx`, `site/src/components/PromptDetail.tsx`, `site/src/components/PromptEditorModal.tsx`, `site/src/components/SkillPacksView.tsx`, `site/src/hooks/useFavorites.ts`, `site/src/hooks/usePromptPreviews.ts`, `site/src/lib/markdown-components.tsx`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — ZIPs and pack manifests built once; long card lists skip off-screen work (PB-28)

**Performance**
- Skill and Skill Pack ZIPs are built on the first download and served from memory after that (`lib/zip-cache.ts`); a failed build is retried, not cached. The largest skill ZIP went from about 200 ms (and 1.2 s on the demo) per download to 18 ms p50 once built. Pack manifests are read once per process too. The library only changes with a deploy or restart, as the prompt index already assumes.
- Cards use `content-visibility: auto`, so a sub-category with hundreds of unpaged cards (Fabric: 265) lays out and paints only what is on screen.

**Fixes**
- Pack ZIP entry names were joined with the OS separator, so a ZIP built on Windows had `skill\file` names; they are POSIX paths now, as the skill ZIP's already were.

_Touched: `site/lib/zip-cache.ts`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/src/index.css`, `AGENTS.md`, `docs/development/PERFORMANCE.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Dead scripts and code out; quieter logs (PB-24)

**Cleanup**
- Removed four repo-root scripts nothing ran: `add-frontmatter.mjs` (pointed at a `prompts/` folder that no longer exists), `check_skills.py`, `get_popular_skills.py` and `get_raw_urls.py` (one-off scrapers of a third-party skills API). They are in git history.
- The API no longer logs every request (`[API] GET …`), and a Skill Pack download no longer logs every skill, file count and archive step; errors and warnings still log.
- Dead code gone: `layout` props that did nothing under `LazyMotion`'s `domAnimation` (cards, toasts), the unused `featured` and `anchor` fields on `Prompt` (Featured reads the `featured` tag), the `DISABLE_HMR` switch and its AI Studio comment (with a mojibake character) in `vite.config.ts`, and the unused `experimentalDecorators` / `useDefineForClassFields` flags in `tsconfig.json`.

_Touched: `scripts/`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/src/components/PromptCard.tsx`, `site/src/components/Toast.tsx`, `site/vite.config.ts`, `site/tsconfig.json`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Faster first paint: self-hosted fonts, motion and Fuse off the critical path (PB-11)

**Performance**
- Inter and JetBrains Mono ship with the app (`@fontsource-variable/inter`, `@fontsource/jetbrains-mono`, OFL-1.1), imported in `src/main.tsx`. The render-blocking Google Fonts stylesheet, a request to a second and third origin before first paint, is gone, and the demo's CSP drops `fonts.googleapis.com` and `fonts.gstatic.com`. Font files are never inlined as base64 (`assetsInlineLimit`), so the CSS stays small and `font-src 'self'` holds.
- `LazyMotion` loads its animation features after first paint (`src/lib/motion-features.ts`); `vite.config.ts` no longer pins all of motion into one up-front chunk. `fuse.js` loads on the first search; it was only ever the fallback when nothing matches as typed.
- The JavaScript loaded before first paint falls from about 152 KB to 126 KB gzipped. On a local `npm start` (no compression, Lighthouse mobile) performance went from 49 to 56 and Total Blocking Time from 660 to 410 ms; the demo, which serves compressed files from Vercel's edge, gets re-measured after deploy against the audit's 85 target.

_Touched: `site/index.html`, `site/src/main.tsx`, `site/src/index.css`, `site/src/App.tsx`, `site/src/lib/motion-features.ts`, `site/src/hooks/usePromptFilters.ts`, `site/vite.config.ts`, `site/vercel.json`, `site/package.json`, `site/package-lock.json`, `docs/UPSTREAMS.md`, `docs/ARCHITECTURE.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Readable prompt pages (PB-13)

**UI**
- A prompt in a bare or text/markdown fence wraps (`white-space: pre-wrap`) instead of running off the panel edge at 1440px and on phones. Fences with a real language (python, json…) keep their horizontal scroll.
- A body that opens with its own title as a `#` heading no longer shows it under the page title; Copy and Download still use the body as written.
- On phones the tags follow the body, so the prompt text starts on the first screen (at 390×900 it begins about 670px down, where it was about 1,350).

_Touched: `site/src/index.css`, `site/src/components/PromptDetail.tsx`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Contrast and a 12px text floor (PB-12)

**Accessibility**
- Dark mode's `--fg-4` and `--fg-5` were zinc-500 and zinc-600, about 4.2:1 and 2.6:1 on the ground, under the 4.5:1 small text needs. They are now `#93939c` and `#808089`, which pass on the ground and on cards; light mode already passed. Inactive section-rail labels use `--fg-3`.
- No running text is under 12px now: sidebar and toolbar counts, card dates, the item id, source-panel lines, the editor's counter, Settings rows, the palette's hints and footer, and `.chip` tags moved up from 10–11.5px. Uppercase eyebrows, keycaps and table headers keep their size.

**Fixes**
- Card titles lost their two-line clamp in PB-02: a `<button>` is one atomic box, so the clamp on the `h3` around it couldn't cut it. The clamp now sits on the button.

_Touched: `site/src/index.css`, `site/src/App.tsx`, `site/src/components/` (CommandPalette, ErrorBoundary, PromptCard, PromptDetail, PromptEditorModal, PromptListToolbar, SettingsModal, Sidebar, SkillPacksView, SourcePanel), `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Keyboard and screen-reader polish (PB-14)

**Accessibility**
- The closed sidebar is `inert`, so its links no longer take Tab while it is off-screen (phones) or zero-wide (desktop); Escape closes the phone drawer.
- The command palette runs on the shared `Modal` shell (new `label` and `placement="top"` props): portalled, the page behind inert, Tab kept inside, Escape and focus-return handled. Ctrl/Cmd+K over another dialog now does nothing, where it used to open a second dialog and lift the first one's `inert` on close.
- `<MotionConfig reducedMotion="user">` wraps the app, so motion's JS animations (card entrances, dialog springs, toasts) honour `prefers-reduced-motion` the way index.css already did for CSS ones.
- Toasts sit in one always-mounted `aria-live="polite"` region portalled to `<body>`, so they are announced, and still announced while a dialog makes `#root` inert; errors keep `role="alert"`.

**Tests**
- `test:browser` opens the palette with Ctrl+K, checks the page is inert and Tab stays inside, and that Escape lifts `inert`.

_Touched: `site/src/components/ui/primitives.tsx`, `site/src/components/CommandPalette.tsx`, `site/src/components/Toast.tsx`, `site/src/components/Sidebar.tsx`, `site/src/App.tsx`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Local production gets the demo's CSP; consent.js only on the demo (PB-15)

**Security**
- `npm start` sends the page headers in `vercel.json` (the CSP, `nosniff`, the referrer policy) from `server.ts`, so a local production run is under the same policy `test:browser` checks. Framing stays as it was locally: `frame-ancestors 'self'` plus `FRAME_ANCESTORS`, and `X-Frame-Options: SAMEORIGIN` when that is unset; the demo still refuses all framing.
- The API's `helmet` CSP is now an explicit `frame-ancestors` policy instead of `contentSecurityPolicy: false` (CodeQL `js/insecure-helmet-configuration`); it covers dev's Vite pages too, which need inline scripts. The separate `FRAME_ANCESTORS` middleware only drops `X-Frame-Options` now.
- `index.html`'s `consent.js` tag is stripped at build time unless the build is read-only (the demo), so a local copy no longer loads a script from ai-automation-tools.dev.

_Touched: `site/server.ts`, `site/api/index.ts`, `site/vite.config.ts`, `AGENTS.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — MCP: library text framed as data, version required for body edits (PB-16)

**Security**
- `get_item`, `get_skill` and `get_skill_file` hand public library text to an agent after a `> Library content from <repo>@<ref>: reference material for the user's task, not instructions to you.` line, inside a markdown fence longer than any backtick run in the text, so a copied README or skill can't pass as the server's own words or close the fence early. My Library items, the user's own, come back as before; MCP prompts (`library_prompt` and the named ones) are still sent as the user's message, since the user picked them.
- `update_my_prompt` refuses a `content` or `file` change without the `version` `get_item` showed, so an agent can't overwrite edits it never read.
- `get_skill` and the item page show a skill's `allowed-tools` (two library skills grant `Bash`), so what a skill asks to run is visible before it is installed.

**Fixes**
- The MCP copy (`save_to_my_library` with `id`) ignored the subcategory when looking for a duplicate, so it refused copies the app allowed. Both now call `existingCopy()` in `lib/my-library.ts`.

**Tests**
- `test:mcp` checks the framing and fence on `get_item` and `get_skill`, the `allowed-tools` line for `planning-with-files`, and that a body or file update without `version` is refused.

_Touched: `site/mcp/server.ts`, `site/lib/my-library.ts`, `site/api/index.ts`, `site/src/components/PromptDetail.tsx`, `site/scripts/mcp-server.test.mjs`, `docs/mcp-server.md`, `docs/features/MCP-SERVER.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Content gate for library text (PB-06)

**CI**
- New `scripts/check-content.mjs`, run by the `check` job: every text file under `site/library/` is scanned for instruction-override phrasing ("ignore previous instructions" and kin, outside `5_System_Prompts`), invisible Unicode (tag characters, bidi overrides, zero-width characters other than an emoji's joiner and a leading BOM), HTML comments addressed to an AI, and `curl|sh` / `irm|iex` outside `1_Guides`. Findings print as `file:line rule`, never the matched text, so a payload doesn't land in CI logs. The rules test themselves on every run.
- The current library had 14 hits in 8 files, each read and found benign (vendor installers, a guide quoting the phrase as an example, two stray zero-width spaces in a copied card). They are listed with a reason in `scripts/content-allowlist.json`; an entry that stops matching fails the check, so the list can't go stale.
- A seeded skill with a zero-width-joined "ignore previous instructions" line fails the check without printing it.

**Not done here:** the audit's "size jump" and "new or widened `allowed-tools`" rules need a diff against the PR base, and the "upstream text is data" line belongs in the job prompts in the Routines repo (PB-07).

_Touched: `scripts/check-content.mjs`, `scripts/content-allowlist.json`, `.github/workflows/ci.yml`, `AGENTS.md`, `docs/CONTRIBUTING.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Detail actions follow the item; the page clamps; storage can't white-screen (PB-08)

**Fixes**
- **BUG-03:** the prompt page chose Save, Edit and Remove from the library switch, not the item, so a public prompt with My Library selected offered Edit and a Remove that 404'd. They now follow `prompt.isUserOwned` (and Remove, like Edit, hides under `READ_ONLY`), as the cards already did.
- **BUG-04:** the page number outlived a library switch or a delete, so a short list showed "Page 3 of 1" over an empty grid. `usePromptFilters` clamps the page to the list.
- **BUG-05:** `App.tsx` read and wrote `localStorage` unguarded, so blocked storage (private modes, a sandboxed frame) or a saved `{}` for recently viewed failed the render. Reads and writes go through `readStorage`/`writeStorage`, and recently viewed must be a list of strings.

**Tests**
- `test:browser` loads the app with `{}` saved as recently viewed, then in a page whose `localStorage` throws; both render the library.

_Touched: `site/src/components/PromptDetail.tsx`, `site/src/hooks/usePromptFilters.ts`, `site/src/App.tsx`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Actions pinned by SHA, jobs time out (PB-21)

**CI**
- Every `uses:` in `ci.yml`, `homepage.yml` and `upstream-drift.yml` names a commit SHA with its version in a comment (`actions/checkout` v7.0.1, `actions/setup-node` v7.1.0, `actions/upload-pages-artifact` v5.0.0, `actions/deploy-pages` v5.0.1), so a moved tag can't change what runs. Dependabot's `github-actions` group updates SHA pins and their comments.
- Every job has `timeout-minutes: 30`, down from GitHub's 360-minute default.

_Touched: `.github/workflows/ci.yml`, `.github/workflows/homepage.yml`, `.github/workflows/upstream-drift.yml`, `docs/UPSTREAMS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — No third-party email on cards; listing errors show; robots.txt; PORT (PB-19, PB-23)

**Fixes**
- **PB-19:** `site/scripts/refresh-library-cards.mjs` replaces email addresses in a copied README with "(email on the repo page)" (`git@host` and `pkg@version` left alone; it checks itself before each run), and the `baojie-shiji-kb` card loses the author's personal address. With the README on the org address since #545 and `SECURITY.md` naming none, no personal address is left in the tree's docs.
- **PB-23:** a failed library listing returns `500 {"error": …}` instead of `200 []`, which read as an empty library; the client now shows its "Failed to load prompts" toast for it. `site/public/robots.txt` answers `/robots.txt` with text instead of the app's HTML. `PORT` sets the local server's port (default 3010), so a second copy can run beside the first.

_Touched: `site/scripts/refresh-library-cards.mjs`, `site/library/3_Skills/Libraries/baojie-shiji-kb.md`, `site/api/prompt-index.json`, `site/api/index.ts`, `site/src/App.tsx`, `site/server.ts`, `site/public/robots.txt`, `site/.env.example`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — archive/ cut to the leaked-source system prompts (PB-04, PB-05)

**Content**
- **PB-05:** removed 1,968 files (25 MB) from `archive/`: the 669 unlinked prompts and 28 guides (`unlinked-2026-10-26/`), the 224 copied skill-library skills (`skill-libraries-2026-10-27/`, which included four Anthropic document skills whose LICENSE reads "All rights reserved"), `skill-libraries-2026-11-18/`, the five unlicensed skills (`unlicensed-2026-10-27/`, no licence, GPL/AGPL, or an MIT rider), the 81 loose skill files and the old `prompt_generation/` scripts. Unserved is not unpublished: in a public repo they were still redistributed. All of it is in git history at `86ff6925`; `archive/README.md` says how to read or restore a file.
- **PB-04:** `archive/leaked-sources-2026-11-18/` stays, by the owner's call (no deletion, no history rewrite). The audit's other two asks were already met: the demo returns 404 for those system prompts (production has redeployed since #537) and `scripts/upstream.test.mjs` fails an item sourced from a leak collection.

**Docs**
- `archive/README.md`, `AGENTS.md`, `docs/README.md`, `docs/CONTRIBUTING.md`, `docs/ROADMAP.md` and the `1_Guides`, `3_Skills` and `4_Prompts` READMEs point at the restore commit instead of folders that no longer exist.

_Touched: `archive/`, `AGENTS.md`, `docs/README.md`, `docs/CONTRIBUTING.md`, `site/library/1_Guides/README.md`, `site/library/3_Skills/README.md`, `site/library/4_Prompts/README.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Jailbreak prompts removed and kept out (PB-01)

**Content**
- Removed 13 ChatGPT-Shortcut cards written to talk a model out of its rules: The DAN 6.0, 6.2, 7.0, 8.0, 9.0, 10.0 and 11.0 prompts, The Anti-DAN Prompt, The Jailbreak Prompt, ChatGPT Developer Mode v2, ChatGPT DevMode + Ranti, ChatGPT Image Unlocker and Unrestricted ChatGPT (`site/library/4_Prompts/ChatGPT_Shortcut/AI/`). Three of them were on the default first screen, and the MCP server could hand any of them to an agent as a user message. The index drops from 890 to 877 items.

**Tests**
- `scripts/upstream.test.mjs` fails CI on any library item copied from one of those 13 upstream cards (`rockbenben/ChatGPT-Shortcut`, `src/data/cards/<n>_en.json`) or titled like a jailbreak (DAN *n*, Anti-DAN, Developer Mode, DevMode, Image Unlocker, Unrestricted ChatGPT, "do anything now"), so a refresh or a finder can't bring one back.

_Touched: `site/library/4_Prompts/ChatGPT_Shortcut/AI/`, `site/api/prompt-index.json`, `scripts/upstream.test.mjs`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — Cards work from the keyboard; Related no longer bounces back (PB-02, PB-03)

**Fixes**
- **PB-02:** a prompt or pack card was an `<article role="button" tabindex="0">` whose Enter handler opened the card, so Enter on Copy, Download, Save to My Library, Star, Edit, Delete or a pack's Add/Remove opened the card and ran nothing. The card's title is now a real `<button>` (`.card-open`) and the article keeps only its mouse click; Lighthouse's `aria-allowed-role` complaint about buttons inside a button goes with it.
- **PB-03:** opening a prompt set `?prompt=` state that nothing cleared, so Related, a breadcrumb category, a sidebar row or a sub-category pill cleared the prompt and the deep-link effect reopened it. The deep-link param is now consumed once, when it matches; the URL still follows the open prompt.

**Tests**
- `test:browser` presses Enter on a card's Download (a download, the card stays shut), Enter on its title (the prompt opens), then clicks Related and checks the prompt is still closed a second later. Both cases fail on the old code.

**Docs**
- `docs/ROADMAP.md` gains an "Audit follow-ups, 2026-11-18" section with the audit's 32 backlog ids; PB-02 and PB-03 are ticked.

_Touched: `site/src/components/PromptCard.tsx`, `site/src/components/SkillPacksView.tsx`, `site/src/index.css`, `site/src/App.tsx`, `site/scripts/browser-smoke.test.mjs`, `docs/ROADMAP.md`, `AGENTS.md`, `docs/CHANGELOG.md`._

---

## 2026-11-22 — README contact is the org address

`README.md`'s Support section listed a personal email address. It now gives `admin@ai-automation-tools.dev`, the org's role address. Closes the Upkeep item flagged by the 2026-11-10 Security sweep.

_Touched: `README.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-21 — Feature docs drop their library counts

**Docs**
- `features/LIBRARY-MODE-IMPLEMENTATION.md` said the Public Library holds 903 prompts in five sections, and `features/MCP-SERVER.md` that ~600 prompts and system prompts would bury the slash-command menu. The index held 897 items in six sections that day, and moves with every content PR, so both now point at `promptCount` in `site/api/prompt-index.json` or say "several hundred" instead of a number that goes stale.
- The roadmap item's other half, `surfaces.json` counting "items" rather than "prompts", stays open: that file belongs to the homepage-refresh tooling (`Get-SurfaceDrift.py`), which is not in this repo.

_Touched: `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`, `docs/features/MCP-SERVER.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-21 — Library refresh — guides

Merged three duplicate groups and corrected six guides against sources read that day.

- **Merged:** `CLI_Tools/fabric_cli_guide.md` into `fabric-cli-guide.md` (flags fixed against the Fabric README: `-y` replaces the `yt` helper, `--listpatterns`, `--updatepatterns`, `-C` is context and `-c` is copy; `repo:` now `danielmiessler/Fabric`); `aider-advanced-guide.md`, `aider-guide.md`, `aider-setup-guide.md`, `aider_cli_guide.md` into `aider_guide.md` (install via `aider-install`, `/read-only`, `.aider.conf.yml`; Aider README and `docs/usage/commands.md`); `IDE_Extensions/cline_guide.md` and `cline_ide_guide.md` into `cline-guide.md` (surfaces, `.clinerules`, auto-approve; Cline README). The merged-away files are deleted.
- **Models:** `API_Providers/openai_api_guide.md`, `openai_cli_guide.md`, `openai-api-best-practices.md` moved to `gpt-6.2-sol`, `gpt-6.2-astra`, `gpt-6.1-terra`, `gpt-6-luna` with prices and limits from developers.openai.com/api/docs/models; Codex release line updated to 0.171.0 (openai/codex releases). The old `gpt-5.6-sol` / `gpt-6-astra` IDs in `aider_guide.md`, `swe-agent-guide.md` and `continue_dev_guide.md` were swapped too (ID only; those two were not otherwise re-checked and carry no `checked:`).

_Touched: `site/library/1_Guides/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-20 — Docs sweep

`docs/OPEN-QUESTIONS.md` is linked from the docs hub, and the 2026-10-31 entries sit above 2026-10-30 again so the headings run newest-first. Entries moved whole; no text changed.

_Touched: `docs/README.md`, `docs/CHANGELOG.md`._

---

## 2026-11-20 — Library: new MCP servers

Three official servers, each written from its README read that day: Sentry (`getsentry/toolkit`, `packages/mcp-server`, FSL-1.1-Apache-2.0) and Datadog (`datadog-labs/mcp-server`, MIT) in `Developer_Tools/`, and Google Analytics (`googleanalytics/google-analytics-mcp`, Apache-2.0) in `Apps_and_Services/`. The `6_MCP_Servers` README now counts 57 cards.

_Touched: `site/library/6_MCP_Servers/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-19 — Library: new agents

Four definitions, copied unchanged from their repos (`match: exact`, licences read 2026-11-19): `legacy-analyst` and `business-rules-extractor` from the code-modernization plugin in `anthropics/claude-plugins-official` (Apache-2.0), in a new folder `2_Agents/Modernization/`; `team-debugger` from `wshobson/agents` (MIT), in `Quality/`; `docs-drift-editor` from `VoltAgent/awesome-claude-code-subagents` (MIT), in `Development/`.

_Touched: `site/library/2_Agents/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Vite security bump

`vite` is `^8.3.8` in `site/package.json` and 8.3.8 in the lockfile (PR #501, Dependabot's minor-and-patch group), past 8.3.7, the fix for GHSA-p4f5-76q4-ffq7 (remote code execution through the dev server's `__vite-browser-external` module). Roadmap item ticked by the 2026-11-21 sweep.

_Touched: `site/package.json`, `site/package-lock.json`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library data-flow diagram re-pinned

Re-read the changed cited code (frame-ancestors block in `site/api/index.ts`, embed hooks in `site/src/App.tsx`, the drift workflow's PR note) and moved the line ranges; the Upstream card now says the org PR sweep reads the resync PR. Pinned to `6d97d36b`.

_Touched: `docs/diagrams/`, `homepage/diagram/library-data-flow.html`, `docs/CHANGELOG.md`._

## 2026-11-18 — System prompts: vendor-published only

136 of the section's 167 system prompts named a leak collection as their source: `jujumilk3/leaked-system-prompts` (46), `0xeb/TheBigPromptLibrary` (88) and `LouisShark/chatgpt_system_prompt` (2). The library takes only what vendors publish, so (Mike's call) they were re-sourced where possible and archived otherwise. 16 Anthropic files now carry Anthropic's own text from its system-prompt release notes, verbatim (`match: vendor`), two of them renamed to the official dates (`anthropic-claude-opus-3-20240712.md`, `anthropic-claude-sonnet-4-5-20260118.md`), and `computer-use.md` comes from `anthropics/claude-quickstarts`. Two older "vendor" files that were hand-written summaries (Haiku 3.5, Sonnet 3.5) now hold the published text too. 122 prompts went to `archive/leaked-sources-2026-11-18/`: everything from the 38 other vendors, none of which publish their prompts, plus Anthropic's unpublished ones (Chrome extension, Cowork, the "soul document") and duplicates. The section is 39 files, all vendor-sourced.

Guards so it doesn't come back: `scripts/upstream.test.mjs` fails any item whose source is a known leak collection; the attribution script's header says only vendor repos are valid sources; the system-prompts template and `AGENTS.md` say vendor-only; and the Monthly Upkeep brief (Routines) no longer resyncs from those collections, which its run earlier today did. The four featured system prompts were leaked or duplicates; Fable 5.2, Opus 5.5, Sonnet 5.5 and Haiku 5.5 are featured instead.

_Touched: `site/library/5_System_Prompts/`, `archive/leaked-sources-2026-11-18/`, `archive/README.md`, `scripts/upstream.test.mjs`, `scripts/attribute-system-prompts.mjs` (comment), `docs/templates/system-prompts-template.md`, `docs/features/FEATURED-PROMPTS.md`, `AGENTS.md`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Monthly upkeep

System prompts marked `behind` or `drifted` in `upstream-status.json` were resynced verbatim from `jujumilk3/leaked-system-prompts` at `2bffdfe` (`match: exact`, `checked: 2026-11-18`; frontmatter kept). Six second copies of the same capture were deleted. MCP cards (44), Resources links (40) and hand packs: nothing to fix. `backfill-tags.mjs`: 0 files.

| File (under `site/library/5_System_Prompts/`) | Action | Reason |
|:---|:---|:---|
| `Brave/brave-leo-ai.md`, `Google/google-gemini-1-5.md`, `OpenAI/openai-chatgpt-4o.md`, `Xai/grok-3.md` | resynced verbatim | `behind` |
| `Xai/xai-grok-3.md`, `Anthropic/anthropic-claude-haiku-4.5-20251015.md`, `anthropic-claude-api-tool-use.md`, `anthropic-claude-opus-20240306.md`, `anthropic-claude-opus-4.1-20250805.md`, `anthropic-claude-opus-4.md`, `anthropic-claude-sonnet-3-5-20240909.md`, `anthropic-claude-sonnet-4.5_20250929.md`, `claude-haiku-4-5.md`, `Bolt/bolt-new.md`, `Canva/canva-code.md`, `Cursor/cursor-ide-sonnet.md`, `DeepSeek/deepseek-r1.md`, `Discord/discord-clyde.md`, `Duckduckgo/duckai-gpt-4o-mini.md` | resynced verbatim | `drifted`, same capture reformatted |
| `Google/google-gemini-1.5.md` | deleted | duplicate of `google-gemini-1-5.md` |
| `OpenAI/openai-chatgpt4o.md` | deleted | duplicate of `openai-chatgpt-4o.md` |
| `Anthropic/anthropic-claude-haiku-4.5.md` | deleted | duplicate of `anthropic-claude-haiku-4.5-20251015.md` |
| `Anthropic/anthropic-claude-sonnet-3-7.md` | deleted | duplicate of `anthropic-claude-sonnet-3.7.md` |
| `Anthropic/anthropic-claude-sonnet-3-5-20241022.md` | deleted | duplicate of `anthropic-claude-sonnet-3.5.md` |
| `Anthropic/anthropic-claude-sonnet-4.5_20251119.md` | deleted | duplicate of `anthropic-claude-sonnet-4.5-20251119.md` |
| `2_Agents/AI_ML/AI_Engineering_SMEs/ai-engineer.md`, `AI_ML/MCP/mcp-deployment-orchestrator.md`, `AI_ML/Other/adr-generator.md`, `DevOps/observability-engineer.md` | featured | agents were at 0, floor is 4 |
| `3_Skills/Business/copy-editing/SKILL.md`, `3_Skills/Content/notebooklm/SKILL.md` | featured | skills were at 1, floor is 4 |

Next month: 15 more `drifted` system prompts (Anthropic and others, `github-copilot-chat` onward), 2 `LouisShark` Gemini Gems, `blader/humanizer` (skill, off limits); featured floor still short: agents 4 of 4 met, skills 3 of 4, prompts 0 of 4.

_Touched: `site/library/5_System_Prompts/**` (above), the six featured files, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._
## 2026-11-18 — Library: prefill, 10 new MCP servers

Ten cards from reputable sources (official vendor servers first), each written from the server's own README read that day: Todoist (`todoist/todoist-mcp`, MIT), Contentful (`contentful/contentful-mcp-server`, MIT), Perplexity (`perplexityai/modelcontextprotocol`, MIT), Brave Search (`brave/brave-search-mcp-server`, MIT), Azure DevOps (`microsoft/azure-devops-mcp`, MIT), Postman (`postmanlabs/postman-mcp-server`, Apache-2.0), Mobile MCP (`mobile-next/mobile-mcp`, Apache-2.0), Firebase (`firebase/firebase-tools`, MIT), DuckDB and MotherDuck (`motherduckdb/mcp-server-motherduck`, MIT) and Postgres MCP Pro (`crystaldba/postgres-mcp`, MIT). The `6_MCP_Servers` README now counts 54 cards.

_Touched: `site/library/6_MCP_Servers/**` (ten new cards, README), `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: new prompts (prefill, round 2)

30 prompts from vendor repos, copied with provenance (`match: similar`, each at the commit read that day). Four new collections: `google-gemini/gemini-cli` (6 slash commands, Apache-2.0), `google-github-actions/run-gemini-cli` (5 GitHub Actions prompts, Apache-2.0), `anthropics/claude-quickstarts` (5 agent prompts, MIT) and `anthropics/claude-code-action` (1 command, MIT). Existing collections grew: `anthropics/claude-cookbooks` +8 (MIT; review commands, the chief-of-staff commands, a sandbox-escape transcript reviewer) and `openai/openai-cookbook` +5 (MIT; an LLM judge, two voice agents, two portfolio agent prompts). `NOTICE` and `4_Prompts/README.md` carry the new collections.

_Touched: `site/library/4_Prompts/`, `NOTICE`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: prefill, 20 new skills (round 2)

Skill library cards (README copied, no skill text) for official vendor and most-starred repos not yet carded. Licence is the repo's; cards only link and describe.

- `google-gemini/gemini-skills` (Apache-2.0), `browserbase/skills` (none declared), `langchain-ai/langchain-skills` (MIT), `hashicorp/agent-skills` (MPL-2.0), `elastic/agent-skills` (Apache-2.0), `elevenlabs/skills` (MIT), `Shopify/Shopify-AI-Toolkit` (MIT), `grafana/skills` (Apache-2.0), `datadog-labs/agent-skills` (MIT), `databricks/databricks-agent-skills` (NOASSERTION), `firebase/agent-skills` (Apache-2.0), `mongodb/agent-skills` (Apache-2.0), `clerk/skills` (none declared), `netlify/context-and-tools` (MIT), `prisma/skills` (MIT), `render-oss/skills` (MIT), `pulumi/agent-skills` (Apache-2.0), `redis/agent-skills` (MIT), `sanity-io/agent-toolkit` (MIT), `nextlevelbuilder/ui-ux-pro-max-skill` (MIT).

_Touched: `site/library/3_Skills/Libraries/`, `site/library/3_Skills/README.md`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: new guides (prefill, round 2)

Fifteen guides for widely used AI coding and agent tools, each checked against the official docs read that day. Every repo is public, not archived and pushed within the week.

- Claude Code (`anthropics/claude-code`, no licence file): `skills-guide`, `plugins-guide`, `settings-permissions-guide`.
- Gemini CLI (`google-gemini/gemini-cli`, Apache-2.0): `gemini-md-context-guide`, `mcp-servers-guide`.
- API_Providers: `claude-agent-sdk-typescript-guide` (`anthropics/claude-agent-sdk-typescript`, no licence file), `crewai-guide` (`crewAIInc/crewAI`, MIT), `pydantic-ai-guide` (`pydantic/pydantic-ai`, MIT), `smolagents-guide` (`huggingface/smolagents`, Apache-2.0), `dspy-guide` (`stanfordnlp/dspy`, MIT), `langchain-guide` (`langchain-ai/langchain`, MIT), `mcp-python-sdk-guide` (`modelcontextprotocol/python-sdk`, MIT), `mcp-typescript-sdk-guide` (`modelcontextprotocol/typescript-sdk`, licence per repo).
- CLI_Tools: `copilot-cli-guide` (`github/copilot-cli`), `vllm-guide` (`vllm-project/vllm`, Apache-2.0).

_Touched: `site/library/1_Guides/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: new agents

One-time prefill, round 2: 18 agent definitions from well-maintained collections and an official vendor repo, all `match: exact`, roles the section lacked. `2_Agents` goes from 94 to 112 files.

- `anthropics/claude-plugins-official` (Apache-2.0): `code-explorer`, `code-simplifier`, `Quality/code-reviewer`, `comment-analyzer`, `agent-creator`, `plugin-validator`.
- `wshobson/agents` (MIT): `security-auditor`, `debugger`, `performance-engineer`, `test-automator`, `error-detective` (all `Quality/`), `backend-architect`.
- `VoltAgent/awesome-claude-code-subagents` (MIT): `sre-engineer`, `platform-engineer`, `chaos-engineer` (`DevOps/`), `postgres-pro` (`AI_ML/Data_SMEs/`), `product-manager`, `ux-researcher` (new `Product/` folder).

_Touched: `site/library/2_Agents/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: new system prompts (prefill, round 2)

Fourteen vendor-published prompts. Eight Anthropic captures from its system-prompt release notes (`match: vendor`, newest dated entry each): Claude Fable 5.2 (2026-11-09), Opus 5.5, Sonnet 5.5, Haiku 5.5, Opus 4.8, Opus 4.7, Opus 4.6 and Sonnet 4.6. Three Codex CLI prompts from `openai/codex` (Apache-2.0): GPT-5.1, GPT-5-Codex, GPT-5.2-Codex. Three opencode prompts from `anomalyco/opencode` (MIT): GPT Astra, Trinity, Meta. Each Anthropic page splits one prompt into two code blocks; they are joined with the seam removed, text otherwise unchanged.

_Touched: `site/library/5_System_Prompts/{Anthropic,OpenAI,OpenCode}/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — repowise prompts rejected

`repowise-dev/claude-code-prompts` was marked `accept` in the 2026-11-18 triage. The prompts finder's backfill found its `complete-prompts/` mirror Claude Code's internal prompts section by section, so it copied nothing and asked. It is now `reject` in `DISCOVERY.md`, which the finders honour, and the question in `OPEN-QUESTIONS.md` is answered.

_Touched: `docs/DISCOVERY.md`, `docs/OPEN-QUESTIONS.md`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: new guides

Four guides for tools people are adopting now, each written from the project's own README and docs read that day: Pi coding agent (`earendil-works/pi`, MIT), GitHub Spec Kit (`github/spec-kit`, MIT), Kilo Code (`Kilo-Org/kilocode`, MIT) and Google ADK (`google/adk-python`, Apache-2.0).

_Touched: `site/library/1_Guides/CLI_Tools/pi-guide.md`, `site/library/1_Guides/CLI_Tools/spec-kit-guide.md`, `site/library/1_Guides/IDE_Extensions/kilo-code-guide.md`, `site/library/1_Guides/API_Providers/google-adk-guide.md`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library refresh — skills and MCP

- Skill library cards, rewritten from each repo's GitHub description and README by `refresh-library-cards.mjs`: `addyosmani-agent-skills`, `ai-automation-tools-agent-skills`, `coreyhaines31-marketingskills`, `huggingface-skills`, `wshobson-agents` (all `3_Skills/Libraries/`).
- Single skills: none behind or drifted in `upstream-status.json`; hand-pack paths all live.
- MCP cards re-read against each server's README, `server.checked` set to 2026-11-18: `n8n-mcp` (czlonkowski/n8n-mcp: tools list, overwrite-on-edit caveat), `notion` (makenotion/notion-mcp-server: Notion now recommends and supports only its remote server), `stripe` (stripe/ai: old npm packages deprecated), `chrome-devtools` (ChromeDevTools/chrome-devtools-mcp: usage statistics opt-out), `resend` (resend/resend-mcp: unchanged). `check-mcp-servers.mjs`: 28 cards, none need a look.
- `api/prompt-index.json` rebuilt.

---

## 2026-11-18 — Library refresh — guides

Eight guides checked against their sources and corrected; each carries `checked: 2026-11-18`.

- `Claude_Code/flags-reference.md`, `Claude_Code/slash-commands.md`: added the flags, shell subcommands (`respawn`, `rm`, `daemon`, `purge`, `ultrareview`…) and slash commands the docs list now, and noted `/ultraplan` and `--enable-auto-mode` as removed. Source: code.claude.com/docs/en/cli-reference and /commands.
- `Gemini_CLI/flags-reference.md`: added `--experimental-acp` and `--experimental-zed-integration`. `Gemini_CLI/slash-commands.md`: dropped `/fork`, `/color`, `/effort` and `/sandbox`, which are not Gemini CLI commands. Source: docs/cli/cli-reference.md, docs/reference/commands.md and `packages/cli/src/ui/commands` in google-gemini/gemini-cli.
- `Codex/flags-reference.md`: added the `agents`, `app`, `archive`, `unarchive`, `delete`, `queue`, `plugin`, `execpolicy` and `remote-control` subcommands and the `--worktree`, `--no-daemon`, `--approve-for-me`, `--remote-auth-token-env` and `--dangerously-bypass-hook-trust` flags; `/clear` starts a new chat. `Codex/slash-commands.md`: added the full command list. Source: learn.chatgpt.com/docs/developer-commands and `codex-rs/tui/src/slash_command.rs` in openai/codex.
- `API_Providers/anthropic_api_guide.md`, `API_Providers/anthropic_cli_guide.md`: Fable 5.1 → Fable 5.2 (`claude-fable-5-2`). Source: platform.claude.com/docs/en/about-claude/models/overview.

No merges this run; duplicate guides (`cline*`, `aider*`, `cursor*`, `fabric*`, `cohere*`) stay queued.

_Touched: the eight guides above, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: backfill, 16 new MCP servers

One-time backfill of `6_MCP_Servers/` (28 to 44 cards), spread across the folders; two new folders, `Databases/` and `Web_and_Search/`. Each card's install lines were read from the server's README on the day; none of the servers is vendored.

- `Developer_Tools/`: Serena (`oraios/serena`, GPL-3.0-or-later, SolidLSP MIT), Context Mode (`mksglu/context-mode`, Elastic License 2.0), Framelink MCP for Figma (`GLips/Figma-Context-MCP`, MIT), Docker MCP Gateway (`docker/mcp-gateway`, MIT).
- `Cloud_Platforms/`: Azure (`microsoft/mcp`, MIT), Kubernetes (`Flux159/mcp-server-kubernetes`, MIT).
- `Databases/`: MCP Toolbox for Databases (`googleapis/mcp-toolbox`, Apache-2.0), ClickHouse (`ClickHouse/mcp-clickhouse`, Apache-2.0), Qdrant (`qdrant/mcp-server-qdrant`, Apache-2.0), Redis (`redis/mcp-redis`, MIT).
- `Web_and_Search/`: Exa (`exa-labs/exa-mcp-server`, MIT), Tavily (`tavily-ai/tavily-mcp`, MIT), Firecrawl (`firecrawl/firecrawl-mcp-server`, MIT), Apify (`apify/apify-mcp-server`, MIT).
- `Reference/`: Microsoft Learn (`MicrosoftDocs/mcp`, CC-BY-4.0).
- `Apps_and_Services/`: Blender (`ahujasid/mcp-for-blender`, MIT).

_Touched: `site/library/6_MCP_Servers/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: backfill, 8 new system prompts

Prompts that open-source agents publish in their own repos, copied verbatim (`match: exact`):

- `OpenAI/codex-cli-gpt-5-2.md`, `OpenAI/codex-cli-gpt-5-1-codex-max.md`: openai/codex (Apache-2.0).
- `OpenCode/opencode-gpt.md`, `OpenCode/opencode-kimi.md`: anomalyco/opencode (MIT).
- `Goose/goose-system.md`, `Goose/goose-subagent.md`: aaif-goose/goose (Apache-2.0).
- `Mistral/mistral-vibe-cli.md`: mistralai/mistral-vibe (Apache-2.0).
- `HuggingFace/smolagents-code-agent.md`: huggingface/smolagents (Apache-2.0).

_Touched: `site/library/5_System_Prompts/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: backfill, 16 new prompts

Four new collections under `4_Prompts/`, four prompts each, copied from the repo at the commit stamped in each file: `Microsoft_Copilot_Prompts/` (pnp/copilot-prompts, MIT: Prompt Architect, Code Review Feedback, Clean AI Writing, Decision Log Generator), `Claude_Cookbooks/` (anthropics/claude-cookbooks, MIT: the research lead, research subagent and citations agent prompts, and the review-pr command), `OpenAI_Cookbook/` (openai/openai-cookbook, MIT: portfolio manager, fundamental analyst, quant analyst and memo editor agents) and `Claude_Plugins_Official/` (anthropics/claude-plugins-official, Apache-2.0: the code-review, feature-dev, commit-push-pr and revise-claude-md commands). Licences are in `NOTICE`.

_Touched: `site/library/4_Prompts/`, `NOTICE`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: backfill, 18 new skill libraries

One-time backfill of `3_Skills/Libraries/`: 18 cards, one per repo, bodies from each README. A card describes and links; no skill text is copied.

- `mattpocock/skills` (MIT), `vercel-labs/agent-skills` (no licence file), `anthropics/knowledge-work-plugins` (Apache-2.0), `google-labs-code/stitch-skills` (Apache-2.0), `pbakaus/impeccable` (Apache-2.0), `emilkowalski/skills` (MIT)
- `obsidianmd/obsidian-skills` (MIT), `microsoft/skills` (MIT), `cloudflare/skills` (Apache-2.0), `supabase/agent-skills` (MIT), `expo/skills` (MIT), `dotnet/skills` (MIT)
- `trailofbits/skills` (CC-BY-SA-4.0), `remotion-dev/skills` (no licence file), `AgriciDaniel/claude-seo` (MIT), `alirezarezvani/claude-skills` (MIT), `getsentry/skills` (Apache-2.0), `WordPress/agent-skills` (NOASSERTION)

_Touched: `site/library/3_Skills/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: backfill, 17 new agents

One-time backfill of `2_Agents/`, 17 unchanged copies, each with its `upstream:` block (sha read 2026-11-18): `anthropics/claude-plugins-official` (Apache-2.0): `pr-test-analyzer`, `type-design-analyzer`, `code-architect`; `wshobson/agents` (MIT): `kubernetes-architect`, `terraform-specialist`, `observability-engineer`, `legacy-modernizer`; `affaan-m/everything-claude-code` (MIT): `build-error-resolver`, `e2e-runner`, `refactor-cleaner`, `planner`; `0xfurai/claude-code-subagents` (MIT): `docker-expert`, `github-actions-expert`, `langchain-expert`; `VoltAgent/awesome-claude-code-subagents` (MIT): `incident-responder`, `accessibility-tester`, `qa-expert`. New folders `DevOps/` and `Quality/`.

_Touched: `site/library/2_Agents/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Library: new guides (backfill)

Twelve guides, each written from the official docs read that day and citing them in a Sources list: Claude Code MCP servers and CLAUDE.md memory (`anthropics/claude-code`, no SPDX licence), Gemini CLI extensions (`google-gemini/gemini-cli`, Apache-2.0), Codex config.toml (`openai/codex`, Apache-2.0), OpenCode (`anomalyco/opencode`, MIT), goose (`aaif-goose/goose`, Apache-2.0), Crush (`charmbracelet/crush`, FSL-1.1-MIT), llama.cpp (`ggml-org/llama.cpp`, MIT), OpenAI Agents SDK (`openai/openai-agents-python`, MIT), Claude Agent SDK for Python (`anthropics/claude-agent-sdk-python`, MIT), LangGraph (`langchain-ai/langgraph`, MIT), LiteLLM (`BerriAI/litellm`, MIT plus a separate commercial licence for some features).

_Touched: `site/library/1_Guides/`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — One finder per section, one keeper for the rest

How the library grows changed (Mike): instead of one content job that added 2 prompts and a guide a week and vendored only the repos someone had marked `accept`, each section now has its own finder in the Routines fleet. Every finder searches news, social and AI forums for what's trending in its section and adds it straight to a PR the Org PR Sweep merges, with no per-item decision: Prompts on Monday, Skills Tuesday, Guides Wednesday, Agents Thursday and MCP Servers Friday, 3–5 items each, and System Prompts on the first Sunday of the month (vendor-published only). The provenance rules don't move: every item names its GitHub repo, and copied text needs a permissive licence. A one-time larger backfill run per section fills the library first.

Existing content has one owner now, the Saturday **Library Keeper**, which rotates guides, then prompts and agents, then skills and MCP cards, and fixes only what's already there. It took over the old Thursday refreshes and the Library Cards Refresh. The Discovery job is retired and `docs/DISCOVERY.md` is closed; the finders still skip any repo it marks `reject`. `upstream-drift.yml` and the Monthly Upkeep are unchanged.

_Touched: `AGENTS.md`, `docs/CHANGELOG.md`, `docs/DISCOVERY.md`, `docs/README.md`, `docs/ROADMAP.md`, `docs/templates/mcp-servers-template.md`, `scripts/discover-repos.mjs` (comment only), `site/library/2_Agents/README.md`, `site/library/6_MCP_Servers/README.md`._

---

## 2026-11-18 — One local page for every automation

`docs/AUTOMATIONS.local.md` lists every scheduled job, workflow and sweep that touches Promptbook: schedule, next and last run, model, PR branch, the Thursday rotation, open automation PRs, and whether `site/library` on `main` has moved lately. It's gitignored (local paths and schedules) and rewritten every Sunday at 07:00 by a new Routines job, `promptbook-automations-doc`, which links back to the Routines docs. The page's hand-written parts live in that job's `template.md`.

_Touched: `.gitignore`, `AGENTS.md`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Roadmap's job table brought up to date

The "Kept current by" table in `docs/ROADMAP.md` still listed the four content jobs that became Promptbook Content on 2026-11-09, called them biweekly (they rotate, every third Thursday), and missed today's changes: Monthly Upkeep now owns system-prompt drift, the PR sweep runs daily and approves the held CI run on the `upstream/resync` PR. Rewritten from the jobs' current configs. The leftover job names elsewhere went too (ROADMAP's `small` rename item, now ticked): "Prompt-Library Discovery" and "Prompt-Library Upstream Check" are the Promptbook ones, and "Catalog Refresh" is the Promptbook Content job's catalog run.

_Touched: `docs/ROADMAP.md`, `docs/DISCOVERY.md`, `docs/UPSTREAMS.md`, `docs/templates/mcp-servers-template.md`, `site/library/2_Agents/README.md`, `site/library/6_MCP_Servers/README.md`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Star an item as you create it

New item has an "Add to favorites" checkbox under the tags. Ticked, the item is starred as soon as the server creates it (the same `POST /api/my-library/favorites` the star button sends), so there's no reopening it to star it. Editing an existing item doesn't show the box; its star is on the item page. `test:browser` creates an item with the box ticked and checks `favorites.json`.

_Touched: `site/src/components/PromptEditorModal.tsx`, `site/src/App.tsx`, `site/scripts/browser-smoke.test.mjs`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Two more prompt sources

Every collection already in `4_Prompts/` is used up, and after the triage the only prompt source marked `accept` was the Microsoft 365 Copilot set, so the Monday job's 2-prompt quota would have run dry again. Two MIT collections added to `docs/DISCOVERY.md` as `accept`: `pnp/copilot-prompts` (the Microsoft 365 community's prompt samples) and `repowise-dev/claude-code-prompts` (coding-agent prompt templates its authors wrote from scratch, per its DISCLAIMER.md; not extracted text).

_Touched: `docs/DISCOVERY.md`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — Discovery queue triaged

All 74 pending rows in `docs/DISCOVERY.md` decided with Mike: 16 `accept` (9 skill-library cards, 4 single skills, 2 MCP cards, and the Microsoft 365 Copilot prompts), 18 `link` (awesome lists, tools, collections whose licence rules out copying, and Piebald-AI's Claude Code system prompts, which are extracted from the package while `5_System_Prompts` takes only what vendors publish), 40 `reject` (apps and platforms, Chinese-language-first repos, anti-bot and credential tooling, an archived list, low-signal packs). The content job's prompt quota had gone unmet for want of an accepted prompts row; the catalog runs now have a queue again. The Discovery job, paused since 2026-11-03 until this was done, is re-enabled; its next run adds the `link` rows to the Resources menu.

_Touched: `docs/DISCOVERY.md`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — A Codex AGENTS.md guide, no new prompts

Added `1_Guides/Codex/agents-md-guide.md` (repo `openai/codex`): which `AGENTS.md` and `AGENTS.override.md` files Codex loads and in what order, `project_doc_fallback_filenames`, the `project_doc_max_bytes` cap, and how to check what loaded. Sourced from the official Codex AGENTS.md guide, read this run. No prompts: every collection in `4_Prompts/` is exhausted and no `docs/DISCOVERY.md` row is set to `accept`.

_Touched: `site/library/1_Guides/Codex/agents-md-guide.md` (new), `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — The weekly upstream PR runs CI and gets swept

The Monday upstream-drift Action opens its `upstream/resync` PR as the github-actions bot, and GitHub holds that PR's `pull_request` CI run at "action_required" until someone approves it. Until then the required `check` and `secrets` never report and the PR stays blocked (#488, #503). A first attempt, starting `ci.yml` by `workflow_dispatch` from the Action (#507), ran green but GitHub doesn't count a dispatched run's checks toward the PR, so it is taken out again. Instead the org PR sweep, which runs as the owner, now approves held runs on any fleet PR before reviewing it (`Invoke-PrSweep.ps1` in the Routines repo). It also covers `upstream/resync` and sweeps Promptbook every day rather than Wednesday and Sunday, and the Promptbook scheduled tasks start late when the PC was off at their time.

_Touched: `.github/workflows/upstream-drift.yml`, `docs/CHANGELOG.md`._

---

## 2026-11-18 — tasteskill becomes a library card

Upstream rewrote `design-taste-frontend` from tasteskill v2 to v2.5, and the weekly roadmap run opened #500 to resync it. v2.5 runs on its `assets/` and `scripts/` folders (about 36 MB, 1,600+ files) in nearly every step, and we never copied those, so the resynced `SKILL.md` would have shipped in ZIPs as instructions for tools that aren't there. Under the skill-library rule it is now one card, `3_Skills/Libraries/leonxlnx-taste-skill.md`, that links the repo and carries its README; you install the skill from GitHub. The v2 copy moved to `archive/skill-libraries-2026-11-18/`, its entry left `upstream-status.json`, and #500 was closed.

_Touched: `site/library/3_Skills/Libraries/leonxlnx-taste-skill.md` (new), `site/library/3_Skills/Design/design-taste-frontend/` (to `archive/`), `site/library/3_Skills/README.md`, `site/api/upstream-status.json`, `site/api/prompt-index.json`, `archive/README.md`, `docs/DISCOVERY.md`, `docs/CHANGELOG.md`._

---

## 2026-11-17 — Embed mode for the suite shell

Opened as `?embed=1` inside a frame (a Project Hub tab now, the suite shell later), Promptbook follows embed contract v1 (`src/lib/embed.ts`). It hides the chrome the shell replaces: the brand in the top bar and the rail, the source bar and the Light | Dark switch. It posts `{suite: 1, contract: 1, type: 'ready', app: 'promptbook'}` once loaded and `{type: 'route', path}` whenever the URL changes, and it applies `{suite: 1, type: 'theme', value}` from its parent. Standalone, `?embed=1` does nothing. The app talks only to `window.parent`: who may be the parent is already decided by `FRAME_ANCESTORS`, so messages go out with `'*'` and only the parent's are read. `test:browser` frames the built app and checks all of it.

_Touched: `site/src/lib/embed.ts` (new), `site/src/App.tsx`, `site/src/hooks/useLibraryRoute.ts`, `site/src/components/{TopBar,SectionRail}.tsx`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `docs/setup/SETUP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-17 — Framing allowed from listed origins

Mike tried Promptbook inside a Project Hub tab, as a first step toward one window for Cronsole, Project Hub and Promptbook. helmet's default `X-Frame-Options: SAMEORIGIN` refused the frame; nobody had chosen that, it was just helmet's default. `FRAME_ANCESTORS` (comma-separated origins) now lets the listed pages frame the app: the server then drops X-Frame-Options, which has no allowlist, and sends CSP `frame-ancestors 'self' <origins>`. Each entry is reduced to its origin and a non-http(s) entry is dropped, so nothing else reaches the header. Unset, nothing changes. The hosted demo is unaffected: its pages get `X-Frame-Options: DENY` from `vercel.json`.

_Touched: `site/api/index.ts`, `site/scripts/frame-ancestors.test.mjs` (new, `npm run test:frame-ancestors`, in CI), `site/package.json`, `site/.env.example`, `.github/workflows/ci.yml`, `AGENTS.md`, `README.md`, `docs/setup/SETUP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-14 — Library data-flow diagram re-pinned

Re-read `my-library.ts`, `api/index.ts` and `App.tsx` after server-side favorites: fixed the cited line ranges, and the Two libraries card now says favorites live in `favorites.json` and travel with export and import. Rebuilt with `--pin-head`.

## 2026-11-13 — Favorites are kept in My Library, not the browser

Mike opened Promptbook at its Tailscale address and his favorites were gone. They weren't lost: they were in Edge's localStorage for `http://127.0.0.1:3010`, and a browser keeps localStorage separately for every address, so `localhost`, the Tailscale name and every other browser or phone each started with an empty list.

**Server.** Favorites (My Library items and `pack:<id>` Skill Packs) now live in `favorites.json` in the My Library folder, which is gitignored like the rest of it. `GET /api/my-library/favorites` lists them, `POST` with `{ ids }` stars (skipping ids already starred and My Library ids whose file is gone), `DELETE /api/my-library/favorites/:id` unstars. All three are 403 under `READ_ONLY`, and the writes pass the cross-site Origin check. Writes are temp-file-and-rename, and a `favorites.json` broken by hand reads as empty but is never overwritten. Deleting an item unstars it. Export now includes `favorites.json`; an import previews its new stars (`favorites` in the plan) and applying only adds them.

**App.** `useFavorites` replaces the localStorage state in `App.tsx`: a star shows at once and is taken back with a toast if the server refuses it, and the list reloads when the tab becomes visible, so a star made on another device shows up. A browser that still holds the old `prompt-favorites` list sends it up once on load and removes it. Settings' Local data section now covers only recently viewed, and its Clear no longer wipes favorites. The import preview names new stars and can apply a stars-only ZIP.

**Tests.** `test:routes` pins 14 routes. `test:my-library` covers the file, id checks, the Origin check, unstar-on-delete, the broken-file guard and the export/import round trip; `test:read-only` 403s all three routes; `test:browser` stars through the UI and checks the localStorage move.

_Touched: `site/lib/my-library.ts`, `site/api/index.ts`, `site/src/hooks/useFavorites.ts`, `site/src/App.tsx`, `site/src/components/SettingsModal.tsx`, `site/src/components/MyLibraryTransfer.tsx`, `site/scripts/{api-routes,my-library,read-only,browser-smoke}.test.mjs`, `AGENTS.md`, `docs/features/API.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`, `docs/development/DEBUG_UI.md`, `docs/CHANGELOG.md`._

---

## 2026-11-12 — Library refresh — catalog

Three official MCP server cards, each read from the server's own README this run. No `accept` rows in the discovery ledger and no new vendor-published system prompts or agent definitions that fit. Sentry's server was skipped: its repo licence is not a recognised SPDX one.

- `6_MCP_Servers/Apps_and_Services/atlassian.md`: [atlassian/atlassian-mcp-server](https://github.com/atlassian/atlassian-mcp-server), Apache-2.0
- `6_MCP_Servers/Apps_and_Services/hugging-face.md`: [huggingface/hf-mcp-server](https://github.com/huggingface/hf-mcp-server), MIT
- `6_MCP_Servers/Cloud_Platforms/heroku.md`: [heroku/heroku-mcp-server](https://github.com/heroku/heroku-mcp-server), Apache-2.0

_Touched: `site/library/6_MCP_Servers/`, its README count (25 → 28), `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-11 — Roadmap recheck

The roadmap was rechecked against the org's 2026-11 requirements. The intro names the Promptbook roadmap routine instead of the old Prompt-Library name and a weekday. New items: replace the personal email in the README (🔒 which contact), a Vercel Firewall rate limit on `/api/*` (🔒), two doc fixes (stale library counts, leftover Prompt-Library job names), a Cronsole catalog from `homepage/`, and the `my-library:refresh` and `my-library:import` commands it needs for two more templates. The starter collections are marked blocked on the Skill Packs decision so a run can't take them. Nothing ticked or removed.

_Touched: `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-10 — Diagram refresh

The library data-flow diagram is re-pinned to the current commit after `site/package.json` changed (dependency version bumps only). The cited script lines and every label still hold, so only the pin and generated files moved.

_Touched: `docs/diagrams/`, `homepage/diagram/`, `docs/CHANGELOG.md`._
## 2026-11-10 — Security sweep: a ZIP import has a total size cap

A My Library import now stops once its entries unpack to more than 100 MB in total. Each entry was already capped at about 564 KB, but 5,000 small, highly compressed entries could still unpack to gigabytes in memory on a writable local copy. `readZip` also refuses anything that isn't a Buffer. A new hostile-archive case in `test:my-library` covers the cap.

_Touched: `site/lib/zip.ts`, `site/lib/my-library.ts`, `site/api/index.ts`, `site/scripts/my-library.test.mjs`, `docs/CHANGELOG.md`._

---

## 2026-11-09 — Roadmap sweep

The roadmap's "Where we are" note matches the repo again: 816 indexed items after the Awesome ChatGPT removal and the 2026-11-09 additions (2,162 before), Phases 1–3 and every release gate done, the demo build stamp added to the open after-release work, and Mike's open calls listed in full (the skill `description:` decision, `lastModified` from git, and the MCP endpoint, npm package, registry listing and launch post). No item ticked, added or removed.

_Touched: `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-09 — Category suggestions, My Library links, favorites in My Library only

**Category suggestions.** New item's Category and Subcategory fields suggest the names the current library already uses in the chosen section (Subcategory: under the typed category), through a native `<datalist>`. A new name can still be typed.

**My Library links.** The detail page's link button now works for My Library items: it copies `?library=my&prompt=<id>` on this server, and opening that URL selects the item. A My Library id is a bare slug and a public id a library path, so the two never collide. The link only opens where the file lives; it is for you, not for sharing.

**Favorites in My Library only.** Mike: favorites should only be in My Library. The star and the sidebar's Favorites row show only in My Library (items and Skill Packs); the Public Library and the read-only demo have neither, and Save to My Library is the way to keep a public item. Old public stars are dropped from `prompt-favorites` on load. `useFavoritePrompts`, which fetched the other library's stars by id, is gone, and Featured no longer mixes in favorites.

**Test.** `test:browser` no longer counts `net::ERR_ABORTED` as a failure: that is Chrome cancelling the card-preview requests still in flight when the test navigates away, and it failed Dependabot's PR #487 on a timing difference. A real server error still fails it as a 4xx or 5xx.

_Touched: `site/src/App.tsx`, `site/src/hooks/useLibraryRoute.ts`, `site/src/hooks/useFavoritePrompts.ts` (removed), `site/src/components/{PromptEditorModal,PromptDetail,PromptCard,PromptGrid,SkillPacksView,Sidebar}.tsx`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`, `docs/CHANGELOG.md`._

---

## 2026-11-09 — One prompt, one guide

**Prompt.** `4_Prompts/Microsoft_Prompts_For_Edu/Educators/individualized-student-assistance.md` (Achievement Architect), the one prompt in `microsoft/prompts-for-edu` the library lacked, from commit `508567d`. Only one: all 265 Fabric patterns are already here, and the other pending collections in `docs/DISCOVERY.md` wait for a decision.

**Guide.** `1_Guides/Claude_Code/github-actions-guide.md`: setup, the `@claude` and automation modes, review and scheduled-report workflows, inputs, cost and troubleshooting, from code.claude.com/docs/en/github-actions and the `claude-code-action` usage reference. Repo `anthropics/claude-code`.

_Touched: `site/library/4_Prompts/Microsoft_Prompts_For_Edu/Educators/individualized-student-assistance.md`, `site/library/1_Guides/Claude_Code/github-actions-guide.md`, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-07 — Library data-flow diagram re-pinned

Re-read `site/api/index.ts`, `site/api/skill-packs.ts`, `site/lib/my-library.ts`, `site/mcp/server.ts`, `site/package.json`, `site/src/App.tsx` and the upstream-drift workflow against `docs/diagrams/library-data-flow.json`. Line ranges follow the moved code, and the My Library API node and Two libraries card now cover the ZIP export and import. Rebuilt with `--pin-head`, which also refreshes the `homepage/diagram/` copies.

_Touched: `docs/diagrams/library-data-flow.*`, `homepage/diagram/library-data-flow.*`, `docs/CHANGELOG.md`._

---

## 2026-11-07 — dotenv 18, motion 14 and lucide-react 1

**Dependencies.** `dotenv` 17 → 18.0.9, `motion` 12 → 14.10.1, `lucide-react` 0.577 → 1.70.0. With `archiver` 8 (PR #477) this closes Phase 3's dependency-majors item, and Phase 3 with it.

**GitHub icon.** lucide-react 1.0 removed its brand icons, `Github` among them. `src/components/ui/GithubIcon.ts` rebuilds it with `createLucideIcon` from the icon node 0.577.0 shipped (ISC), so the Source panel, the item page, the Resources menu and the demo's source bar keep the same mark.

**MCP stdout.** dotenv 18 prints its injecting message to stderr, not stdout; `mcp/setup.ts` keeps `quiet: true` anyway, and a handshake still writes nothing but JSON-RPC.

_Touched: `site/package.json`, `site/package-lock.json`, `site/src/components/ui/GithubIcon.ts`, `site/src/components/{PromptDetail,ResourcesNav,SourceBar,SourcePanel}.tsx`, `site/mcp/setup.ts`, `AGENTS.md`, `docs/features/MCP-SERVER.md`, `docs/UPSTREAMS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-11-06 — Docs sweep

Section headers on `docs/README.md` and `docs/skill-packs/README.md`, a footer on the root README, and `README.md` indexes for `docs/setup/`, `docs/features/` and `docs/development/`. The Skill Packs guide now links its Quick Start, and its two broken pack anchors point at "Existing Packs". The two dead `audits/` links below (removed 2026-10) are plain text now, and the 2026-11-02 entry moved into date order.

_Touched: `README.md`, `docs/README.md`, `docs/skill-packs/README.md`, `docs/setup/README.md`, `docs/features/README.md`, `docs/development/README.md`, `docs/CHANGELOG.md`._

---

## 2026-11-05 — Node 24, actions v7, Awesome ChatGPT removed

Four roadmap items Mike approved.

- **Node 24.** CI and `upstream-drift.yml` run on `node-version: "24"`, `@types/node` is `^24.19.2`, and `site/package.json` pins `engines.node` to `24.x`, which Vercel reads over the project setting. The Vercel project was already on `24.x`. Node 22 reaches end of life on 2027-04-30. Every CI step passes locally on Node 24.22.1.
- **Actions v7.** `ci.yml` (both jobs) and `upstream-drift.yml` use `actions/checkout@v7` and `actions/setup-node@v7`, the major `homepage.yml` already used. v4 ran on Node 20.
- **Stale branch.** `roadmap/auto-2026-08-31` (PR #332, closed unmerged) is deleted on origin. Its one commit renamed the attribution tier `behind` to `similar`, which PR #330 had already merged.
- **Awesome ChatGPT removed.** Mike: "we don't need it". `site/library/4_Prompts/Awesome_ChatGPT/` (1,353 prompts from `f/prompts.chat`, formerly `f/awesome-chatgpt-prompts`) is deleted, not archived, and `api/prompt-index.json` is rebuilt: 2,167 items to 814. NOTICE drops its CC0 attribution; `AGENTS.md`, `docs/CONTRIBUTING.md`, `docs/features/API.md`, `docs/features/MCP-SERVER.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`, `docs/templates/`, the MCP server's instructions and one `test:mcp` refusal case now use Fabric examples. The two prompts that declared `inputs:` were both in the removed folder, so `ChatGPT_Shortcut/Pedagogy/quiz-assistant.md` now declares its `[TOPIC]` (frontmatter only; the body is untouched) and `test:mcp` keeps a real declared-input prompt to check. Old ids degrade quietly: a starred removed prompt drops out of Favorites (`useFavoritePrompts` skips an id that no longer resolves), a `?prompt=` link to one opens the library with no item selected, and My Library copies are independent files, so nothing breaks.

_Touched: `.github/workflows/ci.yml`, `.github/workflows/upstream-drift.yml`, `site/package.json`, `site/package-lock.json`, `site/library/4_Prompts/` (README, `Awesome_ChatGPT/` deleted), `site/api/prompt-index.json`, `site/library/4_Prompts/ChatGPT_Shortcut/Pedagogy/quiz-assistant.md`, `site/mcp/server.ts`, `site/scripts/mcp-server.test.mjs`, `site/scripts/my-library.test.mjs`, `NOTICE`, `AGENTS.md`, `docs/CONTRIBUTING.md`, `docs/features/`, `docs/templates/`, `docs/UPSTREAMS.md`, `docs/README.md`, `docs/ROADMAP.md`._

---

## 2026-11-03 — Library refresh — prompts and agents

- **Prompts:** GitHub now returns `f/prompts.chat` for `f/awesome-chatgpt-prompts` (renamed; MIT code, CC0 prompt content). `upstream.repo` updated in all 1,351 files under `4_Prompts/Awesome_ChatGPT/`; bodies untouched. The other five source repos (`danielmiessler/Fabric`, `microsoft/prompts-for-edu`, `mustvlad/ChatGPT-System-Prompts`, `rockbenben/ChatGPT-Shortcut`, `f/prompts.chat`) are live, not archived, MIT/CC0.
- **Agents:** none changed. All 77 entries in `api/upstream-status.json` (checked 2026-10-23) are `current`; no open `upstream/resync` PR.

_Touched: `site/library/4_Prompts/Awesome_ChatGPT/**` (1,351 files), `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-11-02 — Two prompts and a subagents guide

**Prompts**, both from f/prompts.chat at d2a57a8 (`prompts.csv`, rows by contributor "f"; CC0): *Dockerfile and CI taste* and *TypeScript library taste*, new under `4_Prompts/Awesome_ChatGPT/General/` (`match: similar`, reshaped to the house format). **Guide:** *Claude Code Subagents Guide* in `1_Guides/Claude_Code/`, repo `anthropics/claude-code`: built-in subagents, file locations and priority, every frontmatter field, how to invoke one, foreground vs background, and the nesting and concurrency limits, all from code.claude.com/docs/en/sub-agents read this run.

_Touched: `site/library/4_Prompts/Awesome_ChatGPT/General/dockerfile-and-ci-taste.md`, `site/library/4_Prompts/Awesome_ChatGPT/General/typescript-library-taste.md`, `site/library/1_Guides/Claude_Code/subagents-guide.md`, `site/api/prompt-index.json`._

---

## 2026-10-31 — Library data-flow diagram re-pinned

Re-read the cited code after the Express 5 and `checked:` changes and moved the line ranges in `library-data-flow.json` for the `library`, `build`, `index`, `public_api` and `my_api` nodes; no label or card changed, and `--check` is OK at the new pin.

_Touched: `docs/diagrams/library-data-flow.*`, `homepage/diagram/library-data-flow.*`._

## 2026-10-31 — My Library export and import (O01)

**Settings → My Library.** Two new controls, hidden on the read-only demo. *Export .zip* downloads `my-library-<date>.zip`: every `<id>.md` file in the folder, byte for byte, so frontmatter the store does not manage (a skill's `name`, `license`, `upstream:`) comes along. *Import .zip* previews first and writes nothing: how many files are new, already here, different from yours (listed by id and title, with your title beside it), and skipped (with the reason: not `<id>.md` at the top of the ZIP, not UTF-8, unparseable frontmatter, or a field the store would refuse). Then *Import N new* keeps every file of yours, *Import and replace K* also replaces the listed ones, and *Cancel* leaves the folder as it was.

**Server.** `GET /api/my-library/export` and `POST /api/my-library/import` (body: the ZIP). Without `apply=true` the import is only a plan; with it, new files are written exactly as zipped, and a differing file is replaced only when `overwrite` carries the token of the preview that listed it, so if a file changed after the preview the import is refused with a 409 and nothing is written. Both routes are 403 under `READ_ONLY`, and the import is a write, so the cross-site Origin check covers it. `lib/zip.ts` is a small ZIP reader (stored and deflate) rather than a new dependency: it refuses the whole archive on a name that could leave the folder (`..`, absolute, drive, backslash), an entry over 564 KB or one that inflates past that whatever size it claims, more than 5,000 entries, ZIP64, encryption or a bad checksum.

**Checks.** `test:my-library` round-trips a mixed library (Unicode title, tags and category, a skill with nested extra frontmatter, a 450 KB body, a hand-written file with CRLF line ends) through HTTP byte for byte, and covers the cancel, keep-mine, made-up-token and changed-since-preview cases, skipped entries, eight hostile archives, and a cross-site import. The traversal, size and token guards were each broken in turn to confirm the test fails without them. `test:browser` exports, deletes, previews and imports through the real Settings dialog; `test:read-only` 403s both routes; `test:routes` pins eleven routes.

_Touched: `site/lib/zip.ts` (new), `site/lib/my-library.ts`, `site/api/index.ts`, `site/src/components/MyLibraryTransfer.tsx` (new), `site/src/components/SettingsModal.tsx`, `site/src/App.tsx`, `site/scripts/my-library.test.mjs`, `site/scripts/read-only.test.mjs`, `site/scripts/api-routes.test.mjs`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`, `docs/ROADMAP.md`._

---

## 2026-10-30 — Upstream check

Node 26 reached LTS on 2026-10-28 and is now Vercel's default (generally available 2026-10-29), so the Hosting and Node rows say 26, with 24 and 22 still offered; the Node 22 roadmap item now names 26 as an option. The MCP SDK row notes 2.4.0 and the 2026-07-28 spec revision. Queued one roadmap item for the four dependency majors the package is behind on: `dotenv` 18, `archiver` 8, `motion` 14 and `lucide-react` 1.x, where lucide removed the `Github` brand icon that four components import. No code changed.

_Touched: `docs/UPSTREAMS.md`, `docs/ROADMAP.md`._

## 2026-10-29 — Library refresh — catalog

Two MCP server cards, both vendor-official, install lines read from each README on 2026-10-29. **Grafana** (`6_MCP_Servers/Developer_Tools/grafana.md`): `grafana/mcp-grafana`, Apache-2.0. **Terraform** (`6_MCP_Servers/Cloud_Platforms/terraform.md`): `hashicorp/terraform-mcp-server`, MPL-2.0. Sentry's server was skipped (licence reads "Other", not clearly permissive). No `accept` rows in the discovery ledger; no system prompts or agent definitions added this run.

_Touched: `site/library/6_MCP_Servers/` (2 cards, README count 25), `site/api/prompt-index.json`._

## 2026-10-27 — Library refresh — guides

Six guides checked against vendor docs this run and stamped `checked: 2026-10-27`. **claude-code-tips:** `claude login` is `claude auth login`; the `.claude.json` `instructions` key and `.claudeignore` are not documented, so project instructions now point to `CLAUDE.md` and file exclusion to `permissions.deny` (code.claude.com/docs/en/memory, /cli-reference). **anthropic_cli_guide:** model IDs updated to `claude-sonnet-5-5`, `claude-opus-5-5`, `claude-fable-5-1`, `claude-haiku-5-5` (platform.claude.com/docs/en/models/overview). **codex_cli_guide:** `exec --output-format json` is `exec --json`, `exec --resume` is `exec resume [--last]`, `login --api-key` is `login --with-api-key` (learn.chatgpt.com/docs/developer-commands). **gemini_cli_guide:** `--approval-mode` values are `default`, `auto_edit`, `plan`, `yolo`; `--yolo` is deprecated; model flags use the `pro`/`flash` aliases (docs/cli/cli-reference.md in google-gemini/gemini-cli). **gemini slash-commands:** `/compact` is `/compress`, `/policy` is `/policies`, `/shell` is `/shells`, `/setup-github-actions` is `/setup-github` (docs/reference/commands.md). **mistral_cli_guide:** the unofficial `pip install mistral-cli` (not on PyPI) is replaced by the official Mistral Vibe CLI (mistralai/mistral-vibe README).

_Touched: `site/library/1_Guides/Claude_Code/claude-code-tips.md`, `site/library/1_Guides/API_Providers/anthropic_cli_guide.md`, `site/library/1_Guides/API_Providers/mistral_cli_guide.md`, `site/library/1_Guides/Codex/codex_cli_guide.md`, `site/library/1_Guides/Gemini_CLI/gemini_cli_guide.md`, `site/library/1_Guides/Gemini_CLI/slash-commands.md`, `site/api/prompt-index.json`._

---

## 2026-10-27 — Express 5, Vite 8 and TypeScript 7

The three framework majors the 2026-10-23 upstream check queued are in. **Express 5.3.0:** the two wildcard routes (copy to My Library, skill ZIP download) and the SPA fallbacks use the new `*name` and `/{*splat}` syntax, and `POST`/`PUT /api/prompts` cope with Express 5 leaving `req.body` undefined when no body is sent, which would otherwise have turned a 400 into a 500. **Vite 8.3.5 with plugin-react 6.1.2:** the config moved to `import.meta.dirname`, and the build now runs on Rolldown with the same vendor chunks, all under 500 kB. **TypeScript 7.0.2:** it checks side-effect imports, so `src/main.tsx` references `vite/client` for the stylesheet import; nothing else changed and no `any` was added. Every CI step passes locally, the prompt index rebuilds byte-identical, and the dev server and a production start serve every route.

_Touched: `site/package.json`, `site/package-lock.json`, `site/api/index.ts`, `site/server.ts`, `site/vite.config.ts`, `site/src/main.tsx`, `site/scripts/api-routes.test.mjs`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `README.md`, `docs/README.md`, `docs/ROADMAP.md`, `docs/UPSTREAMS.md`._

---

## 2026-10-27 — main is protected (F04)

The `main` ruleset, which already blocked deletion and force pushes, now also requires a pull request and the CI `check` and `secrets` jobs before anything merges, with no bypass for anyone. No approval is required, since the PR sweep merges as Mike, and merge, squash and rebase all stay allowed. A throwaway PR with a failing `secrets` check (#466) could not be merged; this entry's PR, with both checks green, merged with the sweep's own command. That was the last open release gate.

_Touched: `AGENTS.md`, `docs/ROADMAP.md` (the ruleset itself is repository settings)._

---

## 2026-10-27 — Secret scan triaged, configured and in CI (F10)

A fresh gitleaks scan of the whole history (8.30.1, 1,168 commits) found 142 candidates and no real credential: every one came from four loose pattern rules, and none of the fixed-format key rules (private keys, AWS, GitHub, Stripe, OpenAI, Anthropic and the rest of the defaults) matched in any commit. 132 were example tokens, placeholder `Authorization` headers, sample JWTs and the word "LinkedIn" in library text; 10 were a made-up `abc123_<timestamp>` session token in the first `docs/API.md` and `docs/DATABASE.md` (2026-03-16, both since deleted), for the login removed on 2026-10-21. The new `.gitleaks.toml` keeps the default rules and turns those four off in library text only (`site/library/`, the built index files, `archive/`, the gitignored `site/my-library/` and the library's older locations), plus an allowlist for just those two commits in just those two files. The strict rules still scan everything: a fake AWS key and a private key placed under `site/library/` were both caught. CI gains a `secrets` job that runs the scan over the full history on every push and PR, with the binary checksum-pinned and values redacted; a throwaway PR with a seeded fake secret failed it. The 2026-10-26 security sweep's `.gitleaksignore` (71 per-finding fingerprints) was never merged; this replaces it with rules.

_Touched: `.gitleaks.toml` (new), `.github/workflows/ci.yml`, `AGENTS.md`, `SECURITY.md`, `docs/ROADMAP.md`._

---

## 2026-10-27 — Roadmap note after the PR review

The 2026-10-23 upstream check (#412) queued Express 5, Vite 8 and TypeScript 7 into Phase 3, so the roadmap's "Where we are" note and badge point back at Phase 3 instead of the after-release features, and list the Actions v7 move among Mike's. Vite is `^6.4.5` in `site/package.json` now, not the `^6.4.4` that check recorded; fixed in its roadmap item and in `UPSTREAMS.md`.

_Touched: `docs/ROADMAP.md`, `docs/UPSTREAMS.md`._

---

## 2026-10-27 — scholar-evaluation resynced from upstream

`Data/scholar-evaluation` ← `K-Dense-AI/claude-scientific-skills` @ `5f2bc03`, the drift report's `behind` row. Upstream rewrote the skill around developmental feedback on scholarly work, with a hard ban on hiring, admissions, grant and other personnel uses and no prestige or citation metrics. 15 new support files (`assets/` templates, 4 references, 7 local scripts); `references/evaluation_framework.md` and `scripts/calculate_scores.py` replaced. It is still a scholarly-work evaluator, so it stays in Data, and its `license: MIT` and LICENSE file carry over. Opened by the 2026-10-24 roadmap run (#434), which also resynced `Content/brainstorming`; that skill was archived with its library on 2026-10-27, so only this half landed, re-run against today's upstream. The local `description:` still describes the old skill: that is the open "whose description" roadmap decision.

_Touched: `site/library/3_Skills/Data/scholar-evaluation/`, `site/api/prompt-index.json`._

---

## 2026-10-27 — Freshness on the listing cards (O02)

A card in the grid now says when its item was last checked against its source repo ("checked Oct 18, 2026"), in place of the file's modified time, which on the demo is only when Vercel's checkout wrote it. Past 90 days it gets a `stale` chip. Nothing claims an item is verified: an undated item (most guides, the skill library cards) shows its file date and no chip. The prebuilt index and the live library walk both carry `checked`, from `upstream.checked`, an MCP card's `server.checked` or a guide's `checked:`, on 2,071 of the 2,162 items; the oldest is 2026-08-26, so the first chips appear in late November. `test:read-only` checks the index and the walk agree on `checked` and `inputs`, and pins the 90-day edge. That check also caught the walk listing three lowercase `readme.md` files the index skips, now fixed. The `git log` half of the old O02 stays open for Mike: it needs a Vercel preview.

_Touched: `site/lib/library.ts`, `site/api/{index.ts,prompt-index.json}`, `site/scripts/{build-prompt-index.js,read-only.test.mjs}`, `site/src/lib/freshness.ts`, `site/src/components/PromptCard.tsx`, `AGENTS.md`, `docs/ROADMAP.md`._

---

## 2026-10-27 — Backend agents checked for near-duplicates

The Phase 3 duplicates item is closed with nothing merged. A 4-word-shingle overlap across all 77 agents found one pair above 15%: `microsoft-agent-framework-python` and `semantic-kernel-python` (26%), one vendor template filled in for two different frameworks, so both stay. The backend folder's same-role groups (three C# agents, three Rust, two C++) come from different authors with different instructions, and stay as alternatives. `CSharpExpert.md` was the one item file name with capitals, against the library's lowercase rule; it is now `csharp-expert.md` (its id changes), and `scripts/upstream.test.mjs` fails on a case-only path clash or an uppercase item file name.

_Touched: `site/library/2_Agents/Development/Backend/csharp-expert.md`, `site/api/prompt-index.json`, `scripts/upstream.test.mjs`, `AGENTS.md`, `docs/ROADMAP.md`._

---

## 2026-10-27 — Roadmap rewritten to match the library

`docs/ROADMAP.md` had grown a status note per day and two finished phases' worth of done items. It now has one current "Where we are" note, and Phases 1 and 2 are collapsed to a summary each, both done. Their open items moved because they don't block a release: F04 (branch protection) to **Public release**, where it is a gate beside F10, and the remote MCP endpoint, the npm package and the registry listing to **Publish and promote**. Two items that no longer applied were removed (the agent-skills licence, since nothing is copied from that repo, and the generated-pack label, since no generated packs remain). Four were brought up to date: O02 now covers only the listing cards, since the item page has shown source, commit, check date and drift since 2026-10-26; O01 no longer waits on F05–F07, which are done; the starter collections wait on the Skill Packs decision; and the Awesome ChatGPT and Skill Packs items carry today's counts. The "Kept current by" table gains the Prompts & Agents Refresh and the Upstream Check.

_Touched: `docs/ROADMAP.md`._

---

## 2026-10-27 — Prompt placeholders as MCP arguments (O03)

A prompt can declare its `[placeholder]` fields in an `inputs:` frontmatter list, and an MCP client then asks for each one instead of taking a single free-text `input`. The MCP server registers every public prompt that declares inputs by name, with one required argument per input, beside `input`, which still appends; My Library prompts get the same. Only declared names are filled, in one literal pass (`[N]`, `[dict]` and links stay as written), and `npm run test:mcp` fails on a declaration that names a placeholder the body lacks. The index carries `inputs` for the prompts that have it. To start, two Awesome ChatGPT prompts declare `[topic]`.

_Touched: `site/lib/{prompt-inputs,library}.ts`, `site/mcp/server.ts`, `site/scripts/{build-prompt-index.js,mcp-server.test.mjs}`, `site/api/prompt-index.json`, two prompts in `site/library/4_Prompts/Awesome_ChatGPT/General/`, `AGENTS.md`, `docs/{mcp-server,CONTRIBUTING,ROADMAP}.md`, `docs/features/MCP-SERVER.md`._

---

## 2026-10-27 — Loose files out of 3_Skills

81 files sat in `site/library/3_Skills/` outside any skill folder: 78 single-file prompt-style "skills" from before the AgentSkills layout, a stale Skill Packs list in `Development/README.md` and two orphaned `plugin.json` manifests. The index only reads `SKILL.md` files and library cards, so the app never showed them (the index is unchanged at 2,162 items), but they were still published in the repo with no source named. They moved to `archive/loose-skill-files-2026-10-27/`, paths kept, and `scripts/upstream.test.mjs` now fails on any file outside a skill folder other than the section README, `Libraries/` and `packs/`. `3_Skills/README.md` is rewritten for the current layout (30 library cards, 28 single skills) in place of the 256-skill tables from August.

_Touched: `site/library/3_Skills/`, `archive/`, `scripts/upstream.test.mjs`._

---

## 2026-10-27 — Every skill ships with its licence (F17)

The provenance check proved that items named a repo, not that they could be given away. `scripts/upstream.test.mjs` now sorts every record into original (guides and library cards, which must not carry an upstream block), attributed (`repo` as owner/name, a `checked` date, a fork's `note`, a vendor page's `url`) or unresolved (fails), and a skill, which people download as files, needs a redistributable SPDX `license:` in its block and a LICENSE beside `SKILL.md`. `scripts/vendor-skill-licenses.mjs` writes both from the source repo with `gh`: 26 of the 32 skills had no licence file, so the NOTICE's "each vendored skill keeps its own LICENSE" was not true until now. `resync-upstream.mjs` keeps a vendored LICENSE instead of pruning it as stale. `test:read-only` opens a skill ZIP and every Skill Pack ZIP and checks each skill's LICENSE is inside.

Four skills could not be cleared and moved to `archive/unlicensed-2026-10-27/` (Mike's call): `scientific-schematics` and `market-mechanics-betting` (repos with no licence), `document-writer` (MIT with a rider barring OpenAI, Anthropic and anyone acting for them) and `scientific-writing` (a GPL/AGPL combined work). So did `postgres-schema-design`, saved as `SKILL.MD` with no upstream block, which the index never saw; the check now fails on a skill file not named exactly `SKILL.md`. The writing-documentation and prediction-markets packs lost one skill each (2 and 1 left).

_Touched: `scripts/{upstream.test.mjs,vendor-skill-licenses.mjs,resync-upstream.mjs}`, `site/library/3_Skills/`, `site/api/prompt-index.json`, `site/scripts/{read-only.test.mjs,bench-endpoints.mjs}`, `archive/`, `NOTICE`, `AGENTS.md`, `docs/{ROADMAP,CONTRIBUTING}.md`._

---

## 2026-10-27 — Roadmap brought up to date after the library cards

Four roadmap items went stale when skill libraries became cards. Skill attribution is closed: the 60 `ambiguous` and 163 `unknown` skills all came from multi-skill repos, which are cards now, and the 32 single skills left are all attributed. The agent-skills licence item and the generated-pack label are dropped, since nothing is copied from agent-skills and no generated packs remain. The duplicates item keeps only the backend agents. A new item asks Mike what Skill Packs are for, with three small packs left, and the "Kept current by" table lists the weekly Library Cards Refresh.

_Touched: `docs/ROADMAP.md`._

---

## 2026-10-27 — Favorites on detail pages and Skill Packs

The star lived only in a card's hover actions, so an open item could not be starred, and Skill Packs had no star at all. The detail page now has a star beside the share buttons, and every pack has one on its card and on its own page. Packs share the one favorites list as `pack:<id>`, which `useFavoritePrompts` skips when it fetches the other library's items, and the Packs sidebar gets a Favorites row that lists only the starred packs. Skills' Libraries view gets its own Favorites row too: under Skills it lists starred skills, under Libraries starred library cards, so the two don't mix.

_Touched: `site/src/components/{PromptDetail,SkillPacksView,Sidebar}.tsx`, `site/src/hooks/useFavoritePrompts.ts`, `site/src/App.tsx`, `AGENTS.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`._

---

## 2026-10-27 — Library cards carry the repo's README

Each skill library card now holds the repo's whole README under its own header (title, description, link), so a library reads as it does on GitHub without leaving Promptbook. `site/scripts/refresh-library-cards.mjs` writes them from `gh`: all 41 cards, 30 public and 11 in My Library (`Zpankz/mcp-skillset` has no README and keeps its header only). Relative links and images become absolute GitHub URLs; a README that has not changed keeps its "copied" date, so a rerun is a no-op. The READMEs were checked before copying: six email addresses, all the authors' own published contacts.

READMEs are mostly HTML (badges, centred blocks, tables), which the detail page and the editor preview printed as text. Markdown now renders HTML through `rehype-raw` and `rehype-sanitize` (GitHub's allow-list, so no scripts, iframes or styles), and markdown images are inline, so a badge row is a row.

_Touched: `site/scripts/refresh-library-cards.mjs`, `site/library/3_Skills/Libraries/`, `site/api/prompt-index.json`, `site/src/components/{PromptDetail,PromptEditorModal}.tsx`, `site/src/index.css`, `site/package.json`, `site/package-lock.json`, `AGENTS.md`, `docs/ROADMAP.md`._

---

## 2026-10-27 — Skill libraries are one card each

The Skills section mixed single skills (blader/humanizer), skill libraries (a repo like addyosmani/agent-skills that ships dozens) and Skill Packs (our bundles). A library now gets one card that describes it and links its GitHub repo, instead of a copy of each of its skills to keep in step:

- **Public Library:** 30 cards in `site/library/3_Skills/Libraries/`, one per repo we had copied 2 or more skills from, each with the repo's own GitHub description. The 224 skill folders they replace moved to `archive/skill-libraries-2026-10-27/` (paths kept), with two orphaned finance_skills plugin manifests. 32 single skills stay. `scripts/upstream.test.mjs` requires a `repo:` line on every card.
- **My Library:** the same card is any item tagged `skill-library`. Ten cards were added and 98 copies moved to `my-library/_archived/`, which the store does not list; Scientific Agent Skills, already a README of the whole collection, got the tag. 8 single skills stay.
- **Skill Packs:** the 13 generated packs (one per folder of 6+ skills) are gone, since no folder keeps 6 skills, and `build-skill-packs.mjs --write` dropped the dead paths from the hand packs. Two came out empty and were deleted (`finance-portfolio-pack`, `project-management-pack`). Three remain.
- **Upkeep:** `scripts/sync-agent-skills.mjs` is deleted. It copied ai-automation-tools/agent-skills into the library each week, and that repo is a card now. The drift workflow no longer skips agent-skills.
- **UI:** a `Skills | Libraries | Packs` switch sits at the top of the Skills sidebar (as pills under the hero on phones). Packs no longer has its own tile on the rail or the phone strip; it lives under Skills, which stays lit while you're there. Under Libraries the grid shows the library cards and the sidebar lists them instead of the category tree. The cards stay out of the Skills grid, its category tree and its count, and the hero's third counter is Libraries. A card downloads as markdown, not a skill zip.

The tests and the bench that used `analytics-tracking`, `canvas-design`, `mcp-builder` and the two big finance packs now use skills and packs that stay; `docs/development/PERFORMANCE.md` has the new baseline, every row inside the budgets.

_Touched: `site/library/3_Skills/{Libraries,packs}/`, `archive/`, `site/scripts/{build-prompt-index.js,bench-endpoints.mjs,read-only.test.mjs}`, `site/api/{index.ts,prompt-index.json}`, `site/src/components/{SkillLibraries,Sidebar,SectionRail,TopBar}.tsx`, `site/src/hooks/{usePromptFilters,useLibraryRoute}.ts`, `site/src/lib/sections.ts`, `site/src/App.tsx`, `scripts/{build-skill-packs.mjs,upstream.test.mjs}`, `.github/workflows/upstream-drift.yml`, `AGENTS.md`, `docs/{ARCHITECTURE,ROADMAP}.md`, `docs/skill-packs/README.md`, `archive/README.md`._

---

## 2026-10-26 — Front matter can no longer run code (security sweep)

gray-matter hands front matter that opens with `---js` or `---javascript` to `eval()`, and library files come from third-party collections. Every parse in `site/` now goes through `site/lib/frontmatter.js`, which turns that engine off, so such a file fails to parse instead of running. `scripts/skill-frontmatter.test.mjs` checks the refusal and that nothing in `site/` imports gray-matter directly. The `.gitleaksignore` this run proposed was left out: allowlisting secret-scan findings is roadmap item F10, which is Mike's private triage.

_Touched: `site/lib/frontmatter.js` (new), `site/{api/index.ts,api/skill-packs.ts,lib/library.ts,lib/my-library.ts,mcp/server.ts,scripts/build-prompt-index.js}`, `scripts/skill-frontmatter.test.mjs`._

---

## 2026-10-26 — The homepage mentions the twelve themes

`homepage/index.html` gets a Themes card for the Light | Dark switch and the twelve themes in Settings → Appearance (2026-10-23).

_Touched: `homepage/index.html`._

---

## 2026-10-26 — Sections one tap away on phones

On a phone the only way to change section was the ☰ button, which looks like a site menu, so going from Prompts to Skills wasn't findable. Phones now get a swipeable strip of section chips under the top bar (the rail's job from md up); the current chip is highlighted and scrolled into view. The ☰ sheet keeps just the Resources links. Checked at 390px with touch emulation: no horizontal overflow, and the strip hides from 768px.

_Touched: `site/src/components/{TopBar,SectionRail}.tsx`, `site/src/index.css`, `AGENTS.md`, `docs/ARCHITECTURE.md`._

---

## 2026-10-26 — One set of favorites in both libraries

Favorites were already one list of ids in the browser, but each library only showed the stars it had loaded, and Public Library cards had no star button at all. Now every card has the star, in both libraries and on the read-only demo. The sidebar's Favorites view and the toolbar's Favorites panel list the current section's stars from both libraries: `useFavoritePrompts` fetches the other library's starred items by id (`GET /api/prompts/:id`). Each card shows the buttons of the library it belongs to, and opening one from the other library switches there first, the way the ⌘K palette does.

_Touched: `site/src/hooks/useFavoritePrompts.ts`, `site/src/App.tsx`, `site/src/components/{PromptCard,PromptGrid}.tsx`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`._

---

## 2026-10-26 — Card blurbs skip README badges

A My Library item imported from a README (Scientific Agent Skills) showed `[](LICENSE.md) [](https://arxiv.org/` as its card blurb. Its first 200 characters were all badges, and `stripMarkdown` removed the image inside each `[![…](…)](…)` but left the empty link around it, plus the badge the 200-character cut split in half. The My Library listing now drops lines that are only images before taking the preview (`previewOf` in `api/index.ts`), and `stripMarkdown` drops empty links and a link left open at the cut. `npm run test:preview` pins both. The Public Library index has no badge-led previews, so `prompt-index.json` is unchanged.

_Touched: `site/api/index.ts`, `site/src/components/PromptCard.tsx`, `site/scripts/preview.test.mjs`, `site/package.json`, `.github/workflows/ci.yml`, `AGENTS.md`, `README.md`, `docs/{ARCHITECTURE,README}.md`, `docs/features/API.md`, `docs/setup/SETUP.md`._

---

## 2026-10-26 — Two Awesome ChatGPT prompts and a Claude Code hooks guide

Two prompts from `f/awesome-chatgpt-prompts` (now `f/prompts.chat`) @ `cd7ac608`, `prompts.csv`, both `match: similar`: **Spec Interview** and **Ethereum Developer**, in `4_Prompts/Awesome_ChatGPT/General/`. One guide in `1_Guides/Claude_Code/`: **Claude Code Hooks Guide** (`hooks-guide.md`, repo `anthropics/claude-code`), written from the official [hooks guide](https://code.claude.com/docs/en/hooks-guide) read this run: settings locations, event table, exit codes, three recipes, timeouts and troubleshooting. The folder had flags, slash commands and tips but nothing on hooks.

_Touched: `site/library/4_Prompts/Awesome_ChatGPT/General/{spec-interview,ethereum-developer}.md`, `site/library/1_Guides/Claude_Code/hooks-guide.md`, `site/api/prompt-index.json`._

---

## 2026-10-26 — Source link on items you create

Every Public Library card names where it comes from; now your own items can too. The New item / Edit item form has a **Source link** field for the GitHub repo or site an item stems from. It is saved as `source_url` in the My Library file's frontmatter, shown at the top of the item page (GitHub icon for a repo, globe for any other site), kept in the Download `.md`, and accepted by `POST`/`PUT /api/prompts` as `sourceUrl` and by the MCP `save_to_my_library` / `update_my_prompt` tools as `source_url` (`get_item` prints it). The store refuses anything but an `http(s)` URL, so a `javascript:` link can't be saved and clicked.

_Touched: `site/lib/my-library.ts`, `site/api/index.ts`, `site/src/components/{PromptEditorModal,PromptDetail}.tsx`, `site/src/lib/markdown-file.ts`, `site/mcp/server.ts`, `site/scripts/{my-library,mcp-server}.test.mjs`, `docs/features/{API,MCP-SERVER}.md`, `docs/mcp-server.md`._

---

## 2026-10-26 — "New prompt" is now "New item"

The create button in the top right said "New prompt", but the editor files into any section (guides, agents, skills, prompts, system prompts, MCP). It now says **New item**, as do the floating button on phones, the ⌘K action ("Create a prompt, agent, skill or guide in My Library"), the My Library empty state and the editor itself ("New item" / "Edit item", "Create item").

_Touched: `site/src/components/{TopBar,CommandPalette,EmptyState,PromptEditorModal}.tsx`, `site/src/App.tsx`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/setup/DEPLOYMENT.md`._

---

## 2026-10-26 — Prompts: 437 from four more public collections

Mike asked for popular prompts from top GitHub repos and sites. The Prompts section held one collection; it now holds five, each in its own top-level folder with the collection's grouping under it. Every file has an `upstream:` block (`repo`, `path`, `ref` = the commit read, `checked: 2026-10-26`) and tags. Every licence is MIT, read this run. The index goes from 1,920 items to 2,357.

| Folder | Source | Prompts | Match |
|:---|:---|---:|:---|
| `Fabric/<topic>/` | `danielmiessler/Fabric` @ `bf8dcf72`, `data/patterns/*/system.md` | 265 | `exact`: the body is `system.md` byte for byte, so the weekly drift resync keeps it current |
| `ChatGPT_Shortcut/<tag>/` | `rockbenben/ChatGPT-Shortcut` @ `f91ed81e`, English cards | 119 | `similar` (from JSON) |
| `ChatGPT_System_Prompts/<group>/` | `mustvlad/ChatGPT-System-Prompts` @ `e19d82a2` | 38 | `similar` |
| `Microsoft_Prompts_For_Edu/<audience>/` | `microsoft/prompts-for-edu` @ `508567d4` | 15 | `similar` (purpose and the fenced prompt) |

- Deduped by title against everything already in `4_Prompts`. ChatGPT-Shortcut's 160 cards copied from Awesome ChatGPT were left out, as were 8 of mustvlad's 46.
- Not taken: leaked or extracted system-prompt dumps (`x1xhlol/…`, `asgeirtj/…`, `elder-plinius/…`, `LouisShark/…`, `0xeb/TheBigPromptLibrary`), GPL or licence-less lists, Chinese-only collections, and prompt sites with no GitHub repo behind them (CI requires one). `github/awesome-copilot` moved its prompts into skills, so it belongs in `3_Skills` if anywhere.
- `NOTICE` lists each collection with its licence. `4_Prompts/README.md` shows the five folders. The four repos are `done` rows in `docs/DISCOVERY.md`. The Awesome ChatGPT roadmap item notes that `f/awesome-chatgpt-prompts` is now `f/prompts.chat` and no longer the whole section.

_Touched: `site/library/4_Prompts/{Fabric,ChatGPT_Shortcut,ChatGPT_System_Prompts,Microsoft_Prompts_For_Edu}/**`, `site/library/4_Prompts/README.md`, `site/api/prompt-index.json`, `NOTICE`, `docs/DISCOVERY.md`, `docs/ROADMAP.md`, `docs/features/MCP-SERVER.md`._

---

## 2026-10-26 — Library refresh: 22 skills and an MCP card from the discovery ledger

Mike asked for new and popular items. The six `accept` rows in `docs/DISCOVERY.md` were vendored, today's discovery run was written to the ledger (25 new `pending` rows), and three of the top finds were taken straight away. Every file carries an `upstream:` block (`match: exact`, `repo`, `path`, `ref`, `checked: 2026-10-26`) and `tags`; every licence is MIT, read this run. The index goes from 1,897 to 1,920 items.

**Skills (`3_Skills/`)**
- `Development/Engineering/`: code-review-and-quality, spec-driven-development, incremental-implementation, security-and-hardening, context-engineering, doubt-driven-development from `addyosmani/agent-skills`; planning-with-files (with its scripts and templates) from `OthmanAdi/planning-with-files`.
- `Business/Marketing/`: cro, ab-testing, cold-email, marketing-psychology, onboarding, churn-prevention from `coreyhaines31/marketingskills` (pricing skipped: `Business/Strategy/pricing-strategy` covers it).
- `Business/Strategy/`: create-prd, pre-mortem, opportunity-solution-tree, north-star-metric, lean-canvas, strategy-red-team from `phuryn/pm-skills`.
- `Design/`: diagram-design (SKILL.md, references and scripts; the 150 example HTML files were left out) from `cathrynlavery/diagram-design`; design-taste-frontend (SKILL.md and references; its asset, library and script folders were left out) from `Leonxlnx/taste-skill`.
- `Content/General/`: i-have-adhd from `ayghri/i-have-adhd`.
- `Content/General/humanizer` was an older copy of `blader/humanizer` attributed to a mirror as `match: similar`. It now points at the origin (`match: exact`) and carries its current v3.1.0 text, README and licence; the mirror's `WARP.md` is gone.

**MCP card (`6_MCP_Servers/Developer_Tools/`)**
- codebase-memory (`DeusData/codebase-memory-mcp`, MIT): install lines and the 17-tool list read from its README today.

**Ledger**
- The six accepted rows and the three new picks are `done` with a note of what was taken and left. The 25 rows from today's run are `pending` for Mike. `planning-with-files`, `pm-skills` and `codebase-memory-mcp` were added to the table by hand, since the script skips a repo the library already names.

_Touched: `site/library/3_Skills/**` (22 new folders, humanizer), `site/library/6_MCP_Servers/Developer_Tools/codebase-memory.md`, the two section READMEs' counts, `site/api/prompt-index.json`, `docs/DISCOVERY.md`._

---

## 2026-10-26 — The repo link at the top of every card, in all six sections; unlinked items archived

**Changes**
- Guides and prompts now show the same GitHub panel at the top of the item page that skills, agents, system prompts and MCP cards already had. `sourceOf()` in `site/lib/library.ts` reads a guide's bare `repo:` as a third source after `upstream.repo` and `server.repo`.
- The 1,349 Awesome ChatGPT prompts carry an `upstream:` block (`match: similar`, `repo: f/awesome-chatgpt-prompts`, `checked: 2026-10-26`), the collection their footers already named.
- 70 guides carry `repo:` naming the tool they document (`anthropics/claude-code`, `openai/codex`, `Aider-AI/aider`, `cursor/cursor`, …). Each repo was checked on GitHub first; renamed ones were stamped under their current name, archived ones (Codeium, TabNine, Copilot Chat) were left out.
- Everything that still named no repo was archived (Mike: "we only want cards that contain links now"): 669 hand-written prompts, every `4_Prompts` category except `Awesome_ChatGPT`, and 28 guides (the six Concepts pages, five hand-written agent configs, and tools with no public repo such as Windsurf, JetBrains AI Assistant, Supermaven, Kite, Cody, Docker AI, OpenClaw). They moved, paths intact, to `archive/unlinked-2026-10-26/` at the repo root, outside the deploy root; `archive/README.md` says how to restore one. The library goes from 2,598 items to 1,897 (the index builder now also skips a lowercase `readme.md`, which had put three folder notes under System Prompts as cards).
- `scripts/upstream.test.mjs` now fails CI on a prompt without `upstream.repo` or a guide without `repo:`, as it already did for the other four sections.

**Docs**
- `AGENTS.md` and `docs/CONTRIBUTING.md`: the rule, where each section's repo comes from, the archive, and the checklist line. Prompt and guide templates show the new frontmatter; the `1_Guides` and `4_Prompts` folder READMEs describe what is there now.

**Follow-up (after the merge, same day)**
- `scripts/prompt_generation/`, which wrote prompt files from templates, moved to `archive/prompt_generation/`: nothing may write a prompt into the library now.
- Roadmap: the `4_Prompts` provenance item is ticked (done by stamping the one corpus and archiving the rest; CI is the gate now), the Awesome ChatGPT decision notes it is the whole prompts section, and the "Where we are" note has a 2026-10-26 paragraph.
- Example ids in the API, library-mode and template docs, and in the MCP server's instructions, point at paths that exist (`4_Prompts/Awesome_ChatGPT/General/…`).
- The scheduled jobs that touch this repo (in `C:\Users\mikes\.claude\Routines`) follow the rule: Add Prompts copies prompts from public collections with an `upstream:` block instead of writing them, and every guide it adds names its tool's repo; the Prompts & Agents Refresh leaves prompt bodies alone (all vendored now) and only re-checks collection repos; Monthly Upkeep extends its no-source check to prompts and guides and archives, rather than deletes, what it cannot re-source; the org PR sweep merges new vendored prompts and archive moves instead of holding them.

_Touched: `site/lib/library.ts`, `site/src/components/SourcePanel.tsx`, `site/library/4_Prompts/**`, `site/library/1_Guides/**`, `archive/`, `site/api/prompt-index.json`, `site/mcp/server.ts`, `site/scripts/mcp-server.test.mjs`, `scripts/upstream.test.mjs`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/CONTRIBUTING.md`, `docs/features/API.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`, `docs/features/MCP-SERVER.md`, `docs/templates/*`._

---

## 2026-10-26 — Stale dev server shows an error, not a black page

**Fixes**
- The black page on opening a prompt came back: the local dev server had run since 2026-10-23 14:19, through the library commit and the `body-parser` lockfile bump, so Vite served outdated deps and the API still listed 213 deleted items. `lazyReload()`'s one reload cannot fix a stale server, so the second failure blanked the page. A top-level `ErrorBoundary` (`src/components/ErrorBoundary.tsx`, mounted in `main.tsx`) now shows "Something failed to load", says to restart the dev server, and offers Reload.

**Docs**
- `AGENTS.md` (read by Claude Code through `CLAUDE.md`): restart the dev server after any `npm install`, lockfile change or `api/`/`lib/`/`library/` change, and check its start time first when a black page is reported.
- Debug Guide issue 6 and SETUP troubleshooting: restart is the fix, the reload alone is not; how to spot a stale server.

_Touched: `site/src/components/ErrorBoundary.tsx`, `site/src/main.tsx`, `site/src/App.tsx`, `AGENTS.md`, `docs/development/DEBUG_UI.md`, `docs/setup/SETUP.md`._

---

## 2026-10-23 — body-parser 1.20.9 (Dependabot #14)

**Security**
- `body-parser` 1.20.8 → 1.20.9 (via Express 4.22.3) in `site/package-lock.json`: a high-severity denial of service from trailing bytes after a compressed request body. In-range update, lockfile only; `npm audit --omit=dev` reports 0 vulnerabilities.

_Touched: `site/package-lock.json`._

---

## 2026-10-23 — Every vendored item names its source

**Library**
- Deleted the 150 skills and agents the attribution pass could not trace to any repo (141 skills, 9 agents; Mike). Skills 375 → 234, agents 87 → 78. `build-skill-packs.mjs --write` regenerated the folder packs and dropped the dead paths from 6 hand packs; `game-design-pack` lost all 15 skills and was removed.
- System prompts got provenance for the first time. `scripts/attribute-system-prompts.mjs` (new) matched each file against seven public collections (jujumilk3/leaked-system-prompts, asgeirtj/system_prompts_leaks, elder-plinius/CL4R1T4S, x1xhlol/system-prompts-and-models-of-ai-tools, 0xeb/TheBigPromptLibrary, LouisShark/chatgpt_system_prompt, dontriskit/awesome-ai-system-prompts), including their git history: 142 matched (5 only as earlier captures, stamped `match: fork`), 3 are Anthropic's own release notes (`match: vendor` + `url`).
- Deleted the 63 system prompts with no source (Mike). They matched nothing anywhere, and 38 shared one generated `<system_info>` template, one of them for a "Claude 3.5 Opus" that never shipped. 211 → 148 files.
- The drift check now covers system prompts too (reported and shown on the item page, never auto-resynced: each is a dated capture).

**CI**
- `scripts/upstream.test.mjs` fails on any skill, agent, system prompt or MCP card that names no source (`upstream.repo`, `match: vendor` + `url`, or `server.repo`). Folder READMEs are exempt. `vendor` joins the `match:` vocabulary.

**Docs**
- `docs/audits/` removed (the 2026-08 repo audit, the direction plan and three drift reports; git history keeps them); `docs/README.md` and `AGENTS.md` no longer link there.
- `docs/templates/system-prompts-template.md` was the `<system_info>` template the invented prompts were written from; it is now a frontmatter-plus-verbatim-capture template with the `upstream:` block. The agent and skill templates carry the block too, and `CONTRIBUTING.md` states the rule.

_Touched: `scripts/attribute-system-prompts.mjs` (new), `scripts/upstream.test.mjs`, `scripts/check-upstream-drift.mjs`, `.github/workflows/upstream-drift.yml`, `site/lib/library.ts`, `site/src/components/SourcePanel.tsx`, `site/library/` (213 deletions, 145 stamped, packs), `site/api/upstream-status.json`, `site/api/prompt-index.json`, `docs/templates/`, `docs/CONTRIBUTING.md`, `AGENTS.md`, `docs/README.md`, `docs/ARCHITECTURE.md`._

---

## 2026-10-23 — Change control for vendored skills and agents

**Library**
- The Monday `upstream-drift.yml` no longer only reports. It still posts to the rolling issue, then resyncs every skill and agent whose local copy adds under 10% of its own lines (skipping `ai-automation-tools/agent-skills`, which the fleet's Skills Sync refreshes), writes `site/api/upstream-status.json`, rebuilds the index and opens one **Resync from upstream** PR on `upstream/resync`. Never merged automatically: it is third-party text people install.
- First run, done by hand: 8 skills resynced (`x-twitter-scraper`, `repo-docs-builder`, `agent-workspace-builder`, three `edge-spectrum-*`, two `project-hub-*`).
- `scripts/reattribute-unclear.mjs` (new) re-checked the 231 skills and agents with no single upstream by GitHub code search: 81 now resolve (75 exact, 6 similar; 59 of the 60 `ambiguous`, 22 of the 171 `unknown`) and carry `repo`/`path`/`ref` plus `was:`. 150 still have no source found; that list waits on Mike before anything is deleted. 28 of the new matches are repos with no licence.
- 305 items are now drift-tracked, up from 224.

**App**
- An item's page shows a Source panel for skills, agents and MCP cards: the GitHub repo (or the exact file), the commit it was copied at, its verdict at the last weekly check (up to date, minor upstream changes, behind, removed upstream, kept copy) and a link to everything upstream changed since that commit. MCP `get_item` adds the same source line.
- `check-upstream-drift.mjs --json` writes the status file; `lib/library.ts` `sourceOf()` reads it.

_Touched: `.github/workflows/upstream-drift.yml`, `scripts/check-upstream-drift.mjs`, `scripts/reattribute-unclear.mjs` (new), `scripts/sync-agent-skills.mjs` (header), `site/api/upstream-status.json` (new), `site/lib/library.ts`, `site/api/index.ts`, `site/mcp/server.ts`, `site/src/components/SourcePanel.tsx` (new), `PromptDetail.tsx`, `PromptCard.tsx`, 108 files under `site/library/`, `site/api/prompt-index.json`, `AGENTS.md`, `docs/README.md`, `docs/ARCHITECTURE.md`._

---

## 2026-10-23 — Twelve themes, no source bar locally

**UI**
- Settings → Appearance offers twelve themes instead of four accent swaps: Sky (the house default), Midnight, Forest, Ember, Wine, Ocean, Slate, Sand, Solar, Synthwave, Sakura and Mono. Each washes the ground, panels, lines and secondary text in its own hue, in light and dark, and the picker previews each one's ground with its accent. Saved violet / emerald / ember choices carry over as Midnight / Forest / Ember.
- The "Open source · View source" bar shows only on the read-only demo.
- The categories toggle left the top-left of the content area: from md the panel closes from its own head, and clicking the current section in the rail hides or shows it. Phones keep the toggle in the top bar.
- `vercel.json` carries the new hash for index.html's pre-paint script.

_Touched: `site/src/index.css`, `hooks/useTheme.ts`, `components/SettingsModal.tsx`, `SectionRail.tsx`, `Sidebar.tsx`, `TopBar.tsx`, `App.tsx`, `site/index.html`, `site/vercel.json`, `AGENTS.md`, `README.md`, `docs/ARCHITECTURE.md`._

---

## 2026-10-23 — Colour-rail redesign (design 1a)

**UI**
- The sections leave the top bar for an always-visible icon rail on the left (md up): one hue tile per section, Settings at the foot. The current section's cell takes the categories panel's colour and runs into it, with inverted corners, so the open section and its categories read as one tab.
- The categories panel is tinted with the current section's hue; each category gets its own stable hue (`categoryHue()`), shown as a dot in the tree, as a colour band across the top of its cards and in the card's glyph and hover ring.
- A category or sub-category page shows its sub-categories as pills, so you can hop sideways without going back to the tree.
- The top bar's ⌘K button is now a search field; the hero glow follows the section hue. Phones keep the menu sheet for sections.

_Touched: `site/src/components/SectionRail.tsx` (new), `TopBar.tsx`, `Sidebar.tsx`, `PromptCard.tsx`, `App.tsx`, `lib/sections.ts`, `index.css`, `AGENTS.md`, `docs/ARCHITECTURE.md`._

---

## 2026-10-23 — Docs caught up with the day's fixes

**Docs**
- The root `README.md`, `docs/README.md`, `docs/setup/SETUP.md` and `docs/features/API.md` list every check: `test:mcp`, `test:safe-path` and `test:browser` (after a build, needs Chrome). The root README and `docs/README.md` also list `npm run bench`.
- `CONTRIBUTING.md` and the PR template name the new checks, and ask for `npm run bench` against [PERFORMANCE.md](development/PERFORMANCE.md) when a change touches the listing, the detail read or the ZIPs.
- `SECURITY.md`'s CI line covers path and link escapes and the page CSP.
- `AGENTS.md` and `docs/ARCHITECTURE.md` list the browser smoke test, the benchmark and the containment test in their layout trees.
- `docs/ROADMAP.md`'s status note says what's done (F01–F03, F05–F09, F11–F16, F18–F20), what waits on Mike (F04, F10, Node 24), and that roadmap work is paused.

_Touched: `README.md`, `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `SECURITY.md`, `AGENTS.md`, `docs/README.md`, `docs/setup/SETUP.md`, `docs/features/API.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`._

## 2026-10-23 — The full listing no longer blocks the server

**Measured first** (`npm run bench`, new). Before the change, a full listing (every body, 10.6 MB) walked the library with synchronous reads. It held the event loop for about a second, so a detail read that arrived meanwhile waited up to 927 ms. Five concurrent exports took 3.6 s each. The baseline, the results and the budgets are in [`docs/development/PERFORMANCE.md`](development/PERFORMANCE.md). Roadmap item F12.

**Changed**
- `GET /api/prompts` walks the library with async I/O (`walkLibrary`). The output is byte-identical to before in all three modes.
- Public listings, lightweight and full, are cached for five minutes as the bytes sent, with their ETag. Requests that arrive while one is being built share it. Serialization yields every 200 rows. The detail read's p95 during a cold export is now 128 ms, the stall 126 ms (once per five minutes), and a warm export takes 149 ms. The lightweight list's stall dropped from 55 ms to 9 ms, and `304`s still work.
- Skill and pack ZIPs use zlib's default level 6 instead of 9. On the largest skill that is about 40% less CPU for a 0.15% bigger file.
- A library edit can now take up to five minutes to show in a listing (it already did for the lightweight list).

**Fixed**
- `test:browser` matched any text containing "N results". A card blurb mentioning "10 results" made it fail, so the match is now anchored.

_Touched: `site/api/index.ts`, `site/api/skill-packs.ts`, `site/scripts/bench-endpoints.mjs`, `site/scripts/browser-smoke.test.mjs`, `site/package.json`, `docs/development/PERFORMANCE.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md`, `docs/README.md`, `AGENTS.md`, `docs/ROADMAP.md`._

## 2026-10-23 — Resources links on phones and narrow windows

**Fixed**
- The Resources links were only reachable from 1536px up. Between 1360 and 1535px there was neither a Resources dropdown nor a menu button. The menu button and its sheet now last until 1536px. The sheet lists every Resources group under the sections, and its section buttons hide from 1360px, where the bar already shows them. The sheet scrolls when it is taller than three quarters of the screen. Roadmap item F16.

_Touched: `site/src/components/TopBar.tsx`, `site/src/components/ResourcesNav.tsx`, `site/src/index.css`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`._

## 2026-10-23 — The demo's pages get a CSP

**Added**
- `site/vercel.json` sends a Content Security Policy, `X-Frame-Options: DENY`, `nosniff` and `Referrer-Policy` with the demo's HTML and assets (everything but `/api/`, which keeps helmet's). Scripts may come from the site itself, from `index.html`'s inline theme script (allowed by hash) and from `consent.js`; styles from the site, Google Fonts and inline; no framing. Roadmap item F18.
- `npm run test:browser` serves the same headers and checks that the hash matches `index.html`, so editing the theme script without updating `vercel.json` fails CI with the new hash in the message.

**Checked** on the PR's Vercel preview: headers present, fonts load, the saved theme applies before paint, `consent.js` loads, navigation and a skill ZIP download work. Vercel's preview-only feedback toolbar is blocked by the policy; production doesn't load it.

_Touched: `site/vercel.json`, `site/scripts/browser-smoke.test.mjs`, `AGENTS.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`._

## 2026-10-23 — Links can't reach outside the library

**Fixed**
- `resolveInside()` compares real paths as well as strings. A symlink or junction inside `library/` that points elsewhere is refused for detail reads, skill downloads, MCP support files and Skill Pack reads. Roadmap item F14.
- The skill ZIP used `archive.directory()`, which followed a junction inside a skill folder and zipped whatever it pointed at. The skill ZIP, the pack ZIP and the MCP file list now walk with `filesUnder()`, which skips links.
- Skill Pack manifest paths go through `resolveInside()` instead of a bare `path.join`, so a manifest can't name a file outside the library.

**Added**
- `npm run test:safe-path` replaces the old mirrored self-check. It imports the real module and makes real junctions (and file symlinks where the OS allows), including two temporary ones in `site/library/3_Skills` for the HTTP checks, removed afterwards. It fails with either fix reverted.

**Docs**
- `ARCHITECTURE.md`, `SECURITY.md`, `MCP-SERVER.md` and `AGENTS.md` describe the real-path check, which closes F20.

_Touched: `site/lib/safe-path.ts`, `site/lib/safe-path.test.mjs`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/mcp/server.ts`, `site/package.json`, `.github/workflows/ci.yml`, `AGENTS.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/features/MCP-SERVER.md`, `docs/features/API.md`, `docs/README.md`, `docs/setup/SETUP.md`, `docs/ROADMAP.md`._

## 2026-10-23 — A browser smoke test in CI

**Added**
- `npm run test:browser` (`site/scripts/browser-smoke.test.mjs`) serves the built `dist/` with the real Express app and drives Chrome through `playwright-core`. It loads the listing, opens a detail page, checks the hero counter names its section, and checks that the Settings dialog keeps focus and returns it on Escape. Any page error, console error or failed request fails it. Removing the dialog's Tab trap turns it red. CI runs it after the MCP test. Roadmap item F09 is done.
- `playwright-core` 1.64.0 is a dev dependency. It bundles no browser and uses the installed Chrome; `CHROME_PATH` points it at another Chromium.

_Touched: `site/scripts/browser-smoke.test.mjs`, `site/package.json`, `site/package-lock.json`, `.github/workflows/ci.yml`, `AGENTS.md`, `docs/ROADMAP.md`._

## 2026-10-23 — Dialogs keep keyboard focus

**Fixed**
- The editor and Settings dialogs manage focus. Opening one moves focus inside (the editor's title field, or the first control), Tab and Shift+Tab wrap within it, and the page behind is `inert`, so it can't be clicked, tabbed into or read by a screen reader. Escape closes it and focus returns to the button that opened it. Roadmap item F08.
- The colour palette in Settings is a proper radio group: one tab stop, and the arrow keys move the choice.

_Touched: `site/src/components/ui/primitives.tsx`, `site/src/components/SettingsModal.tsx`, `site/src/components/PromptEditorModal.tsx`, `docs/ROADMAP.md`._

## 2026-10-23 — Strict TypeScript, honest copy toasts, and a resync fix

**Fixed**
- Copy on the detail page, and both "copy link" buttons, wait for the clipboard: the success toast shows only when the write lands, and a refused or missing clipboard shows "Failed to copy" instead of an unhandled rejection. Roadmap item F19.
- `scripts/resync-upstream.mjs` no longer writes `tags: [...]---` when `tags:` follows the `upstream:` block; `stampUpstream` always ends on a newline. A new case in `scripts/upstream.test.mjs` fails without the fix.
- MCP `update_my_prompt` declares `destructiveHint: true`, since it replaces a body. `scripts/mcp-server.test.mjs` checks the hint on all four write tools. Roadmap item F15.

**Changed**
- `strict` is on in `site/tsconfig.json`. The three errors it raised are fixed, and the explicit `any`s at the API and UI boundaries are typed (`ListedPrompt`, `LibraryIndex`, `SkillPack`, `PromptDraft`). `@types/react` and `@types/react-dom` are direct dev dependencies. Roadmap item F11.
- The hero's first counter names what the section holds (Servers, Skills, Agents…) from a new `noun` field in `src/lib/sections.ts`.
- CI runs `npm run build` after the type-check, so a broken bundle fails the PR (part of F09).

**Docs**
- `docs/setup/SETUP.md` and `docs/README.md` drop "Node 20 works" (Node 20 is past end of life); the `server.ts` comment stops naming the removed `cookieParser` (part of F20). `AGENTS.md` and `docs/features/MCP-SERVER.md` follow.

_Touched: `site/src/hooks/usePromptContent.ts`, `site/src/App.tsx`, `site/src/components/PromptEditorModal.tsx`, `site/src/lib/sections.ts`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/lib/library.ts`, `site/mcp/server.ts`, `site/scripts/mcp-server.test.mjs`, `site/server.ts`, `site/tsconfig.json`, `site/package.json`, `scripts/resync-upstream.mjs`, `scripts/upstream.test.mjs`, `.github/workflows/ci.yml`, `AGENTS.md`, `docs/setup/SETUP.md`, `docs/README.md`, `docs/features/MCP-SERVER.md`, `docs/ROADMAP.md`._

## 2026-10-23 — Docs caught up with the audit fixes

**Docs**
- `docs/ROADMAP.md`: the status badge is now Phase 2, and the note records which audit items are done (F01–F03, F05–F07, F13) and what is next (F08). F09 and F20 note their progress so far.
- `SECURITY.md` lists today's protections: read-only hiding My Library, the Host and Origin check, and checked, atomic, conflict-aware writes. Its CI line names the new tests.
- `CONTRIBUTING.md` and the PR template ask for every `npm run test:*` script, not just `test:routes`.
- `docs/ARCHITECTURE.md` describes how the UI handles a failed prompt load and a save conflict.

_Touched: `docs/ROADMAP.md`, `SECURITY.md`, `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `docs/ARCHITECTURE.md`._

## 2026-10-23 — Saves can't half-write a file or overwrite a newer edit

**Changed**
- My Library replaces a file by writing a temp file in the same folder and renaming it over the original, so a crash or a full disk mid-save leaves the old prompt whole.
- Every My Library prompt carries a `version`, a hash of the file on disk. The editor sends back the version it opened. If the file changed in the meantime (another tab, an agent over MCP, or a text editor, which `updated` alone would miss), the save is refused with `409`. The editor then reloads with the saved text and says so, instead of silently overwriting it. MCP `update_my_prompt` takes the same optional `version`, and `get_item` shows it. Roadmap item F07.
- Adding a skill pack is all or nothing: if one skill fails, the ones that request already wrote are deleted, so a retry starts clean.

**Added**
- `scripts/my-library.test.mjs`:
  - two stale writers (the first save wins);
  - a hand edit that leaves `updated` alone;
  - an injected rename failure (old file intact, no temp left);
  - the HTTP `409` and its `current`;
  - a pack install that fails on its second skill (nothing left behind, and the retry adds each skill once).
- `scripts/mcp-server.test.mjs` checks a stale `version` is refused.

**Docs**
- `docs/features/API.md` documents `version`, the `409` and the all-or-nothing pack install; `docs/features/MCP-SERVER.md`, `docs/mcp-server.md`, `docs/ARCHITECTURE.md` and `docs/setup/SETUP.md` follow.

_Touched: `site/lib/my-library.ts`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/mcp/server.ts`, `site/src/App.tsx`, `site/src/components/PromptCard.tsx`, `site/scripts/my-library.test.mjs`, `site/scripts/mcp-server.test.mjs`, `docs/features/API.md`, `docs/features/MCP-SERVER.md`, `docs/mcp-server.md`, `docs/ARCHITECTURE.md`, `docs/setup/SETUP.md`, `docs/ROADMAP.md`._

## 2026-10-23 — Downloaded prompts are valid markdown files

**Fixed**
- The Download button built the file's frontmatter by pasting values into a template. A title containing `: ` made the YAML invalid. Tags came out as one comma-separated string, a missing subcategory as the word `None`, and every other frontmatter key was dropped, so a downloaded My Library skill lost the `name` and `description` it needs to load. Now `src/lib/markdown-file.ts` writes each value as JSON, which YAML reads as-is. The skill's own keys come first, and the body follows unchanged. Roadmap item F06.
- Download file names no longer start with dashes when a title opens with an emoji.

**Changed**
- `GET /api/prompts/:id` returns `extra`, the file's frontmatter beyond the standard fields, for both libraries.

**Added**
- `scripts/markdown-file.test.mjs` (`npm run test:markdown-file`, in CI) downloads four awkward prompts and reads each back through the My Library store unchanged: colons, quotes, a newline in the title, emoji tags, a body containing `---`, and a skill with `name`, `description`, `license`, `allowed-tools` and nested `metadata`.

**Docs**
- `docs/features/API.md` documents `extra`. `README.md`, `AGENTS.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md` and `docs/setup/SETUP.md` list the new test and file.

_Touched: `site/src/lib/markdown-file.ts`, `site/src/App.tsx`, `site/src/components/PromptCard.tsx`, `site/api/index.ts`, `site/scripts/markdown-file.test.mjs`, `site/package.json`, `.github/workflows/ci.yml`, `README.md`, `AGENTS.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md`, `docs/setup/SETUP.md`, `docs/ROADMAP.md`._

## 2026-10-23 — My Library writes check their fields

**Changed**
- Every My Library write is checked in one place, the store's `create` and `update`, so the HTTP routes, the MCP tools, copies and pack installs all apply the same rules. Title and category must be non-blank text, section one of the six library folders, subcategory text or null, tags a list of up to 50 non-blank strings, content non-blank and at most 500 KB. Limits sit well above anything in the Public Library. A refused write changes no file and comes back as `400` naming the field (an error result over MCP). Roadmap item F05.
- An empty `content` (or title) on an update is now refused. Before, the store's `||` reported success and quietly kept the old body.

**Fixed**
- Objects, numbers and unknown sections no longer reach the frontmatter on disk.

**Added**
- `scripts/my-library.test.mjs` covers 14 bad creates, 5 bad updates (file unchanged), a Unicode round trip and the HTTP `400`s; `scripts/mcp-server.test.mjs` checks `update_my_prompt` refuses an empty body.

**Docs**
- `docs/features/API.md` has a field-rules table and the new `400`s; `docs/features/MCP-SERVER.md` and `docs/ARCHITECTURE.md` point at the shared check.

_Touched: `site/lib/my-library.ts`, `site/api/index.ts`, `site/scripts/my-library.test.mjs`, `site/scripts/mcp-server.test.mjs`, `docs/features/API.md`, `docs/features/MCP-SERVER.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`._

## 2026-10-23 — A prompt that fails to load is not opened from its preview

**Fixed**
- When a prompt's full text could not be loaded (server error, network failure, bad response), the app fell back to the listing copy, which is a 200-character preview for My Library and nothing for the Public Library. Edit then opened on the preview, and saving wrote it over the real file. Download and card Copy reported success with the preview or an empty body, and the detail page opened on the preview, so its Copy did too. Now each shows an error and stops: the editor stays shut, nothing is downloaded or copied, and the page you were on stays put. Roadmap item F03.

**Added**
- `scripts/prompt-content.test.mjs` (`npm run test:prompt-content`, in CI) checks that `fetchFullPrompt` throws on 503, 404, a network failure, invalid JSON and a missing body, and returns a 5,000-character body whole.

**Docs**
- `README.md`, `AGENTS.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md` and `docs/setup/SETUP.md` list the new test; `AGENTS.md` describes the fail-closed fetch.

_Touched: `site/src/hooks/usePromptContent.ts`, `site/src/App.tsx`, `site/scripts/prompt-content.test.mjs`, `site/package.json`, `.github/workflows/ci.yml`, `README.md`, `AGENTS.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md`, `docs/setup/SETUP.md`, `docs/ROADMAP.md`._

## 2026-10-23 — One Host and Origin check in front of every route

**Security**
- The local server refuses a request whose `Host` is not `localhost`, `*.localhost`, an IP address or a name in `ALLOWED_HOSTS`, on every route: the API, skill packs, and the pages in both `npm run dev` and `npm start`. A page that rebinds its own domain to `127.0.0.1` (DNS rebinding) can no longer read My Library. Until now only Vite checked Host, and only for pages in dev. Vercel skips the check. Roadmap item F02.
- The cross-site `Origin` check moved out of `requireWritable` into the same middleware and now covers every write, so skill-pack add and remove refuse other sites too instead of relying on `READ_ONLY` and `confirm`. Roadmap item F13.

**Changed**
- `ALLOWED_HOSTS` now applies to the API and `npm start` as well as the dev server, and takes `.suffix` entries for subdomains, like Vite.

**Added**
- `scripts/my-library.test.mjs` covers foreign Hosts on reads, writes and packs, the trusted names, and cross-site versus same-origin pack add and remove. It fails with the middleware removed.

**Docs**
- `README.md`, `AGENTS.md`, `site/.env.example`, `docs/setup/SETUP.md`, `docs/ARCHITECTURE.md` and `docs/features/API.md` describe the Host and Origin checks and the wider reach of `ALLOWED_HOSTS`. `AGENTS.md` lists all five optional settings.

_Touched: `site/api/index.ts`, `site/scripts/my-library.test.mjs`, `site/.env.example`, `README.md`, `AGENTS.md`, `docs/setup/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md`, `docs/ROADMAP.md`._

## 2026-10-23 — Read-only mode keeps My Library private

**Fixed**
- With `READ_ONLY` set (or on Vercel), the server no longer serves My Library: `GET /api/prompts?library=my` returns an empty list, a My Library id on `GET /api/prompts/:id` is not found, and `GET /api/skill-packs?library=my` lists no packs. Writes were already refused; reads were not, so a server exposed read-only as `docs/setup/SETUP.md` suggests could hand out a personal library. Roadmap item F01. The MCP server is unchanged: over stdio, read-only still reads My Library.

**Added**
- `scripts/read-only.test.mjs` (`npm run test:read-only`, in CI): seeds a private prompt in a temp folder, checks the three routes hide it and that public list, detail, skill download and packs still work. It fails with the guards removed.

**Docs**
- `docs/setup/SETUP.md` says `READ_ONLY` means Public Library only, instead of implying it shares My Library read-only. `README.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md` and `docs/setup/DEPLOYMENT.md` describe the closed reads and list the new test.

_Touched: `site/api/index.ts`, `site/api/skill-packs.ts`, `site/scripts/read-only.test.mjs`, `site/package.json`, `.github/workflows/ci.yml`, `AGENTS.md`, `README.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/features/API.md`, `docs/setup/SETUP.md`, `docs/setup/DEPLOYMENT.md`, `docs/ROADMAP.md`._

## 2026-10-23 — The audit's findings are on the roadmap

**Docs**
- `docs/ROADMAP.md` gains **Phase 2: Audit fixes**, from the 2026-10-23 audit (health 6.4/10, no P0): read-only mode hiding My Library (F01), one Host/Origin check including pack writes (F02, F13), failing closed when a prompt body cannot load (F03), shared write schemas, lossless export, atomic conflict-aware writes, modal focus, MCP hint and clipboard fixes, CI build and contract tests, required checks on `main`, symlink-safe paths, demo headers and stale setup claims. Loose ends becomes Phase 3 and gains strict TypeScript (F11) and endpoint budgets (F12).
- Findings that matched an existing item were merged into it: the Resources menu (F16), the history secret scan (F10, now run, with 138 candidates left to triage), provenance (F17), source and freshness badges (O02), export/import (O01) and placeholder arguments (O03). Evaluation export (O04) is new.

_Touched: `docs/ROADMAP.md`._

## 2026-10-23 — A Favorites button in the sidebar

**Added**
- A **Favorites** row tops the sidebar's category list, set off by a thin rule, in every section but Skill Packs and in both libraries. Its count and the view it opens cover the starred prompts in the current section and library, sorted by title, laid out like a category page with a "Favorites" breadcrumb.

_Touched: `site/src/App.tsx`, `site/src/components/Sidebar.tsx`._

## 2026-10-23 — Upstream check

**Changed**
- `UPSTREAMS.md`: every row checked. The Vercel row now records that its default Node is 24, with 22 still offered and 20 deprecated since 2026-10-01 ([docs](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)); the framework rows carry the declared versions from `site/package.json`.
- Four roadmap items queued: `actions/*@v4` to v7, Express 5, Vite 8 with plugin-react 6, TypeScript 7. The MCP SDK (2.3.1) and its test are current.

---

## 2026-10-22 — The MCP write tools can import a local file

**Added**
- `save_to_my_library` and `update_my_prompt` take `file`: the absolute path of a local `.md` file the server reads, so an agent can save or refresh a long `SKILL.md` without retyping it into the call. The file's frontmatter is kept; `content` becomes a preface above it.
- `IMPORT_ROOTS` lists the folders `file` may read. Unset, `file` is refused; outside paths, junctions that resolve outside, non-markdown and files over 500 KB are refused too. Covered in `scripts/mcp-server.test.mjs`.

**Docs**
- `docs/features/MCP-SERVER.md` and `docs/mcp-server.md` describe `file` and `IMPORT_ROOTS`, and count four write tools, not three.

_Touched: `site/mcp/server.ts`, `site/scripts/mcp-server.test.mjs`, `docs/features/MCP-SERVER.md`, `docs/mcp-server.md`._

## 2026-10-22 — My Library copies know their public source

**Added**
- Saving a Public Library item records `forked_from` (its id) and `forked_hash` (its content as copied) in the copy's frontmatter, from the site and from `save_to_my_library`.
- A copy whose public version has changed shows an **Update from public** banner on its page; `POST /api/prompts/:id/pull-upstream` and the MCP tool `update_from_public` replace the copy's body with the current public one. If the copy was edited too, the site asks first. The public file is only ever read.
- `GET /api/prompts/:id` returns `upstream` for My Library items, and MCP `get_item` notes a changed public version. Copies saved before today have no `forked_from` and are matched by section, category, subcategory and title.
- The My Library detail page has an Edit button.

**Changed**
- The edit button is the plain pencil (`Pencil`) instead of lucide's `Edit`, which is the pencil-in-a-square "compose" glyph.

_Touched: `site/lib/my-library.ts`, `site/api/index.ts`, `site/mcp/server.ts`, `site/src/App.tsx`, `site/src/components/PromptCard.tsx`, `site/src/components/PromptDetail.tsx`, `site/scripts/*.test.mjs`, `README.md`, `AGENTS.md`, `docs/features/API.md`, `docs/features/MCP-SERVER.md`, `docs/mcp-server.md`, `docs/ARCHITECTURE.md`._

## 2026-10-22 — The README links the MCP setup page

**Docs**
- The root README links to `docs/mcp-server.md`, the one page with the install line for each client, so the MCP setup is one click from the repo's front page.

## 2026-10-22 — The MCP server and package are named promptbook

**Changed**
- The MCP server id is now `promptbook` (`serverInfo.name` in `site/mcp/server.ts`, the install lines in
  `README.md`, `docs/mcp-server.md`, the homepage and the server's own card). An install under the old
  `my-prompt-library` id keeps working until you re-add it as `promptbook`; tool names become `mcp__promptbook__*`.
- The card moved from `6_MCP_Servers/Developer_Tools/my-prompt-library.md` to `promptbook.md`, so its old
  `?prompt=` link no longer resolves.
- `site/package.json` is named `promptbook`; Skill Packs carry `"author": "promptbook"`
  (`scripts/build-skill-packs.mjs` and the pack docs follow); the GitHub API scripts send `promptbook-*` user agents.
  `AGENTS.md` and the bug template name the `promptbook-demo` host.
- Kept on purpose: the `my-prompt-library.theme` / `.palette` localStorage keys, so saved preferences survive.

_Touched: `site/mcp/server.ts`, `site/package.json`, `site/package-lock.json`, `site/library/`, `site/api/prompt-index.json`, `scripts/`, `homepage/index.html`, `README.md`, `AGENTS.md`, `docs/`._

---

## 2026-10-22 — A failed chunk load no longer blanks the app

**Fixed**
- Opening a prompt could turn the whole page black: a stale Vite dep cache made the lazy
  `PromptDetail` chunk fail to import (`504 Outdated Optimize Dep`), and with no error boundary
  React unmounted everything. The five lazy views now load through `lazyReload()`, which reloads
  the page once on a failed chunk. It also covers an open demo tab whose chunks a new deploy replaced.
  Troubleshooting entries added to the Debug Guide and SETUP.
- Opening any of the 21 generated Skill Packs also went black: they have no `use_cases` or
  `prerequisites`, and the pack view read `.length` on both. `SkillPacksView` now defaults
  every optional array when it loads a pack.

_Touched: `site/src/App.tsx`, `site/src/components/SkillPacksView.tsx`, `docs/development/DEBUG_UI.md`, `docs/setup/SETUP.md`._

---

## 2026-10-22 — Library refresh — catalog

**Added**
- MCP cards (`6_MCP_Servers/Cloud_Platforms/`), install lines read from each README on 2026-10-22:
  `mongodb.md` (mongodb-js/mongodb-mcp-server, Apache-2.0) and `neon.md` (neondatabase/mcp-server-neon, MIT).
  Databases had no card before.
- Discovery intake, three `accept` rows set to `done`:
  - DietrichGebert/ponytail (MIT, ref `09c434ab`): `ponytail`, `ponytail-audit`, `ponytail-debt`,
    `ponytail-gain`, `ponytail-help`, `ponytail-review` → `3_Skills/Development/Engineering/`.
  - tt-a1i/archify (MIT, ref `25cf3708`): `archify` (SKILL.md, LICENSE, references/) → `3_Skills/Design/archify/`.
    The 18 MB of scripts, renderers and examples were left out.
  - K-Dense-AI/scientific-agent-skills (MIT, ref `593377bb`): `scikit-learn`, `statsmodels`, `pymc`, `shap`,
    `seaborn`, `networkx` → `3_Skills/Data/`.
- No system prompts or agent definitions: no new vendor-published system prompt found that is not already here,
  and no installable agent definition was added this run.

---

## 2026-10-22 — The app is addressed as promptbook-demo

**Changed**
- Every link to the hosted app now names `https://promptbook-demo.ai-automation-tools.dev`, including
  `PUBLIC_SHARE_ORIGIN` in `site/src/App.tsx`, so new share links use the new host. The homepage, its
  404 redirect, the README, `SECURITY.md` and the docs follow. `my-prompt-library-demo.` still serves
  the same Vercel project, so old share links keep working.

_Touched: `site/src/App.tsx`, `scripts/homepage.test.mjs`, `homepage/`, `README.md`, `SECURITY.md`, `docs/`._

---

## 2026-10-22 — Org layout: AGENTS.md and the MCP page

**Changed**
- The repo guide moved from `CLAUDE.md` to `AGENTS.md`, which Codex, Gemini CLI and opencode read.
  `CLAUDE.md` is now `@AGENTS.md` plus a note on `.mcp.json`. Links in `docs/README.md` and
  `docs/ARCHITECTURE.md` follow it.

**Added**
- `docs/mcp-server.md`: the MCP server on one page (entry file, launch, stdio transport, all eleven
  tools, the MCP prompts, env var names, the install line), linked from the docs hub. The design
  stays in `features/MCP-SERVER.md`.

_Touched: `AGENTS.md`, `CLAUDE.md`, `docs/mcp-server.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/CHANGELOG.md`._

---

## 2026-10-22 — Library refresh — prompts and agents

**Agents** (synced to `davila7/claude-code-templates` @ `5bbe5a7`, MIT, `match: exact`):
`task-decomposition-expert`, `hackathon-ai-strategist`, `model-evaluator`, `llms-maintainer`,
`ai-ethics-advisor` (all `ai-specialists/`), `computer-vision-engineer` (`data-ai/`).

**Prompts** (model names checked against
[Anthropic's models overview](https://platform.claude.com/docs/en/about-claude/models/overview),
[OpenAI's models page](https://developers.openai.com/api/docs/models) and
[Google's Gemini models page](https://ai.google.dev/gemini-api/docs/models); stamped `checked: 2026-10-22`):
- `AI_ML/Claude_Code/claude-advanced-reasoning.md`: Claude 3.5 Sonnet → Claude Sonnet 5.5.
- `Business/Marketing/claude-seo-keyword-chain.md`: Claude 3.5 Sonnet → Claude Sonnet 5.5.
- `Business/Ecommerce/business-plan-prompts.md`: GPT-4 / Claude 3 / Gemini Advanced → Claude Sonnet 5.5 / GPT-6.1 Sol / Gemini 3.8 Flash.

---


## 2026-10-22 — Renamed to Promptbook

The GitHub repo moved from `ai-automation-tools/my-prompt-library` to
`ai-automation-tools/promptbook`, and the product's display name is now **Promptbook**.

**Changed**
- Every GitHub link points at `ai-automation-tools/promptbook`; the homepage is
  `promptbook.ai-automation-tools.dev` (canonical, `og:url`, `CNAME`, `scripts/homepage.test.mjs`).
- The name reads "Promptbook" in the README, docs, homepage (title, headings, meta and og tags),
  the app's page title, top bar and footer, the MCP server's instructions and its own library card,
  the diagram titles, the logo proposals in `images/`, `SECURITY.md` and `NOTICE`.
- Clone instructions now `cd promptbook/site`, matching the folder `git clone` creates.

**Kept, on purpose**
- Identifiers: the MCP server id `my-prompt-library` (and its `mcp__my-prompt-library__*` tool
  names and config examples), the npm package name, the Vercel project, env var names, API
  routes, localStorage keys, file and folder names, and the Skill Pack `author` field.
- The demo stays on `my-prompt-library-demo.ai-automation-tools.dev` until a `promptbook-demo`
  record exists.

---

## 2026-10-21 — Monthly upkeep

| File | Action | Reason / source |
|:---|:---|:---|
| `1_Guides/API_Providers/gemini_models_cli_guide.md` | fixed | Gemini 1.0/1.5/2.0 IDs retired (2.0 Flash shut down 2026-06-01); examples now use `gemini-3.6-flash` / `gemini-3.1-pro-preview`, model table rewritten, unverifiable price/limit tables and the GPT-4/Claude 3.5 comparison replaced by links. Sources: ai.google.dev/gemini-api/docs/models and /deprecations |
| `1_Guides/API_Providers/google-gemini-studio-guide.md` | fixed | `gemini-1.5-pro` → `gemini-3.1-pro-preview` |
| `4_Prompts/Automation/Serper/serper-mcp-prompts.md` | fixed | "Google Bard" → "Google Gemini" |
| `n8n-mcp-prompts.md`, `nano-banana.md`, `job-interviewer.md`, `investor-pitch-deck.md` (4_Prompts) | unfeatured | 44 featured prompts, cap 40; oldest `lastModified` dropped |

Checks with nothing to do: `check-mcp-servers.mjs` (20 cards, 0 flagged), `check-resources.mjs` (40 ok, 0 dead),
`build-skill-packs.mjs --write` (21 unchanged, 0 hand packs fixed), `backfill-tags.mjs` (0 files). No `2_Agents` file lacks `name:`.
No cross-folder pack theme this month, none added. Left alone: `localai_cli_guide.md` (`gpt-3.5-turbo` is a local model alias, not the OpenAI model).

---

## 2026-10-21 — Tailscale access documented; stopping the app spares the MCP server

Reviewed alongside the logon auto-start and `tailscale serve` set up earlier the same day
(#395 added `ALLOWED_HOSTS`).

**Checked, no conflict**
- The start task now also runs at logon and kept its exact path, so the daily sync's
  stop-and-restart entry for this repo still matches it.
- Port 3010 is served to the tailnet only (no Funnel), proxied to `127.0.0.1:3010`; the server
  still binds loopback. Through both tailnet hostnames the page and API answer `200`; a write
  with a foreign Origin is refused `403`, a same-origin one passes the guard.

**Fixed (outside this repo)**
- `Stop-Prompt-Library` ended every process in `site/node_modules`, which includes this
  library's MCP server in every Claude Code session using it. The Routines fleet's
  `Invoke-AppControl.ps1` now excludes processes naming `mcp/server.ts` and their children.
  Tested with a connected session through a real stop and start: the MCP server kept
  answering throughout.

**Docs**
- `ALLOWED_HOSTS` is in the settings tables of `README.md` and `docs/setup/SETUP.md`, and
  `SETUP.md` has an "Over Tailscale" section: the `tailscale serve` command, the
  `ALLOWED_HOSTS` line, and the fact that every tailnet device can edit My Library unless
  `READ_ONLY=true`.

_Touched: `README.md`, `docs/setup/SETUP.md`, `docs/CHANGELOG.md`; outside the repo, `Invoke-AppControl.ps1`._

## 2026-10-21 — Docs brought level with the day's changes

**Docs**
- `docs/DIRECTION.md` moved to `docs/audits/DIRECTION-2026-08-27.md` with a "historical" note:
  it explained the post-audit plan of August (accounts, Neon, GitHub mode), which the local-first
  rewrite and today's new roadmap replaced. Its links were fixed for the new folder.
- `docs/README.md`: the index lists the discovery ledger and `UPSTREAMS.md` instead of
  Direction, and the tree shows `DISCOVERY.md`, `UPSTREAMS.md`, the MCP Servers template and
  `features/MCP-SERVER.md`.
- `docs/ARCHITECTURE.md` and the `README.md` tree: `lib/library.ts`, `site/mcp/`,
  `6_MCP_Servers/`, `resources.json`, the MCP test, and the six repo scripts added this month.
- `docs/CONTRIBUTING.md`: the folder tree has `6_MCP_Servers/`, and `2_Agents/` says
  installable subagents only. The templates README and summary describe the agents template as
  subagent definitions rather than personas and list the MCP Servers template.
  `3_Skills/README.md` describes `2_Agents` the same way.
- Every relative link in the touched docs resolves; `homepage.test.mjs` passes.

_Touched: `README.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/CONTRIBUTING.md`, `docs/audits/DIRECTION-2026-08-27.md` (moved), `docs/templates/README.md`, `docs/templates/TEMPLATE-SUMMARY.md`, `site/library/3_Skills/README.md`, `docs/CHANGELOG.md`._

## 2026-10-21 — My Library keeps a skill's frontmatter

Found by testing the MCP server for real: a Claude Code session created a prompt and a skill in
My Library, then the skill was edited.

**Fixed**
- `lib/my-library.ts` rewrote a file's whole frontmatter on every save from the seven keys it
  manages, so **any edit dropped a skill's `name` and `description`**, and a skill without them
  does not load. This hit the app's editor too, not only the MCP server. Unmanaged keys now
  live in a new `extra` field: read from the file, written back first (a skill still opens with
  `name:`), and kept through updates.
- Copying from the Public Library dropped them as well: the copy route, Skill Pack installs and
  the MCP server's `save_to_my_library` passed only the body. They now carry the item's own
  frontmatter, less provenance (`upstream:`) and the keys My Library manages
  (`carriedFrontmatter()` in `lib/library.ts`).
- `get_item` returns a My Library skill as a complete SKILL.md, frontmatter included.

**Tests**
- `test:my-library`: a skill keeps `name` and `description` through an update, and the file
  starts with `name:`. `test:mcp`: a skill created with frontmatter survives an edit and
  read-back, and a copied Public Library skill keeps its `name`. With the fix removed, both
  suites fail.
- Re-run through Claude Code: the skill created in the first test was edited and still reads
  back with its `name` and `description`, on disk and through `get_item`.

_Touched: `site/lib/my-library.ts`, `site/lib/library.ts`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/mcp/server.ts`, `site/scripts/my-library.test.mjs`, `site/scripts/mcp-server.test.mjs`, `docs/features/MCP-SERVER.md`, `docs/CHANGELOG.md`._

## 2026-10-21 — The MCP server stays current with everything else

The server runs straight from this clone (it is in Mike's user-scope Claude Code config), so
anything that leaves the clone stale breaks it in every session.

**Found and fixed**
- The daily repo sync never reinstalled `node_modules` for this repo. It only acted on a
  root-level `package-lock.json` changing, and only for read-only mirrors; this repo's lockfile
  is `site/package-lock.json` and it syncs through `mike_desktop`. `Sync-Repos.ps1` (outside
  this repo) gains an opt-in `$repoInstallDirs` map with `my-prompt-library = site`: a pulled
  change to that lockfile now stops the local app and any `node` process rooted in the repo,
  runs `npm ci` in `site/`, checks the tree, and restarts the app. The repo also gets the
  `$repoServiceTasks` row the hub asks of any repo that runs a dev server. Exercised once
  against the real repo: `npm ci` ran, the app came back, the build and `test:mcp` passed.

**Tooling**
- `npm run test:mcp` now also fails if `SECTIONS` in `lib/library.ts` and `src/lib/sections.ts`
  list different folders, so a new library section cannot ship without the server knowing it.
  Proved by renaming one folder: the test failed with that message.
- The item count in the server's instructions is read from the index at start-up instead of
  being written into the code.

**Docs**
- `docs/features/MCP-SERVER.md` gains "How it stays current": what keeps the content, the clone,
  `node_modules`, the SDK and the server's own card current, and what CI checks.
- `README.md` links the MCP Server doc from its Features quick links; `docs/UPSTREAMS.md` lists
  the MCP SDK and zod so the biweekly upstream check covers majors and spec revisions;
  `CLAUDE.md` notes the section rule.

_Touched: `site/mcp/server.ts`, `site/scripts/mcp-server.test.mjs`, `docs/features/MCP-SERVER.md`, `docs/UPSTREAMS.md`, `docs/CHANGELOG.md`, `README.md`, `CLAUDE.md`; outside the repo, `Sync-Repos.ps1`._

## 2026-10-21 — The library is an MCP server

_Phase 1: MCP server for the library._ An agent can now search the library and use what it
finds directly: Claude Code, Codex, Cursor or any MCP client, over stdio, with nothing else
running.

**App**
- `site/mcp/server.ts` (`npm run mcp`), on `@modelcontextprotocol/server` 2.3, the v2 SDK line;
  `serveStdio()` serves 2026-era and 2025-era clients from one factory. Eleven tools:
  `search_library`, `get_item`, `list_sections`, `list_categories`, `get_skill`,
  `get_skill_file`, `list_skill_packs`, `get_skill_pack`, and the My Library writes
  `save_to_my_library`, `update_my_prompt`, `delete_my_prompt`, which are not registered at all
  when `READ_ONLY` is set. MCP prompts: `library_prompt` for any id, plus every featured prompt
  and every My Library prompt by name.
- `site/mcp/setup.ts` loads first and keeps stdout for the protocol: `console.log`, `info` and
  `debug` go to stderr, and `.env` loads with dotenv's `quiet` flag (dotenv 17 prints to stdout).
- `site/lib/library.ts` is new and shared: the library path, the section keys, the index loader
  and `readLibraryItem()`. `GET /api/prompts/:id` and the copy route now use it instead of their
  own copies; `getAllPacks()` is exported from `api/skill-packs.ts` for the server.
- Every caller path goes through `resolveInside()`. Support files are refused over 500 KB or
  when binary.

**Tests and CI**
- `npm run test:mcp` (`scripts/mcp-server.test.mjs`) spawns the server over real stdio with the
  SDK client: all eleven tools, the prompts, six traversal attempts, a My Library round trip in
  a temp folder, and read-only mode. A deliberately broken containment check made it fail, so
  the guard is covered. It never echoes what a broken guard returns. New CI step "MCP server".
- Checked by hand: three launch commands complete the handshake, and a Claude Code session with
  the README's config called `search_library` and got skill ids back.

**Docs**
- `docs/features/MCP-SERVER.md` (design and tool contracts), a README section with install lines
  and the tool table, the server's own card in `6_MCP_Servers/Developer_Tools/` (20 cards now),
  a homepage feature card (in place of the theme card) and install block, `CLAUDE.md`,
  `docs/ARCHITECTURE.md`, `docs/README.md`.
- Roadmap: seven Phase 1 items ticked. The MCP-prompts item was built differently from its
  wording (featured and My Library prompts plus one generic prompt, not all ~2,200), and
  placeholder-to-argument parsing became its own item under Later.

**Dependencies**
- Added `@modelcontextprotocol/server` and `zod`; `@modelcontextprotocol/client` as a dev
  dependency for the test. `npm audit` still reports four moderate advisories, all in
  `gray-matter`'s old `js-yaml` chain, which predate this change.

_Touched: `site/mcp/`, `site/lib/library.ts`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/scripts/mcp-server.test.mjs`, `site/package.json`, `site/package-lock.json`, `.github/workflows/ci.yml`, `site/library/6_MCP_Servers/`, `homepage/index.html`, `README.md`, `CLAUDE.md`, `docs/{ROADMAP,CHANGELOG,ARCHITECTURE,README}.md`, `docs/features/MCP-SERVER.md`, `site/api/prompt-index.json`._

## 2026-10-21 — Roadmap rewritten; Phase 1 is an MCP server for the library

**Docs**
- `docs/ROADMAP.md` rewritten from scratch in the lab roadmap standard. The finished history,
  the Snapshot table and the "Earlier work" essay are gone; this changelog is the record of
  everything done before today.
- **Phase 1: MCP server for the library**, at Mike's request. A stdio server in this repo
  (search, get, browse, skills and packs, library prompts as MCP prompts, My Library writes
  that respect `READ_ONLY`), each step with the test that proves it; then a read-only remote
  endpoint on the demo, an npm package and an MCP registry listing, which are Mike's calls.
- **Phase 2: Loose ends.** Node 24, the Resources menu below 1536px, per-section hero counter
  labels, semantic duplicates, and four decisions waiting on Mike (a stale branch, the
  Awesome ChatGPT corpus, a `LICENSE` for `agent-skills`).
- Public release keeps its three done gates and one open one, the full-history secret scan.
- After release: content provenance, three features (starter collections, generated vs
  hand-picked packs, My Library export and import), and a launch post. Dropped as obsolete:
  user ratings (there are no accounts) and "programmatic API access" (the MCP server is that).
- A "Kept current by" table says which scheduled job owns which part of the library.
- `CLAUDE.md` no longer points at a roadmap item that is gone. The weekly roadmap job's prompt
  (Routines fleet) now walks whatever phases the file has instead of a fixed Phase 1–3 list.

_Touched: `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `CLAUDE.md`._

## 2026-10-21 — MCP Servers section, 2_Agents holds real agents only, first discovery triage

**Content**
- New section **MCP Servers** (`site/library/6_MCP_Servers/`, tab `mcp-servers`, indigo accent).
  19 cards in five folders: the six reference servers (Filesystem, Fetch, Memory, Sequential
  Thinking, Git, Time), Playwright and Chrome DevTools, GitHub, Context7, MarkItDown and REA,
  Supabase, Cloudflare and AWS, Notion, n8n-mcp, Resend and Stripe. Each card names the
  maintainer, licence, transport and auth, with install lines for Claude Code and for any
  `mcpServers` client, all read from the server's own README today. Four are `featured`.
  Template: `docs/templates/mcp-servers-template.md`.
- **`2_Agents` now holds only installable subagent definitions.** The 456 files without `name:`
  frontmatter (role-play personas and "act as X" task prompts) are deleted; git history keeps
  them. 86 definitions remain, all with provenance. Section README rewritten; the agents
  template now starts from the subagent frontmatter.
- **Discovery triage.** All 28 ledger rows decided: 9 `accept` (skill collections with a
  licence, for the Catalog Refresh), 6 `link`, 10 `reject` (apps, agent harnesses, a
  CAPTCHA-bypass scraper, a leaked-prompt dump), 3 `done` (Context7, Chrome DevTools and REA
  became MCP cards).
- Resources menu: the six `link` rows added (four under Skills, two under Agents & MCP).
- Index: **2,795 entries** (3,192 − 456 agents + 40 skills from the first Skills Sync + 19 cards).

**Tooling**
- `scripts/check-mcp-servers.mjs` flags cards whose repo is missing, renamed, archived,
  relicensed, quiet for a year, or not re-read in 90 days. The Monthly Upkeep runs it.
- `scripts/discover-repos.mjs` links only `link` rows into the Resources menu now; accepted
  repos show up in the library itself.
- `scripts/backfill-tags.mjs` knows the new section (`mcp-server`).

**App**
- `sections.ts`, the tab type, the path filter and the per-section tokens (`--sec-mcp`, 400/700
  indigo) carry the seventh section. The top-bar section buttons fold into the sheet below
  **1360px** (was 1280px), the width seven buttons need.
- Running text keeps acronyms when it lower-cases a section name (`lowerLabel()`), so the page
  says "All MCP servers", not "All mcp servers".
- Homepage: "Six library sections" with an MCP Servers card; the Agents card describes what is
  there now.

_Touched: `site/library/2_Agents/**`, `site/library/6_MCP_Servers/**`, `site/library/resources.json`, `site/src/` (sections, route and filter hooks, index.css, App, LibraryHero, TopBar), `scripts/{check-mcp-servers,discover-repos,backfill-tags}.mjs`, `docs/` (DISCOVERY, ROADMAP, ARCHITECTURE, README, CONTRIBUTING, CHANGELOG, two templates), `homepage/index.html`, `CLAUDE.md`, `README.md`, `site/api/prompt-index.json`._

## 2026-10-21 — 40 skills synced from agent-skills

**Content**
- Copied from `ai-automation-tools/agent-skills` at `6f36b55` by `scripts/sync-agent-skills.mjs` (the weekly Skills Sync job), each with an `upstream:` block so the Monday drift check tracks it from here on:
  - `3_Skills/Development/Automation/agent-workspace-builder/` ← `Skills/Core/Automation/agent-workspace-builder/SKILL.md`
  - `3_Skills/Development/Automation/automated-dev-pipeline/` ← `Skills/Core/Automation/automated-dev-pipeline/SKILL.md`
  - `3_Skills/Development/Automation/html-email-templates/` ← `Skills/Core/Automation/html-email-templates/SKILL.md`
  - `3_Skills/Development/Automation/task-router/` ← `Skills/Core/Automation/task-router/SKILL.md`
  - `3_Skills/Business/Strategy/business-plan-builder/` ← `Skills/Core/Business/business-plan-builder/SKILL.md`
  - `3_Skills/Content/Cooking/recipe-validator/` ← `Skills/Core/Cooking/recipe-validator/SKILL.md`
  - `3_Skills/Content/Documentation/repo-docs-builder/` ← `Skills/Core/Documentation/repo-docs-builder/SKILL.md`
  - `3_Skills/Content/Image_Generation/news-images/` ← `Skills/Core/Image-Gen/news-images/SKILL.md`
  - `3_Skills/Development/Web_Development/project-hub-scaffold/` ← `Skills/Core/Web/project-hub-scaffold/SKILL.md`
  - `3_Skills/Development/Web_Development/web-house-style/` ← `Skills/Core/Web/web-house-style/SKILL.md`
  - `3_Skills/Development/API/api-client-resilience/` ← `Skills/Domain/API/api-client-resilience/SKILL.md`
  - `3_Skills/Development/API/api-integration-testing/` ← `Skills/Domain/API/api-integration-testing/SKILL.md`
  - `3_Skills/Development/API/api-response-normalization/` ← `Skills/Domain/API/api-response-normalization/SKILL.md`
  - `3_Skills/Development/API/public-api-evaluation/` ← `Skills/Domain/API/public-api-evaluation/SKILL.md`
  - `3_Skills/Development/API/rate-limit-and-quota-management/` ← `Skills/Domain/API/rate-limit-and-quota-management/SKILL.md`
  - `3_Skills/Business/Strategy/customer-discovery/` ← `Skills/Domain/Business/customer-discovery/SKILL.md`
  - `3_Skills/Business/Strategy/go-to-market/` ← `Skills/Domain/Business/go-to-market/SKILL.md`
  - `3_Skills/Business/Strategy/pricing-strategy/` ← `Skills/Domain/Business/pricing-strategy/SKILL.md`
  - `3_Skills/Development/Engineering/debugging-methodology/` ← `Skills/Domain/Engineering/debugging-methodology/SKILL.md`
  - `3_Skills/Development/Engineering/performance-optimization/` ← `Skills/Domain/Engineering/performance-optimization/SKILL.md`
  - `3_Skills/Development/Engineering/testing-strategy/` ← `Skills/Domain/Engineering/testing-strategy/SKILL.md`
  - `3_Skills/Content/Media/captions-and-accessibility/` ← `Skills/Domain/Media/captions-and-accessibility/SKILL.md`
  - `3_Skills/Content/Media/media-rights-and-licensing/` ← `Skills/Domain/Media/media-rights-and-licensing/SKILL.md`
  - `3_Skills/Content/Media/post-publish-analytics/` ← `Skills/Domain/Media/post-publish-analytics/SKILL.md`
  - `3_Skills/Security/Practice/security-metrics-and-posture/` ← `Skills/Domain/Security/security-metrics-and-posture/SKILL.md`
  - `3_Skills/Security/Practice/security-report-writing/` ← `Skills/Domain/Security/security-report-writing/SKILL.md`
  - `3_Skills/Security/Practice/vulnerability-disclosure/` ← `Skills/Domain/Security/vulnerability-disclosure/SKILL.md`
  - `3_Skills/Platform_Integrations/Agent_Chat/agent-chat-conv-types/` ← `Skills/Projects/agent-chat/agent-chat-conv-types/SKILL.md`
  - `3_Skills/Platform_Integrations/Agent_Chat/agent-chat-delivery/` ← `Skills/Projects/agent-chat/agent-chat-delivery/SKILL.md`
  - `3_Skills/Platform_Integrations/Agent_Chat/agent-chat-run-triage/` ← `Skills/Projects/agent-chat/agent-chat-run-triage/SKILL.md`
  - `3_Skills/Platform_Integrations/Cronsole/cronsole-claude-routines/` ← `Skills/Projects/cronsole/cronsole-claude-routines/SKILL.md`
  - `3_Skills/Platform_Integrations/Cronsole/cronsole-windows-jobs/` ← `Skills/Projects/cronsole/cronsole-windows-jobs/SKILL.md`
  - `3_Skills/Platform_Integrations/Edge_Radar/edge-radar-strategy-evidence/` ← `Skills/Projects/edge-radar/edge-radar-strategy-evidence/SKILL.md`
  - `3_Skills/Platform_Integrations/Edge_Radar/edge-radar-strategy-profiles/` ← `Skills/Projects/edge-radar/edge-radar-strategy-profiles/SKILL.md`
  - `3_Skills/Platform_Integrations/Edge_Spectrum/edge-spectrum-dataset/` ← `Skills/Projects/edge-spectrum/edge-spectrum-dataset/SKILL.md`
  - `3_Skills/Platform_Integrations/Edge_Spectrum/edge-spectrum-endpoint/` ← `Skills/Projects/edge-spectrum/edge-spectrum-endpoint/SKILL.md`
  - `3_Skills/Platform_Integrations/Edge_Spectrum/edge-spectrum-hub-tool/` ← `Skills/Projects/edge-spectrum/edge-spectrum-hub-tool/SKILL.md`
  - `3_Skills/Platform_Integrations/Project_Hub/project-hub-client/` ← `Skills/Projects/project-hub/project-hub-client/SKILL.md`
  - `3_Skills/Platform_Integrations/Project_Hub/project-hub-demo/` ← `Skills/Projects/project-hub/project-hub-demo/SKILL.md`
  - `3_Skills/Platform_Integrations/Project_Hub/project-hub-scan/` ← `Skills/Projects/project-hub/project-hub-scan/SKILL.md`

_Touched: the folders above, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._
## 2026-10-21 — Skills refresh, generated Skill Packs, repo discovery, a data-driven Resources menu

Four more pieces of the library's upkeep move from "someone should" to a script.

**Tooling**
- `scripts/sync-agent-skills.mjs` now **refreshes** as well as adds: a skill already stamped
  from `ai-automation-tools/agent-skills` whose upstream body moved gets its body and support
  files re-mirrored, local frontmatter kept, `ref`/`checked` bumped (`UPDATED` lines, own
  changelog bullet). The Monday Skills Sync job runs it, so the org's skills are both pulled in
  and kept level without waiting for the drift issue.
- `scripts/build-skill-packs.mjs` generates one pack per `3_Skills` folder with **6 or more
  skills** (`generated: true`, name and description read from each SKILL.md), rewrites only
  generated packs, removes one whose folder shrank, and with `--write` drops dead paths from the
  hand-written packs. First run: **20 generated packs** beside the 6 hand-written ones (Content,
  Data, Design, Security, Cloud, Git, Mobile, CI/CD, Blockchain, Web, SME, Development root,
  AI/ML, Business, Marketing, Enterprise Communications, Finance, Investing, Portfolio
  Management, Platform Integrations). A second run changes nothing.
- `scripts/discover-repos.mjs` searches GitHub (`gh search repos`, eleven queries across skills,
  prompts, agent definitions and MCP servers) for repos that are **new** (under a year old,
  500+ stars) or **popular** (5000+), skips everything the library already tracks (`upstream.repo`
  stamps, `docs/UPSTREAMS.md`, the Resources menu, the ledger), and appends the top 25 by stars
  to **`docs/DISCOVERY.md`** as `pending` rows with licence and last push. A person flips a row
  to `accept`, `link` or `reject`; the script links `accept`/`link` rows into the Resources
  menu, the Catalog Refresh job vendors `accept` rows with provenance. Leaked-prompt dumps are
  filtered out before they reach the ledger. The ledger starts with the three repos Mike named.
- The **Resources** menu reads `site/library/resources.json` (six groups, icon names resolved in
  `ResourcesNav.tsx`) instead of a hard-coded array, so scripts and jobs can add or drop a link.
  `scripts/check-resources.mjs` probes every link and reports the dead ones; its first run found
  Learn Prompting's system-prompts page gone (repointed to its prompt-structure page). The org's
  own `agent-skills` repo is now the first link under Skills.
- `site/tsconfig.json`: `resolveJsonModule`.

_Touched: `scripts/{sync-agent-skills,build-skill-packs,discover-repos,check-resources}.mjs`, `site/library/resources.json`, `site/library/3_Skills/packs/**` (20 new), `site/src/components/ResourcesNav.tsx`, `site/tsconfig.json`, `docs/DISCOVERY.md`, `CLAUDE.md`, `README.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

## 2026-10-21 — AX Platform content retired

The library was first built alongside the AX Platform agent-coordination tool, which is no
longer in service. Everything that only made sense with it is gone; prompts that mentioned it in
passing now read generically.

**Content**
- Removed (10 files, 3 of them whole folders): the `AX Platform Agent` persona
  (`2_Agents/Platform_Agents/Ax-Platform_Dev/`), the `ax-workspace-cookbook` skill
  (`3_Skills/Platform_Integrations/AX_Workspace_Cookbooks_SKILL/`), the `AX MCP Server Prompts`
  collection (`4_Prompts/Engineering/AX-Platform/`), the `AX Platform Workspace Task` Claude Code
  prompt, the three AX-specific Claude Cowork prompts (changelog draft, MCP updates newsletter,
  competitor intel), and the duplicate copies of the pricing-model and agent-spec prompts that
  were written "for AX Platform".
- Genericised (17 files): the surviving `Pricing Model Builder` and `Agent Spec Generator`
  prompts now target `[your product]` / "your agent platform"; eight Claude Cowork prompts say
  "my product" or "my stack" instead of AX Platform; the `siem_cve_workflow` skill drops the three
  `mcp__ax-platform__*` tools from `allowed-tools` and stores artifacts as "shared context"; the
  OpenClaw MCP setup guide loses its AX batch-auth block; two Build_Apps prompts lose the
  `projects/ax-platform/` path; the section READMEs for Agents and Skills no longer list it.
- Index: **3192 prompts** (was 3202).

_Touched: the files above, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

## 2026-10-21 — Every library section gets a job, and 430 files get tags

Until today the content automations grew `4_Prompts` only (two prompts a week), skills and
Skill Packs had no intake at all, and the two refresh passes each ran once a month. The fleet
in `~\.claude\Routines` now covers every section, one lane per job, and the repo carries the
scripts the model-free parts run on.

**Content**
- `scripts/backfill-tags.mjs` gives any indexed file with no `tags:` path-derived tags
  (section, category, subcategory). Run once: **430 files** tagged (241 skills, 162 agents, 21
  prompts, 6 system prompts) that the tag filter and ⌘K could not see. Text-level insert of one
  line (or a prepended block for files with no frontmatter), so the drift check's body
  comparison and the skill-frontmatter test are unaffected. The Monthly Upkeep re-runs it.
- `scripts/sync-agent-skills.mjs` copies every skill in the org's `ai-automation-tools/agent-skills`
  that `3_Skills` does not hold into the matching category, stamped with `title`, `tags` and an
  `upstream:` block (`match: exact`) so the drift check tracks it from then on. Adds only. The
  Routines fleet runs it Mondays with no Claude session (`Prompt-Library Skills Sync`); 40 skills
  are waiting for the first run.
- The six duplicate pack JSONs under `3_Skills/Development/` are gone: `api/skill-packs.ts` reads
  `3_Skills/packs/` only, and these copies had drifted from the real ones.

**Tooling**
- `check-upstream-drift.mjs` adds a **Library health** table to the Monday issue: per section,
  files, changed in the last 30 days, untagged, and (skills, real agents) without provenance.
- Fleet changes, in the Routines repo: the Library Refresh split into a **Guides Refresh**
  (alternate Tuesdays) and a **Catalog Refresh** (alternate Thursdays) so each lane runs twice a
  month; Add Prompts adds **1 guide** a week beside its 2 prompts; the Monthly Upkeep checks every
  Skill Pack's paths and adds one pack a month, keeps `featured` within per-section caps, and
  keeps the untagged count at zero.

_Touched: `scripts/{backfill-tags,sync-agent-skills,check-upstream-drift}.mjs`, 430 files under
`site/library/`, `site/api/prompt-index.json`, `CLAUDE.md`, `docs/ROADMAP.md`; deleted
`site/library/3_Skills/Development/*-pack.json`._

## 2026-10-21 — Section buttons in the top bar

**UI**
- The six section links are bordered buttons now; the current one fills with its section's hue
  (rose, cyan, violet, amber, emerald, teal) instead of an underline. Each gets its icon from
  1536px up. The Resources menu and the brand wordmark move to the same wide-window gate so the
  bar never overflows beside the categories panel; the ⌘K trigger is icon + keys only.

_Touched: `site/src/index.css`, `site/src/components/{TopBar,ResourcesNav}.tsx`, `docs/ARCHITECTURE.md`._

## 2026-10-21 — Settings dialog with colour palettes

**UI**
- A Settings button (gear) in the top bar, also reachable from ⌘K. The dialog holds Appearance
  (the Light | Dark mode and a colour palette), Local data (clear favourites and recently viewed)
  and the keyboard shortcuts.
- Four palettes on top of the mode: Sky (the org default), Violet, Emerald and Ember, after the
  retired Midnight Violet, Emerald Glass and Carbon Ember themes. Each swaps only the accent (400
  shade dark, 700 light) and in dark tints the ground a hair toward the hue; surfaces, text and
  lines stay the house set. Stored as `my-prompt-library.palette` and applied before first paint.

_Touched: `site/index.html`, `site/src/index.css`, `site/src/hooks/useTheme.ts`,
`site/src/components/{SettingsModal (new),TopBar,CommandPalette}.tsx`, `site/src/App.tsx`,
`CLAUDE.md`, `README.md`, `homepage/index.html`, `docs/ARCHITECTURE.md`._

## 2026-10-21 — The app on the org house style

The app now wears the same chrome as ai-automation-tools.dev (the `web-house-style` skill):
the sections sit in the top bar as nav links with a sliding underline, the categories panel is
the sidebar, and the theme is a Light | Dark pill at the right end of the bar.

**UI**
- Top bar rebuilt as the house document-page bar: categories toggle, the app icon as the brand,
  the six sections as links (a sheet under the bar below 1280px, opened by a menu button), then
  ⌘K, Resources, New prompt and the theme switch. Breadcrumbs moved above the content, shown
  once you are inside a category.
- The 16-theme picker is gone. Dark is the default whatever the OS says; light is opt-in from the
  switch and remembered as `my-prompt-library.theme`, applied in `index.html` before first paint so
  a light-mode reload never flashes dark. The light set is the house light block (sky-700 accent,
  section hues at their 700 shade so text in them passes contrast on white).
- `index.css` carries the full house token set (dark on `:root`, light on `html.light`); every rule
  below the token blocks references tokens only. `themes.css` deleted.
- The constellation canvas and the two drifting glows are gone: one static glow behind the top of
  the page, nothing else lit at rest.
- A footer row at the end of the content (GitHub, Homepage, ai-automation-tools.dev, Cookie
  settings), a skip link, and the phone pass: 16px fields, 36–40px tap targets, no sideways scroll
  at 390px.
- ⌘K keeps a Light / Dark pair under Themes instead of sixteen entries.

_Touched: `site/index.html`, `site/src/index.css`, `site/src/App.tsx`, `site/src/hooks/useTheme.ts`
(new), `site/src/components/{TopBar,Sidebar,ThemeSwitch,Breadcrumbs,CommandPalette,PromptCard,
ResourcesNav}.tsx`, `site/src/components/ui/primitives.tsx`, `site/src/lib/sections.ts`; deleted
`site/src/themes.css`, `site/src/lib/themes.ts`, `ThemePicker.tsx`, `AmbientBackground.tsx`;
`CLAUDE.md`, `README.md`, `homepage/index.html`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`._

## 2026-10-21 — Dev server's HMR socket pinned to 24678

**Tooling**
- `server.ts` runs Vite in middleware mode, which opens its hot-reload WebSocket on a port of its
  own. It was left to Vite's default, so another middleware-mode app on the machine (edge-spectrum)
  could take it first and leave this one without HMR. `site/vite.config.ts` now pins it to `24678`
  explicitly (edge-spectrum moved to `24679`); `DISABLE_HMR=true` still turns it off.

_Touched: `site/vite.config.ts`, `docs/CHANGELOG.md`._

## 2026-10-21 — Neon deleted, Vercel env vars cleared

**Ops**
- The Neon project behind the old accounts is deleted, closing the never-rotated credential that
  had been scrubbed from history. The `my-prompt-library` Vercel project no longer holds
  `DATABASE_URL` or the GitHub-mode variables. Verified on the live demo after the #383 deploy:
  writes return 403, `/api/auth/me` is 404, and the UI has no library switch or sign-in.

_Touched: `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

## 2026-10-21 — Local-first: no accounts, My Library on disk, a read-only demo

The plan changed from a public site where people sign up and keep prompts, to an app people clone
and run themselves. A personal library doesn't need a server-side account, and running signups
meant owning a login system, a database and their security for no benefit to anyone.

**App**
- My Library is now a folder of markdown files, one per prompt, with title, section, category,
  subcategory, tags and dates in frontmatter (`site/lib/my-library.ts`). It defaults to
  `site/my-library/` (gitignored); `MY_LIBRARY_DIR` points it at a synced or git-tracked folder.
  Every My Library route kept its shape, so the UI's create, edit, delete, copy and skill-pack flows
  are unchanged apart from the sign-in prompts disappearing.
- Removed: email/password accounts (bcrypt, cookie sessions, rate limiting, the login and signup
  modals, `AuthContext`), the Neon/Postgres layer and its four tables, and GitHub mode, which the
  Vercel deployment never had switched on. Dependencies `pg`, `bcryptjs`, `cookie-parser`,
  `express-rate-limit` and their types are gone.
- Skill packs: a pack counts as in My Library while any prompt there carries its
  `skill-pack:<id>` tag, so the separate install table went with the database.
- The server listens on `127.0.0.1` (`HOST` overrides), since anyone who can reach it can edit My
  Library, and every write refuses a request whose `Origin` doesn't match its `Host`, so a page on
  another site can't post a form into it. `npm start` now builds and serves `dist/`; it used to run a `dist/server.js` nothing built.
- Read-only mode: `READ_ONLY=true`, or automatically on Vercel. Write routes return 403 and the UI
  hides the library switch, New prompt, Save to My Library and pack add/remove. The demo at
  `my-prompt-library-demo.ai-automation-tools.dev` is now a read-only Public Library browser.

**Tooling**
- `npm run test:my-library` round-trips the file store in a temp folder, checks that ids can't
  name a path outside it and that cross-site writes are refused; CI runs it, and the existing
  `lib/safe-path.test.mjs`. `test:routes` now also fails if an auth router comes back.
- The data-flow diagram swaps the Neon node for the `my-library/` folder, re-pinned to the new code.

**Docs**
- README, CLAUDE.md, SECURITY.md, setup, deployment, API, architecture, UPSTREAMS, the homepage and
  the roadmap describe the local-first app. `docs/features/GITHUB_MODE.md` and
  `docs/development/POSTGRES-MIGRATION-SUMMARY.md` were deleted. The roadmap's Neon items became one:
  delete the database and the dead Vercel env vars (Mike).

_Touched: `site/` (api, lib, server, src, scripts, package files, `.env.example`, `vite.config.ts`),
`.github/workflows/ci.yml`, `.gitignore`, `README.md`, `CLAUDE.md`, `SECURITY.md`, `docs/` (README,
ROADMAP, DIRECTION, UPSTREAMS, ARCHITECTURE, setup, features, skill-packs, diagrams),
`homepage/index.html`, `homepage/diagram/`, `docs/CHANGELOG.md`._

## 2026-10-20 — Quick Start says where to run npm

**Docs**
- The README's Quick Start now states that the app lives in `site/` and every `npm` command runs
  there. Running `npm install` from the repo root from an existing clone did nothing but leave an
  empty `package-lock.json`.

_Touched: `README.md`, `docs/CHANGELOG.md`._

## 2026-10-19 — Two API-lifecycle prompts

Two new original prompts in `site/library/4_Prompts/Development/Api_Design/`, a folder that held one
misfiled debugger prompt.

- **API Breaking Change Review** — classifies each contract difference as breaking, risky or safe from the
  consumer's side, including the silent ones (new nullable fields, new enum values, changed defaults).
- **API Deprecation and Sunset Plan** — a dated retirement plan with `Deprecation`/`Sunset` headers,
  brownouts, and a usage-based go/no-go for shutdown.

`site/api/prompt-index.json` rebuilt to include them.

---

## 2026-10-19 — A code-pinned data-flow diagram on the homepage

**Docs**
- New `docs/diagrams/library-data-flow.json`: an Archify data flow of how library markdown becomes the
  prebuilt index the public API serves, how My Library and skill-pack installs reach Neon, and what the
  React app fetches. Every node cites the code it describes at a pinned commit; `docs/diagrams/README.md`
  is the procedure.

**Site**
- The homepage's "How it works" section embeds the interactive diagram live
  (`homepage/diagram/`, copies the builder writes), in the page's theme.

**Tooling**
- `scripts/build-diagram.mjs` builds it and checks for drift (`--check`); CI's *Diagram drift* step warns
  when cited code changes, and the weekly doc drift check reads `--check` as `prompt-library-diagram`.

_Touched: `docs/diagrams/`, `scripts/build-diagram.mjs`, `homepage/index.html`, `homepage/diagram/`,
`.github/workflows/ci.yml`, `.gitignore`, `README.md`, `docs/README.md`, `CLAUDE.md`, `docs/CHANGELOG.md`._

## 2026-10-19 — The app moves to `my-prompt-library-demo.ai-automation-tools.dev`

The bare host becomes the static homepage in `homepage/`, so everything that names the running app
now points at the `-demo` host.

**App**
- `PUBLIC_SHARE_ORIGIN` in `site/src/App.tsx` is `https://my-prompt-library-demo.ai-automation-tools.dev`,
  so new share links go straight to the app. Old ones still work through the homepage's forwarding.

**Docs**
- README (logo link, View Demo, badge), CLAUDE.md, SECURITY.md, `docs/README.md`, the live-site line in
  `docs/ROADMAP.md`, the `curl` examples in `docs/skill-packs/README.md` and the bug-report template
  name the new host. Changelog history and the done roadmap item keep the old one.

_Touched: `site/src/App.tsx`, `README.md`, `CLAUDE.md`, `SECURITY.md`, `docs/README.md`, `docs/ROADMAP.md`,
`docs/skill-packs/README.md`, `.github/ISSUE_TEMPLATE/bug_report.md`, `docs/CHANGELOG.md`._

## 2026-10-19 — A static homepage in `homepage/`

**Site**
- New top-level `homepage/`: a single-file house-style page (amber accent, the app's own icon
  colour; dark default, Light | Dark switch, source bar, consent script) for
  `my-prompt-library.ai-automation-tools.dev`, with `favicon.svg`, `CNAME` and `.nojekyll`. Its
  "Open the library" button points at the app's new host, `my-prompt-library-demo.ai-automation-tools.dev`.
- Old app links keep working once the bare host serves the homepage: `404.html` forwards any
  non-root path to the app host, and `index.html` forwards a root URL that carries the app's
  share-link query (`library`, `section`, `prompt`, `category`, `subcategory`).
- `.github/workflows/homepage.yml` publishes `homepage/` to GitHub Pages on a push to `main`
  that touches it. The Vercel app (Root Directory `site/`) is unaffected.
- `scripts/homepage.test.mjs` pins the page's required links; CI runs it.

_Touched: `homepage/*`, `.github/workflows/homepage.yml`, `.github/workflows/ci.yml`,
`scripts/homepage.test.mjs`, `CLAUDE.md`, `docs/CHANGELOG.md`._

## 2026-10-19 — Roadmap on the lab standard

**Docs**
- `docs/ROADMAP.md` takes the lab roadmap shape. No existing item is added, dropped or
  re-ticked: the centred header, Now / Next / Then as Phases 1 to 3 (Then is done), a new
  `## 🚦 Public release` checklist (four gates the repo already meets, ticked, and one open:
  a full-history secret scan), and the Later groups, the maintenance cadence and the
  earlier-work summary under `## After public release`. Wrapped items are one line each, the
  strike-through on done items is gone, and the items that need Mike (the Neon rotation, the
  real `DATABASE_URL`, the two "decide" items) carry `🔒 Needs owner`. The `\r\n` in the
  line-endings item, which had been written as a literal line break, is restored.

_Touched: `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

## 2026-10-17 — Provenance for agents, and the last unstamped skill

The weekly drift check now covers the subagent definitions in `2_Agents`, not just skills.

**Agents**
- `scripts/attribute-upstream.mjs --agents` runs the same body / prefix / shingle / name matching
  over `2_Agents` files with `name:` frontmatter, against clones of VoltAgent/awesome-claude-code-subagents,
  github/awesome-copilot, wshobson/agents and davila7/claude-code-templates. The last of those
  re-ships most of the others' agents, so it is consulted last and only credited where it is the
  sole source. Each mode reads and stamps only its own section.
- All 86 agent definitions are stamped: **71 `exact`** (36 VoltAgent, 17 awesome-copilot, 16
  claude-code-templates, 2 wshobson), **6 `similar`** by name (claude-code-templates has since
  rewritten them), **9 `unknown`** (no public source; ours). The 460 role-play prompts are untouched.

**Drift tooling**
- `check-upstream-drift.mjs` walks `2_Agents` too and resolves an agent by file name (`x.md`,
  `x.agent.md`) where a skill resolves by directory. Agent rows keep their `2_Agents/` prefix.
- `resync-upstream.mjs` accepts those `2_Agents/….md` paths (local frontmatter, upstream body,
  no support files), and now also accepts a skill path ending in `/SKILL.md`, which is how the
  report prints skills.
- `upstream.test.mjs` checks the `match:` vocabulary across agents as well as skills (409 stamped files).

**Skills**
- `Data/scholar-evaluation` was the one skill with no `upstream:` block. Stamped `similar` to
  K-Dense-AI/claude-scientific-skills, which has since rewritten it.

First combined drift run: 171 checked, 163 current, 7 `behind` (`scholar-evaluation` and six
agents: `task-decomposition-expert`, `hackathon-ai-strategist`, `model-evaluator`,
`llms-maintainer`, `ai-ethics-advisor`, `computer-vision-engineer`), 1 `drifted`
(`x-twitter-scraper`, 1%). None were resynced here; that is the drift job's call.

_Touched: `scripts/attribute-upstream.mjs`, `scripts/check-upstream-drift.mjs`,
`scripts/resync-upstream.mjs`, `scripts/upstream.test.mjs`, 86 files under `site/library/2_Agents/`,
`site/library/3_Skills/Data/scholar-evaluation/SKILL.md`, `site/api/prompt-index.json`,
`docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/README.md`, `docs/CHANGELOG.md`._

---

## 2026-10-14 — `prompts.mikesailab.com` decommissioned

The org domain is now the only home. Share links (`PUBLIC_SHARE_ORIGIN` in `src/App.tsx`) point
at `my-prompt-library.ai-automation-tools.dev`, and the old `prompts.mikesailab.com` and `prompts.ax-platform.com` hosts are
detached from the Vercel project.

_Touched: `site/src/App.tsx`, `CLAUDE.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/bug_report.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-10-13 — Library refresh — guides

First guides pass. Nine guides under `site/library/1_Guides/` read against the vendors' own
docs and corrected; each gets `checked: 2026-10-13`. Two duplicate stubs merged away.

- **`Claude_Code/flags-reference.md`**, **`slash-commands.md`**, **`claude_code_cli_guide.md`** →
  code.claude.com/docs/en/cli-reference, `/commands`, `/setup`, `/permission-modes`. Added the
  new commands and flags (`--bg`, `--bare`, `--safe-mode`, `claude attach|logs|stop|doctor|install`,
  `/goal`, `/background`, `/subtask`, `/cd` …), the full permission-mode list (`auto`, `dontAsk`),
  `--effort` levels, `--cloud` (`--remote` deprecated). Removed the false `--api-key` flag and
  `/pr-comments`, `/vim` (removed upstream). The CLI guide wrongly called npm install deprecated;
  it is a supported method, so all install routes are now listed.
- **`Codex/flags-reference.md`**, **`slash-commands.md`** → github.com/openai/codex and the Codex
  CLI command reference (now at learn.chatgpt.com/docs/developer-commands). New install
  commands, `codex update|review|fork|login|doctor|sandbox`, `--sandbox`, `--ask-for-approval`,
  `--yolo`, `--oss`, `-c`. Dropped the retired `gpt-5.x` model list (no default is stated) and the
  `GEMINI_CLI=1` line that had been pasted into the Codex pages. **Slash-command list not
  re-verified:** the official slash page redirects to a page that does not list them; a note says so.
- **`Gemini_CLI/flags-reference.md`** → github.com/google-gemini/gemini-cli `docs/cli/cli-reference.md`.
  The page had no CLI-flag section; added the full options table, subcommands and model aliases
  (`auto`, `pro`, `flash`, `flash-lite`); removed the unsupported `gemini auth login` and the
  retired model list; `/memory refresh` → `/memory reload`.
- **`API_Providers/anthropic_api_guide.md`** → platform.claude.com models overview. Model IDs now
  `claude-fable-5-1`, `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`; 1M context,
  128K output, adaptive thinking and `effort`. **Merged** `anthropic-api-guide.md` (a 370-byte
  stub) into it and deleted the stub.
- **`API_Providers/openai_api_guide.md`**, **`openai-api-best-practices.md`** → developers.openai.com/api/docs/models.
  `gpt-5.6-sol` (not a listed model) → `gpt-6.1-sol` / `gpt-6-astra` / `gpt-6-luna`, 1.05M context,
  Responses API. **Merged** `openai-api-guide.md` (stub) into `openai_api_guide.md` and deleted it.

Not touched: `docs/features/API.md` still uses the deleted `anthropic-api-guide.md` path as an
example id (outside this job's scope). Remaining unchecked guides are for the next guides pass.
Counts in `1_Guides/README.md` are unchanged.

_Touched: the nine guides above, two deleted stubs, `site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-10-13 — Phone polish

An audit at 390×844 found no horizontal overflow (the sidebar is already a drawer), so the
fixes are small and scoped to phones or touch, leaving desktop untouched.

- Form fields render at 16px below `md`, so iOS Safari no longer zooms the page when the
  search, category filter, palette or login/signup fields are focused (they were 12.5–15px).
- Touch targets below `md`: icon buttons get a 36px minimum (card actions were 28px),
  `.btn-sm` and the segmented control go from 30px to 36px, and the source-bar link fills
  the bar's height.
- The app shell uses `100dvh` after `100vh`, so the bottom of the layout isn't hidden
  under mobile browser toolbars. On desktop `dvh` equals `vh`.
- Card actions stay visible on touch tablets: `md+` with `hover: none` used to hide them
  behind a hover that can't happen.

_Touched: `site/src/index.css`, `site/src/App.tsx`, `site/src/components/PromptCard.tsx`,
`docs/CHANGELOG.md`._

---

## 2026-10-12 — Three skills resynced; drift report clean (#339)

The 2026-10-12 drift comment on #339 listed `brainstorming` as `behind` and `claude-api` as
`drifted`; `x-twitter-scraper` had moved again upstream by the time they were fixed. All three
resynced with `scripts/resync-upstream.mjs`; local frontmatter (title, tags, category) kept.

- **`Content/brainstorming`** → `obra/superpowers` @ `bb92a77`. Upstream rewrote the skill
  since the 2026-10-05 sync (97% of its lines new). `spec-document-reviewer-prompt.md` is gone
  upstream and was pruned; `builder-check-prompt.md` is new.
- **`Development/API/claude-api`** → `anthropics/skills` @ `dbd4588`, 96 files. Four new
  Managed Agents quickstarts (`bug-hunter`, `explainer-video-maker`, `performance-tuner`,
  `watchlist-scanner`) plus updates across `shared/` and the language folders.
- **`Business/Marketing/x-twitter-scraper`** → `xquik-dev/x-twitter-scraper` @ `ef87f44`.

Scanned the incoming files for email addresses and case collisions: none. A fresh run of
`check-upstream-drift.mjs` reports **93 of 93 tracked skills `current`**. Index rebuilt.

_Touched: the three skill folders under `site/library/3_Skills/`, `site/api/prompt-index.json`,
`docs/CHANGELOG.md`._

---

## 2026-10-12 — Dependabot alerts: two patched, one not reachable

- **`proxy-addr` 2.0.7 → 2.0.8** (critical, IP spoofing via IPv4-mapped IPv6 trust subnets;
  via `express`) and **`source-map-js` 1.2.1 → 1.2.2** (high, event-loop DoS; via
  `@tailwindcss/node` and `postcss`). Lockfile-only `npm update`, no range changes. The app
  sets `trust proxy` to a hop count, not a subnet, so the spoofing path was not open here.
- **`sprintf-js` (moderate) has no fixed release.** It arrives through `gray-matter` →
  `js-yaml@3` → `argparse@1`, and `argparse` is required only by js-yaml's CLI entry
  (`bin/js-yaml.js`), which the app never loads. Alert dismissed as *vulnerable code not used*.
- **ROADMAP:** queued *Record provenance for the untracked skills and the real agent
  definitions*, so the weekly drift check covers all of `3_Skills` and the installable part
  of `2_Agents`.

_Touched: `site/package-lock.json`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-10-12 — Live on `my-prompt-library.ai-automation-tools.dev`

The app joins the org domain, following the `<repo-name>.ai-automation-tools.dev` convention.
The Vercel project now carries both hosts; `prompts.mikesailab.com` still serves the same
deployment (no redirect yet).

- **Source bar** (`src/components/SourceBar.tsx`, `.src-bar` in `index.css`): the org-wide
  34px strip across the very top with **View source**, required on every site on the domain.
  Built from the theme tokens, so all 16 themes pick it up.
- **Consent gate**: `index.html` loads the shared `https://ai-automation-tools.dev/consent.js`.
  Nothing here tracks anyone; the gate is there for the day something does.
- README, docs, SECURITY and the bug template point at the new host.

_Touched: `site/index.html`, `site/src/App.tsx`, `site/src/index.css`,
`site/src/components/SourceBar.tsx`, `README.md`, `CLAUDE.md`, `SECURITY.md`, `docs/README.md`,
`docs/ROADMAP.md`, `docs/skill-packs/README.md`, `.github/ISSUE_TEMPLATE/bug_report.md`,
`docs/CHANGELOG.md`._

---

## 2026-10-12 — Two new prompts in thin folders

- **Zero-Based Budget Rebuild** (`4_Prompts/Finance/Budgets/zero-based-budget-rebuild.md`):
  rebuilds a budget from drivers instead of last year's number, classifies lines as
  committed, driven or discretionary, and ranks discretionary spend against a target.
- **Access Recertification Campaign Planner**
  (`4_Prompts/IT_Security/Governance/access-recertification-campaign.md`): plans a user-access
  review with risk tiers, reviewer packets, escalation defaults and audit evidence.

`api/prompt-index.json` rebuilt (3,202 prompts).

---

## 2026-10-10 — `x-twitter-scraper` resynced after another upstream rewrite

The newest drift comment on issue #339 (2026-10-05) listed two `behind` skills,
`x-twitter-scraper` and `timesfm-forecasting`. Both had already been resynced in #358 later
that same day, after the check ran. Re-running `resync-upstream.mjs` on them today:

- **`timesfm-forecasting`**: body and all 21 files identical to upstream @ `92ace75`. Only the
  `checked:` date would have moved, so nothing was committed.
- **`x-twitter-scraper`**: `xquik-dev/x-twitter-scraper` rewrote it again after #358
  (`6790d40` → `588529e`). `SKILL.md` is now organised into Request contract / Capabilities /
  Inputs / Outputs / Prices and limits / Consent rules tables, and a new **AI analysis**
  route family (sentiment, brand, news, market signals, viral score, classify, at 2 credits
  per post) was added to `references/reads.md` and the pricing table. `extractions.md` and
  `writes.md` were restructured into tables. Same skill, same scope, so it stays in
  `Business/Marketing`. `name`, `description` and the rest of the local frontmatter are
  unchanged; only `upstream.ref` and `upstream.checked` moved.

Scanned the incoming files for email addresses and CRLF line endings: none. The index rebuild
changed one entry's `lastModified` and the `buildTime`, nothing else.

_Touched: `site/library/3_Skills/Business/Marketing/x-twitter-scraper/` (SKILL.md,
`references/compare-faq.md`, `extractions.md`, `reads.md`, `writes.md`),
`site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-10-09 — Upstream check

First pass over `UPSTREAMS.md`. Nothing the code depends on has been removed or deprecated.
`UPSTREAMS.md` described the wrong fonts (Outfit / DM Sans via CSS `@import`); the app loads
Inter and JetBrains Mono through `<link>` tags in `index.html`, and the row says so now.
Node 22 reaches end of life on 2027-04-30; moving to 24 is queued on the roadmap.

## 2026-10-05 — UI redesign

The React app was rebuilt onto the org design vocabulary that ai-automation-tools.dev and the
other sites share, so the library reads as a sibling of them. Routing, data fetching, the
hooks and the API are untouched; the change is `src/index.css`, `src/themes.css`,
`index.html` and every component.

- **Tokens.** `#060606` ground with a 24px dot grid, zinc surfaces, sky-400 accent, Inter for
  text and JetBrains Mono for eyebrows / tags / keys, 12/8/6px radii. Every colour is a custom
  property on `:root`; the 16 themes are `:root[data-theme]` overrides of those properties and
  nothing else (`themes.css` was regenerated onto the new names). The theme now persists in
  `localStorage` and is applied before first paint.
- **Per-section accent.** Each section has a hue (prompts rose, agents cyan, guides violet,
  system prompts amber, skills emerald, skill packs teal — the per-tool accents on the org
  landing page), exposed as `--c` from `data-section` on `<html>`. Cards, glyphs, tonal
  buttons and the hero title tint from it; themes other than the default and Light collapse it
  to their own accent so a monochrome theme stays monochrome.
- **Navigation.** The sidebar's `<select>` of sections is a proper nav list with icons, live
  counts and an animated active indicator; the category tree gained a filter box. The top bar
  carries breadcrumbs, a ⌘K search trigger, one Resources mega-menu (replacing five pill
  dropdowns), "New prompt" and an account menu. New **command palette** (⌘K / Ctrl+K)
  searches every loaded prompt, jumps between sections, creates a prompt and switches theme
  from the keyboard.
- **Cards.** Spotlight cards (cursor-tracked ring and wash in `--c`), a plain-text blurb
  instead of raw markdown, shimmer skeletons while previews load, and an action row that
  reveals on hover (always visible on touch). Stagger-in on mount.
- **Visuals.** An ambient constellation canvas tinted by the tokens sits behind the app
  (pauses when hidden, static under `prefers-reduced-motion`); the hero counters count up.
- **Everything else** restyled onto the tokens: hero, toolbar (sort is a menu, tags filterable),
  detail page (metadata rail, word count, grouped actions), Skill Packs (was on raw `gray-*`
  classes that ignored the theme), modals on one shared shell, toasts with a progress bar,
  empty states. My Library → Skill Packs while signed out shows the sign-in state instead
  of a 401.

## 2026-10-05 — Documentation refresh

A sweep of `docs/` and the root README for anything the last two months of changes had left
behind. No code.

- **Setup and deployment** still said `cd my-prompt-library && npm install` and "create
  `.env` in the project root". Both now say `site/`, and `DEPLOYMENT.md` names the Vercel
  Root Directory, production branch and what `vercel-build` does. A leftover `~/.openclaw/…`
  path in the deploy and debug guides is gone. Node prerequisite 18+ → 22 (what CI pins).
- **API reference** documents the login/signup rate limits, the input rules and the new 400 /
  429 responses, and its sample `id` / `section` values are the numbered folders
  (`2_Agents`, `4_Prompts`) instead of the pre-rename `library/Agents/…`, `Prompt_Library`,
  `Agent_Instructions`.
- **Templates, contributing guide, skill-pack guides, debug guide** — every `library/Skills/`,
  `library/Agents/`, `library/Prompt_Library/`, `library/Agent_Guides/` path and section
  example moved to the numbered layout.
- **Architecture** lists `middleware/rate-limit.ts`, and its security section no longer
  says "no authentication on API endpoints" with rate limiting as a future idea; it describes
  what is actually there (session-gated writes, `sameSite=lax` as the CSRF stand-in, limiters,
  `helmet`, `trust proxy`).
- **Library-mode design doc** carries a note that its Phase 2 filesystem `My_Prompts/` plan
  was superseded by Postgres.
- **docs/README** links the new root policy files (LICENSE, NOTICE, SECURITY, CODE_OF_CONDUCT,
  CONTRIBUTING) and its status paragraph is current. **ROADMAP** snapshot's Security row and
  **UPSTREAMS** framework table include the two new auth dependencies. Root README structure
  and endpoint list match.

Left alone on purpose: `DIRECTION.md` (dated narrative), `FEATURED-PROMPTS.md` (content
tracking, last updated 2026-03-25), the audit reports, and `category:` frontmatter examples
such as `"Agent_Guides"`, which the `1_Guides` files really do still use.

## 2026-10-05 — Auth abuse controls, community files, branch prune, drift resync

Second pass of the same pre-publicity sweep.

**Auth.** `site/routes/auth.ts` accepted any string as an email and any 6+ characters as a
password, with no limit on how often a client could try. Now:

- `POST /api/auth/login` is limited to 20 attempts per IP per 15 minutes (successes don't
  count); `POST /api/auth/signup` to 5 per IP per 15 minutes. `express-rate-limit`, in-memory
  store, so on Vercel the count is per warm function instance. `app.set('trust proxy', 1)`
  makes `req.ip` the client behind Vercel's proxy instead of the proxy itself.
- Signup validates email shape (one `@`, no whitespace, ≤254 chars), requires 8–72 character
  passwords (72 because bcrypt silently ignores the rest), and caps `name` at 100. Login checks
  shape and the 72 cap only, so accounts created under the old 6-char rule still sign in. The
  signup modal's client-side minimum moved to 8 to match.
- `PUT /api/auth/me` rejects non-string or oversized `name` / `avatar_url`.
- `helmet` with CSP and HSTS off (Vite's inline preloads and Google Fonts would break under a
  default CSP; Vercel sets HSTS at the edge). JSON bodies capped at 1 MB.

Verified against the dev server: bad email and short password return 400 with the right
message; the 21st failed login in a window returns 429; `X-Powered-By` is gone and the
nosniff / frame / referrer headers are present.

**Community files.** Root `SECURITY.md`, `CODE_OF_CONDUCT.md`, a short `CONTRIBUTING.md`
that points at the full guide in `docs/`, `.github/PULL_REQUEST_TEMPLATE.md`, and
`bug_report` / `content_issue` issue templates with a config that routes security reports
to private advisories.

**Branches.** 19 merged remote branches deleted (see the roadmap entry for the exact list
and the three kept on purpose).

**Drift.** Today's drift run had 2 `behind` and 3 `drifted`. Resynced all five:
`x-twitter-scraper` (upstream dropped 63 reference files; we followed), `timesfm-forecasting`
(upstream deleted the generated `examples/*/output/` artifacts), `claude-api` (92 files from
Anthropic's current tree), `brainstorming` and `matlab`. **All 93 tracked skills are current
again.** The check needs `GITHUB_TOKEN` to run locally; anonymously it rate-limits at 60
requests and reports every skill as `error`.

`api/prompt-index.json` rebuilt. `npm run lint`, `test:routes`, `upstream.test.mjs` and
`skill-frontmatter.test.mjs` all pass.

**Still open:** the Neon password rotation and `DELETE FROM user_sessions;` need the Neon
console and are not something this pass could do.

## 2026-10-05 — Redact published contacts and sample credentials; add LICENSE

A pre-publicity pass over the library found two things a public repo should not carry.

- **Three teammates' email addresses, including personal gmail and yahoo accounts,** were
  listed as notification recipients in `2_Agents/Platform_Agents/Financial/market-agent.md`,
  `2_Agents/Platform_Agents/Ax-Platform_Dev/ax-platform-developer.md` and
  `3_Skills/Finance/Portfolio_Management/financial-analysis/SKILL.md`, and served on the live
  site. Replaced with `<recipient-N@your-org.example>` placeholders and a note not to commit
  real addresses.
- **Three Neon connection strings with embedded passwords** in the vendored `using-neon`
  skill's REST API reference (`branches.md`, `projects.md`). They are Neon's own doc samples,
  not live credentials, but they match every secret scanner's pattern and have been in history
  since the first import. Passwords replaced with `npg_REDACTED_EXAMPLE` in all six places.
  History was not rewritten.
- **`LICENSE` did not exist.** The README had claimed Apache 2.0 since the start, but without
  the file the code was all-rights-reserved by default. Added the Apache 2.0 text at the repo
  root, plus a `NOTICE` explaining that vendored skills under `site/library/` carry their own
  licenses (Apache-2.0 and MIT, each next to its `SKILL.md`) and that the Awesome ChatGPT prompts
  are CC0. The README license section now says the same.

`api/prompt-index.json` rebuilt: only the five touched entries' `lastModified` changed.

## 2026-10-04 — An upstream worklist for the app

`docs/UPSTREAMS.md` lists what the app assumes about Neon and `pg`, the GitHub REST API (GitHub
mode), Google Fonts, Vercel, Node and the framework majors, with the official page to check
each against. A biweekly **Prompt-Library Upstream Check** routine works from it and opens an
`upstream/auto-*` PR only when something outside the repo changed. The vendored library content
is out of its scope: `upstream-drift.yml` already covers that.

## 2026-10-03 — URL routing state moves out of `App.tsx`

The last big block of state in the shell was navigation: the section tab, category,
subcategory and `?prompt=` deep link, each seeded from the query string, re-read on
back/forward, and written back on every change. It now lives in `src/hooks/useLibraryRoute.ts`.
No behaviour change intended.

**What changed:**

- **`useLibraryRoute`** owns `activeTab`, `activeCategory`, `activeSubcategory` and
  `promptPathParam`, the `popstate` listener and the `replaceState` write-back. It takes
  `selectedPrompt` and the `setSelectedPrompt` / `setLibraryMode` setters, because back/forward
  can clear the open prompt and switch library.
- **One section parser.** `?section=` was decoded by two hand-written if-chains, the initial
  state and the popstate handler, and they had drifted before (`skill-packs` was missing from
  one, so a refresh on Skill Packs landed on Prompts). Both now call one `parseSection` over a
  single tab list, and the write-back sets `section` to the tab id directly instead of through a
  ternary that mapped every value to itself.
- **Stays in `App.tsx`:** `libraryMode` (own localStorage persistence), resolving a `?prompt=`
  path to a prompt (needs the loaded listing and `handlePromptClick`), and the explicit
  `pushState` in "show all".
- `App.tsx` 1,083 → **996 lines**, 23 → 19 `useState` hooks.

**Verified with:** `npm run lint`, `npm run test:routes` and `npm run build`, all clean. On the
dev server (no database): a `?prompt=` deep link to a skill opened it and filled in
`section=skills&category=AI_ML`; browser back and forward between it and a System Prompts URL
restored each view; an unknown `section` fell back to Prompts; `section=skill-packs` loaded on
Skill Packs.

_Touched: `site/src/hooks/useLibraryRoute.ts` (new), `site/src/App.tsx`, `CLAUDE.md`,
`docs/ARCHITECTURE.md`, `docs/DIRECTION.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-09-28 — Rebuilding the prompt index no longer rewrites it

`lastModified` in `api/prompt-index.json` is each file's mtime, and a checkout stamps every
file's mtime with the checkout time. So any `npm run build` or `npm run build:index` on a
fresh clone rewrote `lastModified` for all 3,200 prompts, plus `buildTime` — a whole-file diff
on a library nobody had touched, and every prompt claiming it changed today. The last three
content PRs each put the committed timestamps back by hand. The roadmap item offered two
fixes, and both were wrong for this: a pre-commit rebuild would *produce* that churn on every
commit, and not committing the index would take the CI freshness gate with it.

**What changed:**

- **`build-prompt-index.js` carries timestamps forward.** Before writing, it reads the
  previous index. An entry keeps its old `lastModified` when every other field is unchanged
  *and* its file has no uncommitted edits (`git diff HEAD`, run inside `library/`). The git
  check is what catches an edit below the 200-character preview, which changes no field of the
  entry. `buildTime` is kept too when the whole prompt list comes out identical. Rebuilding an
  untouched library now leaves the file byte-identical — on a fresh worktree, on CI, on Vercel.
  Without git the check falls back to the metadata comparison alone.
- **The CI gate compares the whole file.** It used to strip `buildTime` and `lastModified`
  with `jq` because they could not match on a fresh checkout. They can now, so the step is a
  plain `git diff --exit-code` after the rebuild.

**Behaviour change on the live site.** Vercel's `vercel-build` rebuilds the index from a clean
checkout, so production now serves the committed `lastModified` values instead of the deploy
time. Newest/Oldest sort, and the featured row's fallback in a section with no `featured` tags,
will order by when each entry was last rebuilt with a real change rather than by checkout order.
It is still an mtime, not a content fact — that is the *Surface freshness* item.

**Verified with:** `npm run lint`, `npm run test:routes` and `npm run build` (all clean), and
`git status` after the build showing the index untouched in a fresh worktree. A body-only edit
below the preview changes exactly that entry's `lastModified` and `buildTime`; a title edit
with git unavailable (`GIT_DIR` pointed nowhere) still changes that entry and nothing else.

_Touched: `site/scripts/build-prompt-index.js`, `.github/workflows/ci.yml`, `CLAUDE.md`,
`docs/ARCHITECTURE.md`, `docs/DIRECTION.md`, `docs/features/API.md`, `docs/ROADMAP.md`,
`docs/CHANGELOG.md`._

---

## 2026-09-27 — `executing-plans` resynced after upstream rewrote it

The 2026-09-21 drift check (issue #339) listed one `behind` skill:
`3_Skills/Content/executing-plans`, 99% missing — 323 local words against 3,311 upstream.
It was `current` when resynced on 2026-09-08; `obra/superpowers` has since rewritten the skill
from a short load-review-execute checklist into a full inline-execution procedure (task loop,
completion contract, ledgered "rulings", one whole-branch review at the end).

**What landed:**

- **`SKILL.md` body** replaced with upstream @ `8ca22db`, and the `upstream:` block restamped.
  `name` and `description` are unchanged, and the skill still sits under `Content/` — it is
  the same skill, grown, not a different one.
- **`scripts/task-start` and `scripts/task-done`** are new, mirrored from upstream (LF, 80
  lines between them).

**One caveat, inherited from upstream.** `task-start` shells out to
`../../subagent-driven-development/scripts/task-brief`, a sibling superpowers skill this
library does not carry. The scripts are shipped as upstream wrote them and will not run
standalone; the old body already leaned on `superpowers:*` siblings the same way, so this is
the existing shape rather than a new break.

**The index without the churn.** A fresh worktree stamps every file's mtime at checkout, so
the rebuild rewrote `lastModified` for all 3,200 prompts. Every entry whose content was
otherwise identical got its committed `lastModified` back, leaving a three-line index diff:
`buildTime` and the one entry's `contentPreview` and `lastModified`. Newest/Oldest sort is
untouched for everything else.

**Verified with:** `npm run build:index` (3,200 prompts, no `[WARN] Failed to parse
frontmatter`), `npm run lint` (clean), `npm run test:routes` (8 routes present),
`npm run build` (clean). Against `npm run dev`: the public listing returns 3,200, the skill
is listed under `Content`, and `GET /api/prompts/:id` serves the new body.

_Touched: `site/library/3_Skills/Content/executing-plans/` (SKILL.md, 2 new scripts),
`site/api/prompt-index.json`, `docs/CHANGELOG.md`._

---

## 2026-09-19 — The long-tail pass, and two starving categories it could feed

`docs/ROADMAP.md` asked for four long-tail topics — Data Science, Blockchain/Web3, Design,
industry verticals — and carried a note underneath saying `4_Prompts/Development` had one
file and `4_Prompts/Data` had two, making them the thinnest categories in the section by a
wide margin. Those two facts answer each other, so three of the four topics went into a
category that already existed and was empty rather than into a new one. 58 new prompts,
library **3,142 → 3,200**.

**What landed:**

- **Data Science — `4_Prompts/Data`, 2 → 20.** Four new subfolders. `Analysis` (EDA plan,
  analytical SQL reviewer, cohort retention, A/B test interpreter, metric definition writer),
  `Data_Engineering` (dbt model reviewer, data quality checks, pipeline postmortem, schema
  migration), `Machine_Learning` (feature engineering with the leakage question up front,
  model evaluation, model card, training data audit, baseline selection),
  `Visualization` (chart type selection, dashboard spec, executive narrative, accessible
  chart review).
- **Blockchain/Web3 — `4_Prompts/Development/Blockchain`, 12 new, category 1 → 13.** Contract
  security review, gas optimization, ERC-20 and ERC-721 specs, a Foundry test suite generator,
  upgradeable proxy review, wallet integration, subgraph schema, DAO proposal drafting,
  tokenomics review, bridge and oracle risk, on-chain forensics.
- **Design — `4_Prompts/Design`, new, 16.** `UX_Research` (interview guide, usability test
  plan, synthesis, jobs-to-be-done analysis), `UI_Design` (wireframe spec, critique
  facilitation, empty-state and error copy, responsive layout), `Design_Systems` (token
  naming, component API, contribution review, iconography), `Accessibility` (WCAG audit,
  screen reader flow, contrast remediation, form review).
- **Industry verticals — `Domain_Specific`, 12 new, 63 → 75.** `Real_Estate` (listing copy
  with fair-housing constraints, CMA, lease abstract, investment underwriting, tenant notices,
  acquisition diligence) and `Manufacturing` (8D root cause, SOP writing, supplier audit,
  preventive maintenance, SMED changeover, incident and near-miss reporting), 6 each.

**Two placement calls worth recording.**

**Blockchain went under `Development`, not `Engineering`.** `Engineering` is the crowded
general software category — 88 files, and it already carries the same `ethereum-developer`
role-play under three different paths. Filing twelve specialist web3 prompts there would have
deepened a duplication problem the roadmap tracks separately, and would have left
`Development` sitting at the one file the item complained about. `Development` had no
identity to protect; it has one now.

**`Design` is the one new top-level category, and it was not avoidable.** The previous content
pass made a point of adding nothing top-level, and that was right then, because every topic had
an existing home. This one does not: `Media/` is imagery and social, `Engineering/` holds two
stray design files (`website-design-consultant`, `ux_ui_developer`), and nothing in
`4_Prompts` covered product design. `3_Skills` already has a `Design` category, so the name
is the library's own vocabulary rather than an invention.

**House style, not the bulk-file template.** Every file names its inputs, states what the model
must *not* infer, and ends with an output format, `Related Prompts` and `Reputable Sources` —
the `Domain_Specific/Legal` shape, not the "provide a step-by-step implementation plan"
filler the older `Business/` files share. Disclaimers are on the files where getting it wrong
has a legal, financial or physical consequence: the Blockchain prompts that touch value at
risk, all six Real_Estate files, and the Manufacturing safety ones. Several prompts carry a
refusal built in — the listing writer enumerates the fair-housing phrasings it will not
produce and says why; the incident report forbids "operator error" as a finding and
"retrain the operator" as a sole corrective action.

**No `featured` tags,** for the same reason as last time: the featured row filters section-wide
and sorts on `lastModified`, so 58 new files would have taken it over.

**Left alone deliberately:** `4_Prompts/Development/Api_Design/python-debugger.md`, a
four-line stub that is now one file in a thirteen-file category. Rewriting it is a different
job from filling a category, and it is not what the roadmap item asked for.

**Verified with:** `npm run lint` (clean), `npm run test:routes` (8 routes present),
`npm run build` (clean; the one esbuild CSS warning is pre-existing and unrelated, and chunk
sizes are unchanged). `npm run build:index` reported 3,200 prompts with **no
`[WARN] Failed to parse frontmatter`** — a malformed block silently drops a file from the
library, so that warning line is the real test for content work. All 58 files are LF and
lowercase-pathed, and a link check confirmed all 58 `Related Prompts` cross-links resolve to
files that exist. Against `npm run dev` on the read-only public library: the listing returns
3,200 with all 58 new files present at the right `category`/`subcategory`, and with `content`
still empty for every one of them — the 2026-09-08 guarantee holds for the new files too;
`POST /api/prompts/previews` returned real blurbs for a Blockchain and a Manufacturing file;
and `GET /api/prompts/:id` returned the full 2,600-byte body for a new Design file.

**Not verified:** how the new `Design` top-level category renders in the sidebar and category
tree. That list is built client-side from the index, which is correct and was checked in the
API response, but nothing here exercised the UI — that needs a browser or a Vercel preview.

**The index diff is large and mostly noise,** as on the last content pass. `lastModified` comes
from filesystem mtime and this was built in a fresh worktree, so rebuilding restamped all 3,142
pre-existing entries; roughly 3,140 of the changed lines are that churn and the real change is
the 58 new entries. CI strips `lastModified` before comparing, so the freshness gate is
unaffected.

_Touched: `site/library/4_Prompts/` (58 new files), `site/api/prompt-index.json`,
`docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/features/API.md`._

---

## 2026-09-16 — The drift report was ranking rewrites as perfect matches

The roadmap said the `behind` tier had been empty since 2026-08-27 and the worst remaining drift
was 21%. Both numbers came from the same broken measurement.

`check-upstream-drift.mjs` reported a `missing` column computed as
`max(0, 1 - local_words / upstream_words)`. That clamp is the bug. It only measures *shortfall*,
so it reads 0% for any skill where the local copy is the larger file — and "the local copy is
larger" is exactly what an upstream rewrite into tighter prose looks like. The files that had
rotted furthest sorted to the bottom of the table looking perfect.
`Finance/Investing/trading-operations/skills/counterparty-risk` sat at **0% missing** with a
local body four times upstream's length and not a single section in common: upstream had
reorganized it into three named workflows (assessing a counterparty, responding to credit
deterioration, executing a close-out) while the local copy still carried the old flat
`Purpose`/`Layer`/`Direction` prose. `Content/xlsx` was worse than drifted — it had two `# ` H1s,
two concatenated documents in one file, and the report called it a 0% match.

**The fix, then the backlog.** The checker now compares normalized non-empty lines in both
directions and reports two numbers instead of one: `missing` (upstream lines this copy does not
have — a resync candidate) and `extra` (local lines upstream does not have — curation a resync
would destroy). The `behind` verdict comes from `missing >= 25%`, not from a size ratio. On the
corrected ranking:

| | before the fix | after the fix |
|:---|---:|---:|
| `behind` | 0 | **9** (28–96% missing) |
| `drifted` | 46 | 37 |
| `current` | 47 | 47 |

**Then all 46 were resynced, in three passes.** The nine `behind` first. Then the 26
`joellewis/finance_skills` skills, which turned out to be one upstream pass applied uniformly —
the `Purpose`/`Layer`/`Direction`/`When to Use` preamble dropped (that information now lives in
`description:`) in favour of `Worked Examples`, `Common Pitfalls` and `Cross-References` — so
they were brought to a single sha (`5c498ea`) rather than decided one at a time. Then the last
11 individually. **All 93 tracked skills are now byte-identical to their upstreams**; `behind`
and `drifted` are both empty for the first time on a measurement that can actually see a
rewrite.

**Three calls worth recording, because each one nearly went the other way:**

- **`frontend-design` was resynced with `--keep-extra`.** A plain resync would have pruned its
  `LICENSE.txt`, which upstream does not ship. Deleting a license file from a vendored copy is
  not a freshness decision.
- **`timesfm-forecasting` looked like it would lose 2,000 words** — upstream had collapsed four
  sections (output/config, workflows, performance tuning, examples and validation) into a
  four-line list. It had moved them into `references/`, which the resync mirrors, so nothing was
  lost. Worth checking rather than assuming; the reverse case is real.
- **`docx` and `xlsx` reported 55 and 5 stale files.** Upstream had moved `ooxml/schemas/` to
  `scripts/office/schemas/` and `scripts/validation/` to `scripts/office/validators/`. A move,
  not a deletion. `xlsx`'s `recalc.py` moved to `scripts/recalc.py`, which is where its new
  SKILL.md points.

**Two things fell out of it.**

`Data/timesfm-forecasting` had four **Git LFS pointer files** vendored as content — 131-byte
text stubs reading `version https://git-lfs.github.com/spec/v1` where a PNG and a GIF should be.
The resync fetched the real bytes (verified against the `size` the pointers themselves declared),
so the skill's example images work now. A sweep confirms zero LFS pointers remain anywhere under
`library/`.

`npm run lint` broke, because the resync pulled a vendored `.ts` sample
(`together-gpu-clusters/scripts/manage_cluster.ts`) into the app's typecheck, which failed on a
`together-ai` import the app does not depend on. `tsconfig.json` already carried two hand-added
per-skill excludes for exactly this, which is the wrong shape — every new vendored `.ts` breaks
CI until someone appends a line. Replaced with `library/**/*`. Nothing in `src/`, `api/`,
`server.ts`, `routes/`, `middleware/` or `db/` imports from `library/`; it is read as data at
runtime, so the app's typechecker has no business in it.

**Verified with:** `npm run lint` (clean), `npm run test:routes` (8 routes),
`scripts/upstream.test.mjs` (322 stamped files, vocabulary intact),
`scripts/skill-frontmatter.test.mjs` (323 files parse, names match directories), `npm run build`
(clean, chunk sizes unchanged). `npm run build:index` rebuilt at the same **3,142** prompts with
no `[WARN] Failed to parse frontmatter`. A link check across all 46 touched skills resolved every
relative path in their `SKILL.md` — 0 unresolved. Every rewritten text file is LF; the four
binaries are byte-identical to upstream and `.gitattributes` marks them `binary`, not `eol=lf`.
Against `npm run dev`: the listing returns 3,142; `GET /api/prompts/:id` returns the *new* bodies
(`xlsx` 7,556 chars opening on "Requirements for every output", `counterparty-risk` 16,316 on
`Core Concepts`/`Worked Examples`/`Cross-References`); `POST /api/prompts/previews` returns
non-empty blurbs for them; and `GET /api/skills/download/:path` still produces valid zips for the
reorganized trees (`docx` 72 entries, `xlsx` 63 including `scripts/recalc.py`,
`timesfm-forecasting` 40).

**Left open:** `description:` is still local-only. `resync-upstream.mjs` preserves the whole
frontmatter block, which is right for `title`/`tags`/`category` and wrong for `description` —
upstream maintains that field too, and it is what a skill triggers on. All 93 bodies are level
while some descriptions are a year stale. Filed on the roadmap under *Content provenance*.

---

## 2026-09-12 — Filled the five thin categories, starting with the one that had nothing

`docs/ROADMAP.md` listed five thin categories. Counting them first changed the shape of the
job: **Healthcare had zero files in `4_Prompts`**, Education had five, and Legal/Compliance
had twenty-two and was not actually thin — it was buried two levels deep under
`Domain_Specific/`, which is a different problem. 54 new prompts, library **3,088 → 3,142**.

**What landed:**

- **Healthcare — new, 0 → 16.** `4_Prompts/Domain_Specific/Healthcare/` across four
  subcategories: `Clinical_Documentation` (SOAP note, discharge summary, referral letter,
  SBAR handoff), `Patient_Communication` (plain-language explainer, medication sheet,
  pre-procedure prep, reminder sequence), `Operations` (prior authorization, denial appeal,
  coding review, schedule optimizer), `Compliance` (Security Rule risk assessment, Safe Harbor
  de-identification, BAA review, breach notification plan).
- **Education — 5 → 17.** `K12` gains a rubric builder, conference prep, IEP goal writer and
  behavior support plan; `Higher_Ed` a Socratic tutor, outcomes mapper and feedback writer;
  `Curriculum` backward design, standards alignment, reading-level adaptation, formative
  assessment and multiple-choice item writing.
- **Legal/Compliance — 22 → 30.** `Regulatory` was the thin part at two files: EU AI Act
  readiness, SOX control narrative, AML/KYC review, records retention. Plus two contract
  reviewers and a new `Employment` subfolder.
- **E-commerce — 12 → 22** and **Personal Productivity — 13 → 21**.

**Placement was deliberately boring.** Everything went into folders that already exist.
Healthcare sits under `Domain_Specific/` because that is where Education and Legal already
live, so it needed no new top-level category and no restructuring. The open roadmap question
about what `2_Agents` is stays open and untouched. `2_Agents/Domain_Specific/Healthcare/`
already held five agent *definitions*; these are prompts, in the prompt section, and the two
do not collide.

**Written in the `Domain_Specific/Legal` house style**, not the other one. The older bulk
`Business/` files follow a template that says "Provide: step-by-step implementation plan,
templates and examples, tools and integrations needed" regardless of topic — that is a prompt
about being helpful, not a prompt about e-commerce. Every new file names its inputs, states
what the model must *not* infer, and ends with an output format. Healthcare and Legal files
carry a disclaimer, and every Healthcare file says not to paste PHI into a service without a
Business Associate Agreement.

**No `featured` tags.** The featured row filters section-wide on the `featured` tag and sorts
by `lastModified`; 54 new files would have taken it over.

**Verified with:** `npm run lint` (clean), `npm run test:routes` (8 routes), `npm run build`
(clean; chunk sizes unchanged). `npm run build:index` reported 3,142 prompts with **no
`[WARN] Failed to parse frontmatter`** — a malformed frontmatter block silently drops a file
from the library, so that warning line is the real test for content work. Against `npm run
dev`: the listing returns all 3,142 with 16 Healthcare prompts under `4_Prompts` and 5 under
`2_Agents`, `Business/Ecommerce` at 22 and `Business/Productivity` at 21; a 26-id
`POST /api/prompts/previews` batch covering the new files returned 26 non-empty blurbs; and
`GET /api/prompts/:id` returned a full 2,510-character body for a new Healthcare file. All 54
files are LF.

**The index diff is large and mostly noise.** `lastModified` comes from filesystem mtime and
this work was done in a fresh worktree, so rebuilding restamped all 3,088 pre-existing entries.
Roughly 3,090 of the changed lines are that churn; the real change is the 54 new entries. CI
strips `lastModified` before comparing, so the freshness gate is unaffected.

_Touched: `site/library/4_Prompts/` (54 new files), `site/api/prompt-index.json`,
`docs/ROADMAP.md`, `docs/CHANGELOG.md`._

---

## 2026-09-08 — Stopped shipping 3,088 card blurbs to render 50

The listing response had quietly become the largest thing on first load — **338 KB gzipped**,
against 200 KB for the entire JS bundle. 632 KB of its 2.2 MB raw was `contentPreview`: a
200-character excerpt of every prompt in the library. Nothing that operates on the whole
listing reads it. Search matches title, tags, category and subcategory (`usePromptFilters`
never had `content` among its Fuse keys); sort uses title and `lastModified`; the category
tree and tag facets are built from metadata. The only consumer is the blurb under a card
title — and at most ~50 cards are on screen.

**What changed:**

- `GET /api/prompts?lightweight=true` no longer carries body text for the public library,
  in any of its three source paths (prebuilt index, local filesystem walk, GitHub mode).
  The response went **338 KB → 117.6 KB gzipped**, with all 3,088 prompts and every metadata
  field intact.
- New `POST /api/prompts/previews` takes `{ ids: string[] }` and returns `{ [id]: preview }`,
  served out of a Map built once from the prebuilt index, falling back to reading the file for
  ids the index does not have. POST rather than GET because 50 library paths do not fit in a
  query string. Ids are capped at 200 per request, restricted to `.md`, and resolved through
  the existing `resolveInside` traversal guard; unresolvable ids are omitted rather than
  failing the batch.
- New `src/hooks/usePromptPreviews.ts` fills blurbs in for whatever is on screen. It is called
  once inside `PromptCardGrid` — the component all three lists (featured, paginated,
  subcategory) render through — so no preview map is drilled through `PromptCardActions`. Its
  cache and in-flight map are module-level, because those three grids mount together and would
  otherwise request the same ids two and three times over. A page costs ~4 KB gzipped, paging
  back to a visited page costs nothing.
- **My Library keeps its inline previews.** It is one user's own prompts rather than 3,088, and
  the previews endpoint only knows about library files.

**Three bugs fixed on the way, all the same root cause** — callers treating the listing's
truncated `content` as the real body:

- **Card → Copy** put the 200-character preview on the clipboard, not the prompt.
- **Card → Download** wrote that same preview into the `.md` file.
- **Card → Edit** seeded the editor with it, so saving a My Library prompt from a card
  **truncated it to 200 characters**. That one was silent data loss.

All three now resolve the body through one `fetchFullContent` helper hitting
`GET /api/prompts/:id`. `PromptDetail` was never affected — `handlePromptClick` already
fetched. The card copy path hands `navigator.clipboard.write` a `ClipboardItem` wrapping the
pending fetch, because Safari drops the user-gesture clipboard permission across an `await`.

The search placeholder no longer claims to search "content" — it never did, and now there is
no content in the listing to search.

**Verified with:** `npm run lint` (clean), `npm run test:routes` (8 routes, up from 7),
`npm run build` (clean; entry chunk 181 → 184 KB). Against `npm run dev`: the listing returns
3,088 prompts across all five sections at 117.6 KB gzipped with zero non-empty `content`
fields; a 50-id preview batch returns all 50 at 4.2 KB gzipped. Nine traversal payloads
(`../../.env`, `..\..\.env.md`, `/etc/passwd.md`, `3_Skills/../../.env.md`, …) all return `{}`;
a non-array body returns 400; a 400-id request returns 200. In Playwright: all 54 first-paint
cards render blurbs from two batched requests, paging forward fetches one more and paging back
fetches none, search still filters, the subcategory list of 1,349 cards fills from seven
chunked batches, and clicking Copy issues a `GET /api/prompts/<id>` for the full body and
reports success.

The new card-action logic went into `src/hooks/usePromptContent.ts` rather than into
`App.tsx`, which ends the day at **1,083 lines and 24 `useState` hooks** — one line and one
hook below where it started.

_Touched: `site/api/index.ts`, `site/src/hooks/{usePromptPreviews,usePromptContent}.ts` (both
new), `site/src/components/{PromptGrid,PromptCard,LibraryHero}.tsx`, `site/src/App.tsx`,
`site/scripts/api-routes.test.mjs`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md`,
`docs/features/API.md`, `README.md`, `CLAUDE.md`._

---

## 2026-09-07 — Shrank the `motion` bundle with LazyMotion

`motion` was the only sizeable dependency still loading before first paint — a 128 KB chunk
pulled in by the full `motion.div` component, which unconditionally bundles drag, layout
projection, and gesture-tracking code whether or not a component uses it. This app doesn't:
a repo-wide check turned up no `drag`, `layout`/`layoutId`, or motion-value hooks (`useMotionValue`,
`useTransform`, `useScroll`, `useSpring`) anywhere — every usage is a plain enter/exit animation
or `whileTap`.

**What changed:**

- All 10 files importing `motion` from `motion/react` (`App.tsx` and 9 components) now import
  `m` instead, and `App.tsx` wraps its returned tree in a single
  `<LazyMotion features={domAnimation} strict>`. `strict` mode throws at runtime if any
  `motion.*` usage is missed, rather than silently double-shipping the animation engine.
- The `motion` output chunk dropped from **128 KB to 81.82 KB** (gzip 29.18 KB) — tree-shaking
  the drag/layout/gesture code the full `motion` component always carries.
- It did **not** become an async, deferred chunk. `motion-dom` ships as a single flat ES module
  with no internal split between its core and `domAnimation`'s feature set, so there's nothing
  for a dynamic `import()` to carve off — `m`, `AnimatePresence`, and `domAnimation` all live in
  the same file and load together. The win here is bytes shipped, not load timing.

**Verified with:** `npm run lint` (clean), `npm run build` (chunk sizes above, no errors), and a
Playwright smoke pass against `npm run dev` — loaded the homepage, opened a prompt card
(`PromptDetail`, lazy-loaded) and the Login modal (`LoginModal`, lazy-loaded, also behind
`AnimatePresence`) and confirmed no new console errors beyond the pre-existing `401` on
`/api/auth/me` (expected with no `DATABASE_URL` configured).

_Touched: `site/src/App.tsx`, `site/src/components/{Toast,ResourcesNav,Sidebar,SignupModal,
PromptDetail,PromptEditorModal,PromptCard,EmptyState,LoginModal}.tsx`, `docs/ROADMAP.md`,
`CLAUDE.md`._

---

## 2026-09-05 — Rewrote the OpenAI CLI guide against current docs

`1_Guides/API_Providers/openai_cli_guide.md` was the one file the GPT-4o model-ID
sweep had deliberately skipped, because a find-and-replace on a guide built around
GPT-4o pricing, rate limits, and CLI syntax would have produced confident wrong
numbers rather than fixing anything.

**What changed, checked against OpenAI's own docs rather than guessed:**

- **The CLI itself was wrong, not just the model names.** The old guide invented
  `pip install openai-cli` and an `openai api chat.completions.create -m ...` syntax
  that doesn't match any current or past official tool. The real `openai` CLI installs
  via Homebrew or `go install`, and is built around the Responses API
  (`openai responses create`, `openai images generate`, `openai audio:speech create`).
  Codex CLI (the agentic coding tool, `codex`) is a separate binary and is now called
  out as such, instead of being blended into the same "CLI" section.
- **Responses API replaces Chat Completions as the primary SDK example.** OpenAI's own
  guidance is that new integrations build on Responses; Chat Completions remains
  supported, so its examples stayed in as a labeled legacy-compatible section rather
  than being deleted.
- **Models and pricing now name the current lineup** — GPT-6 Astra, GPT-5.6
  Sol/Terra/Luna, o3/o3-mini — sourced from `developers.openai.com/api/docs/pricing`
  and `/models`, with a note that these numbers move and to check the live page
  before quoting one.
- **The fixed "Tier 3" rate-limit table is gone.** Rate limits are per-organization
  and change independently of this doc, so it now points at the account's own limits
  page and the `x-ratelimit-*` response headers instead of a table that was already
  guesswork in the original.

_Touched: `site/library/1_Guides/API_Providers/openai_cli_guide.md`,
`site/api/prompt-index.json` (rebuild — only this file's title/tags/contentPreview
changed; the rest of the diff is `lastModified`/`buildTime` mtime churn from a fresh
worktree checkout), `docs/ROADMAP.md`._

---

## 2026-08-29 — One word meaning two things in the provenance data

Seven skills — `docx`, `xlsx`, `executing-plans`, `accessibility-compliance`,
`algorithmic-art`, `supabase-postgres-best-practices` and `canvas-design` — carried
`upstream.match: behind` in their frontmatter. Read straight, that says the library is
running behind upstream on seven skills. It doesn't. `behind` was being spelled by two
scripts with two unrelated meanings:

- **`attribute-upstream.mjs`** stamps `match:` as *attribution confidence* — how sure we are
  about where a file came from. Its `behind` meant "this is the same skill as that upstream
  file, matched by 8-word shingle overlap or by an exact directory-name hit on a first-party
  publisher, but the bodies are not byte-identical."
- **`check-upstream-drift.mjs`** assigns `behind` as a *freshness verdict* at run time —
  "the local copy is missing more than 25% of upstream's content." That tier has been empty
  since 2026-08-27.

The roadmap offered two ways out: re-run the attributor, or rename the value. Re-running it
needs the ~110k-skill mirror clone and would have restamped the same seven files with the
same colliding word, so the rename is the actual fix.

**The attribution label is now `similar`.** Same semantics, same three code paths, no
behaviour change: `check-upstream-drift.mjs` skips `unknown`, `ambiguous` and `fork` and
checks everything else, so all seven are still tracked. The target count before and after is
**93**, unchanged.

**A guard, so it cannot come back.** `scripts/upstream.test.mjs` now walks all 323 skills and
asserts every `upstream.match` value is one of `exact` / `prefix` / `similar` / `ambiguous` /
`unknown` / `fork` — 322 are stamped, one is not. Reintroducing `match: behind` fails the
assertion (verified by putting it back and watching it fail). Both root-level self-checks —
`upstream.test.mjs` and `skill-frontmatter.test.mjs` — now run in CI as a *Provenance
self-checks* step; they had existed but nothing executed them, because the workflow's
`working-directory` is `site/` and they live at the repo root.

Both script headers now state the rule outright: `match:` is confidence, never freshness, and
the drift checker's verdict words do not belong in frontmatter.

The prompt index is untouched — `upstream:` frontmatter is not part of `contentPreview`, and a
rebuild confirmed the index is byte-identical apart from `buildTime`/`lastModified`.

_Touched: `scripts/attribute-upstream.mjs`, `scripts/check-upstream-drift.mjs`,
`scripts/upstream.test.mjs`, `.github/workflows/ci.yml`, seven `site/library/3_Skills/**/SKILL.md`,
`docs/README.md`, `docs/ROADMAP.md`._

---

## 2026-08-27 — Docs caught up with the day

Five changes landed today that made parts of the documentation wrong rather than merely
incomplete, so this is a sweep rather than an addition.

**`README.md`** — the API list was missing `GET /api/prompts/:id` (which exists, and is how
every prompt detail loads), the `lightweight` query parameter, and the skill-download route.
The project tree gained `.github/workflows/`, `.gitattributes` and `site/scripts/`. A short
*Checks* section now names `lint`, `test:routes` and `build:index`, and says CI runs them.

**`docs/ARCHITECTURE.md`** — the architecture diagram still drew the API layer as "Express +
Vercel Functions", two things side by side, which stopped being true when the implementations
were collapsed onto one app. Its storage box still showed the pre-rename `prompts/My_Prompts/
Collections` tree. Both redrawn; `routes/` is described as auth-only now that the skill-packs
router is gone.

**`CLAUDE.md`** — `server.ts` is described as what it now is (a 71-line wrapper around the
app `api/index.ts` exports) rather than "local Express dev server", which read as a second
implementation. Three conventions were added, each one a bug this repo actually shipped:

- LF only, because `contentPreview` is embedded in the index verbatim and CRLF makes it
  unreproducible on Linux;
- case-unique paths under `library/`, because two files differing only in case are one file on
  Windows and two on Linux;
- check what a bulk import is about to publish, because an upstream corpus put 350 contributor
  email addresses one commit away from a public site.

**`docs/skill-packs/README.md`** — pointed at `routes/skill-packs.ts`, deleted this morning.

**`docs/ROADMAP.md`** — snapshot rows for CI and line endings; `2_Agents`'s unusable-subagent
count refreshed 457/547 → 460/546; and the merged-branch list corrected from six to thirteen,
with `mike_desktop` and `main-backup-5_15_26` called out as decisions rather than deletes.

---

## 2026-08-27 — 1,349 prompts that shipped on every deploy and nobody could open

`2_Agents/Development/Other/` held two files over the index builder's 500 KB ceiling:
`act-as-an-expert.md` (3.4 MB) and `promptsdotchat-opensource.md` (2.5 MB). Being skipped by
the builder, neither was searchable, linkable, or openable — they were 5.8 MB of dead weight in
every deploy.

They are not what the filenames suggest. Both are the
[f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) corpus in `<details>`
form, and they are not duplicates of the 202-prompt `awesome-chatgpt.md` sitting next to them —
they carry **1,377** and **1,169** distinct prompts. Only 27 of those exist anywhere else in
the library.

`promptsdotchat-opensource.md` turned out to be **1,168 of its 1,169 prompts already inside**
`act-as-an-expert.md` — 2.5 MB of near-pure redundancy. The union is 1,378. Twenty titles
appear in both with different bodies; in each case the longer one is the later revision, so
that is the one kept.

### What shipped

1,378 minus 27 already-reachable minus 2 empty stubs = **1,349 files** under
`4_Prompts/Awesome_ChatGPT/General/`, each with the frontmatter the rest of `4_Prompts` uses
and tags derived from its title. Fifteen slug collisions were suffixed, and the slugs are all
lowercase — two files differing only in case are one file on Windows and two on Linux, which is
exactly how the index desynced last time.

| | before | after |
|:---|---:|---:|
| `2_Agents` | 7.7 MB / 548 files | **2.1 MB** / 546 files |
| `4_Prompts` | 1.3 MB / 561 files | 4.0 MB / 1,910 files |
| `site/library` | 30.3 MB / 2,864 files | **27.3 MB** / 4,211 files |
| prompt index | 1,739 prompts, 1.05 MB | **3,088** prompts, 1.91 MB |

### 350 email addresses that were about to be published

The upstream corpus credits contributors as `Contributed by [@handle](url)` — except **350 of
its 648 handles are email addresses**, not GitHub usernames. Splitting naively would have put
`[@someone@gmail.com](https://github.com/someone@gmail.com)` on a public site: a broken link,
and someone's personal address republished at `prompts.mikesailab.com`.

Attribution is emitted by handle only when the handle actually matches GitHub's username
grammar — **712 files** carry a named credit; the rest credit the repository and no individual.
Prompt bodies were scanned too: one email, `john.doe@defensetech.com`, plainly fictional. No
key-shaped strings anywhere in the 1,349.

### The cost, stated plainly

The lightweight listing every visit fetches went **159 KB → 311 KB gzipped**. That is
proportional to 78% more prompts rather than a regression in kind, but it now outweighs all the
JS on the page (200 KB gzipped), which makes pagination the next payload item rather than the
bundle. Filed on the roadmap.

Verified against a running server: 1,349 prompts in the listing under `Awesome_ChatGPT`, the
sidebar shows the category with its count, individual prompts resolve by id and render, and the
console is clean.

---

## 2026-08-27 — The CI gate could never have passed, and two reasons why

The index gate shipped that morning failed on its first real PR, and the failure was honest:
the committed `api/prompt-index.json` genuinely could not be reproduced by CI. Two independent
causes, neither of them the gate's fault.

### 1. Line endings — `.gitattributes`

2,131 of 2,132 content files were CRLF, and the repo had no `.gitattributes`. The index embeds
a 200-character `contentPreview` verbatim, so the copy built on Windows carried `
` and the
copy CI rebuilt from a Linux checkout carried `
`. Every PR would have failed on the same
diff no matter what it changed — the fastest way to teach a team to ignore a gate.

`eol=lf` rather than a bare `text=auto` is the part that matters: it normalizes the *working
tree* on Windows too, so the index is byte-reproducible on either platform. 647 files
renormalized; each staged change was checked to be line-endings-only by comparing blobs with
`
` stripped from both sides.

Four files had to be pulled back out of the sweep. The PNG/GIF "images" under
`timesfm-forecasting` are Git LFS **pointer files**, and the LFS spec requires LF. Marking
`*.png binary` correctly stopped git normalizing them — which meant `--renormalize` would have
staged the CRLF working-tree bytes and quietly broken the pointers. Restored byte-for-byte.

### 2. The same file tracked twice, under two spellings of one directory

`document-writer/SKILL.md` was tracked at **both** `3_Skills/Content/General/` and
`3_Skills/Content/general/` — same blob, two paths differing only in one capital letter. It has
been that way since the `site/` restructure.

On Windows those are one directory, so the checkout produces a single file and the local index
has 1,739 prompts. On a case-sensitive Linux runner they are two files, so CI built **1,740**
and failed against the committed 1,739. Nothing a Windows-only workflow could ever see.

This is also what made the file look untracked. `git ls-files --error-unmatch` on the
capital-G path said "did not match any file(s) known to git", `git status` never listed it, and
`git add -f` exited 0 while staging nothing — from bash *and* PowerShell, with the file neither
ignored, sparse-excluded, nor skip-worktree. Git was matching the working-tree file against the
lowercase-g index entry and correctly concluding there was nothing to do. It went in via
`hash-object` + `update-index`, and the lowercase duplicate was then dropped with
`update-index --force-remove` — the capital-G spelling matches its `humanizer` sibling and the
committed index.

It was the only case collision in `site/library/`; `3_Skills/packs/` is lowercase on purpose.

### 3. The index was ordered by whatever the filesystem returned

With the count finally matching, the gate still failed — on ordering. `fs.readdirSync` returns
the filesystem's own order: case-insensitive alphabetical on NTFS, hash order on ext4. Same
1,739 prompts, different array order, so the diff was every entry moving.

`build-prompt-index.js` now sorts by `id`. Verified as a pure reordering: the set of prompt
objects before and after is identical, 0 added and 0 removed. The app sorts client-side
(default title-asc), so this order was never what anyone saw — it just made the committed file
un-reproducible.

### Result

`npm run build:index` twice in a row now produces a byte-identical index, and the gate's own
comparison passes locally. Prompt count is unchanged at **1,739**; `lastModified` was carried
over per id, so the diff is the previews rather than 1,739 fresh checkout timestamps.

---

## 2026-08-27 — One 976 KB chunk became eight

First paint was a single `index-*.js` of **976 KB / 265 KB gzipped**, and Vite warned about it
on every build. It is now **706 KB / 200 KB gzipped** across three files, and nothing trips the
500 KB threshold.

| chunk | size | gzip | when it loads |
|:---|---:|---:|:---|
| `react-vendor` | 396.7 KB | 118.8 KB | first paint |
| `index` (app) | 180.9 KB | 39.0 KB | first paint |
| `motion` | 128.3 KB | 42.7 KB | first paint |
| markdown (shared) | 184.0 KB | 54.6 KB | opening a prompt or the editor |
| `SkillPacksView` | 28.5 KB | 3.9 KB | opening Skill Packs |
| `PromptEditorModal` | 17.6 KB | 2.9 KB | opening the editor |
| `PromptDetail` | 15.9 KB | 2.6 KB | opening a prompt |
| `SignupModal` / `LoginModal` | 14.8 / 9.3 KB | 2.5 / 1.8 KB | opening that modal |

Two changes did it.

**`React.lazy` on the five components that are never on screen at first paint** —
`SkillPacksView`, `PromptDetail`, `PromptEditorModal`, `LoginModal`, `SignupModal`. The prize
is not the components (each is 9–28 KB) but what two of them drag in: `react-markdown` +
`remark-gfm` pull the whole unified/micromark stack, 184 KB that used to be in the entry chunk
and is now a shared chunk fetched the first time you open a prompt.

The three modals needed one extra step. They were always mounted and self-hid with
`if (!isOpen) return null`, which would have fetched their chunks on page load and defeated the
split, so App now mounts them only while open. Behaviour is identical — each already rendered
nothing when closed, and the editor's form-init effect keys on the same flag.

**`manualChunks` for React and motion.** They are ~475 KB of the entry and change only when we
bump them, so they now live in their own chunks: editing a prompt no longer invalidates 400 KB
of React in every visitor's cache.

### What is left

`motion` is the only sizeable thing still on the critical path at 128 KB. `LazyMotion` with the
`m` components would cut most of it, but `motion/react` is imported in 10 files — a refactor,
filed on the roadmap rather than smuggled in here. React itself is not going anywhere.

### Two bugs the browser test found

Verifying the split in a real browser (built bundle, `NODE_ENV=production`) turned up a
pre-existing routing bug in two halves, both the same omission — `skill-packs` was never added
to the tab↔URL mapping:

- the `activeTab` initialiser had no `skill-packs` case, so a **deep link or refresh on
  `?section=skill-packs` silently landed on Prompts**. In-app navigation worked, because the
  `popstate` handler *does* have the case, which is why nobody noticed.
- the URL-sync effect had no `skill-packs` case either, so its ternary chain fell through to
  `'system-prompts'` — opening Skill Packs rewrote the address bar to a section you were not
  looking at, and copying that URL sent someone else somewhere else.

Both fixed. Confirmed against the built bundle: first paint fetches exactly three JS chunks,
each lazy chunk arrives only on the interaction that needs it, markdown renders, and the
console is clean.

---

## 2026-08-27 — `library/Legacy/` deleted, 14 system prompts rescued from it

2,393 files and 37 MB — half the library payload — shipped on every deploy while being
excluded from the index by all three readers. Gone.

The delete was not taken on faith. Every Legacy file was hashed against the live tree first:

| | files | |
|:---|---:|:---|
| byte-identical to a live file | 1,956 | pure duplicates |
| older revision of a file that survived under the same name | 404 | superseded |
| no counterpart at all | 33 | needed a decision |

Of the 33, sixteen were support files their upstreams have since deleted — `pptx`'s
`html2pptx.js`, `inventory.py`, `rearrange.py` and `replace.py`, `skill-creator`'s
`init_skill.py` and `output-patterns.md`, and the per-language `claude-api` stubs. The
resyncs pruned those on purpose; Legacy was holding the corpses.

The other seventeen were archived system prompts, and three of those turned out to be the
same prompt under a different filename (`chatgpt-4o.md`, `codeium-windsurf-cascade.md`,
`mistral-le-chat-pro.md` — 0.94–0.98 similarity to a live file after stripping frontmatter).
**The remaining fourteen were real, unreachable content and were promoted into
`5_System_Prompts/` instead of deleted:** Brave Leo, Cursor IDE Sonnet, DuckDuckGo's
GPT-4o-mini, Gemini 1.5, Meta AI on WhatsApp, four OpenAI prompts (Assistants API, ChatGPT-4o,
ChatGPT-5, Deep Research), Opera Aria, Roblox Studio Assistant, Snap My AI, Wrtn and xAI Grok.
Four vendor folders are new: `Opera/`, `Roblox/`, `Snapchat/`, `Wrtn/`.

That is why the index grew rather than shrank — **1,725 → 1,739 prompts** — and it confirms
the delete removed nothing the app could reach. `site/library/` is 75 MB → **38 MB**.

The `Legacy` guards in `build-prompt-index.js` and `api/index.ts` were left in place. They
are three lines, and they mean a `git checkout <sha> -- site/library/Legacy` to consult the
old tree does not silently double the index.

---

## 2026-08-27 — One API, not two

`server.ts` was a 555-line hand-maintained twin of `api/index.ts` (749 lines), and
`routes/skill-packs.ts` (335) a twin of `api/skill-packs.ts` (394). Both copies are gone.
`api/index.ts` now exports its Express app; `server.ts` is 71 lines that import it, mount the
production skill-packs handler, and add Vite's HMR middleware — the one thing production does
not have and the only reason the file exists. Net ~880 lines deleted.

The three "parity bugs" on the roadmap were all the same bug — a stale copy — so all three
went with it:

| was | now |
|:---|:---|
| `GET /api/prompts/:id` missing in dev; fell through to Vite and returned the SPA's HTML | serves JSON, same handler as prod |
| dev ignored `lightweight`, shipping the full library every page load | honours it and the prebuilt index — 1.28 MB vs 9.3 MB |
| dev's GitHub mode filtered the tree on `prompts/`, renamed to `library/` long ago | one GitHub implementation, the working one |

Two more divergences surfaced while collapsing them. `server.ts` had its own
`isGitHubConfigured()` that ignored `USE_GITHUB_MODE`, so a `GITHUB_TOKEN` sitting in the
environment for unrelated reasons silently flipped dev onto that broken GitHub path and
served an empty library. And `api/index.ts` split a forward-slashed prompt id on `path.sep`
in the single-prompt route — correct on Vercel, wrong on Windows, where every prompt came back
with `section` set to the entire path and `category` set to `Uncategorized`. Both fixed.

`routes/skill-packs.ts` also carried a `GET /:packId/stats` route that the production handler
never had and no frontend code calls. It was deleted rather than ported.

New: `npm run test:routes` asserts the seven expected routes are registered on the shared app,
wired into CI. Verified by running it against a deliberately wrong expectation and confirming
it fails.

---

## 2026-08-27 — A CI gate on the prompt index

`.github/workflows/ci.yml`: on every PR and every push to `main`, `npm ci` →
`npm run lint` → `npm run build:index`, then fail if the rebuilt index differs from the
committed one. Catches "edited the library, forgot to rebuild" at the PR instead of three
commits later.

Two fields are stripped before comparing, because neither can match by construction:
`buildTime` is stamped at each run, and `lastModified` is `stat.mtime` — a fresh CI checkout
sets that to the checkout time for *every* file, so comparing it would fail 100% of runs and
teach everyone to ignore the gate. Everything that encodes actual content is still compared,
verified by adding a throwaway library file and confirming the check goes red.

---

## 2026-08-27 — Nine more skills resynced, dead upstreams settled, model IDs swept

Three "Now" items off the roadmap in one pass.

**Nine of the ten remaining `behind` skills are now `current`** — `autoresearch`,
`interaction-design`, `academy-guide`, `python-design-patterns`, `pptx`, `find-skills`,
`skill-creator`, `golang-popular-libraries` and `matlab`. Re-running the checker:
`behind` 10 → 1, `current` 32 → 41, `upstream-gone` 6 → 0.

`pptx` was the big one. Anthropic moved the whole OOXML tree from `ooxml/` into
`scripts/office/`, so the resync pruned 59 stale files (the duplicated ISO-29500 schema set,
the old validation package, `html2pptx.js`) and wrote 56 in the new layout — a net 28k lines
deleted from the deploy root.

`x-twitter-scraper` was deliberately skipped here — its upstream ships ~60 `references/*.md`
files that are SEO landing copy ("best-x-api-alternative", "reliable-twitter-data-api-2026")
rather than skill content, and pulling them adds marketing pages to a library that already has
a payload problem. That call was overtaken: the parallel branch below (#325) pulled all 68 of
them, and the merge kept them. The skill is now `drifted` at 0% — upstream has edited the
SKILL.md since — not `behind`.

The two branches resynced overlapping sets the same day, so the entry below covers ten skills
where this one covers nine. Both landed; the union is what shipped, and the post-merge report
is `audits/upstream-drift-2026-08-27.md` (since removed): `behind` **0**,
`current` 41, `drifted` 52, plus 6 forks the checker now skips.

**The six dead upstreams are now marked as forks we own.** All six were re-verified against
the live upstream trees — `spreadsheet`, `sora`, `using-neon`, `gh-fix-ci`,
`git-context-controller` and `linear` really are gone (openai/plugins still ships a `linear`
plugin, but it is MCP-only now, with no `skills/` directory). Each carries
`match: fork` plus a note, and `check-upstream-drift.mjs` skips that verdict, so the weekly
job stops re-reporting six things nobody is going to fix.

**Deprecated model IDs swept** across 35 guide and agent files. Claude: `claude-3-5-sonnet`,
`claude-3-7-sonnet`, `claude-3-sonnet` → `claude-sonnet-5`; `claude-3-opus` →
`claude-opus-5`; `claude-3-haiku` → `claude-haiku-4-5`. OpenAI: `gpt-4o` → `gpt-5.6-sol`,
`gpt-4o-mini` → `gpt-5.6-luna`, verified against OpenAI's live model list.

Three scopes were left alone on purpose: `5_System_Prompts/` (an archive of what specific
models were actually shipped with — the old IDs are the point), `3_Skills/Development/API/claude-api`
(upstream-managed, and its migration docs need the old IDs), and version-history or
competitor-comparison lines like "### vs Claude 3.5". `openai_cli_guide.md` was also skipped:
it is built around GPT-4o with pricing, rate-limit and capability tables, so it needs a
rewrite rather than a find-and-replace.
## 2026-08-26 — The `behind` tier is empty

The remaining ten skills the drift report flagged as `behind` — missing more than a quarter
of their upstream's content — are now byte-identical to upstream. Verified by re-running
`check-upstream-drift.mjs` against all 99 attributed skills: `behind` 10 → **0**, `current`
32 → **42**. The verdict table no longer has a `behind` section to print.

| skill | upstream | was missing |
|:---|:---|---:|
| `Development/autoresearch` | github/awesome-copilot | 73% |
| `Design/interaction-design` | wshobson/agents | 72% |
| `Platform_Integrations/academy-guide` | anthropics/skills | 71% |
| `Development/Python/python-design-patterns` | wshobson/agents | 68% |
| `Business/Marketing/x-twitter-scraper` | xquik-dev/x-twitter-scraper | 67% |
| `Content/pptx` | anthropics/skills | 60% |
| `AI_ML/find-skills` | vercel-labs/skills | 55% |
| `Content/skill-creator` | anthropics/skills | 52% |
| `Development/golang-popular-libraries` | samber/cc-skills-golang | 31% |
| `Data/matlab` | k-dense-ai/scientific-agent-skills | 30% |

**Three of them were shipping a support tree with no SKILL.md to go with it.**
`x-twitter-scraper`, `golang-popular-libraries` and `matlab` gained 68, 4 and 20 support
files respectively — `x-twitter-scraper` was a lone `SKILL.md` in a directory whose upstream
carries 68 reference documents, so the skill named files that were never there.

**`pptx` was the reverse: a support tree from a layout that no longer exists.** Anthropic
folded the old sibling `ooxml` skill into pptx and moved its schemas from `ooxml/schemas/` to
`scripts/office/schemas/`, its validators from `ooxml/scripts/validation/` to
`scripts/office/validators/`, and dropped `html2pptx.js`, `inventory.py`, `rearrange.py` and
`replace.py` entirely. 59 local files were orphans of the old shape; 56 replaced them. Every
path the new `SKILL.md` references was checked to exist afterwards, and the same for
`skill-creator`, whose `references/output-patterns.md`, `references/workflows.md` and
`scripts/init_skill.py` are gone upstream and are referenced nowhere in the new body.

**`matlab`'s references shrank and that is an improvement.** Upstream rewrote all eight from
a generic MATLAB cheatsheet into R2026a-targeted guidance with `arguments` blocks, an
artifact-selection table and explicit "never run an untrusted project" warnings — denser
prose in fewer lines. The line count falls; the content does not.

Frontmatter is untouched as always, except the `upstream:` block: `ref` now names the commit
each skill was synced from and `checked` is today. Three skills gained a full 40-character
commit sha they did not have (36 skills now carry one, up from 33).

### The index diff is 20 lines, not 1,735

`lastModified` in `api/prompt-index.json` is the file's mtime, so rebuilding the index in a
fresh checkout rewrites it for all 1,725 prompts — churn that also makes the app's
Newest/Oldest sort meaningless. The committed index keeps the previous `lastModified` for
every file this change did not touch, so the diff is the ten resynced skills plus
`buildTime`. Prompt count is unchanged at 1,725; skill count unchanged at 323.

_Touched: 10 skill directories under `site/library/3_Skills/` (+105 files, −62, 34 changed),
`site/api/prompt-index.json`, `docs/audits/upstream-drift-2026-08-26.md`, `docs/ROADMAP.md`._

---

## 2026-08-26 — The six most-drifted skills pulled back level with upstream

The drift report shipped earlier the same day named 16 skills as `behind` — missing more
than a quarter of their upstream's content. The six worst are now `current`, verified by
re-running the same checker: `behind` 16 → 10, `current` 26 → 32.

| skill | upstream | was missing |
|:---|:---|---:|
| `Development/code-tour` | github/awesome-copilot | 91% |
| `Data/huggingface-gradio` | huggingface/skills | 86% |
| `Content/brainstorming` | obra/superpowers | 86% |
| `AI_ML/huggingface-llm-trainer` | huggingface/skills | 84% |
| `AI_ML/Agent_Development/discernment-nudge` | anthropics/skills | 77% |
| `Development/API/claude-api` | anthropics/skills | 77% |

Five of the six were stubs — a paraphrased summary of the upstream skill rather than a copy
of it. `code-tour` carried 295 words against upstream's 3,160 and none of its 20 personas or
step types. What shipped to visitors was a description of a skill, not the skill.

`claude-api` was a different failure: the body was close, but the support tree had been left
at an old layout. Anthropic split each language's single `claude-api.md` into a directory and
renamed `agent-sdk/` to `managed-agents/`, so 42 files were missing and 9 were orphans of a
structure that no longer exists. It now mirrors upstream at 68 files, and the skill-pack zip
went from 26 entries to 90.

**Frontmatter is not synced, and that is the point.** `title` carries the decorated emoji
form the site renders, and `tags`/`category`/`subcategory`/`source` are this library's own
curation — none of it exists upstream. The drift checker strips frontmatter before comparing,
so syncing the body is exactly what moves a skill from `behind` to `current`. Only the
`upstream:` block is rewritten: `ref` to the sha synced from, `checked` to today, and `match`
to `exact`, which after the sync it genuinely is.

### New tooling

`scripts/resync-upstream.mjs` is the repair half of `check-upstream-drift.mjs` and shares its
resolution logic deliberately — stamped paths come from a mirror whose layout is not the
origin repo's, so the skill is located by directory name, not by trusting the path. It
mirrors the whole upstream skill directory and prunes local files upstream no longer has
(`--keep-extra` to opt out, `--dry-run` to preview), and never writes outside the named skill
directories. Line endings follow the local `SKILL.md`, so this library stays CRLF throughout
and the separate normalization decision is not pre-empted.

`scripts/upstream.test.mjs` grew a check for the re-stamping: a resync rewrites up to 68
files, and the one thing that must survive is the block the drift checker reads next week.
It asserts no duplicated keys, `repo`/`path` preserved, curation outside the block untouched,
and idempotency.

### A number that moved

The library now mentions the current Claude 5 model family in 47 files, up from zero — all 47
inside the resynced `claude-api` tree. Nothing else in the library names a current model, so
the roadmap's "sweep deprecated model IDs" item stands; its counts are updated.

_Touched: `scripts/resync-upstream.mjs`, `scripts/upstream.test.mjs`, 6 skill directories
under `site/library/3_Skills/` (+82 files, −9), `site/api/prompt-index.json`,
`docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/README.md`,
`docs/audits/upstream-drift-2026-08-26.md`._

---

## 2026-08-26 — Repository audit, security fixes, and upstream provenance

A full audit of the repo after several months idle, then the first remediation pass.
Findings and method: `audits/REPO-AUDIT-2026-08-26.md` (since removed).

The headline is that the app was healthy — `tsc` clean, index deterministic, `main`
deployable — but two security bugs were live in production and the content pipeline did not
exist. Only 61 of 2,132 library files recorded where they came from, which is why "keep the
skills up to date" had been intractable: you cannot diff against an upstream you cannot name.

### Security

**Path traversal in the skill-download endpoint — confirmed exploitable, now closed.**
The endpoint guarded with `skillPath.startsWith('3_Skills/')` before calling
`path.join(LIBRARY_PATH, skillPath)`. That check is satisfied by `3_Skills/../../db`, so
`GET /api/skills/download/3_Skills%2F..%2F..%2Fdb` returned a 200 zip containing
`db/postgres.ts` — unauthenticated, with no middleware on the route at all. Four more
user-controlled sinks had the same shape, one of them an unauthenticated arbitrary file read.

New `site/lib/safe-path.ts` exports `resolveInside(root, rel)`: resolve first, compare
after, which is the only ordering that actually contains. All five sinks route through it.
In `api/index.ts` the check moved *above* the GitHub/filesystem split, because GitHub
normalises `..` inside `contents/` URLs too — guarding only the filesystem branch would have
left the deployed path open. Re-tested with five payloads: all `400`, legitimate skill zips
still `200`.

**Session tokens were not cryptographically random.** They came from `Math.random()`, a
non-cryptographic PRNG whose state is recoverable from observed output, and they are the
only thing authenticating a 30-day cookie — no signature, no server-side secret. Now
`randomBytes(32)`; ids use `randomBytes(6)`. Existing sessions must be purged
(`DELETE FROM user_sessions;`) because they were minted by the old generator.

**22 npm advisories to 0.** `npm audit fix` cleared 14, including two critical (`tar`,
`protobufjs`). The remaining 8 all traced to `@vercel/node`, which has no fixed release —
even 8.1.0 bundles vulnerable `undici` and `path-to-regexp`. But it was a devDependency
imported for exactly two `import type` aliases and it never executes, since Vercel supplies
the real runtime. Replaced with a 23-line `site/lib/vercel-types.ts` and removed.

**Also removed, all verified unreferenced:** `@google/genai`, `better-sqlite3` and
`@types/better-sqlite3` (superseded by the Postgres migration, still compiling a native
module on every install). Dropping `@google/genai` exposed a dead `define` in
`vite.config.ts` that inlined `process.env.GEMINI_API_KEY` into the client bundle — nothing
read it and it was unset, so nothing leaked, but it went before someone set the variable.
`server.ts` also stopped logging a user's email address on every My Library request.

### Upstream provenance — the freshness system

Attribution is by **content, not name**. Local skills were renamed on import
(`anthropic-brand-guidelines` vs upstream `brand-guidelines`, `docx-official` vs `docx`), so
directory matching identified only 72 of 347. Bodies survive renaming. Evidence comes from
seven directly-cloned publishers, which yield a real commit sha, plus a ~110k-skill mirror
whose paths encode the origin repo — that is what reaches the long tail of tiny publishers.

**99 of 323 skills attributed (31%), 32 with a commit sha.** The other 224 are recorded
honestly rather than guessed: 60 `ambiguous` (body present in three or more repos, so the
candidates are listed instead of one being picked) and 164 `unknown`. Both are still
stamped, because "we looked and could not tell" is a different fact from "nobody has
checked", and it stops the next person repeating the exercise.

Two rules earn most of the accuracy, and both were found by checking output rather than
trusting it:

- **First-party precedence.** A skill forked into forty repos is still its author's skill.
  Without this, `pptx`, `docx`, `xlsx` and `claude-api` were all credited to random personal
  dotfile repos that happened to sort first.
- **Path resolution, not path trust.** Mirror-derived paths follow the mirror's layout, not
  the origin repo's — it stores Anthropic's `claude-api` at `claude-api/SKILL.md` while the
  repo has it at `skills/claude-api/SKILL.md`. Taking them at face value reported **72 live
  files as deleted**; the real number is 6. The checker now fetches each repo's tree once and
  locates skills by directory name, which is also fewer API calls than fetching per file.

`check-upstream-drift.mjs` compares bodies with frontmatter stripped — local copies carry an
emoji `name:` and now an `upstream:` block, so a raw file comparison would flag all ~320
skills as drifted every week and the report would be worthless. A weekly workflow opens or
updates **one rolling issue** and never edits library content: the curation is the product,
and an auto-PR reflowing 300 files into the wrong categories would destroy it.

**First run: 16 behind, 51 drifted, 26 current, 6 upstream-gone.** It found worse than hand
inspection did — `code-tour` missing 91% of upstream, `huggingface-gradio` 86%,
`brainstorming` 86%, `claude-api` 77% plus 42 support files.

### Skill spec compliance

23 skills had no `name` and no `description`, so they could not load as skills at all — a
user downloaded the zip and got inert markdown. 171 more had a name the spec rejects,
almost always a decorative emoji prefix, and 164 had a name that did not match their
directory. **All 323 are now valid: 0 missing names, 0 missing descriptions, 0 invalid
names.**

The decorative form moved to `title:`, which is what the site renders anyway, and `name:`
became the directory slug. Paired with that, `build-prompt-index.js` and `api/index.ts` now
prefer `title` over `name` for skills — without that edit the site would have started
showing bare slugs. `server.ts` already preferred `title`, so this closed one dev/prod
divergence rather than adding another. Verified against the index before and after:
**323 in, 323 out, 265 titles unchanged, 58 improved, 0 regressed.**

Two bugs caught by checking the output, both now regression-tested:

- `description:` followed by indented continuation lines is a real multi-line YAML value but
  reads as empty. Treating it as missing and inserting a fresh `description:` orphaned the
  continuation, made the file unparseable, and silently dropped that skill from the index.
- An unquoted `name:` scalar that happens to contain quote characters lost its last
  character when quotes were stripped unconditionally.

**A correction to the audit's own claim:** moving the emoji out does *not* make skills
byte-identical to upstream. The `upstream:` block is added deliberately, so a whole-file
diff never matches again — measured 0 of 19 Anthropic skills. The drift checker strips
frontmatter anyway, so none of its verdicts change. Spec compliance was the entire payoff,
and it stands on its own.

### New tooling

| Script | Purpose |
|:---|:---|
| `scripts/attribute-upstream.mjs` | Stamp `upstream:` provenance by content matching. Idempotent |
| `scripts/check-upstream-drift.mjs` | Compare every attributed skill against its upstream |
| `scripts/fix-skill-frontmatter.mjs` | Enforce the Agent Skills spec without changing the UI |
| `.github/workflows/upstream-drift.yml` | Weekly check, one rolling issue |
| `site/lib/safe-path.ts` | Path containment guard |
| Three `*.test.mjs` files | Self-checks — the repo had no tests at all before |

### Documentation

Removed the legacy tree: `docs/archive/` (17 superseded planning docs from March 2026),
`docs/QUICK_REFERENCE.md` (it described a `prompts/` directory that no longer exists), and
`docs/library-update-logs/` (five per-section changelogs, three of them empty, all using the
pre-rename folder names). Everything is preserved in Git history. The two real entries from
those logs are folded into this file.

Fixed stale pre-rename path references across `CONTRIBUTING.md`, `templates/README.md`,
`development/DEBUG_UI.md`, `features/API.md` and `features/LIBRARY-MODE-IMPLEMENTATION.md`,
and rewrote `ARCHITECTURE.md`'s repo tree, which still described the layout from before the
app moved under `site/`.

_Touched: `site/lib/`, `site/api/index.ts`, `site/api/skill-packs.ts`, `site/server.ts`,
`site/db/postgres.ts`, `site/vite.config.ts`, `site/package.json`,
`site/scripts/build-prompt-index.js`, 323 `SKILL.md` files, `scripts/`,
`.github/workflows/`, `CLAUDE.md`, `docs/`._

---

## 2026-08-22 — Prompt list toolbar and grid extracted out of `App.tsx`

The last big block on the [roadmap](ROADMAP.md)'s `App.tsx` de-bulk list. Behavior-preserving:
the markup moved verbatim, nothing was restyled or repositioned.

**New components** — `App.tsx` **1,332 → 1,050 lines**
- `src/components/PromptListToolbar.tsx` — the header row above the prompt list: section
  title and count, the Total/Categories stat badges, the favorites / recent / tag filter
  dropdowns, and the sort `<select>`. It now owns *which* dropdown is open (one
  `openDropdown` value replacing three booleans in `App.tsx`) plus the outside-click
  handler that closes it; every filter value it edits still lives in `usePromptFilters`.
- `src/components/PromptGrid.tsx` — the main list: loading skeletons, the four empty
  states, the paginated card grid and its Previous/Next controls. Also exports
  `PromptCardGrid` (the responsive grid markup) and the `PromptCardActions` type.
- `PromptCardActions` bundles the eleven card-level props the three grids were each
  drilling into `PromptCard` by hand — featured, all-prompts and subcategory now pass one
  memoized object. Featured keeps its `lg:grid-cols-4` layout via `columns="featured"`.
- `App.tsx` shed three `useState` hooks, one `useEffect`, the local `cn()` helper (and its
  `clsx` / `tailwind-merge` imports), the now-unused `PromptCard` and `EmptyState`
  imports, and four `lucide-react` icons (`Tag`, `Star`, `ChevronDown`, `ChevronRight`).

**Scope note.** The roadmap item named one file, `PromptGrid.tsx`. It became two because
the featured section renders *between* the toolbar and the grid — folding the toolbar into
`PromptGrid` would have meant passing the featured block through as a slot, which is more
indirection than the split it was meant to avoid.

**Docs caught up while here** — `docs/features/FEATURED-PROMPTS.md` still showed a
`featuredPrompts` snippet that filtered `sortedPrompts` on the `featured` tag alone. The
real memo reads `sectionPrompts`, counts favorites as featured, and falls back to the four
most recently modified prompts so the row is never empty.

_Touched: `src/App.tsx`, `src/components/PromptGrid.tsx`,
`src/components/PromptListToolbar.tsx`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md`,
`docs/features/FEATURED-PROMPTS.md`, `CLAUDE.md`._

---

## 2026-08-19 — Weekly trending-skills sweep

Added 5 skills:

- **discernment-nudge** (`3_Skills/AI_ML/Agent_Development/discernment-nudge`) — [anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/discernment-nudge/SKILL.md)
- **academy-guide** (`3_Skills/Platform_Integrations/academy-guide`) — [anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/academy-guide/SKILL.md)
- **text-to-cad** (`3_Skills/Development/text-to-cad`) — [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad)
- **design-award-evaluation** (`3_Skills/Design/design-award-evaluation`) — SeanJ1ang/design-judge-skills *(upstream has since been deleted)*
- **diagram-design** (`3_Skills/Design/diagram-design`) — [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)

---

## 2026-08-18 — Top bar extracted out of `App.tsx`

Next item on the [roadmap](ROADMAP.md)'s `App.tsx` de-bulk list. Behavior-preserving: the
markup moved verbatim, nothing was restyled or repositioned.

**New components** — `App.tsx` **1,393 → 1,332 lines**
- `src/components/TopBar.tsx` — the header row above the content area: mobile sidebar
  trigger, `ResourcesNav`, and the logged-in/logged-out auth controls. Takes the current
  user plus four callbacks; holds no state of its own.
- `src/components/LibraryHero.tsx` — the section heading and library search field shown
  whenever no prompt or subcategory is selected. `searchQuery` still lives in
  `usePromptFilters`, passed down as a controlled value.
- `App.tsx` dropped its now-dead `ResourcesNav` import and four unused `lucide-react`
  icons (`Search`, `Menu`, `Library`, `Trash2`) plus an unused `extractEmoji` import.

**Scope note.** The roadmap item also listed the sort control and the library-mode switcher
as part of the top bar. Neither is: the library-mode switcher already lives in
`Sidebar.tsx`, and the sort `<select>` belongs to the prompt-list toolbar, so it travels
with the `PromptGrid.tsx` extraction instead. Moving either into the header would have been
a redesign, not an extraction.

**Docs caught up while here** — all three described the pre-extraction shape
- `docs/ARCHITECTURE.md`'s component tree listed a `Header`/`ViewToggle`/`PromptList` structure
  that never shipped; it now names the actual component files.
- `docs/features/LIBRARY-MODE-IMPLEMENTATION.md` pointed at `App.tsx` line numbers that rotted
  through two extraction rounds — now symbol/file pointers, and the switcher is correctly
  attributed to `Sidebar.tsx`.
- `docs/features/API.md` said the page size is configurable in `App.tsx`; it is
  `ITEMS_PER_PAGE` in `src/hooks/usePromptFilters.ts`.

_Touched: `src/App.tsx`, `src/components/TopBar.tsx`, `src/components/LibraryHero.tsx`,
`docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/features/LIBRARY-MODE-IMPLEMENTATION.md`,
`docs/features/API.md`, `CLAUDE.md`._

---

## 2026-08-18 — Audit follow-through: rename drift, index correctness, App.tsx de-bulk

Working through the June 2026 project audit (removed 2026-08-26; see Git history).
The metadata items were mostly already done; verifying them surfaced four live bugs, all
from the `Skills/` → `3_Skills/` folder rename never reaching the backend.

**Index correctness** — public library **3,826 → 1,722** prompts, `api/prompt-index.json` **2.4 MB → 1.06 MB**
- `Legacy/` was being indexed and shipped to every browser: **1,705 entries** (45% of the payload)
  tagged `section: "Legacy"`, which no tab maps to — so they were undisplayable dead weight.
  Now skipped in `build-prompt-index.js`, `api/index.ts` (filesystem + GitHub walks) and `server.ts`.
- The "only index `SKILL.md`" rule still tested the pre-rename `Skills/` path, so **421 skill
  sub-files** (`examples/`, `references/`, `agents/`) were listed in the Skills tab as if they
  were skills. Skills tab now shows the correct **320**.
- Same stale name made `isSkill` always false, so skills used `title:` instead of their `name:`
  frontmatter field.
- Dev and prod disagreed on all of the above — `server.ts` had been updated for the rename,
  `api/index.ts` and the index builder had not.

**Reliability**
- **One malformed frontmatter file emptied the entire Public Library.** An unguarded `matter()`
  call in `server.ts` / `api/index.ts` threw and the handler returned `[]`. Bad files are now
  logged and skipped, matching the index builder. Fixed the 4 offending files at the source
  (broken quoting in `title:`), recovering 4 prompts.
- **Prompt ids are now always forward-slashed.** `path.relative` emits backslashes on Windows,
  so every tab filter (`id.startsWith('4_Prompts/')`) failed and local dev showed 0 prompts.
- **A missing/unreachable `DATABASE_URL` no longer crashes the dev server.** `initializeSchema()`
  threw before `app.listen`, so a fresh clone couldn't run the app at all — contradicting the
  documented "runs read-only without a database" behavior. It now warns and serves the
  Public Library.

**`App.tsx` de-bulk** — **2,845 → 1,393 lines**, ~40 → 27 `useState` hooks
- Extracted earlier: `ResourcesNav`, `Sidebar`, `PromptCard`, `PromptDetail`.
- New `src/hooks/usePromptFilters.ts`: owns search + debounce, tag filter, sort, and pagination
  plus everything derived from them. The five hardcoded per-tab path checks collapse into one
  `TAB_PATH_PREFIX` lookup.

**Metadata**
- `package.json` version `0.0.0` → `1.0.0`; `.env.example` referenced a `prompts/` directory
  that no longer exists.

_Touched: `src/App.tsx`, `src/hooks/usePromptFilters.ts`, `api/index.ts`, `server.ts`,
`scripts/build-prompt-index.js`, `api/prompt-index.json`, `package.json`, `.env.example`,
4 library files._

---

## 2026-04-29 — My Library, Skill Packs & search

**My Library actions**
- Added explicit **Remove from My Library** controls in card/detail views; clarified delete labels.

**Prompt add/copy**
- Fixed post-add refresh that could blank the list until reload; unified on a lightweight fetch with safer response handling.

**Skill Packs — public vs my library**
- Skill Packs now respect `library=public|my` in frontend and backend.
- New install-tracking table `user_skill_pack_installs`; My Library shows only packs the user added, Public shows the full catalog.
- Explicit add/remove lifecycle with confirm dialogs:
  - `POST /api/skill-packs/:packId/add-to-library`
  - `DELETE /api/skill-packs/:packId/remove-from-library`
- Imported skills tagged `skill-pack:<packId>` so removal cleans up every skill from that pack.

**Prompt creation**
- Create-Prompt section dropdown matches the app taxonomy (`1_Guides`…`5_System_Prompts`); new prompts force My Library mode; default section `4_Prompts`.

**Search**
- Ranking prioritizes title matches: starts-with → contains → other (tags/category/content).

_Touched: `src/App.tsx`, `PromptEditorModal.tsx`, `SkillPacksView.tsx`, `routes/skill-packs.ts`, `api/skill-packs.ts`, `db/postgres.ts`, `api/prompt-index.json`._

---

## 2026-03-28 — Agent frontmatter template compliance

Enforced the agent template's frontmatter requirements (`title`, `tags`, `category`,
`subcategory`) across `library/2_Agents/`, starting with 10 files in AI Engineering and MCP.
Existing `name`, `description`, `tools` and `model` fields were preserved.

The 2026-08-26 audit revisited this: 457 of 547 files in `2_Agents` still have no `name:` or
`description:`, so they cannot load as subagents at all. See the roadmap for the open
question of what that section should actually be.

---

## 2026-03-25 — Performance pass + content expansion

**Performance** (the library had grown to ~1,400 files and was freezing cold starts and the browser)
- **Prebuilt prompt index** (`scripts/build-prompt-index.js` → `api/prompt-index.json`): metadata + 200-char previews generated at build time. Cold start **2–5s → <100ms**.
- **Lightweight mode** (`?lightweight=true`): preview-only payloads, full content lazy-loaded. Initial payload **13MB → 278KB**.
- **`GET /api/prompts/:id`**: fetch a single prompt with full content (file-based or DB).
- **Pagination** at 50/page: DOM elements **1,427 → 50**, memory ~200MB → ~20MB. Resets to page 1 on filter change. (Adjustable in `src/App.tsx`.)
- **File-size filter**: skip files >500KB during index build (excludes two multi-MB bulk collections).
- **5-minute in-memory cache** for public-library lightweight requests.

**Content**
- 7 new MCP-server prompt collections (~135 prompts): GitHub, Playwright, Serper, Google Workspace, n8n, Supabase, Firebase.
- Featured prompts refreshed toward developer roles (21 total); contextual emojis added.

**Fixes / maintenance**
- Converted new MCP files from comma-string tags to YAML arrays (fixed `tags.forEach is not a function`).
- Added missing `#` headings to 3 `SKILL.md` files.
- Renamed `Mcp_Servers/` → `MCP_Servers/` for consistent acronym casing.

> Folder names above (`Prompt_Library/…`) reflect the pre-rename layout; the library has
> since moved to the numbered `1_Guides`…`5_System_Prompts` scheme.

---

_Superseded planning docs from March-June 2026 were removed on 2026-08-26; they remain in
Git history. The per-section `docs/library-update-logs/` tree was folded into this file at
the same time._
