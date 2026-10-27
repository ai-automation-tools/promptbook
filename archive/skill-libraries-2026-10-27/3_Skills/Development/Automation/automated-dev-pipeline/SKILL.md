---
title: "💻 automated-dev-pipeline"
name: automated-dev-pipeline
description: Design, stand up, audit, or operate scheduled AI agents that do development work unattended. They turn ideas into plans, build them one roadmap item at a time through PRs that a single sweep reviews and merges, publish only through scripted gates plus a human approval, and keep every repo current. Covers both repo-per-project pipelines and the single-repo variant, where stages are folders and a merge that deploys a site is the publish step. Use whenever the user wants to automate building, publishing or maintaining repos; add or change a scheduled coding routine or pipeline stage; set up where ideas come from; keep repos from going stale; audit scheduled Claude jobs for cost, overlap or safety; decide what to script versus leave to a model; or put an approval step in front of anything irreversible. Also use when they mention incubate or graduate, PIPELINE.md, release gates, a roadmap routine, a PR sweep, or ask "why didn't the pipeline do X".
tags: ["skill","development","automation","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/core/automation/automated-dev-pipeline/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Automated dev pipeline

A pattern for letting scheduled, unattended AI sessions do development work: start new
projects, build them, publish them to GitHub, and keep every repo current afterwards. No
human is in the loop **except at the one step that can't be undone**, which is making a
repo public. It came out of running a real GitHub organization this way. Every design rule
below exists because breaking it cost something.

The pattern does three jobs. They can be adopted separately:

| Job | Stages | What you get |
|:---|:---|:---|
| **Build** | ideate → incubate → roadmap routine → PR sweep | Ideas become private repos that grow one verified PR at a time |
| **Publish** | graduate (scripted gates → approval → public) | A finished project goes public on a personal account or an organization, with its security controls verified |
| **Keep current** | refresh, review, upkeep, and the same roadmap routines | Every repo, new or old, keeps up with its dependencies, platforms, security practice and standards |

The publish target is a parameter: a personal account works the same as an organization.
"The landing page" is then your profile README or portfolio site, if you keep one.

**Not every pipeline makes repos.** In the other common shape, a design library, a docs site or a
content collection, the stages are **folders inside one repo** (`ideas/ → planning/ →
in-progress/ → live/`), and publishing means a merge to a branch that deploys a public site.
The design rules apply unchanged, but incubate and graduate don't exist. See "The single-repo
variant" in `references/architecture.md`.

Read this file first. Then open the reference that matches the job. **Read both references before
writing a stage prompt.** Most of what goes wrong on a first build is already written down there.

| Job | Read |
|:---|:---|
| Stand up a new pipeline, or add a stage or routine | `references/architecture.md`, then `references/stage-contracts.md` |
| Build stages as folders inside one repo, with a site that deploys on merge | `references/architecture.md` → "The single-repo variant" |
| Decide where ideas come from, or connect a new idea source | `references/idea-sourcing.md` |
| Keep existing repos current, or bring a stale one back up to date | `references/keeping-current.md` |
| Audit an existing fleet (cost, overlap, safety, drift) | `references/audit-checklist.md` |
| Operate or debug a live pipeline | That pipeline's own operator notes: file paths, parameter values, run commands. The reference implementation keeps them at `~/.claude/routines/jobs/_org-pipeline/reference-implementation.md`. If none exist, write them before changing anything |

## The loop

```
ideas ──ideate──▶ approved plan ──incubate──▶ private repo + weekly roadmap routine
                                                  │  1 feature or ≤4 small/run → PR
                                                  ▼
                                    PR sweep (review + merge, 2x/week)
                                                  │  all release gates ticked?
                                                  ▼
                  scripted gates ──▶ approval email + issue ──▶ human closes as Completed
                                                  │
                                                  ▼
                   public + security re-verified ──▶ landing page, records
                                                  │
                                                  ▼
         keep current: refresh + review + upkeep ──▶ PRs into the same sweep
```

The full flow, as swimlanes for build, merge gate, publish, the owner's decisions and
keep-current, is drawn in [`pipeline-flow.svg`](pipeline-flow.svg) beside this file. Show
it to the user when they want the whole picture at once.

Keeping current never ends. A published repo keeps its roadmap routine, and the refresh
and upkeep jobs cover every repo, including ones that never went through the build stages.
You can point the pipeline at repos you already have and use only that part.

## Design rules

Each rule is here because the reference implementation paid for learning it.

1. **Scripts decide, prompts judge.** Anything with a yes/no answer (open PRs, commit
   emails, a secret scan, CI status, an HTTP 200, a count of unchecked boxes) goes in a
   script with an exit code. The model gets the work that needs judgment: writing, review,
   picking the next item. A checklist inside a prompt is a request, not a guarantee.
   The merge gate splits the same way: the sweep session reviews and writes
   `APPROVE: owner/repo#N`, `gh pr merge` stays denied to it, and the runner re-runs every
   gate and merges what still passes. Turn this on after one sweep has run on any new gates
   alone, so you can tell a gate's holds from the model's.
2. **Irreversible means human.** Making a repo public can't be undone: it gets cloned,
   cached and indexed within minutes. A script runs the gates, then asks for approval on a
   GitHub issue plus an email. It flips visibility only after the issue is closed as
   Completed, and re-runs the gates right before the flip. The model is told never to
   touch that issue or change visibility. **A merge to a branch that deploys a public site is
   the same kind of step.** Hold any PR that touches the published paths (for example
   `live/`, or the site folder) with a path gate in the sweep's runner, so a person's merge
   is what publishes. Everything else can still merge on its own.
3. **Every write is read back.** A `200` isn't proof. `gh repo create` doesn't turn on
   secret scanning or push protection by itself (and doesn't inherit an organization's
   defaults), and a visibility change can silently turn controls off. So repo creation and
   every visibility change go through a wrapper that enables the controls and reads them
   back in the same command, and exits non-zero if one is still off. Settings a stage
   changes later (automated security-fix PRs at publish, a homepage URL) go through the
   same wrapper with the same read-back, never through a prompt calling the API.
4. **Only PRs reach default branches, through one merge gate.** Every routine opens a PR on
   a known branch prefix. One sweep (the strongest model you run) reviews them against
   per-prefix rules, and its runner merges (rule 1). New prefixes are registered in the sweep config, and the
   upkeep job reads that list instead of keeping its own copy. **One exception:** stages that
   feed each other inside one repo may *share* a prefix. The runner adopts the oldest open
   PR on a prefix and appends to it, so the week's stages chain on one branch with no merge
   in between. A repo whose routines need different merge policies gets per-repo prefixes in
   the sweep config (see `references/stage-contracts.md`).
5. **Check for work before starting a session.** A cheap deterministic check decides
   whether a stage has anything to do. With nothing to do, it logs `SKIPPED: <reason>` and
   exits 0, with no AI session and, on daily jobs, no email. If the check itself errors,
   it runs the session anyway, and the prompt applies the same checks.
6. **Match cadence to throughput.** Don't produce what the next stage can't absorb. Plans
   should be generated only when the backlog runs low, and incubation needs a cap. Merge
   frequency limits build speed: one sweep a week means one PR a week, so let a PR close
   up to six small docs-or-config gates instead of one (`stage-contracts.md`), and sweep
   incubating repos every morning so each roadmap PR lands before the next run. **Graduate
   at the MVP**: the release gates are the smallest slice that delivers the core promise
   (at most three features) plus the publish checks, the rest builds in public after
   release, and incubate ships the boilerplate gates (CI, `SECURITY.md`, demo shell, secret
   scan, an `.env.example`) itself. Every repo the pipeline builds reads its settings from a
   gitignored `.env` and commits the names in `.env.example`; never OS-level user
   environment variables, which don't travel with a clone and leak into every child process. A project that waits for its whole build plan holds a cap slot for months.
   Cadence should follow demand, not the calendar.
7. **One session, one PR, per repo per cycle.** Jobs that touch the same repo on the same
   topic (research on what changed, and the fixes it calls for) are one session and one
   PR, not two jobs that coordinate through `main`.
8. **One ledger, one schedule table.** Pipeline state lives in one markdown ledger that
   every stage reads first and writes last. Each schedule is written down in one place,
   fact-checked weekly against live state. Every other doc links to it. Prompts never
   hand-edit counts or badges, because a recount job does that from the live source.
9. **Make stalls loud.** A gate that only a human can clear, a project with no merged
   progress in 21 days, or a task that stopped firing gets listed every week until it's
   resolved. A capped slot held by a stuck project is a silent deadlock otherwise.
10. **Every currency change cites its source.** A refresh that says "updated to the latest
    version" without a link is a guess. Each change names the release note, advisory or
    standard behind it, so the sweep can check it and a reader can trust it.
11. **Deny what an unattended session must never touch.** Headless runs usually start with
    permissions bypassed, which makes every MCP server in the repo's config callable. That
    includes a printer, a robot, a smart-home bridge, or a live desktop app such as an open
    Blender or browser session. Keep one fleet-wide deny file and have **every** runner pass
    it to the session with `--settings` (it's honoured even under bypass, and it reaches
    stages and sweeps that have no worktree). Cover every tool that acts on hardware, on a
    live user session, or on anything else a person has to confirm, plus the GitHub writes
    that skip the merge gate or change a repo's exposure (merge, repo create/delete/edit
    visibility, closing issues, force-push). Deny the whole server when no job needs it. A
    job that needs one rule lifted names that exact rule in its config, and the runner
    passes a filtered copy. If the file is missing, the runner fails rather than start an
    unprotected session. A job's own worktree settings can add more denies on top.
