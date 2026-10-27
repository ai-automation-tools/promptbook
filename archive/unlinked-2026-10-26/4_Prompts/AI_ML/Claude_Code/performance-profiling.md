---
title: "📌 Performance Profiling"
tags: ["performance", "profiling", "bottleneck", "optimization", "latency"]
category: "Debugging_and_Diagnosis"
subcategory: "Performance"
---

Find and fix a performance bottleneck with targeted instrumentation.

## Prompt

```
Profile [FEATURE/ENDPOINT] for performance issues. Instrument key paths with timing. Identify the top 3 bottlenecks by impact. For each, propose a specific optimization with an estimated improvement. Implement the highest-impact one.
```

## Usage Notes

- Replace `[FEATURE/ENDPOINT]` with what is slow
- Instrumentation-first means findings are data-driven, not guessed
- Top 3 by impact focuses effort on what matters
- Only the highest-impact fix is implemented — prevents over-engineering
