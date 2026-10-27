---
title: "Prompt: Create a New Claude Code Skill"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Create a New Claude Code Skill

**Use when:** You want to package a reusable workflow, tool pattern, or domain knowledge into a Skill that Claude Code will auto-discover and apply.

---

## Prompt

```
I want to create a new Claude Code Skill. Here is what it should do:

**Purpose:** [Describe the capability — e.g. "Generate n8n workflow JSON from a plain-English description"]

**Trigger context:** [When should Claude automatically use this Skill? e.g. "Whenever the user mentions n8n, workflows, or automation pipelines"]

**Scope:** [personal (~/.claude/skills/) or project (.claude/skills/) — pick one]

**Tools it needs:** [e.g. Read, Write, Bash, WebFetch — or "all tools"]

**Key steps Claude should follow:** [List the main steps the Skill should execute, in order]

**Supporting files needed:** [e.g. a reference.md with API docs, a templates/ folder, scripts — or "none"]

Please:
1. Ask any clarifying questions needed to keep the Skill focused (one Skill = one capability)
2. Create the directory structure at the correct path
3. Write SKILL.md with proper YAML frontmatter (name, description, optional allowed-tools)
4. Include step-by-step instructions written for Claude, not humans
5. Include at least two concrete examples showing real inputs and expected outputs
6. Add a validation checklist at the end
7. Create any supporting reference files if needed
8. Tell me how to test that the Skill is being triggered correctly
```

---

## Key Details

- **Personal Skills** live at `~/.claude/skills/<skill-name>/SKILL.md`
- **Project Skills** live at `.claude/skills/<skill-name>/SKILL.md`
- The `name` field must match the directory name (lowercase, hyphens, max 64 chars)
- The `description` is what Claude reads to decide whether to use the Skill — make it rich with trigger words
- Restart Claude Code after creating a Skill to load it

## Frontmatter Template

```yaml
---
name: my-skill-name
description: >
  What this Skill does and when to use it. Include trigger phrases users
  would say, file types involved, and concrete operations. Max 1024 chars.
allowed-tools: Read, Write, Bash   # optional — omit to allow all tools
---
```
