---
title: "📌 Load Project Context"
tags: ["CLAUDE.md", "context", "onboarding", "orientation", "project"]
category: "CLAUDE_md_and_Memory"
subcategory: "Context_Loading"
---

Fully orient before starting work by reading all project memory and structure.

## Prompt

```
Before touching any code:
1) Read CLAUDE.md thoroughly
2) Read the README
3) List the top-level structure
4) Read the main entry point

Summarize your understanding of the project in 5 bullet points, then ask if your understanding is correct before proceeding.
```

## Usage Notes

- Use at the start of any new session in an established project
- The confirmation step catches misunderstandings before they cause problems
- Especially important when resuming work after a gap
- Can be combined with the Bootstrap prompt to create CLAUDE.md first
