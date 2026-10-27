---
title: "💻 OpenAI API Guide"
tags: ["agent-guides", "openai", "api"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-10-13
repo: openai/openai-python
---

# OpenAI API Guide

## Overview
A comprehensive guide on integrating and utilizing the OpenAI API for building intelligent agents.

## Agent Configuration

### Basic Settings
- **Agent Name:** OpenAI Assistant
- **Model:** `gpt-6.1-sol` (balance of intelligence and cost); `gpt-6-astra` (flagship, complex reasoning and coding); `gpt-6-luna` (high-volume, cost-sensitive)
- **Reasoning effort:** low, medium, high, xhigh, max (Luna also accepts none)
- **Context Window:** 1.05M tokens, 128K max output (all three)

### Tools & Permissions
- Tool 1: Code Interpreter
- Tool 2: Function Calling
- Tool 3: File Search

## System Prompt
```
You are a helpful assistant powered by OpenAI.
Your primary responsibilities include:
1. Answering user queries
2. Assisting with API usage
3. Providing code examples

### Core Principles
- Be accurate and helpful
- Refuse harmful requests
- Respect privacy

### Capabilities
- Natural language understanding
- Code generation
- Data analysis

### Constraints
- DO NOT hallucinate facts
- ALWAYS clarify uncertainty

### Response Format
- Markdown
- JSON for structured data

### Error Handling
When encountering an API error, you should:
1. Check the status code
2. Read the error message
3. Suggest a retry or fix
```

## Workflow

### Initialization
1. Create an API key in the OpenAI developer dashboard (Settings -> API Keys)
2. Export it: `export OPENAI_API_KEY="your-key-here"`
3. Initialize the client
4. Set the system prompt (the `instructions` field on the Responses API)

### Standard Operating Procedure
#### Phase 1: Request Prep
- Format messages array
- Define tools

#### Phase 2: Execution
- Call `client.responses.create` (the Responses API, the main API reference for current models)

#### Phase 3: Response Handling
- Parse response
- Handle tool calls if any

### Decision Trees
**When rate limited:**
- Action: Implement exponential backoff
- Reason: Required by API limits

## Example Interactions

### Example 1: Basic Chat

**User Input:**
```
How do I use the OpenAI API in Python?
```

**Agent Response:**
```
Here is a basic example using the `openai` python package.
```

## Best Practices

### For Users
- Keep API keys secure
- Use environment variables

### For Developers
- Implement retry logic
- Monitor usage dashboard

## Customization Options

### Variables
- `max_tokens`: Limit response length
- `top_p`: Nucleus sampling

### Extend Functionality
```python
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
```

## Troubleshooting

### Common Issues
**Issue 1: AuthenticationError**
- **Cause:** Invalid API key
- **Solution:** Check environment variables

## Integration

### Related endpoints
- Embeddings API for vector search

### With Other Agents
- Can be used as the brain for LangChain or LlamaIndex agents

## Version History
- **v1.0.0** (2024-01-01): Guide created
- **2026-10-13**: Models, limits and endpoint checked against developers.openai.com/api/docs/models; merged in the former `openai-api-guide.md` stub (setup steps and embeddings note). The Assistants API is listed there as legacy.

## References
- [OpenAI models](https://developers.openai.com/api/docs/models)
