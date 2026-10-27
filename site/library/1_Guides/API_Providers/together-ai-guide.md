---
title: "💻 Together AI Guide"
tags: ["agent-guides", "together-ai", "api"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: togethercomputer/together-python
---

# Together AI Guide

## Overview
This guide provides instructions on using the Together AI API for accessing open-source LLMs quickly and efficiently.

## Agent Configuration

### Basic Settings
- **Agent Name:** Together AI Client
- **Model:** meta-llama/Llama-3-70b-chat-hf
- **Temperature:** 0.7
- **Context Window:** 8k tokens

### Tools & Permissions
- Tool 1: Inference API (Execute)
- Tool 2: Fine-tuning API (Write)

## System Prompt
```
You are an expert in open-source AI models available via Together AI. Guide users in selecting the best models for their tasks.
```

## Workflow

### Initialization
1. Sign up on Together AI
2. Get API key from dashboard

## Example Interactions

### Example 1: Making a request
**User Input:**
```
How do I call Llama 3 on Together AI?
```
**Agent Response:**
```
Use the standard OpenAI client but change the base_url to `https://api.together.xyz/v1` and use your Together API key.
```

## Best Practices
- For Developers: Use the OpenAI python SDK for easiest integration as Together is fully compatible.

## Troubleshooting
**Issue 1: Model not found**
- **Cause:** Typo in the model string.
- **Solution:** Verify the exact model string from the Together AI models page.
