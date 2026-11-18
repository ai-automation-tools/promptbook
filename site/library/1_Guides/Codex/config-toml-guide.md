---
title: "⚙️ Codex CLI config.toml Guide"
tags: ["codex", "openai", "config", "toml", "sandbox", "mcp", "profiles"]
category: "Agent_Guides"
subcategory: "Codex"
checked: 2026-11-18
repo: openai/codex
---

<!-- Last Updated: 2026-11-18 - Checked against the Codex config docs on learn.chatgpt.com -->

# Codex CLI config.toml Guide

How do you set Codex's model, approvals, sandbox, providers and MCP servers once, instead of
passing flags every run? In `config.toml`. This guide covers where the files live, which one
wins, and the keys you will change first.

## Where config lives

| File | Scope |
|:---|:---|
| `~/.codex/config.toml` | Your user defaults |
| `.codex/config.toml` in a repo or subfolder | Project settings, loaded only when you trust the project |
| `~/.codex/<name>.config.toml` | A profile, picked with `--profile <name>` |
| `/etc/codex/config.toml` | System config (Unix) |
| `requirements.toml` | Organization rules on managed machines; they constrain, config provides defaults |

## Precedence (highest first)

1. CLI flags and `-c` / `--config` overrides
2. Project `.codex/config.toml` files, root down to the current directory (closest wins; trusted projects only)
3. The profile file chosen with `--profile`
4. `~/.codex/config.toml`
5. Cloud-managed defaults
6. `/etc/codex/config.toml`
7. Built-in defaults

## The keys you will set first

```toml
# ~/.codex/config.toml
model = "gpt-6.1-sol"            # the docs' example model id
model_reasoning_effort = "medium"
approval_policy = "on-request"   # other documented values: "never", or { granular = { ... } }
sandbox_mode = "workspace-write" # or "danger-full-access"
web_search = "cached"            # "cached" (default), "indexed", "live", "disabled"
```

| Key | Notes |
|:---|:---|
| `approval_policy` | `untrusted` is retired and no longer supported |
| `sandbox_mode` | `danger-full-access` turns the sandbox off; only use it where the environment already isolates processes |
| `approvals_reviewer` | `"user"`, or `"auto_review"` for Auto-review |
| `allow_login_shell` | `false` disallows login shells for shell tools (hardening) |
| `log_dir` | Absolute path; also enables the opt-in plaintext `codex-tui.log` |

Tune the workspace-write sandbox:

```toml
[sandbox_workspace_write]
writable_roots = ["/Users/YOU/.pyenv/shims"]
network_access = false           # opt in to outbound network
exclude_slash_tmp = false
exclude_tmpdir_env_var = false
```

In `workspace-write` mode `.git/`, `.agents/`, `.codex/` and `.aws/` may stay read-only.

Keep secrets out of commands Codex runs:

```toml
[shell_environment_policy]
inherit = "core"                 # "none" or "core"
set = { MY_FLAG = "1" }

[shell_environment_policy.filters]
"AWS_*" = "exclude"
```

Do not mix the legacy `exclude` / `include_only` arrays with `filters` in one layer.

## Profiles

A profile is its own file, `~/.codex/<name>.config.toml`, with top-level keys. Codex loads
`config.toml` first and overlays the profile. Names may use letters, numbers, hyphens and underscores.

```toml
# ~/.codex/deep-review.config.toml
model = "gpt-6.1-sol"
model_reasoning_effort = "medium"
approval_policy = "on-request"
```

```bash
codex --profile deep-review
codex exec --profile deep-review "review this change"
```

Migration warning: from Codex 0.134.0, `--profile` no longer reads `[profiles.<name>]` tables
from `config.toml`, and the top-level `profile = "<name>"` selector is unsupported. Older
guides (including our [Codex CLI guide](codex_cli_guide.md)) that show `[profiles.x]` describe the old layout; move each
table into its own `<name>.config.toml` and delete the selector.

## Project config and trust

Codex walks from the project root (a directory with `.git` by default) to the current
directory and loads every `.codex/config.toml`. In an untrusted project it skips project config,
hooks and rules; user and system config still load. Relative paths resolve against the `.codex/`
folder holding the file.

```toml
project_root_markers = [".git", ".hg", ".sl"]   # [] = current directory is the root
```

Project files cannot set `openai_base_url`, `chatgpt_base_url`, `model_provider`, `model_providers`,
`notify`, `profile`, `profiles`, `otel` and a few others; Codex ignores them with a startup warning.

## Other model providers

Built-in ids are `openai`, `ollama`, `lmstudio`, `amazon-bedrock`, `amazon-bedrock-runtime`
and `gcp`; you cannot redefine them. Add your own with a `[model_providers.<id>]` table:

```toml
model_provider = "mistral"

[model_providers.mistral]
name = "Mistral"
base_url = "https://api.mistral.ai/v1"
env_key = "MISTRAL_API_KEY"
```

Other documented keys: `wire_api = "responses"`, `query_params`, `http_headers`,
`env_http_headers`, `request_max_retries`, `stream_max_retries`, `stream_idle_timeout_ms`, and a
`[model_providers.<id>.auth]` block (`command`, `args`, `timeout_ms`, `refresh_interval_ms`) for
command-backed tokens.

## MCP servers

Each server is a `[mcp_servers.<name>]` table, in user or trusted-project config.

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
env_vars = ["LOCAL_TOKEN"]

[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
startup_timeout_sec = 20        # default 10
tool_timeout_sec = 45           # default 60
enabled_tools = ["open"]
default_tools_approval_mode = "prompt"   # auto | prompt | writes | approve
```

STDIO servers take `command`, `args`, `env`, `env_vars`, `cwd`. HTTP servers take `url`, `auth`
(`oauth` default, or `chatgpt`), `bearer_token_env_var`, `http_headers`. Also `enabled`, `required`,
`disabled_tools` (applied after `enabled_tools`).

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
codex mcp list
codex mcp login <server-name>
codex --config mcp_servers.context7.enabled=false   # one-off disable
```

In the TUI, `/mcp` lists active servers.

## Feature flags and one-off overrides

```toml
[features]
memories = true      # off by default; goals, hooks, multi_agent, unified_exec default on
```

```bash
codex --enable memories
codex -c log_dir=./.codex-log
```

**Sources**

- [Config basics](https://learn.chatgpt.com/docs/config-file/config-basic)
- [Advanced config](https://learn.chatgpt.com/docs/config-file/config-advanced)
- [MCP](https://learn.chatgpt.com/docs/extend/mcp)
- [openai/codex releases](https://github.com/openai/codex/releases)
