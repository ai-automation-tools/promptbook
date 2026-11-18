---
title: "🧑‍💼 Talent Scan Command"
description: "Scan the talent market for specific roles and provide hiring recommendations."
tags: ["anthropic","claude-code","hiring","slash-command"]
category: "Claude_Cookbooks"
subcategory: "Chief_Of_Staff"
upstream:
  match: similar
  repo: anthropics/claude-cookbooks
  path: claude_agent_sdk/chief_of_staff_agent/.claude/commands/talent-scan.md
  ref: ce8b2629efe8b24048b127b4c79af1e9cbab93d4
  checked: 2026-11-18
---

# Talent Scan Command

Scan the talent market for specific roles and provide hiring recommendations.

````
---
name: talent-scan
description: Scan the talent market for specific roles and provide hiring recommendations
---

Use the recruiter subagent to perform a talent market scan for: $ARGUMENTS

Analyze and report on:
1. Talent availability in target markets
2. Competitive salary ranges
3. Required skills and experience levels
4. Estimated time to hire
5. Recommended sourcing channels
6. Top candidate profiles (if using GitHub)

Provide specific recommendations on:
- Senior vs. junior hiring mix
- Remote vs. in-office strategy
- Compensation packages
- Interview process optimizations
````

---

From [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks).
