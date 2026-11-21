---
title: "🔌 Datadog"
description: "Datadog's managed server that lets an agent query logs, metrics, traces, incidents and more from your Datadog account."
tags: ["mcp-server", "developer-tools", "datadog", "observability", "incidents", "official"]
server:
  repo: datadog-labs/mcp-server
  license: "MIT"
  maintainer: "Datadog (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-20
---

# Datadog MCP server

Datadog's managed server that lets an agent query logs, metrics, traces, incidents and more from your Datadog account.

## Install

**Claude Code** (US1 site)

```bash
claude mcp add --transport http datadog https://mcp.datadoghq.com/v1/mcp
```

**Any MCP client** (`.mcp.json` / `mcpServers` config)

```json
{
  "mcpServers": {
    "datadog": {
      "type": "http",
      "url": "https://mcp.datadoghq.com/v1/mcp"
    }
  }
}
```

Not on the US1 site? Swap `mcp.datadoghq.com` for your [Datadog site](https://docs.datadoghq.com/getting_started/site/)'s endpoint (EU: `mcp.datadoghq.eu`).

## What it can do

- Query logs, metrics, traces and incidents from inside an AI dev tool
- Run an investigate-and-report agent: the repo's examples use the Claude Agent SDK, one posts findings to Slack
- Work with any standards-compliant MCP client

## Notes

The server is hosted by Datadog; the repo holds the setup notes and agent examples, not the server code. It reads the observability data your Datadog login can reach, so use an account scoped to what the agent should see. The README points to Datadog's docs for the full tool list, other clients, alternative auth methods and regional endpoints.

## Details

| | |
|:---|:---|
| **Source** | [datadog-labs/mcp-server](https://github.com/datadog-labs/mcp-server) |
| **Maintainer** | Datadog (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | Your Datadog login; see the setup docs for alternative methods |
| **Needs** | A Datadog account |

_Install lines read from the server's README on 2026-11-20. The Monthly Upkeep re-checks every card._
