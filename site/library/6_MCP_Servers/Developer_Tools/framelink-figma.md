---
title: "🔌 Framelink MCP for Figma"
description: "Gives a coding agent a trimmed view of your Figma files, so it implements a design from layout and style data instead of a screenshot."
tags: ["mcp-server", "developer-tools", "figma", "design-to-code", "community"]
server:
  repo: GLips/Figma-Context-MCP
  license: "MIT"
  maintainer: "Framelink (community)"
  transport: "stdio"
  checked: 2026-11-18
---

# Framelink MCP for Figma

Gives a coding agent a trimmed view of your Figma files, so it implements a design from layout and style data instead of a screenshot.

## Install

**Any MCP client** (`mcpServers` config; macOS / Linux)

```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}
```

On Windows use `"command": "cmd"` with `"args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]`. `FIGMA_API_KEY` and `PORT` can go in the `env` field instead.

## What it can do

- Fetch a Figma file, frame or group from a pasted link
- Simplify the Figma API response to the layout and styling that matters before it reaches the model
- Feed that to the agent to implement the design in any framework

## Notes

Needs a Figma personal access token; give it read access only. Figma publishes its own server too: this one is the community option.

## Details

| | |
|:---|:---|
| **Source** | [GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) |
| **Maintainer** | Framelink (community) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | Figma access token in a flag or env var |
| **Needs** | Node.js and a Figma account |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
