# Architecture

## Contents

- Components
- The weekly rhythm
- State and contracts
- Runners and what they give you
- The single-repo variant
- Failure handling

## Components

Grouped by the three jobs in `SKILL.md`. The keep-current rows are the ones worth adopting
first if you already have repos; the build and publish rows only matter for new projects.

| Component | Kind | Does | Output |
|:---|:---|:---|:---|
| **Ideate** *(build)* | stage, mid-tier model | Picks one unanalysed idea, runs a business-plan skill with web research, and scores it 1–10. A BUILD at or above the score bar is `proposed`; the runner then opens a plan-approval issue and emails the owner, whose close moves the row to `planned` (Completed) or `rejected` (Not planned) | a plan folder + a ledger row (`proposed` or `rejected`) + an approval issue |
| **Incubate** *(build)* | stage, strongest model | Takes the top `planned` plan: local repo, docs, ROADMAP with release gates, private remote via the security wrapper, a roadmap routine (three runs a week while incubating), and a daily sweep target | a private repo + a registered task |
| **Roadmap routine** *(build, keep current)* | per repo, three times a week while incubating, weekly once public | Works the next unchecked ROADMAP item, or a batch of `small` ones (`stage-contracts.md`), in a throwaway worktree, verifies it (build/test/lint), ticks it, and opens a PR | a `roadmap/auto-<date>` PR |
| **PR sweep** *(all)* | strongest model, daily for incubating repos, 2x/week for the rest | Runner: updates a BEHIND branch, then hard gates (base, mergeable, checks, not draft, hold paths, commit emails). Session: a per-prefix review, `APPROVE` or a hold with a comment. Runner: re-gates and merges each approval | merged PRs + an email |
| **Graduate** *(publish)* | daily; publish script + mid-tier model | The script runs the gates, requests approval, and after approval flips to public and re-verifies security. The model then moves the folder, adds landing-page tiles and updates records | a public repo + site tiles |
| **Upkeep** *(keep current)* | mid-tier model, weekly | Syncs the landing page with what's published, by PR, sweeps security controls, fixes homepages, and flags red CI, stuck PRs, coverage gaps, thin runway, blocked gates and stalled projects | a dated report + an optional PR |
| **Harvest** *(keep current, optional)* | mid-tier model, weekly | For setups where agent workspaces share a skills library: mirrors portable skills byte for byte into it, with gates (tier, name collision, duplicate, secrets) | one `harvest/auto-*` PR |
| **Refresh** *(keep current)* | mid-tier model, weekly, one per repo or workspace | Records sourced changes in the repo's field, then fixes what they make stale (see `keeping-current.md`) | one `workspace/refresh-*` PR per workspace |
| **Periodic review** *(keep current)* | mid-tier model, monthly | Source-cited currency fixes to the shared library's hand-curated tiers | one `skills/monthly-review-*` PR |

## The weekly rhythm

The order is set by one fact: **a stage reads `origin/main`**, so whatever feeds it has to be
merged by a sweep that runs before it.

```
Mon  ideate (only if backlog < threshold; Thu too)  roadmap routines: 3 evenings each while incubating
Daily sweep 09:30, incubating repos only (every repo on Wed and Sun)
Tue  workspace refresh 22:00 ─┐
Wed  sweep 09:30 ◀────────────┘  (merges Mon/Tue roadmaps + refresh)
Sat  upkeep 18:00 (landing PR ready for Sunday)
Sun  harvest 08:00 → sweep 09:30 → incubate 12:00
Daily graduate 16:00 (skips silently unless something is ready or approved)
```

An incubating project runs its roadmap routine three evenings a week, and the sweep takes
incubating repos every morning (`fullSweepDays` plus a per-target `everyDay` flag in the
reference runner), so each PR is merged before the next run. If a run still finds the last
PR open, it appends to it (APPEND MODE), so the sweep reviews one PR per repo. Graduate
drops both back to the normal cadence.

Keep weekend-heavy jobs off the same slot. Two long sessions starting at the same time
compete for the same rate limit.

## State and contracts

- **Ledger** (`PIPELINE.md`): `| Slug | Source | Plan | Verdict | Score | Stage | Repo | Updated |`.
  Stages run `proposed → planned → incubating → public`, or `rejected`; `parked` takes an
  incubating project out of its capped slot. Every stage reads it first and writes it last. The pre-check parses it, so keep the column order fixed.
- **The roadmap format.** Every `docs/ROADMAP.md` a stage writes or a routine reads follows
  the `repo-docs-builder` skill's `references/roadmap-standard.md`: phases, the four checkbox
  markers, `— done YYYY-MM-DD` notes, and one go-live heading. Incubate copies its skeleton;
  a roadmap in any other shape reads as empty to the routine and the gate count.
