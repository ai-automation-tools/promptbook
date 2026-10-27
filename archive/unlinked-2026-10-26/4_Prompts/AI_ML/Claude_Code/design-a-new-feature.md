---
title: "📌 Design A New Feature"
tags: ["architecture", "design", "feature", "planning", "proposal"]
category: "Architecture_and_Design"
subcategory: "Feature_Design"
---

Plan a feature thoroughly before writing any code.

## Prompt

```
I want to add [FEATURE] to this project. Before writing code:
1) Understand the existing relevant code
2) Identify what will need to change
3) Propose 2-3 design approaches with tradeoffs
4) Recommend one and explain why
5) Ask for approval before implementing
```

## Usage Notes

- Replace `[FEATURE]` with what you want to build
- Multiple design options expose tradeoffs you might not have considered
- The approval gate prevents wasted implementation effort
- Output is a design doc, not code — review before the agent proceeds
