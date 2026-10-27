---
title: "🪝 Claude Code Hooks Guide"
tags: ["claude-code", "hooks", "automation", "guardrails", "settings"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-10-26
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-10-26 - Checked against code.claude.com/docs/en/hooks-guide -->

# Claude Code Hooks Guide

Hooks run your own commands at fixed points in Claude Code's lifecycle, so something always
happens (format a file, block a write, send a notification) instead of depending on the model
remembering to do it.

## Where to put a hook

| Location | Scope | Shareable |
|:---|:---|:---|
| `~/.claude/settings.json` | All your projects | No |
| `.claude/settings.json` | One project | Yes, commit it |
| `.claude/settings.local.json` | One project | No, gitignored |
| Managed policy settings | Organization | Yes, admin-controlled |
| Plugin `hooks/hooks.json` | While the plugin is enabled | Yes |
| Skill or subagent frontmatter | While the skill or subagent is active | Yes |

Run `/hooks` to browse everything configured, grouped by event. Set `"disableAllHooks": true`
to turn them off. Edits to a settings file are normally picked up while the session runs.

## Shape of a hook

Each event is a key inside one `hooks` object. A `matcher` narrows which tool or notification
type it applies to (empty matches all; matchers are case-sensitive).

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" }]
      }
    ]
  }
}
```

Add a second event as a sibling key; don't replace the whole object.

`type` is `command` for most hooks. The others are `http` (POST the event to a URL),
`mcp_tool`, `prompt` (single-turn model check) and `agent` (multi-turn check with tools,
experimental).

## Events you will use most

| Event | Fires | Can block |
|:---|:---|:---|
| `PreToolUse` | Before a tool call runs | Yes |
| `PostToolUse` | After a tool call succeeds | No, the tool already ran |
| `PermissionRequest` | When a call needs a permission decision | Decides it |
| `Notification` | When Claude waits for input or permission | No |
| `SessionStart` | A session begins or resumes | No |
| `Stop` | Claude finishes responding | Yes |
| `ConfigChange` | A settings or skills file changes | Yes |

The full list (including `UserPromptSubmit`, `PreCompact`, `PostCompact`, `SubagentStop`,
`CwdChanged`, `FileChanged`, `SessionEnd` and more) is in the hooks reference.

## Input and output

Claude Code sends the event as JSON on stdin: `session_id`, `cwd`, `hook_event_name`, and for
tool events `tool_name` and `tool_input` (for Bash, `tool_input.command`). Your script answers
with its exit code:

- **Exit 0**: no decision; stdout text is added to Claude's context on events such as `SessionStart`.
- **Exit 2**: block, where the event allows it; stderr is shown to Claude as the reason.
- **JSON on stdout**: for finer control, such as an allow decision for `PermissionRequest`.
  Fields like `permissionDecision` belong inside `hookSpecificOutput`; at the top level they
  are ignored without an error.

When several hooks match one event they run in parallel. For `PreToolUse` the most restrictive
answer wins (`deny`, `defer`, `ask`, `allow`), and a `deny` does not stop its siblings from
running.

## Recipes

### Desktop notification when Claude needs you

`~/.claude/settings.json`, Linux shown; macOS uses `osascript -e 'display notification ...'`:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [{ "type": "command", "command": "notify-send 'Claude Code' 'Claude Code needs your attention'" }]
      }
    ]
  }
}
```

Narrow it with a matcher such as `permission_prompt` (approval needed) or `idle_prompt`
(finished about 60 seconds ago and you haven't typed since).

### Block edits to protected files

Save as `.claude/hooks/protect-files.sh`, then `chmod +x` it on macOS and Linux:

```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
FILE_PATH="${FILE_PATH//\\//}"

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done

exit 0
```

Register it in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh" }]
      }
    ]
  }
}
```

A `PreToolUse` deny holds in every permission mode, including `bypassPermissions`.

### Re-inject context after compaction

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [{ "type": "command", "command": "echo 'Reminder: use Bun, not npm. Run bun test before committing.'" }]
      }
    ]
  }
}
```

Swap the `echo` for `git log --oneline -5` to inject recent commits. For context needed on
every start, use `CLAUDE.md` instead.

## Timeouts and limits

- Default timeout is 10 minutes for `command`, `http` and `mcp_tool` hooks, 30 seconds for
  `prompt`, 60 for `agent`; override per hook with `timeout` (seconds). `UserPromptSubmit`
  hooks default to 30 seconds. `SessionEnd` hooks share a 1.5-second budget.
- `Stop` hooks fire whenever Claude finishes responding, not only at task end. After eight
  consecutive blocks with no tool call between them, Claude Code overrides the hook; check
  `stop_hook_active` in the input and exit 0 when it is `true`.
- Command hooks can't call tools or `/` commands.

## Troubleshooting

- **Hook never fires:** `/hooks` must list it under the right event; check matcher case; check
  you chose `PreToolUse` vs `PostToolUse` correctly.
- **"hook error" in the transcript:** pipe sample JSON in by hand and read the exit code:
  `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./my-hook.sh; echo $?`. Use
  `$CLAUDE_PROJECT_DIR` or absolute paths for scripts, and `chmod +x` them.
- **`jq: command not found`:** install `jq` or parse the JSON in Python or Node.
- **JSON ignored, no error:** a shell profile that prints to stdout puts text before the `{`.
  Wrap those `echo` lines in `if [[ $- == *i* ]]; then ... fi`.
- **See what ran:** `Ctrl+O` opens the transcript; `claude --debug-file /tmp/claude.log` writes
  full hook exit codes and output.

## Sources

- [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide)
- [Hooks reference](https://code.claude.com/docs/en/hooks)
