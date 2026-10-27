---
title: "📌 End To End Scenario Test"
tags: ["e2e", "testing", "playwright", "user-flow", "scenario"]
category: "Testing_and_Quality"
subcategory: "End_to_End_Testing"
---

Write a resilient end-to-end test for a complete user scenario.

## Prompt

```
Write an end-to-end test for this user scenario: [SCENARIO]. Use [TESTING TOOL]. The test should be resilient to minor UI changes and include meaningful assertions at each step.
```

## Usage Notes

- Replace `[SCENARIO]` with the full user journey (e.g., user signs up, verifies email, completes onboarding)
- Replace `[TESTING TOOL]` with your E2E framework (e.g., Playwright, Cypress)
- Resilience means using semantic selectors, not brittle CSS paths
- Each step should have at least one assertion — not just navigation
