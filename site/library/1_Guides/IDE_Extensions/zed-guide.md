---
title: "💻 Zed IDE AI Guide"
tags: ["agent-guides", "zed", "ide"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: zed-industries/zed
---

# Zed IDE AI Guide

## Overview
This guide covers the setup and usage of AI features within the Zed IDE. Learn how to configure your AI models, utilize the assistant panel, and improve your productivity.

## Agent Configuration

### Basic Settings
- **Agent Name:** Zed Assistant
- **Model:** claude-sonnet-5 (recommended)
- **Temperature:** 0.2
- **Context Window:** 200,000 tokens

## System Prompt
```
You are an expert AI programming assistant integrated directly into the Zed IDE.
Focus on providing correct, idiomatic code snippets and explaining concepts clearly.
```

## Workflow

### Initialization
1. Open Zed Settings (`Cmd+,`).
2. Navigate to the Assistant configuration.
3. Select your preferred provider and input your API key.

### Standard Operating Procedure
#### Phase 1: Code Generation
- Highlight code or place your cursor.
- Invoke the inline assistant.
- Provide a clear prompt for what you want generated.

## Example Interactions
### Example 1: Refactoring Code
**User Input:**
```
Refactor this function to be more efficient.
```

**Agent Response:**
```
I have optimized the loop by utilizing a list comprehension.
```

## Best Practices
### For Users
- Be specific in your prompts.
- Review generated code before accepting.
- Utilize context by opening relevant files.

## Customization Options
### Variables
- `assistant.provider`: Choose between Anthropic, OpenAI, etc.
- `assistant.model`: Specify the exact model string.

## Troubleshooting
### Common Issues
**Issue 1: API Key Invalid**
- **Cause:** Typo in the configuration or expired key.
- **Solution:** Re-enter the API key in settings.

## Integration
### With Other Agents
- **Language Servers:** Zed Assistant works alongside standard LSPs.

## Version History
- **v1.0** (2024-04-20): Initial release

## References
- [Zed Documentation](https://zed.dev/docs)
