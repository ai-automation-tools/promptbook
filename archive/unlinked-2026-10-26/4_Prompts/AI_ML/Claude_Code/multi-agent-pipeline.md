---
title: "📌 Multi Agent Pipeline"
tags: ["agents", "orchestration", "pipeline", "workflow", "sequential"]
category: "Agents_and_Orchestration"
subcategory: "Pipeline_Design"
---

Chain agents sequentially for a multi-step workflow.

## Prompt

```
Design a multi-agent pipeline for: [WORKFLOW]. Use the Task tool to create sequential agents:
1) Researcher — gathers info
2) Analyst — processes findings
3) Writer — produces final output

Each agent receives only the output it needs from the previous step.
```

## Usage Notes

- Replace `[WORKFLOW]` with your end-to-end process description
- Each agent should have a single responsibility
- Pass only the minimum necessary context between agents
- Useful for research → analysis → report workflows
