---
title: "📚 Aider CLI Setup Guide"
tags: ["cli_tools", "new"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: Aider-AI/aider
---

# Aider CLI Setup Guide

## Overview
Guide to configuring Aider for terminal-based AI-assisted coding.

## Setup Instructions
1. Install via pip: `pip install aider-chat`
2. Configure API keys (e.g., `export ANTHROPIC_API_KEY=...`)
3. Run `aider` in your git repository

## Integration Points
- Git for automatic commits
- Tree-sitter for repository context

## Example JSON Protocol
```json
{
  "command": "aider",
  "args": ["--model", "claude-sonnet-5", "--no-auto-commits"],
  "task": "Add tests to src/app.py"
}
```
