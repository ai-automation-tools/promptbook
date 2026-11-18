---
title: "🔌 Serena"
description: "IDE-style semantic code search, navigation and refactoring for a coding agent, at the symbol level through language servers."
tags: ["mcp-server", "developer-tools", "code-search", "refactoring", "community"]
server:
  repo: oraios/serena
  license: "GPL-3.0-or-later (SolidLSP component: MIT)"
  maintainer: "oraios (community)"
  transport: "stdio, HTTP"
  checked: 2026-11-18
---

# Serena MCP server

IDE-style semantic code search, navigation and refactoring for a coding agent, at the symbol level through language servers.

## Install

Install Serena with uv (the README says not to install it through an MCP or plugin marketplace), then initialise it:

```bash
uv tool install -p 3.13 serena-agent
serena init
```

**Claude Code**

```bash
claude mcp add --scope user serena -- serena start-mcp-server --context claude-code --project-from-cwd
```

For one project only: `claude mcp add serena -- serena start-mcp-server --context claude-code --project "$(pwd)"`.

**Any MCP client**: configure the launch command `serena start-mcp-server`, or start the server in HTTP mode and give the client its URL. Per-client instructions are in the [client guide](https://oraios.github.io/serena/02-usage/030_clients.html).

## What it can do

- Find symbols, their references and relationships instead of grepping lines
- Edit and refactor at the symbol level, such as cross-file renames and moves
- Work in over 40 languages through language servers, or through the paid JetBrains plugin backend
- Debugging tools and a v2 REPL-based agent interface

## Notes

It reads and edits your project files, so point it at the project you mean (`--project`). Claude Code can forget to use it in long sessions; the docs recommend their reminder hooks. Some languages need extra language-server dependencies.

## Details

| | |
|:---|:---|
| **Source** | [oraios/serena](https://github.com/oraios/serena) |
| **Maintainer** | oraios (community) |
| **Licence** | GPL-3.0-or-later (SolidLSP component: MIT) |
| **Transport** | stdio, HTTP |
| **Auth** | None |
| **Needs** | uv, Python 3.13 (uv fetches it) and a language server per language |

_Install lines read from the server's README and client guide on 2026-11-18. The Monthly Upkeep re-checks every card._
