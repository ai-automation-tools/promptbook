---
title: "DeepSeek CLI Guide"
tags: ["deepseek", "cli", "reference", "api", "chinese-ai","featured"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: deepseek-ai/DeepSeek-V3
---
## CLI Sync Notes (March 2026)

Focuses on **CLI-relevant** updates alongside API basics.

### What changed upstream
- DeepSeek CLI ecosystem reported recent updates around conversational workflows, stdin/file input, settings persistence, and context-handling improvements.
- Validate exact command/flag behavior against the official package/docs before automation scripts depend on specific flags.

### Official references to check first
- https://pypi.org/project/deepseek-cli/
- https://github.com/deepseek-ai
- https://platform.deepseek.com/api-docs/

### Maintainer note
- Treat this guide as a combined **API + CLI field reference**.
- For weekly sync: prefer official CLI release notes/changelog when available; otherwise mark changes as provisional and cite source.

---
# DeepSeek Agent Guide

Comprehensive reference for building and managing agents with DeepSeek AI models via CLI and API.

**Key Features:**
- 🧠 Advanced reasoning models (DeepSeek-V3, DeepSeek-R1)
- 💰 Cost-effective API pricing ($0.14/M input, $0.28/M output tokens)
- 🚀 High performance with 128K context window
- 🔧 OpenAI-compatible API for easy integration
- 🌐 Strong multilingual support (Chinese & English)
- 🎯 Specialized models: coding, reasoning, and chat

---
## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [deepseek.com](https://www.deepseek.com/) |
| **API Documentation** | [platform.deepseek.com/api-docs](https://platform.deepseek.com/api-docs/) |
| **GitHub** | [github.com/deepseek-ai](https://github.com/deepseek-ai) |
| **Model Card** | [DeepSeek-V3 Technical Report](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/DeepSeek_V3.pdf) |
| **Pricing** | [platform.deepseek.com/pricing](https://platform.deepseek.com/pricing) |
| **API Keys** | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) |
| **Chat Interface** | [chat.deepseek.com](https://chat.deepseek.com/) |

---
## 2. Installation & Setup

### API Key Setup

```bash
# Get your API key from platform.deepseek.com
export DEEPSEEK_API_KEY="sk-..."

# Add to shell profile for persistence
echo 'export DEEPSEEK_API_KEY="sk-..."' >> ~/.bashrc
source ~/.bashrc
```

### Using with cURL

```bash
# Basic chat completion
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Using with OpenAI Python SDK

```bash
# Install OpenAI SDK
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"}
    ]
)

print(response.choices[0].message.content)
```

---
## 3. Available Models

### Production Models

| Model | Context | Description | Use Case |
|-------|---------|-------------|----------|
| `deepseek-chat` | 128K | Latest general chat model (V3) | General tasks, conversation |
| `deepseek-coder` | 128K | Specialized coding model | Code generation, debugging |
| `deepseek-reasoner` | 64K | Deep reasoning model (R1) | Complex problem solving |

### Model Specifications

**DeepSeek-V3** (Chat):
- 671B parameters (MoE architecture, 37B active)
- 128K context window
- Multilingual support
- Function calling
- JSON mode

**DeepSeek-R1** (Reasoner):
- Advanced chain-of-thought reasoning
- 64K context window
- Step-by-step problem decomposition
- Competitive with o1-mini

---
## 4. API Parameters

### Chat Completion Parameters

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "temperature": 1.0,
  "max_tokens": 4096,
  "top_p": 1.0,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0,
  "stop": null,
  "stream": false,
  "response_format": {"type": "text"},
  "tools": []
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | required | Model ID to use |
| `messages` | array | required | Conversation history |
| `temperature` | float | 1.0 | Sampling temperature (0-2) |
| `max_tokens` | int | 4096 | Maximum tokens to generate |
| `top_p` | float | 1.0 | Nucleus sampling threshold |
| `frequency_penalty` | float | 0.0 | Reduce repetition (-2.0 to 2.0) |
| `presence_penalty` | float | 0.0 | Encourage topic diversity (-2.0 to 2.0) |
| `stop` | string/array | null | Stop sequences |
| `stream` | boolean | false | Enable streaming responses |
| `response_format` | object | text | Output format (text/json_object) |

---
## 5. Function Calling

### Define Tools

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto"
)
```

### Handle Tool Calls

```python
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    
    # Execute function
    result = get_weather(
        location=json.loads(tool_call.function.arguments)["location"]
    )
    
    # Send result back
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })
```

---
## 6. Streaming Responses

### Python Example

```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "Count to 10"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### cURL Example

```bash
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }' \
  --no-buffer
```

---
## 7. JSON Mode

### Structured Output

```python
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "Extract user info as JSON"},
        {"role": "user", "content": "John Doe, age 30, engineer"}
    ],
    response_format={"type": "json_object"}
)

