---
title: "🤝 Github Awesome Prompts Sync"
tags: ["ai-tools", "claude-cowork", "github", "awesome", "prompts"]
category: "AI_Tools"
subcategory: "Claude_Cowork"
---
# GitHub Awesome-Prompts Sync

**Schedule:** Every Sunday — 8:00 AM
**Category:** AI Prompts
**Tools Required:** Web Fetch, GitHub
**Estimated Time:** ~12 minutes

## Prompt

Fetch and sync the most active "awesome prompts" GitHub repositories that have had commits in the last 7 days. Check these repos for new additions:
- f/awesome-chatgpt-prompts
- ai-boost/awesome-prompts  
- willwulfken/MidJourney-Styles-and-Keywords-Reference
- dair-ai/Prompt-Engineering-Guide
- brexhq/prompt-engineering
- Any other repos with "prompt" in the name and 500+ stars updated this week

For each repo: fetch the diff or new entries since last sync. Extract newly added prompts only. Categorize and save new entries to ~/prompts/github-sync/[repo-name]/new-[YYYY-MM-DD].md.

Also check the Prompt Engineering Guide for any new techniques or patterns added. If a new technique is documented, save a summary to ~/prompts/techniques/[technique-name].md. Update ~/prompts/github-sync/last-sync.md with timestamp and count of new items found.

