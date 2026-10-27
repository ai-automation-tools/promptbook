---
title: "📌 Github Actions Workflow"
tags: ["github-actions", "ci-cd", "automation", "pipeline", "devops"]
category: "Automation_and_Workflows"
subcategory: "CI_CD"
---

Create a complete, optimized GitHub Actions CI/CD workflow.

## Prompt

```
Create a GitHub Actions workflow for [PROJECT TYPE]. Include: install dependencies, lint, type-check, test with coverage, build, and [DEPLOY STEP if applicable]. Use caching for dependencies. Fail fast on errors. Output workflow file.
```

## Usage Notes

- Replace `[PROJECT TYPE]` with your stack (e.g., Node.js API, Python ML project)
- Replace `[DEPLOY STEP]` with your deployment target (Vercel, AWS, Docker, etc.)
- Caching is mandatory — without it, pipelines are unnecessarily slow
- Fail-fast stops the pipeline at the first error, saving time and credits
