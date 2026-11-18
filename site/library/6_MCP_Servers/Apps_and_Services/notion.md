---
title: "🔌 Notion"
description: "Search, read and edit Notion pages and databases through the Notion API."
tags: ["mcp-server", "apps-and-services", "notion", "notes", "productivity", "official"]
server:
  repo: makenotion/notion-mcp-server
  license: "MIT"
  maintainer: "Notion (official)"
  transport: "stdio"
  checked: 2026-11-18
---

# Notion MCP server

Search, read and edit Notion pages and databases through the Notion API.

## Install

**Claude Code**

```bash
claude mcp add notion -e NOTION_TOKEN=ntn_xxxx -- npx -y @notionhq/notion-mcp-server
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@notionhq/notion-mcp-server"
      ],
      "env": {
        "NOTION_TOKEN": "ntn_****"
      }
    }
  }
}
```

## What it can do

- Search the workspace
- Read and update pages and blocks
- Query and edit databases

## Notes

The integration only sees pages you share with it. Notion recommends its hosted Remote Notion MCP (OAuth) and gives active support only to that; this local server is the manual-token option.

## Details

| | |
|:---|:---|
| **Source** | [makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server) |
| **Maintainer** | Notion (official) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | A Notion integration token (`NOTION_TOKEN`) |
| **Needs** | Node.js, and a Notion integration shared with the pages it may use |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
