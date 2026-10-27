---
title: "📌 MCP Server Health Check"
tags: ["mcp", "tools", "health", "connectivity", "verification"]
category: "MCP_and_Tool_Integration"
subcategory: "Health_Checks"
---

Verify all connected MCP tools are reachable and working correctly.

## Prompt

```
List all available MCP tools in this session. For each MCP server connected, call a lightweight read/list operation to verify it is working. Report: server name, tools available, and status (ok / error). Flag any that fail.
```

## Usage Notes

- Run at the start of any session that relies on MCP tools
- Uses lightweight read/list calls — avoids write side-effects
- Any failing server is flagged for investigation
- Useful for debugging connectivity issues in complex setups
