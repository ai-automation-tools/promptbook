---
title: "🤖 GitHub Copilot CLI Agent Guide"
tags: ["github", "copilot", "copilot-cli", "agent", "terminal", "mcp"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: github/copilot-cli
---

<!-- Last Updated: 2026-11-18 - Checked against github.com/github/copilot-cli README -->

# GitHub Copilot CLI Agent Guide

`github/copilot-cli` is the terminal coding agent (command `copilot`), built on the same harness as GitHub's Copilot coding agent. It is a standalone tool, not the older `gh` extension covered by the IDE_Extensions guide `github_copilot_cli_guide.md`.

## Requirements

- Linux, macOS or Windows (Windows needs PowerShell v6 or higher).
- An active Copilot subscription. If Copilot comes from an organization or enterprise, an admin must not have disabled the CLI.

## Install

| Method | Command |
|:---|:---|
| Script (macOS, Linux) | `curl -fsSL https://gh.io/copilot-install \| bash` |
| Homebrew | `brew install copilot-cli` |
| WinGet | `winget install GitHub.Copilot` |
| npm | `npm install -g @github/copilot` |

Prerelease builds: `brew install copilot-cli@prerelease`, `winget install GitHub.Copilot.Prerelease`, `npm install -g @github/copilot@prerelease`.

The install script takes environment variables: `PREFIX` (install to `$PREFIX/bin`; default `/usr/local` as root, `$HOME/.local` otherwise) and `VERSION` (pin a release).

```bash
curl -fsSL https://gh.io/copilot-install | VERSION="v0.0.369" PREFIX="$HOME/custom" bash
```

## First run and login

```bash
cd your-project
copilot
```

If you are not logged in, run `/login` and follow the prompts. `--banner` shows the splash screen again.

To authenticate with a token instead, create a fine-grained personal access token with the "Copilot Requests" permission and export it as `GH_TOKEN` or `GITHUB_TOKEN` (in that order of precedence).

## Day-to-day

| Item | Detail |
|:---|:---|
| Default model | Claude Sonnet 4.5 per the README; switch with `/model` |
| Approval | Every action is previewed and needs your approval |
| Cost | Each prompt you submit uses one premium request from your monthly quota |
| GitHub access | Repos, issues and pull requests via your GitHub login; GitHub's MCP server ships by default |
| Extra tools | Custom MCP servers are supported |
| Feedback | `/feedback` |

## Experimental mode

Start with `copilot --experimental`, or run `/experimental` inside the CLI. The setting persists in your config. The README lists Autopilot mode as an experimental feature: press `Shift+Tab` to cycle modes; it keeps the agent working until the task is done.

## Language servers (LSP)

Copilot CLI does not bundle LSP servers; install them yourself, for example:

```bash
npm install -g typescript-language-server
```

| Level | File |
|:---|:---|
| User | `~/.copilot/lsp-config.json` |
| Repository | `.github/lsp.json` |

```json
{
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "fileExtensions": { ".ts": "typescript", ".tsx": "typescript" }
    }
  }
}
```

Run `/lsp` in a session to see configured servers.

## Container image (for SDK clients)

`ghcr.io/github/copilot-cli` (linux/amd64 and linux/arm64) runs the CLI as a headless server for Copilot SDK clients. It is not for interactive terminal use.

```bash
export COPILOT_CONNECTION_TOKEN="$(openssl rand -hex 32)"
docker run --rm \
  -p 127.0.0.1:4321:4321 \
  -e COPILOT_CONNECTION_TOKEN \
  -e COPILOT_GITHUB_TOKEN \
  ghcr.io/github/copilot-cli:latest
```

Set `COPILOT_GITHUB_TOKEN` first. Pin a release tag instead of `latest` for versioned deployments.

## Sources

- https://github.com/github/copilot-cli (README.md)
- https://docs.github.com/copilot/concepts/agents/about-copilot-cli (linked from the README, not fetched)
