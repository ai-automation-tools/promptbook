# Audit checklist

Gather evidence before you conclude anything. Use live `schtasks /query /fo CSV /v` (not
`Get-ScheduledTask`, which misses tasks), the run logs (`= done: N turns, Ns, cost $X` lines),
`git log` on the repos, the sweep config, the ledger, and the run history (rule 13), if the
fleet keeps one. A doc's description of a
schedule is a claim to verify, not evidence.

## 1. Safety (P0 if any fails)

- [ ] Repo creation goes through the security wrapper, not plain `gh repo create`
- [ ] Every visibility change is followed by a security re-verify
- [ ] The public flip is decided by a script with exit codes, not by a prompt checklist
- [ ] A human approval stands between "gates pass" and "public"
- [ ] The secret scanner is installed, scans all refs, and fails closed when missing
- [ ] Commit-identity gate: only the approved public email or noreply addresses. Check that squash-merge authors pass too
- [ ] No model prompt can change visibility or close the approval issue (a stated rule, plus a deny rule if possible)
- [ ] Every MCP server reachable from an unattended session has been reviewed. Anything that acts on hardware, a live user session or a live system is in the fleet deny file, every runner (stages and sweeps included) passes it, and a dry run's log shows the file and any per-job exceptions
- [ ] The sweep session cannot merge: `gh pr merge` is denied and the runner merges approved PRs after re-running every gate
- [ ] A merge that deploys a public site is held by a runner-level path gate (`holdPaths`), not by prompt wording. The gate was tested against a PR that should trip it
- [ ] No sweep's shared prefix list catches another routine's PRs in the same repo that must wait for a person. Check per-target `branchPrefixes`

## 2. Waste

- [ ] Count sessions per week per job. Does each one usually have work? If not, add a pre-check
- [ ] Is upstream production (ideate) throttled to downstream capacity (the incubation cap × graduation time)?
- [ ] Are two jobs touching the same repo on the same topic? Merge them into one session and one PR
- [ ] Does the merge gate spend its expensive model on PRs a path rule could decide?
- [ ] Do daily jobs stay quiet on a skip?
- [ ] Does a weekly report total the fleet's spend per job (from the log cost lines), with the change from last week?

## 3. Throughput

- [ ] How many sweeps a week? That's the ceiling on items per project per week
- [ ] Is each consumer scheduled after the sweep that merges its input?
- [ ] Estimate the weeks to graduate: open gates ÷ items per week. Is it acceptable?

## 4. Stall detection

- [ ] Are Needs-<owner> items above the gate line reported every week?
- [ ] Are projects with no merged roadmap PR in 21 days flagged as "unblock or retire"?
- [ ] Are PRs older than 10 days on any sweep prefix flagged? Does that list come from the sweep config?

## 5. Drift

- [ ] Is there one schedule table, with everything else linking to it?
- [ ] Do prompts avoid hand-editing counts and badges?
- [ ] grep every doc for each task's schedule and compare it with live `schtasks`
- [ ] Is every task Enabled, with a last result of 0 or never-run? Freshly re-registered tasks show never-run, which is expected
- [ ] Is a task whose Last Run Time is older than its interval plus a day flagged? A task that stops firing keeps its last result of 0, so the result code alone never catches it
- [ ] Is there a documented one-liner to pause and resume the whole fleet?

## 6. Currency

- [ ] Does every repo in scope have a dependency bot on, with its PRs going through the sweep under their own prefix?
- [ ] Does every repo have a refresh or review cadence, set by how fast its field moves?
- [ ] Does every change in a refresh PR cite a primary source? Sample three
- [ ] Are big upgrades going to the roadmap instead of being attempted in a refresh PR?
- [ ] Do the pipeline's own prompts name current models and flags?

## 7. Collisions

- [ ] Do long sessions share a start time?
- [ ] Are there two writers on one branch, for example a direct push to the landing page while its upkeep PR is open?
- [ ] Where stages share a branch prefix on purpose, can two of them ever run at once? `StartWhenAvailable` can shift a missed run onto another stage's slot
- [ ] Does each workflow's mail land under exactly one label? Labels stack, so a catch-all filter without an exclusion for the workflow's sender name double-files it

## 8. Feedback

- [ ] Does every runner write a `start` and an `end` record to one run history that isn't pruned with the logs? List each `start` with no `end`: those are silent deaths
- [ ] Is a non-zero session exit with no commits reported as `failed`? grep the logs for `API Error` beside a "quiet" outcome
- [ ] Which tool errors recur across runs (quoting, `/tmp`, refused deletes, oversized reads)? Is each one in the shared traps file?
- [ ] Do appending runs read the PR's comments first? Find a held PR and check whether the next run answered the hold
- [ ] Do caps count from the ledger, not per run? Count the ledger's moves per week against each cap
- [ ] Do the same open questions come back in PR bodies week after week? They need a file the owner answers once
- [ ] Does each repo's open-questions file have entries answered but never applied? The next run should apply them first
- [ ] Are the prompts and runners under version control, and does the audit's prompt-change PR get merged or closed within a month? An ignored PR means the digest isn't reaching the owner
- [ ] Does each repo's merge method match the sweep's? A mismatch holds every PR there forever
- [ ] Does each job have a lessons file in its prompt, and do runs actually emit `LESSON:` lines? A file that stays empty for a month means the prompt isn't asking
- [ ] After the owner edits a merged routine PR, does the next run of that job see the diff? Find a post-merge fix and check the next run's prompt or log
- [ ] Does any active-stage slot belong to an item waiting only on the owner? It should be parked
- [ ] Is every file a run reads first (changelog, ledger) under the read limit?

## Output

Write two files. `README.md` holds the findings: TL;DR, current inventory table, findings
ranked P0–P3 each with evidence and a fix, a keep-as-is list, and a remove/combine table.
`NEXT-STEPS.md` holds the plain numbered actions, each with **why / change / where / done
when**, grouped by when to do them, with a summary table at the end.
