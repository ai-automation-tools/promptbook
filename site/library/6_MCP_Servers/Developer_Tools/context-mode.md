---
title: "🔌 Context Mode"
description: "Runs a coding agent's commands and fetches in a local sandbox and indexes the output, so only the part it asks for enters the context window."
tags: ["mcp-server", "developer-tools", "context-window", "sandbox", "community"]
server:
  repo: mksglu/context-mode
  license: "Elastic License 2.0 (source-available)"
  maintainer: "mksglu (community)"
  transport: "stdio"
  checked: 2026-11-18
---

# Context Mode MCP server

Runs a coding agent's commands and fetches in a local sandbox and indexes the output, so only the part it asks for enters the context window.

## Install

**Claude Code** (as a plugin: hooks, MCP server and skills)

```bash
claude plugin marketplace add mksglu/context-mode
claude plugin install context-mode@context-mode
```

Other agents have their own lines in the README: `codex plugin add context-mode@context-mode`, `gemini extensions install https://github.com/mksglu/context-mode`, and more.

## What it can do

- `ctx_execute` and `ctx_batch` run code or shell commands in a sandbox and return only what they print
- `ctx_index` and `ctx_search` index files, text and URLs into a local SQLite database and search them
- `ctx_stats` reports how much output stayed out of context; `ctx_purge` deletes indexed data

## Notes

Everything stays on your machine (`~/.context-mode`, one database per project) and the README states zero telemetry. The licence is Elastic License 2.0: free to use at work, but source-available, not open source. The sandbox runs code the agent writes, so treat it as you would the agent's shell.

## Details

| | |
|:---|:---|
| **Source** | [mksglu/context-mode](https://github.com/mksglu/context-mode) |
| **Maintainer** | mksglu (community) |
| **Licence** | Elastic License 2.0 (source-available) |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | Node.js and a supported agent client |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
