---
title: "Codex CLI Flags Reference"
tags: ["codex", "flags", "cli", "reference", "openai", "options"]
category: "Agent_Guides"
subcategory: "Codex"
checked: 2026-10-13
repo: openai/codex
---

<!-- Last Updated: 2026-10-13 - Checked against the Codex CLI command reference (learn.chatgpt.com/docs/developer-commands) and github.com/openai/codex -->

# Codex CLI Flags Reference

Official command-line flags for Codex CLI (OpenAI's coding agent).

**Sources**: [developers.openai.com/codex](https://developers.openai.com/codex) (CLI pages now redirect to [learn.chatgpt.com/docs/developer-commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)), [github.com/openai/codex](https://github.com/openai/codex)

## Installation & Basic Commands

```bash
# Install (macOS / Linux)
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# Or via a package manager
npm install -g @openai/codex
brew install --cask codex

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"

# Run interactive mode
codex

# Run with initial prompt
codex "Explain this codebase to me"

# Update to latest version
codex update
```

## Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `codex` | Start interactive TUI session | `codex` |
| `codex "query"` | Start with initial prompt | `codex "Explain this codebase"` |
| `codex exec "task"` (alias `e`) | Non-interactive automation | `codex exec "fix the CI failure"` |
| `codex review` | Non-interactive review of uncommitted changes, a base branch, a commit or custom instructions | `codex review` |
| `codex fork` | Fork a previous session into a new chat | `codex fork` |
| `codex login` / `codex logout` | Authenticate (ChatGPT OAuth, device auth, API key, access token) / remove credentials | `codex login` |
| `codex doctor` | Diagnostic report for installation, config, auth, runtime and Git | `codex doctor` |
| `codex sandbox` | Run commands inside the macOS, Linux or Windows sandbox | `codex sandbox` |
| `codex apply` (alias `a`) | Apply the latest diff from a Codex cloud chat to your working tree | `codex apply` |
| `codex update` | Check for and apply a CLI update | `codex update` |
| `codex resume` | Open session picker | `codex resume` |
| `codex resume --last` | Resume most recent session | `codex resume --last` |
| `codex resume --all` | Show all sessions (any directory) | `codex resume --all` |
| `codex resume <id>` | Resume specific session | `codex resume 7f9f9a2e-...` |
| `codex features list` | List feature flags | `codex features list` |
| `codex features enable <name>` | Enable feature | `codex features enable unified_exec` |
| `codex features disable <name>` | Disable feature | `codex features disable shell_snapshot` |
| `codex cloud` | Browse/launch cloud tasks | `codex cloud` |
| `codex cloud exec --env ENV_ID "task"` | Start cloud task | `codex cloud exec --env ENV_ID "Summarize bugs"` |
| `codex completion bash` | Generate bash completions | `codex completion bash` |
| `codex completion zsh` | Generate zsh completions | `codex completion zsh` |
| `codex completion fish` | Generate fish completions (PowerShell and Elvish also supported) | `codex completion fish` |

## CLI Flags

### Model Selection

| Flag | Description | Example |
|------|-------------|---------|
| `--model <name>`, `-m` | Override the configured model | `codex --model <model-id>` |

The CLI reference states no default model. Run `/model` in a session, or `codex debug models`, to see the models your account can use.

### Context & Directories

| Flag | Description | Example |
|------|-------------|---------|
| `--cd <path>`, `-C` | Set working directory | `codex --cd apps/frontend` |
| `--add-dir <path>` | Grant write access to additional directories (repeatable) | `codex --add-dir ../backend --add-dir ../shared` |

### Image Input

| Flag | Description | Example |
|------|-------------|---------|
| `--image <paths>`, `-i` | Attach images to the initial prompt (comma-separated paths) | `codex -i screenshot.png "Explain this error"` |

### Web Search

| Flag | Description | Default |
|------|-------------|---------|
| `--search` | Enable live web search instead of cached (single run) | Cached mode |

**Note**: Web search defaults to cached index for safety. Use `--search` for live results or set `web_search = "live"` in config. Can be disabled with `web_search = "disabled"`.

### Approvals & Sandbox

| Flag | Description | Example |
|------|-------------|---------|
| `--ask-for-approval`, `-a` | When Codex pauses for approval: `on-request` or `never` | `codex -a on-request` |
| `--sandbox`, `-s` | Sandbox policy: `read-only`, `workspace-write` or `danger-full-access` | `codex -s workspace-write` |
| `--dangerously-bypass-approvals-and-sandbox`, `--yolo` | Run without approvals or sandboxing (use sparingly) | `codex --yolo` |

Use `/permissions` in an interactive session to switch modes.

### Other Global Flags

| Flag | Description |
|------|-------------|
| `--config`, `-c` `key=value` | Override a configuration value for this run |
| `--oss` | Use a local open-source model provider; pair with `--local-provider lmstudio\|ollama` |
| `--enable <feature>` / `--disable <feature>` | Force a feature flag on or off (repeatable) |
| `--no-alt-screen` | Disable alternate screen mode |
| `--strict-config` | Error on unrecognized config fields |
| `--remote <url>` | Connect to a remote app server (`ws://`, `wss://`, `unix://`) |

### Session Management

| Flag | Description | Example |
|------|-------------|---------|
| `--last` | Resume most recent session | `codex resume --last` |
| `--all` | Show sessions from all directories | `codex resume --all` |

### Cloud Tasks

| Flag | Description | Example |
|------|-------------|---------|
| `--env <id>` | Specify cloud environment | `codex cloud exec --env ENV_ID "task"` |
| `--attempts <1-4>` | Request best-of-N runs | `codex cloud exec --env ENV_ID --attempts 3 "task"` |

### Configuration

| Flag | Description | Note |
|------|-------------|------|
| `--profile <name>`, `-p` | Layer a named profile config | Changes persist to profile, not root config |

## Interactive Mode Features

### Keyboard Shortcuts

- **Ctrl+C** - Cancel current operation / Exit
- **Ctrl+L** - Clear screen (preserves conversation)
- **Up/Down** - Navigate draft history
- **Enter** - Inject new instructions (while running)
- **Tab** - Queue follow-up for next turn
- **Ctrl+G** - Open full editor (uses $VISUAL or $EDITOR)
- **Esc Esc** - Edit previous message / fork conversation

### Special Prefixes

- **@** - Fuzzy file search (drop path into message)
- **!** - Run local shell command (output included in context)

## Slash Commands

Type `/` in interactive mode to access:

- `/model` - Switch between models or adjust reasoning
- `/review` - Open code review presets
- `/fork` - Fork conversation at current point
- `/copy` - Copy latest output
- `/theme` - Preview and select color theme
- `/clear` - Wipe terminal and start fresh (or Ctrl+L)
- `/exit` - Close session

## Model Context Protocol (MCP)

Configure MCP servers in `~/.codex/config.toml` to connect Codex to additional tools.

```bash
# Manage MCP servers via CLI
codex mcp <command>
```

Codex can also run as an MCP server for other agents.

## Configuration File

Location: `~/.codex/config.toml`

**Key Settings:**
- `review_model` - Override model for `/review` command
- `web_search` - Set to `"live"`, `"cached"`, or `"disabled"`
- `tui.theme` - Color theme setting

## Multi-Agent Workflows

Enable parallel task execution with multi-agent features.

**Configuration**: `[agents]` in `config.toml`  
**Documentation**: See [Multi-agents](https://developers.openai.com/codex/multi-agent)

## Code Review

Use `/review` in interactive mode to:

- Review against base branch
- Review uncommitted changes
- Review a specific commit
- Custom review instructions

Reviewer runs isolated, no working tree changes.

## Shell Completions

```bash
# Bash
echo 'eval "$(codex completion bash)"' >> ~/.bashrc

# Zsh
echo 'eval "$(codex completion zsh)"' >> ~/.zshrc

# Fish
codex completion fish > ~/.config/fish/completions/codex.fish
```

**Zsh Note**: If you see `compdef` error, add this before the eval line:
```bash
autoload -Uz compinit && compinit
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VISUAL` | Editor for Ctrl+G (fallback: `$EDITOR`) |
| `EDITOR` | Fallback editor if `VISUAL` not set |
| `CODEX_HOME` | Custom Codex home directory (default: `~/.codex`) |

## Best Practices

1. **Activate environments first** - Source Python venv, set env vars before launching
2. **Use `--cd` for project root** - Set working directory without `cd` first
3. **Review before committing** - Use `/review` to check changes
4. **Leverage completion scripts** - Install shell completions for better UX
5. **Configure MCP for extensibility** - Connect external tools via MCP servers

## Platform Support

- ✅ macOS
- ✅ Linux
- ⚠️ Windows (PowerShell installer available; WSL also works)

**Windows Setup**: See [Windows setup guide](https://developers.openai.com/codex/windows)

---

## See Also

- [Codex CLI Features](https://developers.openai.com/codex/cli/features) - Full feature documentation
- [Codex Models](https://developers.openai.com/codex/models) - Model comparison
- [Multi-Agent](https://developers.openai.com/codex/multi-agent) - Parallel workflows
- [MCP Documentation](https://developers.openai.com/codex/mcp) - Model Context Protocol
- [Changelog](https://developers.openai.com/codex/changelog) - Release notes
- [Best Practices](https://developers.openai.com/codex/learn/best-practices) - Usage guide
