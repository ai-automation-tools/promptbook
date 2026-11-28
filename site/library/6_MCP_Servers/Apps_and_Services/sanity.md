---
title: "🔌 Sanity"
description: "Sanity's hosted server for reading and editing a project's content, datasets, releases and schemas, so an agent works on your real content model instead of guessing it."
tags: ["mcp-server", "apps-and-services", "sanity", "cms", "content", "official"]
server:
  repo: sanity-io/agent-toolkit
  license: "MIT"
  maintainer: "Sanity (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-27
---

# Sanity MCP server

Sanity's hosted server for reading and editing a project's content, datasets, releases and schemas, so an agent works on your real content model instead of guessing it.

| | |
|:---|:---|
| **Source** | [sanity-io/agent-toolkit](https://github.com/sanity-io/agent-toolkit) |
| **Maintainer** | Sanity (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | OAuth by default; a bearer token in the `Authorization` header is the alternative |
| **Needs** | A Sanity account and project; Node.js for the CLI setup route |

## Install

**Claude Code** (authenticate with OAuth on next launch)

```bash
claude mcp add Sanity -t http https://mcp.sanity.io --scope user
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "Sanity": {
      "type": "http",
      "url": "https://mcp.sanity.io"
    }
  }
}
```

**Automatic** (detects Cursor, Claude Code and VS Code, and uses your logged-in CLI user)

```bash
npx sanity@latest mcp configure
```

## What it can do

- Access Sanity projects: content, datasets, releases and schemas
- Serve up-to-date agent rules for building with Sanity
- Ship alongside the repo's agent skills and a Claude Code plugin (MCP server, skills and slash commands)

## Notes

The server is a hosted endpoint, so the repo is the toolkit around it (skills, plugin manifests, docs), not the server's source. It reads and edits live project content: sign in with an account whose role fits the task, or use a narrowly scoped token in the header.

_Install lines read from the server's README on 2026-11-27. The Monthly Upkeep re-checks every card._
