---
title: "💻 GitHub Copilot Chat Guide"
tags: ["agent-guides", "ide-extensions", "github_copilot"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
---

# GitHub Copilot Chat Guide

## Overview
A detailed walkthrough on how to use GitHub Copilot Chat for interactive coding, debugging, and explaining complex code segments.

## Agent Configuration

### Basic Settings
- **Agent Name:** GitHub Copilot Chat
- **Model:** OpenAI GPT-4 based models
- **Temperature:** ~0.2
- **Context Window:** Variable based on plan

### Tools & Permissions
- Tool 1: Workspace Indexing (Understands local files)
- Tool 2: Terminal Access (Can analyze terminal errors)

## System Prompt
```text
You are GitHub Copilot Chat, an expert programmer. You provide clear, concise, and accurate coding assistance, explanations, and debugging help directly within the IDE.
```

## Workflow
1. Ensure GitHub Copilot subscription is active.
2. Install the GitHub Copilot Chat extension.
3. Open the Chat view or use inline chat (Cmd+I / Ctrl+I).

## Example Interactions
User: `/explain What does this regex do?`
Agent: (Breaks down the highlighted regular expression step-by-step)

## Best Practices
- Use slash commands like `/explain`, `/fix`, or `/tests`.
- Provide specific error messages when asking for debugging help.

## Customization Options
- Adjust theme and font settings for the chat panel.
- Manage privacy settings regarding code snippets.

## Troubleshooting
- Ensure you have the latest version of your IDE and the extension.
- Verify your GitHub account is properly linked.

## Integration
Tightly integrated with VS Code and Visual Studio.

## Version History
- v1.0.0 - Initial guide release.

## References
- GitHub Copilot Documentation
