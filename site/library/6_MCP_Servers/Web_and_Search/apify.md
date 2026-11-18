---
title: "🔌 Apify"
description: "Lets an agent find and run Apify Actors from the Apify Store, scraping and automation tools, and read their runs and datasets."
tags: ["mcp-server", "web-and-search", "scraping", "automation", "official"]
server:
  repo: apify/apify-mcp-server
  license: "MIT"
  maintainer: "Apify (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Apify MCP server

Lets an agent find and run Apify Actors from the Apify Store, scraping and automation tools, and read their runs and datasets.

## Install

**Claude Code** (hosted server; sign in with OAuth in the browser)

```bash
claude mcp add apify "https://mcp.apify.com" -t http
```

**Any MCP client** (`mcpServers` config, local server; Node.js 22 or later)

```json
{
  "mcpServers": {
    "actors-mcp-server": {
      "command": "npx",
      "args": ["-y", "@apify/actors-mcp-server"],
      "env": {
        "APIFY_TOKEN": "YOUR_APIFY_TOKEN"
      }
    }
  }
}
```

If a client cannot use OAuth, send the token in an `Authorization: Bearer <APIFY_TOKEN>` header.

## What it can do

- Search Apify Store, read an Actor's input schema and run it
- Search and fetch the Apify and Crawlee docs
- List runs, read logs, datasets and key-value stores
- Manage tasks, schedules and Actor builds; choose which tool categories load

## Notes

Actor runs cost Apify credits, and the token can change or delete your Actors: use a token for this purpose and keep it out of repositories. The README has a pricing and limits section.

## Details

| | |
|:---|:---|
| **Source** | [apify/apify-mcp-server](https://github.com/apify/apify-mcp-server) |
| **Maintainer** | Apify (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio |
| **Auth** | OAuth on the hosted server, or an Apify API token |
| **Needs** | An Apify account |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
