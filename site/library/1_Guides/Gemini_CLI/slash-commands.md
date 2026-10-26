---
title: "Gemini CLI Slash Commands Reference"
tags: ["gemini-cli", "slash-commands", "cli", "reference", "google"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
repo: google-gemini/gemini-cli
---

<!-- Last Updated: 2026-03-14 - Synced with upstream documentation -->

# Gemini CLI Slash Commands Reference

Complete reference for built-in commands in Gemini CLI.

**Source**: [geminicli.com/docs/reference/commands](https://geminicli.com/docs/reference/commands/)

Commands use forward slash `/`, at symbol `@`, or exclamation mark `!` prefixes.

## Core Commands

| Command | Description |
|---------|-------------|
| `/about` | Show version info (share when filing issues) |
| `/help` | Display help and available commands |
| `/quit` | Exit Gemini CLI |
| `/clear` | Clear terminal screen including visible session history |

## Session Management

| Command | Description |
|---------|-------------|
| `/resume` [session] | Resume conversation or open session browser |
| `/chat` | Alias for `/resume` (same browser and checkpoint subcommands) |
| `/chat list` | List tagged checkpoints (manual saves) |
| `/chat save <tag>` | Save current conversation with tag |
| `/chat resume <tag>` | Resume from tagged checkpoint |
| `/chat delete <tag>` | Delete saved checkpoint |
| `/chat share [filename]` | Export to Markdown or JSON |
| `/chat debug` | Export most recent API request as JSON |
| `/fork [name]` | Fork current conversation at this point |

**Note:** All conversations auto-saved. Manual checkpoints are for tagged saves only.

**Checkpoint Locations:**
- Linux/macOS: `~/.gemini/tmp/<project>/`
- Windows: `C:\Users\<user>\.gemini\tmp\<project>\`

## Configuration & Settings

| Command | Description |
|---------|-------------|
| `/settings` | Open settings editor |
| `/auth` | Manage authentication method |
| `/color [color\|default]` | Set prompt bar color (red/blue/green/yellow/purple/orange/pink/cyan) |
| `/theme` | Change visual theme |
| `/terminal-setup` | Configure terminal keybindings (VS Code, Cursor, Windsurf) |
| `/editor` | Select supported editor |
| `/vim` | Toggle vim mode on/off |

## Model & Generation

| Command | Description |
|---------|-------------|
| `/model manage` | Open model configuration dialog |
| `/model set <name> [--persist]` | Set model to use |
| `/effort [low\|medium\|high\|max\|auto]` | Set model effort level (experimental) |

## Memory & Context

| Command | Description |
|---------|-------------|
| `/memory list` | List paths of GEMINI.md files in use |
| `/memory show` | Display full concatenated memory content |
| `/memory refresh` | Reload memory from all GEMINI.md files |
| `/memory add <text>` | Add text to AI's memory |
| `/init` | Generate GEMINI.md context file for project |
| `/compact` | Replace entire context with summary |
| `/directory add <paths>` | Add directories to workspace |
| `/directory show` | Display all workspace directories |

## Agents & Skills

| Command | Description |
|---------|-------------|
| `/agents list` | List all discovered agents (built-in, local, remote) |
| `/agents reload` | Rescan agent directories and reload registry |
| `/agents enable <name>` | Enable specific subagent |
| `/agents disable <name>` | Disable specific subagent |
| `/agents config <name>` | Configure agent (model, temperature, execution limits) |
| `/skills list` | List all discovered skills and status |
| `/skills enable <name>` | Enable specific skill |
| `/skills disable <name>` | Disable specific skill |
| `/skills reload` | Refresh skill list from all tiers |

**Note:** Agents require `experimental.enableAgents: true` in settings.

## MCP (Model Context Protocol)

| Command | Description |
|---------|-------------|
| `/mcp list` (or `/mcp ls`) | List configured MCP servers and tools (default) |
| `/mcp desc` | List with descriptions |
| `/mcp schema` | List with descriptions and schemas |
| `/mcp refresh` | Restart all MCP servers and re-discover tools |
| `/mcp enable <name>` | Enable disabled MCP server |
| `/mcp disable <name>` | Disable MCP server |
| `/mcp auth [server]` | OAuth authentication for MCP server |

## Extensions

| Command | Description |
|---------|-------------|
| `/extensions list` | List active extensions |
| `/extensions install <repo\|path>` | Install from git repo or local path |
| `/extensions link <path>` | Link local extension |
| `/extensions enable <name>` | Enable extension |
| `/extensions disable <name>` | Disable extension |
| `/extensions config <name>` | Configure extension settings |
| `/extensions update <name\|--all>` | Update extension(s) |
| `/extensions uninstall <name>` | Uninstall extension |
| `/extensions restart` | Restart all extensions |
| `/extensions explore` | Open extensions page in browser |

## Hooks

| Command | Description |
|---------|-------------|
| `/hooks list` (or `/hooks show`, `/hooks panel`) | Display all registered hooks with status |
| `/hooks enable <name>` | Enable hook by name |
| `/hooks disable <name>` | Disable hook by name |
| `/hooks enable-all` | Enable all disabled hooks |
| `/hooks disable-all` | Disable all enabled hooks |

## IDE Integration

| Command | Description |
|---------|-------------|
| `/ide status` | Check IDE integration status |
| `/ide enable` | Enable IDE integration |
| `/ide disable` | Disable IDE integration |
| `/ide install` | Install required IDE companion |

## Permissions & Safety

| Command | Description |
|---------|-------------|
| `/permissions trust [folder]` | Manage folder trust settings |
| `/policy list` | List all active policies grouped by mode |
| `/plan` | Enter Plan Mode (read-only) and view current plan |
| `/plan copy` | Copy approved plan to clipboard |
| `/sandbox` | Toggle sandbox mode (experimental) |

## History & Checkpointing

| Command | Description |
|---------|-------------|
| `/restore [tool_call_id]` | Restore files to pre-tool state (list if no ID) |
| `/rewind` | Navigate backward through conversation history |

**Shortcuts:** Press `Esc` twice to trigger rewind

**Features:**
- Select interaction to preview
- Rewind history only, code only, or both

**Note:** Checkpointing must be configured in settings

## Utilities

| Command | Description |
|---------|-------------|
| `/copy` | Copy last Gemini output to clipboard |
| `/commands reload` | Reload custom command definitions |
| `/docs` | Open Gemini CLI documentation in browser |
| `/bug <message>` | File issue about Gemini CLI |
| `/stats session` | Show session-specific usage statistics (default) |
| `/stats model` | Show model-specific usage (tokens, quota) |
| `/stats tools` | Show tool-specific usage statistics |
| `/tools [desc]` | Display available tools (with/without descriptions) |
| `/tools nodesc` | Hide tool descriptions |
| `/upgrade` | Open Gemini Code Assist upgrade page (Google login only) |
| `/privacy` | Display Privacy Notice and consent options |
| `/setup-github-actions` | Set up GitHub Actions for issue triage and PR review |
| `/shell` | Toggle background shells view |

## Custom Commands

Create personalized shortcuts via `.toml` files.

**Documentation**: [Custom Commands](https://geminicli.com/docs/cli/custom-commands)

**Management:**
```bash
/commands reload
# Reload definitions from:
# - ~/.gemini/commands/
# - <project>/.gemini/commands/
# - MCP prompts
# - Extensions
```

## Input Shortcuts (Not Slash Commands)

### Undo/Redo

| Shortcut | Action |
|----------|--------|
| `Alt+Z` (or `Cmd+Z`) | Undo last action in input |
| `Shift+Alt+Z` (or `Shift+Cmd+Z`) | Redo last undone action |

### @ Commands - File/Directory Content

```bash
@path/to/file.txt Explain this.
@src/project/ Summarize code.
@README.md What is this about?
```

**Features:**
- Reads file or directory content
- Git-aware filtering (excludes .git, node_modules, etc.)
- Configurable via `context.fileFiltering`
- Uses `read_many_files` tool
- Escape spaces: `@My\ Documents/file.txt`

**Lone @:** Passes query as-is to model

### ! Commands - Shell Execution

```bash
!ls -la
!git status
```

**Toggle Shell Mode:**
```bash
!
# Enter shell mode (colored indicator shown)
# All input becomes shell commands
# Type ! again to exit
```

**Environment:** `GEMINI_CLI=1` set in subprocess

**Shells:**
- Linux/macOS: `bash`
- Windows: `powershell.exe -NoProfile -Command` (or `ComSpec` override)

## Vim Mode

Toggle with `/vim`

**Modes:**
- **NORMAL** - Navigation and commands
- **INSERT** - Text input

**Features:**
- Count support: `3h`, `5w`, `10G`
- Editing: `x` (delete), `c` (change), `i/a/o/O` (insert)
- Complex ops: `dd`, `cc`, `dw`, `cw`
- Navigation: `h/j/k/l`, `w/b/e`, `0/$^`, `G`, `gg`
- Repeat: `.` to repeat last operation
- Status: Shows `[NORMAL]` or `[INSERT]` in footer

**Persistent:** Preference saved to `~/.gemini/settings.json`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Clear terminal screen |
| `Esc` (twice) | Rewind / Edit previous message |
| `Alt+Z` / `Cmd+Z` | Undo in input |
| `Shift+Alt+Z` / `Shift+Cmd+Z` | Redo in input |

## Notes

- Commands prefixed with `/`, `@`, or `!`
- Not all commands visible to every user
- Some require specific plan tiers or configurations
- Experimental features need opt-in via settings
- MCP prompts appear as `/mcp__<server>__<prompt>`
- Custom commands from `.toml` files appear in `/` list

---

## See Also

- [CLI Reference](https://geminicli.com/docs/cli/cli-reference) - Command cheatsheet
- [Configuration](https://geminicli.com/docs/reference/configuration) - Settings reference
- [Keyboard Shortcuts](https://geminicli.com/docs/reference/keyboard-shortcuts) - Full shortcuts list
- [Custom Commands](https://geminicli.com/docs/cli/custom-commands) - Create your own
- [Memory Management](https://geminicli.com/docs/cli/tutorials/memory-management) - GEMINI.md guide
- [Session Management](https://geminicli.com/docs/cli/tutorials/session-management) - Resume & history
