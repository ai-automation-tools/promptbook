---
title: "🔌 Brave Search"
description: "Brave's official server: web, news, image, video, local and place search, plus LLM-ready page context and summaries."
tags: ["mcp-server", "web-and-search", "search", "news", "official"]
server:
  repo: brave/brave-search-mcp-server
  license: "MIT"
  maintainer: "Brave (official)"
  transport: "stdio, HTTP"
  checked: 2026-11-18
---

# Brave Search MCP server

Brave's official server: web, news, image, video, local and place search, plus LLM-ready page context and summaries.

## Install

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server", "--transport", "stdio"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

A Docker variant (`docker run -i --rm -e BRAVE_API_KEY docker.io/mcp/brave-search`) is in the README.

## What it can do

- `brave_web_search`, `brave_news_search`, `brave_image_search` and `brave_video_search`
- `brave_local_search` and `brave_place_search` for businesses and points of interest
- `brave_llm_context` for pre-extracted page content sized for an agent, and `brave_summarizer` for AI summaries

## Notes

Needs a Brave Search API key from the developer dashboard. Local search and extra snippets need a Pro plan. Since 2.x the default transport is stdio; set `BRAVE_MCP_TRANSPORT=http` for HTTP, which is unauthenticated and binds to 127.0.0.1 by default. `BRAVE_MCP_ENABLED_TOOLS` and `BRAVE_MCP_DISABLED_TOOLS` trim the tool list.

## Details

| | |
|:---|:---|
| **Source** | [brave/brave-search-mcp-server](https://github.com/brave/brave-search-mcp-server) |
| **Maintainer** | Brave (official) |
| **Licence** | MIT |
| **Transport** | stdio, HTTP |
| **Auth** | API key in an env var |
| **Needs** | Node.js (or Docker) and a Brave Search API key |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
