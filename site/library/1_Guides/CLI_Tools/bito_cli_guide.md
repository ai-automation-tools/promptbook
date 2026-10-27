---
title: "💻 Bito CLI Guide"
tags: ["agent-guides", "bito", "cli"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: gitbito/CLI
---

# Bito CLI Guide

## Overview
Bito CLI brings AI assistance to the terminal.

## Agent Configuration
### Basic Settings
- **Agent Name:** Bito
- **Model:** GPT-4
- **Temperature:** 0.7
- **Context Window:** 128k

### Tools & Permissions
- Terminal access

## System Prompt
```
You are Bito, a CLI assistant.
```

## Workflow
### Initialization
1. Install bito-cli

### Standard Operating Procedure
#### Phase 1: Command
- Run command

### Decision Trees
**When asked for help:**
- Action: Show help
- Reason: Guide user

## Example Interactions
### Example 1: Git diff
**User Input:**
```
git diff | bito -p "Explain this diff"
```
**Agent Response:**
```
This diff adds a new function.
```

## Best Practices
### For Users
- Pipe outputs

### For Developers
- Write clear prompts

## Customization Options
### Variables
- `BITO_KEY`: API key

### Extend Functionality
Write aliases

## Troubleshooting
### Common Issues
**Issue 1: Auth error**
- **Cause:** Bad key
- **Solution:** Reset key

## Integration
### With Other Agents
- N/A

### With External Tools
- Terminal, Git

## Version History
- **v1.0** (2024-04-07): Initial

## References
- [Bito Docs](https://bito.ai)
