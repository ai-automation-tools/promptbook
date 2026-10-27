# The two weekly automations

Every workspace gets exactly two scheduled jobs. Each is one unattended agent session that
opens at most one pull request per run on its own branch prefix. Neither merges. A review
sweep (or a person) merges.

| | Roadmap job | Upkeep job |
|:---|:---|:---|
| **Purpose** | Build: finish the next roadmap item | Keep current: make what exists accurate |
| **Reads** | `docs/ROADMAP.md`, AGENTS.md, the code | AGENTS.md, `docs/intel/`, `skills/`, `.claude/`, `docs/reference/RESOURCES.md` |
| **Writes** | Whatever the item needs, plus CHANGELOG and the tick | `docs/intel/`, `skills/`, `.claude/` (skills, agents, commands, rules; hooks and settings held), `docs/reference/RESOURCES.md`, `docs/reference/CAPABILITIES.md` (regenerated), CHANGELOG, new `🔭 Later` roadmap items |
| **Never touches** | `docs/intel/`, `skills/`, RESOURCES.md, `.claude/` unless the item is about it | Code, tests, work folders, existing roadmap items, visibility |
| **Branch prefix** | `roadmap/auto-<date>` | `workspace/refresh-<date>` (or `upkeep/auto-<date>` in a new fleet) |
| **Model** | Mid-tier for most fields | Mid-tier with web search |
| **No-op week** | Nothing workable → no PR, report what blocked | Nothing changed → no PR, report what was checked |

The split is the design: **upkeep proposes, roadmap builds.** An upkeep run that finds a
promising MCP server or a missing skill adds a roadmap item under `### 🔭 Later` with the
source link. A later roadmap run (or a person) builds it.

## Shared run contract

Both jobs, every run:

1. **Pre-check before the session.** A script decides whether there's work (an open item
   for roadmap; always true for upkeep, which is weekly research) and whether a previous
   PR from the same job is still open. If one is, the run appends to it instead of
   opening a second.
2. **Fresh worktree** cut from the deploy branch, on the job's branch, deleted afterwards.
3. **Deny list passed in.** The session runs with a fleet deny file: no merging, no repo
   create, delete or visibility change, no closing issues, no force-push, no tool that
   acts on hardware or a live desktop session.
4. **Verify before shipping.** Run the workspace's four checks
   (`check-structure.py`, `validate-skills.py --strict`, `gen-capabilities.py --check`,
   `check-links.py`), `gen-vendor-configs.py --check`, plus its tests. Any failure → no PR, leave the tree clean, report.
5. **PR body** names what changed, the sources behind each outside fact, what was run and
   its result, what was skipped and why, and what to review first.
6. **Report** a one-line outcome (`shipped`, `appended`, `quiet`, `failed`) to the run log
   and the notification channel. A crashed session is `failed`, never a quiet week.

## Upkeep job, in parts

One session, one PR, these parts in order, each its own commit:

1. **Intel.** Research what changed in the field since the newest dated entry. Primary
   sources only (advisories, changelogs, standards bodies, official blogs). Every entry
   cites a URL opened this run. Archive entries older than 90 days.
2. **Portable skills (`skills/`).** Fix any skill the new intel makes wrong. Deep-review
   one skill a week in rotation (the least recently changed), checking every tool, flag,
   version and URL it names against upstream docs.
3. **Wired config (`.claude/`).** The same two passes over `.claude/skills/`, `agents/`,
   `commands/` and `rules/`: drift fixes from intel, plus one rotation item a week
   (least recently changed file across all four). Keep frontmatter valid and names stable;
   never delete or rename one (a rename breaks muscle memory and other docs). Hooks,
   `settings.json` and `.mcp.json` only when intel shows they're wrong, and only as a
   held change a person merges. Regenerate `docs/reference/CAPABILITIES.md` and the other
   CLIs' config (`python scripts/gen-vendor-configs.py`) if anything here changed; never
   edit `.agents/`, `.codex/` or `OTHER-CLIS.md` by hand.
4. **Resources (`docs/reference/RESOURCES.md`).** Re-open every link (or a rotating third
   of a long list), update descriptions that drifted, retire dead or superseded ones with
   a reason, and add up to five new high-quality resources found during this run's
   research: official docs and standards, tools and CLIs, MCP servers, published skills
   and agent configs, learning material. Score each candidate on relevance, maintenance
   (a release or commit in the last year), trust (first-party or known author) and
   licence. Bump `Last updated`.
5. **Proposals.** For any candidate worth wiring in (a skill to adopt, an MCP server to
   add, a gap no skill covers), add one `- [ ]` item under `### 🔭 Later` in
   `docs/ROADMAP.md` with the source link and why. Don't install it.
6. **Standard conformance.** Run the four checks. Fix doc drift they find (a broken link,
   a stale generated file). Structural fixes beyond that become roadmap items.

**Don't manufacture edits.** Every change has a source URL or a repo fact behind it.
Bumping dates or rewording for its own sake is churn.

## Autonomy: proceed unless vetoed

Every question to the owner stalls a job for a week. So the default is to decide, write the
decision down, and let the owner object, not to ask. Only these wait for an answer:

