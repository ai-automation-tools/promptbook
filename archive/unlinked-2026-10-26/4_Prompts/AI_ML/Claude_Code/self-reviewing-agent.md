---
title: "📌 Self Reviewing Agent"
tags: ["agents", "self-review", "critique", "quality", "iteration"]
category: "Agents_and_Orchestration"
subcategory: "Quality_Assurance"
---

An agent that critiques and improves its own output via a second-pass reviewer.

## Prompt

```
Complete [TASK]. Once done, spawn a sub-agent using the Task tool with this prompt: "Review the following output for correctness, completeness, and edge cases: [OUTPUT]. Return a list of issues and a revised version." Apply the revisions.
```

## Usage Notes

- Replace `[TASK]` with what you want built or written
- The reviewer sub-agent is separate from the doer — reduces blind spots
- Apply all non-trivial issues identified by the reviewer
- Can be chained multiple times for higher-stakes outputs
