---
title: "📌 Mutation Testing Mindset"
tags: ["testing", "mutation", "weak-tests", "coverage", "robustness"]
category: "Testing_and_Quality"
subcategory: "Test_Hardening"
---

Find weak tests by asking what mutations to the source would still pass them.

## Prompt

```
Review the test suite in [FILE/DIRECTORY]. For each test, ask: "What mutation to the source code would cause this test to still pass?" Identify tests that would not catch obvious bugs. Rewrite the weak tests to be more precise.
```

## Usage Notes

- Replace `[FILE/DIRECTORY]` with your test location
- Weak tests have assertions that are too broad or missing entirely
- This approach finds false coverage — tests that run but do not verify behavior
- Pair with a real mutation testing tool (Stryker, mutmut) for full coverage
