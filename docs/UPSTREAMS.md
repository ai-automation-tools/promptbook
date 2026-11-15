# Upstreams

Every external service, API, and platform the prompt library app depends on, what the code
assumes about each, and where to check whether that assumption still holds. The biweekly
**Prompt-Library Upstream Check** routine (`upstream/auto-*` PRs) works from this file. Keep it
current by hand too: a new API call is a new row.

App code paths are under `site/`, the Vercel Root Directory.

**Not in scope here:** the vendored skills and prompts under `site/library/`. Their upstream
repos are tracked per file in frontmatter and checked weekly by
`.github/workflows/upstream-drift.yml` (`scripts/check-upstream-drift.mjs`), which opens an
issue and never edits content. This file is about the app, not the library.

**Last checked** is filled in by the routine, and only with a date it actually read the
source. `—` means never checked.

## Data and APIs

None. Since 2026-10-21 the app calls no external service at runtime: the Public Library is read
from `site/library/` and My Library from local files. (Neon Postgres and the GitHub REST API were
tracked here until then.)

## Static assets

| Upstream | What the code assumes | Code | Check at | Last checked |
|:---|:---|:---|:---|:---|
| **Google Fonts** | `fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap` via a `<link>` in `index.html` (preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`) | `site/index.html` | developers.google.com/fonts/docs/css2 | 2026-11-13 |

## Hosting and runtime

| Upstream | What the code assumes | Where | Check at | Last checked |
|:---|:---|:---|:---|:---|
| **Vercel** | `vercel.json` `version: 2`; `functions["api/skill-packs.ts"].includeFiles: "library/3_Skills/**"`; rewrites `/api/skill-packs/:path*` → `/api/skill-packs`, `/api/(.*)` → `/api`, everything else → `/index.html`; `vercel-build` script; Node functions on Node 24 (`engines.node` `24.x` in `site/package.json`, which Vercel reads over the project setting; the project setting is also `24.x`, checked 2026-11-05; Vercel's default is Node 26 since 2026-10-29) | `site/vercel.json`, `site/package.json`, `site/api/*.ts` | vercel.com/changelog; vercel.com/docs/functions/runtimes/node-js/node-js-versions; vercel.com/docs/project-configuration | 2026-11-13 |
| **Node.js** | `engines.node` `24.x`; CI and `upstream-drift.yml` pin `node-version: "24"`; `@types/node` `^24`. Node 24 in maintenance since 2026-10-20 (EOL 2028-04-30), Node 26 LTS since 2026-10-28 (EOL 2029-04-30), Node 22 EOL 2027-04-30 | `site/package.json`, `.github/workflows/ci.yml`, `.github/workflows/upstream-drift.yml` | nodejs.org/en/about/previous-releases (EOL dates) | 2026-11-13 |
| **GitHub Actions** | `actions/checkout@v7` and `actions/setup-node@v7` in every workflow (v7.0.1 and v7.1.0 are the latest releases), `ubuntu-latest`, `gh` CLI preinstalled on the runner | `.github/workflows/*.yml` | github.com/actions/checkout/releases; github.com/actions/setup-node/releases; github.blog/changelog (label: actions) | 2026-11-13 |

## Framework majors

| Upstream | Declared in `site/package.json` | Check at | Last checked |
|:---|:---|:---|:---|
| MCP TypeScript SDK (`@modelcontextprotocol/server`; `@modelcontextprotocol/client` for the test) | `^2.3.1` (2.4.0, 2026-10-23, is the latest and installed; the current spec revision is 2026-07-28). The server uses `McpServer`, `registerTool`/`registerPrompt` with zod v4 schemas, and `serveStdio()` from `@modelcontextprotocol/server/stdio`, which also serves 2025-era clients. A v3 major, or a spec revision `serveStdio` stops negotiating, breaks `site/mcp/server.ts`; `npm run test:mcp` is the check | github.com/modelcontextprotocol/typescript-sdk/releases; modelcontextprotocol.io/specification (changelog) | 2026-11-13 |
| zod | `^4` (imported as `zod/v4` by the MCP server) | github.com/colinhacks/zod/releases | 2026-11-13 |
| React / react-dom | `^19.3.1` | react.dev/blog | 2026-11-13 |
| Express | `^5.3.0` (moved from 4 on 2026-10-27; wildcards are `*name`, `/{*splat}`) | expressjs.com/en/changelog; github.com/expressjs/express/releases | 2026-11-13 |
| Vite, @vitejs/plugin-react | `^8.3.5`, `^6.1.2` (moved from 6 and 5 on 2026-10-27; the lockfile pins 8.3.6, hit by GHSA-p4f5-76q4-ffq7, fixed in 8.3.7, queued on the ROADMAP) | github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md | 2026-11-13 |
| Tailwind CSS v4, @tailwindcss/vite | `^4.1.14`, `^4.3.3` | github.com/tailwindlabs/tailwindcss/releases | 2026-11-13 |
| TypeScript | `~7.0.2` (moved from 5.9 on 2026-10-27) | devblogs.microsoft.com/typescript | 2026-11-13 |
| helmet | `^8.3.0` (response headers) | github.com/helmetjs/helmet/releases | 2026-11-13 |
| fuse.js, react-markdown, remark-gfm, gray-matter, archiver, motion, lucide-react, dotenv | see `package.json`. On the current majors since 2026-11-07: archiver 8, dotenv 18 (injecting message to stderr), motion 14, lucide-react 1.x (brand icons removed; `Github` is redrawn from 0.577's icon node in `src/components/ui/GithubIcon.ts`) | each package's GitHub releases | 2026-11-13 |

Flag breaking majors, EOL runtimes, and security advisories only. Routine bumps are
Dependabot's job.
