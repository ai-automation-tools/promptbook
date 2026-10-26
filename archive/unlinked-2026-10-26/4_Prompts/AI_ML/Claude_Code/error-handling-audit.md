---
title: "📌 Error Handling Audit"
tags: ["error-handling", "exceptions", "audit", "resilience", "ux"]
category: "Debugging_and_Diagnosis"
subcategory: "Error_Handling"
---

Find unhandled errors and silently swallowed exceptions across a module.

## Prompt

```
Audit [FILE/MODULE] for error handling gaps. Find: unhandled promise rejections, missing try/catch, errors that get silently swallowed, places where the user would see a cryptic error. For each gap, implement proper error handling with a user-friendly message.
```

## Usage Notes

- Replace `[FILE/MODULE]` with the target code
- Silently swallowed errors are the hardest to debug in production
- User-facing errors should be human-readable, not stack traces
- Good to run before any public-facing feature ships
