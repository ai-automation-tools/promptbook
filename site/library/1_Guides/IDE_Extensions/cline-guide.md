---
title: "💻 Cline Guide"
tags: ["agent-guides", "cline", "ide-extension"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: cline/cline
checked: 2026-11-21
---

# Cline Guide

## Overview
Cline is an open-source autonomous coding agent. It ships as a VS Code extension (the focus of this guide), a JetBrains plugin, a CLI (`npm i -g cline`) and a desktop app, all with human-in-the-loop approval for file edits and commands. This guide explains how to configure and interact effectively with Cline to streamline software development tasks, such as refactoring, feature implementation, and debugging.

## Agent Configuration

### Basic Settings
- **Agent Name:** Cline
- **Model:** Your choice of provider (Anthropic, OpenAI, OpenRouter and others), set in the extension settings with your API key
- **Context Window:** Depends on the model

### Tools & Permissions
- Tool 1: File system access (Read/Write)
- Tool 2: Terminal command execution (with explicit confirmation)
- Tool 3: Browser preview (for frontend development)

## System Prompt

```
You are Cline, an expert software engineering assistant. Your primary responsibilities include:

1. Writing, reviewing, and refactoring code
2. Diagnosing and resolving complex bugs
3. Generating tests and verifying functionality

### Core Principles
- Strive for simple, maintainable solutions
- Think step by step before implementing
- Always verify your work by running tests or type checkers

### Capabilities
- Read and analyze files
- Execute terminal commands
- Browse internal documentation via search

### Constraints
- DO NOT execute commands that could lead to data loss without extreme caution
- ALWAYS ask for permission before running potentially destructive commands
- NEVER hardcode secrets or credentials in generated code

### Response Format
- Provide clear, concise explanations
- Include code blocks with proper syntax highlighting

### Error Handling
When encountering test failures, you should:
1. Read the error message carefully
2. Trace the error to its source
3. Propose and test a fix
```

## Workflow

### Initialization
1. Open the Cline panel in VS Code
2. Add your API key and select the desired AI model
3. Provide initial instructions and context files

### Standard Operating Procedure

#### Phase 1: Context Gathering
- Read relevant source code files
- Run search queries to find usages
- Review existing tests

#### Phase 2: Implementation
- Draft code changes
- Write unit tests
- Apply changes to the file system

#### Phase 3: Verification
- Run test suite
- Fix any failing tests or lint errors
- Request user review

## Example Interactions

### Example 1: Refactoring a React Component

**User Input:**
```
Refactor the UserProfile component in src/components/UserProfile.tsx to use functional components and hooks instead of class components.
```

**Agent Response:**
```
I'll refactor `UserProfile.tsx` to use functional components and React hooks. First, I'll read the file to understand its current state.
```

## Best Practices

### For Users
- Provide explicit file paths when referencing code
- Review the planned terminal commands before approving
- Keep requests scoped to single logical changes
- Tune auto-approve settings per action type (for example, read-only commands only)

### For Developers
- Maintain clean, self-documenting code to help Cline understand context
- Configure test commands that Cline can easily invoke
- Put project-specific guidelines in `.clinerules`

## Customization Options

### Variables
- `[API_KEY]`: Your API key for the chosen LLM provider

## Troubleshooting

### Common Issues

**Issue 1: Cline fails to modify a file**
- **Cause:** Missing file permissions
- **Solution:** Check the file is writable, then retry

**Issue 2: Context window full**
- **Cause:** Too many large files open or very long conversation history
- **Solution:** Clear the conversation or explicitly exclude unnecessary files from context

## Version History

- Checked 2026-11-21 against the Cline README (surfaces: VS Code, JetBrains, CLI, desktop app)

## References

- [Cline Official Repository](https://github.com/cline/cline)
- [Cline Docs](https://docs.cline.bot)
