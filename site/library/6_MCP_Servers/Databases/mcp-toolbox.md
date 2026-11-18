---
title: "🔌 MCP Toolbox for Databases"
description: "One server that connects an agent to PostgreSQL, MySQL, BigQuery, Spanner, MongoDB, Redis and many more databases, with prebuilt or custom tools."
tags: ["mcp-server", "databases", "sql", "google-cloud", "official"]
server:
  repo: googleapis/mcp-toolbox
  license: "Apache-2.0"
  maintainer: "Google (official)"
  transport: "stdio, HTTP"
  checked: 2026-11-18
---

# MCP Toolbox for Databases

One server that connects an agent to PostgreSQL, MySQL, BigQuery, Spanner, MongoDB, Redis and many more databases, with prebuilt or custom tools.

## Install

**Any MCP client** (`mcpServers` config; swap `postgres` for another `--prebuilt` database)

```json
{
  "mcpServers": {
    "toolbox-postgres": {
      "command": "npx",
      "args": ["-y", "@toolbox-sdk/server", "--prebuilt=postgres", "--stdio"]
    }
  }
}
```

Set the connection environment variables for your database (see the Prebuilt Tools Reference in the README). For custom tools defined in a `tools.yaml`: `npx @toolbox-sdk/server --config tools.yaml`.

## What it can do

- Prebuilt tools for Google Cloud databases (AlloyDB, BigQuery, Cloud SQL, Spanner, Firestore) and others (PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, Redis, ClickHouse, Neo4j, Snowflake and more)
- Pick a toolset with `--prebuilt=<database>/<toolset>`, such as `postgres/data` for SQL tools only
- Define your own sources, tools and toolsets in YAML
- Also ships SDKs for calling the same tools from an application

## Notes

The agent runs SQL with the database credentials you give it: use a read-only user unless it must write. The README points to Google Cloud's managed MCP servers as the hosted alternative.

## Details

| | |
|:---|:---|
| **Source** | [googleapis/mcp-toolbox](https://github.com/googleapis/mcp-toolbox) |
| **Maintainer** | Google (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio, HTTP |
| **Auth** | The target database's own credentials, in env vars |
| **Needs** | Node.js (or Docker or a binary) and a database |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
