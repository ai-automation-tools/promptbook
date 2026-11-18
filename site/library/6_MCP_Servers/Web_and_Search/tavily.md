---
title: "🔌 Tavily"
description: "Real-time web search, page extraction, site mapping and crawling for an agent, through Tavily's API."
tags: ["mcp-server", "web-and-search", "search", "crawling", "official"]
server:
  repo: tavily-ai/tavily-mcp
  license: "MIT"
  maintainer: "Tavily (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Tavily MCP server

Real-time web search, page extraction, site mapping and crawling for an agent, through Tavily's API.

## Install

**Claude Code** (remote server, OAuth: run `/mcp` afterwards to sign in)

```bash
claude mcp add --transport http tavily https://mcp.tavily.com/mcp
```

With an API key instead, pass it in the URL: `https://mcp.tavily.com/mcp/?tavilyApiKey=<your-api-key>`.

**Any MCP client** (`mcpServers` config, local server)

```json
{
  "mcpServers": {
    "tavily-mcp": {
      "command": "npx",
      "args": ["-y", "tavily-mcp@latest"],
      "env": {
        "TAVILY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## What it can do

- Real-time web search with the search tool
- Extract content from web pages
- Map a site into a structured set of URLs
- Crawl a site systematically

## Notes

An API key in a URL ends up in client config and logs; prefer OAuth or the `Authorization: Bearer` header. Free accounts are available.

## Details

| | |
|:---|:---|
| **Source** | [tavily-ai/tavily-mcp](https://github.com/tavily-ai/tavily-mcp) |
| **Maintainer** | Tavily (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio |
| **Auth** | OAuth, or a Tavily API key (header, URL or `TAVILY_API_KEY`) |
| **Needs** | A Tavily account; Node.js for the local server |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
