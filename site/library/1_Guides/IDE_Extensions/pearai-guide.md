---
title: "💻 PearAI Guide"
tags: ["agent-guides", "pearai", "ide"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: trypear/pearai-app
---

# PearAI Guide

## Overview
This guide covers PearAI, an open-source AI code editor fork of VS Code.

## Agent Configuration

### Basic Settings
- **Agent Name:** PearAI
- **Model:** Multi-model support
- **Temperature:** 0.3
- **Context Window:** Model dependent

## System Prompt
```
You are an expert pair programmer. Assist the user in writing and refactoring code.
```

## Workflow

### Initialization
1. Download PearAI.
2. Sign in or configure local models.

### Standard Operating Procedure
#### Phase 1: Chat
- Use the side panel to discuss code architecture.

## Example Interactions
### Example 1: Error explanation
**User Input:**
```
Why am I getting this TypeError?
```

**Agent Response:**
```
The error occurs because `x` is a string, not an integer.
```

## Best Practices
### For Users
- Provide files as context using `@`.

## Customization Options
### Variables
- `pearai.defaultModel`: Set default LLM.

## Troubleshooting
### Common Issues
**Issue 1: Context too large**
- **Cause:** Included too many large files.
- **Solution:** Remove unnecessary files from context.

## Integration
### With External Tools
- **VS Code Extensions:** Fully compatible.

## Version History
- **v1.0** (2024-04-20): Initial release

## References
- [PearAI Site](https://trypear.ai/)
