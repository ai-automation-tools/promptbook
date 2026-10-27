---
title: "🤝 Github Pages Deployment Check"
tags: ["ai-tools", "claude-cowork", "github", "pages", "deployment"]
category: "AI_Tools"
subcategory: "Claude_Cowork"
---
# GitHub Pages Deployment Check

**Schedule:** Daily — 10:00 AM
**Category:** Development
**Tools Required:** GitHub, Web Fetch
**Estimated Time:** ~3 minutes

## Prompt

Check the status of all GitHub Pages deployments across my repositories. For each site:
1. Confirm the last deployment completed successfully
2. Check if the live site is returning a 200 status (no broken deployments)
3. Review if any pending content changes in main haven't been published yet
4. Note if any Actions workflow for deployment has been queued more than 10 minutes

If any deployment failed, provide the most likely cause and the exact fix command or config change needed. Output a simple status table: Repo | URL | Last Deploy | Status | Action Needed.

