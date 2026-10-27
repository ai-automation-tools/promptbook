---
title: "📌 Tdd Workflow"
tags: ["tdd", "testing", "test-driven", "red-green-refactor", "development"]
category: "Testing_and_Quality"
subcategory: "Test_Driven_Development"
---

Write tests first, then implement — enforcing true TDD discipline.

## Prompt

```
I want to implement [FEATURE] using TDD. Step 1: Write failing tests that define the expected behavior. Step 2: Confirm tests fail for the right reason. Step 3: Write minimal code to pass tests. Step 4: Refactor. Show me each step before proceeding to the next.
```

## Usage Notes

- Replace `[FEATURE]` with what you are building
- Each step is shown and confirmed before proceeding — no skipping ahead
- Tests define behavior before implementation, not after
- Refactor step is explicit, not optional
