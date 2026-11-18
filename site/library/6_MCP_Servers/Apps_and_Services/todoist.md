---
title: "🔌 Todoist"
description: "Todoist's hosted server: find, add and update tasks and projects in your Todoist account."
tags: ["mcp-server", "apps-and-services", "tasks", "productivity", "official"]
server:
  repo: todoist/todoist-mcp
  license: "MIT"
  maintainer: "Doist (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Todoist MCP server

Todoist's hosted server: find, add and update tasks and projects in your Todoist account.

## Install

**Claude Code**

```bash
claude mcp add --transport http todoist https://ai.todoist.net/mcp
```

Then run `/mcp` inside Claude Code and pick `todoist` to sign in.

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "todoist": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://ai.todoist.net/mcp"]
    }
  }
}
```

## What it can do

- Read and change tasks and projects on your behalf
- Tools built around whole workflows (for example finding tasks by date) rather than single API calls
- `search` and `fetch` tools that follow the OpenAI MCP specification

## Notes

Todoist hosts the server, so no API key or local process is needed. Revoke access in Todoist under Settings → Integrations. The same tools ship as the `@todoist/mcp` npm package for use in your own agent code.

## Details

| | |
|:---|:---|
| **Source** | [todoist/todoist-mcp](https://github.com/todoist/todoist-mcp) |
| **Maintainer** | Doist (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio |
| **Auth** | OAuth sign-in to your Todoist account |
| **Needs** | A Todoist account |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
