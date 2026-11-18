---
title: "🔐 Claude Code Settings and Permissions Guide"
tags: ["claude-code", "settings", "permissions", "security", "configuration"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-18
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-18 - Checked against code.claude.com/docs/en/settings and code.claude.com/docs/en/permissions -->

# Claude Code Settings and Permissions Guide

Settings are JSON keys that change how Claude Code behaves. Permission rules are the part of
settings that decide what it may run without asking. This guide covers which file to edit, which
value wins, and how to write the rules.

## Settings files

| Scope | File | Affects |
|:---|:---|:---|
| User | `~/.claude/settings.json` | You, every project |
| Shared project | `.claude/settings.json` | Everyone in the folder; commit it |
| Project local | `.claude/settings.local.json` | You, this project only |
| Managed | `managed-settings.json` and other managed sources | Everyone the organization deploys it to |

Files are strict JSON: a comment or trailing comma is a syntax error. On Windows `~/.claude` is
`%USERPROFILE%\.claude`; `CLAUDE_CONFIG_DIR` moves it. Claude Code reloads edits to settings files
while a session runs. Run `/status` to see which files loaded and `claude doctor` for rejected entries.
Set `"$schema": "https://json.schemastore.org/claude-code-settings.json"` for editor validation.

## Precedence

Highest first: managed, command line (`--settings <file-or-json>`), project local, shared project,
user. List keys such as `permissions.allow` merge across files instead of overriding. For one
session only:

```bash
claude --settings '{"model": "claude-opus-5-5"}'
```

`permissions.defaultMode` values `auto` and `bypassPermissions` do not take effect from project or
local settings; set them in user or managed settings, or pass `--permission-mode` for one session.
`permissions.allow` rules in the committed project file wait until each teammate trusts the folder;
`deny` and `ask` rules apply right away.

## A starter permissions block

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

## How rules are evaluated

Allow rules skip the prompt, ask rules prompt, deny rules block. Order is deny, then ask, then
allow, and the first match wins; specificity does not change it. A broad `Bash(aws *)` deny beats a
narrower `Bash(aws s3 ls)` allow. A bare `Bash` deny removes the tool from Claude's context;
a scoped one like `Bash(rm *)` blocks matching calls only. Manage rules with `/permissions`.
Rules are enforced by Claude Code, not the model: prompts and `CLAUDE.md` do not change them.

## Rule syntax

| Rule | Matches |
|:---|:---|
| `Bash` or `Bash(*)` | All Bash commands |
| `Bash(npm run build)` | That exact command |
| `Bash(npm run *)` | `npm run build`, `npm run test --watch`, bare `npm run` |
| `Bash(ls *)` vs `Bash(ls*)` | The first needs a space after `ls` (no `lsof`); the second matches `lsof` too |
| `Read(./.env)` | The `.env` file in the current directory |
| `WebFetch(domain:example.com)` | That domain only |
| `WebFetch(domain:*.example.com)` | Any subdomain, not `example.com` itself |
| `mcp__puppeteer__*` | Every tool from the `puppeteer` server |
| `mcp__puppeteer__puppeteer_navigate` | One MCP tool |

Bash rules understand `&&`, `||`, `;`, `|` and newlines: `Bash(safe-cmd *)` does not approve
`safe-cmd && other-cmd`. Wrappers such as `timeout`, `time`, `nice`, `nohup` and `stdbuf` are stripped
before matching. A Bash deny does not catch the same program by another path or inside `sh -c`
(`Bash(curl *)` misses `/usr/bin/curl`); to restrict network tools, deny `curl` and `wget` and allow
`WebFetch(domain:...)` instead.

## Read and Edit path patterns

They follow gitignore syntax with four anchors:

| Pattern | Meaning | Example |
|:---|:---|:---|
| `//path` | Absolute path from filesystem root | `Read(//Users/alice/secrets/**)` |
| `~/path` | From home directory | `Read(~/Documents/*.pdf)` |
| `/path` | Relative to the settings source (project root in project settings) | `Edit(/src/**/*.ts)` |
| `path` or `./path` | Relative to current directory | `Read(*.env)` |

A single leading slash is not an absolute path; use `//`. `Edit` rules cover all built-in editing
tools. `Read` deny rules are applied best-effort to Grep and Glob too. `Grep(...)`, `Glob(...)` and
`Write(...)` path rules do not match; use `Read(...)` and `Edit(...)`.

## Permission modes

Set the default with `permissions.defaultMode`.

| Mode | Behavior |
|:---|:---|
| `default` | Prompts on first use of each tool (shown as Manual; `manual` is accepted as an alias) |
| `acceptEdits` | Auto-accepts file edits and common filesystem commands (`mkdir`, `touch`, `mv`, `cp`) in the working directory or `additionalDirectories` |
| `plan` | Explores with read-only commands, does not edit source files |
| `auto` | No routine prompts; a background classifier checks shell commands and network requests |
| `dontAsk` | Auto-denies anything that would prompt; pre-approved tools still run |
| `bypassPermissions` | Skips prompts, even for protected paths such as `.git` and `.claude`; use only in containers or VMs |

To forbid the last two, set `permissions.disableBypassPermissionsMode` or `permissions.disableAutoMode`
to `"disable"` (most useful in managed settings). Set `permissions.denyInsteadOfPrompting` to `true`
in user or managed settings so an unattended session denies instead of waiting.

## Working directories

Claude can reach the directory you launched it in. Extend that with `--add-dir <path>` at startup,
`/add-dir` in a session, or `additionalDirectories` in a settings file. Additional directories
follow the same rules as the original.

## Sources

- https://code.claude.com/docs/en/settings
- https://code.claude.com/docs/en/permissions