12. **A run that did nothing because it broke is a failure, never a quiet week.** Judge the
    outcome by the session's exit code as well as by commits and PRs. A platform error
    (`API Error: 529`) ends a session with exit 1 and no work. A runner that only counts
    commits mails that as a quiet week. Retry once on a platform error (5xx or 429), and
    only if the failed attempt wrote nothing (no commit, no merge, no write-capable tool
    call), then report `failed`. That goes for sweeps too: a crashed sweep session is a
    failed run, not a week of holds. Count caps from the ledger, never per run ("1 per week" written as "promote 1"
    lets manual re-runs promote 5 in 6 days).
13. **Close the feedback loop in the runner, not in each prompt.** A run that ends in an
    email and a pruned text log teaches the next run nothing. These pieces, mostly in the runner,
    so no job has to remember them:
    - **Run history.** Every run appends a `start` and an `end` record to one JSONL file:
      status and minutes at least, and wherever the runner reads the session's stream,
      turns, cost, tool-error count, API error, PR. A `start` with no `end` is a run that
      died silently, which no email will ever tell you about.
    - **Shared runtime traps.** One file of platform pitfalls is prepended to every prompt.
      A session that hits a new one reports a `TRAP:` line, and the runner saves it in the
      run record. The periodic audit's runner hands it every `TRAP:` line since the file
      last changed, and the audit has to promote, fold or reject each one in its PR, so
      promotion can't be skipped.
    - **Review comments read back.** A run that continues an open PR reads the PR's
      comments first, and a sweep HOLD or a comment from the owner is its first item.
      Without this, held PRs keep collecting new work while the hold reason goes unread.
    - **Lessons per job.** Each job keeps a short lessons file that goes on top of its
      prompt. A session that learned something job-specific ends with `LESSON: <sentence>`,
      and the runner saves it, deduplicated, newest first, capped near 20. The runner only
      adds and trims; the owner edits. Platform pitfalls stay `TRAP:` lines.
    - **The owner's corrections read back.** Before a run, list the base-branch commits
      that touched the files of the job's last few merged PRs and did not come from a fleet
      branch (build that prefix list from the job and sweep configs, never by hand, or every
      new job's merges read as corrections), and show their diffs. That is the owner fixing
      what a run did. The run keeps
      the fix and turns it into a lesson. PRs closed unmerged are listed as rejected.
    - **Park what only the owner can move.** An item whose open work all waits on the
      owner, with no progress for a set number of days, leaves the active stage so it stops
      holding a capped slot. Keep anything prepended to a prompt short: the lessons file
      is trimmed to its cap. The run history is read by scripts, not prompts, so it can grow;
      if a session ever has to read it, give it a window, not the whole file.
    - **Humans approve prompt changes, by pull request.** Keep the prompts and runners in
      a git repo of their own. A periodic audit reads the run history, the traps, the
      lessons and the hold comments, and opens one PR of evidence-backed prompt edits on
      that repo. It never merges it or edits the live copy, because self-edited prompts
      drift; the owner merges, and the daily sync pulls the merge into the live folder.
    - **Let the fleet propose its own next job, behind the same merge.** Once the loop
      above runs, a weekly improver stage can go one step further than prompt edits: one
      change a week to the fleet itself, either enhancing a job, adding one, or smoothing
      the path from idea to public repo. It gathers evidence first (the upkeep report, the
      run history, sweep holds, lessons), and every candidate needs two cited signals, a
      stated cost in weekly sessions, a free slot that fits the sweep order, and an
      enhancement beats a new job (rule 7). It opens one PR on the config repo, with the
      schedule-table row in the same diff, and skips its session while that PR is open. It
      never loosens a deny rule, hold path, publish gate or approval. Start with the owner
      merging every proposal. Once a few have landed clean, the owner can let the
      **runner** merge them (rule 1, never the session): right branch and title,
      mergeable, allowed commit authors, every changed config and script parses, no job
      deleted, and **no guard file touched**. Guard files are the deny list, the merge
      gates' runners and configs, the register scripts, the improver's own runner, prompt
      and config, and the publish stages. Those PRs wait for the owner, so the improver
      can never auto-merge a change to its own limits. After a merge the runner pulls the
      live folder (clean and fast-forward only) and registers the changed jobs, skipping
      disabled ones. The **next** run rebuilds the fleet diagram and updates the docs
      that live outside the config repo, then leaves a `Follow-through:` comment on the
      merged PR as its ledger. A closed-unmerged PR is a rejection it doesn't re-propose.
    - **Open questions live in one file per repo.** A run that needs a decision adds it
      to `docs/OPEN-QUESTIONS.md` instead of repeating it in every PR body; the owner
      answers in the file, and the next run applies the answer first. A weekly upkeep
      report diffs against the last one, so a carried item never reads as new.
    - **One inbox email for everything that waits on the owner.** Per-run emails can go
      to labels, but a weekly digest with an inbox-only subject (such as
      `[Approval needed]`) lists the prompt PR, release approvals, PRs a sweep left open,
      PRs no sweep merges, unanswered questions, parked items and silent deaths. Send
      nothing in a week with nothing waiting, and say which checks failed rather than
      reporting them as empty.

## Parameters

Pick these before building anything, and write the chosen values into the pipeline's
operator notes so the next session doesn't have to rediscover them.

| Parameter | Decides |
|:---|:---|
| Publish target | A personal account or an organization, and where each local clone is filed (by its remote, not by its name) |
| Idea source + fit criteria | Where ideate reads candidates from (read-only, a stable ID per idea), and what makes an idea right for you. See `references/idea-sourcing.md` |
| Ledger path | The single state file |
| Runner + scheduler | How a stage launches a headless session, logs, and emails a summary (Task Scheduler, cron, CI schedules) |
| Security wrapper | The create-and-verify / re-verify script (rule 3) |
| Publish script | Gates → approval → flip → re-verify (rules 1–2) |
| Approval channel | Issue label + email transport, for release approvals and (optionally) plan approvals before incubation. Replies to a send-only email are never read, so approval is an issue state |
| Landing page | What graduation and upkeep keep in sync: an org site, a portfolio page, or none |
| Currency scope | Which repos the keep-current jobs cover, what "current" means for each (see `references/keeping-current.md`), and how often |
| Incubation cap, ideate threshold, score bar | Throughput limits (rule 6). The threshold counts plans awaiting approval as well as approved ones. A BUILD verdict below the score bar is written as rejected |
| Sweep days, model tiers | Speed and cost. A mid-tier model for research and writing, the strongest for merges and repo creation |
| Hold paths | Paths whose change a person must merge: the published folder, the deploying site, hand-curated areas. Enforced by the sweep's runner, not its prompt (rules 1–2). Hold deploy paths (deploy config, deploy workflows, the custom domain), not every workflow, or CI fixes stop merging |
| Commit email allow-list | Author and committer addresses allowed in a public repo's history. The publish script checks it once; the sweep runner checks it on every merge, because nothing else stops a personal address after the flip |
| Run history + traps file | Where the JSONL run history lives (outside any pruned log folder), and the one runtime-traps file every runner prepends (rule 13) |
| Notification routing | One sender display name per workflow, and one mail filter per name. Mail labels stack, so every existing catch-all filter that matches the sender domain or `[OK]`-style subjects needs the new name added to its exclusions, or the mail lands in two labels |

The RUN SUMMARY key for human-only work is `Needs <owner>`. Use the real person's name, as
in `Needs Alex`, so the email filter and the upkeep report can match it.

## Procedure: adding a stage or routine

1. Write down what it reads, what it writes, and which branch prefix its PRs use. If it
   shares a repo and topic with an existing job, extend that job instead (rule 7). A job
   that reads or writes a roadmap works to the roadmap standard that ships with the `repo-docs-builder`
   skill (its roadmap-standard reference); a repo whose roadmap isn't in that shape gets
   converted first, or the job sees no work.
2. Split its logic. The deterministic parts go in the runner's pre-check or a script
   (rules 1, 5), and the judgment goes in the prompt, following `references/stage-contracts.md`.
3. Register the branch prefix and its merge rule in the sweep config and the sweep prompt.
4. Pick a schedule slot that fits the sweep. Its PR should be waiting when the sweep
   runs, and whatever it feeds should run after the sweep.
5. Dry-run it with whatever the runner offers. The reference's roadmap-style runner has
   `-WhatIfClaude`, and its stage script has `-CheckOnly`. See "Runners and what
   they give you" in `references/architecture.md`, because the two don't offer the same
   contract. Clean up any worktree with the runner's cleanup command, then register it.
6. Add one row to the schedule table. Don't restate the row anywhere else.
7. Run it once for real, by hand, before trusting the schedule. Check the PR, the outcome
   email and its mail label, and that the run left no worktree or folder behind.

## Windows shell traps

These cost the most time on a first build, so they sit here rather than in a reference.
The ones that hit unattended sessions too belong in the runtime-traps file (rule 13), so
every prompt carries them:

- **Inline quoting in Git Bash is the most common session error.** Multi-line text, or
  text with quotes or backticks, inside a command fails with "unexpected EOF while looking
  for matching quote". Write the text to a file, then pass the file (`--body-file`,
  `git commit -F`).
