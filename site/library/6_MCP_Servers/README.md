# 6_MCP_Servers: MCP servers worth installing

One card per [Model Context Protocol](https://modelcontextprotocol.io/) server: what it gives an
agent, who maintains it, its licence, how it authenticates, and install lines for Claude Code and
for any client that reads an `mcpServers` config. Every install line was read from the server's
own README on the date in its `server.checked` field. The cards are our write-ups; the servers
themselves are installed from their sources, never vendored here.

## What is here

| Folder | Servers |
|:---|:---|
| `Reference/` | Filesystem, Fetch, Memory, Sequential Thinking, Git, Time (`modelcontextprotocol/servers`), Microsoft Learn |
| `Browser_Automation/` | Playwright, Chrome DevTools |
| `Developer_Tools/` | GitHub, Context7, MarkItDown, REA, Codebase Memory, Grafana, Serena, Context Mode, Framelink for Figma, Docker MCP Gateway, Azure DevOps, Postman, Mobile MCP, Sentry, Datadog, and this library's own server |
| `Cloud_Platforms/` | Supabase, Cloudflare, AWS, MongoDB, Neon, Terraform, Heroku, Azure, Kubernetes, Firebase |
| `Databases/` | MCP Toolbox for Databases, ClickHouse, Qdrant, Redis, DuckDB and MotherDuck, Postgres MCP Pro |
| `Web_and_Search/` | Exa, Tavily, Firecrawl, Apify, Perplexity, Brave Search |
| `Apps_and_Services/` | Notion, n8n workflow builder, Resend, Stripe, Atlassian, Hugging Face, Blender, Todoist, Contentful, Google Analytics, Sanity, Zapier, Square |

60 cards, started 2026-10-21.

## How it stays current

- **New servers.** The Friday MCP finder (`promptbook-find-mcp`) adds 3–5 cards a run for
  servers that are trending now, written from
  [`docs/templates/mcp-servers-template.md`](../../../docs/templates/mcp-servers-template.md).
- **Kept current.** Every third Saturday the Library Keeper repoints renamed repos and re-reads
  the install lines of the five least recently checked cards.
- **Upkeep.** The Monthly Upkeep runs `node scripts/check-mcp-servers.mjs`, which flags cards
  whose repo is missing, renamed, archived, relicensed, quiet for a year, or not re-read in 90
  days, then fixes the install lines or removes the card.

## Adding one by hand

Copy the template, fill it from the server's README, then from the repo root run
`node scripts/backfill-tags.mjs` and `node scripts/check-mcp-servers.mjs`, and rebuild the index
(`npm run build:index` in `site/`).
