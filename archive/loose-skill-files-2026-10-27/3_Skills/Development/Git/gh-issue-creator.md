---
title: "🐛 GitHub Issue Creator"
tags: ["skill", "git", "github", "issue-management"]
category: "Skills"
subcategory: "Development/Git"
name: "gh-issue-creator"
description: "Creates well-formatted GitHub issues directly from code context or bug reports using the GitHub CLI. Use when: (1) encountering a bug during development, (2) proposing a new feature, (3) creating task lists for epic tracking. NOT for: simple local notes or when not connected to a GitHub remote."
---

# GitHub Issue Creator

This skill enables AI agents or developers to quickly generate structured, context-rich GitHub issues from the command line. It leverages the GitHub CLI (`gh`) to automatically populate issues with templates, labels, and assignees, ensuring that bugs and features are tracked uniformly.

## Prerequisites

- **Required Tool:** `gh` (GitHub CLI) - Used to interact with the GitHub API.
- **Authentication:** Must be logged into GitHub CLI (`gh auth status`).
- **Permissions:** Read/Write access to the repository's issues.
- **Environment:** A local git repository configured with a GitHub remote.

### Setup Instructions

1. Install the GitHub CLI according to your OS instructions.
2. Authenticate the CLI with your GitHub account.
3. Ensure you are executing commands from within the target git repository.

**Verification:**
```bash
gh auth status
gh repo view
```

Expected output:
```
github.com
  ✓ Logged in to github.com as USERNAME
...
```

## Usage

### Basic Usage

Create a simple issue interactively or via flags.

```bash
gh issue create --title "Issue Title" --body "Detailed description of the issue."
```

**What it does:**
1. Validates the current repository context.
2. Constructs the issue payload.
3. Submits the issue to GitHub and returns the new issue URL.

### Common Workflows

#### Workflow 1: Bug Report Creation

Use this workflow to report a bug with full context.

**Steps:**
1. Capture the error output or bug details.
2. Create the issue with specific labels.
   ```bash
   gh issue create --title "Bug: Application crashes on null input in AuthController" --body "When passing a null token to `verifyToken`, the app throws a TypeError. Stack trace: ..." --label "bug" --assignee "@me"
   ```

**Expected Outcome:**
A new issue is created, labeled as a bug, and assigned to the current user.

#### Workflow 2: Feature Request from Template

Use this workflow when your repository has issue templates.

**Steps:**
1. Verify the available templates.
2. Create the issue using the template file.
   ```bash
   gh issue create --title "Feature: Dark Mode" --template "feature_request.md"
   ```

## Configuration

### Required Configuration

No specific configuration file is needed, but the repository must have a valid remote.

**Environment Variables:**
```bash
export GH_TOKEN="github_pat_..." # Optional: If not authenticated interactively
```

## Examples

### Example 1: Creating a Task List

**Context:** Breaking down a large feature into actionable items.

**Task:** Create an epic tracking issue.

**Commands:**
```bash
gh issue create --title "Epic: User Dashboard Redesign" --body "- [ ] Update navbar
- [ ] Implement new charts
- [ ] Migrate settings page" --label "enhancement"
```

**Output:**
```
https://github.com/org/repo/issues/42
```

**Explanation:**
Creates an issue with markdown checkboxes that can be checked off in the GitHub UI as work progresses.

## Advanced Usage

### Reading Body from a File

When issue bodies are long or require complex markdown formatting.

```bash
gh issue create --title "Architecture Proposal" --body-file docs/proposals/001-arch.md
```

## Troubleshooting

### Common Issues

#### Issue 1: Not authenticated

**Symptoms:**
- `gh: To authenticate, please run `gh auth login`.`

**Cause:**
GitHub CLI session expired or was never established.

**Solution:**
```bash
gh auth login
```

## Best Practices

### Do's ✅

- Always include clear, descriptive titles.
- Use labels to categorize the issue (e.g., `bug`, `enhancement`, `documentation`).
- Include steps to reproduce when creating bug reports.

### Don'ts ❌

- Don't create duplicate issues; search first using `gh issue list`.
- Don't dump raw, unformatted logs in the body without using markdown code blocks.

## API Reference

### Functions (Conceptual)

#### `createIssue(title, body, labels, assignees)`

**Description:** Wraps the `gh issue create` command.

**Parameters:**
- `title` (string): The issue title.
- `body` (string): The markdown body content.
- `labels` (array): List of label strings.

## License

MIT