- **Git Bash's `/tmp` is invisible to Windows `node` and `python`.** Give each run a Windows
  scratch folder through an environment variable, and delete it in the runner's `finally`.
- **`rm -rf` and compound `cd x && git` stall an unattended session** on a permission
  prompt nobody answers. Use `git rm` / `git mv`, `git -C <path>`, and leave scratch for
  the runner to delete.

- **Never write Windows paths through a bash heredoc or `python -c`.** The tool layer can
  collapse `\\` to `\`, and Python then reads `\3`, `\r`, `\U` as escapes. `\3D-Printer`
  became a control byte, and a `"C:\\Users"` string died as a truncated `\U` escape. Use a
  file-based editor, or write a script file first, then check for bytes below 32.
- **`re.sub` replacement strings interpret backslashes too.** Pass a function (`lambda m:
  text`) when the replacement contains a Windows path.
- **PowerShell 5.1 reads BOM-less `.ps1` files as ANSI.** Keep runners ASCII-only, or run
  them under `pwsh`.
- **Native stderr under `2>&1`** with `$ErrorActionPreference='Stop'` throws. Redirect it to `$null`.
- **`[string[]]` parameters misbind across `pwsh -File`.** Use them only inside a
  `-Command` string, or pass single strings.
- **A session whose working directory is inside a worktree** keeps that folder locked, so
  the teardown leaves an empty directory. Leave the folder before removing it, and expect
  the same from an MCP server process that outlived its session.

## Procedure: auditing

Follow `references/audit-checklist.md`. Write the result as two documents: the findings,
ranked P0–P3 with evidence, and a plain numbered next-steps list that says what to change,
where, and how you'll know it worked. People act on the second one.

## Anti-patterns

- **A model with the power to publish.** Visibility changes belong to a script behind an
  approval, never to a prompt instruction.
- **Every job merging its own PRs.** Merges go through one sweep, or review quality drifts
  job by job.
- **Refreshing without sources.** Version bumps and "best practice" edits with no link are
  how a stale model's training data ends up in your repos.
- **Building the whole pipeline at once.** Start with one repo, one roadmap routine and the
  sweep. Add ideate and graduate once that loop merges good PRs.
- **Adding a repo to a sweep whose prefix list is shared across repos.** If that repo also
  hosts routines whose PRs must wait for a person (facts about the physical world, version
  claims), the shared list sweeps them too. Give the repo its own prefixes, or its own sweep.
- **Holding publishes with prompt wording.** "Hold anything that touches the site" in a sweep
  prompt is a request. A path gate in the runner is a guarantee.
