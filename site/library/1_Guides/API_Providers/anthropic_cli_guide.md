---
title: "Anthropic API Provider Guide"
tags: ["api", "anthropic", "claude"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: anthropics/anthropic-sdk-python
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
User runs: `curl https://api.anthropic.com/v1/messages -H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" -H "content-type: application/json" -d '{"model": "claude-opus-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello, Claude!"}]}'`

## Best Practices
- Use Claude Sonnet 5 for coding and speed-dependent tasks.
- Use Claude Opus 5 for highly complex reasoning tasks.
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
- v1.0.0: Guide updated for Claude 3 model family.

## References
- https://docs.anthropic.com/en/api/getting-started
- Anthropic API Reference
