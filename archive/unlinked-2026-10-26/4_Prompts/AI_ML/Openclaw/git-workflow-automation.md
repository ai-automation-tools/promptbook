---
title: "🛠️ Git Workflow Automation"
tags: ["ai-tools", "openclaw-prompts", "workflow", "automation"]
category: "AI_Tools"
subcategory: "OpenClaw_Prompts"
---
# Git Workflow Automation Prompt

**Category:** Automation  
**Use Case:** Automating git operations and PR workflows  
**Based on:** Work completed 2026-02-14

---

## Standard Git Workflow

Our standard workflow for all repositories:

```
I need to set up the standard git workflow for {PROJECT_NAME}.

**Repository:** {REPO_PATH}
**Working Branch:** mike_desktop
**Target Branch:** {MAIN_BRANCH} (usually "main" or "master")
**GitHub URL:** {GITHUB_URL}

Standard workflow:
1. git checkout mike_desktop
2. git fetch origin {MAIN_BRANCH} && git merge origin/{MAIN_BRANCH}
3. # Make changes
4. git commit -m "{COMMIT_MESSAGE}"
5. git push origin mike_desktop
6. gh pr create --base {MAIN_BRANCH} --head mike_desktop
   - Title: {PR_TITLE}
   - Body: {PR_DESCRIPTION}

Note: PRs are created but NOT automatically merged - manual review required.

Please ensure this workflow is properly set up for the project.
```

---

## Example: Project Repository Setup

```
I need to set up the standard git workflow for bot-arena-retro.

**Repository:** ~/.openclaw/workspace/projects/bot-arena-retro/repo
**Working Branch:** mike_desktop
**Target Branch:** main
**GitHub URL:** https://github.com/michaelschecht/bot-arena-retro

Standard workflow:
1. git checkout mike_desktop
2. git fetch origin main && git merge origin/main
3. # Make changes (implement task from planning.md)
4. git commit -m "feat: {task description}"
5. git push origin mike_desktop
6. gh pr create --base main --head mike_desktop
   - Title: "feat: {task description}"
   - Body: "Implemented {task details}"

Note: PRs created but NOT auto-merged - manual review required.

Please ensure this workflow is documented in the project's workflows.md
```

---

## Repository Initialization

For new repositories:

```
I need to create a new GitHub repository for {PROJECT_NAME}.

**Repository Details:**
- Name: {REPO_NAME}
- Organization: {ORG_NAME} (or personal account)
- Visibility: {PUBLIC/PRIVATE}
- Description: {DESCRIPTION}
- Local Path: {LOCAL_PATH}

**Initial Setup:**
1. Create local git repo if not exists
2. Create GitHub repository
3. Set up remote: origin → {GITHUB_URL}
4. Create mike_desktop branch
5. Push initial commit to master/main
6. Set up branch protection rules (optional)
7. Document git workflow in PROJECT.md

Please set up this repository.
```

---

## Example: Extract to New Repository

```
I need to extract {SUBDIRECTORY} from {SOURCE_REPO} into its own standalone repository.

**Source:**
- Repository: {SOURCE_REPO_URL}
- Path to extract: {SUBDIRECTORY_PATH}

**New Repository:**
- Name: {NEW_REPO_NAME}
- Organization: {ORG_NAME}
- Visibility: public
- Description: {DESCRIPTION}

**Steps:**
1. Clone source repository to temp location
2. Copy {SUBDIRECTORY_PATH} to new directory
3. Initialize git in new directory
4. Create initial commit
5. Create GitHub repository: {NEW_REPO_NAME}
6. Push to GitHub
7. Clone to {LOCAL_PATH}
8. Document the extraction in both repos

Please complete this extraction.
```

---

## Automated PR Creation

For daily automation workflows:

```
In the {PROJECT_NAME} daily automation cron job:

After making changes:
1. Commit with descriptive message: "feat: {description}"
2. Push to mike_desktop: git push origin mike_desktop
3. Create PR: gh pr create --title "{title}" --body "{description}" --base {MAIN_BRANCH} --head mike_desktop
4. Report: "PR created at {URL} - awaiting review"

Do NOT auto-merge the PR. Just create it for manual review.

Please update the cron job workflow with this PR creation step.
```

---

## Variables to Replace

| Variable | Description | Example |
|----------|-------------|---------|
| `{PROJECT_NAME}` | Project name | "bot-arena-retro" |
| `{REPO_PATH}` | Local repository path | "~/.openclaw/workspace/projects/bot-arena/repo" |
| `{MAIN_BRANCH}` | Target branch name | "main" or "master" |
| `{GITHUB_URL}` | Repository URL | "https://github.com/user/repo" |
| `{COMMIT_MESSAGE}` | Commit message | "feat: add new feature" |
| `{PR_TITLE}` | Pull request title | "Daily automation 2026-02-14" |
| `{PR_DESCRIPTION}` | PR body text | "Implemented task from queue" |
| `{REPO_NAME}` | New repo name | "heartland-table" |
| `{ORG_NAME}` | GitHub org/user | "michaelschecht" |

---

## Branch Strategy

### Standard Branches
- **main** (or **master**) - Production-ready code
- **mike_desktop** - Working branch for all development

### Workflow Rules
1. Never commit directly to main/master
2. Always work on mike_desktop
3. Always pull from main before starting work
4. Create PRs for all changes
5. Manual review before merging

---

## Common Git Commands

```bash
# Standard daily workflow
git checkout mike_desktop
git fetch origin main && git merge origin/main
# Make changes
git add .
git commit -m "feat: description"
git push origin mike_desktop
gh pr create --base main --head mike_desktop

# Check status
git status
git log --oneline -5

# Sync with master after PR merge
git checkout master
git pull origin master
git checkout mike_desktop
git merge master

# Create new branch (if needed)
git checkout -b feature-name

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## GitHub CLI Commands

```bash
# Create PR
gh pr create --title "Title" --body "Description" --base main --head mike_desktop

# List PRs
gh pr list

# View PR details
gh pr view {PR_NUMBER}

# Merge PR (manual review only!)
# (Done via GitHub UI, not automated)

# Create repository
gh repo create {ORG}/{NAME} --public --description "Description"
```

---

## Related Documentation

- `docs/environment-reference.md` - Git repository overview
- `docs/cron-jobs.md` - Automated workflows using git
- Project-specific `openclaw/workflows.md` files

---

## Notes

- **PRs are NOT auto-merged** - Always require manual review
- Pull from main/master before starting work (avoid conflicts)
- Use descriptive commit messages (feat:, fix:, docs:, etc.)
- Test changes before pushing
- Document git workflows in each project's PROJECT.md
- All repos follow the same mike_desktop → main/master pattern
