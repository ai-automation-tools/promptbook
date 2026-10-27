# The workspace standard, file by file

Every rule here is checked either by `scripts/check-structure.py` (marked **[checked]**) or by
review. A rule nobody checks is a suggestion, so the checked ones are the ones that matter most.

## Root

| File | Contract |
|:---|:---|
| `README.md` **[checked]** | House-style root README (the `repo-docs-builder` skill): hero header, what the workspace is for, the failure mode it targets, quick start, a table linking `docs/README.md`, `docs/reference/CAPABILITIES.md`, `docs/reference/RESOURCES.md`, `skills/README.md`, AGENTS.md. No hand-typed counts: link CAPABILITIES instead |
| `AGENTS.md` **[checked]** | The doctrine. Vendor-neutral: Codex, opencode, Antigravity and others read this file by name. Sections below |
| `CLAUDE.md` **[checked]** | A bare `@AGENTS.md` line, plus only what applies to Claude Code alone (a note on `.claude/` hooks, say). Over 60 lines warns |
| `SECURITY.md` **[checked]** | Short: how to report a problem privately, what the workspace's guardrails are (deny rules, hooks, scope gates), and that secrets never go in the repo. From `assets/SECURITY.md` |
| `LICENSE` | When the repo is or may become public. Private workspaces can skip it |
| `.env.example` **[checked]** | Every secret or setting the workspace reads, one `NAME=` per line with a comment saying what it's for and where to get it. Names only: a `*KEY*`, `*TOKEN*`, `*SECRET*` or `*PASSWORD*` name with a value fails the check, and so does a `${VAR}` in `.mcp.json` that isn't listed. From `assets/env.example` |
| `.env` | The real values. Gitignored, never committed, never read by an agent's Read tool (deny it in `settings.json`). Scripts load it with `scripts/envfile.py`; MCP servers that need a value launch through `python scripts/envfile.py -- <command>`, since `${VAR}` in `.mcp.json` only sees the process environment |
| `.gitattributes`, `.gitignore` | LF for `.md`, `.py`, `.yml`; ignore `.env` and `.env.*` but keep `!.env.example` **[checked]**, `.venv/`, caches, `artifacts/`, `.claude/settings.local.json` |

### AGENTS.md sections, in order

1. **Title and one paragraph**: what the workspace is for and what it delivers.
2. **Branch workflow**: the working branch, the deploy branch, "ship by PR, never merge
   locally, never force-push".
3. **The one rule that matters**: the field's characteristic LLM failure (inventing a
   market size, acting outside scope, claiming a test it never ran) and what is demanded
   instead. This is the reason the workspace exists; put it near the top.
4. **Working style**: how answers are shaped in this field.
5. **Layout**: a table of the work folders and what each holds.
6. **Guardrails**: what never happens without confirmation.
7. **Capabilities**: a pointer to `docs/reference/CAPABILITIES.md` and one line per
   wired skill group. Don't restate the generated table.
8. **Resources and intel**: check `docs/intel/` before version, pricing, threat or
   platform advice; `docs/reference/RESOURCES.md` is the curated starting list.
9. **Automations**: which scheduled jobs write to this repo, their branch prefixes, and
   which paths each may touch (see `automations.md`). No schedules or local paths: those
   belong to the scheduler's own docs.
10. **Standing defaults**: the decisions a job may take without asking, written once so
    nobody asks again (visibility, what a job may pick as a real target, how third-party
    tools get adopted), plus the five things that always wait for the owner. See
    `automations.md`, *Autonomy*.

### CLAUDE.md shape

```markdown
<!-- AGENTS.md is the single source of truth. Keep the line below as a bare import:
     prose like "see AGENTS.md" loads only that sentence. Claude-only notes go under it. -->

@AGENTS.md
```

## `.claude/` (wired config)

| Path | Holds |
|:---|:---|
| `settings.json` **[checked]** | Permissions: deny destructive and outward-facing actions; ask for commits and pushes if the owner wants that; hooks registered here |
| `settings.md` | Why each allow, ask and deny is what it is. Read before fighting a prompt |
| `skills/<name>/SKILL.md` | The field's core methods. Validated by `validate-skills.py` |
| `agents/<name>.md` | At least one **read-only** reviewer whose job is to refute the workspace's own output |
| `commands/<name>.md` | One per repeatable deliverable, with `description` and `argument-hint` frontmatter |
| `rules/<name>.md` | Non-negotiables loaded as context (scope, confidentiality, immutability of originals) |
| `hooks/` | Scripts the settings register. Fail open with a warning, or fail closed for guards; say which in `settings.md` |

## `skills/` (portable)

