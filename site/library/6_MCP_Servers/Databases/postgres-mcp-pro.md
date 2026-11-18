---
title: "🔌 Postgres MCP Pro"
description: "Postgres with index tuning, EXPLAIN plans, health checks and access-controlled SQL execution."
tags: ["mcp-server", "databases", "postgres", "performance", "community"]
server:
  repo: crystaldba/postgres-mcp
  license: "MIT"
  maintainer: "Crystal DBA (community)"
  transport: "stdio, SSE"
  checked: 2026-11-18
---

# Postgres MCP Pro server

Postgres with index tuning, EXPLAIN plans, health checks and access-controlled SQL execution.

## Install

**Any MCP client** (`mcpServers` config, using `uvx`; Docker and `pipx` variants are in the README)

```json
{
  "mcpServers": {
    "postgres": {
      "command": "uvx",
      "args": ["postgres-mcp", "--access-mode=restricted"],
      "env": {
        "DATABASE_URI": "postgresql://username:password@localhost:5432/dbname"
      }
    }
  }
}
```

The README's examples use `--access-mode=unrestricted`; `restricted` is its read-only mode.

## What it can do

- `execute_sql`, read-only when started in restricted mode
- `explain_query`, including simulated hypothetical indexes
- `analyze_db_health`: buffer cache, connections, constraints, index and vacuum health, sequence limits
- Index tuning for a workload

## Notes

Restricted mode limits work to read-only transactions with an execution-time cap and suits production; unrestricted allows schema and data changes and suits development. Index tuning and full performance analysis need the `pg_stat_statements` and `hypopg` extensions loaded. Use a database role with only the grants you want the agent to have.

## Details

| | |
|:---|:---|
| **Source** | [crystaldba/postgres-mcp](https://github.com/crystaldba/postgres-mcp) |
| **Maintainer** | Crystal DBA (community) |
| **Licence** | MIT |
| **Transport** | stdio, SSE |
| **Auth** | Connection string in an env var |
| **Needs** | `uv` (or Docker or `pipx`) and a Postgres database |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
