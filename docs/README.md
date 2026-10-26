# Documentation

Documentation for **Promptbook**, a prompt library you clone and run locally. The
Public Library is also browsable read-only at
[promptbook-demo.ai-automation-tools.dev](https://promptbook-demo.ai-automation-tools.dev).

---

## 📚 Quick Links

### Getting Started
- **[Setup Guide](setup/SETUP.md)** — run it locally, configure My Library
- **[Hosted Demo](setup/DEPLOYMENT.md)** — how the read-only demo is built on Vercel
- **[Architecture](ARCHITECTURE.md)** — system design, repo layout, technology stack
- **[Diagrams](diagrams/README.md)** — the library data-flow diagram the [homepage](https://promptbook.ai-automation-tools.dev/#diagram) shows: `library/` → build index → API → React app, plus My Library and skill packs. Interactive, every node linked to its code, and drift-checked in CI

### Creating Content
- **[Contributing Guide](CONTRIBUTING.md)** — how to add content of any type
- **[Templates](templates/)** — starter templates for all six content types
- **[Skill Packs](skill-packs/)** — create and manage skill pack collections

### Features
- **[API Reference](features/API.md)** — REST endpoints
- **[Library Modes](features/LIBRARY-MODE-IMPLEMENTATION.md)** — Public vs My Library
- **[Featured Prompts](features/FEATURED-PROMPTS.md)** — highlighting top prompts
- **[MCP Server](mcp-server.md)** — the server on one page: entry file, transport, tools, install line
- **[MCP Server design](features/MCP-SERVER.md)** — how it works and why: stdout rules, containment, prompts

### Development
- **[Debug Guide](development/DEBUG_UI.md)** — troubleshooting
- **[Performance](development/PERFORMANCE.md)** — `npm run bench`, the baseline and the budgets

### Project policies (repo root)
- **[LICENSE](../LICENSE)** — Apache 2.0 for the application code
- **[NOTICE](../NOTICE)** — vendored library content keeps its own licenses
- **[SECURITY.md](../SECURITY.md)** — how to report a vulnerability, what is in scope
- **[CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)**
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** — the short version; the full guide is [here](CONTRIBUTING.md)

### Planning & Status
- **[Discovery ledger](DISCOVERY.md)** — GitHub repos found for the library, and what was decided about each
- **[Upstreams](UPSTREAMS.md)** — what the app depends on, checked biweekly
- **[Roadmap](ROADMAP.md)** — what's next
- **[Changelog](CHANGELOG.md)** — shipped work, newest first
- Upstream drift: the rolling **Upstream drift** issue on GitHub (weekly report) and
  `site/api/upstream-status.json` (each item's verdict, shown on its page)

---

## 📂 Directory Structure

```
docs/
├── README.md                     # This file
├── ROADMAP.md                    # What's next
├── CHANGELOG.md                  # Shipped work, newest first
├── ARCHITECTURE.md               # System design and repo layout
├── CONTRIBUTING.md               # How to add content
├── DISCOVERY.md                  # Repo-intake ledger (Discovery job adds, Mike decides)
├── UPSTREAMS.md                  # App dependencies the upstream check watches
├── mcp-server.md                 # The MCP server on one page
│
├── setup/
│   ├── SETUP.md                  # Local setup
│   └── DEPLOYMENT.md             # The read-only hosted demo
│
├── templates/                    # Content templates, one per section
│   ├── README.md
│   ├── prompt-library-template.md
│   ├── agent-guides-template.md
│   ├── agents-template.md
│   ├── system-prompts-template.md
│   ├── skills-template.md
│   ├── mcp-servers-template.md
│   └── TEMPLATE-SUMMARY.md
│
├── skill-packs/
│   ├── README.md                 # Complete guide
│   ├── QUICK-START.md
│   └── PACK-TEMPLATE.json
│
├── features/
│   ├── API.md
│   ├── LIBRARY-MODE-IMPLEMENTATION.md
│   ├── FEATURED-PROMPTS.md
│   └── MCP-SERVER.md             # The library as an MCP server
│
└── development/
    ├── DEBUG_UI.md
    └── PERFORMANCE.md
```

> Superseded planning docs (an older `docs/archive/`, `QUICK_REFERENCE.md`, `library-update-logs/`) were
> removed on 2026-08-26. They remain in Git history; the entries worth keeping were folded
> into [CHANGELOG.md](CHANGELOG.md). The repo-root `archive/` is different: since 2026-10-26 it holds
> the library items taken out of service (the prompts and guides with no GitHub repo) and the
> retired prompt generators; see [`archive/README.md`](../archive/README.md).

---

## 🚀 Quick Start Paths

**...run the app locally** → [Setup Guide](setup/SETUP.md), then `cd site && npm run dev`

**...understand the hosted demo** → [Hosted Demo](setup/DEPLOYMENT.md) → [Architecture](ARCHITECTURE.md)

**...add new content** → [Contributing Guide](CONTRIBUTING.md) → [Templates](templates/)

**...understand the codebase** → [Architecture](ARCHITECTURE.md) → [API Reference](features/API.md)

**...know what needs doing** → [Roadmap](ROADMAP.md)

**...understand why the plan looks like this** → [Roadmap](ROADMAP.md) → [Changelog](CHANGELOG.md) (older audits and the 2026-08-27 plan are in git history)

**...troubleshoot** → [Debug Guide](development/DEBUG_UI.md)

---

## 📝 Content Templates

| Template | Use for | Library section |
|:---|:---|:---|
| 📌 **[Prompts](templates/prompt-library-template.md)** | General AI prompts | `4_Prompts/` |
| 💻 **[Guides](templates/agent-guides-template.md)** | Platform documentation | `1_Guides/` |
| 🤖 **[Agents](templates/agents-template.md)** | Agent definitions | `2_Agents/` |
| 📝 **[System Prompts](templates/system-prompts-template.md)** | LLM instructions | `5_System_Prompts/` |
| 🔌 **[MCP Servers](templates/mcp-servers-template.md)** | Server cards with install lines | `6_MCP_Servers/` |
| 🔧 **[Skills](templates/skills-template.md)** | Agent Skills (`SKILL.md`) | `3_Skills/` |

See the [Templates README](templates/README.md) for the detailed usage guide.

Skills additionally have to satisfy the Agent Skills spec: `name` must be lowercase-hyphen
and match the containing directory, and `description` is required. Run
`node scripts/fix-skill-frontmatter.mjs` to check, and
`node scripts/skill-frontmatter.test.mjs` to verify the whole section.

---

## 🏗️ Stack

| Layer | Technology |
|:---|:---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind v4, Fuse.js |
| Backend | One Express app: `server.ts` locally, Vercel serverless handlers for the demo |
| Data | Public Library = markdown in `site/library/`; My Library = markdown files in `MY_LIBRARY_DIR` (default `site/my-library/`) |
| Auth | None. The server binds to `127.0.0.1`; the demo is read-only |
| Hosting | Runs locally; read-only demo on Vercel (Root Directory `site`) |

See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

---

## 🔧 Development

Prerequisites: Node.js 22 or 24, Git. No database, no `.env` needed.

```bash
cd site                     # the whole app lives here
npm install
npm run dev                 # http://localhost:3010 (npm start: build, then serve dist/)
npm run build               # build:index -> tsc -> vite build
npm run lint                # tsc --noEmit
npm run test:routes         # API route table
npm run test:my-library     # My Library file store
npm run test:read-only      # read-only mode hides My Library
npm run test:prompt-content # a failed prompt load never falls back to the preview
npm run test:markdown-file  # a downloaded .md reads back unchanged
npm run test:mcp            # the MCP server, end to end over stdio
npm run test:safe-path      # ../ escapes and links out of library/ are refused
npm run test:browser        # after npm run build: the built app in Chrome
npm run build:index         # regenerate api/prompt-index.json from library/
npm run bench               # heavy endpoints vs development/PERFORMANCE.md
```

Repo-level tooling lives in `scripts/`, outside the deploy root:

```bash
node scripts/check-upstream-drift.mjs      # what has drifted from upstream (--json: the status file)
node scripts/resync-upstream.mjs <skill>   # pull a skill (or 2_Agents/….md) level with upstream
node scripts/attribute-upstream.mjs        # re-stamp provenance; --agents for 2_Agents (see header)
node scripts/reattribute-unclear.mjs       # code-search pass over unknown/ambiguous items (needs GITHUB_TOKEN)
node scripts/attribute-system-prompts.mjs  # stamp 5_System_Prompts from clones of the collections (see header)
node scripts/fix-skill-frontmatter.mjs     # enforce the Agent Skills spec
node scripts/upstream.test.mjs             # self-checks (CI runs both)
node scripts/skill-frontmatter.test.mjs
```

Provenance vocabulary: `upstream.match` records *attribution confidence* — `exact`,
`prefix`, `similar`, `ambiguous`, `unknown`, `fork`, and `vendor` (a system prompt from the
vendor's own page, with `url`). It never records freshness. Every skill, agent, system prompt
and MCP card must name a source; `upstream.test.mjs` fails CI on one that doesn't.
`behind` is a verdict `check-upstream-drift.mjs` assigns at run time and belongs
only in its report; `upstream.test.mjs` fails if it ever lands in frontmatter.

Optional settings (`MY_LIBRARY_DIR`, `HOST`, `READ_ONLY`) are listed in `site/.env.example`
and the [Setup Guide](setup/SETUP.md#configuration-optional).

---

## 📊 Project Status

A local-first app with a read-only hosted demo. There are no accounts or database to
secure: the server binds to loopback, the demo refuses every write, path traversal is
closed, `helmet` sets headers, and the library carries no personal contact details or
sample credentials. See [SECURITY.md](../SECURITY.md) for the threat model and
[ROADMAP.md](ROADMAP.md) for open work.

A weekly GitHub Action (`.github/workflows/upstream-drift.yml`) checks every vendored skill
and agent against its upstream repo. It posts the report to one rolling issue, resyncs the
items whose local copy adds under 10% of its own lines, refreshes `site/api/upstream-status.json`
and opens one **Resync from upstream** pull request. Nothing merges without a person reading
the diff. Each item's page shows its repo, the commit it was copied at, its status at the last
check and a link to what changed upstream since.

---

## 🤝 Contributing

**Content:** pick a template from [templates/](templates/), follow
[CONTRIBUTING.md](CONTRIBUTING.md), include the required metadata fields, and put the file
in the right section directory. Then run `npm run build:index` from `site/` so the index
reflects it.

**Code:** branch off `main`, keep the existing style (strict TS, no `any`; Tailwind
utility-first), run `npm run lint` and `npm run build`, and open a PR describing the change.

---

## 📖 Additional Resources

- **Main README:** [../README.md](../README.md)
- **Agent guide:** [../AGENTS.md](../AGENTS.md) (`CLAUDE.md` imports it)
- **Repository:** [github.com/ai-automation-tools/promptbook](https://github.com/ai-automation-tools/promptbook)
- **Read-only demo:** [promptbook-demo.ai-automation-tools.dev](https://promptbook-demo.ai-automation-tools.dev)

---

**Last updated:** 2026-10-21
