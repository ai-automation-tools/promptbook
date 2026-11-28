---
title: "🔌 Zapier"
description: "Zapier's hosted server that gives an agent governed access to thousands of apps: send messages, pull data and trigger workflows in plain English."
tags: ["mcp-server", "apps-and-services", "zapier", "automation", "integrations", "official"]
server:
  repo: zapier/mcp
  license: "MIT"
  maintainer: "Zapier (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-27
---

# Zapier MCP server

Zapier's hosted server that gives an agent governed access to thousands of apps: send messages, pull data and trigger workflows in plain English.

| | |
|:---|:---|
| **Source** | [zapier/mcp](https://github.com/zapier/mcp) |
| **Maintainer** | Zapier (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | Sign-in through your Zapier account |
| **Needs** | A Zapier account |

## Install

Connecting takes only the server URL; per-client steps are at [docs.zapier.com/mcp/clients](https://docs.zapier.com/mcp/clients).

**Any MCP client** (VS Code style `type: http`)

```json
{
  "type": "http",
  "url": "https://mcp.zapier.com/api/v1/connect"
}
```

**Claude Code plugin** (adds a guided first run and skills on top of the connection): add [`zapier/marketplace`](https://github.com/zapier/marketplace) or [`anthropics/claude-plugins-official`](https://github.com/anthropics/claude-plugins-official).

**Gemini CLI**

```bash
gemini extensions install https://github.com/zapier/zapier-mcp
```

Then run `/mcp auth zapier`.

## What it can do

- Run actions in 10,000+ apps (Gmail, Slack, Google Sheets, Jira, Notion, HubSpot, Linear) from a prompt
- Create and manage Zaps
- With the plugin: a guided first run, connection troubleshooting, and a nudge to turn repeated work into a Zap

## Notes

This repo distributes the client-side plugin; the server itself is hosted by Zapier. Anything you connect becomes reachable by the agent, so connect only the apps and actions the task needs.

_Install lines read from the server's README on 2026-11-27. The Monthly Upkeep re-checks every card._
