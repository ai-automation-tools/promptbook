---
title: "🧩 Claude Agent SDK for Python Guide"
tags: ["claude", "agent-sdk", "python", "mcp", "hooks", "permissions", "anthropic"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: anthropics/claude-agent-sdk-python
---

<!-- Last Updated: 2026-11-18 - Checked against the repo README and code.claude.com/docs/en/agent-sdk -->

# Claude Agent SDK for Python Guide

The Claude Agent SDK (formerly the Claude Code SDK) gives you Claude Code's agent loop as a
Python library: Claude can read files, run commands and call your own tools, and you control
what it may do. This guide covers install, `query()`, `ClaudeSDKClient`, options, custom
tools, hooks and permissions.

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install claude-agent-sdk
```

Python 3.10+. The Claude Code CLI is bundled; pass `cli_path` in `ClaudeAgentOptions` to use a
different one.

## query() or ClaudeSDKClient

| | `query()` | `ClaudeSDKClient` |
|:---|:---|:---|
| Session | New one by default | Reuses the same session |
| Shape | Single exchange | Multi-turn conversation |
| Interrupts | No | Yes |
| Hooks, custom tools | Yes | Yes |
| Continue a chat | Manually, `continue_conversation` or `resume` | Automatic |

One-off task:

```python
import anyio
from claude_agent_sdk import query

async def main():
    async for message in query(prompt="What is 2 + 2?"):
        print(message)

anyio.run(main)
```

Conversation:

```python
async with ClaudeSDKClient(options=options) as client:
    await client.query("Greet Alice")
    async for msg in client.receive_response():
        print(msg)
```

## Options

`ClaudeAgentOptions` fields you will use most: `system_prompt`, `max_turns`, `allowed_tools`,
`disallowed_tools`, `permission_mode`, `mcp_servers`, `hooks`, `can_use_tool`, `cwd`, `model`,
`add_dirs`, `env`, `setting_sources`, `agents`, `resume`, `max_budget_usd`, `sandbox`.

```python
options = ClaudeAgentOptions(
    system_prompt="You are an expert Python developer",
    allowed_tools=["Read", "Write", "Bash"],
    permission_mode="acceptEdits",
    cwd="/path/to/project",
)
```

## Custom tools (in-process MCP)

```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

@tool("greet", "Greet a user", {"name": str})
async def greet_user(args):
    return {"content": [{"type": "text", "text": f"Hello, {args['name']}!"}]}

server = create_sdk_mcp_server(name="my-tools", version="1.0.0", tools=[greet_user])

options = ClaudeAgentOptions(
    mcp_servers={"tools": server},
    allowed_tools=["mcp__tools__greet"],
)
```

Tool names follow `mcp__<server key>__<tool>`. Input schemas can be a type mapping, a JSON Schema
dict or a `TypedDict`. SDK servers can sit beside external MCP servers in the same
`mcp_servers` dict.

## Permissions

| `permission_mode` | Behaviour |
|:---|:---|
| `default` | Calls needing approval go to `can_use_tool` |
| `acceptEdits` | File edits and `mkdir`, `rm`, `mv`, `cp` etc. inside the working dirs auto-approved |
| `plan` | Claude plans; edits go to your callback |
| `dontAsk` | Anything that would prompt is denied |
| `auto` | A model classifier reviews actions |
| `bypassPermissions` | No prompts (deny rules, ask rules and hooks still apply). Use with extreme caution |

Rules of thumb from the docs:

- `allowed_tools` auto-approves; it does not remove other tools. Use `disallowed_tools` to
  block (`["Bash"]` removes the tool; `["Bash(rm *)"]` denies matching calls in every mode).
- `allowed_tools=["Read"]` with `bypassPermissions` still approves `Bash`, `Write` and `Edit`.
- Locked-down agent: `allowed_tools=["Read", "Glob", "Grep"]` plus `permission_mode="dontAsk"`.
- `can_use_tool` only runs when a call falls through to a prompt; auto-approved calls skip it.
  Check those with a `PreToolUse` hook.
- Change mode mid-session with `await client.set_permission_mode("acceptEdits")`.

```python
from claude_agent_sdk.types import PermissionResultAllow, PermissionResultDeny, ToolPermissionContext

async def handler(tool_name: str, input_data: dict, context: ToolPermissionContext):
    if tool_name == "Write" and input_data.get("file_path", "").startswith("/system/"):
        return PermissionResultDeny(message="System directory write not allowed", interrupt=True)
    return PermissionResultAllow(updated_input=input_data)

options = ClaudeAgentOptions(can_use_tool=handler)
```

## Hooks

Hooks are Python callbacks `(input_data, tool_use_id, context)` returning a dict; `{}` allows.

```python
from claude_agent_sdk import ClaudeAgentOptions, HookMatcher

async def protect_env_files(input_data, tool_use_id, context):
    file_path = input_data["tool_input"].get("file_path", "")
    if file_path.split("/")[-1].lower() == ".env":
        return {
            "hookSpecificOutput": {
                "hookEventName": input_data["hook_event_name"],
                "permissionDecision": "deny",
                "permissionDecisionReason": "Cannot modify .env files",
            }
        }
    return {}

options = ClaudeAgentOptions(
    hooks={"PreToolUse": [HookMatcher(matcher="Write|Edit", hooks=[protect_env_files])]}
)
```

Python callback events: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`,
`Stop`, `SubagentStart`, `SubagentStop`, `PreCompact`, `PermissionRequest`, `Notification`.
`SessionStart` and `SessionEnd` are TypeScript-only as callbacks. `matcher` matches tool
names, not paths (a `Write|Edit` hook will not see a Bash write). Set
`on_failure="block"` on the matcher to block when a callback crashes (Python SDK v0.2.177+).
When hooks disagree on a `PreToolUse`, `deny` beats `defer` beats `ask` beats `allow`.

## Errors

From `claude_agent_sdk`: `ClaudeSDKError` (base), `CLINotFoundError`, `CLIConnectionError`,
`ProcessError` (has `exit_code`), `ResultError`, `CLIJSONDecodeError`.

## License note

The repo's SPDX is MIT, but the README says use of the SDK is governed by Anthropic's
Commercial Terms of Service. Read both.

**Sources**

- Repo README: https://github.com/anthropics/claude-agent-sdk-python
- Python SDK reference: https://code.claude.com/docs/en/agent-sdk/python
- Permissions: https://code.claude.com/docs/en/agent-sdk/permissions
- Hooks: https://code.claude.com/docs/en/agent-sdk/hooks
- Anthropic post, Building agents with the Claude Agent SDK: https://claude.com/blog/building-agents-with-the-claude-agent-sdk
