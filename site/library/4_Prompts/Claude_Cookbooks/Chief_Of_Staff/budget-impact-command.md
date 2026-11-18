---
title: "💰 Budget Impact Command"
description: "Analyze the financial impact of a decision on budget, burn rate, and runway."
tags: ["anthropic","claude-code","finance","slash-command"]
category: "Claude_Cookbooks"
subcategory: "Chief_Of_Staff"
upstream:
  match: similar
  repo: anthropics/claude-cookbooks
  path: claude_agent_sdk/chief_of_staff_agent/.claude/commands/budget-impact.md
  ref: ce8b2629efe8b24048b127b4c79af1e9cbab93d4
  checked: 2026-11-18
---

# Budget Impact Command

Analyze the financial impact of a decision on budget, burn rate, and runway.

````
---
name: budget-impact
description: Analyze the financial impact of a decision on budget, burn rate, and runway
---

Use the financial-analyst subagent to analyze the budget impact of: $ARGUMENTS

Provide a comprehensive analysis including:
1. Total cost (one-time and recurring)
2. Impact on monthly burn rate
3. Change in runway (months)
4. ROI analysis if applicable
5. Alternative options to consider
6. Risk factors

Format the response with clear sections and specific numbers. Include a final recommendation.
````

---

From [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks).
