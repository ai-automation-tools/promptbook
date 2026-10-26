---
title: "📌 Smart Commit Message"
tags: ["git", "commit", "conventional-commits", "message", "changelog"]
category: "Git_and_Version_Control"
subcategory: "Commit_Messages"
---

Generate a precise, conventional commit message from staged changes.

## Prompt

```
Review the diff of my staged changes. Write a commit message following Conventional Commits format. Include: a concise subject line (type: description), a body explaining WHY the change was made (not just what), and any breaking changes. Do not include the diff itself.
```

## Usage Notes

- Run after staging changes with `git add`
- Conventional Commits format: feat/fix/chore/refactor/docs/test/ci
- The body focuses on motivation, not mechanics — this is the valuable part
- Breaking changes trigger a BREAKING CHANGE footer
