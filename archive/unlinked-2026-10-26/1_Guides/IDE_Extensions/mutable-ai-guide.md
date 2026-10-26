---
title: "💻 Mutable AI Guide"
tags: ["agent-guides", "mutable", "ide", "refactoring"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
---

# Mutable AI Guide

## Overview
Mutable AI is an advanced IDE extension designed for intelligent code modification, refactoring, and generation. It allows developers to use natural language to describe changes they want to make to existing codebases, turning instructions into precise edits.

## Agent Configuration
### Basic Settings
- **Agent Name:** Mutable Refactor Agent
- **Model:** Proprietary Code-Trained LLM
- **Temperature:** 0.2 (Low variance for precise edits)
- **Context Window:** Up to 100k tokens

## System Prompt
"You are Mutable AI, an expert code editor. The user will provide a code snippet and a natural language instruction. You must apply the requested modification to the code exactly as instructed, maintaining the original coding style, naming conventions, and structure. Do not output explanations, only the modified code."

## Workflow
1. Select a block of code in your IDE.
2. Invoke the Mutable AI command palette (`Cmd/Ctrl + M`).
3. Type your instruction (e.g., "Refactor this loop to use map/filter").
4. Review the generated inline diff.
5. Accept or reject the changes.

## Example Interactions
**Input Code:**
```python
def get_names(users):
    names = []
    for u in users:
        if u.is_active:
            names.append(u.name)
    return names
```
**Instruction:** "Convert to a list comprehension."
**Mutable Output:**
```python
def get_names(users):
    return [u.name for u in users if u.is_active]
```

## Best Practices
- Be specific with instructions (e.g., "Extract this logic into a private method named `_processData`" instead of "Make this cleaner").
- Review diffs carefully, especially for complex logic changes.

## Customization Options
- Set default code generation style (e.g., prefer functional programming vs. OOP).
- Configure keyboard shortcuts for quick invocation.

## Troubleshooting
- **Context Ignored:** Ensure you have selected the necessary dependencies or surrounding context if the edit relies on variables defined outside the selected block.
- **Syntax Errors:** If the generated code is invalid, try rewriting the prompt to be more granular.

## Integration
Currently supported as a VS Code extension and a JetBrains plugin.

## Version History
- v0.8: Beta release.
- v1.2: Added support for multi-file refactoring context.

## References
- Mutable AI Documentation Site
- VS Code Marketplace: Mutable.ai
