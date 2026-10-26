# 6_MCP_Servers: MCP servers worth installing

One card per [Model Context Protocol](https://modelcontextprotocol.io/) server: what it gives an
agent, who maintains it, its licence, how it authenticates, and install lines for Claude Code and
for any client that reads an `mcpServers` config. Every install line was read from the server's
own README on the date in its `server.checked` field. The cards are our write-ups; the servers
themselves are installed from their sources, never vendored here.

## What is here

| Folder | Servers |
|:---|:---|
| `Reference/` | Filesystem, Fetch, Memory, Sequential Thinking, Git, Time (`modelcontextprotocol/servers`) |
| `Browser_Automation/` | Playwright, Chrome DevTools |
| `Developer_Tools/` | GitHub, Context7, MarkItDown, REA, Codebase Memory, and this library's own server |
| `Cloud_Platforms/` | Supabase, Cloudflare, AWS, MongoDB, Neon |
| `Apps_and_Services/` | Notion, n8n workflow builder, Resend, Stripe |

23 cards, started 2026-10-21.

## How it stays current

- **New servers.** The Tuesday Discovery job queues MCP repos in `docs/DISCOVERY.md`. Rows Mike
  marks `accept` become cards in the Thursday Catalog Refresh (up to 3 a run), written from
  [`docs/templates/mcp-servers-template.md`](../../../docs/templates/mcp-servers-template.md).
- **Upkeep.** The Monthly Upkeep runs `node scripts/check-mcp-servers.mjs`, which flags cards
  whose repo is missing, renamed, archived, relicensed, quiet for a year, or not re-read in 90
  days, then fixes the install lines or removes the card.

## Adding one by hand

Copy the template, fill it from the server's README, then from the repo root run
`node scripts/backfill-tags.mjs` and `node scripts/check-mcp-servers.mjs`, and rebuild the index
(`npm run build:index` in `site/`).
