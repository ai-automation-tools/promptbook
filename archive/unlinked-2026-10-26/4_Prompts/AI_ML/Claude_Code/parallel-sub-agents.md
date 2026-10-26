---
title: "📌 Parallel Sub Agents"
tags: ["agents", "orchestration", "parallel", "concurrent", "fan-out"]
category: "Agents_and_Orchestration"
subcategory: "Parallel_Execution"
---

Fan out work across concurrent agents for faster execution.

## Prompt

```
Use the Task tool to run these sub-agents IN PARALLEL (launch all before awaiting):
- Agent A: [TASK A]
- Agent B: [TASK B]
- Agent C: [TASK C]

Collect all results and synthesize into a unified output.
```

## Usage Notes

- Replace `[TASK A/B/C]` with independent, non-dependent tasks
- All agents are launched before any results are awaited
- Best for tasks that do not depend on each other's output
- Synthesis step at the end combines all results
