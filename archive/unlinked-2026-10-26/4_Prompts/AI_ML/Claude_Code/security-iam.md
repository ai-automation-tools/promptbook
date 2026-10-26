---
title: "Prompt: Security, IAM, and Zero-Trust Reviews"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Security, IAM, and Zero-Trust Reviews

**Use when:** You want Claude Code to apply security expertise — auditing permissions, reviewing agent identity configs, running zero-trust gap analyses, or hardening systems.

---

## Prompt — Agent Identity & Least-Privilege Audit

```
Audit the agent identity and permissions configuration for this system.

**System / config path:** [path or description]
**Agent framework:** [Claude Code / OpenClaw / CrewAI / custom]

For each agent or service identity, assess:
1. **Identity** — does each agent have a unique, distinguishable identity? (not shared credentials)
2. **Scope** — what can it access? Does it need all of that?
3. **Tool permissions** — are tools individually granted or is it "allow all"?
4. **Lateral movement risk** — if this agent is compromised, what else could an attacker reach?
5. **Audit trail** — are its actions logged with enough detail to reconstruct events?
6. **Rotation** — are its credentials/tokens rotatable without service disruption?

Output a risk matrix:
| Agent | Current Permissions | Minimum Required | Risk If Compromised | Remediation |
|-------|--------------------|-----------------|--------------------|-------------|

Then implement the remediation steps for any HIGH or CRITICAL risk items.
```

---

## Prompt — Zero-Trust Gap Analysis for an Agent System

```
Run a zero-trust gap analysis on this agent-based system.

**System description:** [what the system does, how agents interact]
**Read these configs:** [paths to agent configs, MCP settings, network configs]

Evaluate against Zero Trust principles:

1. **Never trust, always verify**
   - Are all inter-agent calls authenticated?
   - Are there any implicit trust relationships ("agents on the same host can call each other")?
   - Is identity verified on every request, not just at session start?

2. **Least privilege access**
   - Does each agent have only the tools it needs for its specific role?
   - Are permissions scoped to the minimum necessary resource?
   - Are there any wildcard permissions (e.g. Read(*), all MCP tools)?

3. **Assume breach**
   - If Agent X is compromised, can it pivot to other agents or systems?
   - Are there hard network/permission boundaries between agents?
   - Is sensitive data encrypted at rest in agent memory/context files?

4. **Verify explicitly (context-aware access)**
   - Are decisions based on multiple signals (not just "has valid token")?
   - Are there anomaly detection or behavioral guardrails?

Output:
- Gap count by principle
- Top 3 most critical gaps with specific fix
- A Zero Trust score (0-100) with justification
```

---

## Prompt — MCP Server Permission Hardening

```
Harden the MCP server permissions in this Claude Code setup.

**Config files to read:**
- ~/.claude/claude_code_settings.json
- .claude/settings.json
- Any .mcp.json files

For each MCP server:
1. List every tool it exposes
2. Classify each tool: READ-ONLY | WRITE | DESTRUCTIVE | NETWORK
3. Check which tools are actually used vs. just available
4. Identify tools that should never be called without human confirmation

Recommended hardening:
- Remove unused MCP servers entirely
- For servers I keep: restrict to only the tools I actually use
  (show me the allowedTools config for each)
- For DESTRUCTIVE tools: add them to a confirmation-required list
- For NETWORK tools: verify they can only reach expected domains

Write the hardened config and compare it to the current config as a diff.
```

---

## Prompt — Secrets Management Audit

```
Audit secrets management across this Claude Code project and agent setup.

Scan these locations:
1. All config files: .claude/, .mcp.json, claude_code_settings.json
2. CLAUDE.md files (global and project)
3. .env files (list them, don't print values)
4. Shell scripts and automation files
5. Git history: git log --all --full-diff -p -- "*.env" | head -100

Check for:
- Hardcoded API keys, tokens, or passwords (regex: [A-Za-z0-9_]{20,})
- Secrets committed to git (even in old commits)
- Credentials in MCP server configs instead of env var references
- Insecure env var patterns (e.g. ${MY_SECRET} in a file committed to git)
- Any MCP server storing auth tokens in plaintext files

For each finding:
- File and line number
- Risk level
- The pattern found (redact the actual value)
- Remediation: how to move it to a proper secrets store

Do NOT print actual secret values under any circumstances.
```

---

## Prompt — RBAC Design for a Multi-Agent System

```
Design a Role-Based Access Control system for this multi-agent setup.

**Agents:** [list each agent and their purpose]
**Resources they access:** [MCP tools, files, APIs, workspaces, databases]
**Operations:** [read, write, execute, delete, admin]

Design the RBAC model:

1. **Define roles** (not 1:1 with agents — roles are reusable):
   - Role name, description, and permission set
   - e.g. "Reader" = [Read files, Read MCP tools], "Executor" = [Read + Bash], "Admin" = [all]

2. **Assign roles to agents:**
   | Agent | Role(s) | Rationale |
   
3. **Define permission boundaries:**
   - What can NEVER be delegated regardless of role?
   - What requires dual authorization (two agents must agree)?
   - What auto-expires after a time period?

4. **Implement in Claude Code:**
   - Write the settings.json permission rules for each agent profile
   - Show how to enforce this in .claude/settings.json per-agent sections

5. **Audit log design:**
   - What events to log
   - Log format
   - Where to store and how long to retain
```

---

## Prompt — Incident Response Runbook for Agent Compromise

```
Create an incident response runbook for a compromised AI agent scenario.

**System:** [description of the multi-agent setup]
**Agents:** [list each agent and what it has access to]

Write a runbook covering:

**Detection**
- Signs that an agent may be acting maliciously or been compromised
- Log queries to run to confirm
- Automated alerts to set up

**Containment (immediate — first 5 minutes)**
- Which config file to edit to immediately revoke agent tool access
- How to kill a running agent process
- How to rotate credentials the agent had access to
- Who to notify

**Investigation**
- Logs to collect and where to find them
- Timeline reconstruction approach
- Scope assessment: what did the agent access? What could it have modified?

**Recovery**
- Steps to safely restore the agent with clean credentials
- Validation checks before re-enabling
- Post-incident permission hardening

**Post-Incident**
- What to add to CLAUDE.md to prevent recurrence
- RBAC changes to make
- Detection improvements

Format as a numbered runbook I can execute under pressure.
```
