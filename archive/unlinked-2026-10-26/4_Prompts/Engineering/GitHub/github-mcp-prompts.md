---
title: 🚀 GitHub MCP Server Prompts
section: Prompt_Library
category: Mcp_Servers
subcategory: GitHub
tags: ["featured", "collections", "github", "version-control", "collaboration"]
created: 2026-03-25T21:32:00.000Z
source: My Prompt Library
---

# GitHub MCP Server Prompt Library

## 1. Create Repository
```
Create a new GitHub repository called "ai-agent-framework" with a description "Agentic AI framework for autonomous task execution" and initialize it with a README file. Make it public and add a MIT license.
```

## 2. Push Changes
```
I've made several commits locally to my feature branch. Push the "feature/add-authentication" branch to the remote repository and set it to track the upstream branch.
```

## 3. Create Pull Request
```
Create a pull request from the "feature/add-authentication" branch to "main" with the title "Add OAuth2 authentication system" and description "Implements secure OAuth2 authentication with Google and GitHub providers. Includes user session management and token refresh logic."
```

## 4. Merge Pull Request
```
Merge pull request #42 into main using a squash merge strategy. Use the commit message "feat: implement OAuth2 authentication system" and delete the source branch after merging.
```

## 5. Rebase Branch
```
Rebase my current feature branch onto the latest main branch to incorporate recent changes. If there are conflicts, show me which files have conflicts so I can resolve them.
```

## 6. Create Issue
```
Create a new GitHub issue titled "Add rate limiting to API endpoints" with the following description:

**Problem**: API endpoints are vulnerable to abuse without rate limiting.

**Proposed Solution**: 
- Implement Redis-based rate limiting
- Configure limits: 100 requests/minute for authenticated users, 20 for anonymous
- Return appropriate 429 status codes with Retry-After headers

**Acceptance Criteria**:
- [ ] Rate limiting middleware implemented
- [ ] Redis connection configured
- [ ] Tests added for rate limit scenarios
- [ ] Documentation updated

Label it as "enhancement" and "security", assign it to me, and add it to the "API Improvements" milestone.
```

## 7. Review Pull Request Comments
```
Show me all the review comments on pull request #38. For each comment thread, summarize the discussion and tell me which ones are still unresolved.
```

## 8. Clone and Setup Repository
```
Clone the repository "username/awesome-ai-tools" to my local machine, checkout the develop branch, install dependencies using npm, and create a new feature branch called "feature/add-openai-integration".
```

## 9. Complex: Release Workflow
```
I want to create a new release for version 2.1.0. Here's what I need:

1. First, fetch the latest changes from main and ensure my local branch is up to date
2. Create a new branch called "release/v2.1.0"
3. Update the version number in package.json to 2.1.0
4. Generate a changelog by comparing commits between the last tag (v2.0.0) and current HEAD
5. Commit these changes with message "chore: bump version to 2.1.0"
6. Create a new tag "v2.1.0" with an annotated message including the changelog
7. Push the branch and tag to remote
8. Create a GitHub release from the tag with the changelog as the release notes

Walk me through each step and confirm before proceeding to the next.
```

## 10. Complex: Code Review Automation
```
I need to review pull request #52. Please help me with this workflow:

1. Fetch the PR branch and checkout locally
2. Show me the diff statistics (files changed, insertions, deletions)
3. List all modified files and identify which ones are test files vs source files
4. For each modified source file, show me the key changes
5. Run the test suite and report if all tests pass
6. Check if the PR description mentions any related issues - if so, fetch those issues and summarize them
7. Based on the changes, suggest potential security concerns or performance implications
8. Draft a review comment summarizing your findings

After review, if everything looks good, approve the PR and add a comment with your review summary.
```

## 11. Search Code Across Repository
```
Search the entire repository for all occurrences of the deprecated "oldAuthMethod" function and show me which files are still using it. For each occurrence, show me the surrounding context (5 lines before and after) so I can understand how it's being used.
```

## 12. Fork and Contribute Workflow
```
I want to contribute to the open-source project "awesome-org/cool-project". Fork the repository to my account, clone it locally, add the original repository as an upstream remote, create a new branch "fix/typo-in-readme", make a commit fixing typos in README.md, and create a pull request back to the original repository.
```

## 13. Sync Fork with Upstream
```
My forked repository is 15 commits behind the upstream. Fetch the latest changes from upstream/main, merge them into my local main branch, resolve any conflicts if present, and push the updated main to my fork.
```

## 14. Complex: Multi-Repository Coordination
```
I'm working on a microservices project with 3 repositories: api-gateway, user-service, and payment-service. I need to:

1. In api-gateway: create branch "feature/update-routing" and update the routing configuration
2. In user-service: create branch "feature/add-profile-endpoint" and add a new profile endpoint
3. In payment-service: create branch "feature/webhook-integration" and add webhook handling
4. For each repository, commit the changes with conventional commit messages
5. Create pull requests in all three repositories, cross-referencing each other in the descriptions
6. Add myself as reviewer on all three PRs

Coordinate this workflow and ensure all PRs mention they're part of the same feature set.
```

## 15. Repository Insights and Analytics
```
Generate a comprehensive report for the repository "my-org/flagship-product":

1. Total number of open issues and PRs
2. Number of issues created in the last 30 days
3. Most active contributors (by commits) in the last 3 months
4. Most commented issues/PRs
5. Average time to merge PRs
6. Current CI/CD status (which workflows are failing)
7. Repository star count and recent star growth
8. List of stale branches (not updated in 90+ days)

Format this as a markdown report I can share with the team.
```
