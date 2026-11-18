---
title: "🟦 OpenCode Guide"
tags: ["opencode", "coding-agent", "cli", "tui", "providers", "agents-md", "mcp"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: anomalyco/opencode
---

<!-- Last Updated: 2026-11-18 - Checked against the opencode.ai docs (v2 pages) -->

# OpenCode Guide

OpenCode is an open-source (MIT) terminal coding agent that works with many model providers. This
guide takes you from install to a configured project: provider, rules file, config, agents and
custom commands.

Note: the opencode.ai docs fetched for this guide describe the v2 CLI (the repo's newest release
is v2.3.2 while GitHub still badges v1.19.6 as "Latest"). Key names such as `providers`, `agents`,
`commands` and `permissions` are the plural forms shown there; if you run a v1 install, check
its own docs.

## Install

| Method | Command |
|:---|:---|
| Script | `curl -fsSL https://opencode.ai/v2/install \| bash` |
| Homebrew | `brew install anomalyco/tap/opencode-v2` |
| npm | `npm install -g @opencode/cli` |
| Bun | `bun install -g --trust @opencode/cli` |
| pnpm | `pnpm add -g --allow-build=@opencode/cli @opencode/cli` |
| Yarn | `yarn global add @opencode/cli` |
| mise | `mise use -g opencode` (mise 2026.10.9 or later) |

## First run

```bash
opencode                  # full-screen TUI in the current project
opencode <directory>      # TUI in another project
opencode run "<prompt>"   # one prompt, no interactive UI
opencode mini             # minimal interactive interface
```

Other documented switches: `--standalone` (private server instead of the shared background
service), `--server <url>`, `opencode service start`, `opencode debug paths [selector]`, and
`opencode uninstall [--dry-run] [-f]`.

## Connect a provider

Inside the TUI run `/connect`, choose a provider and enter its credentials, then `/models` to
pick a model. ChatGPT sign-in and GitHub Copilot device login are offered as provider options.
Credentials can also come from environment variables.

Set the default model in config as `provider/model`. A provider missing from the catalog can be added:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "providers": {
    "acme": {
      "name": "Acme",
      "env": ["ACME_API_KEY"],
      "package": "@opencode/ai/providers/openai-compatible",
      "settings": { "baseURL": "https://llm.acme.example/v1" },
      "models": { "qwen3-coder": { "name": "Qwen 3 Coder" } }
    }
  }
}
```

Then reference it as `acme/qwen3-coder`.

## Project rules: AGENTS.md

OpenCode combines the global `~/.config/opencode/AGENTS.md` with every `AGENTS.md` from the
workspace up to the project root. It does not resolve conflicts, so keep broad rules in the root
file and narrow ones near the code. A directory with no `AGENTS.md` falls back to `CLAUDE.md`
(globally `~/.claude/CLAUDE.md`); where both exist `AGENTS.md` wins. The docs page on rules does
not mention `/init`, so this guide does not either.

Extra instruction sources go in config, loaded after `AGENTS.md`:

```jsonc
{ "instructions": ["CONTRIBUTING.md", "docs/guidelines/*.md", "https://example.com/instructions.md"] }
```

Set `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1` to skip `CLAUDE.md` files.

## Config: opencode.json

JSON or JSONC, named `opencode.json` or `opencode.jsonc`.

| Scope | Location |
|:---|:---|
| Global | `~/.config/opencode/opencode.json(c)` |
| Project | `<project>/opencode.json(c)` or `<project>/.opencode/opencode.json(c)` |
| System (managed) | `/etc/opencode` (Linux), `/Library/Application Support/opencode` (macOS), `%ProgramData%\opencode` (Windows) |

Non-conflicting settings merge; managed settings have the highest precedence. Values can use
`{env:VARIABLE_NAME}` and `{file:path/to/file}`.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-5-5",
  "default_agent": "build",
  "permissions": [{ "action": "shell", "resource": "git push *", "effect": "ask" }],
  "mcp": {
    "servers": {
      "playwright": { "type": "local", "command": ["bunx", "@playwright/mcp"] }
    }
  }
}
```

## Agents

| Agent | Mode | Purpose |
|:---|:---|:---|
| `build` | primary | Default coding agent |
| `plan` | primary | Explores and plans without editing normal project files |
| `general` | subagent | Research and multi-step work |
| `explore` | subagent | Searches and reads code or web sources, no edits |

Modes are `primary`, `subagent` or `all`. Define your own as Markdown in
`~/.config/opencode/agents/<name>.md` or `.opencode/agents/<name>.md`; frontmatter is config, the
body is the system prompt:

```md
---
description: Explains code without changing it
mode: subagent
---

Explain the relevant code with short examples. Do not edit files.
```

Other options: `model` (`provider/model` with optional `#variant`), `permissions` (ordered rules,
last match wins, effects `allow`/`ask`/`deny`), `steps`, `hidden`, `color`, `disabled`.

## Custom commands

Put Markdown files in `~/.config/opencode/commands/` or `.opencode/commands/`;
`team/review.md` runs as `/team/review`. Or define them under `commands` in config (each needs `template`).

```md
---
description: Review code for correctness
agent: plan
model: anthropic/claude-sonnet-5-5#high
---

Review $ARGUMENTS. Report bugs first.
```

Placeholders: `$ARGUMENTS`, `$1`, `$2`. A line like `` !`git log --oneline -$1` `` inserts shell
output; it runs outside the agent's permission flow, so only use trusted commands.

**Sources**

- [OpenCode intro and install](https://opencode.ai/docs/)
- [Providers](https://opencode.ai/docs/providers)
- [Config](https://opencode.ai/docs/config)
- [Rules](https://opencode.ai/docs/rules)
- [Agents](https://opencode.ai/docs/agents)
- [Commands](https://opencode.ai/docs/commands)
- [CLI](https://opencode.ai/docs/cli)
- [anomalyco/opencode releases](https://github.com/anomalyco/opencode/releases)
