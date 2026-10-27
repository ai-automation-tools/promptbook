---
title: "Prompt: Use and Configure Claude Code's Built-in Tools"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Use and Configure Claude Code's Built-in Tools

**Use when:** You want to explicitly direct Claude Code to use specific built-in tools (Read, Write, Bash, WebFetch, Grep, Glob, etc.) effectively for complex tasks.

---

## Prompt — Audit All Available Tools in the Session

```
List every tool currently available to you in this session:
1. Built-in Claude Code tools (Read, Write, Edit, Bash, Glob, Grep, WebFetch, Task, etc.)
2. MCP server tools — group by server name
3. Any custom commands in .claude/commands/

For each tool, show:
- Name
- Source (built-in / MCP server name / custom)
- One-line description of what it does
- Whether it has side effects (read-only vs. write/destructive)

Then flag:
- Any tools that appear to be misconfigured or unavailable
- Any MCP servers that are connected but returning errors
- Recommended tools for my current task: [describe your current task]
```

---

## Prompt — Bash Tool: Safe Shell Operations

```
I need to run shell operations. Use the Bash tool with these guardrails:

**Task:** [describe what needs to happen in the shell]
**Environment:** [working directory, OS, any constraints]

Rules to follow:
1. Show me the command and its effect before running anything destructive
2. Never run: rm -rf, DROP TABLE, or any irreversible operation without explicit confirmation
3. Capture stdout AND stderr — report both
4. If a command fails (non-zero exit), stop and report the error — do not continue the sequence
5. For long-running commands, prefer versions with --quiet or progress indicators
6. Set a mental timeout: if a command would take > 30 seconds, warn me first

Run the following sequence:
[list the commands or describe the goal]
```

---

## Prompt — Glob + Grep: Targeted Code Search

```
I need to find something in the codebase. Use Glob and Grep tools.

**What I'm looking for:** [e.g. all usages of a deprecated function, all files importing from a module, all hardcoded URLs]
**Search pattern:** [regex or plain text]
**File scope:** [e.g. only .ts files, only src/, exclude node_modules and dist]

Please:
1. Use Glob to identify the relevant file set first
2. Use Grep to search within those files
3. Return results grouped by file with line numbers and context (2 lines before/after)
4. Summarize: total occurrences, files affected, any patterns worth noting
5. If more than 20 results, group by category and summarize instead of listing all
```

---

## Prompt — WebFetch: Research Before Coding

```
Before writing any code, use WebFetch to get current documentation.

**What I need to look up:** [e.g. "Cloudflare Workers KV API", "MCP TypeScript SDK tool registration"]
**Official docs URL (if known):** [URL or "search for it"]
**Specific questions to answer from the docs:**
  1. [Question 1 — e.g. "What's the current method signature for kv.get()?"]
  2. [Question 2]
  3. [Question 3]

Fetch the documentation, extract answers to my questions, then:
1. Summarize the key API details relevant to my task
2. Note the version/date of the docs you fetched
3. Flag anything that differs from what you'd expect based on training data
4. Then proceed to implement: [coding task]
```

---

## Prompt — Read + Edit: Safe File Surgery

```
I need to modify [FILE PATH] carefully.

Before making any changes:
1. Read the entire file
2. Identify the exact section to change: [describe the target section]
3. Show me the current code and your proposed change as a diff
4. Wait for my approval

After I approve:
5. Use the Edit tool (not Write) to make the surgical change
6. Re-read the file to confirm the change looks correct in context
7. Run any relevant tests or linters: [specify command]
8. Report the final state

Never rewrite the whole file when a targeted edit will do.
```

---

## Prompt — Multi-Tool Research + Write Pipeline

```
I need a complete research-to-implementation pipeline for: [TOPIC/TASK]

Run these steps in order using the appropriate tools:

Step 1 — RESEARCH (WebFetch + web search):
  - Find the current best practices for [topic]
  - Fetch official docs for any APIs involved
  - Note any version-specific details

Step 2 — EXPLORE (Read + Glob):
  - Read the relevant existing code in this project
  - Find all files related to [component/feature]
  - Identify what already exists vs. what needs to be built

Step 3 — PLAN (no tools — just output a plan):
  - List every file that will be created or modified
  - Describe the changes to each file in 1-2 sentences
  - Estimate risk level for each change (low/medium/high)
  - Ask for my approval before proceeding

Step 4 — IMPLEMENT (Edit + Write + Bash):
  - Make the changes in dependency order
  - Run tests after each significant change
  - Stop immediately if a test fails

Step 5 — VERIFY (Bash + Read):
  - Run the full test suite
  - Run linter
  - Show final state of all modified files
```

---

## Prompt — Configure Tool Permissions for a Project

```
Review and configure the tool permissions for this Claude Code project.

Current project: [project name/path]

I want to:
1. Read the current .claude/settings.json (or create it if missing)
2. Configure these permission rules:

**Always allow (no confirmation needed):**
  - [e.g. Bash commands matching: npm test, npm run lint, git status, git log]
  - [e.g. Read access to all files]
  - [e.g. Write access to: src/, tests/]

**Always deny:**
  - [e.g. Bash: rm, curl to external URLs, git push]
  - [e.g. Write to: .env, secrets/, production configs]

**Ask before running:**
  - [e.g. any git commit or git push]
  - [e.g. any Write to files outside src/]

Write the updated settings.json and explain what each rule does.
Also check if any MCP servers have overly broad permissions and suggest restrictions.
```
