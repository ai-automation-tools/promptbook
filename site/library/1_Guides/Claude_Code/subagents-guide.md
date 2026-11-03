---
title: "🧩 Claude Code Subagents Guide"
tags: ["claude-code", "subagents", "agents", "delegation", "configuration"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-02
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-02 - Checked against code.claude.com/docs/en/sub-agents -->

# Claude Code Subagents Guide

A subagent is a specialized assistant that runs in its own context window with its own system
prompt, tool access and permissions. Claude delegates to one when a task matches its
`description`, and the subagent returns only its result, so noisy work (searches, test runs)
stays out of your main conversation.

## Built-in subagents

| Agent | Tools | Purpose |
|:---|:---|:---|
| Explore | Read-only (Write and Edit denied) | File discovery, code search, codebase exploration |
| Plan | Read-only (Write and Edit denied) | Codebase research during plan mode |
| General-purpose | Every tool available to subagents | Complex research, multi-step operations, code changes |
| claude | Every tool available to subagents | Catch-all for tasks that fit no specialized agent |
| statusline-setup | n/a | Runs when you use `/statusline` (Sonnet) |
| claude-code-guide | n/a | Answers questions about Claude Code features (Haiku) |

## Create one

Run `/agents`, or ask Claude to write the file, or create it yourself. A subagent is a Markdown
file: YAML frontmatter, then the system prompt as the body.

```markdown
---
name: code-improver
description: Scans files and suggests improvements for readability, performance, and best practices. Use after writing or modifying code.
tools: Read, Grep, Glob
model: sonnet
---

You are a code improvement specialist. For each issue you find, explain
the problem, show the current code, and provide an improved version.
```

### Where it lives

When two subagents share a name, the higher row wins.

| Location | Scope | Priority |
|:---|:---|:---|
| Managed settings | Organization | 1 (highest) |
| `--agents` CLI flag | Current session | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| Plugin `agents/` directory | Where the plugin is enabled | 5 (lowest) |

For a one-off session, pass JSON instead of a file. Each key is an agent name; a value takes
`prompt` (the system prompt), `description`, `tools`, `model` and the other fields below:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

## Frontmatter

Only `name` and `description` are required. Field names are camelCase and must match exactly:
an unrecognized field is ignored without an error.

| Field | What it does |
|:---|:---|
| `name` | Unique identifier, at most 256 characters, no `:` |
| `description` | When Claude should delegate to it. Words like "use proactively" encourage delegation |
| `tools` | Allowlist (comma-separated or YAML list). Omit it to inherit every tool subagents can use |
| `disallowedTools` | Denylist, removed from the inherited or listed tools |
| `model` | `sonnet`, `opus`, `haiku`, `fable`, a full ID such as `claude-opus-5-5`, or `inherit` |
| `permissionMode` | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`, or `manual` (alias for `default`) |
| `maxTurns` | Agentic turns before it stops; the output comes back marked partial and Claude can resume it |
| `skills` | Skills whose full content is injected at startup |
| `mcpServers` | A server name (e.g. `"slack"`) or an inline definition |
| `hooks` | Lifecycle hooks scoped to this subagent |
| `memory` | Persistent memory scope: `user`, `project` or `local` |
| `background` | `true` keeps it in the background even when Claude asks to wait |
| `isolation` | `worktree` runs it in a temporary git worktree |
| `color` | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink` or `cyan` |
| `effort` | `low`, `medium`, `high`, `xhigh` or `max` |
| `omitClaudeMd` | `true` starts it without the user, project and local `CLAUDE.md` files |

`permissionMode`, `mcpServers` and `hooks` are ignored for plugin subagents.

## Run one

- **Automatically:** Claude matches the task to each `description`.
- **By name:** "Use the test-runner subagent to fix failing tests".
- **@-mention:** `@"code-reviewer (agent)" look at the auth changes`.
- **As the whole session:** `claude --agent code-reviewer`, or `"agent": "code-reviewer"` in
  `.claude/settings.json`. The flag overrides the setting.

## Foreground and background

A foreground subagent blocks the main conversation and passes its permission prompts to you. A
background one runs alongside you; its prompts surface in the main session and name the
subagent, and Esc denies one tool call without stopping it. A subagent Claude spawns from the
main conversation starts in the background; Ctrl+B moves a running task there. Background
subagents get a smaller built-in tool set than foreground ones. In interactive sessions fork
mode is on by default; set `CLAUDE_CODE_FORK_SUBAGENT` to `0` to let Claude wait for results.

## Limits

| Setting | Default | Effect |
|:---|:---|:---|
| `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | 3 layers below the main conversation | `1` turns nesting off; at the limit the `Agent` tool is withheld |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | 20 | Subagents running at once |
| `CLAUDE_CODE_SUBAGENT_MODEL` | unset | Model for subagents that nothing else assigns one |

Set these under `env` in `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH": "1"
  }
}
```

To stop a subagent spawning others, leave `Agent` out of its `tools` or list it in
`disallowedTools`.

Source: [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents).
