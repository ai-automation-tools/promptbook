---
title: "💻 [Guide Title]"
tags: ["agent-guides", "platform-name", "domain"]
category: "Agent_Guides"
subcategory: "[Agent_Platform]"  # e.g., Claude_Code, Codex, Cursor, etc.
repo: [owner/repo]  # the GitHub repo of the tool this guide documents; shown as the link at the top of the card
---

# [Guide Title]

## Overview
[Brief description of what this guide covers - could be agent configuration, platform documentation, CLI reference, or usage instructions. Explain what users will learn.]

## Agent Configuration

### Basic Settings
- **Agent Name:** [Agent Name]
- **Model:** [Recommended model, e.g., claude-sonnet-4, gpt-4, etc.]
- **Temperature:** [0.0 - 1.0]
- **Context Window:** [Token limit if relevant]

### Tools & Permissions
[List the tools, APIs, or capabilities this agent needs access to]

- Tool 1: [Purpose and permission level]
- Tool 2: [Purpose and permission level]
- Tool 3: [Purpose and permission level]

## System Prompt

```
[The complete system prompt that defines the agent's behavior, role, and constraints]

You are [Agent Name], an expert in [domain/specialty]. Your primary responsibilities include:

1. [Responsibility 1]
2. [Responsibility 2]
3. [Responsibility 3]

### Core Principles
- [Principle 1: Description]
- [Principle 2: Description]
- [Principle 3: Description]

### Capabilities
[List what the agent can do]
- [Capability 1]
- [Capability 2]
- [Capability 3]

### Constraints
[Define boundaries and limitations]
- DO NOT [constraint 1]
- ALWAYS [requirement 1]
- NEVER [constraint 2]

### Response Format
[How the agent should structure its responses]
- [Format requirement 1]
- [Format requirement 2]

### Error Handling
When encountering [situation], you should:
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

## Workflow

### Initialization
[Steps the agent should take when first activated]

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Standard Operating Procedure
[The typical workflow or process the agent follows]

#### Phase 1: [Phase Name]
- [Action 1]
- [Action 2]
- [Action 3]

#### Phase 2: [Phase Name]
- [Action 1]
- [Action 2]
- [Action 3]

#### Phase 3: [Phase Name]
- [Action 1]
- [Action 2]
- [Action 3]

### Decision Trees
[Key decision points and how the agent should handle them]

**When [Condition A]:**
- Action: [What to do]
- Reason: [Why]

**When [Condition B]:**
- Action: [What to do]
- Reason: [Why]

## Example Interactions

### Example 1: [Scenario Name]

**User Input:**
```
[Sample user request]
```

**Agent Response:**
```
[Expected agent response following the defined behavior]
```

**Agent Actions:**
- [Internal action 1]
- [Internal action 2]

### Example 2: [Scenario Name]

**User Input:**
```
[Sample user request]
```

**Agent Response:**
```
[Expected agent response]
```

## Best Practices

### For Users
- [Best practice 1 when interacting with this agent]
- [Best practice 2]
- [Best practice 3]

### For Developers
- [Best practice 1 when configuring or extending this agent]
- [Best practice 2]
- [Best practice 3]

## Customization Options

### Variables
[Configurable parameters that can be adjusted]

- `[VARIABLE_NAME]`: [Description and default value]
- `[VARIABLE_NAME]`: [Description and default value]

### Extend Functionality
[How to add additional capabilities or modify behavior]

```
[Code or configuration example for extending the agent]
```

## Troubleshooting

### Common Issues

**Issue 1: [Problem description]**
- **Cause:** [Why it happens]
- **Solution:** [How to fix]

**Issue 2: [Problem description]**
- **Cause:** [Why it happens]
- **Solution:** [How to fix]

## Integration

### With Other Agents
[How this agent works alongside other agents]

- **[Agent Name]**: [Relationship and interaction pattern]
- **[Agent Name]**: [Relationship and interaction pattern]

### With External Tools
[APIs, services, or tools this agent integrates with]

- **[Tool Name]**: [Purpose and usage]
- **[Tool Name]**: [Purpose and usage]

## Version History

- **v1.0** ([Date]): Initial release
  - [Feature or change 1]
  - [Feature or change 2]

## References

- [Documentation link 1]
- [Documentation link 2]
- [Related resource 3]

---

**Note:** Replace all [bracketed placeholders] with your specific content. Remember to:
- Use clear, descriptive agent name
- Match subcategory to the agent platform (Claude_Code, Codex, etc.)
- Include detailed system prompt that defines behavior
- Provide concrete examples of agent interactions
- Document all configuration options and constraints
