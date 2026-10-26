---
title: "📌 Recover From Bad Git State"
tags: ["git", "recovery", "detached-head", "conflict", "repair"]
category: "Git_and_Version_Control"
subcategory: "Recovery"
---

Diagnose and safely recover from a messy or broken git situation.

## Prompt

```
My git state is: [DESCRIBE]. Do not run any destructive commands without explaining what they do first. Diagnose what happened and propose a recovery plan step-by-step. Wait for my confirmation before each destructive step.
```

## Usage Notes

- Replace `[DESCRIBE]` with your current git situation (e.g., detached HEAD, conflicts, accidentally deleted branch)
- No destructive commands run without explicit confirmation
- Diagnosis step explains what happened before proposing a fix
- Safe to run even when you are not sure what went wrong
