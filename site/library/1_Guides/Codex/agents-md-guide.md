---
title: "📋 Codex AGENTS.md Guide"
tags: ["codex", "agents-md", "instructions", "configuration", "openai"]
category: "Agent_Guides"
subcategory: "Codex"
checked: 2026-11-18
repo: openai/codex
---

<!-- Last Updated: 2026-11-18 - Checked against developers.openai.com/codex/guides/agents-md -->

# Codex AGENTS.md Guide

`AGENTS.md` is how you give Codex standing instructions (build commands, conventions, review
rules) without repeating them in every prompt. This guide covers which files Codex loads, in
what order, and how to check it did.

## What Codex loads

Codex builds the instruction chain once per run (once per session in the TUI), from two scopes.

| Scope | Where | File used |
|:---|:---|:---|
| Global | `~/.codex` (`CODEX_HOME` moves it) | `AGENTS.override.md` if it exists, else `AGENTS.md`. Only the first non-empty file. |
| Project | Project root (usually the Git root) down to the current directory | In each directory: `AGENTS.override.md`, then `AGENTS.md`, then any `project_doc_fallback_filenames`. At most one file per directory. |

- No project root found: only the current directory is checked.
- Files are joined root first, separated by blank lines. Files nearer your working directory
  come later, so they override earlier guidance. Empty files are skipped.
- Put an override as close to the specialised work as possible, because the search stops at
  your current directory.

## Size cap

`project_doc_max_bytes` caps the combined size (default 32 KiB). Once it is reached Codex stops
adding files and later guidance is cut. Raise the cap or split instructions into nested
directories.

## Other filenames

Let Codex read a name your team already uses:

```toml
# ~/.codex/config.toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
project_doc_max_bytes = 65536
```

Each directory is then checked as `AGENTS.override.md`, `AGENTS.md`, `TEAM_GUIDE.md`,
`.agents.md`. Names not on the list are ignored. Restart Codex after editing.

## Check what loaded

```bash
# Global and root guidance
codex --ask-for-approval never "Summarize the current instructions."

# Nested overrides
codex --cd services/payments --ask-for-approval never "List the instruction sources you loaded."

# A separate Codex home
CODEX_HOME=$(pwd)/.codex codex exec "List active instruction sources"

# Plaintext TUI log
codex -c log_dir=./.codex-log
```

Then read `./.codex-log/codex-tui.log`. There is no cache: if instructions look stale, restart
Codex in the target directory.

## Troubleshooting

| Symptom | Fix |
|:---|:---|
| Nothing loads | Check you are in the right repo (`codex status` shows the workspace root) and the files are non-empty |
| Wrong guidance | Look for an `AGENTS.override.md` higher up the tree or in `~/.codex`; rename it to fall back to `AGENTS.md` |
| Fallback name ignored | Check the spelling in `project_doc_fallback_filenames`, then restart |
| Instructions cut off | Raise `project_doc_max_bytes` or split across nested directories |
| Odd global rules | `echo $CODEX_HOME`: a non-default value points Codex at another home |

## Source

- [Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md) (read 2026-11-18)
- [openai/codex](https://github.com/openai/codex)
