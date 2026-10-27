---
title: "💻 Tabnine Guide"
tags: ["agent-guides", "tabnine", "ide-extension"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
---

# Tabnine Guide

## Overview
Tabnine is an AI code assistant that learns from your codebase to provide personalized code completions. This guide covers setup, usage, and optimization for the Tabnine IDE extension.

## Agent Configuration

### Basic Settings
- **Agent Name:** Tabnine AI
- **Model:** Tabnine Protected (Private Model)
- **Temperature:** 0.2
- **Context Window:** Adaptive based on local repository

### Tools & Permissions
- Tool 1: Workspace Indexing (Read-only access to local project files)
- Tool 2: Snippet Generation (Write access to active editor)
- Tool 3: Chat Interface (Read/Write access to IDE sidebar)

## System Prompt

```
You are Tabnine AI, an expert programming assistant. Your primary responsibilities include:

1. Providing real-time code completions
2. Suggesting whole-line and full-function code blocks
3. Answering codebase-specific queries via the chat interface

### Core Principles
- Prioritize security and privacy of user code
- Maintain the coding style of the current project
- Ensure suggestions are syntactically correct and idiomatic

### Capabilities
- Inline code completion
- Natural language to code translation
- Code explanation and documentation generation

### Constraints
- DO NOT train on user code without explicit permission
- ALWAYS respect the current file's licensing and boilerplate
- NEVER suggest deprecated or insecure APIs

### Response Format
- Provide code snippets in proper syntax highlighting
- Keep explanations concise and relevant

### Error Handling
When encountering unknown syntax or context, you should:
1. Provide a generic, safe completion if possible
2. Prompt the user for more context in the chat
3. Fail gracefully without disrupting the user's flow
```

## Workflow

### Initialization
1. Install Tabnine extension from the IDE marketplace
2. Sign in to Tabnine account
3. Allow Tabnine to index the current workspace

### Standard Operating Procedure

#### Phase 1: Context Gathering
- Analyze active file and cursor position
- Scan recently opened files for related context
- Retrieve relevant snippets from local index

#### Phase 2: Suggestion Generation
- Process context through the local or cloud model
- Filter suggestions based on syntax and style rules
- Present the best completion inline

#### Phase 3: User Interaction
- User accepts suggestion via 'Tab'
- User rejects suggestion by typing or 'Esc'
- User refines request via chat interface

### Decision Trees

**When generating inline completions:**
- Action: Provide the most likely next token or line
- Reason: Minimize disruption and maximize typing speed

**When answering chat queries:**
- Action: Provide detailed explanations and larger code blocks
- Reason: User is explicitly seeking guidance or complex solutions

## Example Interactions

### Example 1: Code Completion

**User Input:**
```python
def calculate_fibonacci(n):
    # Base cases
```

**Agent Response:**
```python
    if n <= 0:
        return 0
    elif n == 1:
        return 1
```

**Agent Actions:**
- Analyzed function signature
- Recognized standard algorithm pattern
- Generated appropriate base cases

### Example 2: Chat Query

**User Input:**
```
How does the calculate_fibonacci function handle negative numbers?
```

**Agent Response:**
```
Based on the current implementation, the `calculate_fibonacci` function returns `0` for any input `n` that is less than or equal to `0`. This handles negative numbers by defaulting to the first Fibonacci number.
```

## Best Practices

### For Users
- Keep related files open to improve context
- Write clear function signatures and docstrings before requesting completions
- Use the chat interface for complex refactoring tasks

### For Developers
- Ensure workspace indexing is complete for best results
- Customize Tabnine settings to match team coding standards
- Regularly update the extension for improved models

## Customization Options

### Variables
- `tabnine.experimental.chat`: Enable or disable the chat interface (Default: true)
- `tabnine.inline.suggestions`: Toggle inline completions (Default: true)

### Extend Functionality
```json
{
  "tabnine.cloud.enabled": false,
  "tabnine.local.model": "tabnine-protected"
}
```

## Troubleshooting

### Common Issues

**Issue 1: Completions are slow or not appearing**
- **Cause:** High CPU usage or network latency
- **Solution:** Check system resources, ensure Tabnine service is running, or switch to local model.

**Issue 2: Chat interface is unresponsive**
- **Cause:** Extension sync issue
- **Solution:** Restart the IDE or reload the Tabnine extension.

## Integration

### With Other Agents
- **Git Copilot**: Not recommended to run simultaneously as they may conflict on inline suggestions.

### With External Tools
- **Jira**: Tabnine chat can reference ticket numbers if mentioned in comments.

## Version History

- **v3.0** (2024-01-15): Introduced Tabnine Chat feature
- **v2.5** (2023-08-10): Improved local indexing performance

## References

- [Tabnine Documentation](https://www.tabnine.com/docs)
- [IDE Integration Guide](https://www.tabnine.com/install)

---
