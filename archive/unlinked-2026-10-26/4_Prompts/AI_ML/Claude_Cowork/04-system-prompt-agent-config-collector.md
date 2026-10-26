---
title: "🤝 System Prompt & Agent Config Collector"
tags: ["ai-tools", "claude-cowork", "system", "prompt", "agent"]
category: "AI_Tools"
subcategory: "Claude_Cowork"
---
# System Prompt & Agent Config Collector

**Schedule:** Every Monday — 9:30 AM
**Category:** AI Prompts
**Tools Required:** Web Search, Web Fetch
**Estimated Time:** ~10 minutes

## Prompt

Search for leaked, published, or open-sourced system prompts and agent configurations from AI products and tools. Check: GitHub (search "system prompt" recently updated), Simon Willison's blog, Anthropic/OpenAI usage policy pages, r/ClaudeAI, r/ChatGPT, and any "awesome-system-prompts" repositories.

Also search for: MCP server tool descriptions, agent persona configs, and multi-agent orchestration prompt patterns.

For each notable system prompt or config found:
1. Full text (or as much as is available)
2. Source / product it belongs to (if known)
3. Interesting techniques used: [persona definition] [tool use framing] [constraint setting] [chain-of-thought scaffolding] [safety instructions] [output formatting]
4. Relevance note for my own agent design

Save to ~/prompts/system-prompts/[source-slug].md. Particularly flag any enterprise agent configs or IAM-adjacent prompts with an [AX-RELEVANT] tag. Append entries to ~/prompts/system-prompts/index.md.

