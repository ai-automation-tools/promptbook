---
title: "🔌 Exa"
description: "Web search and page fetching for an agent, returning clean ready-to-use content, with optional multi-step research runs."
tags: ["mcp-server", "web-and-search", "search", "research", "official"]
server:
  repo: exa-labs/exa-mcp-server
  license: "MIT"
  maintainer: "Exa (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-18
---

# Exa MCP server

Web search and page fetching for an agent, returning clean ready-to-use content, with optional multi-step research runs.

## Install

**Claude Code** (plugin from the official marketplace)

```bash
claude plugin install exa@claude-plugins-official
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "exa": {
      "type": "streamable-http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

## What it can do

- `web_search_exa` searches the web and returns clean content
- `web_fetch_exa` reads one or more URLs as markdown
- Optional tools, enabled with `?tools=` on the URL: `web_search_advanced_exa` (filters, domains, dates, subpage crawling) and `agent_run` (multi-step research and structured output)

## Notes

The default tools work from the hosted URL; the Exa Agent needs OAuth or an API key. Setting `?tools=` replaces the defaults, so list every tool you want.

## Details

| | |
|:---|:---|
| **Source** | [exa-labs/exa-mcp-server](https://github.com/exa-labs/exa-mcp-server) |
| **Maintainer** | Exa (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | None for the default tools; OAuth or API key for the Exa Agent |
| **Needs** | An Exa account for the agent tool |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
