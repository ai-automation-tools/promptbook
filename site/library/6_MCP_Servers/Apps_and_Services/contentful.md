---
title: "🔌 Contentful"
description: "Contentful's server: create, edit, organise and publish entries, assets and content types in a space."
tags: ["mcp-server", "apps-and-services", "cms", "content", "official"]
server:
  repo: contentful/contentful-mcp-server
  license: "MIT"
  maintainer: "Contentful (official)"
  transport: "stdio"
  checked: 2026-11-18
---

# Contentful MCP server

Contentful's server: create, edit, organise and publish entries, assets and content types in a space.

## Install

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "contentful-mcp": {
      "command": "npx",
      "args": ["-y", "@contentful/mcp-server"],
      "env": {
        "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN": "your-CMA-token",
        "SPACE_ID": "your-space-id",
        "ENVIRONMENT_ID": "master",
        "CONTENTFUL_HOST": "api.contentful.com"
      }
    }
  }
}
```

## What it can do

- Create, update and delete content types, entries and assets
- Run AI actions, for example translating content
- Export a space, and list and search entries

## Notes

The token is a Contentful Management API personal access token, so it can write. Set `PROTECTED_ENVIRONMENTS` (for example `master,staging`) to block write and delete calls to those environments; reads stay open. The guard only covers this server, so keep role-based permissions in place too.

## Details

| | |
|:---|:---|
| **Source** | [contentful/contentful-mcp-server](https://github.com/contentful/contentful-mcp-server) |
| **Maintainer** | Contentful (official) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | Management API personal access token in an env var |
| **Needs** | Node.js, a Contentful account and Space ID |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
