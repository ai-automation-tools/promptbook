---
title: "💻 Gemini CLI Guide"
tags: ["featured", "gemini", "flags", "cli", "reference", "google", "options"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
repo: google-gemini/gemini-cli
checked: 2026-10-27
---

<!-- Last Updated: 2026-04-18 - Synced with upstream v0.38.2 -->

# Gemini CLI Agent Guide

Comprehensive reference for building and managing agents with Gemini CLI.

**Key Features:**
- 🎯 Free tier: 60 requests/min and 1,000 requests/day with personal Google account (OAuth)
- 🧠 Powerful Gemini 2.5/3.0 models with 1M token context window and improved reasoning
- 🔧 Built-in tools: Google Search grounding, file operations, shell commands, web fetching
- 🧠 Memory workflows with inbox review and skill patching improvements
- 🔌 Extensible via MCP (Model Context Protocol) for custom integrations
- 💻 Terminal-first design for developers who live in the command line
- 🤝 GitHub Actions integration for automated workflows (PR reviews, issue triage, on-demand assistance)
- 🛡️ Apache 2.0 licensed, fully open source

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Agent Template** | [Gemini CLI Agent Template](../Agent_Templates/gemini_cli) |
| **GitHub Repo** | [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) |
| **Documentation** | [geminicli.com/docs](https://geminicli.com/docs/) |
| **CLI Commands** | [geminicli.com/docs/cli/commands](https://geminicli.com/docs/cli/commands/) |
| **Extensions** | [geminicli.com/docs/extensions](https://geminicli.com/docs/extensions/) |
| **Custom Commands** | [geminicli.com/docs/cli/custom-commands](https://geminicli.com/docs/cli/custom-commands/) |
| **Configuration** | [geminicli.com/docs/get-started/configuration](https://geminicli.com/docs/get-started/configuration/) |
| **Gemini API** | [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs) |
| **Google AI Studio** | [aistudio.google.com](https://aistudio.google.com/) |
| **GitHub Action** | [github.com/google-github-actions/run-gemini-cli](https://github.com/google-github-actions/run-gemini-cli) |
| **Cheatsheet** | [philschmid.de/gemini-cli-cheatsheet](https://www.philschmid.de/gemini-cli-cheatsheet) |

---

## 2. Start Commands

### Basic Launch Commands

```bash
# Launch Gemini CLI (interactive REPL)
gemini

# Launch with initial prompt (non-interactive)
gemini -p "explain this code"

# Launch with prompt in interactive mode
gemini -i "explain this code"

# Resume previous session
gemini --resume
gemini --resume <session_id>
```

### Launch with Flags

```bash
# Launch with specific model
gemini -m pro
gemini -m flash

# Launch with debug/verbose logging
gemini -d
gemini --debug

# Launch with sandbox enabled
gemini -s
gemini --sandbox

# Launch with YOLO mode (auto-approve all tool calls)
gemini --approval-mode yolo   # --yolo / -y is deprecated

# Launch with JSON output format
gemini -p "query" --output-format json

# Launch with streaming JSON output
gemini -p "query" --output-format stream-json

# Launch with additional directories
gemini --include-directories ../lib,../shared
```

### Approval Mode Options

```bash
# Set approval mode
gemini --approval-mode default    # Prompt before each tool call
gemini --approval-mode auto_edit  # Auto-approve file edits only
gemini --approval-mode plan       # Read-only planning
gemini --approval-mode yolo       # Auto-approve all actions
```

### GitHub Actions Integration

Gemini CLI can be integrated directly into GitHub workflows via the [Gemini CLI GitHub Action](https://github.com/google-github-actions/run-gemini-cli):

**Use Cases:**
- **Pull Request Reviews:** Automated code review with contextual feedback
- **Issue Triage:** Automated labeling and prioritization based on content analysis
- **On-demand Assistance:** Mention @gemini-cli in issues/PRs for help
- **Custom Workflows:** Build automated, scheduled, and on-demand workflows

---

## 3. MCP Config Locations

### Configuration File Hierarchy (Lowest to Highest Priority)

| Priority | Location | Purpose |
|----------|----------|---------|
| 1 | Default hardcoded values | Built-in defaults |
| 2 | System defaults | OS-level defaults |
| 3 | User settings | Personal preferences |
| 4 | Project settings | Project-specific config |
| 5 | System settings | Admin overrides |
| 6 | Environment variables | Runtime overrides |
| 7 | Command-line arguments | Highest priority |

### File Locations

**User Settings:**
```
~/.gemini/settings.json
```

**Project Settings:**
```
<project-root>/.gemini/settings.json
```

**System Defaults (macOS):**
```
/Library/Application Support/GeminiCli/system-defaults.json
```

**System Defaults (Linux):**
```
/etc/gemini-cli/system-defaults.json
```

**System Defaults (Windows):**
```
C:\ProgramData\gemini-cli\system-defaults.json
```

**Shell History:**
```
~/.gemini/tmp/<project_hash>/shell_history
```

### MCP Server Configuration

In `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_TOKEN": "${GITHUB_TOKEN}"
        }
      },
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
      }
    }
  }
}
```

### Authentication Options

Gemini CLI supports three authentication methods:

**1. Login with Google (OAuth) - Recommended**
- Best for individual developers and Gemini Code Assist licensees
- Free tier: 60 requests/min, 1,000 requests/day
- Gemini 3 models with 1M token context window
- No API key management required
- For paid Code Assist licenses, set `GOOGLE_CLOUD_PROJECT` environment variable

**2. Gemini API Key**
- Get key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Free tier: 1,000 requests/day with Gemini 3 (mix of flash and pro)
- Model selection and usage-based billing available

**3. Vertex AI**
- Best for enterprise teams and production workloads
- Enterprise features with advanced security and compliance
- Higher rate limits with billing account
- Set `GOOGLE_API_KEY` and `GOOGLE_GENAI_USE_VERTEXAI=true`

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | API authentication (Method 2) |
| `GOOGLE_API_KEY` | Vertex AI authentication (Method 3) |
| `GEMINI_MODEL` | Default model selection |
| `GEMINI_SANDBOX` | Enable/disable sandboxing |
| `GEMINI_SYSTEM_MD` | Custom system prompt override |
| `GOOGLE_CLOUD_PROJECT` | GCP project identifier (for Code Assist licenses) |
| `GOOGLE_GENAI_USE_VERTEXAI` | Use Vertex AI backend (Method 3) |

---

## 4. All Slash Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `/help` or `/?` | Display help information |
| `/quit` or `/exit` | Exit Gemini CLI |
| `/clear` | Clear terminal screen and session history |
| `/copy` | Copy last output to clipboard |
| `/stats` | Display token usage and session statistics |
| `/about` | Show version information |

### Chat Management

| Command | Description |
|---------|-------------|
| `/chat save <tag>` | Save current conversation with tag |
| `/chat resume <tag>` | Resume saved conversation |
| `/chat list` | List available conversation checkpoints |
| `/chat delete <tag>` | Remove saved conversation |
| `/chat share <file.md/json>` | Export conversation to file |
| `/compress` | Replace chat context with summary |
| `/resume` | Browse and resume previous sessions |

### Memory & Context

| Command | Description |
|---------|-------------|
| `/memory add <text>` | Add text to AI's instructional context |
| `/memory show` | Display concatenated memory content |
| `/memory refresh` | Reload memory from GEMINI.md files |
| `/memory list` | List paths of GEMINI.md files in use |
| `/init` | Generate tailored GEMINI.md context file |

### Directory & Files

| Command | Description |
|---------|-------------|
| `/directory add <path>` | Add directory to workspace |
| `/directory show` | Display all added directories |
| `/restore [tool_call_id]` | Revert files to state before tool execution |

### MCP & Tools

| Command | Description |
|---------|-------------|
| `/mcp list` | List configured MCP servers |
| `/mcp desc` | Show MCP tool descriptions |
| `/mcp schema` | Show MCP tool schemas |
| `/mcp auth <server>` | Initiate OAuth flow for MCP server |
| `/mcp refresh` | Restart MCP servers and re-discover tools |
| `/tools` | List available tools |
| `/tools desc` | List tools with descriptions |
| `/extensions` | List active extensions |

### Settings & UI

| Command | Description |
|---------|-------------|
| `/settings` | Open settings editor |
| `/model` | Open dialog to choose model |
| `/theme` | Change visual theme |
| `/editor` | Select supported editor |
| `/auth` | Change authentication method |
| `/privacy` | Display Privacy Notice and consent options |
| `/vim` | Toggle vim mode for input |

### Reporting

| Command | Description |
|---------|-------------|
| `/bug` | File an issue about Gemini CLI |

### At Commands (@)

| Command | Description |
|---------|-------------|
| `@<path>` | Inject file content into prompt |
| `@` (lone) | Pass query as-is without file injection |

### Shell Commands (!)

| Command | Description |
|---------|-------------|
| `!<command>` | Execute shell command and return output |
| `!` (toggle) | Enter/exit shell mode |

---

## 5. All CLI Flags

### Core Flags

| Flag | Description |
|------|-------------|
| `-p, --prompt <text>` | Non-interactive mode with prompt |
| `-i, --prompt-interactive <text>` | Interactive mode with initial prompt |
| `-m, --model <name>` | Specify Gemini model |
| `-d, --debug` | Enable debug mode |
| `-s, --sandbox` | Enable sandbox mode |
| `--yolo` | Auto-approve all tool calls |
| `-h, --help` | Display help information |

### Output Flags

| Flag | Description |
|------|-------------|
| `--output-format json` | Structured JSON output |
| `--output-format stream-json` | Newline-delimited JSON events |

### Session Flags

| Flag | Description |
|------|-------------|
| `--resume` | Resume previous session interactively |
| `--resume <session_id>` | Resume specific session |

### Directory Flags

| Flag | Description |
|------|-------------|
| `--include-directories <paths>` | Add workspace directories (comma-separated) |

### Approval Flags

| Flag | Description |
|------|-------------|
| `--approval-mode suggest` | Suggest actions, wait for approval |
| `--approval-mode auto` | Auto-approve safe actions |
| `--approval-mode yolo` | Auto-approve all actions |

---

## 6. Permissions & Project Configuration

### Settings Categories

**`general`** - Vim mode, editor, auto-update, checkpointing

**`ui`** - Theme, window title, footer, line numbers, accessibility

**`model`** - Model selection, session turn limits, compression

**`tools`** - Sandbox, shell settings, tool discovery

**`context`** - Context file naming, directory inclusion, file filtering

**`security`** - Authentication, environment redaction, tool approval

**`mcp`** - Model Context Protocol server configuration

**`telemetry`** - Logging and metrics

**`privacy`** - Usage statistics

### Security Settings

```json
{
  "security": {
    "authenticationType": "api-key",
    "environmentVariableRedaction": {
      "enabled": true,
      "allowlist": [],
      "blocklist": ["*_KEY", "*_TOKEN", "*_SECRET"]
    },
    "toolApproval": {
      "mode": "suggest"
    }
  }
}
```

### Tool Sandbox Configuration

```json
{
  "tools": {
    "sandbox": {
      "enabled": true,
      "allowNetworkAccess": false,
      "allowedDirectories": ["/project", "/tmp"]
    }
  }
}
```

### Granting Directory Access

Via command:
```
/directory add ../shared-lib
```

Via settings:
```json
{
  "context": {
    "includeDirectories": ["../shared-lib", "/path/to/external"]
  }
}
```

---

## 7. Folder Structure for Agents/Projects

### Project Configuration: `.gemini/`

```
.gemini/
├── settings.json          # Project settings
├── commands/              # Custom slash commands
│   ├── test.toml
│   ├── deploy.toml
│   └── git/
│       └── commit.toml    # Becomes /git:commit
└── prompts/               # Prompt templates
```

### User Configuration: `~/.gemini/`

```
~/.gemini/
├── settings.json          # Global user settings
├── commands/              # Global custom commands
│   ├── my-command.toml
│   └── utils/
│       └── helper.toml
├── extensions/            # Installed extensions
└── tmp/                   # Temporary files and history
    └── <project_hash>/
        └── shell_history
```

### Context Files

```
project-root/
├── GEMINI.md              # Project context/memory
├── .gemini/               # Gemini configuration
│   └── settings.json
└── subdirectory/
    └── GEMINI.md          # Subdirectory context
```

### Custom Command Format (TOML)

```toml
# .gemini/commands/review.toml
description = "Review code for best practices"
prompt = """
Review the following code for:
1. Best practices
2. Potential bugs
3. Performance issues

{{args}}
"""
```

### Extension Structure

```
extension-name/
├── gemini-extension.json  # Extension manifest
├── commands/              # Extension commands
│   └── command.toml
├── GEMINI.md              # Extension context
└── hooks/
    └── hooks.json         # Lifecycle hooks
```

---

## 8. Keyboard Shortcuts

| Shortcut | Description |
|----------|-------------|
| `Ctrl+C` | Cancel/interrupt |
| `Ctrl+D` | Exit |
| `Ctrl+L` | Clear screen |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |

---

## 9. Extensions

### Extension Commands

```bash
# Install extension from GitHub
gemini extensions install <github-url>
gemini extensions install <github-url> --ref <branch/tag>

# Install from local path
gemini extensions link <path>

# Create new extension boilerplate
gemini extensions new <path> [template]

# Manage extensions
gemini extensions list
gemini extensions uninstall <name>
gemini extensions enable <name>
gemini extensions disable <name>
gemini extensions update <name>
gemini extensions update --all
```

### Extension Manifest (gemini-extension.json)

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "description": "My custom extension",
  "mcpServers": {
    "my-server": {
      "command": "${extensionPath}/server.js"
    }
  },
  "contextFileName": "GEMINI.md",
  "excludeTools": ["dangerous-tool"],
  "settings": {
    "apiKey": {
      "name": "API Key",
      "description": "Your API key",
      "environmentVariable": "MY_API_KEY",
      "sensitive": true
    }
  }
}
```

---

**Last Updated:** 2026-03-14  
**Source:** Synced from official Google Gemini CLI documentation

*Part of the [my_agents](../../) repository*
