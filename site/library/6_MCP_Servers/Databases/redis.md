---
title: "🔌 Redis"
description: "Manage and search data in Redis from an agent: strings, hashes, lists, sets, sorted sets, streams and more."
tags: ["mcp-server", "databases", "cache", "key-value", "official"]
server:
  repo: redis/mcp-redis
  license: "MIT"
  maintainer: "Redis (official)"
  transport: "stdio"
  checked: 2026-11-18
---

# Redis MCP server

Manage and search data in Redis from an agent: strings, hashes, lists, sets, sorted sets, streams and more.

## Install

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "RedisMCPServer": {
      "command": "uvx",
      "args": ["--from", "redis-mcp-server@latest", "redis-mcp-server", "--url", "\"redis://localhost:6379/0\""]
    }
  }
}
```

The URL can carry credentials and TLS (`rediss://`); `REDIS_HOST`, `REDIS_PORT`, `REDIS_PWD` and `REDIS_SSL` work as env vars too.

## What it can do

- Set and get strings with expiry for config, sessions and caches
- Work with hashes, lists, sets, sorted sets and streams
- Search and filter data
- Authenticate with EntraID for Azure Managed Redis

## Notes

The README suggests a Redis ACL user to limit access, for example read-only: `ACL SETUSER readonlyuser on >mypassword ~* +@read -@write`. Only the stdio transport is supported.

## Details

| | |
|:---|:---|
| **Source** | [redis/mcp-redis](https://github.com/redis/mcp-redis) |
| **Maintainer** | Redis (official) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | Redis URL, user and password, or EntraID |
| **Needs** | uv and a Redis instance |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
