---
title: "🥧 Pi Coding Agent Guide"
tags: ["agent-guides", "pi", "cli", "extensions", "terminal"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: earendil-works/pi
---

<!-- Last Updated: 2026-11-18 - Checked against the repo README and packages/coding-agent/docs/cli.md and usage.md at 942842439e1f -->

# Pi Coding Agent Guide

## Overview
Pi is a minimal, extensible agent harness for the terminal. It ships with four default tools
(`read`, `bash`, `edit`, `write`) and skips features such as sub-agents and plan mode: you add
what you want with extensions, skills, prompt templates and themes, bundled as Pi packages and
shared through npm or git. This guide covers install, the four ways to run it, tool and model
selection, and sessions.

## Install
```bash
curl -fsSL https://pi.dev/install.sh | sh
```

On Windows:

```shell
powershell -c "irm https://pi.dev/install.ps1 | iex"
```

The installer pins all dependencies; update with `pi update`. To install with npm instead (it
does not pin transitive dependencies):

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Pi needs Node.js 22.19 or newer. Run `pi` in the project folder, then `/login` to connect a
subscription or API key.

## Run modes
```sh
pi                                              # interactive terminal UI
pi --print "Summarize this repository"          # one run, final text to stdout
git diff | pi --print "Review this change"      # piped stdin joins the first prompt
pi --mode json "Inspect this repository" > events.jsonl
pi --mode rpc                                   # JSONL commands on stdin, events on stdout
```

| Option | Behavior |
|---|---|
| `-p`, `--print` | Run the prompts, write the final assistant text, exit |
| `--mode json` | Write JSONL events to stdout, exit |
| `--mode rpc` | Read JSONL commands from stdin until shutdown (rejects `@file` arguments) |
| `--export <input> [output]` | Export a session file to HTML |

`@path` adds a text file or image to the first prompt; `--` stops option parsing so a prompt can
begin with `-`. There is also a TypeScript SDK for building apps on Pi.

## Models
```sh
pi --model sonnet:high
pi --list-models claude
```

- `--model <pattern>`: exact ID or fuzzy match, `provider/id` accepted, optional `:<thinking>` suffix.
- `--provider <name>`: restrict `--model` lookup to one provider (requires `--model`).
- `--thinking <level>`: `off`, `minimal`, `low`, `medium`, `high`, `xhigh` or `max`; clamped to the model's capabilities.
- `--models <patterns>`: comma-separated scope for startup and cycling.
- `--api-key <key>`: non-persistent key override (requires a model chosen with `--model` or `--models`).

## Tools
Defaults are `read`, `bash`, `edit` and `write`. The built-ins also include `powershell`
(Windows), `grep`, `find` and `ls`.

```sh
pi --tools read,grep,find,ls --print "Review this project"   # read-only allowlist
pi --tools +codemode,-write                                  # adjust the default set
```

- `-t`, `--tools <list>`: plain names replace the whole selection; a list of only `+name` / `-name` entries edits the defaults. The two forms can't be mixed.
- `-xt`, `--exclude-tools <list>`: disable by name or pattern (`'mcp__*'` removes MCP tools).
- `-nbt`, `--no-builtin-tools` and `-nt`, `--no-tools`.

Two built-in extensions are off by default: `codemode` (runs JavaScript in a QuickJS sandbox that
calls the other tools, so only its output reaches the model) and `tool_search`. Turn them on with
`"defaultTools": ["+codemode"]` in `~/.pi/agent/settings.json` or a project's `.pi/settings.json`.

## Sessions
```sh
pi --continue            # most recent session in this folder
pi --resume              # pick a session
pi --fork <path|id>      # branch a session into the current folder
pi --no-session          # in-memory only
```

Inside Pi: `/new`, `/resume`, `/name`, `/session`, `/tree`, `/fork`, `/clone`, `/compact`,
`/export`, `/share`. Prefix a line with `!` to run a shell command and send its output to the
model, or `!!` to run it without sending the output.

## Extend it
- `-e`, `--extension <path>` loads an extension (repeatable); `builtin:mcp` is the built-in MCP support, `--no-mcp` turns it off.
- `--skill <path>`, `--prompt-template <path>`, `--theme <path>` load those resources for one run.
- `pi install <source>`, `pi remove <source>`, `pi list` manage Pi packages.
- `AGENTS.md` and `CLAUDE.md` are discovered as context files; `-nc` disables that.

## Safety
Pi has no built-in permission system and does not ask before each tool call: it runs with your
user's permissions. For untrusted or unattended work, run it in a container or sandbox (the repo
documents a Gondolin micro-VM extension, plain Docker and OpenShell). `/share` and `/debug`
output can contain prompts, file contents and credentials: review it first.

## Sources
- https://github.com/earendil-works/pi (README)
- https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/cli.md
- https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/usage.md
