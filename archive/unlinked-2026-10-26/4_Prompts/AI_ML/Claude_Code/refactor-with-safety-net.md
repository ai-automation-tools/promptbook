---
title: "📌 Refactor With Safety Net"
tags: ["refactor", "code", "api", "safety", "preservation"]
category: "File_and_Code_Operations"
subcategory: "Refactoring"
---

Refactor code while verifying the public API surface remains unchanged.

## Prompt

```
Refactor [FILE/MODULE] to [GOAL]. Before changing anything:
1) Read all relevant files
2) Note the public API surface
3) Make changes
4) Verify the public API is unchanged

List every file modified.
```

## Usage Notes

- Replace `[FILE/MODULE]` with the target
- Replace `[GOAL]` with your refactoring objective (e.g., use async/await, split into modules)
- The API surface check prevents accidental breaking changes
- Always review the list of modified files before committing
