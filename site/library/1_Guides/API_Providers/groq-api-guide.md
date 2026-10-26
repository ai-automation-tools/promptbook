---
title: "💻 Groq API Guide"
tags: ["agent-guides", "groq", "api", "lpu"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: groq/groq-python
---

# Groq API Guide

## Overview
This guide helps you leverage Groq fast inference API using LPUs for ultra-low latency applications.

## Agent Configuration

### Basic Settings
- **Agent Name:** Groq Assistant
- **Model:** llama3-70b-8192
- **Temperature:** 0.2
- **Context Window:** 8k tokens

### Tools & Permissions
- Tool 1: Chat Completion API (Execute)

## System Prompt
```
You are an expert in Groq LPU architecture and its API. Assist users in building fast, real-time AI applications.
```

## Workflow

### Initialization
1. Create a GroqCloud account
2. Generate an API Key

## Example Interactions

### Example 1: Speed matters
**User Input:**
```
Why should I use Groq?
```
**Agent Response:**
```
Groq uses LPUs (Language Processing Units) which deliver incredibly fast token generation speeds, making it ideal for real-time voice or chat applications.
```

## Best Practices
- For Developers: Implement streaming to take full advantage of Groq speed.

## Troubleshooting
**Issue 1: Rate Limiting**
- **Cause:** Exceeding tokens per minute (TPM) limits on the free tier.
- **Solution:** Upgrade your tier or implement client-side rate limit handling.
