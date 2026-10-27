---
title: "📌 Create Operational Runbook"
tags: ["runbook", "operations", "incident", "troubleshooting", "sre"]
category: "Documentation"
subcategory: "Operational_Runbooks"
---

Write an operational runbook that is actually useful during incidents.

## Prompt

```
Create an operational runbook for [SYSTEM/SERVICE]. Include:
1) System overview
2) Common operational tasks with step-by-step commands
3) Troubleshooting guide for the top 5 failure modes
4) Escalation path
5) Key contacts and links

Make it useful at 2am during an incident.
```

## Usage Notes

- Replace `[SYSTEM/SERVICE]` with your system
- The "2am" framing forces brevity and clarity over completeness
- Troubleshooting section is the most valuable part — invest here
- Commands should be copy-pasteable, not described abstractly
