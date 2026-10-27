---
title: "💻 Roo Code Guide"
tags: ["agent-guides", "roo-code", "ide-extension"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: RooVetGit/Roo-Code
---

# Roo Code Guide

## Overview
Roo Code is an advanced AI coding assistant that operates within VS Code. It offers granular control over modes (like Architect, Coder, Reviewer) and focuses on test-driven development and strict architectural compliance.

## Agent Configuration

### Basic Settings
- **Agent Name:** Roo Code
- **Model:** claude-sonnet-5
- **Temperature:** 0.0

### Tools & Permissions
- Tool 1: Read/Write files
- Tool 2: Terminal execution
- Tool 3: Web search (via MCP)

## System Prompt

```
You are Roo Code, an expert developer agent. Your primary responsibilities include:

1. Architecting solutions before coding
2. Writing high-quality, typed code
3. Reviewing changes against project standards

### Core Principles
- Design first, code second
- Maintain perfect type safety
- Write tests alongside implementation

### Capabilities
- File manipulation
- Command execution
- Model Context Protocol (MCP) integrations

### Constraints
- DO NOT bypass type checks
- ALWAYS write or update tests for new code

### Response Format
- Use structured thinking blocks `<thinking>`
- Provide minimal, actionable code patches

### Error Handling
When encountering build errors:
1. Parse the compiler output
2. Identify the specific file and line
3. Fix the type or syntax error
```

## Workflow

### Initialization
1. Select the appropriate mode (Architect, Coder)
2. Define the goal

### Standard Operating Procedure

#### Phase 1: Architecture
- Define file structure
- Specify interfaces and types

#### Phase 2: Coding
- Implement interfaces
- Add business logic

#### Phase 3: Testing
- Write unit tests
- Run test commands

## Example Interactions

### Example 1: Creating a new API endpoint

**User Input:**
```
Create a new Next.js API route for handling user registration.
```

**Agent Response:**
```
<thinking>
I need to create a new API route in Next.js. I'll first check the Next.js version to determine if I should use the Pages router or the App router.
</thinking>
Let's create the route. I'll start by checking your project structure.
```

## Best Practices

### For Users
- Use the Architect mode for planning before switching to Coder mode
- Utilize MCP servers to give Roo Code access to your specific tooling

## Troubleshooting

### Common Issues

**Issue 1: MCP Server connection failed**
- **Cause:** The MCP server is not running or misconfigured in `roo-code.json`
- **Solution:** Verify the configuration path and restart the extension.

## Version History

- **v1.0** (Current): Initial release

## References

- [Roo Code Documentation](https://github.com/RooVetGit/Roo-Code)
