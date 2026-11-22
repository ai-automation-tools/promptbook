---
title: "💻 AI Code Review Feedback"
description: "Reviews pasted code for quality, security, performance and best practices, with issues ranked by severity."
tags: ["microsoft-copilot","code-review","security"]
category: "Microsoft_Copilot_Prompts"
subcategory: "Developer"
upstream:
  match: similar
  repo: pnp/copilot-prompts
  path: samples/prompts/m365-ai-code-review-feedback/README.md
  ref: 0a07328c33b785c3db1bc8801ade006f53f0f218
  checked: 2026-11-18
  license: MIT
---

# AI Code Review Feedback

Reviews pasted code for quality, security, performance and best practices, with issues ranked by severity.

```
Review the following code and provide detailed feedback including:
- Code quality assessment (readability, maintainability, complexity)
- Security vulnerabilities or concerns
- Performance optimization opportunities
- Best practices compliance
- Suggested improvements with code examples
- Overall code rating (1-10)

Format the output with clear sections and prioritize issues by severity (Critical, High, Medium, Low).

Code to review:
{Paste_Your_Code_Here}

Programming language: {Specify_Language}
```

---

From [pnp/copilot-prompts](https://github.com/pnp/copilot-prompts).
