---
title: "🤖 Claude Code GitHub Actions Guide"
tags: ["claude-code", "github-actions", "ci", "automation", "code-review", "claude-code-action"]
category: "Agent_Guides"
subcategory: "Claude_Code"
checked: 2026-11-09
repo: anthropics/claude-code
---

<!-- Last Updated: 2026-11-09 - Checked against code.claude.com/docs/en/github-actions -->

# Claude Code GitHub Actions Guide

`anthropics/claude-code-action` runs Claude Code inside a GitHub workflow: mention `@claude` in
an issue or pull request and it analyzes, implements and pushes, or give it a `prompt` and run
it on any GitHub event (a PR opening, a cron schedule). It is built on the Agent SDK. Source
repo: [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action).

## Set it up

Both paths need admin access to the repository.

| Path | Steps |
|:---|:---|
| Quick | Install the GitHub CLI and run `gh auth login`, open `claude` in the repo, run `/install-github-app`. It installs the app, saves the secret and opens a PR with the workflow files. Merge it. |
| Manual | Install the [Claude GitHub App](https://github.com/apps/claude), add a secret, copy [`examples/claude.yml`](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) to `.github/workflows/`. |

Quick setup works only for github.com repositories. For GitLab use Claude Code GitLab CI/CD.

**The secret** (repository Settings → Secrets and variables → Actions):

| Secret | Workflow input | Source |
|:---|:---|:---|
| `ANTHROPIC_API_KEY` | `anthropic_api_key` | Claude Console API key |
| `CLAUDE_CODE_OAUTH_TOKEN` | `claude_code_oauth_token` | `claude setup-token` run locally (Pro, Max, Ultra, Team, Enterprise) |

The app needs Contents, Issues and Pull requests at read and write. Installing it grants its
full permission set; if you need only those three, create a custom GitHub App (see the
action's `docs/setup.md`). Test with a comment: `@claude how should I implement auth here?`

## Two modes

The action picks its mode from your workflow:

- **Interactive:** no `prompt`. Claude waits for `@claude` (the `trigger_phrase`) in a comment,
  review, or new issue title or body, and answers in a comment that it updates as it works.
- **Automation:** a `prompt` is set. Claude runs at once on the event; output goes to the run
  log unless the prompt tells it to post and it has a tool that can.

Both modes reject a trigger from a user without write access (override with
`allowed_non_write_users` plus your own `github_token`) and from a bot actor (list it in
`allowed_bots`). A `schedule` run is attributed to whoever last edited the cron line.

## Interactive: respond to @claude

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

`id-token: write` is required for the default GitHub App authentication; `actions: read` lets
Claude read CI results on PRs.

## Automation: review every pull request

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-plugins-official.git"
          plugins: "code-review@claude-plugins-official"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

- `--comment` posts the review on the PR; without it the findings stay in the run log.
- Keep the `claude_args` line: the inline-comment MCP server starts only when `--allowedTools`
  there names it.
- `prompt` also takes a skill: for one in `.claude/skills/`, run `actions/checkout` first and
  pass `/skill-name`.
- On public repos, GitHub withholds secrets from fork PRs, so this runs for same-repo branches only.

## Automation: a scheduled report

```yaml
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: read
      id-token: write
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
          claude_args: |
            --model claude-opus-5-5
            --allowedTools "mcp__github__list_commits,mcp__github__list_issues"
```

With a plain-text prompt Claude has no shell or GitHub access until you grant tools through
`--allowedTools` or a `permissions.allow` rule in the `settings` input. GitHub runs schedules
only from the default branch and disables them in public repos after 60 days without activity.

## Common inputs

| Input | Use |
|:---|:---|
| `prompt` | Text or `/skill` to run; omit for `@claude` mode |
| `claude_args` | Any CLI flag: `--max-turns`, `--model`, `--mcp-config`, `--allowedTools`, `--debug` |
| `settings` | Claude Code settings as JSON or a file path |
| `plugins`, `plugin_marketplaces` | Newline-separated plugin names and marketplace Git URLs |
| `trigger_phrase` | Default `@claude` |
| `github_token` | Your own token; omit to authenticate as the Claude GitHub App |
| `use_bedrock`, `use_vertex`, `use_foundry` | Route inference through your cloud account (OIDC, no API key) |

The full list is in the action's [`docs/usage.md`](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md#inputs).

## Cost and safety

- Every run spends GitHub Actions minutes and API tokens (or your subscription, with an OAuth token).
- Cap work with `--max-turns` in `claude_args`, a job `timeout-minutes`, and GitHub `concurrency` groups.
- Keep `CLAUDE.md` short; Claude reads it on every run.
- Never commit keys. Give each workflow only the permissions it needs and review changes before merging.
- For an organization: install the app once, store the key as an organization secret (use an API
  key, not an OAuth token, which is tied to one person's subscription), or use workload identity
  federation with `anthropic_federation_rule_id` and `anthropic_organization_id` and no stored secret.

## Troubleshooting

- **No reply to `@claude`:** the app is installed, workflows are enabled, the secret exists, the
  comment says `@claude` as a whole word (not `/claude` or `@claude-bot`), and the commenter has
  write access.
- **CI doesn't run on Claude's commits:** commits made with the default `GITHUB_TOKEN` trigger no
  workflows. Remove `github_token: ${{ secrets.GITHUB_TOKEN }}` or pass a custom app token.
- **Auth errors:** test the key or token locally with `claude` first.

## Upgrading from beta

Change `@beta` to `@v1`, drop `mode`, rename `direct_prompt` to `prompt`, and move `max_turns`
and `model` into `claude_args`. `custom_instructions` becomes `--append-system-prompt`.

## Sources

- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [claude-code-action usage reference](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md)
