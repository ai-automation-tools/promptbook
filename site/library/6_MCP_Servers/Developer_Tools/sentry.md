---
title: "🔌 Sentry"
description: "Sentry's server for production errors, issues, traces and logs, so a coding agent debugs with what actually broke instead of guessing from source."
tags: ["mcp-server", "developer-tools", "sentry", "observability", "debugging", "official"]
server:
  repo: getsentry/toolkit
  path: packages/mcp-server
  license: "FSL-1.1-Apache-2.0"
  maintainer: "Sentry (official)"
  transport: "stdio, HTTP (remote)"
  checked: 2026-11-20
---

# Sentry MCP server

Sentry's server for production errors, issues, traces and logs, so a coding agent debugs with what actually broke instead of guessing from source.

## Install

**Claude Code** (stdio, through the Sentry CLI; it uses your CLI login, so no token in the config)

```bash
curl https://cli.sentry.dev/install -fsS | bash
sentry auth login
claude mcp add sentry -- sentry mcp
```

**Any MCP client, remote** (`mcpServers` config; the hosted server at `mcp.sentry.dev` signs you in over OAuth)

```json
{
  "mcpServers": {
    "sentry": {
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

**Any MCP client, stdio** (after `sentry auth login`)

```json
{
  "mcpServers": {
    "sentry": {
      "command": "sentry",
      "args": ["mcp"]
    }
  }
}
```

## What it can do

- Look up issues, events, stack traces, traces and logs in your Sentry organization
- Search errors, traces, logs and issues in natural language (these tools need an LLM provider key: OpenAI, Azure OpenAI, Anthropic or OpenRouter)
- Work with Sentry's Seer debugging agent, and manage projects and teams
- Run against a self-hosted Sentry with `SENTRY_HOST`

## Notes

Built for human-in-the-loop coding agents, so its tool set favours debugging workflows over full API coverage. Pass `<org>/` or `<org>/<project>` to `sentry mcp` to limit every call to one organization or project, and use `--skills` / `--disable-skills` to drop tool groups. The repo is source-available under the Functional Source License (FSL-1.1-Apache-2.0), which converts to Apache-2.0 later; check it fits your use. With a token instead of OAuth, grant only the scopes the README lists.

## Details

| | |
|:---|:---|
| **Source** | [getsentry/toolkit](https://github.com/getsentry/toolkit) (`packages/mcp-server`; the former `getsentry/sentry-mcp` redirects here) |
| **Maintainer** | Sentry (official) |
| **Licence** | FSL-1.1-Apache-2.0 |
| **Transport** | stdio, HTTP (remote) |
| **Auth** | OAuth on the hosted server; CLI login or a `SENTRY_AUTH_TOKEN` for stdio |
| **Needs** | A Sentry account; the Sentry CLI for the stdio route |

_Install lines read from the server's README on 2026-11-20. The Monthly Upkeep re-checks every card._
