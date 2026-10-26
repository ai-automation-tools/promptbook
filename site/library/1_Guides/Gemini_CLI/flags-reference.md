---
title: "Gemini CLI Flags Reference"
tags: ["gemini-cli", "flags", "cli", "reference", "google", "options"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
checked: 2026-10-13
repo: google-gemini/gemini-cli
---

<!-- Last Updated: 2026-10-13 - Checked against github.com/google-gemini/gemini-cli docs/cli/cli-reference.md -->

# Gemini CLI Flags Reference

Command-line options and features for Gemini CLI (Google's AI coding agent).

**Sources**: [geminicli.com/docs](https://geminicli.com/docs/), [CLI reference](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/cli-reference.md)

## Installation

```bash
# Install via npm
npm install -g @google/gemini-cli

# Verify installation
gemini --version

# Update to the latest version
gemini update
```

## CLI Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--model` | `-m` | Model to use (default `auto`); see aliases below |
| `--prompt` | `-p` | Prompt text; forces non-interactive mode |
| `--prompt-interactive` | `-i` | Run the prompt, then continue interactively |
| `--resume` | `-r` | Resume a session: `"latest"` or an index number |
| `--list-sessions` | | List sessions for the current project and exit |
| `--delete-session` | | Delete a session by index |
| `--approval-mode` | | `default`, `auto_edit`, `yolo` or `plan` |
| `--yolo` | `-y` | **Deprecated**; use `--approval-mode=yolo` |
| `--sandbox` | `-s` | Run in a sandboxed environment |
| `--skip-trust` | | Trust the current workspace for this session |
| `--worktree` | `-w` | Start in a new git worktree (needs `experimental.worktrees: true`) |
| `--include-directories` | | Extra directories to add to the workspace |
| `--extensions` | `-e` | Extensions to use (all enabled if omitted) |
| `--list-extensions` | `-l` | List available extensions and exit |
| `--allowed-mcp-server-names` | | Allowed MCP server names |
| `--allowed-tools` | | **Deprecated**; use the Policy Engine |
| `--output-format` | `-o` | `text` (default), `json` or `stream-json` |
| `--screen-reader` | | Enable screen reader mode |
| `--debug` | `-d` | Verbose debug logging |
| `--version` / `--help` | `-v` / `-h` | Print version / help |

Subcommands: `gemini update`, `gemini extensions` (`install`, `uninstall`, `list`, `update`, `enable`, `disable`, `link`, `new`, `validate`), `gemini mcp` (`add`, `remove`, `list`) and `gemini skills` (`list`, `install`, `link`, `uninstall`, `enable`, `disable`).

Model aliases for `--model`: `auto` (default), `pro`, `flash`, `flash-lite`. Concrete model names are also accepted.

Examples:

```bash
gemini -p "summarize this repo" -o json
cat logs.txt | gemini -p "find the error"
gemini -r latest "continue where we left off"
gemini mcp add my-server ./server.js --scope user
```

## Core Features

Gemini CLI is an open-source AI agent that brings Gemini models directly into your terminal using a "reason and act" (ReAct) loop with built-in tools and Model Context Protocol (MCP) servers.

### Supported Capabilities

- **File Management** - Read, write, and manipulate local files
- **Shell Execution** - Execute system commands safely
- **Session Management** - Resume conversations and rewind history
- **Web Integration** - Search and fetch web content
- **Agent Skills** - Specialized expertise for specific tasks
- **MCP Servers** - Connect to remote agents and tools
- **Checkpointing** - Automatic session snapshots
- **IDE Integration** - Connect with your favorite editor
- **Headless Mode** - Programmatic/scripting interface

## Authentication

**Personal Accounts:** run `gemini` and choose a sign-in method when prompted (the CLI reference lists no separate login subcommand).

**Enterprise/Google Cloud:**
- Configure via Google Cloud project settings
- See [Authentication documentation](https://geminicli.com/docs/get-started/authentication)

## Model Selection

Access Gemini models directly:

```bash
# Use /model command in interactive mode
/model set <model-name>
/model set <model-name> --persist
```

**Model aliases** (`--model` / `/model`):
- `auto` (default) - `gemini-2.5-pro`, or `gemini-3-pro-preview` when preview features are enabled
- `pro` - complex reasoning (same resolution as `auto`)
- `flash` - `gemini-2.5-flash`, fast and balanced
- `flash-lite` - `gemini-2.5-flash-lite`, fastest, for simple tasks

**Documentation**: [Model Selection](https://geminicli.com/docs/cli/model)

## Input Methods

### @ Commands - File/Directory Content

Include file or directory content in your prompt:

```bash
@path/to/file.txt Explain this text.
@src/my_project/ Summarize the code.
What is this file about? @README.md
```

**Features:**
- Recursive directory reading
- Git-aware filtering (excludes node_modules, .git, etc.)
- Configurable via `context.fileFiltering` settings
- Uses `read_many_files` tool internally

**Note:** Escape spaces in paths with backslash (`@My\ Documents/file.txt`)

### ! Commands - Shell Execution

Execute shell commands directly:

```bash
!ls -la
!git status
```

**Toggle Shell Mode:**
```bash
!
# Enter shell mode (all input becomes shell commands)
# Type ! again to exit
```

**Environment Variable:** `GEMINI_CLI=1` is set when running commands

## Configuration

### Settings File

Location: `~/.gemini/settings.json`

Manage via:
```bash
/settings
# Opens settings editor
```

### Project Context

**GEMINI.md File** - Hierarchical memory system

```bash
/init
# Creates GEMINI.md in current directory
```

**Memory Commands:**
```bash
/memory list      # List GEMINI.md file paths
/memory show      # Display full concatenated memory
/memory reload    # Reload from all GEMINI.md files (older builds: /memory refresh)
/memory add <text> # Add text to memory
```

### Ignore Files

**.geminiignore** - Exclusion patterns (like .gitignore)

Respects git-ignore patterns by default.

## Features & Modes

### Plan Mode

Read-only mode for planning changes:

```bash
/plan
# Enter plan mode

/plan copy
# Copy approved plan to clipboard
```

**Configuration:** `experimental.plan` in settings (enabled by default)

### Sandbox Mode

Isolate tool execution for safety.

**Documentation**: [Sandboxing](https://geminicli.com/docs/cli/sandbox)

### Headless Mode

Programmatic interface for automation:

**Documentation**: [Headless Mode](https://geminicli.com/docs/cli/headless)

### Token Caching

Performance optimization for repeated context.

**Documentation**: [Token Caching](https://geminicli.com/docs/cli/token-caching)

### Model Routing

Automatic fallback resilience for rate limits.

**Documentation**: [Model Routing](https://geminicli.com/docs/cli/model-routing)

## Agent Skills

Specialized agents for specific tasks:

```bash
/skills list      # List all skills
/skills enable <name>   # Enable skill
/skills disable <name>  # Disable skill
/skills reload    # Refresh skill list
```

**Documentation**: [Agent Skills](https://geminicli.com/docs/cli/skills)

## Subagents (Experimental)

Multi-agent collaboration:

```bash
/agents list      # List discovered agents
/agents reload    # Rescan agent directories
/agents enable <name>   # Enable subagent
/agents disable <name>  # Disable subagent
/agents config <name>   # Configure agent
```

**Requires:** `experimental.enableAgents: true` in settings

**Documentation**: [Subagents](https://geminicli.com/docs/core/subagents)

## MCP (Model Context Protocol)

Connect to external tools and context:

```bash
/mcp list         # List MCP servers and tools
/mcp desc         # Show descriptions
/mcp schema       # Show schemas
/mcp refresh      # Restart servers
/mcp enable <name>   # Enable server
/mcp disable <name>  # Disable server
/mcp auth [server]   # OAuth authentication
```

**Configuration:** `~/.gemini/mcp/`

**Documentation**: [MCP Servers](https://geminicli.com/docs/tools/mcp-server)

## Extensions

Extend Gemini CLI with new tools:

```bash
/extensions list      # List active extensions
/extensions install <repo>  # Install from git/path
/extensions link <path>     # Link local extension
/extensions enable <name>   # Enable extension
/extensions disable <name>  # Disable extension
/extensions config <name>   # Configure extension
/extensions update <name|--all> # Update extensions
/extensions uninstall <name>    # Remove extension
/extensions restart     # Restart all extensions
/extensions explore     # Open extensions page
```

**Documentation**: [Extensions](https://geminicli.com/docs/extensions)

## Hooks

Customize behavior with lifecycle event scripts:

```bash
/hooks list       # Display all hooks
/hooks enable <name>    # Enable hook
/hooks disable <name>   # Disable hook
/hooks enable-all # Enable all hooks
/hooks disable-all # Disable all hooks
```

**Documentation**: [Hooks](https://geminicli.com/docs/hooks)

## IDE Integration

Connect with your IDE:

```bash
/ide status       # Check integration status
/ide enable       # Enable integration
/ide disable      # Disable integration
/ide install      # Install companion
```

**Documentation**: [IDE Integration](https://geminicli.com/docs/ide-integration)

## Trusted Folders

Manage folder permissions:

```bash
/permissions trust [folder]
```

**Documentation**: [Trusted Folders](https://geminicli.com/docs/cli/trusted-folders)

## Policy Engine

Fine-grained execution control:

```bash
/policy list      # List active policies
```

**Documentation**: [Policy Engine](https://geminicli.com/docs/reference/policy-engine)

## Session Management

### Resume Sessions

```bash
/resume           # Open session browser (auto-saved)
/resume list      # List tagged checkpoints
/resume save <tag>    # Save current as checkpoint
/resume resume <tag>  # Load tagged checkpoint
/resume delete <tag>  # Delete checkpoint
/resume share [file]  # Export to Markdown/JSON
/resume debug     # Export API request JSON
```

**Aliases:** `/chat` = `/resume`

**Auto Sessions:** All conversations auto-saved, no manual saving needed

**Search:** Use `/` in session browser to search across all sessions

**Documentation**: [Session Management](https://geminicli.com/docs/cli/tutorials/session-management)

### Checkpointing

Automatic snapshots before file modifications:

```bash
/restore [tool_call_id]  # Restore to checkpoint
```

**Documentation**: [Checkpointing](https://geminicli.com/docs/cli/checkpointing)

### Rewind

Navigate backward through history:

```bash
/rewind
# Or press Esc twice
```

**Features:**
- Preview user prompts and file changes
- Rewind history only, code only, or both

**Documentation**: [Rewind](https://geminicli.com/docs/cli/rewind)

## Custom Commands

Create personalized shortcuts from `.toml` files:

```bash
/commands reload  # Reload custom commands
```

**Documentation**: [Custom Commands](https://geminicli.com/docs/cli/custom-commands)

## Themes & UI

```bash
/theme            # Open theme dialog
/vim              # Toggle vim mode
```

**Vim Mode Features:**
- NORMAL and INSERT modes
- Count support (e.g., `3h`, `5w`, `10G`)
- Standard vim commands (`dd`, `cc`, `dw`, etc.)
- Persistent setting in `~/.gemini/settings.json`

**Documentation**: [Themes](https://geminicli.com/docs/cli/themes)

## GitHub Integration

```bash
/setup-github-actions
# Set up GitHub Actions for issue triage and PR review
```

## Advanced Configuration

### Enterprise Configuration

**Documentation**: [Enterprise Configuration](https://geminicli.com/docs/cli/enterprise)

### Generation Settings

Fine-tune parameters like temperature and thinking budget:

**Documentation**: [Model Configuration](https://geminicli.com/docs/cli/generation-settings)

### System Prompt Override

Replace default instructions:

**Documentation**: [System Prompt](https://geminicli.com/docs/cli/system-prompt)

### .geminiignore

Exclusion pattern reference:

**Documentation**: [Ignore Files](https://geminicli.com/docs/cli/gemini-ignore)

## Telemetry

Usage and performance metrics:

**Documentation**: [Telemetry](https://geminicli.com/docs/cli/telemetry)

## Platform Support

- ✅ Linux
- ✅ macOS
- ✅ Windows

## Resources

- [FAQ](https://geminicli.com/docs/resources/faq)
- [Quota and Pricing](https://geminicli.com/docs/resources/quota-and-pricing)
- [Troubleshooting](https://geminicli.com/docs/resources/troubleshooting)
- [Uninstall](https://geminicli.com/docs/resources/uninstall)

## Contributing

- [Contribution Guide](https://geminicli.com/docs/contributing)
- [Local Development](https://geminicli.com/docs/local-development)

---

## See Also

- [CLI Commands](https://geminicli.com/docs/reference/commands) - Detailed slash command guide
- [Configuration Reference](https://geminicli.com/docs/reference/configuration) - Settings and env vars
- [Keyboard Shortcuts](https://geminicli.com/docs/reference/keyboard-shortcuts) - Productivity tips
- [Tools Reference](https://geminicli.com/docs/reference/tools) - Tool definitions and usage
