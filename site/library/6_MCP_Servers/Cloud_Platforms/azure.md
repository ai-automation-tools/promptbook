---
title: "🔌 Azure"
description: "Connects an agent to Azure services (storage, databases, monitoring, resources and more) through one Microsoft server."
tags: ["mcp-server", "cloud-platforms", "azure", "microsoft", "official"]
server:
  repo: microsoft/mcp
  path: servers/Azure.Mcp.Server
  license: "MIT"
  maintainer: "Microsoft (official)"
  transport: "stdio"
  checked: 2026-11-18
---

# Azure MCP server

Connects an agent to Azure services (storage, databases, monitoring, resources and more) through one Microsoft server.

## Install

**Claude Code** (the Azure plugin bundles the server with Azure agents and skills; run inside Claude Code)

```
/plugin install azure@claude-plugins-official
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "azure-mcp-server": {
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start"]
    }
  }
}
```

A .NET (`dnx`) and a Python (`uvx`) variant are in the README.

## What it can do

- Work with the Azure services the README lists, grouped into namespaces you can filter
- Run in read-only mode, which prevents write operations
- Run alone or alongside GitHub Copilot for Azure in VS Code

## Notes

It uses your Azure sign-in (`az login`) or the environment credentials of the Azure Identity SDK, so it can reach whatever that identity can. Use a narrow role, and prefer the read-only mode first. The `microsoft/mcp` repo also hosts a Fabric server and lists Microsoft's other MCP servers.

## Details

| | |
|:---|:---|
| **Source** | [microsoft/mcp](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server) |
| **Maintainer** | Microsoft (official) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | Azure sign-in (Azure CLI or environment credentials) |
| **Needs** | Node.js (or .NET 10 or uv) and an Azure account |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
