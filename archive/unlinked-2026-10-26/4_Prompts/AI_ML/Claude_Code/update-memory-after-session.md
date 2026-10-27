---
title: "📌 Update Memory After Session"
tags: ["CLAUDE.md", "memory", "update", "session", "learnings"]
category: "CLAUDE_md_and_Memory"
subcategory: "Memory_Updates"
---

Capture what was learned during a work session and persist it to memory.

## Prompt

```
We just completed: [SESSION SUMMARY]. Update CLAUDE.md to reflect: any new patterns established, decisions made and why, commands that proved useful, and anything future-me should know. Do not duplicate what is already there.
```

## Usage Notes

- Replace `[SESSION SUMMARY]` with a brief description of what was done
- Keeps CLAUDE.md as a living document, not a one-time artifact
- The deduplication instruction prevents CLAUDE.md from bloating
- Run at the end of any significant work session
