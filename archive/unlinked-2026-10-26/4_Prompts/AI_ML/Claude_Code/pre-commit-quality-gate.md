---
title: "📌 Pre Commit Quality Gate"
tags: ["testing", "quality", "lint", "typecheck", "pre-commit"]
category: "Testing_and_Quality"
subcategory: "Quality_Gates"
---

Run all quality checks before committing and get a clear go/no-go decision.

## Prompt

```
Before I commit, run this sequence:
1) Run linter and fix auto-fixable issues
2) Run type checker and report errors
3) Run test suite — report pass/fail counts
4) Check for any TODO/FIXME I introduced
5) Summarize: ready to commit? If not, what needs fixing?
```

## Usage Notes

- All steps run sequentially; failures are reported not silently skipped
- Auto-fixable lint issues are resolved automatically
- The final summary gives a clear commit readiness verdict
- Adapt step order to your stack (e.g., swap tsc for mypy)
