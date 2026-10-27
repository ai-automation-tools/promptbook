---
title: "📌 Schedule And Monitor A Job"
tags: ["scheduling", "cron", "monitoring", "alerting", "automation"]
category: "Automation_and_Workflows"
subcategory: "Scheduled_Jobs"
---

Set up a scheduled job with logging, failure alerting, and manual trigger capability.

## Prompt

```
I need to run [TASK] on a schedule: [CRON EXPRESSION or frequency]. Set up: the scheduled execution, logging of each run (start time, duration, success/failure), an alert if it fails or takes too long, and a way to manually trigger it. Implement using [AVAILABLE TOOLS].
```

## Usage Notes

- Replace `[TASK]` with what should run on schedule
- Replace `[CRON EXPRESSION]` with timing (e.g., "0 9 * * 1-5" for weekday 9am)
- Replace `[AVAILABLE TOOLS]` with your stack (cron, GitHub Actions, n8n, etc.)
- The manual trigger is essential for testing and incident recovery
