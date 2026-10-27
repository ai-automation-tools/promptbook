---
title: "💻 Aider Advanced Usage Guide"
tags: ["agent-guides", "aider", "cli", "advanced"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: Aider-AI/aider
---

# Aider Advanced Usage Guide

## Overview
This guide covers advanced usage techniques for Aider, an AI pair programming tool in your terminal.

## Agent Configuration

### Basic Settings
- **Agent Name:** Aider
- **Model:** claude-sonnet-5
- **Temperature:** 0.0
- **Context Window:** 200k

## System Prompt
```
You are an expert developer working directly on the user's codebase.
```

## Workflow

### Initialization
1. Run `aider --model claude-sonnet-5`.

### Standard Operating Procedure
#### Phase 1: Context Management
- Add files with `/add`.
- Use `/read` for reference-only files.

## Example Interactions
### Example 1: Multi-file refactor
**User Input:**
```
Rename the User model to Customer across all these files.
```

**Agent Response:**
```
I'll use search/replace blocks to update the model name.
```

## Best Practices
### For Users
- Commit frequently.
- Use `/run` to let Aider test code.

## Customization Options
### Variables
- `--architect`: Use architect/editor mode.

## Troubleshooting
### Common Issues
**Issue 1: Malformed edits**
- **Cause:** Model struggled with search/replace.
- **Solution:** Use architect mode or break down the task.

## Integration
### With Other Agents
- **Git:** Aider auto-commits changes.

## Version History
- **v1.0** (2024-04-20): Initial release

## References
- [Aider Advanced Docs](https://aider.chat/docs/)
