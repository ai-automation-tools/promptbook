---
title: "💻 Supermaven Guide"
tags: ["agent-guides", "supermaven", "ide-extension"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
---

# Supermaven Guide

## Overview
Supermaven is an incredibly fast, context-aware AI coding assistant designed specifically as an IDE extension. It leverages a vast context window (up to 1 million tokens for Pro users) to deeply understand your codebase, offering rapid auto-completions and context-rich chat directly within your editor.

## Agent Configuration

### Basic Settings
- **Agent Name:** Supermaven
- **Model:** Supermaven custom models (Babble, etc.)
- **Temperature:** Managed internally by the extension
- **Context Window:** Up to 1,000,000 tokens (Pro tier)

### Tools & Permissions
- Tool 1: Code Completion (Read/Write access to active files)
- Tool 2: Codebase Indexing (Read access to workspace files for contextual understanding)
- Tool 3: Chat Interface (Read access for conversational guidance)

## System Prompt

```
You are Supermaven, an expert AI programming assistant integrated directly into the user's IDE.
Your primary responsibilities include:

1. Providing ultra-fast, context-aware code completions as the user types.
2. Understanding the full workspace context to ensure suggestions align with the project's architecture and conventions.
3. Answering user queries via the chat interface accurately and concisely based on the indexed codebase.

### Core Principles
- Speed: Deliver completions with minimal latency.
- Accuracy: Use the full context window to provide relevant and syntactically correct code.
- Unobtrusiveness: Suggestions should flow naturally with the user's typing.

### Capabilities
- Inline code completion
- Multi-file context understanding
- Conversational code explanation and generation

### Constraints
- DO NOT generate excessively long code blocks unless explicitly requested.
- ALWAYS respect the existing code style and formatting.
- NEVER suggest code that introduces obvious security vulnerabilities.

### Response Format
- Completions: Inserted directly into the editor.
- Chat: Markdown formatted, with code blocks properly highlighted.

### Error Handling
When encountering ambiguous requests, you should:
1. Ask for clarification if in chat mode.
2. Provide the most likely completion based on the current file's context if in completion mode.
```

## Workflow

### Initialization
1. Install the Supermaven extension from the IDE marketplace.
2. Sign in to your Supermaven account to activate the free or Pro tier.
3. Allow the extension to index the initial workspace.

### Standard Operating Procedure

#### Phase 1: Context Indexing
- The extension quietly indexes the open files and workspace in the background.
- It updates the index incrementally as files are modified.

#### Phase 2: Active Coding
- As the user types, Supermaven predicts the next tokens and displays a ghost text completion.
- The user can accept the completion (usually with `Tab`) or continue typing to ignore it.

#### Phase 3: Chat Interaction
- The user opens the Supermaven chat panel to ask complex questions or request code generation.
- Supermaven responds using the full project context to provide accurate answers.

### Decision Trees

**When Ghost Text Appears:**
- Action: User reviews suggestion.
- Reason: To determine if the completion saves time and is correct.

**When Complex Refactoring is Needed:**
- Action: User opens chat and prompts for refactoring.
- Reason: Chat provides a better interface for discussing and generating large changes.

## Example Interactions

### Example 1: Inline Completion

**User Input:**
```javascript
function calculateTotal(items) {
  // calculate sum of item prices
```

**Agent Response (Ghost Text):**
```javascript
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Example 2: Chat Request

**User Input:**
```
How is the user authentication handled in this project?
```

**Agent Response:**
```
Based on your codebase, user authentication is handled in `src/auth/auth.service.ts` using JWT tokens.
The `login` function validates the user's credentials against the database and returns a signed token with a 1-hour expiration.
```

## Best Practices

### For Users
- Keep your workspace reasonably sized or use `.gitignore` to prevent indexing irrelevant files (like build artifacts or massive datasets).
- Type descriptive variable names and comments; Supermaven uses these heavily for context.
- Use the Pro tier if you have a massive monorepo that exceeds the free tier's context limits.

### For Developers
- Ensure your project structure is logical so the indexing can easily find related components.
- Write clear docstrings for complex functions.

## Customization Options

### Variables
- `supermaven.enableChat`: Enable or disable the chat interface panel.
- `supermaven.completionDelay`: Adjust the delay before ghost text appears (if supported by the specific IDE extension version).

## Troubleshooting

### Common Issues

**Issue 1: Completions are slow or not appearing**
- **Cause:** Network issues or the indexing service is overloaded.
- **Solution:** Check your internet connection and verify the extension status in the IDE's bottom status bar.

**Issue 2: Chat doesn't know about a recently added file**
- **Cause:** The file hasn't been indexed yet.
- **Solution:** Open the file in the editor or wait a moment for the background indexer to catch up.

## Integration

### With Other Agents
- **Linters/Formatters**: Works alongside ESLint or Prettier; user accepts Supermaven's code, and the formatter cleans it up on save.

### With External Tools
- **IDEs**: Integrates deeply with VS Code, JetBrains IDEs, and Neovim.

## Version History

- **v1.0** (2024-02): Initial release featuring ultra-fast completions.

## References

- [Supermaven Official Website](https://supermaven.com/)
- [Supermaven Documentation](https://supermaven.com/docs)
