---
title: "Codex Slash Commands Reference"
tags: ["codex", "slash-commands", "cli", "reference", "openai"]
category: "Agent_Guides"
subcategory: "Codex"
checked: 2026-10-13
repo: openai/codex
---

<!-- Last Updated: 2026-10-13 - Partially checked: see note below -->

# Codex Slash Commands Reference

Built-in slash commands available in Codex CLI interactive mode.

**Source**: [developers.openai.com/codex/cli/features](https://developers.openai.com/codex/cli/features)

## Core Slash Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/model` | Switch between models or adjust reasoning levels | `/model` |
| `/review` | Open code review presets | `/review` |
| `/fork` | Fork conversation at current point | `/fork` |
| `/copy` | Copy latest completed output to clipboard | `/copy` |
| `/theme` | Preview and select color theme | `/theme` |
| `/clear` | Wipe terminal and start fresh (preserves conversation) | `/clear` |
| `/exit` | Close interactive session | `/exit` |

## Command Details

### /model

Switch between available models or adjust reasoning levels mid-session.

**Available Models:**
Run `/model` to see the models your account can use; the CLI reference no longer names a recommended default.

**Usage:**
```bash
/model
# Opens model selector
```

### /review

Launch dedicated reviewer that reads diffs and reports findings without touching your working tree.

**Review Options:**
- **Review against base branch** - Pick local branch, diff against merge base
- **Review uncommitted changes** - Inspect staged, unstaged, and untracked files
- **Review a commit** - List recent commits and review specific SHA
- **Custom review instructions** - Provide custom focus (e.g., "Focus on accessibility")

**Configuration:**
- Uses current session model by default
- Override with `review_model` in `~/.codex/config.toml`

**Usage:**
```bash
/review
# Opens review preset selector
```

**Note:** Each review appears as its own turn in transcript, so you can rerun and compare feedback.

### /fork

Create a fork of the conversation at the current point.

**Usage:**
```bash
/fork
# Forks the conversation
```

### /copy

Copy the latest completed Codex output to clipboard. If a turn is still running, copies most recent finished output.

**Requirements:**
- **macOS**: `pbcopy` (pre-installed)
- **Linux**: `xclip` or `xsel` (install via package manager)
- **Windows**: `clip` (pre-installed)
- **Remote (SSH/WSL)**: OSC 52 support in terminal

**Usage:**
```bash
/copy
# Copies last output
```

### /theme

Open theme picker to preview and save color theme preferences.

**Features:**
- Live preview of themes
- Syntax highlighting for code blocks and diffs
- Saved to `tui.theme` in `~/.codex/config.toml`
- Custom `.tmTheme` files under `$CODEX_HOME/themes`

**Usage:**
```bash
/theme
# Opens theme selector
```

### /clear

Clear the terminal screen and start fresh chat. Conversation history is cleared visually but session state may be preserved depending on implementation.

**Shortcut:** `Ctrl+L` also clears the screen without starting new conversation.

**Usage:**
```bash
/clear
# Clears terminal
```

### /exit

Close the interactive session and return to shell.

**Shortcuts:**
- `Ctrl+C` (when idle)
- `/exit`

**Usage:**
```bash
/exit
# Exits Codex
```

## Special Input Prefixes

These aren't slash commands but special input modes:

### @ - File Search

Fuzzy file search over workspace root.

**Usage:**
```
@<start typing>
# Opens fuzzy finder, press Tab/Enter to insert path
```

**Example:**
```
@src/app Show me this file
```

### ! - Shell Command

Execute local shell command and include output in context.

**Usage:**
```
!ls -la
!git status
```

**Toggle Shell Mode:**
```
!
# Toggles shell mode on/off
# When active: all input interpreted as shell commands
```


## Keyboard Shortcuts (Not Commands)

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Clear screen (preserves conversation) |
| `Ctrl+C` | Cancel current operation / Exit |
| `Ctrl+G` | Open full editor (`$VISUAL` or `$EDITOR`) |
| `Up/Down` | Navigate draft history |
| `Enter` (while running) | Inject new instructions |
| `Tab` (while running) | Queue follow-up for next turn |
| `Esc Esc` | Edit previous user message / fork from point |

## Interactive Features

### Composer Features

- **Draft history**: Navigate with Up/Down arrows
- **Image placeholders**: Restored when navigating drafts
- **Multiline input**: Natural multiline editing
- **Editor integration**: Ctrl+G for full editor

### Real-Time Feedback

- Watch Codex explain plan before changes
- Approve or reject steps inline
- Syntax-highlighted code blocks and diffs
- Colored markdown rendering

### Session Management

Resume previous sessions:

```bash
codex resume          # Interactive picker
codex resume --last   # Most recent session
codex resume <id>     # Specific session ID
```

## Configuration File

Location: `~/.codex/config.toml`

**Relevant Settings:**
```toml
[tui]
theme = "monokai"

review_model = "<model-id>"
web_search = "cached"  # or "live" or "disabled"
```

## Notes

- This list is not exhaustive: the official CLI also has `/permissions`, `/plan`, `/status`, `/init`, `/mcp`, `/goal`, `/feedback` and others. The slash-command page was unreachable when this guide was checked (it redirects to learn.chatgpt.com/docs/developer-commands), so run `/` in your installed build for the current list
- All slash commands are case-sensitive
- Commands can be used mid-conversation
- Some commands open interactive pickers
- Review runs isolated (no working tree changes)
- Model switches take effect immediately

---

## See Also

- [Codex CLI Features](https://developers.openai.com/codex/cli/features) - Complete feature documentation
- [Multi-Agent](https://developers.openai.com/codex/multi-agent) - Parallel workflows
- [MCP Documentation](https://developers.openai.com/codex/mcp) - External tool integration
- [Best Practices](https://developers.openai.com/codex/learn/best-practices) - Usage guidelines
