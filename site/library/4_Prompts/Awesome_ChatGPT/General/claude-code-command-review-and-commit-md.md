---
title: "🤖 Claude Code Command: review-and-commit.md"
tags: ["awesome-chatgpt", "claude", "code", "command", "review"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# Claude Code Command: review-and-commit.md

---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Review the existing changes and then create a git commit following the conventional commit format. If you think there are more than one distinct change you can create multiple commits.


---

Contributed by [@DoguD](https://github.com/DoguD) to [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
