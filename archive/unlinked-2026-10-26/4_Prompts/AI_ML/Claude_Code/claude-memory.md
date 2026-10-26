---
title: "Prompt: Bootstrap and Manage CLAUDE.md Memory"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Bootstrap and Manage CLAUDE.md Memory

**Use when:** You want Claude Code to maintain persistent context, conventions, and project knowledge across sessions using CLAUDE.md files.

---

## Prompt — Bootstrap a New Project's CLAUDE.md

```
Read this codebase and create a comprehensive CLAUDE.md at the project root.

Before writing, explore:
1. Top-level directory structure (ls -la, tree if available)
2. package.json / pyproject.toml / Cargo.toml / go.mod (detect language + deps)
3. Existing README and any docs/ folder
4. Main entry points and key modules
5. Any existing .claude/ or .github/ config

The CLAUDE.md should include these sections:

## Project Overview
[2-3 sentences: what this project does, who uses it]

## Architecture
[Key modules, data flow, important design decisions]

## Essential Commands
[Build, test, lint, format, start dev server — exact commands]

## Conventions
[Naming patterns, file organization, coding style, commit format]

## Key Files & Dirs
[What lives where and why — focus on non-obvious structure]

## Active Work
[Current branch, in-progress features, known broken things]

## Agents & Skills
[Any custom agents or Skills in use for this project]

## Gotchas
[Things that will waste time if you don't know them — secrets, fragile code, deployment quirks]

Be terse and specific. Prefer bullet points. No generic advice — only project-specific facts.
```

---

## Prompt — Update CLAUDE.md After a Session

```
We just completed the following work:

**What was done:** [Brief description of the session's accomplishments]
**Decisions made:** [Any architectural, API, or design decisions that were finalized]
**New patterns established:** [Any new conventions or patterns introduced]
**Gotchas discovered:** [Anything that surprised us or cost time]
**Files significantly changed:** [Key files modified]

Please update CLAUDE.md to reflect this session:
1. Read the current CLAUDE.md first
2. Add/update only what changed — do not duplicate existing content
3. Update "Active Work" to reflect current state
4. Move completed items out of "Active Work"
5. Add any new gotchas discovered
6. Do not reformat or restructure sections that didn't change

Show me the diff of what you changed before writing.
```

---

## Prompt — Load Project Context Before Starting Work

```
Before touching any code, fully orient yourself:

1. Read CLAUDE.md at the project root
2. Read README.md (or README.rst)
3. Run: ls -la && cat package.json (or equivalent for this language)
4. Read the main entry point file
5. Check git status and recent log: git log --oneline -10

Then:
- Summarize your understanding of the project in exactly 5 bullet points
- List anything that seems unclear or contradictory
- State what you believe the current "Active Work" is
- Ask me to confirm your understanding is correct before touching anything

Do not write a single line of code until I confirm.
```

---

## Prompt — Create a Per-Agent Memory File

```
Create a persistent memory file for the following agent:

**Agent name:** [e.g. SecurityReviewer]
**File location:** [e.g. .claude/agents/security-reviewer-memory.md]

The file should track:
- Vulnerabilities found and their status (open/resolved)
- Patterns this agent has learned about this codebase
- Previous audit results with dates
- Standing instructions specific to this project
- Things to always check vs. things already verified

Create the initial template, then write the agent's instructions so it:
1. READs this file at the start of every session
2. Completes its task
3. APPENDs a dated entry with what it found/did
4. Never overwrites previous entries — only appends

File template should use this structure:
# [Agent Name] Memory

## Standing Instructions
[project-specific rules]

## Audit Log
### [DATE]
- [entry]
```

---

## CLAUDE.md Hierarchy

Claude Code reads CLAUDE.md files from multiple locations, in order:
1. `~/.claude/CLAUDE.md` — global preferences (applies to all projects)
2. `[project root]/CLAUDE.md` — project-level context
3. `[subdirectory]/CLAUDE.md` — directory-specific overrides

**Global CLAUDE.md prompt:**
```
Create a global CLAUDE.md at ~/.claude/CLAUDE.md with my personal preferences:

- My name and role: [Name, e.g. "Michael — Co-Founder, security/IAM focus"]
- Preferred code style: [e.g. TypeScript with strict mode, Python with type hints]
- Communication style: [e.g. terse, no preamble, show commands not explanations]
- Always do / never do: [your global rules]
- Common tools I use: [e.g. n8n, Cloudflare Workers, MCP]
- My environment: [e.g. Windows + WSL2, Node 20, Python 3.11]
```
