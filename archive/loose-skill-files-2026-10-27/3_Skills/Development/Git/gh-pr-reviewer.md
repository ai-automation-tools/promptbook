---
title: "👀 GitHub PR Reviewer"
tags: ["skill", "git", "github", "code-review", "pr"]
category: "Skills"
subcategory: "Development/Git"
name: "gh-pr-reviewer"
description: "Facilitates automated or AI-assisted code review of Pull Requests using the GitHub CLI. Use when: (1) reviewing complex diffs, (2) providing inline feedback on PRs, (3) approving or requesting changes autonomously. NOT for: merging PRs without human oversight."
---

# GitHub PR Reviewer

This skill enables agents to inspect, comment on, and review GitHub Pull Requests directly from the terminal. It utilizes the GitHub CLI (`gh`) to fetch diffs, post review comments, and manage the PR lifecycle without needing a web browser.

## Prerequisites

- **Required Tool:** `gh` (GitHub CLI)
- **Authentication:** Must be logged in (`gh auth status`) with repo scopes.
- **Permissions:** Read/Write access to PRs in the target repository.
- **Environment:** Inside the cloned git repository.

### Setup Instructions

1. Ensure GitHub CLI is installed.
2. Authenticate and verify scopes.
   ```bash
   gh auth login --scopes "repo"
   ```

**Verification:**
```bash
gh pr list
```
Expected output: A list of open pull requests.

## Usage

### Basic Usage

View the diff of a specific pull request.

```bash
gh pr diff [PR_NUMBER]
```

**What it does:**
1. Fetches the patch/diff of the specified PR.
2. Displays the changes in the terminal, allowing the agent to analyze the code modifications.

### Common Workflows

#### Workflow 1: Providing a General Review

**Steps:**
1. Analyze the PR diff.
2. Submit a review with general feedback.
   ```bash
   gh pr review [PR_NUMBER] --comment --body "Looks good overall, but please add unit tests for the new edge cases in the Auth module."
   ```

**Expected Outcome:**
A review comment is posted to the PR timeline.

#### Workflow 2: Approving a PR

**Steps:**
1. Verify CI checks have passed (`gh pr checks [PR_NUMBER]`).
2. Approve the PR.
   ```bash
   gh pr review [PR_NUMBER] --approve --body "LGTM. Tests pass and logic is sound."
   ```

## Configuration

No specific configuration files required. Relies on standard Git and GitHub CLI configurations.

## Examples

### Example 1: Requesting Changes

**Context:** The PR introduces a potential security vulnerability.

**Task:** Request changes detailing the vulnerability.

**Commands:**
```bash
gh pr review 102 --request-changes --body "SECURITY RISK: The new endpoint does not validate the JWT scope before executing the database query. Please add the `requireScope('admin')` middleware."
```

**Output:**
The PR status changes to "Changes requested" and the author is notified.

## Advanced Usage

### Inline Comments on Specific Lines

While `gh` CLI doesn't natively support easy inline comments via a single simple flag, agents can use the GitHub API via `gh api` to post comments on specific lines of a diff.

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/{owner}/{repo}/pulls/{pull_number}/comments \
  -f body='Great catch on this edge case!' \
  -f commit_id='[COMMIT_SHA]' \
  -f path='src/utils.js' \
  -F line=15
```

## Troubleshooting

### Common Issues

#### Issue 1: PR not found

**Symptoms:**
- `gh: Could not resolve to a PullRequest with the number of X.`

**Cause:**
Typo in the PR number, or the PR belongs to a different repository than the current working directory.

**Solution:**
Verify the PR number and ensure you are in the correct directory.

## Best Practices

### Do's ✅

- Always read the PR description (`gh pr view`) before reviewing the diff.
- Be constructive and specific in review comments.
- Check CI status before approving.

### Don'ts ❌

- Don't approve PRs blindly without analyzing the diff.
- Avoid nitpicking style issues if a linter is already configured in CI.

## License

MIT
