---
title: "🔌 Resend"
description: "Send email and manage Resend domains, audiences and broadcasts from an agent."
tags: ["mcp-server", "apps-and-services", "email", "transactional", "official"]
server:
  repo: resend/resend-mcp
  license: "MIT"
  maintainer: "Resend (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Resend MCP server

Send email and manage Resend domains, audiences and broadcasts from an agent.

## Install

**Claude Code**

```bash
claude mcp add --transport http resend https://mcp.resend.com/mcp
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "resend": {
      "url": "https://mcp.resend.com/mcp"
    }
  }
}
```

## What it can do

- Send email
- Manage domains, contacts and audiences
- Create and send broadcasts

## Notes

Locally: `claude mcp add resend -e RESEND_API_KEY=re_xxx -- npx -y resend-mcp`. An agent that can send mail should ask before every send.

## Details

| | |
|:---|:---|
| **Source** | [resend/resend-mcp](https://github.com/resend/resend-mcp) |
| **Maintainer** | Resend (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio |
| **Auth** | OAuth on the remote server, or a Resend API key |
| **Needs** | A Resend account |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
