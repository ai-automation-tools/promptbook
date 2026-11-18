---
title: "🧠 Claude Code Skills Guide"
tags: ["claude-code", "skills", "skill-md", "frontmatter", "authoring"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-18
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-18 - Checked against code.claude.com/docs/en/skills -->

# Claude Code Skills Guide

A skill is a folder with a `SKILL.md` file. Claude Code keeps each skill's description in
context, loads the full text only when the skill is used, and lets you run it as `/skill-name`.
This guide covers where skills live, what goes in `SKILL.md`, and how they are invoked.

## Where a skill lives

| Scope | Path | Applies to |
|:---|:---|:---|
| Enterprise | `.claude/skills/<skill-name>/SKILL.md` in the managed settings directory | Everyone the organization deploys it to |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | All your projects on this machine |
| Project | `.claude/skills/<skill-name>/SKILL.md` | This repository; commit it to share |
| Nested | `<subdir>/.claude/skills/<skill-name>/SKILL.md` | Sessions in or below `<subdir>`, loaded on demand |
| Additional directory | `.claude/skills/...` in a directory passed with `--add-dir` | That session |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | Where the plugin is enabled, as `/plugin-name:skill-name` |

Same-name precedence: enterprise over personal over project. Plugin skills never conflict
because they are namespaced. Symlinked skill folders are followed. The names `synced` and
`anthropic-skills` are reserved.

## Minimal SKILL.md

The YAML frontmatter must start on the first line of the file.

```markdown
---
name: my-skill
description: What this skill does and when to use it
disable-model-invocation: true
allowed-tools: Read Grep
---

Instructions for Claude go here.
```

If the YAML fails to parse the skill still loads, with no fields set. Unrecognized fields are
ignored silently. All fields are optional; `description` is recommended.

## Frontmatter fields

| Field | Effect |
|:---|:---|
| `name` | Command name in the `/` menu. Defaults to the directory name |
| `description` | What it does and when to use it; Claude matches requests against it. Falls back to the first content line |
| `when_to_use` | Extra trigger phrases, appended to `description` (the two together are truncated at 1,536 characters in the listing) |
| `argument-hint` | Autocomplete hint, such as `[issue-number]` |
| `arguments` | Named positional arguments for `$name` substitution (space-separated string or YAML list) |
| `disable-model-invocation` | `true` stops Claude loading it automatically. Default `false` |
| `user-invocable` | `false` hides it from the `/` menu so only Claude can invoke it. Default `true` |
| `allowed-tools` | Tools usable without a permission prompt for the invoking turn |
| `disallowed-tools` | Tools removed from the pool while the skill is active |
| `model` | Model override for the rest of the turn; `inherit` keeps the active model |
| `effort` | `low`, `medium`, `high`, `xhigh` or `max` for the turn |
| `context` | `fork` runs the skill in a forked subagent |
| `agent` | Subagent type when `context: fork` (for example `Explore`, `Plan`, `general-purpose`) |
| `background` | With `context: fork`, `false` waits for the result in the invoking turn. Default `true` |
| `hooks` | Hooks registered when the skill is invoked, kept for the session |
| `paths` | Glob patterns limiting automatic activation to matching files |
| `shell` | Shell for inline command blocks: `bash` (default) or `powershell` |
| `metadata`, `license`, `compatibility` | Accepted; Claude Code does not act on them |

Outside Claude Code (claude.ai uploads, the Skills API) only `name`, `description`,
`license`, `compatibility`, `metadata` and `allowed-tools` are allowed; other keys are a hard error.

## Supporting files

```text
my-skill/
├── SKILL.md        (required: overview and navigation)
├── reference.md    (detailed docs, loaded when needed)
├── examples.md     (usage examples, loaded when needed)
└── scripts/
    └── helper.py   (utility script, executed rather than loaded)
```

Reference each supporting file from `SKILL.md` so Claude knows when to load it, and keep
`SKILL.md` under 500 lines.

## Who invokes it

| Frontmatter | You invoke | Claude invokes | Description in context |
|:---|:---|:---|:---|
| (default) | Yes | Yes | Yes |
| `disable-model-invocation: true` | Yes | No | No |
| `user-invocable: false` | No | Yes | Yes |

Type `/skill-name` at the start of a message to run it. Skills can be stacked: `/write-tests /fix-issue 123`
loads both, and `123` goes to each as `$ARGUMENTS`. Auto-compaction re-attaches the first 5,000
tokens of each invoked skill within a 25,000-token shared budget.

## String substitutions

| Variable | Expands to |
|:---|:---|
| `$ARGUMENTS` | All arguments as typed (appended as `ARGUMENTS: <value>` if no placeholder uses them) |
| `$ARGUMENTS[N]` / `$N` | Argument at 0-based index N |
| `$name` | Named argument from the `arguments` list |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_EFFORT}` | Current effort level |
| `${CLAUDE_SKILL_DIR}` | Directory containing `SKILL.md` |
| `${CLAUDE_PROJECT_DIR}` | Project root |
| `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}` | Plugin install and data directories (plugin skills only) |

Indexed arguments use shell-style quoting, and `\$1.00` escapes a literal dollar sign.

## Inject live context

A command runs before the skill reaches Claude and its output replaces the placeholder. Inline
form is an exclamation mark followed by the command in backticks (it must start a line or follow
whitespace); the multi-line form is a fenced block opened with three backticks and `!`.

````markdown
## Current changes

!`git diff HEAD`

## Environment
```!
node --version
git status --short
```
````

A non-zero exit aborts the invocation (exit 1 from search and comparison commands is the
exception; append `|| true` to tolerate failures). These commands are checked against your
permission rules and never prompt. Set `"disableSkillShellExecution": true` in settings to
replace them with `[shell command execution disabled by policy]`.

## Sources

- https://code.claude.com/docs/en/skills
