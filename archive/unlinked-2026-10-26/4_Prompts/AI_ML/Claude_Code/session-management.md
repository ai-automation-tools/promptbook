---
title: "Prompt: Advanced Context and Session Management"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Advanced Context and Session Management

**Use when:** You want to actively manage Claude Code's context window, handle long sessions efficiently, maintain state across sessions, or recover from context loss.

---

## Prompt — Compact and Summarize Current Context

```
My context is getting long. Compact it without losing critical information.

Please:
1. Summarize everything we've done this session in bullet points (max 20)
2. List every file we've modified with a one-line description of the change
3. List every decision we made and the chosen option
4. List any open questions or unresolved issues
5. State the current goal and next immediate step

Write this summary to .claude/session-[YYYYMMDD].md

Then tell me: what safe context do I have left for this session?
After I confirm, you can consider the pre-summary conversation closed.
```

---

## Prompt — Restore Session State from Summary

```
Restore the context from a previous session.

Read: .claude/session-[DATE].md (or the most recent session file)

From that file:
1. Confirm which files were modified (read their current state)
2. Confirm the current task and where we left off
3. Run the baseline check: [test command]
4. Report anything that changed since the session file was written

Then tell me: "Ready to continue. We were working on [X] and the next step is [Y]. Tests are [passing/failing]."
```

---

## Prompt — Context Handoff Between Agents

```
I need to hand off work from this session to a sub-agent or future session.

Produce a structured handoff document:

**File:** .claude/handoff-[TASK_NAME].md

Contents:
# Handoff: [Task Name]
## Status: [percentage complete]
## Remaining work:
  1. [Step 1 — specific, actionable]
  2. [Step 2]
## Context the next agent needs:
  - Key files to read first: [list with paths]
  - Decisions already made: [list]
  - Patterns to follow: [list]
  - Things NOT to do: [list of dead ends we hit]
## Test to run to verify starting state:
  [command]
## Expected test result:
  [what passing looks like]
## Definition of done:
  [exactly what the completed task looks like]

Write this file, then tell me it's ready for handoff.
```

---

## Prompt — Long-Running Task Checkpoint System

```
Set up checkpointing for a long task so it can be resumed if interrupted.

**Task:** [describe the long-running task]
**Checkpoint file:** .claude/checkpoint-[task-name].json

Checkpoint schema:
{
  "task": "[name]",
  "started": "[ISO timestamp]",
  "last_updated": "[ISO timestamp]",
  "total_steps": [N],
  "completed_steps": [N],
  "current_step": "[description]",
  "completed": [list of step names with timestamps],
  "pending": [list of remaining steps],
  "state": { [any task-specific data to persist] },
  "errors": [list of any errors encountered]
}

Rules:
1. Create the checkpoint file before starting step 1
2. Update it after EVERY completed step (not at the end)
3. If interrupted, read the checkpoint on restart and resume from last completed step
4. Never repeat a step that's marked completed in the checkpoint
5. On completion, set a "completed_at" timestamp

Start the task now, creating and maintaining the checkpoint as you go.
```

---

## Prompt — Multi-File State Tracking

```
I'm making changes across many files. Track the full change manifest.

**Task:** [what we're implementing]
**Tracking file:** .claude/change-manifest.md

For every file touched, maintain this manifest:

| File | Action | Status | Notes |
|------|--------|--------|-------|
| path/to/file.ts | MODIFIED | ✅ Done | Added null check in line 47 |
| path/to/new.ts | CREATED | 🔄 In Progress | |
| path/to/old.ts | DELETED | ⏳ Pending | Remove after new.ts is tested |

Update this manifest:
- BEFORE touching any file (add it as Pending)
- AFTER completing a file (mark Done)
- If a file is modified again (update Notes)

At the end of the session, this manifest becomes the PR description.
Start now and keep the manifest current throughout.
```

---

## Prompt — Diagnose Context Confusion

```
I think you may have lost context or are operating on stale assumptions. Let's reset.

Please answer these questions from what you currently know:
1. What project are we working on?
2. What task were we trying to accomplish?
3. What files have you read or modified in this session?
4. What is the current state of the code (passing tests? known issues?)
5. What was the last thing you did?

After answering, re-read:
- CLAUDE.md
- The most recently modified files
- .claude/session-*.md if one exists

Then tell me: what do you think we should do next, and do you have any uncertainty about the current state?
```
