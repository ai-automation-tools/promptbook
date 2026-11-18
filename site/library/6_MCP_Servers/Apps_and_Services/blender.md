---
title: "🔌 Blender"
description: "Prompt-driven 3D modelling in a live Blender session: scene control, Python execution and asset or AI model generation."
tags: ["mcp-server", "apps-and-services", "3d", "blender", "community"]
server:
  repo: ahujasid/mcp-for-blender
  license: "MIT"
  maintainer: "ahujasid (community)"
  transport: "stdio"
  checked: 2026-11-18
---

# Blender MCP server

Prompt-driven 3D modelling in a live Blender session: scene control, Python execution and asset or AI model generation. A third-party integration, not made by Blender. Formerly `blender-mcp`; the PyPI package is now `mcp-for-blender`.

## Install

**Claude Code**

```bash
claude mcp add blender uvx mcp-for-blender
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["mcp-for-blender"]
    }
  }
}
```

Then install the Blender addon with `uvx mcp-for-blender install-addon`, or run the README's one-command `setup`, which does both. The addon opens a socket server inside Blender that the MCP server talks to.

## What it can do

- `execute_blender_code` runs Python in your live Blender; the agent writes it for modelling, layout, materials, animation and rigging
- `search_assets` and `import_asset` bring in Poly Haven, Sketchfab and Poly Pizza assets
- `generate_3d` creates and imports models with Tripo, Hunyuan3D, Hyper3D Rodin or Meshy

## Notes

`execute_blender_code` runs arbitrary Python, so save your .blend file first and don't run it on a machine with sensitive files. The README's quickstart pipes an install script to a shell; the winget or `uvx` route avoids that. Some generators need their own API keys or a paid tier.

## Details

| | |
|:---|:---|
| **Source** | [ahujasid/mcp-for-blender](https://github.com/ahujasid/mcp-for-blender) |
| **Maintainer** | ahujasid (community) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | None for core tools; keys for some generators |
| **Needs** | Blender with the addon, and uv |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
