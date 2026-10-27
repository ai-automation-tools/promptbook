---
title: "Anthropic API Provider Guide"
tags: ["api", "anthropic", "claude"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: anthropics/anthropic-sdk-python
checked: 2026-10-27
---

# Anthropic API Provider Guide

## Overview
A comprehensive guide for using the Anthropic API with various CLI tools and custom scripts.

## Agent Configuration
Set your `ANTHROPIC_API_KEY` as an environment variable in your shell profile (e.g., `.bashrc` or `.zshrc`).

## System Prompt
System prompts are passed via the explicit `system` parameter in the API payload, separating instructions from the conversational messages array.

## Workflow
1. Initialize your HTTP client or Anthropic SDK.
2. Construct the messages array with user and assistant roles.
3. Send the request to the Messages API endpoint.
4. Parse the JSON response to extract the text content.

## Example Interactions
User runs: `curl https://api.anthropic.com/v1/messages -H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" -H "content-type: application/json" -d '{"model": "claude-sonnet-5-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello, Claude!"}]}'`

## Best Practices
- Use Claude Sonnet 5.5 (`claude-sonnet-5-5`) for speed-dependent tasks and Claude Opus 5.5 (`claude-opus-5-5`) for long-running agentic coding.
- Use Claude Fable 5.1 (`claude-fable-5-1`) for the most demanding reasoning; Claude Haiku 5.5 (`claude-haiku-5-5`) for high-volume, low-latency work.
- Implement robust error handling for API timeouts.

## Customization Options
- Adjust `max_tokens` to control response length.
- Modify `temperature` to control output randomness.

## Troubleshooting
- Handle rate limits (HTTP 429) by implementing exponential backoff.
- Verify your API key has billing enabled if you receive authorization errors.

## Integration
- Native support in open-source tools like Aider and Cline.
- Easy to integrate into Python scripts using the official `anthropic` pip package.

## Version History
- v1.1.0: Updated to the Claude 5.x model IDs.

## References
- https://platform.claude.com/docs/en/get-started
- https://platform.claude.com/docs/en/models/overview
- Anthropic API Reference
