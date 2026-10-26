---
title: "🤝 Github Repo Health Check"
tags: ["ai-tools", "claude-cowork", "github", "repo", "health"]
category: "AI_Tools"
subcategory: "Claude_Cowork"
---
# GitHub Repo Health Check

**Schedule:** Daily — 9:00 AM
**Category:** Development
**Tools Required:** GitHub
**Estimated Time:** ~4 minutes

## Prompt

Check the health of my active GitHub repositories. For each repo in my active development list:
1. Review open pull requests older than 3 days — summarize what's pending
2. Check for any failed GitHub Actions workflows in the last 24 hours
3. Flag any dependency security alerts (Dependabot)
4. Note if main branch hasn't had a commit in more than 7 days

Produce a morning dev standup summary: what needs attention today, any broken CI/CD pipelines, and the top 1–2 PRs to review or merge. Keep it actionable and under 150 words.

