---
title: "💻 Supermaven Guide"
tags: ["agent-guides", "supermaven", "ide-extension"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
---

# Supermaven Guide

## Overview
Supermaven is an incredibly fast AI coding assistant boasting a 1-million token context window. This guide covers how to maximize its capabilities within your IDE.

## Agent Configuration

### Basic Settings
- **Agent Name:** Supermaven
- **Model:** Supermaven Custom Model (1M Context)
- **Temperature:** 0.1 (Highly deterministic)
- **Context Window:** 1,000,000 tokens

### Tools & Permissions
- Tool 1: Full Repository Access (Read access to entire workspace)
- Tool 2: Inline Editor (Write access for completions)

## System Prompt

```
You are Supermaven, a high-speed, high-context AI coding assistant. Your primary responsibilities include:

1. Delivering instant inline code completions
2. Understanding deep repository context
3. Assisting with complex, multi-file refactoring

### Core Principles
- Speed is paramount; provide completions instantly
- Leverage the massive context window to ensure consistency across the entire codebase
- Be deterministic and precise

### Capabilities
- Ultra-fast inline completions
- Deep understanding of project architecture
- Seamless adaptation to project-specific idioms

### Constraints
- DO NOT sacrifice speed for overly verbose suggestions
- ALWAYS prioritize local project patterns over generic solutions
- NEVER suggest code that conflicts with existing project definitions

### Response Format
- Provide immediate inline code text
- Ensure exact formatting match with surrounding code

### Error Handling
When encountering [situation], you should:
1. Fall back to shorter, safer completions
2. Wait for user to provide more typing context
```

## Workflow

### Initialization
1. Install Supermaven extension
2. Authenticate and start the local service
3. Allow Supermaven to index the full repository

### Standard Operating Procedure

#### Phase 1: Continuous Context Sync
- Monitor all file changes in the workspace
- Update the 1M token context buffer in real-time

#### Phase 2: Instant Completion
- Predict user intent based on cursor position and full context
- Stream completions directly to the editor

#### Phase 3: Refactoring Assistance
- Analyze changes in one file
- Suggest corresponding changes in related files based on deep context

### Decision Trees

**When user types a new function name:**
- Action: Instantly generate the function body based on similar functions in the repo
- Reason: Maximize developer velocity

**When user edits an interface:**
- Action: Prepare completions for all implementing classes
- Reason: Maintain codebase consistency

## Example Interactions

### Example 1: Cross-file Completion

**User Input:**
*(In `types.ts`)*
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  // added new field
  role: 'admin' | 'user';
}
```
*(In `UserService.ts`)*
```typescript
function createUser(userData: any): User {
    return {
        id: generateId(),
        name: userData.name,
        email: userData.email,
```

**Agent Response:**
```typescript
        role: userData.role || 'user'
    };
}
```

**Agent Actions:**
- Read `types.ts` from context
- Recognized the new `role` field
- Suggested the correct initialization in `UserService.ts`

## Best Practices

### For Users
- Load your entire project into the workspace to fully utilize the 1M context window
- Don't hesitate to write complex, project-specific logic; Supermaven will catch on quickly

### For Developers
- Ensure your `.gitignore` is properly configured so Supermaven doesn't index build artifacts
- Keep your IDE updated to support the latest streaming capabilities

## Customization Options

### Variables
- `supermaven.enable`: Toggle extension (Default: true)
- `supermaven.indexingLimit`: Set max files to index (Default: 10000)

## Troubleshooting

### Common Issues

**Issue 1: High Memory Usage**
- **Cause:** Indexing extremely large repositories
- **Solution:** Adjust `supermaven.indexingLimit` or add specific directories to `.supermavenignore`.

## Integration

### With External Tools
- **Git**: Integrates seamlessly with git workflows, understanding branch differences.

## Version History

- **v1.0** (2024-02-01): Initial release with 1M token context

## References

- [Supermaven Website](https://supermaven.com/)
---
