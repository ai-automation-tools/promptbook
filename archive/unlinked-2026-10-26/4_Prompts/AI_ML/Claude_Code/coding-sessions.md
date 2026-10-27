---
title: "Prompt: Run Effective Agentic Coding Sessions"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Run Effective Agentic Coding Sessions

**Use when:** You want Claude Code to work autonomously on a feature, bug, or codebase task with minimal interruption — while staying safe and aligned.

---

## Prompt — Feature Implementation (Full Agentic)

```
Implement the following feature autonomously:

**Feature:** [clear description]
**Acceptance criteria:**
  1. [criterion 1 — testable]
  2. [criterion 2]
  3. [criterion 3]
**Files likely involved:** [list known files, or "explore and find them"]
**Tests required:** [yes — write tests first (TDD) | yes — write after | no]
**Definition of done:** All tests pass, linter clean, no TypeScript errors, CLAUDE.md updated

Before writing code:
1. Read CLAUDE.md and understand project conventions
2. Explore the relevant existing code
3. Output a plan: files to create/modify, approach, risks
4. Wait for my go-ahead (reply "go" to proceed)

While implementing:
- Commit after each logical unit of work (conventional commits format)
- Run tests after each commit
- Stop and ask if you encounter an unexpected design decision

When done:
- Run full test suite
- Run linter
- Summarize what was built and any decisions made
- Update CLAUDE.md if any new patterns were established
```

---

## Prompt — Bug Fix (Methodical)

```
Fix the following bug methodically. Do NOT guess.

**Bug description:** [exact symptom — what happens vs. what should happen]
**How to reproduce:** [steps or command to trigger it]
**Environment:** [relevant context — OS, version, config]
**Error output (if any):**
```
[paste error here]
```

Process:
1. Read all files that could plausibly be involved
2. Form a hypothesis (write it out before testing)
3. Test the hypothesis — add logging or read more code to confirm/deny
4. If confirmed: implement the fix
5. If denied: form a new hypothesis and repeat

Rules:
- Write the root cause as a comment before the fix: // FIX: [explanation]
- Add a regression test that would have caught this bug
- Do not refactor unrelated code while fixing
- If you find other bugs nearby, note them but do not fix them

Show me the root cause, the fix, and the regression test before committing.
```

---

## Prompt — Codebase Refactor (Safe)

```
Refactor the following with zero behavior change:

**Target:** [file, module, or pattern to refactor]
**Goal:** [e.g. "split 800-line file into modules", "replace callbacks with async/await", "extract shared utility functions"]
**Risk tolerance:** [low — very small incremental changes | medium | high — large restructuring OK]

Safety protocol:
1. Read all affected files first
2. Identify the public API surface (exported functions, types, events) — list it explicitly
3. Run existing tests to establish baseline: [test command]
4. Make changes in small, reversible increments
5. Run tests after each increment
6. Verify public API is unchanged at the end (diff the exports)
7. Do NOT change behavior, add features, or fix bugs during this refactor

If you encounter code that IS broken (not just ugly), note it in a REFACTOR-NOTES.md file but do not fix it now.

Commit message format: "refactor: [what was reorganized]"
```

---

## Prompt — Autonomous Research + Prototype

```
Research [TOPIC] and build a working prototype.

**Goal:** [what the prototype should demonstrate]
**Constraints:** [time budget (lines of code or complexity), dependencies allowed, target environment]
**Success metric:** [how to verify it works]

Phase 1 — Research (autonomous):
- Web search for current best practices and libraries
- Fetch relevant documentation
- Identify 2-3 implementation approaches
- Select the best approach with written rationale

Phase 2 — Present approach:
- Show me the selected approach and why
- List every file you'll create
- Estimate complexity
- Wait for approval before coding

Phase 3 — Implement:
- Build the prototype
- Add a simple test or demo script I can run to verify it
- Write a PROTOTYPE-README.md with: what it does, how to run it, limitations, next steps

Keep the prototype minimal — it proves the concept, it doesn't need to be production-ready.
```

---

## Prompt — Technical Debt Blitz

```
Run a focused technical debt reduction session on: [file, module, or "the whole project"]

**Time budget:** [e.g. "address the top 10 highest-impact issues"]
**Off-limits:** [any areas not to touch — e.g. "don't touch the auth module"]

Identify and categorize all debt:

Category A — Fix now (safe, high impact, low effort):
- Dead code, commented-out blocks
- Obvious naming issues
- Missing type annotations
- Duplicated logic (DRY violations)
- Unreachable error paths

Category B — Fix now if test coverage exists (moderate risk):
- Complex functions that should be broken up
- Inconsistent patterns
- Deprecated dependency usage

Category C — Document only (do not change):
- Architectural issues requiring design decisions
- Areas with no tests (too risky to change)
- Known hacks with external dependencies

For Category A and B items:
1. Show me each change before making it
2. Run tests after each change
3. Commit with message: "refactor(debt): [specific description]"

For Category C: write TECH-DEBT.md with each item, impact level, and recommended fix.
```

---

## Prompt — Session Kickoff Checklist

```
Before we start this coding session, run the standard kickoff:

1. git status — any uncommitted changes to address?
2. git log --oneline -5 — what was done last session?
3. Read CLAUDE.md — any context I should know?
4. Run test suite — is the baseline clean? Command: [your test command]
5. Check for open TODO/FIXME I left: grep -r "TODO\|FIXME" src/ --include="*.ts"
6. List any .claude/agents/ or active sub-agent configs

Then tell me:
- Current state of the codebase (clean/dirty)
- Anything urgent based on what you found
- What you think we should work on, based on CLAUDE.md's "Active Work" section

Ready for my task when you've reported the above.
```
