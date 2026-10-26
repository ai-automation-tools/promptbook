---
title: "Claude Code Slash Commands Reference"
tags: ["claude-code", "slash-commands", "cli", "reference"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-10-13
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-10-13 - Checked against code.claude.com/docs/en/commands -->

# Claude Code Slash Commands Reference

Built-in commands available in Claude Code CLI interactive mode.

**Source**: [code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands)

Type `/` in Claude Code to see all available commands, or type `/` followed by letters to filter.

## Core Commands

| Command | Purpose |
|---------|---------|
| `/help` | Show help and available commands |
| `/exit` | Exit the CLI (Alias: `/quit`) |
| `/clear [name]` | Start a new conversation with empty context; a name labels the previous one in `/resume` (Aliases: `/reset`, `/new`) |

## Session Management

| Command | Purpose |
|---------|---------|
| `/resume [session]` | Resume conversation by ID/name, or open session picker (Alias: `/continue`) |
| `/branch [name]` | Create a branch of the current conversation at this point |
| `/fork [prompt]` | Copy the current conversation into a new background session and keep working here |
| `/background [prompt]` | Detach the current session to run as a background agent |
| `/subtask <task>` | Spawn a forked background subagent that inherits the full conversation |
| `/goal [condition\|clear]` | Keep working across turns until a condition is met |
| `/rename [name]` | Rename current session and show name on prompt bar |
| `/export [filename]` | Export current conversation as plain text |
| `/compact [instructions]` | Compact conversation with optional focus instructions |

## Model & Configuration

| Command | Purpose |
|---------|---------|
| `/model [model]` | Select or change AI model (use arrows to adjust effort level) |
| `/effort [level\|auto\|status\|ultracode [on\|off]]` | Set effort level: `low` to `xhigh`, `max`, or `auto` |
| `/advisor [model\|off]` | Enable or disable the advisor tool, which consults a second model |
| `/autocompact [auto\|<tokens>]` | Set how full the context window gets before auto-compact |
| `/config [key=value ...]` | Open Settings interface (Alias: `/settings`) |
| `/output-style [style]` | List or switch output styles |
| `/status` | Open Settings interface (Status tab) showing version, model, account |

## Context & Memory

| Command | Purpose |
|---------|---------|
| `/add-dir <path>` | Add a new working directory to current session |
| `/cd <path>` | Move this session to a new working directory, keeping the conversation |
| `/context [all]` | Visualize current context usage as colored grid |
| `/btw <question>` | Ask quick side question without adding to conversation |
| `/memory` | Edit CLAUDE.md memory files, enable/disable auto-memory |

## Permissions & Safety

| Command | Purpose |
|---------|---------|
| `/permissions` | View or update permissions (Alias: `/allowed-tools`) |
| `/plan` | Enter plan mode directly from prompt |
| `/sandbox` | Toggle sandbox mode (supported platforms only) |

## Development Tools

| Command | Purpose |
|---------|---------|
| `/diff` | Open interactive diff viewer (uncommitted changes + per-turn diffs) |
| `/rewind` | Rewind conversation/code to previous point (Alias: `/checkpoint`) |
| `/security-review` | Analyze the changes on your current branch for security vulnerabilities |
| `/code-review [level] [--fix] [--comment] [pr#\|branch\|path]` | Bundled skill: review the diff or a PR (alias `/review`) |
| `/ultrareview [PR or branch]` | Deep multi-agent code review in a cloud sandbox |

## Integrations & Extensions

| Command | Purpose |
|---------|---------|
| `/agents` | Reminder to ask Claude to create or manage subagents, or edit `.claude/agents/` directly |
| `/list-agents` | List the subagents, teammates and sessions Claude can message |
| `/mcp` | Manage MCP server connections and OAuth |
| `/chrome` | Configure Claude in Chrome settings |
| `/ide` | Manage IDE integrations and show status |
| `/plugin` | Manage Claude Code plugins |
| `/reload-plugins` | Reload all active plugins without restarting |
| `/hooks` | View hook configurations for tool events |
| `/skills` | List available skills |
| `/reload-skills` | Re-scan skill and command directories without restarting |

## Remote & Web Sessions

| Command | Purpose |
|---------|---------|
| `/remote-control` | Make session available for remote control from claude.ai (Alias: `/rc`) |
| `/remote-env` | Choose the default cloud environment for cloud sessions started from the CLI |
| `/teleport` | Pull a cloud session into this terminal |
| `/schedule [description]` | Create, update, list or run cloud routines |
| `/desktop` | Continue current session in Claude Code Desktop app (macOS/Windows) (Alias: `/app`) |
| `/mobile` | Show QR code to download Claude mobile app (Aliases: `/ios`, `/android`) |

## GitHub & CI/CD

| Command | Purpose |
|---------|---------|
| `/install-github-app` | Set up Claude GitHub Actions app for repository |
| `/install-slack-app` | Install Claude Slack app (OAuth flow) |

## Utilities

| Command | Purpose |
|---------|---------|
| `/copy [N]` | Copy the last assistant response to clipboard. Pass `N` to copy Nth-latest: `/copy 2` for second-to-last. Shows picker for code blocks |
| `/color [color\|default]` | Set prompt bar color (red/blue/green/yellow/purple/orange/pink/cyan) |
| `/init` | Initialize project with CLAUDE.md guide |
| `/doctor` | Setup checkup for installation, settings, extensions and CLAUDE.md |

## Display & UI

| Command | Purpose |
|---------|---------|
| `/theme` | Change color theme (light/dark/colorblind/ANSI variants) |
| `/terminal-setup` | Configure terminal keybindings (Shift+Enter, etc.) |
| `/keybindings` | Open or create keybindings configuration file |
| `/statusline` | Configure Claude Code's status line |

## Usage & Analytics

| Command | Purpose |
|---------|---------|
| `/usage` | Show session cost, plan usage limits and activity stats (`/cost` is an alias) |
| `/insights` | Generate report analyzing your sessions |
| `/stats` | Alias for `/usage`, opens on the Stats tab |
| `/tasks` | View and manage background work in the session (alias `/bashes`) |

## Account & Plans

| Command | Purpose |
|---------|---------|
| `/login` | Sign in to Anthropic account |
| `/logout` | Sign out from Anthropic account |
| `/upgrade` | Open upgrade page to switch plan tier |
| `/passes` | Share free week of Claude Code (if eligible) |
| `/extra-usage` | Configure extra usage for rate limits |
| `/privacy-settings` | View and update privacy settings (Pro/Max plans only) |
| `/stickers` | Order Claude Code stickers |

## Advanced

| Command | Purpose |
|---------|---------|
| `/fast [on\|off]` | Toggle fast mode |
| `/feedback [report]` | Submit feedback about Claude Code (Alias: `/bug`) |
| `/release-notes` | View full changelog |
| `/voice [hold\|tap\|off]` | Toggle voice dictation (requires Claude.ai account) |
| `/import [codex\|gemini\|cursor]` | Bring configuration from another coding agent into Claude Code |

## MCP Prompts

MCP servers can expose prompts as commands using format `/mcp__<server>__<prompt>`. These are dynamically discovered from connected servers.

## Bundled Skills

Claude Code includes bundled skills like `/simplify`, `/batch`, `/debug`, `/loop` and `/verify` that appear alongside built-in commands.

Removed: `/pr-comments` (v2.1.91; ask Claude to read PR comments) and `/vim` (v2.1.92; use `/config` → Editor mode).

## Command Aliases

- `/resume` = `/continue`
- `/config` = `/settings`
- `/clear` = `/reset` = `/new`
- `/rewind` = `/checkpoint`
- `/permissions` = `/allowed-tools`
- `/remote-control` = `/rc`
- `/desktop` = `/app`
- `/mobile` = `/ios` = `/android`
- `/feedback` = `/bug`
- `/cost` = `/usage`

---

## Notes

- Not all commands visible to every user - some depend on platform, plan, or environment
- `/desktop` only appears on macOS and Windows
- `/upgrade` and `/privacy-settings` only for Pro and Max plans
- `/terminal-setup` hidden when terminal natively supports keybindings
- Type `/` to filter available commands in real-time

---

## See Also

- [Skills](https://code.claude.com/docs/en/skills) - Create your own commands
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode) - Keyboard shortcuts, Vim mode
- [CLI Reference](https://code.claude.com/docs/en/cli-reference) - Launch-time flags
