---
title: "🔌 Azure DevOps"
description: "Microsoft's server for Azure DevOps: projects, repos, work items, builds, pipelines, test plans and wikis."
tags: ["mcp-server", "developer-tools", "azure-devops", "work-items", "official"]
server:
  repo: microsoft/azure-devops-mcp
  license: "MIT"
  maintainer: "Microsoft (official)"
  transport: "HTTP (remote), stdio"
  checked: 2026-11-18
---

# Azure DevOps MCP server

Microsoft's server for Azure DevOps: projects, repos, work items, builds, pipelines, test plans and wikis.

## Install

**Any MCP client** (hosted server; replace `{organization}` with your Azure DevOps organisation)

```json
{
  "servers": {
    "ado-remote-mcp": {
      "url": "https://mcp.dev.azure.com/{organization}",
      "type": "http"
    }
  }
}
```

**Local stdio server** (only if you need stdio)

```json
{
  "servers": {
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "{organization}"]
    }
  }
}
```

The README shows these in VS Code's `.vscode/mcp.json` shape (`servers`); other clients use their own wrapper.

## What it can do

- List projects, repos, builds, teams and iterations
- Read and create work items, and read test plans
- Read and edit wiki pages

## Notes

Microsoft recommends the hosted remote server and says new development will focus on it; the local server stays supported. The local server takes `-d` with domains (`core`, `work`, `work-items`, `search`, `test-plans`, `repositories`, `wiki`, `pipelines`, `advanced-security`) to load only the tool groups you need; always include `core`. Sign in with a Microsoft account that can reach the organisation.

## Details

| | |
|:---|:---|
| **Source** | [microsoft/azure-devops-mcp](https://github.com/microsoft/azure-devops-mcp) |
| **Maintainer** | Microsoft (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote), stdio |
| **Auth** | Microsoft account sign-in |
| **Needs** | An Azure DevOps organisation; Node.js 20+ for the local server |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
