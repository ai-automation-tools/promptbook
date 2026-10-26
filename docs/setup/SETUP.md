# Setup Guide

How to run Promptbook on your own machine. There is no database, no account and no
required configuration: the Public Library is markdown in `site/library/`, and your own
prompts (My Library) are markdown files in a folder you choose.

---

## Prerequisites

- **Node.js** 22 ([download](https://nodejs.org/)) or 24 — CI pins 22 (Node 20 is past end of life)
- **npm**
- **Git** ([download](https://git-scm.com/))

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/ai-automation-tools/promptbook.git
cd promptbook/site
```

Everything that runs (`package.json`, `api/`, `lib/`, `library/`, `server.ts`) lives under
`site/`. Run every `npm` command below from there.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npm run dev     # Vite with hot reload
# or
npm start       # build once, then serve dist/
```

Open **http://localhost:3010**. The server prints the folder it is using for My Library on
startup.

---

## Configuration (optional)

No `.env` is needed. To change a default, copy `site/.env.example` to `site/.env` and
uncomment what you want:

| Variable | Default | What it does |
|:---|:---|:---|
| `MY_LIBRARY_DIR` | `my-library` | Folder that holds My Library. Relative paths resolve against `site/`; absolute paths are used as-is. |
| `HOST` | `127.0.0.1` | Address the server listens on. See [Exposing it beyond localhost](#exposing-it-beyond-localhost). |
| `READ_ONLY` | `false` | `true` serves the Public Library only and refuses every write with `403`. Vercel turns this on automatically. |
| `ALLOWED_HOSTS` | (none) | Extra hostnames the server answers to (pages and API, in `npm run dev` and `npm start`), comma-separated; a leading dot (`.ts.net`) allows subdomains. `localhost`, `*.localhost` and IP addresses always work. Needed behind a proxy that forwards its own Host header, such as `tailscale serve`; see [Over Tailscale](#over-tailscale). |

---

## My Library on disk

Each prompt you create, copy from the Public Library or add from a skill pack is one `.md`
file in `MY_LIBRARY_DIR` (default `site/my-library/`, which is gitignored).

- **File name = id.** New files are named `<slug-of-title>-<6 hex>.md`, for example
  `code-review-checklist-3fa9c1.md`. The name never changes after creation, so renaming a
  prompt does not break links to it.
- **Frontmatter** holds the metadata; the body is the prompt:

  ```markdown
  ---
  title: Code review checklist
  section: 4_Prompts
  category: Coding
  subcategory: null
  tags:
    - review
  created: '2026-10-21T14:02:11.000Z'
  updated: '2026-10-21T14:02:11.000Z'
  ---
  Review this diff for...
  ```

- **Hand-editing is fine.** Missing fields fall back to defaults (`section` → `4_Prompts`,
  `category` → `Uncategorized`, `updated` → the file's modified time). A file you add by
  hand must use a lowercase `a-z0-9-` name to be picked up as an id. If you change a file
  while the app's editor has it open, saving in the app is refused and the editor reloads
  your version instead of overwriting it.
- **Skill packs** you add are ordinary My Library files tagged `skill-pack:<packId>`.
  Removing the pack deletes the files with that tag.

**Backing it up:** point `MY_LIBRARY_DIR` at a folder that is already synced or under git,
for example `MY_LIBRARY_DIR=D:/Notes/prompts`. There is nothing else to back up.

---

## Exposing it beyond localhost

There are no accounts. Anyone who can reach the server can create, edit and delete
everything in My Library. That is why it listens on `127.0.0.1` by default.

If you set `HOST=0.0.0.0` (or put it behind a reverse proxy), do one of these first:

- set `READ_ONLY=true`, which makes it a Public Library browser like the hosted demo, or
- put your own authentication in front of it (a VPN, an authenticating proxy, basic auth).

### Over Tailscale

The simplest way to reach the app from your other devices is to leave `HOST` alone and let
Tailscale proxy the loopback port to your tailnet only (not Funnel, which is the public internet):

```bash
tailscale serve --bg --http=3010 http://127.0.0.1:3010
```

Then set `ALLOWED_HOSTS` in `site/.env` to the names Tailscale forwards, for example
`ALLOWED_HOSTS=my-pc,my-pc.tailnet-name.ts.net`. The server answers `403` to any other
Host name, on pages and API alike, so a site that rebinds its own domain to your PC cannot
read My Library through it. The tailnet is the authentication here: every device on it can
read **and edit** My Library, exactly as this PC can, while pages on other sites still cannot
post to it (the Origin check). `READ_ONLY=true` turns the server into a Public Library
browser for everyone, this PC included: My Library is neither shown nor served, not just
locked against edits.

The MCP server is not affected by any of this: it talks to agents over stdio on this machine.

> [!NOTE]
> `READ_ONLY` is read twice: by the server, which refuses writes and stops serving My Library, and by `vite build`, which
> hides the write controls in the UI. Both load `site/.env`, so one line there covers
> `npm run dev` and `npm start` alike.

---

## Checks

```bash
npm run lint             # tsc --noEmit
npm run test:routes      # the API route table is intact
npm run test:my-library  # My Library file store round-trip, in a temp folder
npm run test:read-only   # read-only mode hides My Library
npm run test:prompt-content  # a failed prompt load never falls back to the preview
npm run test:markdown-file   # a downloaded .md reads back unchanged
npm run test:mcp             # the MCP server, end to end over stdio
npm run test:safe-path       # ../ escapes and links out of library/ are refused
npm run test:browser         # after npm run build: the built app in Chrome
npm run build:index      # rebuild api/prompt-index.json after editing library/
```

CI runs these on every PR, plus the provenance and homepage checks from the repo root.

---

## Troubleshooting

### My Library is empty after changing `MY_LIBRARY_DIR`

The app reads only the folder it printed at startup. Check the path in the console, and
remember a relative path resolves against `site/`, not the directory you ran `npm` from.

### A hand-edited prompt does not show up

The file name must be lowercase letters, digits and hyphens with a `.md` extension. A file
with broken YAML frontmatter is skipped with a `[MY-LIBRARY] Skipping unreadable` warning in
the server console.

### Saving fails with `403`

The server is in read-only mode. Unset `READ_ONLY` (and make sure `VERCEL` is not set in
your shell).

### The page goes black when opening a prompt

The dev server is stale. Restart it (stop it, `npm run dev`) and hard-refresh; if that is not
enough, delete `site/node_modules/.vite` and restart again. Restart after every `npm install`,
lockfile update (a Dependabot merge, a `git pull`) or library/API change: the server loads the
prompt index and API code once and does not pick up changes. A stale one also lists deleted
items that 404 when opened. Since 2026-10-26 the page shows "Something failed to load" with a
Reload button instead of going black. A black screen on a
Skill Pack was a separate bug, fixed the same day. Details in the
[Debug Guide](../development/DEBUG_UI.md#issue-6-black-screen-when-opening-a-prompt).

### Build failures

```bash
npm run lint    # type errors
npm run build   # full build: index, tsc, vite
```

---

## Next Steps

- [**API Reference**](../features/API.md) - the REST endpoints
- [**Architecture**](../ARCHITECTURE.md) - how the pieces fit
- [**Hosted demo**](DEPLOYMENT.md) - how the read-only demo is built on Vercel

---

**Need help?** Open an issue on [GitHub](https://github.com/ai-automation-tools/promptbook/issues)
