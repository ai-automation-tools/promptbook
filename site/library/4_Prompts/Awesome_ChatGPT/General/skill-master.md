---
title: "🤖 skill-master"
tags: ["awesome-chatgpt", "skill", "master"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# skill-master

---
name: skill-master
description: Discover codebase patterns and auto-generate SKILL files for .claude/skills/. Use when analyzing project for missing skills, creating new skills from codebase patterns, or syncing skills with project structure.
version: 1.0.0
---

# Skill Master

## Overview

Analyze codebase to discover patterns and generate/update SKILL files in `.claude/skills/`. Supports multi-platform projects with stack-specific pattern detection.

**Capabilities:**
- Scan codebase for architectural patterns (ViewModel, Repository, Room, etc.)
- Compare detected patterns with existing skills
- Auto-generate SKILL files with real code examples
- Version tracking and smart updates

## How the AI discovers and uses this skill

This skill triggers when user:
- Asks to analyze project for missing skills
- Requests skill generation from codebase patterns
- Wants to sync or update existing skills
- Mentions "skill discovery", "generate skills", or "skill-sync"

**Detection signals:**
- `.claude/skills/` directory presence
- Project structure matching known patterns
- Build/config files indicating platform (see references)

## Modes

### Discover Mode

Analyze codebase and report missing skills.

**Steps:**
1. Detect platform via build/config files (see references)
2. Scan source roots for pattern indicators
3. Compare detected patterns with existing `.claude/skills/`
4. Output gap analysis report

**Output format:**


---

From [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
