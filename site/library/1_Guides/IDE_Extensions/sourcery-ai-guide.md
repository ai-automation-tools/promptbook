---
title: "💻 Sourcery AI Guide"
tags: ["agent-guides", "sourcery", "python", "refactoring"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: sourcery-ai/sourcery
---

# Sourcery AI Guide

## Overview
Sourcery is an automated code reviewer and refactoring tool specifically optimized for Python (with growing support for other languages). It analyzes code on the fly and suggests continuous, idiomatic improvements to make code cleaner, more readable, and Pythonic.

## Agent Configuration
### Basic Settings
- **Agent Name:** Sourcery Linter & Refactor
- **Model:** Specialized AST & ML Hybrid
- **Temperature:** N/A (Rule-based and deterministic ML)
- **Context Window:** File-level AST

## System Prompt
"Analyze the provided Python AST. Identify anti-patterns, overly complex control flow, and opportunities for Pythonic idioms (e.g., list comprehensions, `any()`/`all()`, dict `.get()`). Output the suggested refactored AST node and a brief, standardized explanation of the improvement."

## Workflow
1. Install the Sourcery extension in your IDE.
2. Sourcery runs automatically in the background as you type.
3. When an improvement is found, a subtle underline or lightbulb icon appears.
4. Hover over the suggestion to see the refactored code and the explanation.
5. Click to apply the refactoring instantly.

## Example Interactions
**Original Code:**
```python
found = False
for item in my_list:
    if item == target:
        found = True
        break
```
**Sourcery Suggestion:** "Replace loop with `in` operator."
**Refactored Code:**
```python
found = target in my_list
```

## Best Practices
- Use Sourcery's bulk refactoring tool on legacy codebases to quickly apply idiomatic patterns across the entire project.
- Configure Sourcery to run as a pre-commit hook to ensure all committed code meets quality standards.

## Customization Options
- Customize or disable specific refactoring rules via a `.sourcery.yaml` configuration file in the project root.
- Set complexity thresholds to trigger warnings for overly complex functions.

## Troubleshooting
- **Suggestions Not Applying:** Ensure the Sourcery daemon is running. Try restarting the IDE if it hangs.
- **Conflicts with Black/Flake8:** Sourcery is generally compatible, but if conflicts occur, you can tweak `.sourcery.yaml` to disable formatting-specific rules.

## Integration
Integrates with VS Code, PyCharm, Sublime Text, Vim, and GitHub (via Sourcery CI bot).

## Version History
- v1.0: Initial Python refactoring engine.
- v2.0: Introduced custom rules via `.sourcery.yaml`.

## References
- Sourcery Official Docs
- Python Anti-Patterns Guide
