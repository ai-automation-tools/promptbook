---
title: "🧠 Gemini CLI GEMINI.md Context Guide"
tags: ["gemini-cli", "gemini-md", "context", "memory", "instructions"]
category: "Agent_Guides"
subcategory: "Gemini_CLI"
checked: 2026-11-18
repo: google-gemini/gemini-cli
---

<!-- Last Updated: 2026-11-18 - Checked against github.com/google-gemini/gemini-cli docs/cli/gemini-md.md and docs/tools/memory.md -->

# Gemini CLI GEMINI.md Context Guide

Context files (default name `GEMINI.md`) hold instructions you would otherwise repeat in every prompt: project rules, a persona, a coding style. Gemini CLI concatenates every file it finds and sends the result with each prompt.

## Where context is loaded from

| Order | Source | Location | Scope |
|:---|:---|:---|:---|
| 1 | Global | `~/.gemini/GEMINI.md` | All your projects |
| 2 | Workspace | `GEMINI.md` in your workspace directories and their parent directories | The project you are in |
| 3 | Just-in-time | `GEMINI.md` in a directory (and its ancestors, up to a trusted root) that a tool touches | One component, loaded only when needed |

The CLI footer shows how many context files are loaded.

## Example file

```markdown
# Project: My TypeScript Library

## General Instructions

- When you generate new TypeScript code, follow the existing coding style.
- Ensure all new functions and classes have JSDoc comments.

## Coding Style

- Use 2 spaces for indentation.
- Always use strict equality (`===` and `!==`).
```

## Inspect and reload

| Command | What it does |
|:---|:---|
| `/memory show` | Prints the full concatenated context the model receives |
| `/memory reload` | Re-scans and reloads all `GEMINI.md` files |

Run `/memory show` first when the model ignores a rule: it shows exactly what was loaded.

## Split a large file with imports

Use `@file.md` inside a `GEMINI.md`. Relative and absolute paths both work.

```markdown
# Main GEMINI.md file

This is the main content.

@./components/instructions.md

@../shared/style-guide.md
```

The Memory Import Processor reference (`docs/reference/memport.md`) has the details.

## Use a different file name

Set `context.fileName` in `settings.json` to one name or a list:

```json
{
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"]
  }
}
```

## Saved memory

Gemini CLI can persist durable facts by editing Markdown memory files directly, using the `write_file` or `replace` tools. It routes each memory by kind:

| Kind of fact | Goes to |
|:---|:---|
| Shared project instructions | Repository `GEMINI.md` files |
| Private project notes | The per-project private memory folder |
| Cross-project personal preferences | `~/.gemini/GEMINI.md` |

Stored facts load automatically in later sessions through the same hierarchy. Keep entries concise and avoid repeating a fact across tiers.

## Related

- Ignoring files: `docs/cli/gemini-ignore.md`
- Custom commands: `docs/cli/custom-commands.md`
- Memory management tutorial: `docs/cli/tutorials/memory-management.md`

## Sources

- https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md
- https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/memory.md
