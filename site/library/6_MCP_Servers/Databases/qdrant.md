---
title: "🔌 Qdrant"
description: "A semantic memory layer for an agent: store and retrieve information in the Qdrant vector search engine."
tags: ["mcp-server", "databases", "vector-search", "memory", "official"]
server:
  repo: qdrant/mcp-server-qdrant
  license: "Apache-2.0"
  maintainer: "Qdrant (official)"
  transport: "stdio, SSE, HTTP"
  checked: 2026-11-18
---

# Qdrant MCP server

A semantic memory layer for an agent: store and retrieve information in the Qdrant vector search engine.

## Install

**Claude Code** (a code-search setup from the README)

```bash
claude mcp add code-search \
  -e QDRANT_URL="http://localhost:6333" \
  -e COLLECTION_NAME="code-repository" \
  -e EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2" \
  -- uvx mcp-server-qdrant
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "qdrant": {
      "command": "uvx",
      "args": ["mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "https://xyz-example.eu-central.aws.cloud.qdrant.io:6333",
        "QDRANT_API_KEY": "your_api_key",
        "COLLECTION_NAME": "your-collection-name"
      }
    }
  }
}
```

## What it can do

- `qdrant-store` saves a piece of information, with optional metadata, into a collection
- `qdrant-find` retrieves the most relevant stored information for a query
- Tool descriptions are configurable, so the same server can act as notes memory or a code-snippet index

## Notes

Use `QDRANT_URL` for a server or `QDRANT_LOCAL_PATH` for a local database, never both. `QDRANT_READ_ONLY=true` removes the store tool. The README calls it an example implementation.

## Details

| | |
|:---|:---|
| **Source** | [qdrant/mcp-server-qdrant](https://github.com/qdrant/mcp-server-qdrant) |
| **Maintainer** | Qdrant (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio, SSE, HTTP |
| **Auth** | Optional Qdrant API key in an env var |
| **Needs** | uv and a Qdrant instance or local path |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
