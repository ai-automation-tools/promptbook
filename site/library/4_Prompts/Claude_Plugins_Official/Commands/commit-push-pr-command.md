---
title: "🚀 Commit, Push and Open PR Command"
description: "Creates a branch, commits, pushes and opens a pull request in one command."
tags: ["anthropic","claude-code","git","slash-command"]
category: "Claude_Plugins_Official"
subcategory: "Commands"
upstream:
  match: similar
  repo: anthropics/claude-plugins-official
  path: plugins/commit-commands/commands/commit-push-pr.md
  ref: 6d491811023d7af2c96a7fab274935922b29ed01
  checked: 2026-11-18
  license: Apache-2.0
---

# Commit, Push and Open PR Command

Creates a branch, commits, pushes and opens a pull request in one command.

```
---
allowed-tools: Bash(git checkout --branch:*), Bash(git add:*), Bash(git status:*), Bash(git push:*), Bash(git commit:*), Bash(gh pr create:*)
description: Commit, push, and open a PR
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`

## Your task

Based on the above changes:

1. Create a new branch if on main
2. Create a single commit with an appropriate message
3. Push the branch to origin
4. Create a pull request using `gh pr create`
5. You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.
```

---

From [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official).
