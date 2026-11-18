---
title: "🔌 Postman"
description: "Postman's official server: workspaces, collections, specifications and environments, plus API client-code generation."
tags: ["mcp-server", "developer-tools", "api", "testing", "official"]
server:
  repo: postmanlabs/postman-mcp-server
  license: "Apache-2.0"
  maintainer: "Postman (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Postman MCP server

Postman's official server: workspaces, collections, specifications and environments, plus API client-code generation.

## Install

**Any MCP client** (hosted server; add this URL to the client's MCP config)

```text
https://mcp.postman.com/minimal
```

Change `/minimal` to `/code` or `/mcp` for the Code or Full tool set.

**Local server**

```bash
npx @postman/postman-mcp-server
```

Add `--code` or `--full` for those tool sets, and set `POSTMAN_API_KEY` in the environment.

## What it can do

- Work with Postman workspaces, collections, specifications and environments
- Generate client code from public and internal API definitions (Code mode)
- Search the Postman docs (Learn mode)

## Notes

Minimal is the default and fits single-item edits. Full exposes 100+ tools and the Enterprise features; start narrower. The hosted server signs in with OAuth. The EU server and the local server accept only a Postman API key, passed as `Authorization: Bearer <POSTMAN_API_KEY>` to the hosted EU endpoint or as an env var locally.

## Details

| | |
|:---|:---|
| **Source** | [postmanlabs/postman-mcp-server](https://github.com/postmanlabs/postman-mcp-server) |
| **Maintainer** | Postman (official) |
| **Licence** | Apache-2.0 |
| **Transport** | HTTP (remote), stdio |
| **Auth** | OAuth (hosted), or a Postman API key |
| **Needs** | A Postman account; Node.js for the local server |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
