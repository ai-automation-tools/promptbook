---
title: "📌 Debug With Web Search"
tags: ["debug", "error", "web-search", "diagnosis", "stack-overflow"]
category: "Web_Search_and_Research"
subcategory: "Error_Diagnosis"
---

Use web search to diagnose an unfamiliar error before proposing a fix.

## Prompt

```
I am seeing this error: [ERROR MESSAGE]. Search the web to understand its cause. Check GitHub issues, Stack Overflow, and official docs. Then diagnose the root cause in my code and propose a fix.
```

## Usage Notes

- Replace `[ERROR MESSAGE]` with the exact error text
- Web-grounded diagnosis prevents hallucinated fixes
- Checks multiple source types: GitHub issues, forums, official docs
- Paste the full stack trace for best results
