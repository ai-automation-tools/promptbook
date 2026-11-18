---
title: "🔌 DuckDB and MotherDuck"
description: "MotherDuck's local server: run SQL on DuckDB files, in-memory databases, S3 and MotherDuck, and browse their catalogs."
tags: ["mcp-server", "databases", "duckdb", "analytics", "official"]
server:
  repo: motherduckdb/mcp-server-motherduck
  license: "MIT"
  maintainer: "MotherDuck (official)"
  transport: "stdio, HTTP"
  checked: 2026-11-18
---

# DuckDB and MotherDuck MCP server

MotherDuck's local server: run SQL on DuckDB files, in-memory databases, S3 and MotherDuck, and browse their catalogs.

## Install

**Claude Code** (a local file, read-only)

```bash
claude mcp add --scope user duckdb --transport stdio -- uvx mcp-server-motherduck --db-path /absolute/path/to/db.duckdb
```

**Claude Code** (MotherDuck, read-write)

```bash
claude mcp add --scope user motherduck --transport stdio --env motherduck_token=YOUR_TOKEN -- uvx mcp-server-motherduck --db-path md: --read-write
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "DuckDB (read-only)": {
      "command": "uvx",
      "args": ["mcp-server-motherduck", "--db-path", "/absolute/path/to/your.duckdb"]
    }
  }
}
```

## What it can do

- Execute read and write SQL on DuckDB, with a read-only default for a file path
- Browse database catalogs and switch between connections
- Query local, S3 and MotherDuck databases, and ingest from or export to the local filesystem

## Notes

Read-only is the default; `--read-write` turns on writes and `--allow-switch-databases` lets the agent switch to any database, so avoid both outside development. MotherDuck also hosts a remote server (linked from the README) if you don't need local files. See the README's "Securing for Production" before giving anyone else access.

## Details

| | |
|:---|:---|
| **Source** | [motherduckdb/mcp-server-motherduck](https://github.com/motherduckdb/mcp-server-motherduck) |
| **Maintainer** | MotherDuck (official) |
| **Licence** | MIT |
| **Transport** | stdio, HTTP |
| **Auth** | None for local DuckDB; a MotherDuck token in an env var for `md:` |
| **Needs** | `uv` |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