- **The release-gate line.** Everything in `docs/ROADMAP.md` above the heading
  `## After public release` is a release gate. The count of open items (`[ ]`, `[-]`,
  `[!]`, including numbered forms) above that line has to reach 0. A missing heading is a
  contract break to report, never something to guess around. A project that will stay
  private uses `## After go-live` in the same place; a gate counter matches either heading.
- **The gates are the MVP, not the plan.** Above the line: the smallest set of build slices
  that delivers the core promise end to end (at most three features), then the publish
  checks (CI, README usage, `SECURITY.md` + secret scan, a live demo). Every other slice goes
  in a `## Next slices` phase below the line, and the roadmap routine keeps building it after
  release. Incubate ships the boilerplate gates itself and ticks them, so the first run
  starts on the product. The publish script's hard gates and the owner's approval don't
  change.
- **Item tags.** Incubate tags each open item when it writes the ROADMAP: `small` right
  after the checkbox (docs, config, assets that CI or a named command verifies), untagged
  for a feature, `🔒 Needs <owner>` for what only the owner can do. The roadmap routine
  takes one feature or up to six `small` items per run. The gate count ignores tags.
- **Approval**: a `release-approval` issue. Open means awaiting approval. Closed as
  Completed means approved. Closed as Not planned means rejected. Reopening re-queues it.
  The publish script's exit codes carry the state: 0 published, 1 held at a gate,
  10 awaiting, 11 rejected.
- **Branch prefixes**: every routine owns one. The sweep config's `branchPrefixes` is the
  master list, and anything else that needs the list reads it from there. Two refinements:
  a sweep target may carry **its own `branchPrefixes`**, which overrides the master list
  for that one repo, so a repo can host routines with different merge policies, or
  **`extraBranchPrefixes`**, which add to it (Dependabot, or a routine only that repo has).
  And chained stages inside one repo may share a prefix on purpose (see the single-repo variant).

## Runners and what they give you

The reference implementation has two runners, and a stage inherits whichever contract its
runner offers. Check before you write the prompt, because a prompt that assumes the other
runner's features silently does less than it says.

| | Roadmap-style runner (`Invoke-Routine.ps1`) | Stage script under the maintenance wrapper (`Invoke-OrgStage.ps1` run by `Invoke-Maintenance.ps1`) | Sweep runner (`Invoke-PrSweep.ps1`) |
|:---|:---|:---|:---|
| **Runs in** | A throwaway git worktree cut from `origin/<base>`, or from an open PR's branch in APPEND MODE | The stage script's own prompt, with no worktree unless the stage makes one | No worktree. `gh pr diff` and server-side merges |
| **Pre-check / skip** | None, deliberately: a quiet run ends early with no commits and costs a couple of minutes, which a pre-check wouldn't save | Yes: the stage script's pre-check prints `SKIPPED:`, and the wrapper stays quiet on it. Incubate parks stalled projects first | Yes: no candidates means no session |
| **Outcome signal** | The runner checks for itself whether a PR appeared or the branch tip moved | RUN SUMMARY lines in the output, matched by the wrapper's `warnOn` patterns; the stage's exit code | Re-queries the PRs after the session. A non-zero session exit is `failed` |
| **Merges** | Never | Never | The session, or with `runnerMerge` on, the runner: it reads `APPROVE:` lines, re-runs every gate, and merges. It also union-merges a changelog-only conflict and updates a BEHIND branch |
| **Date injection** | No. State the date in the prompt if research depends on it | Yes, the stage script prepends today's date and weekday | n/a |
| **Deny list (rule 11)** | Fleet file via `--settings`, minus the job's `denyExcept`, plus its own `settings.local.json` copied into the worktree | Fleet file via `--settings`; no stage lifts a rule | Fleet file via `--settings`; `gh pr merge` lifted only while `runnerMerge` is off |
| **Per-job hooks** | `link` (junction dirs, copy files), `postCreate` | The stage script itself | Gates, `autoResolve`, `runnerMerge`, `emailAllowList`; per target `allowedBases`, `branchPrefixes`, `extraBranchPrefixes`, `holdPaths`, `mergeMethod` |
| **Dry run** | `-WhatIfClaude`, then `-Cleanup` | `-CheckOnly` on the stage script. `-WhatIfChild` on the wrapper | `-WhatIfClaude` (no session). `-DryRun` runs the session but still posts comments |
| **Retry (rule 12)** | Once on 5xx/429 under 15 min, if nothing was committed | Once on 5xx/429 under 15 min, before any write-capable tool call | Once on 5xx/429 under 15 min, before any merge |
| **Feedback (rule 13)** | Run record with turns, cost, tool errors, API error, PR, `TRAP:` lines; traps file; lessons; owner corrections; open questions; PR comments read first in APPEND MODE | Run record from the wrapper (status, minutes, exit code); traps file; lessons per stage | Run record (minutes, turns, cost, merged count); traps file; lessons |

A stage that runs often, is often idle, and costs real time when idle belongs on a runner
with a pre-check (rule 5).

