---
title: "📐 Linear"
tags: ["skill","platform-integrations","linear"]
name: "linear"
description: Manage issues, projects, cycles, labels, and team workflows in Linear. Use when reading, creating, or updating Linear tickets through connected tools.
source: https://skillsmp.com/skills/openai-plugins-plugins-linear-skills-linear-skill-md
author: openai
repository: https://github.com/openai/plugins
stars: 913
forks: 106
updated: 2026-04-21
upstream:
  match: fork
  note: upstream removed this file; we own this copy now
  repo: openai/plugins
  path: plugins/linear/skills/linear/SKILL.md
  ref: 399942ed3d308496baae74f9d16cfa135557a28f
  declared: "https://skillsmp.com/skills/openai-plugins-plugins-linear-skills-linear-skill-md"
  checked: 2026-08-26
---

# Linear

Use this skill for structured work inside Linear rather than ad hoc ticket editing.

## Prerequisites

- Linear tools or app connection must already be available
- Confirm the correct workspace, team, and project before making changes

## When To Use

- Create or update issues
- Triage bugs and prioritize backlogs
- Plan cycles or release work
- Audit documentation tasks and open follow-up tickets
- Rebalance workload across assignees

## Recommended Workflow

1. Clarify the goal: triage, planning, documentation, project setup, or status update.
2. Read first: list issues, projects, teams, labels, cycles, or documents.
3. Confirm identifiers before mutating anything.
4. Apply grouped updates in logical batches.
5. Summarize what changed, what is blocked, and what should happen next.

## Common Operations

- Issue management: list, search, get, create, update, comment
- Planning: review active cycles, assign work, create labels, track blockers
- Project work: create or update a project, then attach related issues
- Documentation audit: search docs, identify gaps, and open actionable follow-ups

## Practical Tips

- Read existing state before creating duplicates
- Batch related edits to avoid noisy ticket churn
- Use consistent labels and priorities
- Break large cleanup jobs into smaller passes

## Troubleshooting

- If tools are unavailable, stop and connect the Linear integration first
- If data looks incomplete, verify workspace access and archived filters
- If requests are large, split them into smaller batches
