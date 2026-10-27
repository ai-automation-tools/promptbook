---
title: "Prompt: Configure Claude Code Settings and Permissions"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Configure Claude Code Settings and Permissions

**Use when:** You want to set up project-level or global Claude Code configuration — permissions, allowed/denied tools, environment, hooks, and custom commands.

---

## Prompt — Set Up Project Configuration from Scratch

```
Set up complete Claude Code configuration for this project.

**Project path:** [current directory or specific path]
**Project type:** [e.g. Node.js API, Python monorepo, Cloudflare Workers]
**Team or solo:** [solo / team — determines what goes in git vs. gitignore]

Create .claude/settings.json with:

1. **Permissions — always allow (no confirmation prompt):**
   - Bash: [e.g. npm test, npm run lint, npm run build, git status, git log --oneline]
   - Read: all files
   - Write: [e.g. src/**, tests/**, docs/**]

2. **Permissions — always deny:**
   - Bash: [e.g. rm -rf, curl *, wget *]  
   - Write: [e.g. .env, .env.*, secrets/**, *.pem, *.key]
   - Any MCP tool from servers: [list servers to restrict]

3. **Environment variables to expose:**
   - [VAR_NAME]: [description of what it's for]

4. **MCP server overrides for this project:**
   - [server name]: enable/disable/restrict specific tools

Also:
- Add .claude/ to .gitignore (for personal settings) OR
- Add .claude/settings.json to git (for team-shared rules) — which do I want?
- Create .claude/CLAUDE.md for project context
- Show me the final file structure
```

---

## Prompt — Configure Global Claude Code Defaults

```
Set up my global Claude Code configuration that applies to all projects.

**File location:** ~/.claude/claude_code_settings.json

I want these global defaults:

**MCP Servers (always available in every project):**
[For each server:]
- Name: [server name]
- Type: [stdio/http]
- Command or URL: [connection details]
- Env vars: [required environment variables]

**Global permission rules:**
- Never allow without confirmation: [e.g. git push, any curl to production domains]
- Always allow: [e.g. read any file, run tests]

**Global CLAUDE.md preferences:**
Create ~/.claude/CLAUDE.md with:
- My name and role: [your info]
- My preferred response style: [terse/detailed, show commands first, etc]
- Tech stack I always use: [your stack]
- Things to always/never do globally: [your rules]
- My environment: [OS, shell, key tools installed]

Write both files with my preferences and show me how to verify they loaded.
```

---

## Prompt — Set Up Custom Slash Commands

```
Create custom Claude Code slash commands for tasks I run frequently.

**Commands to create (in .claude/commands/):**

Command 1:
- Name: /[command-name]
- What it does: [description]
- Parameters it takes: [if any]
- Steps it runs: [list the steps]

Command 2:
- Name: /[command-name]
- What it does: [description]

[repeat for each command]

For each command:
1. Create the file at .claude/commands/[name].md (for prompt-based commands)
   OR .claude/commands/[name].sh (for shell-based commands)
2. Include a description at the top (shown in /help)
3. Handle missing parameters gracefully
4. Test that it works

Also create a .claude/commands/README.md listing all custom commands with usage examples.
```

---

## Prompt — Audit and Tighten Existing Configuration

```
Audit my current Claude Code configuration for security and usability.

Read these files:
- ~/.claude/claude_code_settings.json
- .claude/settings.json (if exists)
- .mcp.json (if exists)

Check for:
1. **Overly broad permissions** — Bash allow rules that match too many commands
2. **Missing deny rules** — destructive operations not explicitly blocked
3. **Credential exposure** — env vars or secrets hardcoded in config files
4. **MCP server health** — servers configured but not reachable or outdated
5. **Redundant rules** — conflicting or duplicate allow/deny entries
6. **Missing project isolation** — global settings that should be project-scoped

For each issue: describe the risk, show the current config, show the recommended change.

Then apply the recommended changes with my approval.
```

---

## Prompt — Configure Hooks (Pre/Post Tool Execution)

```
Set up Claude Code hooks to run automatically around tool execution.

**Hook type:** [PreToolUse | PostToolUse | Notification | Stop]

Hooks I want:

Hook 1 — [Name]:
- Trigger: [which tool(s) — e.g. "Bash commands matching 'git push'"]
- Action: [what to run — e.g. "run pre-push tests and block if they fail"]
- Block on failure: [yes/no]

Hook 2 — [Name]:
- Trigger: [e.g. "any Write to .env files"]
- Action: [e.g. "log the change to .claude/audit.log with timestamp"]
- Block on failure: [no — log only]

For each hook:
1. Write the hook script to .claude/hooks/[name].sh
2. Add the hook registration to .claude/settings.json
3. Test it triggers correctly
4. Document it in CLAUDE.md under "Automation Hooks"

Show me the full settings.json hooks section when done.
```

---

## Settings.json Reference

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git log*)",
      "Read(*)",
      "Write(src/**)",
      "Write(tests/**)"
    ],
    "deny": [
      "Bash(rm -rf*)",
      "Bash(curl*)",
      "Write(.env*)",
      "Write(secrets/**)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```
