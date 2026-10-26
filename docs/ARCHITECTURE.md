# System Architecture

Technical architecture and design decisions for the Promptbook application.

---

## Overview

Promptbook is a local-first app: you clone it and run it on your own machine. It
keeps everything as markdown files on disk:

1. **Public Library**: curated prompts, agents, skills, guides and system prompts in
   `site/library/`, versioned in this repo.
2. **My Library**: your own prompts, one `.md` file each, in `site/my-library/` (gitignored)
   or whatever folder `MY_LIBRARY_DIR` names.

There is no database and there are no accounts. The same app also runs on Vercel as a
**read-only demo** that serves the Public Library only.

---

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **React Markdown** - Markdown rendering
- **Fuse.js** - Fuzzy search
- **motion** - Animation

### Backend
- **Express** - API server (one app, used locally and on Vercel)
- **Node.js** + **tsx** - Runtime
- **gray-matter** - Frontmatter parsing for both libraries
- **archiver** - Skill and skill-pack ZIP downloads
- **helmet** - Response headers

### Hosting
- **Vercel** - the read-only demo
- **GitHub Pages** - the static project homepage in `homepage/` (separate from the app)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   React UI   │  │ Fuse Search  │  │  MD Render   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│        __READ_ONLY__ (build-time) hides write controls      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (fetch)
┌────────────────────────▼────────────────────────────────────┐
│                      API Layer                              │
│      One Express app — api/index.ts exports it, Vercel      │
│      runs it as a function, server.ts imports it locally    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GET  /api/prompts          - List (?lightweight)    │   │
│  │  POST /api/prompts/previews - Card blurbs by id      │   │
│  │  GET  /api/prompts/:id      - One prompt, full body  │   │
│  │  POST /api/prompts          - Create          [write]│   │
│  │  PUT  /api/prompts/:id      - Update          [write]│   │
│  │  DELETE /api/prompts/:id    - Delete          [write]│   │
│  │  POST /api/prompts/:path/copy-to-my-prompts   [write]│   │
│  │  POST /api/prompts/:id/pull-upstream          [write]│   │
│  │  GET  /api/skills/download/ - Skill directory ZIP    │   │
│  │  /api/skill-packs/*         - api/skill-packs.ts     │   │
│  └──────────────────────────────────────────────────────┘   │
│        [write] routes return 403 when READ_ONLY             │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         ▼                                ▼
┌─────────────────┐          ┌──────────────────────┐
│ Public Library  │          │     My Library       │
│ site/library/   │          │ lib/my-library.ts    │
│  ├─ 1_Guides    │          │                      │
│  ├─ 2_Agents    │          │ MY_LIBRARY_DIR       │
│  ├─ 3_Skills    │          │ (default             │
│  ├─ 4_Prompts   │          │  site/my-library/)   │
│  └─ 5_System_.. │          │ one .md per prompt   │
│ + api/prompt-   │          │                      │
│   index.json    │          │ absent on the demo   │
└─────────────────┘          └──────────────────────┘
```

The interactive version of this flow is in [diagrams/](diagrams/README.md).

---

## Data Layer

### Public Library

Markdown files under `site/library/`, one section per numbered folder. A prompt's id is its
path under `library/` with forward slashes, e.g. `2_Agents/Developer/General/devops-engineer.md`.
Section, category and subcategory come from the path; title and tags from frontmatter.

`npm run build:index` walks the library and writes `api/prompt-index.json`. The API serves
lightweight listings from that index, falling back to a filesystem walk when no index exists.
The full listing (every body) always walks, asynchronously. Both are cached for five minutes as
the bytes sent, with their ETag; see [PERFORMANCE.md](development/PERFORMANCE.md). CI fails if the committed index is stale.

### My Library

`site/lib/my-library.ts` is the whole store: `list`, `get`, `create`, `update`, `delete`
over a folder of markdown files.

- **Folder:** `MY_LIBRARY_DIR`, resolved against `site/` if relative. Default
  `site/my-library/`, gitignored. Created on first write.
- **File name = id:** `<slug-of-title>-<6 hex>.md`. The name is fixed at creation, so
  renaming a prompt never breaks a link to it. Ids must match `^[a-z0-9-]+$`, which is what
  keeps an id from naming a path outside the folder.
- **Frontmatter:** `title`, `section`, `category`, `subcategory`, `tags`, `created`,
  `updated`. The body is the prompt. Values are normalised on read, so hand-edited files
  with unquoted dates or missing fields still load; an unparseable file is skipped with a
  warning.
- **No cache:** every listing reads the folder, so edits made outside the app show up on
  the next load.

Files instead of a database means the folder can be synced, put under git, or edited in
any editor, and there is nothing to install.

### Skill packs

Packs are JSON manifests under `site/library/3_Skills/packs/`. Adding a pack copies its
skills into My Library (section `3_Skills`) tagged `skill-pack:<packId>`; removing it
deletes the files with that tag. "Which packs are in My Library" is computed from those
tags. There is no separate install record.

---

## Data Flow

### 1. List Prompts (`GET /api/prompts`)

With `?lightweight=true` the public listing is **metadata only** — `content` comes back as an
empty string. Search, tags, sort and pagination all run client-side off that metadata and never
needed the body; card blurbs are fetched per page from `POST /api/prompts/previews`, and the
real body from `GET /api/prompts/:id`. Treating a listing prompt's `content` as the prompt is
the bug that hit copy, download and edit before 2026-09-08.

```
fetch('/api/prompts?library=…&lightweight=true')
    ↓
library=my     → myLibrary.list()  → read every .md in MY_LIBRARY_DIR
                                     (200-char preview inline)
library=public → cache hit?        → return cached
                 prebuilt index?   → return index entries, content ''
                 otherwise         → walk site/library/, parse frontmatter
```

### 2. Create Prompt (`POST /api/prompts`)

```
PromptEditorModal
    ↓ fetch('/api/prompts', { method: 'POST', body })
requireWritable          → 403 if READ_ONLY
myLibrary.create()       → field checks (400 InvalidPromptError, shared with MCP)
                         → write <slug>-<hex>.md (exclusive create)
    ↓ return the prompt
Frontend refreshes My Library
```

### 3. Copy to My Library (`POST /api/prompts/:path/copy-to-my-prompts`)

```
"Save to My Library" on a public prompt
    ↓
requireWritable          → 403 if READ_ONLY
resolveInside(library/)  → 400 if the path escapes
    ↓ parse the source file, derive section/category from its path
duplicate title in the same section/category/subcategory? → 409
myLibrary.create()       → new file in MY_LIBRARY_DIR, with forked_from + forked_hash
```

### 4. Update a copy from its public source (`POST /api/prompts/:id/pull-upstream`)

```
GET /api/prompts/:id on a My Library copy
    ↓ upstreamStatus(): find the source (forked_from, else section/category/title match)
    ↓ hash public, copy and forked_hash
upstream.updateAvailable → "Update from public" banner in PromptDetail
    ↓ click (confirm first if upstream.localEdits)
pullUpstream()           → copy's content = public content, forked_hash reset
```

The public file is only ever read. MCP has the same pull as `update_from_public`.

---

## Read-only Mode

`READ_ONLY` is true when `READ_ONLY=true` is set, or when `VERCEL` is set (always, on
Vercel). It is checked in two places:

- **Server:** `READ_ONLY` in `lib/my-library.ts`. The `requireWritable` middleware in
  `api/index.ts`, and the add/remove handlers in `api/skill-packs.ts`, return `403` for
  every write. The reads hide My Library too: its list and installed packs come back empty
  and a My Library id is not served, so a read-only server never hands out personal files.
- **UI:** `vite.config.ts` bakes the same test into the bundle as `__READ_ONLY__`, which
  `src/lib/mode.ts` exports. When it is true the app forces the Public Library and hides
  the library switch, New prompt, Save to My Library and pack add/remove.

The server check is the real one; the UI flag only keeps buttons that would fail out of
sight.

---

## File Structure

```
promptbook/
├── site/                         # The app — run npm here; Vercel Root Directory
│   ├── api/
│   │   ├── index.ts              # Express app: prompts, previews, skill downloads
│   │   ├── skill-packs.ts        # Skill-pack handler (own Vercel function)
│   │   └── prompt-index.json     # Prebuilt index (regenerated by build:index)
│   ├── lib/
│   │   ├── library.ts            # Shared reader: library path, sections, index, readLibraryItem()
│   │   ├── my-library.ts         # My Library file store + READ_ONLY (keeps unmanaged frontmatter)
│   │   ├── safe-path.ts          # resolveInside() + filesUnder(): path and link containment
│   │   └── vercel-types.ts
│   ├── mcp/
│   │   ├── server.ts             # MCP server over stdio (npm run mcp), see features/MCP-SERVER.md
│   │   └── setup.ts              # Loaded first: stdout guard, quiet .env
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── hooks/                # usePromptFilters, usePromptPreviews, usePromptContent,
│   │   │                         #   useLibraryRoute (URL-backed navigation state)
│   │   ├── lib/mode.ts           # READ_ONLY for the UI (from __READ_ONLY__)
│   │   ├── lib/markdown-file.ts  # A prompt as a standalone .md (the Download button)
│   │   ├── App.tsx               # App shell
│   │   └── main.tsx              # Entry point
│   ├── library/                  # Public Library content
│   │   ├── 1_Guides/
│   │   ├── 2_Agents/
│   │   ├── 3_Skills/             # One directory per skill, each with SKILL.md; packs/
│   │   ├── 4_Prompts/
│   │   ├── 5_System_Prompts/
│   │   ├── 6_MCP_Servers/        # One card per MCP server
│   │   └── resources.json        # The Resources menu's links
│   ├── my-library/               # Your prompts (gitignored; created on first save)
│   ├── scripts/build-prompt-index.js   # Walks library/, sorts by id, skips >500 KB, keeps unchanged timestamps
│   ├── scripts/api-routes.test.mjs     # Pins the route table (npm run test:routes)
│   ├── scripts/my-library.test.mjs     # File-store round trip (npm run test:my-library)
│   ├── scripts/read-only.test.mjs      # READ_ONLY hides My Library (npm run test:read-only)
│   ├── scripts/prompt-content.test.mjs # Full prompt loads fail closed (npm run test:prompt-content)
│   ├── scripts/markdown-file.test.mjs  # Download .md round trip (npm run test:markdown-file)
│   ├── scripts/browser-smoke.test.mjs  # Built app in Chrome (npm run test:browser)
│   ├── scripts/bench-endpoints.mjs     # Heavy-endpoint benchmark (npm run bench)
│   ├── scripts/mcp-server.test.mjs     # MCP server end to end over stdio (npm run test:mcp)
│   ├── server.ts                 # Local server: imports api/index.ts's app, mounts
│   │                             #   api/skill-packs.ts, adds Vite HMR or serves dist/ (:3010)
│   ├── .env.example              # Optional settings: MY_LIBRARY_DIR, HOST, READ_ONLY
│   ├── package.json
│   ├── vercel.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── homepage/                     # Static project homepage (GitHub Pages)
├── scripts/                      # Repo utilities, outside the app
│   ├── attribute-upstream.mjs    # Stamp upstream provenance on skills (--agents: agents)
│   ├── check-upstream-drift.mjs  # Weekly drift report; --json → site/api/upstream-status.json
│   ├── resync-upstream.mjs       # Pull a skill or agent back level with its upstream
│   ├── reattribute-unclear.mjs   # Code-search pass for unknown/ambiguous provenance
│   ├── attribute-system-prompts.mjs # Stamp system prompts from the public collections
│   ├── sync-agent-skills.mjs     # Add and refresh skills from ai-automation-tools/agent-skills
│   ├── build-skill-packs.mjs     # One generated Skill Pack per skills folder; repairs hand packs
│   ├── backfill-tags.mjs         # Path-derived tags for any file without them
│   ├── discover-repos.mjs        # New and popular GitHub repos into docs/DISCOVERY.md
│   ├── check-resources.mjs       # Dead-link report for the Resources menu
│   ├── check-mcp-servers.mjs     # Flags MCP cards whose repo moved, aged or was archived
│   └── fix-skill-frontmatter.mjs # Enforce the Agent Skills spec
├── docs/                         # Documentation (see docs/README.md)
├── .github/workflows/            # ci.yml, upstream-drift.yml
├── AGENTS.md                     # Repo guide for coding agents
└── CLAUDE.md                     # Imports AGENTS.md for Claude Code
```

> The entire app lives under `site/`. Run every `npm` command from there, and keep the
> Vercel project's **Root Directory** set to `site`.

---

## Component Architecture

### Frontend Components

```
ErrorBoundary                 main.tsx: a render or chunk failure shows "Something failed to load" + Reload, not a black page
└── App.tsx                   app shell, data fetching (routing state: hooks/useLibraryRoute)
├── SourceBar                 "View source" bar (READ_ONLY demo only)
├── SectionRail               md up: logo, the seven sections, Settings; the current section's cell joins the Sidebar
├── Sidebar                   library-mode switcher (hidden when read-only) + category tree in per-category hues (a drawer on phones)
├── TopBar                    ⌘K search, ResourcesNav (≥1536px; a sheet below, which also holds the sections on phones),
│   │                         New prompt (hidden when read-only), Light | Dark ThemeSwitch; brand + Settings on phones only
│   └── ResourcesNav          data-driven external-link menus
├── Breadcrumbs               library › section › category › prompt, above the content
├── LibraryHero               section heading + search field
├── PromptListToolbar         counts, stat badges, favorites/recent/tag filters, sort select
├── PromptGrid                loading skeletons, empty states, paginated grid + pagination
│   └── PromptCardGrid        responsive card grid (also used by featured + subcategory views)
│       └── PromptCard        title, tags, preview, row actions
├── PromptDetail              single-prompt view
│   └── SourcePanel           GitHub repo, copied-at commit, weekly drift verdict, compare link
├── SkillPacksView            skill-pack catalog (own tab)
├── EmptyState                empty My Library
├── PromptEditorModal         create / edit a My Library prompt
├── SettingsModal             appearance (mode + one of 12 themes), local data, keyboard shortcuts
├── CommandPalette            ⌘K across prompts, sections, actions and the two themes
└── ToastContainer
```

`PromptCardActions` (exported from `PromptGrid.tsx`) bundles the card-level props — the
library mode, transient copy/favorite state, and the row-action callbacks — so every grid
passes one object.

---

## Design Decisions

### 1. Local-first, no accounts

A prompt library is personal and small. Running it locally removes the database, the
password handling, the sessions and the hosting cost, and leaves the user owning plain
files. The trade-off is that there is no multi-device sync built in; pointing
`MY_LIBRARY_DIR` at a synced or git folder covers that.

### 2. Files, not a database, for My Library

Same format as the Public Library, so copying a prompt is a file write and the folder is
readable without the app. The store is small enough to list on every request; if a library
ever reaches thousands of files, a cache keyed on the folder's mtime is the upgrade.

### 3. One Express app everywhere

`api/index.ts` exports the app; Vercel runs it as a function and `server.ts` mounts it
locally. An earlier hand-copied dev server drifted from production, so `test:routes` now
pins the route table.

The MCP server (`site/mcp/server.ts`, [MCP-SERVER.md](features/MCP-SERVER.md)) is the one
other entry point. It does not import the Express app, because that logs to stdout on load and
a stdio server's stdout is the protocol. It shares `lib/library.ts`, `lib/my-library.ts`,
`lib/safe-path.ts` and the Skill Pack reader with the API instead, so both read the library the
same way.

### 4. Prebuilt index + in-memory cache

The public listing is built once at build time, so a cold Vercel function does not walk
thousands of files. A 5-minute in-memory cache of the serialized listings, lightweight and
full, covers warm instances; concurrent requests share one build. No external cache: it is a
read-only, read-heavy workload. `npm run bench` measures it ([PERFORMANCE.md](development/PERFORMANCE.md)).

### 5. Read-only by environment

The demo turns itself read-only from Vercel's own `VERCEL` variable, so a deploy cannot
forget to set a flag and end up writable.

---

## Security Considerations

- **Binding:** the server listens on `127.0.0.1` unless `HOST` is set. With no accounts,
  loopback is the access control. Exposing it needs `READ_ONLY=true` or an auth layer in
  front.
- **Host and Origin:** one middleware at the top of `api/index.ts` runs before every route
  on the shared app (prompt API, the dev-mounted skill-packs handler, Vite, `dist/`). It
  refuses a Host that is not `localhost`, `*.localhost`, an IP address or in `ALLOWED_HOSTS`
  (DNS rebinding), and a cross-site `Origin` on any write. Vercel skips the Host check: its
  edge routes by domain and the demo is read-only.
- **Read-only enforcement:** on the server, for every write route, not only in the UI.
- **My Library writes:** one field check in the store (`checkFields`); replacements go to a
  temp file and are renamed over the original, so a crash never leaves half a prompt; an
  update that names a stale `version` (a hash of the file) is refused with `409`; a pack
  install deletes what it wrote if any skill fails.
- **Path containment:** public-library reads, including Skill Pack manifest paths, go through
  `resolveInside()` (`lib/safe-path.ts`), which resolves first and compares after, so
  `a/../../b` is refused, and compares real paths for anything that exists, so a symlink or
  junction pointing out of `library/` is refused too. Skill downloads must also land under
  `3_Skills/`. ZIPs and the MCP file list walk folders with `filesUnder()`, which skips links. My Library ids are restricted to
  `^[a-z0-9-]+$`.
- **Headers and limits:** `helmet` sets the standard response headers on the API, with CSP off
  there; HSTS is Vercel's. On the demo, `vercel.json` gives the HTML and assets a CSP (scripts
  from self, the inline theme script by hash and `consent.js`; Google Fonts; inline styles),
  `frame-ancestors 'none'`, `X-Frame-Options`, `nosniff` and a referrer policy.
  `npm run test:browser` serves the same headers, so a change to `index.html`'s inline script
  that the hash doesn't match fails CI. JSON bodies are capped at 1 MB.
- **No secrets:** the app needs none. `site/.env.example` holds only optional settings.

See [SECURITY.md](../SECURITY.md) for the threat model and reporting.

---

## Deployment Architecture

### Local

```
npm run dev    → tsx server.ts               → Express + Vite HMR on 127.0.0.1:3010
npm start      → npm run build + server.ts --production → Express + dist/ on 127.0.0.1:3010
```

### Hosted demo (Vercel)

```
┌─────────────────────────────────────┐
│          Vercel Edge CDN            │
│        (static dist/ assets)        │
└─────────────┬───────────────────────┘
              │ vercel.json rewrites
┌─────────────▼───────────────────────┐
│      Vercel Serverless Functions    │
│  /api/skill-packs/* → skill-packs.ts│
│  /api/*             → index.ts      │
│  VERCEL set → READ_ONLY             │
└─────────────┬───────────────────────┘
              ▼
     site/library/ + prompt-index.json (bundled)
```

Build: Root Directory `site`, `vercel-build` (`build:index` → `tsc` → `vite build`), deploy
branch `main`, no environment variables. Details in [setup/DEPLOYMENT.md](setup/DEPLOYMENT.md).

---

## Error Handling Strategy

### API Layer

The public listing returns `[]` instead of a `500` when the library cannot be read, so the
UI shows its empty state rather than breaking; the error is logged. One file with malformed
frontmatter is skipped rather than emptying the listing, in both libraries. Other routes
return `{ "error": "..." }` with a `4xx`/`5xx` status.

### Frontend

- **Network errors:** toast, the app keeps running
- **A prompt's full text fails to load:** toast, and nothing opens, copies or downloads;
  the app never falls back to the listing's preview
- **Save conflict (`409`):** the editor reloads with the saved version and says why
- **Read-only 403s:** should not happen from the UI, since the controls are hidden
- **Empty state:** an empty My Library offers to browse the Public Library

---

## Testing Strategy

CI (`.github/workflows/ci.yml`) runs on every PR:

- `npm run lint` — type-check
- `npm run test:routes` — the route table, and that no auth router is mounted
- `npm run test:my-library` — the file store round trip and id containment, in a temp folder
- `npm run test:read-only` — under `READ_ONLY`, a seeded private prompt is never listed or served
- `npm run test:prompt-content` — `fetchFullPrompt` throws on a failed load instead of returning the preview
- `npm run test:markdown-file` — a downloaded `.md` reads back through the store unchanged
- `npm run test:safe-path` — `../` escapes and real junctions/symlinks out of the library, for detail and ZIPs
- `npm run test:browser` — after a build: the built app in Chrome, listing, detail and the dialog focus trap
- provenance and Agent Skills frontmatter checks, homepage links, diagram drift (warning)
- prompt index freshness

There are no UI or end-to-end tests.

---

## References

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)

---

**Last Updated:** October 21, 2026
