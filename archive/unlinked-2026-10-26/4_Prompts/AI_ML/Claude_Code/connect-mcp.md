---
title: "Prompt: Connect an MCP Server to Claude Code"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Connect an MCP Server to Claude Code

**Use when:** You want to add a new MCP server (local or remote) to Claude Code so its tools are available in your sessions.

---

## Prompt — Add a Known MCP Server

```
Connect the following MCP server to my Claude Code setup:

**Server name:** [e.g. ax-gcp, github, filesystem, puppeteer]
**Transport type:** [stdio | http | sse]
**Source:** [npm package name | local path | remote URL]
**Scope:** [local (this project only) | global (all projects)]
**Auth required:** [API key / OAuth / none — include env var names if known]
**Purpose:** [What tasks will I use this server for?]

Please:
1. Show me the exact JSON block to add to the correct config file:
   - Global: ~/.claude/claude_code_settings.json
   - Project: .claude/settings.json (or .mcp.json)
2. Include any environment variable setup needed
3. Tell me how to verify the server connected (list its tools)
4. Note any common gotchas for this server type
```

---

## Prompt — Build + Connect a Custom MCP Server

```
I want to build a new MCP server and connect it to Claude Code.

**What it should expose:** [Describe the tools — e.g. "CRUD operations against my Postgres database"]
**Language preference:** [TypeScript (recommended) | Python]
**Transport:** [stdio for local | streamable HTTP for remote/shared]
**Auth model:** [env var / OAuth / none]
**Deployment target:** [local process | Docker | cloud function]

Please:
1. Scaffold the full project using the MCP SDK (TypeScript: @modelcontextprotocol/sdk, Python: mcp)
2. Implement each tool with:
   - Clear name (verb_noun format, e.g. list_records, create_record)
   - Zod (TS) or Pydantic (Python) input schema
   - Proper async implementation
   - Actionable error messages
   - Annotations (readOnlyHint, destructiveHint, idempotentHint)
3. Add the server config to ~/.claude/claude_code_settings.json
4. Show me how to test it with MCP Inspector: npx @modelcontextprotocol/inspector
5. Create a README with connection instructions for teammates
```

---

## Config File Reference

### stdio server (npm package)
```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@scope/package-name"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

### stdio server (local script)
```json
{
  "mcpServers": {
    "my-local-server": {
      "command": "node",
      "args": ["/absolute/path/to/server/index.js"],
      "env": {}
    }
  }
}
```

### HTTP/SSE remote server
```json
{
  "mcpServers": {
    "remote-server": {
      "url": "https://my-server.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MY_TOKEN}"
      }
    }
  }
}
```

## Verify Connection

After adding the config, run in Claude Code:
```
/tools
```
or ask: "List all available MCP tools and which server each comes from."
