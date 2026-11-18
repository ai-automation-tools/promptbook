---
title: "💘 Crush Guide: Terminal AI Coding Agent"
tags: ["crush", "charm", "cli", "terminal", "coding-agent", "mcp", "lsp"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: charmbracelet/crush
---

<!-- Last Updated: 2026-11-18 - Checked against the Crush README -->

# Crush Guide

Crush is Charm's terminal coding agent: a TUI you start in a project folder, pointed at the
model provider of your choice, with MCP servers and language servers (LSP) for extra context.
This guide covers install, providers, config, permissions, MCP, LSP and skills.

The README now documents configuration as `crushrc` files (Bash with Crush builtins). The older
`crush.json` format is still supported but marked deprecated, so examples below use both.

## Install

| Method | Command |
|:---|:---|
| Homebrew | `brew install charmbracelet/tap/crush` |
| npm | `npm install -g @charmland/crush` |
| Go | `go install github.com/charmbracelet/crush@latest` |
| Windows | `winget install charmbracelet.crush` or `scoop bucket add charm https://github.com/charmbracelet/scoop-bucket.git` then `scoop install crush` |
| Arch | `yay -S crush` |
| Debian/Ubuntu, Fedora/RHEL | `sudo apt install crush` / `sudo yum install crush` (Charm's apt and yum repos) |

Packages and binaries are also on the GitHub releases page. Run `crush` in a project folder to start.

## Providers

Press `ctrl+l` to open the model picker and add a provider with an API key, or export a variable
before starting. A few of the many the README lists:

| Variable | Provider |
|:---|:---|
| `ANTHROPIC_API_KEY` | Anthropic |
| `OPENAI_API_KEY` | OpenAI |
| `GEMINI_API_KEY` | Google Gemini |
| `OPENROUTER_API_KEY` | OpenRouter |
| `GROQ_API_KEY` | Groq |
| `XAI_API_KEY` | xAI |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | Amazon Bedrock |
| `AZURE_OPENAI_API_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_API_VERSION` | Azure OpenAI |
| `VERTEXAI_PROJECT`, `VERTEXAI_LOCATION` | Google Cloud VertexAI |

Add a local or custom OpenAI-style provider in `crushrc`:

```bash
provider add ollama --type ollama --base-url "http://localhost:11434/v1"
model add ollama/llama3.3 --name "Llama 3.3" --context-window 128000
```

## Where config lives

| Priority | Unix-like | Windows |
|:---|:---|:---|
| 1 | `./.crushrc` | `.\.crushrc` |
| 2 | `./crushrc` | `.\crushrc` |
| 3 | `~/.config/crush/crushrc` | `%USERPROFILE%\.config\crush\crushrc` |

`$HOME/.local/share/crush/crush.json` (Windows: `%LOCALAPPDATA%\crush\crush.json`) is ephemeral
state, not configuration. Global context files: `~/.config/crush/CRUSH.md` (Crush-specific) and
`~/.config/AGENTS.md` (generic).

Useful `crushrc` options:

```bash
option debug true
option provider-auto-update false
option notifications auto        # auto|native|osc|bell|disabled
option initialize-as AGENTS.md
option attribution-trailer-style co-authored-by   # assisted-by|co-authored-by|none
```

The JSON form uses the `$schema` `https://charm.land/crush.json`:

```json
{
  "$schema": "https://charm.land/crush.json",
  "options": { "tui": { "active_theme": "gruvbox-dark" } }
}
```

## Permissions

By default Crush asks before running tools. In `crushrc`:

```bash
permissions allow view edit
permissions deny bash sourcegraph
```

`crush --yolo` skips every permission prompt. Use it only in a throwaway sandbox. The README
page does not show a JSON form of these rules.

## MCP servers

```bash
mcp add github --type http --url "https://api.github.com/mcp/" \
  --header Authorization "Bearer $(op read 'op://my-secret-key')"
```

The JSON form, with OAuth:

```json
{
  "mcp": {
    "linear": { "type": "http", "url": "https://mcp.linear.app/mcp", "oauth": true }
  }
}
```

## LSP

Give Crush a language server for diagnostics and code context:

```bash
lsp add go --command "gopls" --env "GOTOOLCHAIN go1.24.5"
lsp add typescript --command "typescript-language-server" --args --stdio
lsp add nix --command "nil"
```

`option debug-lsp true` turns on LSP debug logging.

## Skills as commands

The README describes skills rather than a separate custom-commands feature. A skill is a folder
with a `SKILL.md`; add `user-invocable: true` and it appears in the `ctrl+p` palette:

```yaml
---
name: my-hot-skill
description: A skill that can be invoked as a command.
user-invocable: true
---
```

Skills load from `~/.config/crush/skills`, `~/.agents/skills`, `~/.claude/skills`, and the
project's `.crush/skills` and `.claude/skills`. `option skill-path` adds folders and
`option disable-skill <name>` switches one off.

## Command line

| Command / flag | Effect |
|:---|:---|
| `crush` | Start the TUI |
| `crush logs [--tail 500] [--follow]` | Read logs |
| `crush update-providers [url\|path\|embedded]` | Refresh the provider list |
| `--debug` | Debug logging |
| `--cwd <dir>` | Working directory; clients with the same `--cwd` share a workspace |
| `--yolo` | Skip all permission prompts |

Environment: `CRUSH_GLOBAL_CONFIG`, `CRUSH_GLOBAL_DATA`, `CRUSH_DATA_DIR`,
`CRUSH_DISABLE_PROVIDER_AUTO_UPDATE`, `CRUSH_DISABLE_METRICS` and `DO_NOT_TRACK` (telemetry off).

## License

The README lists the license as FSL-1.1-MIT (Functional Source License, converting to MIT). Read
`LICENSE.md` in the repo before using it commercially; GitHub reports it as "other".

**Sources**

- Crush README: https://github.com/charmbracelet/crush
- Crush release v0.101.0: https://github.com/charmbracelet/crush/releases/tag/v0.101.0
- Hacker News launch thread: https://news.ycombinator.com/item?id=44736176
