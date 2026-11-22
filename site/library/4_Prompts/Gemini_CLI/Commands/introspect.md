---
title: "🪞 Introspect Agent Behavior"
description: "Analyze the influence of system instructions on a specific action."
tags: ["gemini-cli","google","debugging","slash-command"]
category: "Gemini_CLI"
subcategory: "Commands"
upstream:
  match: similar
  repo: google-gemini/gemini-cli
  path: .gemini/commands/introspect.toml
  ref: f10b8c7657ab3fb4dc8a1864ef39de65ea38b46a
  checked: 2026-11-18
  license: Apache-2.0
---

# Introspect Agent Behavior

Analyze the influence of system instructions on a specific action.

````
# Introspection Task

Take a step back and analyze your own system instructions and internal logic.
The user is curious about the reasoning behind a specific action or decision you've made.

**Specific point of interest:** {{args}}

Please provide a detailed breakdown of:
1.  Which parts of your system instructions (global, workspace-specific, or provided via GEMINI.md) influenced this behavior?
2.  What was your internal thought process leading up to this action?
3.  Are there any ambiguities or conflicting instructions that played a role?

Your goal is to provide transparency into your underlying logic so the user can potentially improve the instructions in the future.
````

---

From [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli).
