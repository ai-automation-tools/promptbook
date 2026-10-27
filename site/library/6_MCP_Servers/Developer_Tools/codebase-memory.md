---
title: "🔌 Codebase Memory"
description: "A local code knowledge graph for coding agents: index a repo once, then search symbols, trace call paths and map a diff's blast radius instead of re-reading files."
tags: ["mcp-server", "developer-tools", "code-intelligence", "knowledge-graph", "local-first", "official"]
server:
  repo: DeusData/codebase-memory-mcp
  license: "MIT"
  maintainer: "DeusData (official)"
  transport: "stdio"
  checked: 2026-10-26
---

# Codebase Memory MCP server

A local code knowledge graph for coding agents: index a repo once, then search symbols, trace call paths and map a diff's blast radius instead of re-reading files.

| | |
|:---|:---|
| **Source** | [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) |
| **Maintainer** | DeusData (official) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | None (everything runs on your machine) |
| **Needs** | A pre-built binary for macOS, Linux or Windows from the releases page; no language runtime, no API key |

## Install

The server is a single native executable. The setup script downloads the release for your platform, verifies it and runs its `install` command, which also writes the MCP config for the coding agents it detects (Claude Code, Codex, Cursor and others).

**macOS / Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/scripts/setup.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/scripts/setup-windows.ps1 | iex
```

**Any MCP client** (`mcpServers` config, if you would rather not use the install command)

```json
{
  "mcpServers": {
    "codebase-memory-mcp": {
      "command": "/path/to/codebase-memory-mcp",
      "args": []
    }
  }
}
```

Restart the agent and check `/mcp`: the server lists 17 tools.

## What it can do

- `index_repository` parses a repo (162 languages and file formats, with hybrid LSP type resolution for the main ones) into a persistent local graph; `index_status` and `check_index_coverage` say what is fresh
- `search_graph`, `search_code` and `get_file_outline` find symbols, text and declarations with paging, so an agent reads a snippet instead of a file
- `trace_path` follows callers, callees, data flow and cross-service paths, and `detect_changes` maps a git diff to the symbols and tests it affects
- `get_architecture`, `get_graph_schema` and `query_graph` (a read-only openCypher subset) give the codebase overview, and `manage_adr` keeps architecture decision records in the graph

## Notes

Indexing and queries stay on the machine: no hosted service, no API key, and the binary makes no network request of its own. The optional CBM Lens UI (open beta) serves on loopback. The installer edits agent config files for the clients you pick, so read what it detected before accepting. Updates run from the install script again, not from inside the binary.

_Install lines read from the server's README on 2026-10-26. The Monthly Upkeep re-checks every card._
