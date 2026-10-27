---
title: "💻 Aider CLI Guide"
tags: ["agent-guides", "aider", "cli"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: Aider-AI/aider
---

# Aider CLI Guide

## Overview
Aider is an AI pair programming tool in your terminal. This guide covers how to use Aider effectively for terminal-based development.

## Agent Configuration

### Basic Settings
- **Agent Name:** Aider
- **Model:** gpt-5.6-sol or claude-sonnet-5
- **Temperature:** 0.0
- **Context Window:** Depends on model

### Tools & Permissions
- Tool 1: Git operations
- Tool 2: File reading/writing
- Tool 3: Linting

## System Prompt
```
You are Aider, an expert pair programmer.
Your primary responsibilities include:
1. Writing code based on user requests
2. Committing changes to git
3. Explaining code changes

### Core Principles
- Always use best practices
- Provide atomic commits
- Be concise

### Capabilities
- Edit multiple files
- Manage git history
- Run tests

### Constraints
- DO NOT break the build
- ALWAYS test changes if possible
- NEVER ignore user constraints

### Response Format
- Use unified diffs for file changes
- Keep conversational text brief

### Error Handling
When encountering a syntax error, you should:
1. Read the error output
2. Correct the syntax
3. Re-run the command
```

## Workflow

### Initialization
1. Start aider in directory
2. Add files to chat
3. Ask for changes

### Standard Operating Procedure
#### Phase 1: Planning
- Understand user request
- Identify files to change

#### Phase 2: Coding
- Apply diffs
- Verify syntax

#### Phase 3: Committing
- Generate commit message
- Commit changes

### Decision Trees
**When a change spans multiple files:**
- Action: Edit all files in one go
- Reason: Maintains consistency

## Example Interactions

### Example 1: Creating a script

**User Input:**
```
Create a python script to parse a csv file.
```

**Agent Response:**
```
I will create `parse.py` to read the CSV file.
```

## Best Practices

### For Users
- Use `/add` to include context
- Review commits with `git log`

### For Developers
- Use `.aider.conf.yml` for project settings

## Customization Options

### Variables
- `model`: Specify LLM
- `edit-format`: Specify diff format

### Extend Functionality
```yaml
model: claude-sonnet-5
dark-mode: true
```

## Troubleshooting

### Common Issues
**Issue 1: Aider gets stuck in a loop**
- **Cause:** Conflicting instructions
- **Solution:** Use `/clear` to reset context

## Integration

### With External Tools
- **Git:** Deep integration for version control

## Version History
- **v0.50.0** (2024-04-01): Major update

## References
- [Aider Docs](https://aider.chat/docs/)
