---
title: "🔌 Microsoft Learn"
description: "Search and fetch Microsoft's official documentation and code samples, so an agent stops inventing Azure and .NET APIs."
tags: ["mcp-server", "reference", "documentation", "microsoft", "official"]
server:
  repo: MicrosoftDocs/mcp
  license: "CC-BY-4.0"
  maintainer: "Microsoft (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-18
---

# Microsoft Learn MCP server

Search and fetch Microsoft's official documentation and code samples, so an agent stops inventing Azure and .NET APIs.

## Install

**Claude Code** (plugin from the official marketplace; run inside Claude Code, then restart)

```
/plugin install microsoft-docs@claude-plugins-official
```

**Any MCP client** (remote endpoint, Streamable HTTP; no key)

```json
{
  "servers": {
    "microsoft-learn": {
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp"
    }
  }
}
```

The URL is for MCP clients only; opening it in a browser returns 405.

## What it can do

- `microsoft_docs_search`: semantic search over Microsoft technical documentation
- `microsoft_docs_fetch`: read a documentation page as markdown
- `microsoft_code_sample_search`: find official code snippets, filterable by language

## Notes

Free, no sign-in. The repo also publishes agent skills and a `mslearn` CLI for the same content.

## Details

| | |
|:---|:---|
| **Source** | [MicrosoftDocs/mcp](https://github.com/MicrosoftDocs/mcp) |
| **Maintainer** | Microsoft (official) |
| **Licence** | CC-BY-4.0 |
| **Transport** | HTTP (remote) |
| **Auth** | None |
| **Needs** | Nothing |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