Vendor-neutral `SKILL.md` folders that install into any agent CLI, plus `skills/README.md`
**[checked]**: a catalog table (skill, what it's for) and an install note. A portable
skill must not depend on this repo's paths. It is not loaded by this workspace's own
sessions unless someone installs it.

## `docs/`

| Path | Contract |
|:---|:---|
| `docs/README.md` **[checked]** | Index: one row per subfolder and per root document, each linked |
| `docs/ROADMAP.md` **[checked]** | The backlog, in the roadmap standard that ships with `repo-docs-builder` (phases, `- [ ]` items, a Go-live split, `🔒 Needs <owner>` for human-only items, `small` tags for batchable checks). The split heading is the visibility intent: `## After public release` for a workspace headed public (its last phase is `## 🚦 Public release`), `## After go-live` for one that stays private. See *Going public* in `automations.md` |
| `docs/CHANGELOG.md` **[checked]** | Newest first, dated; a ticked roadmap item and its changelog line land in the same commit |
| *nothing else* **[checked]** | No other file sits directly in `docs/` |
| `docs/reference/CAPABILITIES.md` **[checked]** | Generated by `scripts/gen-capabilities.py`. Never hand-edited; CI runs `--check` |
| `docs/reference/OTHER-CLIS.md` **[checked]** | Generated by `scripts/gen-vendor-configs.py`: what Codex and Antigravity get, and every guardrail that doesn't carry over, per CLI. Never hand-edited |
| `docs/reference/RESOURCES.md` **[checked]** | Curated resource list, format below |
| `docs/reference/<other>.md` | Durable reference: attributions, glossaries, field references |
| `docs/intel/README.md` **[checked]** | Index of the intel files. Each intel file: newest-first dated entries with **What**, **Why it matters here**, **Source** (URL + retrieved date); entries older than 90 days move to `docs/intel/archive/<yyyy>-Q<n>.md` |
| `docs/<topic>/` | Anything else: `methodology/`, `guides/`, `plans/`, `development/`, `operations/` (open questions, runbooks) |

### RESOURCES.md format

```markdown
# 🔗 Resources: <field>

> Curated starting points for agents and people working in this field. Every link was
> opened on the date in its row. Kept current by the weekly upkeep run, which re-checks
> links, retires dead ones and adds what's new. Last updated: YYYY-MM-DD.

## 📘 Official docs and standards
| Resource | What it's for | Source | Verified |
|:---|:---|:---|:---|
| [Name](https://…) | one line: when an agent should reach for it | first-party | YYYY-MM-DD |

## 🛠️ Tools and CLIs
## 🔌 MCP servers and APIs
## 🧩 Skills, agents and prompts
## 📚 Learning and community
## 🪦 Retired
| Resource | Why it left | Date |
```

- **Source** is `first-party` (the vendor, a standards body, the maintainer's own repo) or
  `community`. Community entries need a reason to trust them: maintained in the last
  year, real adoption, a known author.
- **Cap around 60 rows.** A long list nobody reads is a junk drawer. Add the better
  resource, retire the weaker one.
- **Retire, don't delete.** A dead or superseded link moves to Retired with the reason,
  so the next run doesn't re-add it.
- **Never a download link, an install script, or anything you'd have to run to evaluate.**

## Other agent CLIs (generated)

`.claude/` and `.mcp.json` are the only setup anyone edits. `scripts/gen-vendor-configs.py`
derives the rest, and CI fails when it's stale:

| Generated | For | From |
|:---|:---|:---|
| `.agents/skills/` | Codex and Antigravity (one shared copy) | `.claude/skills/` |
| `.agents/rules/` (with `trigger: always_on`) and `.agents/mcp_config.json` | Antigravity | `.claude/rules/`, `.mcp.json` |
| `.codex/rules/workspace.rules`, `.codex/hooks.json`, `.codex/config.toml`, `.codex/agents/` | Codex | Bash allow/ask/deny, `PreToolUse` Bash hooks, `.mcp.json`, `.claude/agents/` |
| `docs/reference/OTHER-CLIS.md` | People and agents | Everything that didn't map |

AGENTS.md carries a short *Other agent CLIs* section pointing at `OTHER-CLIS.md` (from
`assets/AGENTS.md`). The generated permission files are held paths: they change what another
CLI may do. Codex loads a project's `.codex/` only after the user trusts it, which is
a per-user setting, never something the repo does. opencode needs nothing generated: it
reads `AGENTS.md` by name. Gemini CLI is no longer a target; the generator still owns
`.gemini/` and `.geminiignore` so the next run deletes what an older version wrote.

## `scripts/` and CI

All seven from this skill's `scripts/` (the four checks, `gen-vendor-configs.py`, `envfile.py` and `usage.py`), unchanged except
a workspace-specific capability generator if the workspace has one. `ci.yml` (from `assets/ci.yml`) runs on push to the
working and deploy branches and on PRs:

```text
python scripts/check-structure.py
python scripts/validate-skills.py --strict
python scripts/gen-capabilities.py --check
python scripts/check-links.py
python scripts/gen-vendor-configs.py --check
every scripts/*.py that has a --self-check
```

Pin action versions (`actions/checkout@v4` or a SHA), give the workflow
`permissions: contents: read`, and never give CI a secret it doesn't use.
