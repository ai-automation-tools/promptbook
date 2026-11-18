---
title: "🌱 GitHub Spec Kit Guide"
tags: ["agent-guides", "spec-kit", "github", "spec-driven-development", "workflow"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: github/spec-kit
---

<!-- Last Updated: 2026-11-18 - Checked against the repo README at 617e9a0a59df -->

# GitHub Spec Kit Guide

## Overview
Spec Kit is an open source toolkit that gives AI coding agents structured processes, reusable
templates and documented outcomes. The `specify` CLI sets a project up for your agent; the
processes themselves run as slash commands (skills) inside the agent's chat. Three processes
are ready-made: Spec-Driven Development (core), bug fixing and idea assessment (bundled
extensions).

## Install and start a project
Needs Python 3.11+, uv, and a supported coding agent on Linux, macOS or Windows.

```bash
uv tool install specify-cli
specify init my-project --integration copilot
cd my-project
```

`--integration` picks the agent (the README example uses `copilot`). Other agents and their
invocation syntax are listed in the docs' integrations page.

## Spec-Driven Development
Run these in the agent's chat, one at a time, reviewing each result. The constitution is once
per project; the rest repeat per feature. The syntax below is GitHub Copilot's default skills
syntax; other agents differ.

```text
/speckit-constitution Create principles focused on code quality, testing, and maintainability.
/speckit-specify Build a photo organizer with albums grouped by date and a tile preview of each album.
/speckit-plan Use Vite with vanilla JavaScript. Keep images local and store metadata in SQLite.
/speckit-tasks
/speckit-implement
/speckit-converge
```

Repeat implement and converge until convergence reports `Converged`.

## Bug fixing
```bash
specify extension add bug
```

```text
/speckit-bug-assess "Submitting an empty password crashes the login form." slug=login-crash
/speckit-bug-fix slug=login-crash
/speckit-bug-test slug=login-crash
```

Reports land in `.specify/bugs/<slug>/`. The verdict is `verified`, `partial` or `failed`; only
`verified` confirms the fix.

## Idea assessment
```bash
specify extension add assess
```

```text
/speckit-assess-intake "Let users work offline and sync when they reconnect." slug=offline-mode
/speckit-assess-research slug=offline-mode
/speckit-assess-define slug=offline-mode
/speckit-assess-shape slug=offline-mode
/speckit-assess-decide slug=offline-mode
```

Artifacts go to `.specify/assessments/<slug>/`; the decision is `go`, `needs-clarification` or
`kill`. Fix unknowns by editing the Markdown artifacts, not by rerunning whole stages. After a
`go`, pass the handoff summary in `decision.md` to `/speckit-specify`.

## Customize
| You want | Use |
|---|---|
| Add a command, quality gate or process | Extension |
| Adapt templates, terminology or methodology; enforce standards | Preset |
| Override a template for one project | Project-local override |
| Automate prompts, commands, gates and shell tasks | Workflow (overlays adapt one without forking) |
| Install a curated setup for a role or team | Bundle |
| Find community components | `specify extension search`, `specify preset search`, `specify workflow search`, `specify bundle search` |

Start with the smallest change that works. Catalog listings are not audits: read community
source before installing or running it.

## Sources
- https://github.com/github/spec-kit (README)
- https://github.github.io/spec-kit/ (docs linked from the README)
