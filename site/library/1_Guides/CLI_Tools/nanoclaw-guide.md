---
title: "🐚 NanoClaw Guide: Container-Isolated Personal Assistant"
tags: ["agent-guides", "nanoclaw", "containers", "docker", "messaging", "scheduled-tasks"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-25
repo: nanocoai/nanoclaw
---

<!-- Last Updated: 2026-11-25 - Checked against the NanoClaw README (commit 9774cb5) -->

# NanoClaw Guide

NanoClaw is a self-hosted, MIT-licensed assistant that runs each agent in its own Linux
container and connects it to messaging apps. Its author built it as a smaller, OS-isolated
alternative to OpenClaw: one host process, no microservices, a codebase small
enough to read. You customise it by changing code with a coding agent, not by editing config.

## Install

```bash
git clone https://github.com/nanocoai/nanoclaw.git
cd nanoclaw
bash nanoclaw.sh
```

`nanoclaw.sh` takes a fresh machine to a named agent you can message. It installs or updates Node
and pnpm and installs Docker if missing, sets up a credential gateway, fetches or builds the agent
image, and pairs your first channel (Slack, Mattermost, Teams, Telegram, Discord, WhatsApp, Dial,
Signal, iMessage or the terminal). If a step fails, setup can hand it to Claude Code, Codex or
OpenCode to diagnose, then retry. Not sure the machine is ready? The README gives a read-only
prompt to paste into your coding agent; full requirements are at
[docs.nanoclaw.dev/installation](https://docs.nanoclaw.dev/installation) (macOS, Linux, WSL2).

## Model runtime

Each agent runs Claude through the Claude Agent SDK by default. Setup also offers Codex, Cursor
and OpenCode; later, `/add-codex`, `/add-opencode` (OpenRouter, Google, DeepSeek, local
OpenAI-compatible servers) and `/add-cursor`. The provider is set per agent group.

## Skills over features

Trunk ships the registry, infrastructure and a terminal channel only. Channels and providers are
installed into your own fork with skills your coding agent runs:

- `/add-telegram` and the other `/add-<channel>` skills (WhatsApp, Discord, Slack, Teams, Signal,
  iMessage, Matrix, GitHub, email via Resend and more)
- `/manage-channels`: pick, per channel, a separate agent, one shared agent, or a single shared
  session (see `docs/isolation-model.md`)
- `/customize`: guided changes ("Rename the assistant to Bob")
- `/add-dashboard`: an optional dashboard

## What you get

- **Isolation:** agents see only what you mount; Bash runs inside the container, not on the host.
- **Credentials:** agents never hold raw API keys. Requests route through a credential gateway
  (OneCLI's Agent Vault by default, Iron Proxy as an option) that injects them.
- **Per-agent workspace:** its own instructions file (`CLAUDE.md`, or `AGENTS.md` for Codex and
  Cursor), memory, containers and mounts.
- **Scheduled tasks:** one-off or recurring, with optional script gates so the agent is not woken
  when there is no work. In chat: "every Monday at 8am, compile AI news and message me",
  "list my scheduled tasks", "pause the Monday briefing task".
- **Templates:** `ncl groups create --template <ref>` stamps a ready agent (instructions, MCP
  tools, skills, no secrets) from the local `templates/` folder or the public
  [nanoclaw-templates](https://github.com/nanocoai/nanoclaw-templates) library.

## Accounts and data

It works without an account. Without one, it sends only setup and uninstall diagnostics to
PostHog under a random per-install id; `NANOCLAW_NO_DIAGNOSTICS=1` turns that off. Setup's
default path offers a free account for a prebuilt agent image and a managed Slack app; answer no
to build the image locally. The README says messages, files and API keys are never sent to the
project, though they do go to your model provider and your chat apps.

## Migrating from v1

From a separate checkout of v2: `NANOCLAW_V1_PATH=~/nanoclaw bash migrate-v2.sh`. Run it
directly, not inside a coding-agent session. It reads v1 and asks before switching services.

## Sources

- [nanocoai/nanoclaw README](https://github.com/nanocoai/nanoclaw)
- [NanoClaw docs](https://docs.nanoclaw.dev)
