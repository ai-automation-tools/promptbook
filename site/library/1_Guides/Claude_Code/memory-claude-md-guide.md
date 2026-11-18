---
title: "🧠 Claude Code Memory and CLAUDE.md Guide"
tags: ["claude-code", "memory", "claude-md", "rules", "context"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-18
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-18 - Checked against code.claude.com/docs/en/memory -->

# Claude Code Memory and CLAUDE.md Guide

Each Claude Code session starts with a fresh context window. Two things carry knowledge across
sessions: **CLAUDE.md files** you write, and **auto memory** Claude writes itself. Both load
as context, not enforced configuration; to block an action regardless, use a hook or a
permission rule.

| | CLAUDE.md | Auto memory |
|:---|:---|:---|
| Written by | You | Claude |
| Holds | Instructions and rules | Learnings and corrections |
| Scope | Project, user or org | Per repository, shared across worktrees |
| Loaded | Every session | Every session (first 200 lines or 25KB of `MEMORY.md`) |

## Where CLAUDE.md lives

Listed in load order, broadest first, so project text lands after user text.

| Scope | Location | Shared with |
|:---|:---|:---|
| Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux and WSL `/etc/claude-code/CLAUDE.md`; Windows `C:\Program Files\ClaudeCode\CLAUDE.md` | Whole organization |
| User | `~/.claude/CLAUDE.md` | Only you, all projects |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team, via git |
| Local | `./CLAUDE.local.md` (gitignore it) | Only you, this project |

Claude loads `CLAUDE.md` and `CLAUDE.local.md` from the working directory and every directory
above it, concatenated root-first (nothing overrides anything). Files in subdirectories load
on demand, when Claude reads or edits a file there. Block-level HTML comments are stripped
before injection, so they cost no context.

Run `/init` to generate a starting file from your codebase; if one exists it suggests
improvements instead. Setting `CLAUDE_CODE_NEW_INIT=1` gives an interactive flow that also
offers skills and hooks. Run `/context all` to confirm which memory files loaded.

## Write it well

- Target under 200 lines per file; longer files cost context and lower adherence.
- Be concrete: "Use 2-space indentation", "Run `npm test` before committing".
- Group under headers and bullets; remove contradictions (Claude may pick either).
- Put multi-step procedures in a skill, and part-of-the-codebase rules in `.claude/rules/`.
- `/doctor prompt-audit` finds outdated or conflicting instruction files (v2.1.283 or later).

## Imports with `@`

```text
See @README for project overview and @package.json for npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
- Personal: @~/.claude/my-project-instructions.md
```

Relative and absolute paths work; relative paths resolve from the importing file. Imports nest
up to four hops deep. Escape spaces with a backslash (`@Design\ Docs/api.md`); quoted paths
are not imported. Code spans and fenced blocks are skipped, so write `` `@README` `` to mention
without importing. Imports load with their parent, so they organize a file but do not shrink
its context cost. A path resolving outside the working directory triggers a one-time approval
dialog in a project; your own `~/.claude/` files are trusted.

## `.claude/rules/`

Put one-topic markdown files in `.claude/rules/` (searched recursively). Files without
`paths` frontmatter load at launch like `.claude/CLAUDE.md`. With `paths`, they load only when
Claude touches a matching file:

```markdown
---
paths:
  - "src/api/**/*.{ts,tsx}"
---

# API Development Rules
- All API endpoints must include input validation
```

`paths` is the only frontmatter field read. Patterns are relative to the folder holding
`.claude`. `~/.claude/rules/` holds personal rules for every project and loads before project
rules. The directory accepts symlinks for sharing, but a link target outside the working
directory needs the external-import approval.

## AGENTS.md

By default Claude reads `AGENTS.md` only when no `CLAUDE.md` or `CLAUDE.local.md` exists in or
above the working directory (v2.1.277 or later). To load both, set **Project instructions** in
`/config` to `claude-md-and-agents-md`; other values are `claude-md-or-agents-md` (default),
`claude-md` and `managed-only`. Or import it from CLAUDE.md with `@AGENTS.md`.

## Auto memory and `/memory`

Notes live in `~/.claude/projects/<project>/memory/`, with a `MEMORY.md` index loaded each
session. Toggle with `/memory` (saves `autoMemoryEnabled`), or set it per project; relocate
with `autoMemoryDirectory`. `/memory` also lists every CLAUDE.md, CLAUDE.local.md and rules
location and opens any in your editor. Say "remember to always use pnpm" and Claude saves it
to auto memory; say "add this to CLAUDE.md" to write it there instead.

## Teams and monorepos

- `claudeMdExcludes` (a glob array in settings, arrays merge across layers) skips other
  teams' CLAUDE.md files; a managed CLAUDE.md cannot be excluded.
- `claudeMd` in managed settings holds managed instructions inline.
- `--add-dir` does not load that folder's CLAUDE.md unless
  `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` is set.
- A CLAUDE.md file over 4 MiB is skipped entirely.

**Sources**
- https://code.claude.com/docs/en/memory
