---
title: "📌 Automate A Repetitive Task"
tags: ["automation", "scripting", "idempotent", "dry-run", "devops"]
category: "Automation_and_Workflows"
subcategory: "Task_Automation"
---

Script a manual process with error handling, logging, and a dry-run mode.

## Prompt

```
I repeatedly do this manually: [DESCRIBE PROCESS]. Write a script to automate it. The script should: handle errors gracefully, be idempotent where possible, log what it is doing, and have a --dry-run flag that shows what would happen without making changes.
```

## Usage Notes

- Replace `[DESCRIBE PROCESS]` with the manual steps you want automated
- Idempotent means safe to run multiple times with the same result
- The --dry-run flag is critical for scripts that modify state
- Logging helps debug failures in unattended runs
