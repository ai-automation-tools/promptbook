---
title: "🔌 n8n workflow builder"
description: "Node documentation, validation and templates for n8n, so an agent can design and deploy working workflows."
tags: ["mcp-server", "apps-and-services", "n8n", "automation", "workflows"]
server:
  repo: czlonkowski/n8n-mcp
  license: "MIT"
  maintainer: "czlonkowski (community)"
  transport: "stdio, HTTP"
  checked: 2026-11-18
---

# n8n workflow builder MCP server

Node documentation, validation and templates for n8n, so an agent can design and deploy working workflows.

## Install

**Claude Code**

```bash
claude mcp add n8n-mcp -e MCP_MODE=stdio -- npx n8n-mcp
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": [
        "n8n-mcp"
      ],
      "env": {
        "MCP_MODE": "stdio"
      }
    }
  }
}
```

## What it can do

- Look up any n8n node's properties and operations
- Validate and test a workflow before it runs
- Create, edit in place and roll back workflows on your instance (with API access)
- Read failed executions and manage credentials

## Notes

`MCP_MODE=stdio` is required for desktop clients. A hosted version runs at dashboard.n8n-mcp.com. It overwrites the whole workflow on each edit, so don't edit the same workflow in the n8n UI meanwhile; try changes on a copy first.

## Details

| | |
|:---|:---|
| **Source** | [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) |
| **Maintainer** | czlonkowski (community) |
| **Licence** | MIT |
| **Transport** | stdio, HTTP |
| **Auth** | None for node docs; `N8N_API_URL` and `N8N_API_KEY` to manage workflows |
| **Needs** | Node.js; an n8n instance for the management tools |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
