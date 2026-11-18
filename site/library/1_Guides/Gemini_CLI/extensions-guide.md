---
title: "🧩 Gemini CLI Extensions Guide"
tags: ["gemini-cli", "extensions", "mcp", "gemini-md", "context"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
checked: 2026-11-18
repo: google-gemini/gemini-cli
---

<!-- Last Updated: 2026-11-18 - Checked against docs/extensions and docs/cli/gemini-md.md in google-gemini/gemini-cli -->

# Gemini CLI Extensions Guide

An extension packages prompts, MCP servers, custom commands, themes, hooks, sub-agents and
agent skills so they can be installed and shared. This guide covers installing and managing
extensions, what a `gemini-extension.json` can contain, and how GEMINI.md context fits in.
(For flags and slash commands see the other Gemini_CLI guides.)

## Install and manage

Management commands run in your terminal, not inside the interactive CLI. Inside a session,
`/extensions list` shows what is installed. Changes take effect after you restart the session.

```bash
gemini extensions install https://github.com/gemini-cli-extensions/workspace
gemini extensions list
gemini extensions update <name>        # or: gemini extensions update --all
gemini extensions disable <name> --scope workspace
gemini extensions enable <name> --scope user
gemini extensions uninstall <name...>
```

```bash
gemini extensions install <source> [--ref <ref>] [--auto-update] [--pre-release] [--consent] [--skip-settings]
```

| Flag | Meaning |
|:---|:---|
| `--ref` | Git branch, tag or commit to install |
| `--auto-update` | Update this extension automatically |
| `--pre-release` | Allow pre-release versions |
| `--consent` | Acknowledge security risks and skip the prompt |
| `--skip-settings` | Skip configuration at install |

Install copies the extension, so run `update` to pull source changes. GitHub installs need
`git`. Disable and enable take `--scope` of `user` or `workspace`. Extensions load from
`<home>/.gemini/extensions`. A gallery is at https://geminicli.com/extensions/browse/.

## Build one

```bash
gemini extensions new my-first-extension mcp-server   # templates include mcp-server, context, custom-commands
cd my-first-extension && npm install
gemini extensions link .                               # symlink for live development
```

Restart the session after linking.

## `gemini-extension.json`

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "description": "My awesome extension",
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${extensionPath}/my-server.js"],
      "cwd": "${extensionPath}"
    }
  },
  "contextFileName": "GEMINI.md",
  "excludeTools": ["run_shell_command(rm -rf)"]
}
```

| Key | Purpose |
|:---|:---|
| `name` | Lowercase, digits and dashes; should match the directory name |
| `mcpServers` | Servers loaded at startup like those in `settings.json`; on a name clash the `settings.json` one wins; every option except `trust` is supported |
| `contextFileName` | Context file to load; if unset, a `GEMINI.md` in the extension directory is still loaded |
| `excludeTools` | Tools to hide from the model, optionally command-specific |
| `settings` | Values asked at install (see below) |
| `themes`, `plan`, `migratedTo` | Custom themes, plan artifact directory, move to a new repo |

Variables usable in the manifest and `hooks/hooks.json`: `${extensionPath}`,
`${workspacePath}`, and `${/}` (the path separator). Use `command` and `args` separately.

Other parts live in folders of the extension: `commands/*.toml` (custom commands; the file
`commands/gcs/sync.toml` becomes `/gcs:sync`), `hooks/hooks.json` (not in the manifest),
`skills/<name>/SKILL.md`, `agents/*.md` (sub-agents, a preview feature) and `policies/*.toml`.
Extension commands have the lowest precedence; on a clash they are renamed like `/gcp.deploy`.
Extension policies cannot grant `allow` decisions or `yolo` mode.

### Settings and secrets

```json
"settings": [
  { "name": "API Key", "description": "Your API key for the service.",
    "envVar": "MY_API_KEY", "sensitive": true }
]
```

Users are asked at install. Values go in the extension's `.env`, or the system keychain when
`sensitive` is true. Update later with `gemini extensions config <name> [setting] [--scope <scope>]`.
Extensions and MCP servers do not inherit your shell environment: only safe variables (such as
`HOME`, `PATH`) plus variables declared in `settings` reach them.

## GEMINI.md context

GEMINI.md files are concatenated and sent with every prompt:

1. Global: `~/.gemini/GEMINI.md`
2. Workspace directories and their parents
3. Just-in-time: when a tool touches a file, its location and ancestors up to a trusted root

Pull in other files with `@./components/instructions.md` or `@../shared/style-guide.md`. In
`settings.json`, `context.fileName` takes a name or list, for example
`["AGENTS.md", "CONTEXT.md", "GEMINI.md"]`. `/memory show` prints the combined context and
`/memory reload` re-scans the files.

## Which feature to use

| Need | Use |
|:---|:---|
| Model can do new things | MCP server |
| Saved prompt you invoke | Custom command |
| Always-on instructions | Context file (GEMINI.md) |
| Occasional complex workflow | Agent skill |
| React to lifecycle events | Hooks |

**Sources**
- https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/index.md
- https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/reference.md
- https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/writing-extensions.md
- https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md
