---
title: "💻 Continue.dev VSCode Extension"
tags: ["ide", "continue", "vscode"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: continuedev/continue
---

# Continue.dev VSCode Extension

## Overview
Continue is an open-source autopilot for VS Code and JetBrains. This guide focuses on setting it up for VS Code.

## Agent Configuration
Configure your models in `~/.continue/config.json`. You can add OpenAI, Anthropic, Ollama, or custom providers.

## System Prompt
The system prompt is highly customizable via the configuration file to tailor the assistant's behavior.

## Workflow
1. Install the Continue extension from the VS Code Marketplace.
2. Open the sidebar and configure your preferred models.
3. Highlight code and press `Cmd+L` (or `Ctrl+L`) to chat about the code.
4. Press `Cmd+I` (or `Ctrl+I`) to use inline edit.

## Example Interactions
- **Highlighting Code:** Select a function, press Cmd+L, and ask "Explain what this does."
- **Inline Editing:** Select a block, press Cmd+I, and type "Refactor this to use async/await."

## Best Practices
- Connect local models via Ollama for privacy-sensitive codebases.
- Provide clear context by highlighting relevant code before asking questions.

## Customization Options
- Add custom commands to automate repetitive tasks.
- Provide custom context providers.

## Troubleshooting
- Check the output logs in VS Code if the extension fails to connect to local models.

## Integration
Integrates with numerous API providers and local model runners.

## Version History
- Version 1.0.0

## References
- [Continue Documentation](https://continue.dev/docs)
