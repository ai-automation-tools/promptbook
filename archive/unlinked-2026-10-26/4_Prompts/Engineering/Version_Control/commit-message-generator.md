---
title: "📌 Goal"
tags:
- collections
- engineering
- commit
- message
- generator
category: Collections
subcategory: Engineering
---
# Goal
Generate a clear, concise, and conventional commit message.

# Inputs
- **Diff:** The code changes to be committed.
- **Commit Type:** The type of commit (e.g., feat, fix, docs, style, refactor, test, chore).
- **Scope:** (Optional) The scope of the commit (e.g., component, file name).
- **Issue Number:** (Optional) The issue number related to the commit.

# Instructions
1.  Analyze the provided code diff.
2.  Write a subject line that follows the conventional commit format: `<type>(<scope>): <subject>`.
3.  The subject line should be 50 characters or less.
4.  The subject line should be capitalized.
5.  The subject line should not end with a period.
6.  Write a body that explains the "what" and "why" of the changes.
7.  The body should be wrapped at 72 characters.
8.  If there is a related issue, add a footer with `Closes #<issue-number>`.

# Output format
```
<type>(<scope>): <Subject>

<Body>

Closes: #<issue-number>
```

# Examples

## Example 1: Simple fix

**Diff:**
```diff
- return a + b;
+ return a - b;
```
**Commit Type:** `fix`
**Scope:** `calculator`
**Issue Number:** `42`

**Output:**
```
fix(calculator): Correct the add function

The add function was incorrectly subtracting instead of adding. This commit corrects the logic.

Closes: #42
```

## Example 2: New Feature

**Diff:**
```diff
+ function multiply(a, b) {
+   return a * b;
+ }
```
**Commit Type:** `feat`
**Scope:** `calculator`
**Issue Number:** `23`

**Output:**
```
feat(calculator): Add multiply function

Adds a new multiply function to the calculator.

Closes: #23
```

# What not to do
- Do not write generic messages like "Fixed a bug" or "Made changes".
- Do not exceed the line limits.
- Do not forget to include the issue number if it exists.
- Do not mix different types of changes in one commit.
