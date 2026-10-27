---
title: "📌 Cross Tool Workflow"
tags: ["mcp", "workflow", "orchestration", "tools", "multi-step"]
category: "MCP_and_Tool_Integration"
subcategory: "Workflow_Orchestration"
---

Orchestrate a task across multiple MCP tools in a planned sequence.

## Prompt

```
Complete this workflow using the available MCP tools: [WORKFLOW DESCRIPTION]. Plan the sequence of tool calls first, then execute. If a tool returns an error, try an alternative approach. Summarize what each tool was used for.
```

## Usage Notes

- Replace `[WORKFLOW DESCRIPTION]` with your end-to-end process
- Planning the sequence before execution reduces wasted calls
- Error handling is built in — agent tries alternatives on failure
- The summary helps audit which tools were actually used
