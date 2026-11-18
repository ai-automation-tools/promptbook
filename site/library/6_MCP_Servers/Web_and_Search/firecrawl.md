---
title: "🔌 Firecrawl"
description: "Search the web, scrape any URL into clean Markdown, crawl or map a site, and run multi-source research jobs from an agent."
tags: ["mcp-server", "web-and-search", "scraping", "crawling", "official"]
server:
  repo: firecrawl/firecrawl-mcp-server
  license: "MIT"
  maintainer: "Firecrawl (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Firecrawl MCP server

Search the web, scrape any URL into clean Markdown, crawl or map a site, and run multi-source research jobs from an agent.

## Install

**Claude Code** (hosted server; scrape, search and parse work keyless and rate-limited)

```bash
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp
```

For the full tool set, use OAuth (`https://mcp.firecrawl.dev/v2/mcp-oauth`) or send `Authorization: Bearer <FIRECRAWL_API_KEY>` in a header. The README says never to put the key in the server URL.

**Any MCP client** (`mcpServers` config, local server)

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

## What it can do

- Search the web, optionally with each result's full content
- Scrape a URL to Markdown, and parse PDFs and documents
- Crawl a site or map its URLs; interact with dynamic pages in a real browser
- Run Agent jobs for multi-source research, and monitor pages for changes

## Notes

Crawling spends Firecrawl credits; the server can report usage. Respect each site's terms and robots rules. A self-hosted Firecrawl API works through `FIRECRAWL_API_URL`. A Docker image is published at `ghcr.io/firecrawl/firecrawl-mcp-server`.

## Details

| | |
|:---|:---|
| **Source** | [firecrawl/firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server) |
| **Maintainer** | Firecrawl (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio |
| **Auth** | None on the keyless tier; OAuth or API key otherwise |
| **Needs** | A Firecrawl account for full use; Node.js for the local server |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