1. **Spending money.**
2. **Accounts, keys or credentials** (creating them, or anything that needs one the owner hasn't put in `.env`).
3. **Making anything public** (a repo, a site, a package, a post).
4. **Real-world or outward actions**: posting, emailing, publishing, or scanning or testing a system that isn't a sandbox (a security engagement needs signed authorization).
5. **Widening what an agent may do**: `.claude/settings.json`, hooks, a new MCP server or tool permission.

In the roadmap, `🔒 Needs <owner>` marks only those. Anything else that needs a judgment
call becomes a **proposal** in `docs/operations/OPEN-QUESTIONS.md`:

```markdown
### <the decision, one line>
- Asked: 2026-10-20 by <job>
- Context: why it matters, the options
- Default: exactly what will happen
- Proceeds: 2026-10-27
- Answer:
```

The job skips the item that run. On the first run on or after the `Proceeds` date with the
Answer still empty, the job applies the default and moves the entry to `## Answered` with
`- Applied: <date> by <job> (default, no veto)`. Any answer the owner writes wins. A weekly
digest lists true questions and pending proposals separately, so the owner reads one email
and acts only when they disagree.

**Measured gates, not opinions.** "The owner says it's in daily use" becomes
`python scripts/usage.py --check --min-days 10` (active days in the last 30, from local
session logs; job worktrees don't count). "Both jobs ran and their PRs were read" ticks
when the review sweep has merged one PR from each job.

**Real targets.** A gate that needs real work (a study, an app, a brief) is workable when
AGENTS.md's *Standing defaults* say what a job may pick on its own (public data, the
owner's own repos, public-domain material); the job proposes its pick with a `Proceeds`
date, then builds it. A target that touches someone else's system, money or audience
stays one of the five.

## Hold paths

A merge gate (the sweep's runner, or branch protection plus CODEOWNERS) holds any PR that
touches these for a person, whichever job opened it:

```text
.claude/settings.json
.claude/hooks/*
.mcp.json
.codex/rules/*  .codex/hooks.json  .codex/config.toml   (generated, but they change
.agents/mcp_config.json                                  what other CLIs may do)
.github/workflows/*   (optional: hold only deploy workflows if CI fixes should flow)
```

Put the hold in the gate's code or config, not in a prompt. "Don't merge hook changes"
in a sweep prompt is a request; a path gate is a guarantee.

## Scheduling

- **Spread the roadmap jobs** across the week (one workspace per evening) so each PR is
  reviewed before the next lands.
- **Run upkeep for all workspaces in one orchestrated slot**, one session per workspace
  in sequence, each isolated so one failure doesn't stop the rest. Give each session a
  deadline (60–90 minutes) and the orchestrator the sum plus margin.
- **Upkeep lands before the sweep that merges skills onward**, so a fixed skill reaches
  any downstream mirror the same week.
- One schedule table, kept by the scheduler's docs. The workspace's AGENTS.md names the
  jobs and their prefixes, never their times.

## Setting a job up

1. Fill `assets/roadmap-prompt.md` and `assets/upkeep-prompt.md` for the workspace: field,
   sources to watch, intel files, hold paths, verify commands, house voice.
2. Register the job with the scheduler and its branch prefix with the merge sweep.
   An unregistered prefix means PRs pile up unmerged with no error.
3. Dry-run: build the worktree and print the session command without spending a session.
4. Run once for real, by hand. Read the PR, the outcome report, and confirm no worktree
   was left behind. Only then trust the schedule.

## Going public: an optional release job

A workspace says where it's headed in one place, the heading that splits its roadmap:
`## After public release` means it goes public once every gate above it is ticked;
`## After go-live` means it stays private. No ledger, no flag file: the release job reads
the heading on the deploy branch.

The last roadmap phase of a workspace headed public is `## 🚦 Public release`, and it
carries the release prep as gates the roadmap job can finish: a `LICENSE`, a README that
works for a stranger from a fresh clone (no owner-only paths, private repos or jobs taken
for granted, `.env.example` names only, and a line saying it also works with Codex, opencode
and Antigravity that links `docs/reference/OTHER-CLIS.md`), and a release dry run of the
scripted gates.

A **release job** (daily is fine; a pre-check makes idle days free) then does what the
roadmap job must never do, in this order:

1. **Script, not model, runs the hard gates**: no open PRs, every commit email on an
   allow-list, a full-history secret scan that fails closed when the scanner is missing,
   no local paths in tracked files, green CI on the deploy branch's head.
2. **The owner approves on an issue** (plus an email): closing it as completed approves,
   as not planned rejects. The script re-runs the gates before acting on an approval.
3. **The script flips visibility** and re-applies the security controls a visibility
   change can silently turn off (secret scanning, push protection, Dependabot alerts),
   reading each one back.
4. **Only then a session** does the follow-up: repo topics, security updates, a dependency
   bot config by PR, the listing on the org's site, and the records.

A model never changes visibility, never touches the approval issue, and a gate that fails
on history (an email, a secret) goes to the owner, because history is never rewritten.

## Running without a local scheduler

GitHub Actions can host the schedule, but Actions doesn't supply the agent: the job needs
an agent CLI on the runner, an API key or token in repository secrets, and a budget for
pay-per-use tokens. Use `workflow_dispatch` plus a `schedule:` cron, `concurrency:` with
`cancel-in-progress: false`, `permissions: contents: write, pull-requests: write` and
nothing more, and the same deny list via the CLI's settings flag. Committed workflow YAML
is not a working automation until a run has opened a PR.