## The single-repo variant

Some pipelines never create a repo. They move **items through folders in one repo**, and a
merge to a deploying branch publishes them: a design library whose site reads `live/`, a
docs site, a content collection. The mapping:

| Repo-per-project | Single-repo variant |
|:---|:---|
| Ideate writes a scored plan | An import stage writes idea rows to an `ideas/` collection, deduped by source ID |
| Incubate creates a private repo | A plan-and-promote stage moves one item `planning/ → in-progress/` and writes its first source plus a per-item `ROADMAP.md` |
| Roadmap routine, one per repo | One build routine that takes **one item (or up to six `small` ones) per in-progress folder per run** |
| Release gates above a heading | A readiness **script** per item: roadmap done apart from `(Needs <owner>)`, verification recorded, source present |
| Graduate flips visibility after approval | A publish stage moves ready items to `live/` and regenerates the site data. **The human merge is the approval**, enforced by `holdPaths` on the published paths |
| Ledger row per project | Ledger row per run: what moved |

What changes because of it:

- **Share one branch prefix across the stages.** A stage can't read `origin/main` for the
  previous stage's work unless a sweep merged it in between. With a shared prefix, the
  runner's APPEND MODE puts the whole week on one branch: plan opens the PR, build appends,
  publish appends, and the sweep merges once. Separate worktrees per stage, but never let
  two stages run at once: git won't check out one branch in two worktrees.
- **The site is the irreversible step.** Hold every PR that touches the published folder or
  the site folder with a runner-level `holdPaths` gate. Ideas, planning and build progress
  merge on their own, and a person merges the weeks that publish.
- **Stage moves are real changes.** A folder move changes paths. The stage contract makes
  every mover fix links in and out, update the register or index, and write a changelog
  entry, and the sweep prompt checks for exactly that.
- **Human-only work is a roadmap tag, not a blocker.** Items that need a person (a physical
  test, a measurement, a licence read, a live desktop app) are marked `(Needs <owner>)`.
  The build routine skips them, the readiness script ignores them, and the PR body lists them.
- **Give the pipeline its own sweep** when its repo also hosts routines whose PRs must wait
  for a person. It can share the sweep runner and differ only in config and prompt.

## Failure handling

| Situation | Behaviour |
|:---|:---|
| Pre-check can't tell (git or gh error) | Run the session. The prompt re-checks |
| Gate fails on a ready project | Stay private. On the weekly slot, queue one roadmap fix item by PR, unless one is already open |
| Security wrapper fails after a create or flip | Stop that project and report it first under Needs <owner> |
| A roadmap run fails verification | No PR. Revert, restore the item, and state what blocked it |
| Stage session crashes | The runner exits non-zero, and the wrapper emails `failed` |
| Session exits non-zero with no work done (`API Error: 529`, `429`) | One retry after 2 minutes if it failed fast and wrote nothing, then `failed` with exit 1. Never `quiet`, and on a sweep never `held` |
| An incubating project's open gates all wait on the owner, no roadmap PR merged in 14 days, ledger row older than that | Incubate's runner parks it before the cap check: disables its roadmap task, sets the Stage to `parked`, logs a `PARKED:` line. Nothing is deleted. Unpark by hand: tick the item, set the Stage back, re-enable the task |
| A PR is BEHIND a base that requires up-to-date branches | The sweep runner runs `gh pr update-branch` and re-gates, instead of holding it for a person to press the same button |
| A sweep approves a PR, and by merge time it no longer passes a gate (a sibling's merge turned its changelog DIRTY) | The runner union-merges a changelog-only conflict and re-gates; anything else stays open for the next sweep |
| A run dies without reaching its outcome check (no exit line, no email) | Only the run history shows it: a `start` record with no `end`. The next run clears the stale lock |
| A sweep holds a PR | The comment is the next appending run's first item, because the APPEND MODE banner makes it read `gh pr view --comments` |
| A repo disallows the sweep's merge method | Set `mergeMethod` on that sweep target. Otherwise every PR there stays HOLD for a reason that has nothing to do with the diff |
| Clean skip on a daily job | No email (`quietOn: ["^SKIPPED:"]`) |
| A PR conflicts only on the changelog | The sweep runner merges the base in with git's `union` driver, keeping both entries, and re-gates. Any other conflicting file stays HOLD. This is the most common conflict, because every routine writes to the top of the same changelog section |
| An adopted branch no longer merges cleanly with base | The roadmap runner aborts the merge and runs on the stale branch, and the banner tells the session to stay clear of the overlap. It never resolves the conflict itself |
| A run leaves its worktree behind (`no-pr`) and the next stage shares its branch | The next stage fails loudly at `worktree add`. Clear it with the first job's `-Cleanup` |
| Teardown can't delete the run folder | Something still has it open: an MCP server process, or a session whose working directory is inside it. Git has already dropped the worktree, so remove the empty folder once the process is gone |
