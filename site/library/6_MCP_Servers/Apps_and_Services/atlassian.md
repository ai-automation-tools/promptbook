---
title: "🔌 Atlassian"
description: "Search, read and update Jira, Confluence, Jira Service Management, Bitbucket, Compass and Loom from an agent, through Atlassian's hosted server."
tags: ["mcp-server", "apps-and-services", "jira", "confluence", "project-management", "official"]
server:
  repo: atlassian/atlassian-mcp-server
  license: "Apache-2.0"
  maintainer: "Atlassian (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-12
---

# Atlassian MCP server

Search, read and update Jira, Confluence, Jira Service Management, Bitbucket, Compass and Loom from an agent, through Atlassian's hosted server.

## Install

**Claude Code**

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp
```

Then run `/mcp` in a session to authenticate.

**Any MCP client** (use the server URL)

```text
https://mcp.atlassian.com/v2/mcp
```

The README names `/v2/mcp` as the recommended endpoint for new setups. A local client that cannot reach a remote server directly can connect through the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) proxy.

## What it can do

- Search and summarize Jira work items, Confluence pages and Bitbucket content
- Create and update Jira work items and Confluence pages from plain-language requests
- Retrieve Loom recordings and Compass component data
- Generate work items in bulk from meeting notes or a spec

## Notes

Access follows the signed-in user's existing Atlassian permissions, and an organization admin grants tools by permission group. The `delete_jira` and `manage_jira` groups are off until an admin enables them. Headless setups use a personal API token (`Authorization: Basic`, email and token) or a service account key (`Authorization: Bearer`); an admin must enable API token authentication first. Jira Service Management tools work only with API tokens.

## Details

| | |
|:---|:---|
| **Source** | [atlassian/atlassian-mcp-server](https://github.com/atlassian/atlassian-mcp-server) |
| **Maintainer** | Atlassian (official) |
| **Licence** | Apache-2.0 |
| **Transport** | HTTP (remote) |
| **Auth** | OAuth 2.1, or an API token / service account key in an `Authorization` header |
| **Needs** | An Atlassian Cloud site with one or more supported products |

_Install lines read from the server's README on 2026-11-12. The Monthly Upkeep re-checks every card._
