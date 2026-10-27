---
title: "🛠️ Cron Job Setup"
tags: ["ai-tools", "openclaw-prompts", "cron", "setup"]
category: "AI_Tools"
subcategory: "OpenClaw_Prompts"
---
# Cron Job Setup Prompt

**Category:** Automation  
**Use Case:** Creating new scheduled automation tasks  
**Based on:** Work completed 2026-02-14

---

## Prompt

```
I need to create a new cron job for {PROJECT_NAME}.

**Schedule:** {CRON_EXPRESSION} (timezone: {TIMEZONE})
**Agent:** {AGENT_ID}
**Purpose:** {DESCRIPTION}

**Workflow:**
1. {STEP_1}
2. {STEP_2}
3. {STEP_3}
...
{N}. Send status report to Telegram using message tool:
   - action: send
   - channel: telegram
   - to: {TELEGRAM_CHAT_ID}
   - message: Brief summary of what was done

**Delivery:**
- Channel: Telegram
- Recipient: {TELEGRAM_CHAT_ID}
- Mode: announce (or "none" if using message tool internally)

**Timeout:** {TIMEOUT_SECONDS} seconds

Please create this cron job with the appropriate configuration.
```

---

## Example Usage

```
I need to create a new cron job for daily workspace cleanup.

**Schedule:** 0 2 * * * (timezone: America/Los_Angeles)
**Agent:** main
**Purpose:** Clean up temporary files and optimize workspace

**Workflow:**
1. Navigate to ~/.openclaw/workspace
2. Find and remove files older than 30 days in temp directories
3. Run git gc to optimize repository
4. Generate cleanup report
5. Send status report to Telegram using message tool:
   - action: send
   - channel: telegram
   - to: 8491774155
   - message: Brief summary of cleanup results

**Delivery:**
- Channel: Telegram
- Recipient: 8491774155
- Mode: none (using message tool)

**Timeout:** 300 seconds

Please create this cron job with the appropriate configuration.
```

---

## Variables to Replace

| Variable | Description | Example |
|----------|-------------|---------|
| `{PROJECT_NAME}` | Name of project/task | "Bot Arena automation" |
| `{CRON_EXPRESSION}` | Cron schedule | "0 3 * * *" (daily 3 AM) |
| `{TIMEZONE}` | Timezone | "America/Los_Angeles" |
| `{AGENT_ID}` | Agent to run job | "main", "developer", "iam" |
| `{DESCRIPTION}` | What the job does | "Daily task automation" |
| `{TELEGRAM_CHAT_ID}` | Your chat ID | "8491774155" |
| `{TIMEOUT_SECONDS}` | Max runtime | 300, 600, 1800 |

---

## Related Prompts

- `git-workflow-automation.md` - For git-based workflows
- See `docs/cron-jobs.md` for existing job examples

---

## Notes

- Always include error reporting to Telegram
- Use `mode: "none"` with manual message tool delivery for multi-step workflows
- Use `mode: "announce"` for simple status updates
- Test with `cron run jobId=<id> runMode=force` before enabling
- Document new jobs in `docs/cron-jobs.md`
