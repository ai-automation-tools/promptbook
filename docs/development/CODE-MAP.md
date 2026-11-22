<h1 align="center">🗺️ Code map</h1>

<p align="center">
  <em>Every script, test and folder in the repo, and what CI runs. Moved out of AGENTS.md so agents load the rules, not the tour.</em>
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/↩-development-6B7280?style=for-the-badge" alt="Back to development"></a>
</p>

---

## Scripts, tests and CI

Run from `site/` unless a path says otherwise.

Other scripts: `npm run build` (build:index → tsc → vite build), `npm run build:index`
(regenerates `api/prompt-index.json` from `library/`), `npm run lint` (`tsc --noEmit`, then oxlint with only the two react-hooks rules, `site/.oxlintrc.json`),
`npm run test:routes` (asserts the shared Express app still exposes all fifteen API routes and no auth router),
`npm run test:my-library` (round-trips the My Library file store in a temp folder, and a ZIP export and import, hostile archives included),
`npm run test:read-only` (under `READ_ONLY`, My Library is neither listed nor served),
`npm run test:prompt-content` (a failed full-prompt load throws instead of returning the preview),
`npm run test:markdown-file` (a downloaded `.md` reads back through the store unchanged),
`npm run test:preview` (a card blurb drops badge rows and links cut off at 200 characters),
`npm run test:browser` (after a build: the built app in Chrome, including card actions by keyboard, Related leaving a prompt for good, the dialog and command-palette focus trap, a Settings export/import, a My Library `?prompt=` link, a star saved to the server (and the move of an old localStorage list), New item's category suggestions, a save conflict that keeps the draft, Skill Packs listed once, the phone "+" hiding on scroll, bad or blocked localStorage and the embed contract inside a frame),
`npm run test:safe-path` (`../` escapes and links out of `library/` are refused, for detail and ZIPs),
`npm run test:frame-ancestors` (`FRAME_ANCESTORS` origins get CSP `frame-ancestors` and no X-Frame-Options; a bad entry never reaches the header),
`npm run bench` (latency, size and event-loop stall of the heavy endpoints; compare with
`docs/development/PERFORMANCE.md`, not run in CI).

CI (`.github/workflows/ci.yml`) runs `npm ci` → `lint` → `build` → `test:routes` → `test:my-library` → `test:read-only` → `test:prompt-content` → `test:markdown-file` → `test:preview` → `test:safe-path` → `test:frame-ancestors` → `test:mcp` → `test:browser` → the two repo-root
provenance self-checks (`scripts/upstream.test.mjs`, `scripts/skill-frontmatter.test.mjs`) →
the content gate (`scripts/check-content.mjs`: no hidden or agent-directed instructions in
`site/library/`; reviewed exceptions in `scripts/content-allowlist.json`) → a rebuild of the prompt index, failing if the rebuilt file is not byte-identical to the committed one.
A second job, `secrets`, runs gitleaks 8.30.1 (checksum-pinned) over the whole history with
`.gitleaks.toml`: the default rules, with four loose pattern rules (generic API key, curl auth
header, JWT, LinkedIn client ID) off in library text only. Locally: `gitleaks git . --redact` (CI scans only `HEAD`'s history; locally that flag scans every branch).
A new finding is either a real secret (revoke it at its issuer first, then rewrite) or an
example: narrow the allowlist to that commit and file, never widen the path list for it.
Rebuild and commit `api/prompt-index.json` whenever you touch `library/`.

## Layout

Everything under `site/` is the deployable app (Vercel Root Directory = `site`).
Paths below are relative to `site/`.

```
site/
  src/                 React app
    App.tsx            ~1,200 lines — the app shell: state, data fetching, handlers, layout
    hooks/             usePromptFilters (search, tags, sort, pagination)
                       usePromptPreviews (batched card blurbs — the listing has no body text)
                       usePromptContent (copy state + fetchFullPrompt, which throws rather than
                       return the listing's preview; callers show an error and stop)
                       useLibraryRoute (the URL is the navigation state: library, section, category,
                       subcategory, ?prompt=, Skills' ?view=libraries, ?favorites=1, ?pack=; a view change
                       pushes history, so Back/Forward work; App derives which view shows from it. A
                       My Library item's ?prompt= is its id, with ?library=my)
                       useFavorites: My Library's favorites, kept by the server in `favorites.json` in the
                       My Library folder (not localStorage, which is per address), so every browser and device
                       sees the same stars; a browser's old `prompt-favorites` list moves up once on load.
                       Public Library cards, items and packs have no star. Skill Packs star as `pack:<id>`
                       in the same list (packFavoriteId in SkillPacksView)
    hooks/useTheme     Light | Dark (`html.light`, key `my-prompt-library.theme`) and the theme
                       (`html[data-palette]`, key `my-prompt-library.palette`, 12 themes in PALETTES;
                       both keys keep the pre-rename name so saved preferences survive);
                       index.html applies both before first paint
    lib/               mode (READ_ONLY), embed (the suite embed contract: framed with ?embed=1, hide brand,
                       source bar and Light | Dark; post ready/route to the parent, take its theme), cn (clsx + tailwind-merge), markdown-file (the Download .md), sections (the seven sections: tab id, folder,
                       label, rail label, icon, accent token, blurb — every tab switch reads from here;
                       categoryHue() gives each category a stable hue, applied with the .hue class)
    components/        SectionRail (md up: logo, six section tiles (NAV_SECTIONS: Skill Packs is reached from the Skills
                       switch, and lights Skills), Settings; the current
                       one's cell bleeds into the categories panel), TopBar (⌘K search, Resources menu,
                       New item, ThemeSwitch; brand, Settings and the section strip on phones),
                       Sidebar (section-tinted: library switch, category tree with hue dots),
                       Breadcrumbs, SettingsModal (mode + theme, local data, My Library export/import via
                       MyLibraryTransfer, shortcuts),
                       CommandPalette (⌘K: prompts / sections / actions / themes),
                       LibraryHero (title, blurb, CountUp stats, in-section search),
                       PromptListToolbar, PromptGrid (also exports PromptCardGrid,
                       PromptCardActions, LoadingSkeleton), PromptCard (spotlight card),
                       PromptDetail, SourcePanel (the repo link at the top of every card; copied-at
                       commit and drift status where there is one), SkillPacksView, SkillLibraries (the Skills | Libraries | Packs switch,
                       in the Sidebar from md up and as pills on phones, and the Libraries grid: the
                       items tagged `skill-library`, kept out of the Skills grid and category tree), EmptyState, Toast, ResourcesNav,
                       ThemeSwitch, PromptEditorModal, ErrorBoundary (wraps App in main.tsx:
                       a render or chunk failure shows "Something failed to load", not a black page)
    components/ui/     primitives (Button, IconButton, Chip, Tag, Kbd, Modal*, Notice), CountUp, GithubIcon (lucide 1.x has no brand icons)
    index.css          House-style tokens (dark on :root, light on html.light), per-section accent
                       (--c), base + component classes (.btn, .input, .chip, .spot, .popover,
                       .topbar, .nav, .theme-sw, .site-footer …) in Tailwind layers
  server.ts            The local server: imports the app `api/index.ts` exports, mounts the
                       skill-packs handler, adds Vite HMR (or serves dist/ with --production).
                       Port 3010 on 127.0.0.1 (PORT and HOST override).
  api/index.ts         The Express app (also the Vercel handler): Public Library + My Library.
                       `?lightweight=true` returns metadata only — a listing prompt's
                       `content` is NOT the prompt. Card blurbs come from
                       POST /api/prompts/previews, full bodies from GET /api/prompts/:id.
  api/skill-packs.ts   Skill packs handler (bundles library/3_Skills/**). A pack counts as in My
                       Library while any My Library prompt carries its `skill-pack:<id>` tag.
  lib/my-library.ts    My Library file store + READ_ONLY. Ids are file names, restricted to
                       [a-z0-9-] so an id can never name a path outside the folder. Also `favorites`
                       (favorites.json beside the files; export carries it, import only adds stars).
  lib/frontmatter.js   gray-matter with its `---js` eval engine off. Every front-matter parse in
                       site/ imports this, never gray-matter (skill-frontmatter.test.mjs checks)
  lib/zip.ts           readZip(): the My Library import's ZIP reader (stored + deflate). Refuses
                       traversal names, ZIP64, encryption and entries over the cap, however
                       small they claim to be
  lib/zip-cache.ts     cachedZip(): skill and pack ZIPs built once per process, served from memory
  lib/safe-path.ts     resolveInside(): keeps library paths inside library/, by real path;
                       filesUnder(): folder walks that skip symlinks and junctions
  lib/prompt-inputs.ts A prompt's declared `inputs:` ([placeholder] fields): validated, then
                       filled in one literal pass; the MCP server makes them prompt arguments
  lib/library.ts       Shared by the API and the MCP server: LIBRARY_PATH, the section keys,
                       the prebuilt-index loader and readLibraryItem(). Never writes to stdout.
  mcp/server.ts        The MCP server (npm run mcp; stdio, @modelcontextprotocol/server v2):
                       search, get, browse, skills, Skill Packs, My Library writes (not
                       registered when READ_ONLY), featured + My Library prompts as MCP
                       prompts. docs/mcp-server.md, docs/features/MCP-SERVER.md. Must never log to stdout:
  mcp/setup.ts         imported first; sends console.log/info/debug to stderr and loads .env
                       quietly (dotenv 17 printed to stdout; 18 prints to stderr)
                       Adding a library section means adding it to SECTIONS in lib/library.ts
                       too; test:mcp fails until the two lists match.
  library/             Public content, numbered sections (see below)
  scripts/build-prompt-index.js   library/ → api/prompt-index.json (site build step, run with tsx).
                       The walk is walkLibrary() in lib/library.ts, the same one the API's full
                       listing uses: skips files over 500 KB, README.md and Legacy/; under
                       3_Skills it takes SKILL.md files and the Libraries/ cards. Sorts by id. Each entry carries `checked`
                       (last check against its source, checkedOf() in lib/library.ts; the
                       cards' stale badge) and, where declared, `inputs`. Carries `lastModified` and
                       `buildTime` forward for unchanged entries, so rebuilding an untouched
                       library leaves the file byte-identical.
  scripts/refresh-library-cards.mjs  Skill library cards ← each repo's description + README, via `gh`
                       (dry run; --write). Unchanged READMEs keep their date, so a no-op run is diff-free.
  scripts/api-routes.test.mjs     Pins the route table (npm run test:routes)
  scripts/my-library.test.mjs     File-store self-check (npm run test:my-library)
  scripts/mcp-server.test.mjs     MCP server end to end over stdio (npm run test:mcp)
  scripts/browser-smoke.test.mjs  The built app in Chrome via playwright-core, with vercel.json's
                       headers (npm run test:browser; run npm run build first)
  scripts/bench-endpoints.mjs     Heavy-endpoint benchmark (npm run bench), against
                       docs/development/PERFORMANCE.md
  lib/safe-path.test.mjs          Path and link containment (npm run test:safe-path)
  package.json, vite.config.ts, tsconfig.json, vercel.json, index.html

(repo root, outside the deploy root)
  scripts/             Library tooling: check-upstream-drift.mjs (the Monday issue, with a per-section
                       health table; --json writes site/api/upstream-status.json, which the item
                       page's Source panel and MCP get_item read), attribute-upstream.mjs +
                       resync-upstream.mjs (provenance; upstream-drift.yml resyncs the safe ones
                       into one weekly PR), reattribute-unclear.mjs (code-search pass over
                       unknown/ambiguous items), attribute-system-prompts.mjs (matches
                       5_System_Prompts against the public collections' clones and history),
                       build-skill-packs.mjs (one generated pack per 3_Skills folder with 6+ skills,
                       plus dead-path repair of the hand packs; Monthly Upkeep), discover-repos.mjs (gh search for new/popular skills, prompt, agent and
                       MCP repos the library doesn't track; its report is one source for the
                       promptbook-find-* jobs. docs/DISCOVERY.md, the ledger its --write filled,
                       closed 2026-11-18 apart from its `reject` rows),
                       vendor-skill-licenses.mjs (every copied item's `license:`, and a skill's LICENSE file, from gh),
                       build-notice.mjs (NOTICE's list of sources, from those stamps; upstream.test.mjs checks it),
                       check-content.mjs (PB-06 content gate in CI: instruction overrides, invisible
                       Unicode, AI-addressed HTML comments, curl|sh; prints file:line, never the text;
                       exceptions in content-allowlist.json with a reason),
                       check-resources.mjs (dead-link report for that menu), check-mcp-servers.mjs (flags MCP cards whose repo
                       is missing, renamed, archived, relicensed or quiet), backfill-tags.mjs
                       (path-derived tags for any file with none; the Monthly Upkeep keeps it at
                       zero), the two *.test.mjs self-checks
  archive/             Only leaked-sources-2026-11-18/ (the system prompts taken out on
                       2026-11-18). The rest (unlinked prompts and guides, copied skill
                       libraries, unlicensed skills, old generators) was removed 2026-11-22 and
                       lives in git history at 86ff6925; archive/README.md says how to restore.
                       Outside site/, so nothing serves, indexes or tests it.
  homepage/            Static homepage (one index.html, no build) → GitHub Pages via
                       .github/workflows/homepage.yml; pinned by scripts/homepage.test.mjs
  docs/                Documentation (see docs/README.md)
  docs/AUTOMATIONS.local.md  Gitignored, on Mike's PC only: every scheduled job, workflow and
                       sweep that touches this repo, with next and last runs and open PRs.
                       Rewritten Sundays by the Routines job promptbook-automations-doc;
                       its hand-written parts are that job's template.md. Don't edit it here
  docs/diagrams/       Code-pinned Archify data-flow diagram. Edit only the .json, rebuild with
                       node scripts/build-diagram.mjs --pin-head (copies into homepage/diagram/)
  images/              README / branding assets
  .github/workflows/ci.yml        lint + test:routes + provenance self-checks +
                                  prompt-index freshness gate
  .gitattributes       Everything is LF, in the repo and the working tree
```

## Design system

The org house style (`web-house-style` skill). Colours are tokens on `:root`
in `src/index.css` (`--bg`, `--surface`, `--line`, `--fg`…`--fg-5`, `--accent`, `--c`), redefined
under `html.light`: `#060606` ground with a dot grid, zinc surfaces, sky accent (sky-700 in light),
Inter + JetBrains Mono, 12/8/6px radii. Use the tokens (`text-[var(--fg-3)]`), never a raw
Tailwind palette colour or a hex, so both themes stay correct; accent-tinted text mixes toward
`--mix-ink` by `--tint-k`. `--c` is the current section's accent (`--sec-*`, 400 shade dark /
700 light, set from `data-section` on `<html>`); cards, glyphs and tonal buttons tint from it.
Dark is the default whatever the OS says; the Light | Dark pill is the last control in the top bar.
Settings (gear) adds a theme on top of the mode: each `html[data-palette]` block sets only `--tone`
and `--accent`, and the shared `html[data-palette]` / `html.light[data-palette]` blocks derive the
ground, panels, lines and secondary text from them. A new theme is those two lines per mode, plus
a PALETTES entry in useTheme.ts and its id in index.html's pre-paint regex (whose CSP hash then
changes in `vercel.json`). The "View source" bar (SourceBar) shows only under READ_ONLY (the demo).
Shared controls are classes in `@layer components` (`.btn`, `.input`, `.chip`, `.spot`)
wrapped by `components/ui/primitives.tsx`; reach for those before writing a new button.

## Upstream resync: three lanes

Copied content is brought back level with its source by exactly three paths, and each skips the
others' items (owner, 2026-11-22, audit PB-20). Don't add a fourth.

| Lane | When | What |
|:---|:---|:---|
| `.github/workflows/upstream-drift.yml` | Mondays, unattended | Skills and agents whose local copy adds under 10% of its own lines, in one `upstream/resync` PR. Never a `relicensed` item. |
| promptbook-roadmap job | Saturdays | Up to 5 `behind` items with real local content, each diff read; skips what no longer fits its category. |
| promptbook-upkeep job | Monthly | System prompts, resynced verbatim, repointed or merged. |

`ai-automation-tools/agent-skills` items are refreshed by the Monday Skills Sync instead.

---

<p align="center">
  <a href="README.md">← Development</a>
</p>
