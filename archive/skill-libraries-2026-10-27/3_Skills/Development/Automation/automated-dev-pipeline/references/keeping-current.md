# Keeping repos current

A repo that nobody touches goes stale. Its dependencies fall behind, its platforms deprecate
the APIs it calls, its CI actions age out, and the standards it was written to move on. This
is the part of the pipeline that never finishes. It applies to every repo you point it at,
not just the ones the build stages created.

## Contents

- What goes stale
- Four mechanisms, cheapest first
- The refresh session
- Merge rules for currency PRs
- Cadence
- Anti-patterns

## What goes stale

| Kind | Examples | Usually caught by |
|:---|:---|:---|
| **Dependencies and runtimes** | Outdated packages, a runtime version past end of life, lockfile drift | Dependabot or Renovate, plus CI |
| **Security** | Advisories on a dependency, a leaked-secret pattern, a control switched off | Dependabot alerts, secret scanning, the security wrapper's weekly read-back |
| **Platforms and APIs** | A deprecated endpoint, a changed rate limit, a new auth requirement, a renamed model | A refresh session reading release notes and changelogs |
| **Tooling and CI** | Deprecated GitHub Actions versions, a linter rule set that moved, a build tool's new default | CI warnings, then a refresh session |
| **Standards and practice** | Accessibility guidelines, docs conventions, API design norms, a better testing pattern | A refresh or review session with cited sources |
| **The repo's own docs** | README commands that no longer run, badges and counts that drifted, dead links | The upkeep job |
| **The pipeline itself** | Model names in prompts, a CLI flag the runner uses, the scheduler's settings | The audit, and a refresh of the pipeline's own skills |

## Four mechanisms, cheapest first

Use the cheapest one that catches each kind of drift. An AI session is the most expensive
and the least repeatable, so it gets only what the tools can't do.

1. **Tools that already do it.** Dependabot or Renovate for version bumps, CI for "does it
   still build", GitHub's secret scanning and push protection. Turn them on through the
   security wrapper so they're read back, not assumed. Their PRs go through the same sweep
   under their own branch prefix, with a merge rule like "patch and minor bumps merge when
   CI is green; majors are held".
2. **The upkeep job reports.** Once a week it checks what's measurable across every repo:
   main is green, controls are on, no PR is stuck, docs match reality, every task still
   runs. It fixes only a short allow-list (a homepage URL, a count) and reports the rest.
   Reporting is the point. Drift nobody sees never gets fixed.
3. **A refresh session per repo or workspace.** Research first, then fix, in one PR (design
   rule 7). This handles platforms, APIs, tooling and standards. See below.
4. **The roadmap routine.** Anything too big for a refresh PR (a major upgrade, a migration,
   a redesign to a new standard) becomes a roadmap item. The routine that builds new
   features then does the work one verified step at a time. The refresh session is allowed
   to *add* such items; it doesn't attempt them.

## The refresh session

One session per repo (or per group of repos that share a field), on a schedule. Two steps,
in this order:

**1. Record what changed, with sources.** Search for changes since the last refresh in the
things this repo depends on: its dependencies' release notes, its platforms' changelogs and
deprecation notices, advisories, and the standards it follows. Write them to a dated intel
file in the repo (for example `docs/intel/<yyyy-MM-dd>.md`), one entry per change:

```markdown
- **<what changed>** (<date of the change>). <one line on what it means for this repo>.
  Source: <url>. Action: <fixed in this PR | roadmap item added | none needed>
```

Keep only changes with a primary source: a release note, an advisory, a spec, an official
changelog. A blog post saying "X is deprecated" is a lead, not a source. Follow it back.

**2. Fix what that intel makes stale, and nothing else.** Every edit in the PR traces to an
entry in the intel file. Small, safe fixes go in the PR: a pinned action version, a renamed
config key, a docs correction, a skill or prompt that names an outdated model. Anything that
changes behaviour, needs a migration, or would fail the repo's tests goes to the roadmap as
a new item instead.

Then open one PR with the intel file, the fixes and any new roadmap items. A week with no
relevant changes is a valid outcome: write "no changes found since <date>" and open no PR.

The runner injects today's date into the prompt. Without it, a session's sense of "latest"
is its training cutoff, and it will "update" things to versions that are already old.

## Merge rules for currency PRs

Give each kind its own branch prefix so the sweep can apply a path-based rule:

| Prefix | Merge when | Hold when |
|:---|:---|:---|
| Dependency bot | Patch or minor, CI green | Major version, or any failing check |
| Refresh | Every change is inside the intel folder, docs, and the repo's skills or prompts, and each has a source | It touches source code, CI config, a public contract (API, CLI flags, config schema), or deletes or renames anything |
| Review (periodic, hand-curated content) | Each change cites a source and stays inside the reviewed files | It adds, renames or removes an item, or restructures |

A held PR is fine. The refresh still did its job by writing the change down, and a person
decides the rest.

## Cadence

Match cadence to how fast the field moves, not to a round number:

| Field | Refresh |
|:---|:---|
| Security (advisories, exploited-vulnerability lists) | Weekly |
| Fast-moving platforms (AI models and APIs, frontend frameworks) | Weekly |
| Most libraries and tooling | Every two weeks or monthly |
| Standards, hand-curated content, reference docs | Monthly or quarterly |

Schedule each refresh so its PR is waiting when the sweep runs, and before anything that
consumes its output. For example, a refresh that fixes shared skills should merge before the
job that copies those skills elsewhere.

## Anti-patterns

- **"Update everything to latest."** Without sources and without the tests passing, that's a
  model guessing what "latest" means.
- **Two jobs on one repo and topic**, like an intel job and a separate fix job. They collide
  on `main` and double the PRs. Make them one session.
- **A refresh that attempts a major migration.** It won't fit in one verified PR. Add a
  roadmap item and let the routine do it in steps.
- **Refreshing repos nobody reads the output of.** If the PRs pile up held and unread, cut
  the cadence or the scope before adding more jobs.
- **Forgetting the pipeline itself.** Its prompts name models, CLI flags and paths too.
  They go stale the same way, and nothing else is watching them.
