---
title: "🔌 Perplexity"
description: "Perplexity's official server: real-time web search, reasoning and research through the Perplexity API."
tags: ["mcp-server", "web-and-search", "search", "research", "official"]
server:
  repo: perplexityai/modelcontextprotocol
  license: "MIT"
  maintainer: "Perplexity (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Perplexity MCP server

Perplexity's official server: real-time web search, reasoning and research through the Perplexity API.

## Install

**Claude Code** (hosted server)

```bash
claude mcp add --transport http perplexity https://api.perplexity.ai/mcp --header "Authorization: Bearer YOUR_API_KEY"
```

**Claude Code** (local server)

```bash
claude mcp add perplexity --env PERPLEXITY_API_KEY="your_key_here" -- npx -y @perplexity-ai/mcp-server
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": {
        "PERPLEXITY_API_KEY": "your_key_here"
      }
    }
  }
}
```

## What it can do

- Web search and research grounded in current pages, through the Search API
- Reasoning and research answers through the Agent API
- Runs hosted by Perplexity or locally; a self-hosted HTTP mode exists for shared deployments

## Notes

Needs a Perplexity API key, billed to your API account. Behind a corporate proxy, set `PERPLEXITY_PROXY`. In self-hosted HTTP mode the server binds to loopback by default; only widen `BIND_ADDRESS` and `ALLOWED_ORIGINS` on a trusted network.

## Details

| | |
|:---|:---|
| **Source** | [perplexityai/modelcontextprotocol](https://github.com/perplexityai/modelcontextprotocol) |
| **Maintainer** | Perplexity (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio |
| **Auth** | API key (Bearer header, or env var for the local server) |
| **Needs** | A Perplexity API key; Node.js for the local server |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
