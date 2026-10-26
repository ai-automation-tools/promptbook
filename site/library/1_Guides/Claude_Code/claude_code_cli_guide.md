---
title: "💻 Claude Code CLI Guide"
tags: ["featured", "claude-code", "flags", "cli", "reference", "options"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-10-13
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-10-13 - Install, permission modes and CLI table checked against code.claude.com/docs/en/setup, permission-modes and cli-reference -->

# Claude Code Agent Guide

Comprehensive reference for building and managing agents with Claude Code CLI.

**Key Features:**
- 🤖 Agentic coding tool that understands your codebase
- 💬 Natural language commands for routine tasks and git workflows
- ⚡ Native per-platform CLI binary for faster startup and improved reliability
- 🔧 Extensible via plugins for custom commands and agents
- 🔌 MCP (Model Context Protocol) support for custom integrations
- 💻 Available in terminal, IDE, or via @claude on GitHub
- 🛡️ Multiple permission modes for safe execution
- 🌐 `sandbox.network.deniedDomains` support for explicit domain blocking

**Installation:** the native installer is recommended and auto-updates in the background (see [setup](https://code.claude.com/docs/en/setup)).

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Homebrew / WinGet (no auto-update)
brew install --cask claude-code
winget install Anthropic.ClaudeCode

# npm (Node.js 22+; installs the same native binary)
npm install -g @anthropic-ai/claude-code
```

Update with `claude update`; check the install with `claude doctor`. Don't use `sudo npm install -g`.

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Agent Template** | [Claude Code Agent Template](../Agent_Templates/claude_code) |
| **GitHub Repo** | [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) |
| **Documentation** | [code.claude.com/docs](https://code.claude.com/docs/en/overview) |
| **CLI Reference** | [code.claude.com/docs/cli-reference](https://code.claude.com/docs/en/cli-reference.md) |
| **MCP Integration** | [code.claude.com/docs/mcp](https://code.claude.com/docs/en/mcp.md) |
| **Plugins** | [Plugins Directory](https://github.com/anthropics/claude-code/blob/main/plugins/README.md) |
| **Best Practices** | [anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices) |
| **Skills Guide** | [code.claude.com/docs/skills](https://code.claude.com/docs/en/skills.md) |
| **Hooks Guide** | [code.claude.com/docs/hooks-guide](https://code.claude.com/docs/en/hooks-guide.md) |

---

## 2. Start Commands

### Basic Launch Commands

```bash
# Launch Claude Code (interactive REPL)
claude

# Launch with initial prompt
claude "explain this project"

# Continue most recent conversation
claude -c

# Resume specific session by name or ID
claude -r "session-name"
```

### Launch with Flags

```bash
# Launch with full permissions (skip all prompts)
claude --dangerously-skip-permissions

# Launch with verbose/debug logging
claude --verbose

# Launch with debug categories
claude --debug "api,hooks"

# Launch in plan mode (analyze only, no modifications)
claude --permission-mode plan

# Launch and auto-accept edits
claude --permission-mode acceptEdits

# Launch with specific model
claude --model opus
claude --model sonnet
claude --model haiku

# Launch with custom system prompt
claude --system-prompt "You are a Python expert"

# Launch with appended system prompt
claude --append-system-prompt "Always use TypeScript"
```

### MCP Server Configuration

```bash
# Launch with project MCP servers
claude --mcp-config .mcp.json

# Launch with ONLY specified MCP servers (strict mode)
claude --mcp-config .mcp.json --strict-mcp-config

# Launch with additional directories
claude --add-dir ../apps ../lib

# Launch with Chrome integration
claude --chrome
```

### Non-Interactive Mode (Print Mode)

```bash
# Query and exit
claude -p "explain this function"

# Pipe content and query
cat logs.txt | claude -p "explain these errors"

# Output as JSON
claude -p "query" --output-format json

# Limit agentic turns
claude -p --max-turns 3 "fix this bug"
```

---

## 3. MCP Config Locations

### Configuration File Hierarchy

| Scope | Location | Purpose | Git |
|-------|----------|---------|-----|
| **User/Local** | `~/.claude.json` | Personal MCP servers + project state | No |
| **Project** | `.mcp.json` | Team-shared MCP servers | Yes |
| **Managed (macOS)** | `/Library/Application Support/ClaudeCode/managed-mcp.json` | Organization policies | IT |
| **Managed (Linux)** | `/etc/claude-code/managed-mcp.json` | Organization policies | IT |
| **Managed (Windows)** | `C:\Program Files\ClaudeCode\managed-mcp.json` | Organization policies | IT |

### Windows-Specific Paths

```
User config:
C:\Users\<username>\.claude.json

Project config:
<project-root>\.mcp.json
```

### MCP CLI Commands

```bash
# List all MCP servers
claude mcp list

# Add HTTP MCP server
claude mcp add --transport http <name> <url>

# Add stdio MCP server
claude mcp add --transport stdio <name> -- <command> [args...]

# Add with scope
claude mcp add --scope project <name> ...   # .mcp.json (shared)
claude mcp add --scope local <name> ...     # ~/.claude.json (current project only)
claude mcp add --scope user <name> ...      # ~/.claude.json (all projects)

# Remove server
claude mcp remove <server-name>

# Import from Claude Desktop
claude mcp add-from-claude-desktop
```

### MCP Config Format

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "local-server": {
      "type": "stdio",
      "command": "node",
      "args": ["path/to/server.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

---

## 4. All Slash Commands

| Command | Description |
|---------|-------------|
| `/add-dir` | Add additional working directories |
| `/agents` | Manage custom AI subagents |
| `/bashes` | List and manage background tasks |
| `/bug` | Report bugs (sends conversation to Anthropic) |
| `/clear` | Clear conversation history |
| `/compact [instructions]` | Compact conversation with optional focus |
| `/config` | Open Settings interface (Config tab) |
| `/context` | Visualize current context usage |
| `/cost` | Show token usage statistics |
| `/doctor` | Check installation health |
| `/exit` | Exit the REPL |
| `/export [filename]` | Export conversation to file or clipboard |
| `/help` | Get usage help |
| `/hooks` | Manage hook configurations |
| `/ide` | Manage IDE integrations |
| `/init` | Initialize project with CLAUDE.md |
| `/install-github-app` | Set up Claude GitHub Actions |
| `/login` | Switch Anthropic accounts |
| `/logout` | Sign out |
| `/mcp` | Manage MCP server connections |
| `/memory` | Edit CLAUDE.md memory files |
| `/model` | Select or change AI model |
| `/output-style [style]` | Set output style |
| `/permissions` | View or update permissions |
| `/plan` | Enter plan mode |
| `/plugin` | Manage plugins |
| `/pr-comments` | View pull request comments |
| `/privacy-settings` | View and update privacy settings |
| `/release-notes` | View release notes |
| `/rename <name>` | Rename current session |
| `/remote-env` | Configure remote session environment |
| `/resume [session]` | Resume conversation |
| `/review` | Request code review |
| `/rewind` | Rewind conversation and/or code |
| `/sandbox` | Enable sandboxed bash tool |
| `/security-review` | Security review of pending changes |
| `/stats` | Visualize daily usage and session history |
| `/status` | Show version, model, account, connectivity |
| `/statusline` | Set up status line UI |
| `/teleport` | Resume remote session from claude.ai |
| `/terminal-setup` | Install Shift+Enter key binding |
| `/theme` | Change color theme |
| `/todos` | List current TODO items |
| `/usage` | Show plan usage limits |
| `/vim` | Enter vim mode |

### Quick Commands

| Prefix | Description |
|--------|-------------|
| `/` | Slash command |
| `!` | Bash mode (run directly) |
| `@` | File path mention (autocomplete) |

---

## 5. All CLI Flags

### Behavioral Flags

| Flag | Description |
|------|-------------|
| `--verbose, -v` | Enable verbose logging |
| `--version` | Output version number |
| `--continue, -c` | Load most recent conversation |
| `--resume, -r` | Resume session by ID or name |
| `--print, -p` | Print response without interactive mode |
| `--fork-session` | Create new session ID instead of reusing |
| `--session-id` | Use specific session ID (UUID) |

### Permission & Security Flags

| Flag | Description |
|------|-------------|
| `--dangerously-skip-permissions` | Skip all permission prompts |
| `--permission-mode` | Set mode: `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` |
| `--permission-prompt-tool` | MCP tool to handle permission prompts |
| `--allowedTools` | Tools that execute without prompting |
| `--disallowedTools` | Tools removed from context |
| `--tools` | Restrict which built-in tools can be used |

### Model & System Prompt Flags

| Flag | Description |
|------|-------------|
| `--model` | Set model: `fable`, `opus`, `sonnet`, `haiku`, or full name (e.g. `claude-sonnet-5-5`) |
| `--system-prompt` | Replace entire system prompt |
| `--system-prompt-file` | Load system prompt from file (print mode) |
| `--append-system-prompt` | Append text to default system prompt |
| `--betas` | Beta headers for API requests |

### Configuration Flags

| Flag | Description |
|------|-------------|
| `--settings` | Load settings from JSON file or string |
| `--setting-sources` | Comma-separated list of sources |
| `--mcp-config` | Load MCP servers from JSON |
| `--strict-mcp-config` | Only use MCP servers from --mcp-config |
| `--plugin-dir` | Load plugins from directories |
| `--agent` | Specify agent for current session |
| `--agents` | Define custom subagents via JSON |

### File & Directory Flags

| Flag | Description |
|------|-------------|
| `--add-dir` | Add additional working directories |
| `--chrome` | Enable Chrome browser integration |
| `--no-chrome` | Disable Chrome integration |

### Output & Format Flags

| Flag | Description |
|------|-------------|
| `--output-format` | Format: `text`, `json`, `stream-json` (print mode) |
| `--input-format` | Format: `text`, `stream-json` (print mode) |
| `--include-partial-messages` | Include partial streaming events |

### Advanced Flags

| Flag | Description |
|------|-------------|
| `--max-turns` | Limit agentic turns (print mode) |
| `--json-schema` | Get validated JSON output matching schema |
| `--fallback-model` | Enable fallback model when overloaded |
| `--debug` | Enable debug mode with optional categories |
| `--ide` | Auto-connect to IDE on startup |

---

## 6. Permissions & Project Configuration

### Permission Modes

| Mode | Description |
|------|-------------|
| `default` (alias `manual`) | Reads only; prompts for edits, commands and network access |
| `acceptEdits` | Auto-accepts file edits and common filesystem commands |
| `plan` | Plan Mode - analyze but don't modify |
| `auto` | Everything runs, with a classifier model reviewing actions in the background |
| `dontAsk` | Auto-denies anything that would prompt unless pre-approved |
| `bypassPermissions` | Skips all prompts (isolated containers and VMs only) |

### Settings File Locations

| File | Purpose |
|------|---------|
| `~/.claude/settings.json` | Personal global settings |
| `.claude/settings.json` | Team-shared project settings |
| `.claude/settings.local.json` | Personal per-project (gitignored) |

### Permission Rules Format

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)",
      "Edit(/src/**)"
    ],
    "ask": [
      "Bash(git push:*)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Read(./.env)",
      "Read(./secrets/**)"
    ],
    "additionalDirectories": ["../docs/"],
    "defaultMode": "acceptEdits"
  }
}
```

### Granting MCP Server Access

In `settings.json`:

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["memory", "github"],
  "disabledMcpjsonServers": ["filesystem"],
  "allowedMcpServers": [{"serverName": "github"}],
  "deniedMcpServers": [{"serverName": "dangerous-server"}]
}
```

Or via interactive prompt:
```
> /mcp
```

### Granting Non-Project Folder Access

```json
{
  "permissions": {
    "additionalDirectories": [
      "../shared-lib/",
      "/path/to/external/folder"
    ]
  }
}
```

Or via command:
```
> /add-dir ../shared-lib
```

---

## 7. Folder Structure for Agents/Projects

### Project Configuration: `.claude/`

```
.claude/
├── settings.json          # Team-shared settings (checked in)
├── settings.local.json    # Personal overrides (gitignored)
├── CLAUDE.md              # Project memory (checked in)
├── CLAUDE.local.md        # Personal project memory (gitignored)
├── commands/              # Custom slash commands
│   ├── optimize.md
│   ├── deploy.md
│   └── frontend/
│       └── build.md
├── agents/                # Custom subagents
│   ├── code-reviewer.md
│   └── debugger.md
├── skills/                # Agent skills
│   ├── pdf-processor/
│   │   ├── SKILL.md
│   │   └── scripts/
│   └── data-analyst/
│       └── SKILL.md
├── rules/                 # Modular project rules
│   ├── code-style.md
│   ├── testing.md
│   └── security.md
└── hooks/                 # Hook configurations
```

### User Configuration: `~/.claude/`

```
~/.claude/
├── settings.json          # Personal global settings
├── CLAUDE.md              # Personal global memory
├── commands/              # Personal slash commands
├── agents/                # Personal subagents
├── skills/                # Personal skills
└── rules/                 # Personal rules
```

### Root Configuration Files

```
project-root/
├── .mcp.json              # Project MCP servers (shared)
├── CLAUDE.md              # Project memory (alternative location)
└── .claude/               # Claude configuration directory
```

### User Root Configuration

```
~/.claude.json             # User preferences, OAuth tokens, MCP servers
```

---

## 8. Keyboard Shortcuts

| Shortcut | Description |
|----------|-------------|
| `Ctrl+C` | Cancel current input or generation |
| `Ctrl+D` | Exit Claude Code session |
| `Ctrl+L` | Clear terminal screen |
| `Ctrl+O` | Toggle verbose output |
| `Ctrl+R` | Reverse search command history |
| `Ctrl+V` | Paste image from clipboard |
| `Ctrl+B` | Background running tasks |
| `Esc + Esc` | Rewind code/conversation |
| `Shift+Tab` / `Alt+M` | Toggle permission modes |
| `Alt+P` | Switch model |
| `Alt+T` | Toggle extended thinking |

---

**Last Updated:** 2026-03-14  
**Source:** Synced from official Anthropic documentation

*Part of the [my_agents](../../) repository*
