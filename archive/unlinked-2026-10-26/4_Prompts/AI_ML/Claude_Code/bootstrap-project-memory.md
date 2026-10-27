---
title: "📌 Bootstrap Project Memory"
tags: ["CLAUDE.md", "memory", "project", "setup", "conventions"]
category: "CLAUDE_md_and_Memory"
subcategory: "Project_Setup"
---

Create a CLAUDE.md for a new project to give future agents instant context.

## Prompt

```
Read the codebase structure and key files. Then create a CLAUDE.md at the project root with:
1) Project purpose and architecture
2) Key conventions and patterns
3) Important commands (build, test, lint)
4) Files and areas to be careful with
5) Known gotchas

Be specific and terse.
```

## Usage Notes

- Run once at the start of any new project
- Terse and specific beats verbose and generic
- CLAUDE.md seeds every future agent with consistent context
- Revisit and update after significant architectural changes
