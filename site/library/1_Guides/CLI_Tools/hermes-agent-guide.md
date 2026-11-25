---
title: "☤ Hermes Agent Guide: Self-Improving Agent with a Messaging Gateway"
tags: ["agent-guides", "hermes-agent", "nous-research", "cli", "skills", "messaging", "cron"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-25
repo: NousResearch/hermes-agent
---

<!-- Last Updated: 2026-11-25 - Checked against the Hermes Agent README (commit 3113542) -->

# Hermes Agent Guide

Hermes Agent is Nous Research's open-source (MIT) agent. You talk to it in a terminal UI or,
through one gateway process, from Telegram, Discord, Slack, WhatsApp, Signal or email. It keeps
memory across sessions, writes skills from experience, runs scheduled jobs and can delegate to
subagents. This guide covers install, setup, the daily commands, the gateway, cron and
migrating from OpenClaw, Claude Code, Codex or Cursor.

## Install

Linux, macOS and WSL2:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Native Windows (PowerShell, no WSL needed):

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Native Windows installs under `%LOCALAPPDATA%\hermes`; WSL2 and Linux use `~/.hermes`. Android
uses a signed APT repository for Termux, with its own guide. Reload your shell
(`source ~/.bashrc` or `source ~/.zshrc`), then run `hermes`.

**Antivirus flags `uv.exe`?** The README calls this a false positive: the file is Astral's `uv`,
bundled to manage Hermes' Python environment. Whitelist the folder
`%LOCALAPPDATA%\hermes\bin`, not the file hash, because the hash changes every version.

## First run

```bash
hermes setup        # full setup wizard
hermes model        # choose provider and model
hermes tools        # choose which tools are enabled
hermes doctor       # diagnose problems
hermes update       # update to the latest version
```

Any model works: Nous Portal, OpenRouter, OpenAI or your own endpoint, switched with
`hermes model` and no code change. To skip collecting separate keys for the model, web search,
image generation, TTS and a cloud browser, `hermes setup --portal` logs you in to Nous Portal by
OAuth and turns on its Tool Gateway; `hermes portal info` shows what is wired up. You can still
bring your own key per tool.

Config values: `hermes config set` and `hermes config get`.

## Chat commands

Most slash commands work in the terminal and in messaging chats.

| Action | CLI | Messaging |
|:---|:---|:---|
| New conversation | `/new` or `/reset` | `/new` or `/reset` |
| Change model | `/model [provider:model]` | same |
| Set a personality | `/personality [name]` | same |
| Retry or undo the last turn | `/retry`, `/undo` | same |
| Compress context, usage | `/compress`, `/usage`, `/insights [--days N]` | `/insights [days]` |
| Browse skills | `/skills` or `/<skill-name>` | `/<skill-name>` |
| Interrupt | `Ctrl+C` or send a new message | `/stop` or send a new message |
| Platform status | `/platforms` | `/status`, `/sethome` |

## Messaging gateway

```bash
hermes gateway setup
hermes gateway start
```

Then message the bot. One gateway process serves every platform you enable, with conversation
continuity across them. Run the agent on a $5 VPS or a serverless backend and talk to it from
your phone. The README lists six terminal backends: local, Docker, SSH, Modal, Daytona and Vercel
Sandbox. Read the [Security docs](https://hermes-agent.nousresearch.com/docs/user-guide/security)
(command approval, DM pairing, container isolation) before opening the bot to other people.

## What makes it different

- **Learning loop:** agent-curated memory, skills created after complex tasks and improved in
  use, FTS5 search over past sessions, and user modelling through Honcho.
- **Skills:** compatible with the [agentskills.io](https://agentskills.io) open standard.
- **Cron:** a built-in scheduler with delivery to any platform, written in natural language
  (daily reports, nightly backups, weekly audits).
- **Subagents:** isolated workers for parallel jobs; in Desktop you set their provider, model
  and limits under Settings → Model → Subagents.
- **MCP:** connect any MCP server; see the MCP docs page.

## Migrating from another agent

`hermes setup` offers to import from `~/.openclaw`, `~/.claude`, `~/.codex` or `~/.cursor`,
with a preview first. Any time after install:

```bash
hermes plugins install agent-importers          # once per profile
hermes import-agent openclaw --dry-run          # preview
hermes import-agent openclaw                    # interactive migration
hermes import-agent openclaw --migrate-secrets  # also bring allowlisted API keys
hermes import-agent claude-code                 # or codex / cursor
```

From OpenClaw it brings the persona (`SOUL.md`), memories, user-made skills (into
`~/.hermes/skills/openclaw-imports/`), the command allowlist, messaging settings and, only with
`--migrate-secrets`, allowlisted API keys. `hermes claw migrate` is the older spelling.

## Sources

- [NousResearch/hermes-agent README](https://github.com/NousResearch/hermes-agent)
- [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/)
- [CLI reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [OpenClaw migration guide](https://hermes-agent.nousresearch.com/docs/guides/migrate-from-openclaw)
