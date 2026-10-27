---
title: "📌 Pr Description"
tags: ["git", "pull-request", "pr", "description", "review"]
category: "Git_and_Version_Control"
subcategory: "Pull_Requests"
---

Write a detailed, reviewer-friendly pull request description.

## Prompt

```
I am opening a PR for [BRANCH]. Read the git log and diff against main. Write a PR description with: Summary of changes, Motivation and context, How it was tested, Screenshots or examples if relevant, Checklist of reviewer concerns. Be specific.
```

## Usage Notes

- Replace `[BRANCH]` with your feature branch name
- Agent reads actual git history — descriptions are grounded in real changes
- The reviewer checklist surfaces known concerns proactively
- Paste into GitHub/GitLab PR description field
