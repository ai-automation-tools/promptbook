---
title: "Cline AI IDE Extension Guide"
tags: ["ide", "extension", "cline", "ai-assistant"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: cline/cline
---

# Cline AI IDE Extension Guide

## Overview
Cline is an autonomous coding agent right in your IDE, capable of creating and editing files, running commands, and more with your permission.

## Agent Configuration
Configuration happens via the `.cline` settings file or the extension UI in Visual Studio Code. You can specify API keys and preferred AI models directly in the UI.

## System Prompt
Cline uses a dynamically generated system prompt based on your workspace context, which is automatically injected based on the open files and workspace configuration.

## Workflow
1. Open the Cline panel in your IDE.
2. Provide a clear and specific task description.
3. Review the proposed file changes and shell commands.
4. Approve the changes for Cline to execute them.

## Example Interactions
User: "Create a new React component for a primary button with Tailwind CSS styling."
Cline: "I will create a new file named `PrimaryButton.tsx` in the `src/components` directory. Here is the code..."

## Best Practices
- Provide clear, scoped tasks to avoid confusion.
- Keep the context window manageable by closing unnecessary files.
- Always review commands before allowing them to run.

## Customization Options
- You can set custom API keys and switch between models like Claude Sonnet 5 and GPT-5.6 Sol.
- Configure automatic formatting after code generation.

## Troubleshooting
- If Cline gets stuck, clear the context history and restart the task from the beginning.
- Ensure your API key has sufficient credits and is valid.

## Integration
- Integrates seamlessly with VS Code and Cursor IDE.
- Can be triggered via keyboard shortcuts for faster workflow.

## Version History
- v1.0.0: Initial guide release for Cline.

## References
- https://github.com/cline/cline
- VS Code Marketplace Extension Page
