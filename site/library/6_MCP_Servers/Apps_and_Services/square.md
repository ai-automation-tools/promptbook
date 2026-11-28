---
title: "🔌 Square"
description: "Square's server for its Connect API (catalog, customers, orders, bookings, inventory and more), hosted with OAuth or run locally with an access token."
tags: ["mcp-server", "apps-and-services", "square", "payments", "commerce", "official"]
server:
  repo: square/square-mcp-server
  license: "Apache-2.0"
  maintainer: "Square (official)"
  transport: "stdio, HTTP (remote)"
  checked: 2026-11-27
---

# Square MCP server

Square's server for its Connect API (catalog, customers, orders, bookings, inventory and more), hosted with OAuth or run locally with an access token.

| | |
|:---|:---|
| **Source** | [square/square-mcp-server](https://github.com/square/square-mcp-server) |
| **Maintainer** | Square (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio, HTTP (remote) |
| **Auth** | OAuth on the hosted server; `ACCESS_TOKEN` env var for the local one |
| **Needs** | A Square account; Node.js for the local route |

## Install

Square recommends the hosted server (`https://mcp.squareup.com/mcp`, OAuth sign-in). Beta.

**Any MCP client, remote** (`mcpServers` config)

```json
{
  "mcpServers": {
    "mcp_square_api": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.squareup.com/mcp"]
    }
  }
}
```

**Any MCP client, local** (sandbox)

```json
{
  "mcpServers": {
    "mcp_square_api": {
      "command": "npx",
      "args": ["square-mcp-server", "start"],
      "env": {
        "ACCESS_TOKEN": "YOUR_SQUARE_ACCESS_TOKEN",
        "SANDBOX": "true"
      }
    }
  }
}
```

## What it can do

- Three tools (`get_service_info`, `get_type_info`, `make_api_request`) that discover and call Square's API services
- Cover catalog, customers, bookings, inventory, gift cards, disputes and more
- Local options: `SANDBOX`, `PRODUCTION`, `DISALLOW_WRITES` and `SQUARE_VERSION`

## Notes

It can move real money and customer data in production. Start in the sandbox, set `DISALLOW_WRITES=true` for read-only work on the local server, and keep the access token out of committed config.

_Install lines read from the server's README on 2026-11-27. The Monthly Upkeep re-checks every card._
