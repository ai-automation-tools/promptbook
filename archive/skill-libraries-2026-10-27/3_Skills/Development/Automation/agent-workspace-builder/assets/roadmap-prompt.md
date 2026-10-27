# Weekly roadmap: ⟨workspace⟩ (`⟨owner/repo⟩`)

You are running unattended, once a week. Nobody will answer questions mid-run. Complete the
next roadmap item an agent can finish and verify, update the records it makes untrue, tick
it, and open a PR. A week with nothing workable is a valid outcome: open no PR and say why.

## 1. Orient

Read AGENTS.md (the doctrine), `docs/ROADMAP.md`, README.md, `docs/README.md`,
`.claude/settings.md`, `.github/workflows/ci.yml`, then the files the item touches.

## 2. Pick

Walk `docs/ROADMAP.md` top to bottom: the Go-live gates first, then what's below
`## After go-live` in order. Take the first `- [ ]` item that:

- isn't marked `🔒 Needs ⟨owner⟩` (only money, credentials, going public, outward actions
  and permission changes are; a lock on anything else is a mislabel: propose instead);
- isn't waiting on a proposal in `docs/operations/OPEN-QUESTIONS.md` whose `Proceeds` date
  hasn't come (one whose date has passed with no answer is decided: apply its default);
- isn't upkeep work (`docs/intel/`, `skills/`, `docs/reference/RESOURCES.md`, routine
  `.claude/` drift fixes belong to the upkeep job);
- isn't already claimed by an open PR (`gh pr list --state open`, and check its branch's
  roadmap for `- [-]` or `- [x]`).

Check it against the repo first: if it's already done, tick it with a dated note and take the
next. An item tagged `small` can be batched with up to three more `small` items from the same
section; an untagged item is one per run. Keep a list of what you skipped and why.

If the item needs a judgment call AGENTS.md's *Standing defaults* don't settle (which real
target, which option), don't stop at a question: add a proposal with `- Default:` and
`- Proceeds:` (seven days out) to `docs/operations/OPEN-QUESTIONS.md`, skip the item, and
take the next. A gate measured by a script (`python scripts/usage.py --check`) is ticked when
the script passes, with its output in the note.

## 3. Claim, build, verify

Flip the item to `- [-]` with a dated run note before writing anything. Build it following
AGENTS.md. A new doc goes in a `docs/` subfolder with a row in `docs/README.md`, never at the
docs root. Then run everything CI runs: `check-structure.py`, `validate-skills.py --strict`,
the capability generator's `--check`, `check-links.py`, `gen-vendor-configs.py --check`, and
the repo's tests.
⟨workspace-specific verify commands⟩. **If anything fails, open no PR**: revert, set the item
back to `[ ]` (or `[!]` with the reason), and say what blocked you. Never weaken a check.

## 4. Record

Update everything the change made untrue (README, `docs/README.md`, AGENTS.md, regenerate
CAPABILITIES and `python scripts/gen-vendor-configs.py` if `.claude/` or `.mcp.json` changed). Tick the item `- [x] … done <date>: <what, where>` in
the same commit as its `docs/CHANGELOG.md` line. Never move or rename roadmap sections.

## 5. Ship

Push the run's branch and open a PR against ⟨deploy-branch⟩. The body: the item(s) and what
you built, what you ran with results, which records you updated, anything needing a manual
check, what you skipped and why, and what to review first. Don't merge.
