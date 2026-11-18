---
title: "🔌 Claude Code MCP Servers Guide"
tags: ["claude-code", "mcp", "tools", "integrations", "settings"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-18
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-18 - Checked against code.claude.com/docs/en/mcp -->

# Claude Code MCP Servers Guide

MCP servers give Claude Code tools and data it does not have built in (an issue tracker, a
database, a browser). This guide answers one question: how do I add one, choose where its
config lives, and manage it afterwards.

## Add a server

The server type decides the command shape. Options go before the server name; `--` separates
Claude's options from a stdio server's own command.

```bash
# Remote HTTP server (recommended for remote)
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"

# Remote SSE server (deprecated; use HTTP where available)
claude mcp add --transport sse asana https://mcp.asana.com/sse

# Local stdio server
claude mcp add --env AIRTABLE_API_KEY=YOUR_KEY --transport stdio airtable \
  -- npx -y airtable-mcp-server

# From a JSON definition (the only way to add a WebSocket server)
claude mcp add-json events-server \
  '{"type":"ws","url":"wss://mcp.example.com/socket","headers":{"Authorization":"Bearer YOUR_TOKEN"}}'
```

| Flag | Meaning |
|:---|:---|
| `--transport`, `-t` | `http`, `sse` or `stdio` |
| `--scope`, `-s` | `local` (default), `project` or `user` |
| `--env`, `-e` | `KEY=value`, repeatable |
| `--header`, `-H` | Request header, repeatable |
| `--callback-port` | Fixed OAuth callback port |
| `--client-id`, `--client-secret` | Pre-configured OAuth credentials (secret prompts masked, or reads `MCP_CLIENT_SECRET`) |

A JSON entry with a `url` but no `type` is an error: it is read as stdio and skipped. In JSON,
`streamable-http` is accepted as an alias for `http`.

## Manage servers

```bash
claude mcp list              # all servers and their status
claude mcp get notion        # one server's details
claude mcp remove notion
claude mcp login sentry      # OAuth from the shell (add --no-browser if needed)
claude mcp logout sentry
claude mcp reset-project-choices   # forget approvals of .mcp.json servers
```

Inside a session, `/mcp` shows status, authenticates, and toggles servers (a toggled-off
server is written to `disabledMcpServers` in `~/.claude.json`, per project). `/mcp reconnect
all` retries failed servers (needs v2.1.284 or later).

`claude mcp remove` deletes the stored OAuth tokens locally but does not revoke them at the
server. Run `claude mcp logout <name>` first if you want them revoked.

## Scopes

| Scope | Loads in | Shared | Stored in |
|:---|:---|:---|:---|
| `local` (default) | This project only | No | `~/.claude.json`, under the project's path |
| `project` | This project | Yes, via git | `.mcp.json` in the project root |
| `user` | All your projects | No | `~/.claude.json` |

If the same name is defined at several levels, one definition wins (they are not merged), in
this order: local, project, user, plugin, claude.ai connectors.

## `.mcp.json`

Commit this file to share servers with the team (`--scope project` writes it).

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": { "Authorization": "Bearer ${API_KEY}" }
    },
    "database-tools": {
      "command": "npx",
      "args": ["-y", "some-db-mcp-server"],
      "env": { "DB_URL": "${DB_URL}" },
      "timeout": 600000
    }
  }
}
```

`${VAR}` and `${VAR:-default}` expand in `command`, `args`, `env`, `url` and `headers`. An
unset variable with no default leaves the literal `${VAR}` text and shows a warning in
`claude mcp list` and `/mcp`. In a remote server's `url` and `headers`, credential variables
such as `ANTHROPIC_API_KEY` or `NPM_TOKEN` read as empty whatever their value; copy the value
into a variable with your own name instead.

For tokens that change, use a `headersHelper` command that prints a JSON object of string
headers to stdout (10 second limit, re-run on each connection and once after a 401 or 403):

```json
{ "mcpServers": { "internal-api": {
  "type": "http", "url": "https://mcp.internal.example.com",
  "headersHelper": "/opt/bin/get-mcp-auth-headers.sh" } } }
```

## Approval and permissions

- Interactive sessions ask before using a server from a project `.mcp.json`.
- `claude -p` and Agent SDK runs load project servers without asking. To block one everywhere,
  list it in `disabledMcpjsonServers` in settings, or start with `--strict-mcp-config` (loads
  only servers passed with `--mcp-config`).
- In an untrusted folder, `enableAllProjectMcpServers` and `enabledMcpjsonServers` in a
  committed `.claude/settings.json` are ignored and the server shows `Pending approval`.
- MCP tools are named `mcp__<server>__<tool>`; tools whose full name is over 128 characters
  are left out. MCP prompts appear as `/mcp__<server>__<prompt>`.
- Organizations restrict servers with `allowedMcpServers` and `deniedMcpServers` (see the
  managed MCP page).

## Limits and timeouts

| Setting | Effect |
|:---|:---|
| `MCP_TIMEOUT` | Server startup timeout in ms, for example `MCP_TIMEOUT=10000 claude` |
| `MCP_TOOL_TIMEOUT` | Tool-call timeout for all servers; per-server `timeout` overrides it |
| `MAX_MCP_OUTPUT_TOKENS` | Cap on tool output tokens |
| `ENABLE_TOOL_SEARCH` | Controls deferred loading of MCP tools (`auto:5`, `false`) |
| `alwaysLoad: true` | Per server: always put its tools in context |

## Troubleshooting by status

| `claude mcp list` shows | Do this |
|:---|:---|
| `Needs authentication` | Run `/mcp` or `claude mcp login <name>` |
| `Failed to connect` | Run the stdio command by hand; check URL and `type` |
| `Pending approval` | Run `claude` in the project and approve |
| `Rejected` | Remove it from `disabledMcpjsonServers` |

**Sources**
- https://code.claude.com/docs/en/mcp
- https://github.com/anthropics/claude-code/releases (v2.1.327 notes: `claude mcp add-json <name> -` reads JSON from stdin)
