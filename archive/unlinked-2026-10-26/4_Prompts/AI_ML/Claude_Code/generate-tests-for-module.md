---
title: "📌 Generate Tests For Module"
tags: ["testing", "unit-tests", "test-suite", "coverage", "edge-cases"]
category: "File_and_Code_Operations"
subcategory: "Test_Generation"
---

Write a comprehensive test suite for an existing module.

## Prompt

```
Read [FILE]. Generate a complete test suite covering: unit tests for each exported function, edge cases, error conditions, and at least one integration test. Use [TESTING FRAMEWORK]. Write tests to [TEST_FILE].
```

## Usage Notes

- Replace `[FILE]` with the module to test
- Replace `[TESTING FRAMEWORK]` with Jest, Vitest, pytest, etc.
- Replace `[TEST_FILE]` with the target test file path
- Ask for edge cases explicitly — Claude will find non-obvious ones
