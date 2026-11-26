---
title: "🦞 OpenClaw Guide: Personal AI Assistant Gateway"
tags: ["agent-guides", "openclaw", "gateway", "messaging", "skills", "plugins"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-25
repo: openclaw/openclaw
---

<!-- Last Updated: 2026-11-25 - Checked against the OpenClaw README (commit 367422e) -->

# OpenClaw Guide

OpenClaw is an open-source (MIT) AI assistant that runs on your own machine and answers in the
chat apps you already use: Discord, iMessage, Slack, Teams, Telegram, WhatsApp and 20+ more, plus
native apps for macOS, iOS, Android, Windows and Linux. One Gateway runs it, either as a personal
assistant on a laptop or as a shared one for a team; configuration is the only difference.
It is developed by the OpenClaw Foundation.

## Install

```bash
# macOS / Linux / WSL2
curl -fsSL https://openclaw.ai/install.sh | bash
```

```powershell
# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

The installer provisions Node.js when needed and starts onboarding. If you already manage Node
(24.16.0+ on 24.x, or 26.1.0+; the README strongly recommends 24.22.1+ or 26.12.1+):

```bash
npm install -g openclaw@latest --allow-scripts=openclaw
```

`--allow-scripts=openclaw` is for npm 12 or npm 11.16+; on npm 11.15 and earlier leave it out.
Docker, Nix and other paths are in the [installation guide](https://docs.openclaw.ai/install).

## Quick start

If you installed the package yourself:

```bash
openclaw onboard --install-daemon
```

Onboarding verifies model access, creates the workspace and configures the Gateway. Then:

```bash
openclaw gateway status
openclaw dashboard      # opens the Control UI; send a message to confirm it works
```

## How it fits together

- **Gateway:** the local control plane for sessions, tools, events and channel connections.
- **Control UI, CLI and TUI:** clients that connect to the Gateway.
- **Channels:** WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage and others.
- **Companion apps and nodes:** voice, Canvas, camera, screen and device-local actions.
- **Models:** hosted and local providers; models and agent harnesses (Claude, Codex, local) are
  swappable plugins.
- **Extending:** tools, skills, plugins and [ClawHub](https://clawhub.ai). New capabilities
  usually belong in plugins built on the plugin SDK.

## Security: read before connecting anyone

- Treat inbound messages as untrusted input.
- DM-capable channels pair unknown senders by default. Approve one with
  `openclaw pairing approve <channel> <code>`.
- **Tools run on the host for the main session unless you configure sandboxing.** Read the
  [security guide](https://docs.openclaw.ai/gateway/security), the
  [exposure runbook](https://docs.openclaw.ai/gateway/security/exposure-runbook) and the
  [sandboxing guide](https://docs.openclaw.ai/gateway/sandboxing) before adding other users or
  exposing the Gateway remotely. For OS-level isolation per agent, see the
  NanoClaw guide; to switch agents, see the
  Hermes Agent guide, which imports from `~/.openclaw`.

## Working from source

The repo is a pnpm workspace; plain `npm install` at the root is not supported.

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
pnpm ui:build
```

## Sources

- [openclaw/openclaw README](https://github.com/openclaw/openclaw)
- [OpenClaw docs](https://docs.openclaw.ai) · [Getting started](https://docs.openclaw.ai/start/getting-started) · [CLI reference](https://docs.openclaw.ai/cli)
