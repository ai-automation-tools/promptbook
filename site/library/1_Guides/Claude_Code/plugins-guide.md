---
title: "🔌 Claude Code Plugins and Marketplaces Guide"
tags: ["claude-code", "plugins", "marketplace", "distribution", "skills"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-18
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-18 - Checked against code.claude.com/docs/en/plugins, plugins/create, plugins/install, plugin-marketplaces -->

# Claude Code Plugins and Marketplaces Guide

A plugin is a directory of skills, agents, hooks and MCP servers that Claude Code loads as one
unit. A marketplace is a catalog (`.claude-plugin/marketplace.json`) that lists plugins and where
to fetch them. This guide covers installing, building and publishing.

## Install a plugin

In a session, `/plugin` opens the panel (Discover, Installed, Marketplaces, Errors tabs).

```text
/plugin install commit-commands@claude-plugins-official
```

From your shell, without a session:

```bash
claude plugin install formatter@your-org --scope project
claude plugin disable formatter@your-org
claude plugin enable formatter@your-org
claude plugin uninstall formatter@your-org --scope project
claude plugin list
claude plugin update <plugin>@<marketplace>
```

Plugin skills appear as `/<plugin>:<skill>`. After installing, run `/reload-plugins` if the
summary says so.

## Install scopes

| Scope | Enabled for | Recorded in |
|:---|:---|:---|
| User (default) | You, every project | `enabledPlugins` in `~/.claude/settings.json` |
| Project | Everyone in the repo | `.claude/settings.json` (commit it) |
| Local | You, this repo only | `.claude/settings.local.json` |

Local overrides project, project overrides user. Committing a project-scope entry enables the
plugin for teammates but does not download it; each runs
`claude plugin install <name>@<marketplace> --scope project` once.

## Add a marketplace

| Source | Command |
|:---|:---|
| GitHub repo | `/plugin marketplace add owner/repo` (add `#ref` to pin a branch or tag) |
| Any git host | `/plugin marketplace add https://host/group/repo.git#v1.0.0` |
| Local directory or file | `/plugin marketplace add ./my-marketplace` |
| Hosted JSON | `/plugin marketplace add https://example.com/marketplace.json` |

The shell form is `claude plugin marketplace add`. To add and install in one step:
`claude plugin install deploy-helper --marketplace your-org/plugins`.

| Action | Shell | In a session |
|:---|:---|:---|
| List | `claude plugin marketplace list` | `/plugin marketplace list` |
| Refresh listing | `claude plugin marketplace update <name>` | `/plugin marketplace update <name>` |
| Remove (uninstalls its plugins) | `claude plugin marketplace remove <name>` | `/plugin marketplace remove <name>` |

Claude Code adds `claude-plugins-official` on first interactive start. Auto-update is on by
default for official marketplaces and off for third-party and local ones.

## Build a plugin

```text
my-first-plugin/
├── .claude-plugin/
│   └── plugin.json        (only the manifest goes here)
├── skills/hello/SKILL.md
├── agents/                (one Markdown file per subagent)
├── hooks/hooks.json       (top-level "hooks" key, same shape as in settings)
└── .mcp.json
```

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```

`name` is required, has no spaces, and prefixes every skill and agent (`/my-first-plugin:hello`).
`version` is optional; setting it keeps users on that version until you change it. Components saved
inside `.claude-plugin/` do not load. `commands/` is the older flat-file form; use `skills/` for new plugins.

## Test without a marketplace

```bash
claude plugin validate ./my-first-plugin          # add --strict to fail on warnings
claude --plugin-dir ./my-first-plugin             # one session; repeatable; accepts a .zip
claude --plugin-url https://example.com/p.zip     # fetch a .zip for one session
```

Run `/reload-plugins` after editing files. `claude plugin init my-tool` scaffolds a plugin under
`~/.claude/skills/` that loads in every session. `--plugin-dir` points at one plugin's folder,
not at a marketplace root.

## Create a marketplace

`.claude-plugin/marketplace.json` requires `name`, `owner` and a `plugins` array; each entry needs
`name` and `source`.

```json
{
  "name": "my-marketplace",
  "description": "Plugins for my team",
  "owner": { "name": "Your Name" },
  "plugins": [
    {
      "name": "my-first-plugin",
      "source": "./plugins/my-first-plugin",
      "description": "A greeting plugin to learn the basics"
    }
  ]
}
```

| Source | Value |
|:---|:---|
| Relative path (inside the marketplace) | `"./plugins/my-first-plugin"` |
| GitHub repo | `{ "source": "github", "repo": "your-org/my-first-plugin" }` |
| Subdirectory of a repo | `{ "source": "git-subdir", "url": "your-org/monorepo", "path": "tools/my-first-plugin" }` |

Other types: `url`, `archive`, `npm`, `command`. Rules that cause most failed installs: write
relative paths from the marketplace root (no `..`), and keep the entry `name` equal to the `name`
in `plugin.json`. Run `claude plugin validate ./my-marketplace` after every edit, then host it on
a git host; teammates run `claude plugin marketplace add <owner>/<repo>`.

A plugin runs code as you. Read hooks and MCP servers before installing from any marketplace.

## Sources

- https://code.claude.com/docs/en/plugins
- https://code.claude.com/docs/en/plugins/create
- https://code.claude.com/docs/en/plugins/install
- https://code.claude.com/docs/en/plugin-marketplaces
