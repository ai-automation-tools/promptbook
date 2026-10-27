# AGENTS.md: ⟨Workspace name⟩

⟨One paragraph: what this workspace is for, what it delivers, and what it never does.⟩

Ships from [`⟨owner/repo⟩`](https://github.com/⟨owner/repo⟩). This file is the doctrine for
every agent CLI; `CLAUDE.md` imports it. Inside a target repo with its own agent docs, that
repo's docs win on anything repo-specific.

## Branch workflow

**Work on `⟨working-branch⟩`. Never commit to `⟨deploy-branch⟩`.**

| Step | What |
|:---|:---|
| 1 | `git branch --show-current` must say `⟨working-branch⟩` before the first commit |
| 2 | Commit there, then `git push origin ⟨working-branch⟩` |
| 3 | `gh pr create --base ⟨deploy-branch⟩ --head ⟨working-branch⟩` |
| 4 | **Stop.** ⟨Owner⟩ merges the PR. |

Never merge into `⟨deploy-branch⟩` locally, never force-push.

## The one rule that matters

⟨The failure an LLM is most likely to commit in this field, stated plainly, and what is
demanded instead. Examples: "every number is sourced or tagged an assumption"; "no active
tooling without a signed scope"; "pasted output, or it's a hypothesis".⟩

## Working style

- ⟨How answers are shaped here: lead with the answer, show evidence, say "I don't know".⟩

## Layout

| Dir | Holds |
|:---|:---|
| ⟨`work-folder/`⟩ | ⟨what lives there, and the rule for it⟩ |
| `docs/` | Reference about the workspace, not the work: [docs index](docs/README.md) |
| `skills/` | Portable skills that install into any agent: [catalog](skills/README.md) |
| `.claude/` | The wired skills, agents, commands, rules and hooks this workspace's sessions load |

## Guardrails

- Never commit secrets, credentials or API keys. They go in `.env` (gitignored); `.env.example`
  lists the names. Scripts load it with `scripts/envfile.py`; never read `.env` yourself.
- ⟨Confirm before deleting anything in the record folders.⟩
- ⟨Field-specific never-dos.⟩

## Other agent CLIs

This workspace is built for Claude Code, and `scripts/gen-vendor-configs.py` generates what
it can for **Codex** (`.codex/`) and **Antigravity** (`.agents/`): the wired skills, MCP
servers, command rules and guard hooks.
**Not every guardrail carries over.** [`docs/reference/OTHER-CLIS.md`](docs/reference/OTHER-CLIS.md)
lists what doesn't, per CLI; read it before working here outside Claude Code. Codex loads
`.codex/` only after you trust the folder. To change any of it, edit `.claude/` or
`.mcp.json` and rerun the script; never edit the generated files.

## Capabilities

Every command, skill and agent, with what it does, is in
[`docs/reference/CAPABILITIES.md`](docs/reference/CAPABILITIES.md), generated from `.claude/`
and `skills/`. Prefer a command when one matches the job; otherwise describe the work and
the matching skill loads.

## Resources and intel

- [`docs/intel/`](docs/intel/README.md) is a dated, sourced log of what changed in this field.
  Check it before giving ⟨version / pricing / threat / platform⟩ advice.
- [`docs/reference/RESOURCES.md`](docs/reference/RESOURCES.md) is the curated list of docs,
  tools, MCP servers and skills for this field. Start there before searching the web.

## Automations

Two scheduled jobs open PRs here. Neither merges.

| Job | Branch | May change |
|:---|:---|:---|
| Weekly roadmap | `roadmap/auto-*` | What the next `docs/ROADMAP.md` item needs, plus CHANGELOG and the tick |
| Weekly upkeep | `⟨workspace/refresh-*⟩` | `docs/intel/`, `skills/`, `.claude/` skills, agents, commands and rules, `docs/reference/RESOURCES.md`, regenerated CAPABILITIES, new `🔭 Later` roadmap items |

Changes to `.claude/settings.json`, `.claude/hooks/` and `.mcp.json` are held for a person,
whichever job makes them.

## Standing defaults

Decisions a job takes without asking (it records each in `docs/operations/OPEN-QUESTIONS.md`
with a `Proceeds` date seven days out; ⟨owner⟩ can veto before then):

- **Visibility:** the repo stays ⟨private⟩.
- **Real targets:** ⟨what a job may pick on its own, e.g. a study on public data; one of the
  owner's own repos⟩.
- **Third-party skills, MCP servers and tools:** evaluated in a write-up first; adopted by a
  proposal, never installed silently. A change to `.mcp.json` still waits in its held PR.

**Only these wait for ⟨owner⟩'s answer:** spending money; accounts, keys or credentials;
making anything public; real-world or outward actions ⟨field-specific: posting, emailing,
scanning systems⟩; widening what an agent may do.
