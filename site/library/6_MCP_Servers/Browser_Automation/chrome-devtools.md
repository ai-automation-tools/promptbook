---
title: "🔌 Chrome DevTools"
description: "Give a coding agent Chrome DevTools: inspect, debug and performance-trace a live page."
tags: ["mcp-server", "browser-automation", "browser", "debugging", "performance", "official"]
server:
  repo: ChromeDevTools/chrome-devtools-mcp
  license: "Apache-2.0"
  maintainer: "Chrome DevTools team (official)"
  transport: "stdio"
  checked: 2026-11-18
---

# Chrome DevTools MCP server

Give a coding agent Chrome DevTools: inspect, debug and performance-trace a live page.

## Install

**Claude Code**

```bash
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ]
    }
  }
}
```

## What it can do

- Record and analyse performance traces
- Read console messages and network requests
- Click, fill and navigate, take screenshots and snapshots

## Notes

It controls a Chrome instance, so anything open in that profile is visible to the agent. Use a separate profile for automation. Google collects usage statistics by default; pass `--no-usage-statistics` to opt out.

## Details

| | |
|:---|:---|
| **Source** | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) |
| **Maintainer** | Chrome DevTools team (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | Node.js LTS and Chrome |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
