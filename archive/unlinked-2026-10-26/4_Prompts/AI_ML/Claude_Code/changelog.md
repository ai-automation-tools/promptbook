---
title: "📌 Changelog"
tags: ["changelog", "git", "release", "history", "user-facing"]
category: "Documentation"
subcategory: "Changelog_Generation"
---

Generate a user-facing changelog from git history between two commits.

## Prompt

```
Read the git log from [START COMMIT] to HEAD. Group changes into: Breaking Changes, New Features, Bug Fixes, Performance Improvements, and Internal Changes. Write a user-facing changelog in a friendly, clear tone. Skip internal refactors that do not affect users.
```

## Usage Notes

- Replace `[START COMMIT]` with a tag, SHA, or branch name
- User-facing tone means no jargon, no PR numbers, no internal variable names
- Internal changes section exists but is kept brief
- Output is ready to paste into CHANGELOG.md or release notes
