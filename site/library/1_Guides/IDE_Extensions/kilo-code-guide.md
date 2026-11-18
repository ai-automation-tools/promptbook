---
title: "⚖️ Kilo Code Guide"
tags: ["agent-guides", "kilo-code", "vscode", "jetbrains", "cli"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
checked: 2026-11-18
repo: Kilo-Org/kilocode
---

<!-- Last Updated: 2026-11-18 - Checked against the repo README at 956f3146050c -->

# Kilo Code Guide

## Overview
Kilo Code is an open source (MIT) coding agent that runs in VS Code, JetBrains and the CLI. You
pick from 500+ models, can switch mid-task, and pay the model provider's rate with no markup.
The README notes the CLI is a fork of OpenCode adapted to Kilo's platform, and that `main` is not
taking new features (pull requests go to the `v2` branch).

## Install
| Where | How |
|---|---|
| VS Code | Install the Kilo Code extension from the VS Code Marketplace (`kilocode.Kilo-Code`) |
| JetBrains | Install the Kilo Code plugin from the JetBrains Marketplace, or search "Kilo Code" in Settings → Plugins |
| CLI | `npm install -g @kilocode/cli` (also `pnpm`, `bun`, `curl -fsSL https://kilo.ai/cli/install \| bash`, `brew install Kilo-Org/tap/kilo`, AUR `kilo-bin`, or binaries from GitHub Releases) |
| Web | Cloud Agent at app.kilo.ai/cloud, no local machine needed |

Run `kilo` in a project directory to start the CLI.

## Agents
Switch between built-in agents by task; custom agents are supported.

- **Code**: the default; implements and edits code from natural language.
- **Plan**: designs architecture and writes implementation plans before any code.
- **Ask**: answers questions about the codebase without touching files.
- **Debug**: troubleshoots and traces issues.

## Features
- Multi-file code generation from natural language, and inline ghost-text autocomplete.
- Self-checking: the agent reviews and corrects its own work.
- Terminal and browser control.
- Kilo Marketplace for agents, skills, MCP servers and plugins.
- Automated AI code reviews on pull requests (app.kilo.ai/code-reviews).

## Autonomous mode for CI/CD
```bash
kilo run --auto "run tests and fix any failures"
```

`--auto` auto-approves permission prompts unless a rule explicitly denies the action. Use it only
in trusted environments, such as a disposable CI runner.

## Sources
- https://github.com/Kilo-Org/kilocode (README)
- https://kilo.ai/docs (configuration, linked from the README)
