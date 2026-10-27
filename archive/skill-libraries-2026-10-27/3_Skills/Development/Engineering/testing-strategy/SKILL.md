---
title: "💻 testing-strategy"
name: testing-strategy
description: Decide what to test and at which level so the suite catches real regressions without becoming slow and brittle — the test shape (heavily unit, fewer integration, few end-to-end), testing behavior rather than implementation, writing a failing test before a bug fix, and knowing where coverage numbers mislead. Use when a project has no tests and needs a strategy, when a suite is slow or flaky, when deciding how to test a specific feature, or when a bug keeps coming back.
tags: ["skill","development","engineering","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/engineering/testing-strategy/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Testing Strategy

## Tests exist to let you change code safely

The point of a test suite is not coverage and it is not correctness proofs. It is the
confidence to change code without manually re-checking everything, and the early
warning when a change breaks something you were not looking at. Every decision below
serves that: a test that does not increase change-confidence, or that fires on changes
that are not regressions, is costing more than it returns.

The two failure modes are equal and opposite. A suite that is too thin lets
regressions through and nobody trusts a green run. A suite that is too brittle breaks
on every refactor, so people stop refactoring or start deleting tests to get to green.
Aim between them, deliberately.

## The shape

Most tests should be fast and low-level; fewer should cross boundaries; a small number
should exercise the whole thing.

| Level | What it covers | Count | Speed |
|:---|:---|:---|:---|
| Unit | One function or module, dependencies stubbed | Many | Milliseconds |
| Integration | A real boundary — DB, API, queue — wired up | Some | Seconds |
| End-to-end | A user flow through the running system | Few | Slow |

The reason for the shape is economics. A unit test that fails points at one function;
an end-to-end test that fails could be anything in the stack, and diagnosing it is
expensive. Push detection as low as it will go. Reserve end-to-end for the handful of
flows where the *integration itself* is the risk — a checkout, a login, a payment —
and let lower levels cover the logic those flows are made of.

An inverted suite — mostly slow end-to-end tests, few unit tests — is the common
anti-pattern. It is slow, it is flaky, and every failure is an investigation. If you
have one, the fix is to push logic down into units, not to add more end-to-end tests.

## Test behavior, not implementation

A test coupled to *how* code works breaks when you change how it works, even if what
it does is unchanged. A test coupled to *what* code does survives the refactor and
catches the regression. That difference is what separates a suite that enables change
from one that obstructs it.

- **Assert on outputs and observable effects**, not on internal calls. Testing that a
  function returns the right value survives a rewrite; testing that it called a
  particular helper does not.
- **Do not reach into private state.** If a test needs internals to verify a result,
  the result is not observable enough, or the unit is doing too much.
- **Mock at real boundaries only** — the network, the clock, the filesystem, a
  third-party service. Mocking your own internal modules couples the test to today's
  structure and turns every refactor into a test rewrite.
- **A test that has to change every time you refactor is testing the wrong thing.**
  That is the signal, and it is worth acting on rather than tolerating.

## What deserves a test

Coverage is a poor target because it treats all code as equally risky. Prioritize by
risk and by how much the code will change under you.

**Test first:**

- Business logic and calculations — the code where a wrong answer is a real bug.
- Boundary and edge conditions — empty, zero, one, maximum, negative, null, the
  off-by-one.
- Error paths — the failure the happy-path demo never exercises and production hits
  on day one.
- Anything with a history of breaking. A module that has regressed before will again.
- Bug fixes — every one, see below.

**Test lightly or not at all:**

- Framework behavior. The framework has its own tests; re-testing that its router
  routes is wasted effort.
- Trivial pass-through code with no logic.
- Generated code and third-party libraries.
- Volatile UI details — exact pixels, copy that changes weekly. Test the behavior
  under the UI, not its current appearance.

## Every bug fix starts with a failing test

When you fix a bug, write the test that reproduces it *first*, and watch it fail.
Then fix the code and watch it pass. This is not ceremony:

- The failing test proves you actually understand the bug, rather than changing code
  until the symptom disappears.
- It proves the fix works, right now.
- It stops the bug coming back. A bug that recurs is almost always one that was fixed
  without a test pinning it down.

A bug that keeps returning is the clearest possible signal this step is being skipped.

## Flaky tests are worse than no tests

A test that passes and fails on the same code destroys trust in the whole suite,
because now every red run might be noise, and people start re-running until green
instead of investigating. One flaky test can neutralize a thousand good ones.

Common causes and the fix:

- **Time** — real `sleep`, real clocks, race conditions. Inject the clock; wait on a
  condition, never on a duration.
- **Order dependence** — a test that only passes after another ran. Each test sets up
  and tears down its own state.
- **Shared state** — a database row or a global left dirty by a previous test.
  Isolate; reset between tests.
- **Real network** in a test that should be isolated. Stub it, and add a guard that
  fails any unit test which opens a real connection.

Fix a flaky test or delete it. Leaving it is the worst option, because it teaches
everyone to ignore red.

## Where coverage numbers lie

Coverage measures which lines *ran*, not which behavior was *verified*. A test that
executes a function and asserts nothing meaningful adds coverage and catches nothing.

- **Use coverage to find untested code, not to certify tested code.** A gap is a
  useful question ("why is this path untested?"); a high number is not an answer.
- **Ignore the second decimal.** The difference between 82% and 84% is noise; the
  difference between "the payment logic is tested" and "it isn't" is everything, and
  the percentage hides it.
- **A coverage target as a gate produces assertion-free tests** written to hit the
  number. Watch for tests that call code and check nothing.

## Standing up a suite from nothing

Do not try to cover everything at once — you will lose momentum on low-value tests.

1. **Start with the highest-risk business logic** — the code where a bug costs the
   most. One good test here beats twenty on getters.
2. **Add a test with every bug fix**, from now on. The suite grows toward exactly the
   fragile spots, guided by real failures.
3. **Add a few end-to-end tests for the critical flows** — the two or three paths that
   must never break.
4. **Cover new features as you build them**, at the lowest level that captures the
   logic.

The suite that grows from real bugs and real risk is worth more than one built to a
coverage percentage, because every test in it earned its place.

## Checklist

- [ ] Most tests are fast and low-level; end-to-end is reserved for critical flows
- [ ] Tests assert observable behavior, not internal calls or private state
- [ ] Mocks sit at real boundaries only, never on internal modules
- [ ] Every bug fix ships with a test that fails before the fix and passes after
- [ ] No known flaky tests are left in the suite
- [ ] Coverage is used to find gaps, not as a gate that rewards empty tests
- [ ] Error paths and edge conditions are tested, not just the happy path
