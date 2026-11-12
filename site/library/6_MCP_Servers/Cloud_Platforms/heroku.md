---
title: "🔌 Heroku"
description: "List, create, deploy and scale Heroku apps, manage add-ons and read logs by asking in natural language."
tags: ["mcp-server", "cloud-platforms", "heroku", "deployment", "paas", "official"]
server:
  repo: heroku/heroku-mcp-server
  license: "Apache-2.0"
  maintainer: "Heroku (official)"
  transport: "stdio"
  checked: 2026-11-12
---

# Heroku MCP server

List, create, deploy and scale Heroku apps, manage add-ons and read logs by asking in natural language.

## Install

Needs the Heroku CLI 10.8.1 or later, signed in. The README recommends `heroku mcp:start`, which reuses the CLI login.

**Claude Code**

```bash
claude mcp add heroku -- heroku mcp:start
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "heroku": {
      "command": "heroku mcp:start"
    }
  }
}
```

Without the CLI login, run the npm package with an API key:

```json
{
  "mcpServers": {
    "heroku": {
      "command": "npx",
      "args": ["-y", "@heroku/mcp-server"],
      "env": {
        "HEROKU_API_KEY": "<YOUR_HEROKU_AUTH_TOKEN>"
      }
    }
  }
}
```

## What it can do

- Create, rename, transfer and deploy apps (`create_app`, `deploy_to_heroku`)
- List, scale and restart dynos (`ps_list`, `ps_scale`, `ps_restart`)
- List and provision add-ons (`list_addons`, `create_addon`)
- Run code in a sandboxed one-off dyno

## Notes

The README calls the server early in development, so tools may change. It acts with your Heroku permissions and can scale, restart and deploy production apps: review each call, and prefer a token scoped to a team or a test app. It works on Common Runtime, Cedar Private and Shield Spaces, and Fir Private Spaces.

## Details

| | |
|:---|:---|
| **Source** | [heroku/heroku-mcp-server](https://github.com/heroku/heroku-mcp-server) |
| **Maintainer** | Heroku (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio |
| **Auth** | The Heroku CLI login, or `HEROKU_API_KEY` in an env var |
| **Needs** | Heroku CLI 10.8.1+, a Heroku account; Node.js for the `npx` form |

_Install lines read from the server's README on 2026-11-12. The Monthly Upkeep re-checks every card._
