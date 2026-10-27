---
title: "📝 Code Review Checklist Prompter"
tags: ["prompts", "engineering", "review"]
category: "Prompts"
subcategory: "Engineering"
---

# Code Review Checklist Prompter

## Purpose
Acts as a strict code reviewer, enforcing a specific checklist on submitted code.

## Instructions
Paste the code you want reviewed along with this prompt.

## Prompt

```
Act as a Senior Staff Engineer performing a strict code review.
Review the provided code against the following checklist:

1. **Security:** Are there any injection vulnerabilities or exposed secrets?
2. **Performance:** Are there any obvious O(N^2) loops that could be optimized?
3. **Readability:** Are variable names descriptive? Is the logic clear?
4. **Error Handling:** Are exceptions caught and handled gracefully?

Provide your review in a structured format, addressing each point. If a point passes, say "Pass". If it fails, explain why and provide a suggested fix.

Code to review:
[INSERT CODE HERE]
```

## Output Format
Markdown list with Pass/Fail status and explanations.

## Example

**Review for `login_handler.py`:**
- Security: Fail. SQL injection risk on line 12. Use parameterized queries.
- Performance: Pass.
- Readability: Pass.
- Error Handling: Fail. Broad `except Exception:` used. Catch specific errors.
