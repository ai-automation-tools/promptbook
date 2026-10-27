---
title: "📌 Systematic Bug Hunt"
tags: ["debugging", "bug", "diagnosis", "hypothesis", "root-cause"]
category: "Debugging_and_Diagnosis"
subcategory: "Bug_Hunting"
---

Methodically track down a bug using hypothesis-driven investigation.

## Prompt

```
I have a bug: [DESCRIBE SYMPTOM]. Do NOT guess. Instead:
1) Form a hypothesis
2) Add targeted logging or read relevant code to test it
3) Confirm or rule out the hypothesis
4) Repeat until root cause is found
5) Then and only then, fix it

Show your reasoning at each step.
```

## Usage Notes

- Replace `[DESCRIBE SYMPTOM]` with the observable problem
- Hypothesis-first prevents thrashing through random fixes
- Each step is shown so you can redirect if the hypothesis is wrong
- The fix only happens after root cause is confirmed
