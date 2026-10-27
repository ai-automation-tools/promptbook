---
name: [agent-name]  # lowercase-hyphenated; REQUIRED: 2_Agents holds only files with name: + description:
description: "Use this agent when [trigger]. [One or two sentences on what it does.]"
tools: Read, Write, Edit, Bash, Glob, Grep  # only what it needs
model: sonnet  # optional: haiku | sonnet | opus | inherit
title: "🤖 [Agent Name]"
tags: ["agent", "[category]", "[topic]"]
upstream:                 # REQUIRED since 2026-10-23: CI fails an agent with no GitHub source
  match: exact
  repo: [owner/repo]
  path: [path/to/agent.md]
  ref: [full commit sha you copied from]
  checked: [YYYY-MM-DD]
---
<!-- A Claude Code subagent definition: the file drops into .claude/agents/ as-is. A role-play
     or "act as X" prompt without name:/description: belongs in 4_Prompts, not here
     (decided 2026-10-21). Vendored definitions also carry an upstream: block. -->


# [Agent Name/Title]

[Opening paragraph describing the agent's core role and expertise. Be specific about the domain and capabilities.]

## Core Responsibilities

When invoked:
1. [Primary responsibility/action]
2. [Secondary responsibility/action]
3. [Tertiary responsibility/action]
4. [Implementation/delivery action]

## [Domain Area 1] Checklist

[Category-specific checklist of key tasks/deliverables]
- [ ] [Item 1]
- [ ] [Item 2]
- [ ] [Item 3]
- [ ] [Item 4]
- [ ] [Item 5]
- [ ] [Item 6]
- [ ] [Item 7]
- [ ] [Item 8]

## [Domain Area 2]: [Subcategory]

[Description of this capability area]

### [Specific Capability 1]
- [Technique or approach 1]
- [Technique or approach 2]
- [Technique or approach 3]
- [Technique or approach 4]

### [Specific Capability 2]
- [Technique or approach 1]
- [Technique or approach 2]
- [Technique or approach 3]
- [Technique or approach 4]

## [Domain Area 3]: [Category Name]

[Description and context]

Key areas:
- [Area 1]: [Description]
- [Area 2]: [Description]
- [Area 3]: [Description]
- [Area 4]: [Description]

## [Domain Area 4]: [Technical Area]

[Description of technical capabilities]

### [Technical Category 1]
- [Item 1]
- [Item 2]
- [Item 3]
- [Item 4]

### [Technical Category 2]
- [Item 1]
- [Item 2]
- [Item 3]
- [Item 4]

## Communication Protocol

### [Protocol Type] Assessment

[When and how the agent initiates this protocol]

[Protocol name] query:
```json
{
  "requesting_agent": "[agent-name]",
  "request_type": "[request_type]",
  "payload": {
    "query": "[Description of what information is needed]"
  }
}
```

## Development Workflow

Execute [workflow type] through systematic phases:

### 1. [Phase 1 Name]

[Description of this phase]

[Phase 1] priorities:
- [Priority 1]
- [Priority 2]
- [Priority 3]
- [Priority 4]
- [Priority 5]

[Phase 1] approach:
- [Step 1]
- [Step 2]
- [Step 3]
- [Step 4]

### 2. [Phase 2 Name]

[Description of this phase]

Implementation approach:
- [Step 1]
- [Step 2]
- [Step 3]
- [Step 4]
- [Step 5]
- [Step 6]

[Workflow type] patterns:
- [Pattern 1]
- [Pattern 2]
- [Pattern 3]
- [Pattern 4]

Progress tracking:
```json
{
  "agent": "[agent-name]",
  "status": "[current_status]",
  "progress": {
    "[metric_1]": "[value]",
    "[metric_2]": "[value]",
    "[metric_3]": "[value]",
    "[metric_4]": "[value]"
  }
}
```

### 3. [Phase 3 Name - Excellence/Delivery]

[Description of completion phase]

Excellence checklist:
- [ ] [Criteria 1]
- [ ] [Criteria 2]
- [ ] [Criteria 3]
- [ ] [Criteria 4]
- [ ] [Criteria 5]

Delivery notification:
"[Sample completion message describing what was accomplished, metrics achieved, and key outcomes. Should be clear, specific, and actionable.]"

## Best Practices

### [Practice Category 1]
- [Practice 1]: [Description]
- [Practice 2]: [Description]
- [Practice 3]: [Description]
- [Practice 4]: [Description]

### [Practice Category 2]
- [Practice 1]: [Description]
- [Practice 2]: [Description]
- [Practice 3]: [Description]
- [Practice 4]: [Description]

## Advanced Techniques

### [Technique Category 1]
[Description and when to use]

- [Technique 1]
- [Technique 2]
- [Technique 3]
- [Technique 4]

### [Technique Category 2]
[Description and when to use]

- [Technique 1]
- [Technique 2]
- [Technique 3]
- [Technique 4]

## Common Patterns

### [Pattern Type 1]
```
[Code or configuration example]
```

### [Pattern Type 2]
```
[Code or configuration example]
```

## Integration with Other Agents

- **[Agent Name]**: [How they collaborate and when]
- **[Agent Name]**: [How they collaborate and when]
- **[Agent Name]**: [How they collaborate and when]
- **[Agent Name]**: [How they collaborate and when]
- **[Agent Name]**: [How they collaborate and when]

## Key Principles

Always prioritize [principle 1], [principle 2], and [principle 3] while maintaining [quality standard] that enables [desired outcome].

---

**Note:** Replace all [bracketed placeholders] with your specific content. Remember to:
- Use lowercase with hyphens for the agent name (e.g., `git-workflow-manager`)
- Include 2-3 concrete examples in the description field with context, user query, assistant response, and commentary
- List all tools the agent needs (Read, Write, Edit, Bash, Glob, Grep, Browser, etc.)
- Specify the recommended model (haiku for fast/simple, sonnet for balanced, opus for complex)
- Structure sections logically with clear domain areas
- Include JSON protocol examples for agent communication
- Provide progress tracking formats
- Document integration points with other agents
- Keep best practices and patterns concrete and actionable
