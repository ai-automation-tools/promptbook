---
title: "🛠️ MCP Server Setup"
tags: ["ai-tools", "openclaw-prompts", "server", "setup"]
category: "AI_Tools"
subcategory: "OpenClaw_Prompts"
---
# MCP Server Setup Prompt

**Category:** Configuration  
**Use Case:** Adding new MCP servers to OpenClaw  
**Based on:** Work completed 2026-02-14

---

## Prompt

```
I need to add a new MCP server to my OpenClaw setup.

**Server Name:** {SERVER_NAME}
**Type:** {TYPE} (STDIO, HTTP, HTTP with OAuth)
**Purpose:** {DESCRIPTION}

{CONFIGURATION_DETAILS}

Please:
1. Add this server to ~/.openclaw/workspace/config/mcporter.json
2. If OAuth is required, guide me through the authentication process
3. Test the connection with `mcp list-tools {SERVER_NAME}`
4. Document the new server in docs/MCP/README.md
5. Update the environment reference if new credentials are needed
```

---

## Example: STDIO Server

```
I need to add a new MCP server to my OpenClaw setup.

**Server Name:** filesystem
**Type:** STDIO
**Purpose:** File system operations and search

**Configuration:**
- Command: npx -y @modelcontextprotocol/server-filesystem
- Args: ["/home/mike/Documents"]

Please:
1. Add this server to ~/.openclaw/workspace/config/mcporter.json
2. Test the connection with `mcp list-tools filesystem`
3. Document the new server in docs/MCP/README.md
```

---

## Example: HTTP Server (No Auth)

```
I need to add a new MCP server to my OpenClaw setup.

**Server Name:** weather-api
**Type:** HTTP (no auth)
**Purpose:** Weather forecasts and current conditions

**Configuration:**
- Base URL: https://api.weather.example.com/mcp

Please:
1. Add this server to ~/.openclaw/workspace/config/mcporter.json
2. Test the connection with `mcp list-tools weather-api`
3. Document the new server in docs/MCP/README.md
```

---

## Example: HTTP with OAuth

```
I need to add a new MCP server to my OpenClaw setup.

**Server Name:** calendar-sync
**Type:** HTTP with OAuth
**Purpose:** Google Calendar integration

**Configuration:**
- Base URL: https://calendar-mcp.example.com/mcp
- Auth: OAuth

Please:
1. Add this server to ~/.openclaw/workspace/config/mcporter.json
2. Guide me through the OAuth authentication process
3. Test the connection with `mcp list-tools calendar-sync`
4. Document the new server in docs/MCP/README.md
5. Add any necessary environment variables to docs/credentials/README.md
```

---

## Configuration Templates

### STDIO Server
```json
{
  "server-name": {
    "command": "npx -y package-name",
    "args": ["optional", "arguments"]
  }
}
```

### HTTP Server (No Auth)
```json
{
  "server-name": {
    "baseUrl": "https://api.example.com/mcp"
  }
}
```

### HTTP with OAuth
```json
{
  "server-name": {
    "baseUrl": "https://api.example.com/mcp",
    "auth": "oauth"
  }
}
```

### HTTP with Bearer Token
```json
{
  "server-name": {
    "baseUrl": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer YOUR_TOKEN_HERE"
    }
  }
}
```

---

## Variables to Replace

| Variable | Description | Example |
|----------|-------------|---------|
| `{SERVER_NAME}` | Unique server identifier | "notion", "github", "calendar" |
| `{TYPE}` | Server connection type | "STDIO", "HTTP", "HTTP with OAuth" |
| `{DESCRIPTION}` | What the server does | "GitHub API integration" |
| `{CONFIGURATION_DETAILS}` | Server-specific config | Base URL, command, args, etc. |

---

## Testing Commands

```bash
# List all servers
mcp list

# List tools for new server
mcp list-tools {SERVER_NAME}

# Test calling a tool
mcp call {SERVER_NAME}.{TOOL_NAME} arg="value"

# Check authentication status
mcp list | grep {SERVER_NAME}
```

---

## Related Documentation

- `~/.openclaw/workspace/config/mcporter.json` - MCP configuration file
- `~/.openclaw/workspace/docs/MCP/README.md` - MCP documentation
- `~/.openclaw/workspace/docs/credentials/README.md` - Credential architecture
- `~/bin/mcp` - Helper script (auto-includes config)
- `~/bin/mcp-info` - View all servers and tools

---

## OAuth Authentication

For OAuth servers, you'll need to:
1. Add server with `"auth": "oauth"` in config
2. Run `mcp auth {SERVER_NAME}`
3. Follow browser prompts to authenticate
4. Tokens are stored in `~/.mcporter/credentials.json`

---

## Notes

- Test thoroughly before documenting
- Update `mcp-info` output expectations in TOOLS.md
- OAuth tokens typically expire (check refresh schedules)
- STDIO servers run locally, HTTP servers are remote
- All agents share the same MCP servers (global config)
