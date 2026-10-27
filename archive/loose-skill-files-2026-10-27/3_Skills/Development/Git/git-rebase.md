---
title: "🔧 Git Rebase"
tags: ["skill", "git", "version-control", "development"]
category: "Skills"
subcategory: "Development"
name: "🔧 git-rebase"
description: "Executes interactive and standard git rebases to maintain a clean commit history. Use when: (1) pulling upstream changes into a feature branch, (2) squashing commits, (3) rewriting commit messages. NOT for: rebasing public/shared branches that others depend on."
---

# Git Rebase

This skill enables the AI agent to perform complex Git rebase operations. It handles rebasing against base branches, squashing multiple WIP commits into logical units, and resolving conflicts gracefully. It helps maintain a linear, readable project history.

## Prerequisites

- **Required Tool/Service:** Git CLI - To perform version control operations
- **Permissions:** Read/Write access to the local git repository
- **Environment:** Any environment where the `git` executable is available in the PATH

### Setup Instructions

1. Ensure Git is installed and configured with a user name and email.
2. The agent must have shell access to the repository directory.

**Verification:**
```bash
git --version
```

Expected output:
```
git version 2.x.x
```

## Usage

### Basic Usage

Rebase the current branch onto another branch (e.g., `main`).

```bash
git rebase main
```

**What it does:**
1. Rewinds the current branch commits
2. Applies the target branch commits
3. Replays the current branch commits on top

### Common Workflows

#### Workflow 1: Syncing with Main

When a feature branch falls behind the main branch.

**Steps:**
1. Fetch latest changes
   ```bash
   git fetch origin main
   ```
2. Rebase feature branch onto main
   ```bash
   git rebase origin/main
   ```

**Expected Outcome:**
The feature branch now contains all updates from `main` with its own commits cleanly on top.

#### Workflow 2: Squashing Commits

When preparing to merge a feature and cleaning up WIP commits.

**Steps:**
1. Start interactive rebase for the last N commits
   ```bash
   GIT_SEQUENCE_EDITOR="sed -i -e '2,\$s/^pick/squash/'" git rebase -i HEAD~3
   ```

**Expected Outcome:**
The last 3 commits are combined into a single commit.

## Examples

### Example 1: Resolving a conflict during rebase

**Context:** Rebasing a feature branch onto main results in a merge conflict.

**Task:** Resolve the conflict and continue the rebase.

**Commands:**
```bash
# Agent attempts rebase
git rebase main
# Conflict occurs in file.txt. Agent edits file.txt to resolve.
git add file.txt
git rebase --continue
```

**Explanation:**
When a conflict halts the rebase, the agent identifies the conflicted files, applies fixes, stages them, and resumes the rebase process.

## Troubleshooting

### Common Issues

#### Issue 1: Stuck in rebase state

**Symptoms:**
- Cannot checkout other branches
- `git status` shows "rebase in progress"

**Cause:**
A previous rebase was aborted abruptly or left unresolved.

**Solution:**
```bash
git rebase --abort
```

## Best Practices

### Do's ✅

- Always commit or stash local changes before starting a rebase
- Use interactive rebase (`-i`) to clean up local history before pushing

### Don'ts ❌

- Never rebase a branch that has been pushed to a shared remote (unless specifically coordinated)

## File Structure

```
git-rebase/
├── SKILL.md              # This file
```
