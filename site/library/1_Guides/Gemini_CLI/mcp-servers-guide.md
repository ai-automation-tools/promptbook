---
title: "🔌 Gemini CLI MCP Servers Guide"
tags: ["gemini-cli", "mcp", "tools", "settings", "oauth"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
checked: 2026-11-18
repo: google-gemini/gemini-cli
---

<!-- Last Updated: 2026-11-18 - Checked against github.com/google-gemini/gemini-cli docs/tools/mcp-server.md -->

# Gemini CLI MCP Servers Guide

An MCP server exposes tools and resources (databases, APIs, scripts) to Gemini CLI. Servers are defined under `mcpServers` in `settings.json`, or managed with `gemini mcp` commands.

## Fastest route: `gemini mcp add`

```bash
gemini mcp add [options] <name> <commandOrUrl> [args...]
```

| Flag | Meaning |
|:---|:---|
| `-s, --scope` | `user` (`~/.gemini/settings.json`) or `project` (`.gemini/settings.json`). Default `project` |
| `-t, --transport` | `stdio`, `sse` or `http`. Default `stdio` |
| `-e, --env` | Environment variable, `-e KEY=value` |
| `-H, --header` | HTTP header for SSE and HTTP |
| `--timeout` | Connection timeout in ms |
| `--trust` | Skip tool confirmation prompts for this server |
| `--description` | Description of the server |
| `--include-tools` / `--exclude-tools` | Comma-separated tool lists |

```bash
# stdio (default)
gemini mcp add -e API_KEY=123 my-stdio-server /path/to/server arg1 arg2
gemini mcp add python-server python server.py -- --server-arg my-value

# streamable HTTP, with a header
gemini mcp add --transport http --header "Authorization: Bearer abc123" secure-http https://api.example.com/mcp/

# SSE
gemini mcp add --transport sse sse-server https://api.example.com/sse/
```

## Manage servers

| Command | Purpose |
|:---|:---|
| `gemini mcp list` | Name, config and connection status of each server |
| `gemini mcp remove <name>` | Delete a server (`-s, --scope`, default `project`) |
| `gemini mcp enable <name> [--session]` | Re-enable a disabled server |
| `gemini mcp disable <name> [--session]` | Disable without deleting; `--session` is not persisted |

`stdio` servers only show "Connected" in a trusted folder; use `gemini trust` to trust the current one. Enablement state lives in `~/.gemini/mcp-server-enablement.json`. In a session, `/mcp` shows servers, status, tools and resources, and `/mcp enable <name>` / `/mcp disable <name>` also work.

## Manual config in settings.json

```json
{
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1", "value1"],
      "env": { "API_KEY": "$MY_API_TOKEN" },
      "cwd": "./server-directory",
      "timeout": 30000,
      "trust": false
    }
  }
}
```

### Server properties

| Key | Type | Notes |
|:---|:---|:---|
| `command` | string | Executable for stdio. One of `command`, `url`, `httpUrl` is required |
| `url` | string | SSE endpoint |
| `httpUrl` | string | HTTP streaming endpoint |
| `args` | string[] | Arguments for stdio |
| `headers` | object | Custom headers for `url` / `httpUrl` |
| `env` | object | Server environment; `$VAR`, `${VAR}`, or `%VAR%` on Windows |
| `cwd` | string | Working directory for stdio |
| `timeout` | number | Request timeout in ms (default 600000) |
| `trust` | boolean | Bypass all confirmations for this server (default false) |
| `includeTools` | string[] | Allowlist of tools |
| `excludeTools` | string[] | Blocklist; wins over `includeTools` |

### Global rules

```json
{
  "mcp": {
    "allowed": ["my-trusted-server"],
    "excluded": ["experimental-server"]
  }
}
```

`mcp.allowed` limits connections to the listed server names; `mcp.excluded` blocks names. `mcp.serverCommand` is a global start command.

## Secrets

The CLI redacts sensitive host variables (`GEMINI_API_KEY`, `GOOGLE_API_KEY`, and names matching `*TOKEN*`, `*SECRET*`, `*PASSWORD*`, `*KEY*`, `*AUTH*`, `*CREDENTIAL*`) before spawning a server. A variable you list in the server's `env` is passed through. Reference it rather than hardcoding it:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$GITHUB_PERSONAL_ACCESS_TOKEN" }
    }
  }
}
```

## OAuth for remote servers

For SSE or HTTP servers that return 401, the CLI discovers OAuth endpoints, registers a client if supported, and opens a browser.

```
/mcp auth              # list servers needing auth
/mcp auth serverName   # authenticate or re-authenticate
```

Tokens are stored in `~/.gemini/mcp-oauth-tokens.json`. The flow needs a local browser and a `http://localhost:<port>/oauth/callback` redirect, so it fails in headless, plain-SSH or browserless container setups. An explicit `oauth` block (`enabled`, `issuer`, `authorizationUrl`, `tokenUrl`, `clientId`, `scopes`) is available when discovery is not supported.

## Resources

Servers that expose resources show them in `/mcp`. Reference one in chat with `@server://resource/path`; the CLI reads it and injects the content.

## Troubleshooting

Startup connection errors are quiet; you get one hint ("Run /mcp list for status"). Details reappear when you run `/mcp list` or `/mcp auth`, when the model calls that server's tool, or with `gemini mcp list` from the shell.

## Sources

- https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md
