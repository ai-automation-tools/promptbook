---
title: "Claude Code CLI Flags Reference"
tags: ["claude-code", "flags", "cli", "reference", "options"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-18
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-18 - Checked against code.claude.com/docs/en/cli-reference -->

# Claude Code CLI Flags Reference

Official command-line flags available in Claude Code CLI.

**Source**: [code.claude.com/docs/en/cli-reference](https://code.claude.com/docs/en/cli-reference)

## CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| `claude` | Start interactive session | `claude` |
| `claude "query"` | Start with initial prompt | `claude "explain this project"` |
| `claude -p "query"` | Query via SDK, then exit | `claude -p "explain this function"` |
| `cat file \| claude -p "query"` | Process piped content | `cat logs.txt \| claude -p "explain"` |
| `claude -c` | Continue most recent conversation | `claude -c` |
| `claude -c -p "query"` | Continue via SDK | `claude -c -p "Check for type errors"` |
| `claude -r "<session>" "query"` | Resume session by ID or name | `claude -r "auth-refactor" "Finish this PR"` |
| `claude update` | Update to latest version | `claude update` |
| `claude auth login` | Sign in to Anthropic account | `claude auth login --email user@example.com --sso` |
| `claude auth logout` | Log out from Anthropic account | `claude auth logout` |
| `claude auth status` | Show authentication status | `claude auth status` |
| `claude agents` | Open agent view to monitor and dispatch background sessions (`--json` for scripting) | `claude agents --json` |
| `claude attach <id\|name>` | Attach to a background session | `claude attach 7c5dcf5d` |
| `claude logs <id\|name>` | Print recent output from a background session | `claude logs 7c5dcf5d` |
| `claude stop <id>` | Stop a background session | `claude stop 7c5dcf5d` |
| `claude doctor` | Print read-only installation and settings diagnostics | `claude doctor` |
| `claude install [version]` | Install or reinstall the native binary (`stable`, `latest` or a version) | `claude install stable` |
| `claude setup-token` | Generate a long-lived OAuth token for CI and scripts | `claude setup-token` |
| `claude mcp` | Configure MCP servers | See MCP documentation |
| `claude remote-control` | Start Remote Control server | `claude remote-control --name "My Project"` |
| `claude respawn <id>` | Restart a background session with its conversation intact (`--all` for every running one) | `claude respawn 7c5dcf5d` |
| `claude rm <id>` | Remove a background session from the list | `claude rm 7c5dcf5d` |
| `claude daemon status` | Print the background-session supervisor's state (also `logs`, `run`, `stop --any`) | `claude daemon status` |
| `claude plugin` | Manage plugins (alias `claude plugins`) | `claude plugin install code-review@claude-plugins-official` |
| `claude mcp login <name>` | Run an MCP server's OAuth flow from the shell (`--no-browser` over SSH) | `claude mcp login my-server` |
| `claude import [source]` | Run `/import` to bring in configuration from other coding agents | `claude import` |
| `claude purge [path]` | Delete all local Claude Code state for a project (`--dry-run`, `--yes`, `--all`) | `claude purge --dry-run` |
| `claude ultrareview [target]` | Run ultrareview non-interactively; findings go to stdout (`--json`, `--timeout <min>`, `--post`) | `claude ultrareview 123` |
| `claude auto-mode defaults` | Print the built-in auto mode classifier rules as JSON (`reset` restores the defaults) | `claude auto-mode defaults` |
| `claude gateway` | Start the self-hosted Claude apps gateway (administrators; needs `--config gateway.yaml`) | `claude gateway --config gateway.yaml` |
| `claude self-hosted-runner` | Register this machine as a runner for a self-hosted environment | `claude self-hosted-runner setup` |

## CLI Flags

### Session & Context

| Flag | Description | Example |
|------|-------------|---------|
| `--add-dir` | Add additional working directories | `claude --add-dir ../apps ../lib` |
| `--continue`, `-c` | Load most recent conversation | `claude --continue` |
| `--fork-session` | Create new session ID when resuming | `claude --resume abc123 --fork-session` |
| `--from-pr` | Resume sessions linked to GitHub PR | `claude --from-pr 123` |
| `--name`, `-n` | Set display name for session | `claude -n "my-feature-work"` |
| `--resume`, `-r` | Resume specific session by ID/name | `claude --resume auth-refactor` |
| `--session-id` | Use specific session ID (UUID) | `claude --session-id "550e8400-..."` |

### Model & Reasoning

| Flag | Description | Example |
|------|-------------|---------|
| `--model` | Set model for current session | `claude --model claude-sonnet-5` |
| `--effort` | Set effort level (low/medium/high/xhigh/max/ultracode; available levels depend on the model) | `claude --effort high` |
| `--fallback-model` | Fall back to the listed model(s), comma-separated, when the primary is overloaded or unavailable | `claude --fallback-model sonnet,haiku` |

**Aliases**: `sonnet`, `opus`, `haiku` and `fable` = the latest model of that family

### System Prompts

| Flag | Description | Example |
|------|-------------|---------|
| `--system-prompt` | Replace entire system prompt | `claude --system-prompt "You are a Python expert"` |
| `--system-prompt-file` | Load system prompt from file | `claude --system-prompt-file ./custom-prompt.txt` |
| `--append-system-prompt` | Append to default prompt | `claude --append-system-prompt "Always use TypeScript"` |
| `--append-system-prompt-file` | Append from file | `claude --append-system-prompt-file ./extra-rules.txt` |

### Permissions & Safety

| Flag | Description | Example |
|------|-------------|---------|
| `--permission-mode` | Set permission mode | `claude --permission-mode plan` |
| `--dangerously-skip-permissions` | Skip all permission prompts (caution!) | `claude --dangerously-skip-permissions` |
| `--allow-dangerously-skip-permissions` | Enable bypass option without activating | `claude --permission-mode plan --allow-dangerously-skip-permissions` |
| `--allowedTools` | Tools that execute without prompting | `"Bash(git log *)" "Bash(git diff *)" "Read"` |
| `--disallowedTools` | Tools removed from model context | `"Bash(git log *)" "Edit"` |
| `--tools` | Restrict which tools Claude can use | `claude --tools "Bash,Edit,Read"` |

### Output & Format

| Flag | Description | Example |
|------|-------------|---------|
| `--print`, `-p` | Print response without interactive mode | `claude -p "query"` |
| `--output-format` | Specify output format (text/json/stream-json) | `claude -p "query" --output-format json` |
| `--input-format` | Specify input format (text/stream-json) | `claude -p --input-format stream-json` |
| `--include-partial-messages` | Include partial streaming events | `claude -p --output-format stream-json --include-partial-messages "query"` |
| `--json-schema` | Get validated JSON output (print mode) | `claude -p --json-schema '{"type":"object",...}' "query"` |
| `--verbose` | Enable verbose logging | `claude --verbose` |

### Agents & Multi-Agent

| Flag | Description | Example |
|------|-------------|---------|
| `--agent` | Specify agent for session | `claude --agent my-custom-agent` |
| `--agents` | Define custom subagents via JSON | `claude --agents '{"reviewer":{...}}'` |
| `--teammate-mode` | Set teammate display mode (`in-process` (default), `auto`, `tmux`, `iterm2`) | `claude --teammate-mode in-process` |
| `--advisor <model>` | Enable the advisor tool, which consults a second model, for this session | `claude --advisor opus` |
| `--append-subagent-system-prompt` | Append text to every subagent's system prompt (print mode only; the `-file` form takes text from a file, and the two can't be combined) | `claude -p --append-subagent-system-prompt "Be brief" "query"` |
| `--forward-subagent-text` | Emit subagent text and thinking in the output stream, tagged with `parent_tool_use_id` | `claude -p --output-format stream-json --verbose --forward-subagent-text "query"` |

### Browser & Chrome

| Flag | Description | Example |
|------|-------------|---------|
| `--chrome` | Enable Chrome browser integration | `claude --chrome` |
| `--no-chrome` | Disable Chrome integration | `claude --no-chrome` |

### MCP & Plugins

| Flag | Description | Example |
|------|-------------|---------|
| `--mcp-config` | Load MCP servers from JSON | `claude --mcp-config ./mcp.json` |
| `--strict-mcp-config` | Only use MCP from --mcp-config | `claude --strict-mcp-config --mcp-config ./mcp.json` |
| `--plugin-dir` | Load a plugin from a directory or `.zip` for this session (repeat the flag for more) | `claude --plugin-dir ./my-plugin` |
| `--disable-slash-commands` | Disable all skills/commands | `claude --disable-slash-commands` |

### Web & Remote Sessions

| Flag | Description | Example |
|------|-------------|---------|
| `--cloud` | Create a cloud session (`--remote` is a deprecated alias) | `claude --cloud "Fix the login bug"` |
| `--environment <id>` | Create a cloud session on a self-hosted environment (IDs start `ccpool_`); `--ref <branch>` bases its checkout on a ref | `claude -p "Run the smoke test" --environment ccpool_abc123 --ref main` |
| `--desktop` | Open the Claude Desktop app on the current directory and exit | `claude --desktop --continue` |
| `--remote-control`, `--rc` | Start with Remote Control enabled | `claude --remote-control "My Project"` |
| `--teleport` | Resume web session in local terminal | `claude --teleport` |

### Configuration & Settings

| Flag | Description | Example |
|------|-------------|---------|
| `--settings` | Load settings from JSON file/string | `claude --settings ./settings.json` |
| `--setting-sources` | Comma-separated sources (user/project/local) | `claude --setting-sources user,project` |

### Advanced & Experimental

| Flag | Description | Example |
|------|-------------|---------|
| `--betas` | Beta headers for API requests | `claude --betas interleaved-thinking` |
| `--channels` | (Research preview) MCP servers whose channel notifications Claude should listen for | `claude --channels plugin:my-notifier@my-marketplace` |
| `--dangerously-load-development-channels` | Enable channels not on approved allowlist for local development | `claude --dangerously-load-development-channels server:webhook` |
| `--debug` | Enable debug mode; category filter binds only in the `=` form | `claude --debug='mcp,startup'` |
| `--bare` | Minimal mode: skip hooks, skills, plugins, MCP servers, auto memory and CLAUDE.md discovery | `claude --bare -p "query"` |
| `--safe-mode` | Start with all customizations disabled to troubleshoot a broken config | `claude --safe-mode` |
| `--bg`, `--background` | Start the session as a background agent and return immediately | `claude --bg "investigate the flaky test"` |
| `--ide` | Auto-connect to IDE on startup | `claude --ide` |
| `--init` | Run Setup hooks with the `init` matcher (print mode only) | `claude -p --init "query"` |
| `--init-only` | Run Setup and SessionStart hooks, then exit | `claude --init-only` |
| `--maintenance` | Run Setup hooks with the `maintenance` matcher (print mode only) | `claude -p --maintenance "query"` |
| `--permission-prompt-tool` | Specify MCP tool for permission prompts | `claude -p --permission-prompt-tool mcp_auth_tool "query"` |
| `--worktree`, `-w` | Start in isolated git worktree | `claude -w feature-auth` |
| `--tmux` | Create a tmux session for the worktree (needs `--worktree`; `--tmux=classic` for traditional tmux) | `claude -w feature-auth --tmux` |
| `--exec` | Run a shell command as a PTY-backed background job; use with `--bg` | `claude --bg --exec 'pytest -x'` |
| `--debug-file <path>` | Write debug logs to a file (implies debug mode) | `claude --debug-file ./claude-debug.log` |
| `--autocompact <auto\|tokens>` | Set the auto-compact window for this session (same values as `/autocompact`) | `claude --autocompact 500k` |
| `--plugin-url` | Fetch a plugin `.zip` from a URL for this session only | `claude --plugin-url https://example.com/plugin.zip` |
| `--include-hook-events` | Include hook lifecycle events in the output stream | `claude -p --output-format stream-json --verbose --include-hook-events "query"` |
| `--replay-user-messages` | Re-emit stdin user messages on stdout (stream-json in and out) | `claude -p --input-format stream-json --output-format stream-json --verbose --replay-user-messages` |
| `--prompt-suggestions` | Emit a predicted next prompt after each turn (needs `--print`, `stream-json`, `--verbose`) | `claude -p --prompt-suggestions --output-format stream-json --verbose "query"` |
| `--permission-prompts` | Print mode: `host` (default) sends prompts to the SDK host or `--permission-prompt-tool`; `none` denies them | `claude -p --permission-prompts none "query"` |
| `--restricted` | Start in restricted mode for evaluation harnesses: no command-running tools, no WebFetch, no user or project settings | `claude --restricted` |
| `--exclude-dynamic-system-prompt-sections` | Move per-user context out of the system prompt for better prompt-cache reuse (default prompt only; use with `-p`) | `claude -p --exclude-dynamic-system-prompt-sections "query"` |
| `--ax-screen-reader` | Flat, screen-reader-friendly output without borders or animations | `claude --ax-screen-reader` |

Removed: `--enable-auto-mode` (v2.1.111; use `--permission-mode auto`).

### Budget & Limits (Print Mode Only)

| Flag | Description | Example |
|------|-------------|---------|
| `--max-budget-usd` | Maximum API spend limit | `claude -p --max-budget-usd 5.00 "query"` |
| `--max-turns` | Limit agentic turns | `claude -p --max-turns 3 "query"` |
| `--no-session-persistence` | Disable session saving | `claude -p --no-session-persistence "query"` |

### Utility

| Flag | Description | Example |
|------|-------------|---------|
| `--version`, `-v` | Output version number | `claude -v` |

---

## System Prompt Flags Reference

| Flag | Behavior | Example |
|------|----------|---------|
| `--system-prompt` | Replaces entire default prompt | `claude --system-prompt "You are a Python expert"` |
| `--system-prompt-file` | Replaces with file contents | `claude --system-prompt-file ./prompts/review.txt` |
| `--append-system-prompt` | Appends to default prompt | `claude --append-system-prompt "Always use TypeScript"` |
| `--append-system-prompt-file` | Appends file to default prompt | `claude --append-system-prompt-file ./style-rules.txt` |

**Note**: Append flags can combine with replacement flags. From v2.1.283 a flag can also be combined with its own file form (e.g. `--append-system-prompt` with `--append-system-prompt-file`).

**Best Practice**: Use append flags to preserve Claude Code's built-in capabilities while adding requirements. Use replacement only when you need complete control.

---

## Environment Variables

| Variable | Equivalent Flag | Default |
|----------|----------------|---------|
| `ANTHROPIC_API_KEY` | none (there is no `--api-key` flag; use `claude auth login --console`) | None |

---

## Permission Modes

| Mode | Description |
|------|-------------|
| `default` (alias `manual`) | Reads only; prompts before edits, commands and network access |
| `acceptEdits` | Reads, file edits and common filesystem commands (`mkdir`, `mv`, `cp`) without asking |
| `plan` | Show plan, execute after approval |
| `auto` | Everything, with a classifier model reviewing actions in the background |
| `dontAsk` | Reads in working directories and pre-approved tools only; anything that would prompt is denied |
| `bypassPermissions` | Execute tools without prompting (use with caution) |

Set with `--permission-mode <mode>`.

---

## See Also

- [Chrome Extension](https://code.claude.com/docs/en/chrome) - Browser automation
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode) - Shortcuts & features
- [Common Workflows](https://code.claude.com/docs/en/common-workflows) - Advanced patterns
- [Settings](https://code.claude.com/docs/en/settings) - Configuration options
- [Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) - Programmatic usage