print(response.choices[0].message.content)
# Output: {"name": "John Doe", "age": 30, "occupation": "engineer"}
```

**Note:** When using JSON mode, include "JSON" in the system prompt to ensure valid output.

---
## 8. CLI Integration Examples

### Using with LiteLLM

```bash
# Install LiteLLM
pip install litellm

# Set environment
export DEEPSEEK_API_KEY="sk-..."

# Use via CLI
litellm --model deepseek/deepseek-chat
```

### Using with OpenRouter

```bash
# DeepSeek is available via OpenRouter
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---
## 9. Best Practices

### Temperature Settings

| Task Type | Recommended Temperature |
|-----------|------------------------|
| Code generation | 0.0 - 0.3 |
| Technical writing | 0.3 - 0.7 |
| Creative writing | 0.7 - 1.0 |
| Brainstorming | 1.0 - 1.3 |

### Context Management

```python
# Keep conversation focused
MAX_HISTORY = 10

def trim_messages(messages):
    if len(messages) > MAX_HISTORY:
        # Keep system message + recent history
        return [messages[0]] + messages[-(MAX_HISTORY-1):]
    return messages
```

### Error Handling

```python
from openai import OpenAIError

try:
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages
    )
except OpenAIError as e:
    print(f"API Error: {e}")
    # Implement retry logic
```

---
## 10. Rate Limits & Pricing

### Rate Limits (as of 2025)

- **Free tier:** 10 requests/minute
- **Paid tier:** 100+ requests/minute (scales with usage)
- Contact support for enterprise limits

### Pricing

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| deepseek-chat | $0.14 | $0.28 |
| deepseek-coder | $0.14 | $0.28 |
| deepseek-reasoner | $0.55 | $2.19 |

**Cache pricing:** 90% discount on cached tokens (128K cache)

---
## 11. Comparison with Other Models

### vs GPT-4

- ✅ **80% cheaper** ($0.14 vs $10.00 per 1M input tokens)
- ✅ **Faster response times** in most benchmarks
- ✅ **Longer context window** (128K vs 128K)
- ⚠️ **Slightly lower performance** on complex reasoning

### vs Claude 3.5 Sonnet

- ✅ **95% cheaper** ($0.14 vs $3.00 per 1M input tokens)
- ✅ **Open source alternatives available**
- ⚠️ **Less nuanced** in creative writing
- ⚠️ **Weaker** in multi-turn conversations

### Strengths

- Extremely cost-effective
- Strong coding capabilities
- Fast inference
- Good Chinese language support
- OpenAI-compatible API

---
## 12. Troubleshooting

### Common Issues

**Invalid API Key:**
```bash
# Verify key is set correctly
echo $DEEPSEEK_API_KEY
# Should output: sk-...
```

**Connection Timeout:**
```python
# Increase timeout
client = OpenAI(
    api_key="sk-...",
    base_url="https://api.deepseek.com",
    timeout=60.0
)
```

**Rate Limit Exceeded:**
```python
import time
from openai import RateLimitError

try:
    response = client.chat.completions.create(...)
except RateLimitError:
    time.sleep(60)  # Wait before retry
    response = client.chat.completions.create(...)
```

**Model Not Found:**
```python
# Always use official model names
model = "deepseek-chat"  # ✅ Correct
model = "deepseek-v3"    # ❌ Wrong
```

---
**Last Updated:** 2026-03-24  
**API Version:** v1

*Part of the [my_agents](../../) repository*
