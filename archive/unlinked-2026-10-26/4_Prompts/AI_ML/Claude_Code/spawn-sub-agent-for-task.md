---
title: "📌 Spawn Sub Agent For Task"
tags: ["agents", "orchestration", "task", "delegation", "sub-agent"]
category: "Agents_and_Orchestration"
subcategory: "Task_Delegation"
---

Delegate a scoped task to a new agent instance.

## Prompt

```
Use the Task tool to spawn a sub-agent. Give it this focused goal: [DESCRIBE GOAL]. The sub-agent should complete it independently and return a structured result. Keep its system prompt minimal and goal-specific.
```

## Usage Notes

- Replace `[DESCRIBE GOAL]` with a single, well-scoped objective
- Keep the sub-agent system prompt short — one paragraph max
- Use for tasks that are self-contained and do not require back-and-forth
- The sub-agent returns a structured result; you decide how to use it
