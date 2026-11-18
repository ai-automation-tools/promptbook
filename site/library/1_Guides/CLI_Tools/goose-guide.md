---
title: "🪿 goose Guide"
tags: ["goose", "agent", "cli", "mcp", "extensions", "recipes", "aaif"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: aaif-goose/goose
---

<!-- Last Updated: 2026-11-18 - Checked against goose-docs.ai and the repo README -->

# goose Guide

goose is a local, open-source (Apache-2.0) general-purpose AI agent written in Rust. It runs as a
desktop app or a terminal CLI, talks to many model providers, and gains tools through MCP
extensions. It started at Block and is now a Linux Foundation Agentic AI Foundation (AAIF) project;
the repo lives at `aaif-goose/goose`.

## Install the CLI

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

On Windows run it in Git Bash, MSYS2 or PowerShell. Desktop builds (macOS zip, Linux DEB/RPM/Flatpak,
Windows installer or portable zip) are on the releases page.

## Configure a provider

```bash
goose configure      # then: Configure Providers, pick one, enter the key, pick a model
goose info -v        # version, config file location, session storage, logs
```

Desktop users go to Settings, Models. Each provider documents its own environment variable
(for example `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`). API keys placed in
`config.yaml` are ignored: use environment variables or the keychain. Pick a model per run with
`goose run --model <name>`.

The providers page lists cloud providers (Anthropic, OpenAI, Gemini, Amazon Bedrock, Azure OpenAI,
GitHub Copilot, OpenRouter, Groq, Mistral AI and many more), local ones (Ollama, LM Studio,
Docker Model Runner, Lemonade, Ramalama and others), a CLI provider (Cursor Agent) and ACP
providers (`claude-acp`, `codex-acp`). Custom providers can use OpenAI-, Anthropic- or
Ollama-compatible APIs. For Ollama set `OLLAMA_HOST` (default `localhost:11434`), use a
tool-calling model, and raise `OLLAMA_CONTEXT_LENGTH` if goose ignores extensions or `.goosehints`
(default context is 4096 tokens).

## Sessions

```bash
goose session                 # new interactive session
goose session -r              # resume the last session
goose session list
goose session export -o out.md
```

## Extensions (MCP)

Three kinds: built-in (for example Developer, Memory, Tutorial, Computer Controller),
command-line (`type: stdio`) and remote (`type: streamable_http`). Add them through
`goose configure`, then Add Extension, or per session:

```bash
goose session --with-builtin developer
goose session --with-extension "uvx mcp-server-fetch"
goose session --with-streamable-http-extension "<url>"
```

Inside a session: `/extension npx -y @modelcontextprotocol/server-memory` or `/builtin developer`.
Session-only extensions are not installed.

Persisted extensions live in `config.yaml` (`~/.config/goose/config.yaml` in the docs' macOS example):

```yaml
extensions:
  github:
    name: GitHub
    cmd: npx
    args: [-y @modelcontextprotocol/server-github]
    enabled: true
    envs: { "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>" }
    type: stdio
    timeout: 300
```

## Recipes

A recipe is a reusable, parameterised task in `.yaml` (recommended) or `.json`; `.yml` is not
supported by the CLI. `title` and `description` are required, plus `instructions` or `prompt`
(`prompt` is required for headless runs). Parameter keys are used as `{{ key }}` templates.

```yaml
version: "1.0.0"
title: "Summarize File"
description: "Summarize a text file in a chosen style"
parameters:
  - key: style
    input_type: select        # string, number, boolean, date, file, select
    requirement: optional     # required, optional, user_prompt
    default: "brief"
    description: "Summary style"
    options: [brief, detailed]
prompt: "Summarize the project notes in a {{ style }} style."
```

Optional parameters need a default; required ones cannot have one. Recipes load from the current
directory, `GOOSE_RECIPE_PATH`, or a GitHub repo named in `GOOSE_RECIPE_GITHUB_REPO`. An explicit
`extensions` block drops default platform extensions such as `summon`.

```bash
goose recipe validate recipe.yaml
goose run --recipe recipe.yaml --params style=detailed
goose recipe list
goose schedule add --schedule-id nightly --cron "<expr>" --recipe-source recipe.yaml
```

## CLI command map

| Command | Purpose |
|:---|:---|
| `goose configure` | Providers and extensions |
| `goose session` | Interactive chat (`-r`, `--with-*` flags) |
| `goose run` | Headless: `-i`/`-t` input, `--recipe`, `--params`, `--model`, `--provider`, `--output-format text\|json\|stream-json`, `--no-session` |
| `goose recipe` | `list`, `validate`, `open`, `deeplink` |
| `goose schedule` | Cron-run recipes (`add`, `list`, `remove`, `run-now`) |
| `goose update` | Update (`--canary` for the dev build) |
| `goose info`, `goose skills list`, `goose serve`, `goose acp` | Diagnostics, skills, ACP server modes |

`goose serve` defaults to 127.0.0.1:3284 and needs `GOOSE_SERVER__SECRET_KEY` unless started with
`--dangerously-unauthenticated`.

**Sources**

- [goose quickstart](https://goose-docs.ai/docs/quickstart)
- [Providers](https://goose-docs.ai/docs/getting-started/providers)
- [Using extensions](https://goose-docs.ai/docs/getting-started/using-extensions)
- [Recipe reference](https://goose-docs.ai/docs/guides/recipes/recipe-reference)
- [CLI commands](https://goose-docs.ai/docs/guides/goose-cli-commands)
- [aaif-goose/goose README](https://github.com/aaif-goose/goose)
- [Linux Foundation: Agentic AI Foundation announcement](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
