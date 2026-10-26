---
title: "📌 Memory Leak Investigation"
tags: ["memory", "leak", "debugging", "cleanup", "lifecycle"]
category: "Debugging_and_Diagnosis"
subcategory: "Memory_Leaks"
---

Systematically investigate and fix a memory leak.

## Prompt

```
I suspect a memory leak in [COMPONENT/SERVICE]. Systematically investigate:
1) Identify objects that could accumulate
2) Check for missing cleanup in lifecycle methods, event listeners, timers, or streams
3) Add instrumentation to confirm
4) Fix the leak
5) Add a test to prevent regression
```

## Usage Notes

- Replace `[COMPONENT/SERVICE]` with the suspected leaky code
- Common culprits: event listeners without removeEventListener, unclosed streams, global caches
- Instrumentation step confirms the leak before the fix is applied
- Regression test step is mandatory — leaks have a way of coming back
