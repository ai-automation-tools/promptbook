---
title: "Prompt: Create Automated Workflows"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Create Automated Workflows

**Use when:** You want Claude Code to design, build, or improve automated workflows — including GitHub Actions, shell scripts, n8n pipelines, cron jobs, or multi-step automation chains.

---

## Prompt — GitHub Actions CI/CD Pipeline

```
Create a production-ready GitHub Actions workflow for this project.

**Project type:** [e.g. Node.js API, Python FastAPI, React frontend, monorepo]
**Triggers:** [e.g. push to main, pull_request, manual dispatch, schedule]
**Required jobs:**
  - [ ] Install & cache dependencies
  - [ ] Lint (tool: [eslint/ruff/etc])
  - [ ] Type check (tool: [tsc/mypy/etc])
  - [ ] Unit tests with coverage threshold: [e.g. 80%]
  - [ ] Build / compile
  - [ ] [Deploy step — describe target: Vercel / Cloudflare / Docker / etc]
  - [ ] [Other: e.g. security scan, publish package]
**Secrets needed:** [List env vars — e.g. CLOUDFLARE_API_TOKEN, NPM_TOKEN]
**Fail behavior:** [Fail fast | continue on error for non-critical jobs]

Please:
1. Write the full workflow YAML to .github/workflows/[name].yml
2. Use dependency caching to minimize runtime
3. Add job summaries that post results as PR comments
4. Make the deploy job require manual approval for production
5. Add a status badge snippet for the README
```

---

## Prompt — Shell Automation Script

```
Write a shell script to automate the following manual process:

**What I currently do manually:** [Describe each step in order]
**How often I run it:** [e.g. daily, on every deploy, on demand]
**Inputs it needs:** [command line args or env vars]
**Expected output:** [what it produces or changes]
**Environment:** [bash/zsh, OS, dependencies available]

Requirements for the script:
1. --dry-run flag that prints what would happen without making changes
2. --verbose flag for detailed logging
3. Idempotent where possible (safe to run twice)
4. Graceful error handling — exit with non-zero code and clear message on failure
5. Log each major step with a timestamp
6. Check for required dependencies at startup and fail fast if missing
7. Header comment block: purpose, usage, required env vars, examples

Write the script to [target path] and make it executable (chmod +x).
```

---

## Prompt — n8n Workflow Design

```
Design a complete n8n workflow for the following automation:

**Goal:** [e.g. "Monitor RSS feeds, filter AI-related items, summarize with Claude, post to Telegram"]
**Trigger:** [Webhook | Schedule (cron) | Manual | n8n form]
**Data sources:** [APIs, databases, files, services involved]
**Processing steps:** [what transformations or decisions happen]
**Output destinations:** [where results go — Slack, email, database, webhook, etc]
**Error handling:** [how to handle failures at each stage]

For each node, specify:
- Node type (e.g. HTTP Request, Code, IF, Set, Merge, Loop Over Items)
- Configuration (URL, method, headers, body, parameters)
- What data it receives and what it outputs
- Error branch behavior

Also specify:
- Which nodes need credentials and what type
- Any environment variables to set in n8n
- The workflow JSON export structure (describe the nodes array)
- A test payload I can use to trigger and verify it

If this workflow should call Claude, show the exact HTTP Request node config for the Anthropic API.
```

---

## Prompt — Scheduled Job with Monitoring

```
Set up a scheduled job with proper monitoring:

**Task to run:** [What the job does]
**Schedule:** [cron expression or human description — e.g. "every day at 6am UTC"]
**Environment:** [where it runs — GitHub Actions / cron on server / n8n / Cloudflare Workers / etc]
**Success definition:** [how to know it ran correctly]
**Alerting:** [where to send failure notifications — Telegram / Slack / email]
**Retention:** [how long to keep logs]

Please:
1. Implement the scheduled trigger in the specified environment
2. Wrap execution in try/catch with structured logging:
   { timestamp, job_name, status, duration_ms, error? }
3. Write logs to [location] and/or send to [logging service]
4. On failure: send an alert to [channel] with job name, error message, and timestamp
5. On success: optionally post a digest to [channel] (yes/no: [your preference])
6. Add a manual trigger so I can run it on demand
7. Implement a dead-man's switch: alert if the job hasn't run successfully in [X hours]
```

---

## Prompt — Agentic Workflow with Human-in-the-Loop

```
Build a workflow where Claude Code handles autonomous steps but pauses for human approval at critical points.

**Workflow name:** [e.g. "Automated PR Review & Merge"]
**Autonomous steps Claude can do without asking:** [e.g. lint, run tests, generate summary]
**Steps requiring my approval before proceeding:** [e.g. merge to main, send email, delete records]
**Steps requiring my input (not just approval):** [e.g. resolve ambiguous conflicts]

For each approval point:
1. Claude must print a clear summary of what it's about to do
2. List the exact consequences (what changes, what can't be undone)
3. Wait for me to type "yes", "no", or "edit: [instruction]"
4. If "no" — stop and explain what was skipped
5. If "edit: [instruction]" — apply the change and re-present for approval

Implement this workflow now and use it to: [specific task to run through the workflow]
```

---

## Prompt — Convert a Workflow to a Reusable Claude Code Command

```
I have a workflow I run repeatedly. Convert it into a reusable Claude Code slash command or script.

**Workflow steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Parameters I vary each time:** [list what changes run to run]
**Fixed parts:** [what's always the same]

Please:
1. Create a shell script at .claude/commands/[name].sh (or appropriate path)
2. Accept parameters as command line arguments with defaults
3. Document with --help flag
4. Register it as a Claude Code custom command if applicable
5. Add it to CLAUDE.md under "Custom Commands"
6. Show me how to invoke it
```
