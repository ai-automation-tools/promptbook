---
title: "🔌 ClickHouse"
description: "Run SQL against a ClickHouse cluster from an agent, read-only by default, with schema inspection and query analysis."
tags: ["mcp-server", "databases", "analytics", "sql", "official"]
server:
  repo: ClickHouse/mcp-clickhouse
  license: "Apache-2.0"
  maintainer: "ClickHouse (official)"
  transport: "stdio, HTTP"
  checked: 2026-11-18
---

# ClickHouse MCP server

Run SQL against a ClickHouse cluster from an agent, read-only by default, with schema inspection and query analysis.

## Install

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "mcp-clickhouse": {
      "command": "uv",
      "args": ["run", "--with", "mcp-clickhouse", "--python", "3.12", "mcp-clickhouse"],
      "env": {
        "CLICKHOUSE_HOST": "<clickhouse-host>",
        "CLICKHOUSE_PORT": "<clickhouse-port>",
        "CLICKHOUSE_USER": "<clickhouse-user>",
        "CLICKHOUSE_PASSWORD": "<clickhouse-password>",
        "CLICKHOUSE_SECURE": "true"
      }
    }
  }
}
```

## What it can do

- `run_query` executes SQL, with named `{name:Type}` parameters
- Queries run read-only by default (`CLICKHOUSE_ALLOW_WRITE_ACCESS=false`)
- Inspect schemas and analyse queries (`EXPLAIN ESTIMATE`, `DESCRIBE`) without running them
- HTTP mode with a bearer token or a FastMCP auth provider

## Notes

Keep write access off unless the agent must write, and give it a ClickHouse user limited to the tables it needs. In HTTP mode, set `CLICKHOUSE_MCP_AUTH_TOKEN`; disabling auth is for local development only. The README warns that a `.env` file in the working directory is read, so run it from a directory you control.

## Details

| | |
|:---|:---|
| **Source** | [ClickHouse/mcp-clickhouse](https://github.com/ClickHouse/mcp-clickhouse) |
| **Maintainer** | ClickHouse (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio, HTTP |
| **Auth** | ClickHouse user and password in env vars; a bearer token in HTTP mode |
| **Needs** | uv and a ClickHouse server |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
