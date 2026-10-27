---
title: "💻 debugging-methodology"
name: debugging-methodology
description: Debug systematically instead of by guessing — reproduce reliably first, form and test one hypothesis at a time, bisect to localize, read the actual error and stack, and confirm the fix addresses the root cause rather than the symptom. Covers reading a stack trace, git bisect, binary search in code and data, and the traps of changing several things at once. Use when a bug is hard to pin down, an error is misunderstood, a fix did not hold, or debugging has turned into random edits.
tags: ["skill","development","engineering","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/engineering/debugging-methodology/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Debugging Methodology

## Debugging is narrowing, not guessing

The slow way to debug is to read the code, form a theory about what is probably
wrong, change something, and see if the symptom goes away. It works often enough to
feel like a method and it is not one, because when it fails it leaves you with
several changes, no understanding, and a bug that might now be two bugs.

The reliable way is to narrow the space of possible causes until only one remains,
testing each step against reality rather than against your intuition. It is slower to
start and much faster to finish, and it works on bugs you do not understand.

## Reproduce first, always

A bug you cannot reproduce is a bug you cannot fix and cannot confirm fixed. Before
anything else, find the smallest reliable way to make it happen.

- **Nail down the exact conditions** — inputs, state, environment, sequence. "It
  sometimes fails" is not reproduction; "it fails when the cart is empty and the user
  is logged out" is.
- **Minimize the reproduction.** Strip away everything that is not required to trigger
  it. Each thing you remove that does not stop the bug is a thing that was not the
  cause — the minimization is itself diagnosis.
- **If it is intermittent, find the hidden variable** — timing, ordering, a
  concurrent request, uninitialized state, a cache. Intermittent means there is an
  input you have not identified yet, not that the bug is random.
- **Automate the reproduction** into a failing test the moment you can. Now you have
  an objective, repeatable signal for whether the fix worked, instead of re-checking
  by hand and hoping.

Time spent getting a solid reproduction is never wasted. It is the foundation
everything else stands on.

## Read the error. All of it.

The single most common waste in debugging is not reading the error message, or
reading the first line and inventing the rest.

- **Read the whole message and the whole stack**, not the top line. The message
  usually says what went wrong; the stack says where; a "caused by" chain says why.
- **Find the deepest frame in your own code.** The failure often surfaces inside a
  library, but the cause is the frame where your code called into it with a bad value.
- **Trust the error over your theory.** "That can't be null there" — but the stack
  says it is. The stack is reporting what actually happened; the theory is a guess.
  When they disagree, the theory is wrong.
- **A misread error sends you debugging the wrong thing entirely.** An hour spent on a
  problem that was not the problem almost always starts here.

## One hypothesis at a time

Change one thing, observe, keep or revert. Then the next.

- **State the hypothesis before testing it** — "the value is null because the config
  loads after this runs." Now the test has a clear pass/fail, instead of a vague
  "did that help?"
- **Change exactly one variable.** Change three and the symptom moves, and you have no
  idea which one did it — or worse, two cancelled out and you have created a second
  bug while hiding the first.
- **Revert what did not help before trying the next thing.** Accumulated speculative
  changes become their own tangle, and eventually you are debugging your own edits
  instead of the original bug.
- **Make the invisible visible.** Log or inspect the actual values at the boundary
  where you think it goes wrong. A confirmed value beats an assumed one, and the
  assumption is usually where the bug hid.

## Bisect to localize

When you do not know *where* the problem is, cut the search space in half, repeatedly.
Binary search finds one bad element in a thousand in about ten steps.

**In history — `git bisect`.** When something worked before and is broken now, and you
do not know which change did it:

```bash
git bisect start
git bisect bad                 # current commit is broken
git bisect good <known-good>   # this old commit worked
# git checks out the midpoint; test it, then:
git bisect good   # or: git bisect bad
# repeat until it names the exact commit; then:
git bisect reset
```

The commit it lands on is the one that introduced the bug. Reading that one diff is
usually faster than reading all the code, and it works even when you do not understand
the system.

**In code.** Disable half the pipeline. Does the bug persist? It is in the half still
running. Repeat on that half.

**In data.** A malformed record in a large input: process the first half, then the
half that fails, narrowing to the one row.

Bisection replaces "where could this possibly be" with a bounded, mechanical
procedure that terminates.

## Fix the cause, not the symptom

Once the bug is localized, resist patching where it *surfaced*. Trace to where it
*originated*.

- **Ask why the bad state exists**, not just how to stop it crashing here. A `null`
  check where it blows up hides the real question: why is it null? The answer is
  usually upstream, and until it is fixed the same bad value will surface somewhere
  else.
- **A symptom fix moves the bug; it does not remove it.** Guarding one call site
  against a bad value leaves every other call site exposed to the same value.
- **After fixing, explain the whole chain** from root cause to symptom in one or two
  sentences. If you cannot, you found *a* fix, not *the* cause, and it may not hold.

## Confirm it is actually fixed

A fix is a hypothesis until proven, and confidence here is exactly what causes a
"fixed" bug to come back.

- **Reproduce with the fix in place** and confirm the symptom is gone — against the
  minimal reproduction, not a vaguely similar case.
- **Run the failing test you wrote** and watch it pass. If you skipped writing it,
  this is the moment you regret it.
- **Check you did not break something adjacent.** Run the surrounding tests. A fix
  that trades one bug for another is not a fix.
- **Verify the mechanism, not just the disappearance.** A symptom that vanishes for a
  reason you cannot name may be masked by something unrelated — a timing change, a
  cache — and it will return.

## When stuck

- **Explain the bug out loud, in full**, to a person or a rubber duck. Articulating it
  forces the assumption you have been skipping into the open, and half of hard bugs
  fall out here.
- **Check your assumptions explicitly.** The bug is almost always in the thing you are
  certain is fine and therefore have not looked at.
- **Question the environment** — version, config, stale build, cache, wrong branch. A
  surprising amount of "impossible" behavior is running code you did not think you
  were running.
- **Step away.** A genuinely stuck debugging session rarely improves by continuing to
  stare. It often resolves in the first minute after a break.

## Traps

- **Debugging without reproducing.** You cannot know you fixed what you cannot trigger.
- **Reading only the first line of the error.** The cause is often further down.
- **Changing several things at once.** You lose the ability to attribute the effect.
- **Leaving speculative changes in.** You end up debugging your own noise.
- **Patching the symptom.** The bug moves rather than leaves.
- **Declaring victory on the first green.** Confirm the mechanism, not just that the
  symptom went quiet.
