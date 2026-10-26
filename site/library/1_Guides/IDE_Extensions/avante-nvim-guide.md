---
title: "🌌 Avante.nvim Guide"
tags: ["agent-guides", "neovim", "avante", "ide"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: yetone/avante.nvim
---

# Avante.nvim Guide

## Overview
Avante.nvim is an AI-powered Neovim plugin designed to act as your intelligent coding assistant directly within your terminal. Similar to Cursor but built natively for Neovim, it allows you to converse with LLMs about your codebase, generate code, and apply edits directly to your buffers.

## Agent Configuration

### Basic Settings
- **Agent Name:** Avante Assistant
- **Model:** Anthropic Claude Sonnet 5 (default and highly recommended for coding)
- **Temperature:** Managed by the plugin (typically low for coding)
- **Context Window:** Relies on Claude's 200k context window

### Tools & Permissions
- Tool 1: Buffer Read/Write (to apply AI suggestions)
- Tool 2: LSP Integration (to understand project structure and errors)
- Tool 3: API Access (requires `ANTHROPIC_API_KEY` or other provider keys)

## System Prompt

```xml
<system_info>
You are Avante, an expert coding assistant embedded in Neovim. Your goal is to help the user write, refactor, and understand code. Provide concise explanations and produce high-quality, idiomatic code snippets that can be directly applied to the user's buffer. Pay close attention to the context provided by the surrounding code and LSP diagnostics.
</system_info>
```

## Workflow

1. **Invocation**: Open the Avante chat window or use visual selection to ask about specific code.
2. **Context Gathering**: Avante automatically pulls in the current buffer, selected text, and relevant project context.
3. **Conversation**: Discuss architecture, ask for bug fixes, or request new features.
4. **Application**: Review the generated code diff and use Avante's commands to apply, reject, or modify the changes in your buffer.

## Example Interactions

### Example 1: Refactoring a Function
**User Action:** Visually select a complex function and invoke Avante (`<leader>aa`).
**Prompt:** "Refactor this function to be more readable and extract the inner loop into a separate helper."
**Avante Output:** *Provides a diff showing the original function replaced by a cleaner version and the new helper function.*
**User Action:** Accept the diff.

## Best Practices

- **Provide Context**: Use visual selection before invoking Avante to give it targeted context.
- **Review Diffs**: Always carefully review the side-by-side diffs Avante generates before applying them to your source files.
- **Use Provider Aliases**: Configure `.env` files locally to switch between Anthropic, OpenAI, or local models via Ollama depending on the task.

## Customization Options

- **Provider Selection**: Configure `setup({ provider = "claude" })` in your Neovim config.
- **Keymaps**: Customize the default keymaps for opening chat, applying diffs, and clearing history.
- **UI Tweaks**: Adjust the width, layout, and highlighting of the Avante sidebar.

## Troubleshooting

- **Authentication Errors**: Ensure your API key environment variables (e.g., `ANTHROPIC_API_KEY`) are exported in your shell before launching Neovim.
- **Build Failures**: Avante requires Rust to build its core dependency. Ensure `cargo` is installed and up to date.

## Integration

Avante integrates tightly with Neovim's native LSP, Treesitter for syntax awareness, and cmp for autocomplete suggestions.

## Version History

- **v0.0.x**: Initial experimental releases.
- **v0.1.0**: Stable release with dual-pane diff viewer and multi-provider support.

## References

- [Avante.nvim GitHub Repository](https://github.com/yetone/avante.nvim)
- [Neovim Documentation](https://neovim.io/doc/)
