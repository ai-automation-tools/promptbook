---
title: "📊 Strategic Brief Command"
description: "Generate a comprehensive strategic brief by coordinating analysis from both financial and talent perspectives."
tags: ["anthropic","claude-code","strategy","slash-command"]
category: "Claude_Cookbooks"
subcategory: "Chief_Of_Staff"
upstream:
  match: similar
  repo: anthropics/claude-cookbooks
  path: claude_agent_sdk/chief_of_staff_agent/.claude/commands/strategic-brief.md
  ref: ce8b2629efe8b24048b127b4c79af1e9cbab93d4
  checked: 2026-11-18
---

# Strategic Brief Command

Generate a comprehensive strategic brief by coordinating analysis from both financial and talent perspectives.

````
---
name: strategic-brief
description: Generate a comprehensive strategic brief by coordinating analysis from both financial and talent perspectives
---

Create a strategic brief on: $ARGUMENTS

Coordinate with both the financial-analyst and recruiter subagents to provide:

## Executive Summary
- Key recommendation (1-2 sentences)
- Critical metrics impact

## Financial Analysis (via financial-analyst)
- Cost/investment required
- ROI and payback period
- Impact on runway and burn rate
- Financial risks and mitigation

## Talent Perspective (via recruiter)
- Team capabilities required
- Hiring implications
- Retention considerations
- Competitive talent landscape

## Strategic Recommendation
- Recommended action plan
- Success metrics
- Timeline and milestones
- Risk mitigation strategies

## Alternative Options
- At least 2 alternative approaches
- Pros/cons of each

Format for board-level presentation with clear sections and data-driven insights.
````

---

From [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks).
