---
title: "📌 Agent With Memory Context"
tags: ["agents", "memory", "CLAUDE.md", "context", "persistence"]
category: "Agents_and_Orchestration"
subcategory: "Memory_and_Context"
---

Give an agent persistent context via memory files before starting work.

## Prompt

```
Before starting, read CLAUDE.md and any relevant memory files in the project. Then complete: [TASK]. After finishing, update CLAUDE.md with any new patterns or decisions made during this task.
```

## Usage Notes

- Replace `[TASK]` with your objective
- Agent reads project memory first to stay consistent with prior decisions
- Agent writes back new learnings after completing the task
- Keeps CLAUDE.md as a living document of project knowledge
