---
title: "💻 Codex CLI Guide"
tags: ["featured", "codex", "flags", "cli", "reference", "openai", "options"]
category: "Agent_Guides"
subcategory: "Codex"
repo: openai/codex
checked: 2026-10-27
---

<!-- Last Updated: 2026-04-18 - Synced with upstream v0.121.0 -->

# OpenAI Codex Agent Guide

Comprehensive reference for building and managing agents with OpenAI Codex CLI.

**Key Features:**
- 🤖 Lightweight coding agent that runs locally
- 💬 Natural language interface for code tasks
- 🔒 Multiple sandbox modes for safe execution
- 📋 Project context via AGENTS.md documentation
- 🎯 Flexible approval policies for command execution
- 💻 Available in terminal, VS Code, Cursor, Windsurf
- 🌐 Web and cloud-based versions available
- 🧩 Plugin marketplace support (`codex marketplace add`)
- 🔧 MCP (Model Context Protocol) support (experimental)
- 🧠 Expanded memory controls in TUI and app server

**Authentication:** Codex is included with ChatGPT Plus, Pro, Business, Edu, and Enterprise plans. Recommended to authenticate with your ChatGPT account when prompted. API key authentication is also available but requires additional setup.

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Agent Template** | [Codex Agent Template](../Agent_Templates/codex) |
| **GitHub Repo** | [github.com/openai/codex](https://github.com/openai/codex) |
| **Documentation** | [developers.openai.com/codex](https://developers.openai.com/codex/) |
| **CLI Reference** | [developers.openai.com/codex/cli/reference](https://developers.openai.com/codex/cli/reference/) |
| **Slash Commands** | [developers.openai.com/codex/cli/slash-commands](https://developers.openai.com/codex/cli/slash-commands/) |
| **Configuration** | [developers.openai.com/codex/config-reference](https://developers.openai.com/codex/config-reference/) |
| **Features** | [developers.openai.com/codex/cli/features](https://developers.openai.com/codex/cli/features/) |
| **Changelog** | [developers.openai.com/codex/changelog](https://developers.openai.com/codex/changelog/) |
| **OpenAI Platform** | [platform.openai.com/docs](https://platform.openai.com/docs) |

---

## 2. Start Commands

### Installation

```bash
# Install via npm
npm install -g @openai/codex

# Install via Homebrew (macOS)
brew install --cask codex
```

### Basic Launch Commands

```bash
# Launch Codex (interactive terminal UI)
codex

# Launch with initial prompt
codex "explain this codebase"

# Launch with image attachment
codex -i screenshot.png "what does this show"
codex --image diagram.png,flow.png "explain these diagrams"
```

### Launch with Flags

```bash
# Launch with specific model
codex -m gpt-5-codex
codex --model gpt-5

# Launch with full auto mode (low-friction local work)
codex --full-auto

# Launch with YOLO mode (bypass all approvals and sandbox)
codex --yolo
codex --dangerously-bypass-approvals-and-sandbox

# Launch with web search enabled
codex --search

# Launch with specific working directory
codex -C /path/to/project
codex --cd /path/to/project

# Launch with additional directories
codex --add-dir ../lib ../shared

# Launch with configuration profile
codex -p my-profile
codex --profile production

# Launch with open source model (Ollama)
codex --oss
```

### Sandbox Modes

```bash
# Read-only sandbox
codex -s read-only
codex --sandbox read-only

# Workspace-write sandbox (can modify project files)
codex -s workspace-write
codex --sandbox workspace-write

# Full access (dangerous)
codex -s danger-full-access
codex --sandbox danger-full-access
```

### Approval Modes

```bash
# Prompt for untrusted commands
codex -a untrusted
codex --ask-for-approval untrusted

# Prompt only on failure
codex -a on-failure

# Prompt only on request
codex -a on-request

# Never prompt (requires safe environment)
codex -a never
```

### Non-Interactive Mode

```bash
# Execute non-interactively
codex exec "fix the bug in main.py"
codex e "add tests for the auth module"

# Execute with JSON output
codex exec --json "query"

# Resume a session (--last = most recent in this directory)
codex exec resume <session_id> "continue fixing"
codex exec resume --last "continue fixing"
```

---

## 3. MCP Config Locations

### Configuration Files

**User Configuration:**
```
~/.codex/config.toml
```

**Admin Requirements (Enterprise):**
```
requirements.toml
```

### Config File Format (TOML)

```toml
# ~/.codex/config.toml

# Model configuration
model = "gpt-5-codex"
model_provider = "openai"
model_context_window = 128000
model_reasoning_effort = "medium"

# Security settings
sandbox_mode = "workspace-write"
approval_policy = "untrusted"

# Features
[features]
shell_tool = true
unified_exec = false
web_search_request = true
tui2 = false

# Tools
[tools]
web_search = true

# Environment
[shell_environment_policy]
inherit = "core"

[shell_environment_policy.set]
CUSTOM_VAR = "value"

# Profiles
[profiles.production]
model = "gpt-5"
sandbox_mode = "read-only"
approval_policy = "untrusted"

[profiles.development]
model = "gpt-5-codex"
sandbox_mode = "workspace-write"
approval_policy = "on-failure"
```

### MCP Server Configuration

```toml
# In config.toml
[mcp]
servers = [
    { name = "github", command = "npx", args = ["-y", "@modelcontextprotocol/server-github"] },
    { name = "filesystem", command = "npx", args = ["-y", "@modelcontextprotocol/server-filesystem", "/path"] }
]
```

### MCP CLI Commands

```bash
# List MCP servers
codex mcp list

# Add MCP server
codex mcp add <name> <command>

# Remove MCP server
codex mcp remove <name>

# Authenticate MCP server
codex mcp authenticate <name>
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | API authentication |
| `CODEX_MODEL` | Default model |
| `CODEX_SANDBOX` | Default sandbox mode |
| `CODEX_APPROVAL` | Default approval policy |

---

## 4. All Slash Commands

| Command | Description |
|---------|-------------|
| `/approvals` | Set what Codex can do without asking first |
| `/compact` | Summarize visible conversation to free tokens |
| `/diff` | Show Git diff including untracked files |
| `/exit` | Exit the CLI |
| `/feedback` | Send logs to Codex maintainers |
| `/init` | Generate AGENTS.md scaffold in current directory |
| `/logout` | Sign out and clear local credentials |
| `/mcp` | List configured MCP tools |
| `/mention <path>` | Attach a file to the conversation |
| `/model` | Choose active model and reasoning effort |
| `/new` | Start new conversation in same session |
| `/quit` | Exit the CLI |
| `/review` | Ask Codex to review your working tree |
| `/status` | Display session configuration and token usage |

### Custom Commands

Custom prompts can be created and invoked using:
```
/prompts: <name>
```

---

## 5. All CLI Flags

### Global Flags

| Flag | Description |
|------|-------------|
| `--add-dir <path>` | Grant additional directories write access |
| `-a, --ask-for-approval <mode>` | Set approval mode: `untrusted`, `on-failure`, `on-request`, `never` |
| `-C, --cd <path>` | Set working directory |
| `-c, --config <key=value>` | Override configuration values |
| `--dangerously-bypass-approvals-and-sandbox` | Skip all safety checks (alias: `--yolo`) |
| `--disable <feature>` | Force-disable a feature flag |
| `--enable <feature>` | Force-enable a feature flag |
| `--full-auto` | Low-friction mode with workspace-write sandbox |
| `-i, --image <path>` | Attach image files to prompt |
| `-m, --model <name>` | Override configured model |
| `--oss` | Use local open source model (Ollama) |
| `-p, --profile <name>` | Load configuration profile |
| `-s, --sandbox <mode>` | Set sandbox: `read-only`, `workspace-write`, `danger-full-access` |
| `--search` | Enable web search |
| `--yolo` | Alias for --dangerously-bypass-approvals-and-sandbox |

### Subcommands

| Command | Description |
|---------|-------------|
| `codex` | Launch interactive terminal UI |
| `codex exec` / `codex e` | Run non-interactively |
| `codex apply` / `codex a` | Apply diffs from Codex Cloud tasks |
| `codex login` | Authenticate via OAuth or API key |
| `codex completion` | Generate shell completion scripts |
| `codex cloud` | Interact with cloud tasks (experimental) |
| `codex mcp` | Manage MCP servers (experimental) |
| `codex sandbox` | Run under sandbox (experimental) |

---

## 6. Permissions & Project Configuration

### Approval Policies

| Policy | Description |
|--------|-------------|
| `untrusted` | Prompt for all external commands |
| `on-failure` | Prompt only when commands fail |
| `on-request` | Prompt only when explicitly requested |
| `never` | Never prompt (requires safe environment) |

### Sandbox Modes

| Mode | Description |
|------|-------------|
| `read-only` | Cannot modify any files |
| `workspace-write` | Can modify files in project workspace |
| `danger-full-access` | Full filesystem access (dangerous) |

### Admin Requirements (requirements.toml)

```toml
# Constrain what users can configure
allowed_approval_policies = ["untrusted", "on-failure"]
allowed_sandbox_modes = ["read-only", "workspace-write"]
forced_login_method = "chatgpt"
```

### Feature Flags

```toml
[features]
shell_tool = true              # Enable shell command execution
unified_exec = false           # PTY-backed execution (beta)
web_search_request = true      # Allow web searches
tui2 = false                   # New TUI interface (experimental)
shell_snapshot = true          # Shell state snapshots
```

Enable multiple features via CLI:
```bash
codex --enable shell_snapshot --enable web_search_request
```

### Project Documentation

Codex reads project context from:
- `AGENTS.md` (primary)
- Fallback filenames configured in `project_doc_fallback_filenames`

Generate scaffold:
```
/init
```

---

## 7. Folder Structure for Agents/Projects

### User Configuration: `~/.codex/`

```
~/.codex/
├── config.toml            # User configuration
├── credentials/           # Authentication tokens
└── cache/                 # Cached data
```

### Project Configuration

```
project-root/
├── AGENTS.md              # Project context and instructions
├── .codex/                # Project-specific config (optional)
│   └── config.toml
└── requirements.toml      # Admin-enforced settings (enterprise)
```

### AGENTS.md Structure

```markdown
# Project: My Application

## Overview
Brief description of the project.

## Architecture
- Frontend: React with TypeScript
- Backend: Python FastAPI
- Database: PostgreSQL

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Code Conventions
- Use TypeScript strict mode
- Follow ESLint rules
- Write tests for all new features

## Important Files
- `src/main.ts` - Application entry point
- `src/api/` - API endpoints
- `src/components/` - React components
```

---

## 8. Configuration Reference

### Model Settings

```toml
model = "gpt-5-codex"
model_provider = "openai"
model_context_window = 128000
model_reasoning_effort = "medium"  # minimal, low, medium, high, xhigh
```

### Authentication Settings

```toml
forced_login_method = "chatgpt"  # or "api"
cli_auth_credentials_store = "auto"  # file, keyring, or auto
```

### Shell Environment

```toml
[shell_environment_policy]
inherit = "core"  # all, core, or none

[shell_environment_policy.set]
PATH = "/custom/path:$PATH"
NODE_ENV = "development"
```

### Project Settings

```toml
project_root_markers = [".git", "package.json", "Cargo.toml"]
project_doc_fallback_filenames = ["README.md", "CONTRIBUTING.md"]
project_doc_max_bytes = 50000
```

---

## 9. Authentication

### Login Methods

```bash
# OAuth login (ChatGPT Plus, Pro, Team, Edu, Enterprise) - RECOMMENDED
codex login

# API key login (reads the key from stdin)
printenv OPENAI_API_KEY | codex login --with-api-key

# Check status
codex login status
```

**Recommended:** Sign in with your ChatGPT account to use Codex as part of your Plus, Pro, Team, Edu, or Enterprise plan. See [ChatGPT plan details](https://help.openai.com/en/articles/11369540-codex-in-chatgpt).

**API Key:** Can be used but requires [additional setup](https://developers.openai.com/codex/auth#sign-in-with-an-api-key).

### Logout

```bash
codex logout
```

Or via slash command:
```
/logout
```

---

## 10. Keyboard Shortcuts

| Shortcut | Description |
|----------|-------------|
| `Ctrl+C` | Cancel/interrupt |
| `Ctrl+D` | Exit |
| `Ctrl+L` | Clear screen |

---

**Last Updated:** 2026-03-14  
**Source:** Synced from official OpenAI Codex documentation

*Part of the [my_agents](../../) repository*
