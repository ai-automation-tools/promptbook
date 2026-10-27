---
title: "Mistral AI CLI Guide"
tags: ["mistral", "cli", "reference", "api", "european-ai"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: mistralai/mistral-vibe
---
## CLI Sync Notes (March 2026)

Tracks **Mistral CLI (Vibe)** changes explicitly.

### Notable March 2026 CLI updates
- New/expanded agent workflows (including theorem-proving agent setup).
- Improved `AGENTS.md` handling across user folder and nested directories.
- Voice mode and parallel tool execution improvements.
- Ongoing UX, approval/runtime, and telemetry updates across March releases.

### Official references
- https://github.com/mistralai/mistral-vibe/releases
- https://github.com/mistralai/mistral-vibe/blob/main/CHANGELOG.md
- https://docs.mistral.ai/

### Maintainer note
- Keep API model/pricing sections, but prioritize **actual CLI behavior** and release-note deltas in weekly sync.

---
# Mistral AI Agent Guide

Comprehensive reference for building and managing agents with Mistral AI models via CLI and API.

**Key Features:**
- 🇪🇺 European AI with strong data privacy
- 🚀 Extremely fast inference (Mistral Large 2)
- 💰 Cost-effective pricing
- 🔧 OpenAI-compatible API
- 🎯 Function calling and JSON mode
- 📊 128K context window (select models)

---
## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [mistral.ai](https://mistral.ai/) |
| **API Documentation** | [docs.mistral.ai](https://docs.mistral.ai/api/) |
| **Console** | [console.mistral.ai](https://console.mistral.ai/) |
| **Model Cards** | [docs.mistral.ai/getting-started/models](https://docs.mistral.ai/getting-started/models/) |
| **Pricing** | [mistral.ai/technology/#pricing](https://mistral.ai/technology/#pricing) |
| **GitHub** | [github.com/mistralai](https://github.com/mistralai) |
| **Cookbook** | [github.com/mistralai/cookbook](https://github.com/mistralai/cookbook) |
| **Chat** | [chat.mistral.ai](https://chat.mistral.ai/) |

---
## 2. Installation & Setup

### Install Official SDK

```bash
# Python
pip install mistralai

# Node.js
npm install @mistralai/mistralai

# Using with OpenAI SDK (compatible)
pip install openai
```

### API Key Setup

```bash
# Get API key from console.mistral.ai
export MISTRAL_API_KEY="..."

# Add to shell profile
echo 'export MISTRAL_API_KEY="..."' >> ~/.bashrc
source ~/.bashrc
```

### Using with cURL

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "mistral-large-latest",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

---
## 3. Available Models

### Production Models

| Model | Context | Description | Use Case |
|-------|---------|-------------|----------|
| `mistral-large-latest` | 128K | Flagship model | Complex reasoning, coding |
| `mistral-small-latest` | 32K | Fast, efficient | General tasks |
| `mistral-medium-latest` | 32K | Deprecated (use Large) | Legacy |
| `codestral-latest` | 32K | Code specialist | Code generation, completion |
| `mistral-embed` | - | Embeddings | RAG, search |
| `open-mistral-7b` | 32K | Open-source | Self-hosting |
| `open-mixtral-8x7b` | 32K | MoE open model | Self-hosting |
| `open-mixtral-8x22b` | 64K | Largest open model | Self-hosting |

### Model Comparison

**mistral-large-latest**:
- Best reasoning and math
- 128K context window
- Function calling support
- $2/$6 per 1M tokens (input/output)

**mistral-small-latest**:
- 80% of Large performance
- 5x cheaper ($0.20/$0.60)
- Good for most tasks

**codestral-latest**:
- Specialized for code
- Fill-in-the-middle support
- IDE integration ready
- Free for research/testing

---
## 4. Python SDK Examples

### Basic Chat (Mistral SDK)

```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

client = MistralClient(api_key="...")

messages = [
    ChatMessage(role="user", content="Hello, Mistral!")
]

response = client.chat(
    model="mistral-large-latest",
    messages=messages
)

print(response.choices[0].message.content)
```

### Using OpenAI SDK (Compatible)

```python
from openai import OpenAI

client = OpenAI(
    api_key="your_mistral_key",
    base_url="https://api.mistral.ai/v1"
)

response = client.chat.completions.create(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)
```

### Streaming

```python
# Mistral SDK
response = client.chat_stream(
    model="mistral-large-latest",
    messages=messages
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")

# OpenAI SDK
stream = client.chat.completions.create(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Tell a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### Async Support

```python
from mistralai.async_client import MistralAsyncClient

async_client = MistralAsyncClient(api_key="...")

async def chat():
    response = await async_client.chat(
        model="mistral-large-latest",
        messages=[ChatMessage(role="user", content="Hello")]
    )
    return response.choices[0].message.content

# Run async
import asyncio
result = asyncio.run(chat())
```

---
## 5. Function Calling

### Define Tools

```python
from mistralai.models.chat_completion import ChatMessage, ToolChoice
import json

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

messages = [
    ChatMessage(role="user", content="What's the weather in Paris?")
]

response = client.chat(
    model="mistral-large-latest",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)
```

### Handle Tool Calls

```python
def get_weather(location, unit="celsius"):
    # Mock implementation
    return {"temperature": 22, "condition": "sunny", "unit": unit}

# Check for tool calls
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)
    
    # Execute function
    if function_name == "get_weather":
        result = get_weather(**function_args)
        
        # Add tool response to conversation
        messages.append(response.choices[0].message)
        messages.append(
            ChatMessage(
                role="tool",
                name=function_name,
                content=json.dumps(result),
                tool_call_id=tool_call.id
            )
        )
        
        # Get final response
        final_response = client.chat(
            model="mistral-large-latest",
            messages=messages
        )
        print(final_response.choices[0].message.content)
```

---
## 6. JSON Mode

### Structured Output

```python
response = client.chat(
    model="mistral-large-latest",
    messages=[
        ChatMessage(
            role="user",
            content="Extract: John Doe, 30, engineer"
        )
    ],
    response_format={"type": "json_object"}
)

import json
data = json.loads(response.choices[0].message.content)
print(data)
# {"name": "John Doe", "age": 30, "occupation": "engineer"}
```

**Note:** When using JSON mode, include "JSON" in your prompt to ensure valid output.

---
## 7. Codestral (Code Completion)

### Code Generation

```python
from mistralai.client import MistralClient

client = MistralClient(api_key="...")

# Code completion
response = client.chat(
    model="codestral-latest",
    messages=[
        ChatMessage(
            role="user",
            content="Write a Python function to calculate Fibonacci numbers"
        )
    ]
)

print(response.choices[0].message.content)
```

### Fill-in-the-Middle (FIM)

```python
# For IDE integrations
prompt = """<s>[INST] Complete the following code:
def fibonacci(n):
    if n <= 1:
        return n
    [SUFFIX]
    return fib(n-1) + fib(n-2)
[/INST]"""

response = client.completion(
    model="codestral-latest",
    prompt=prompt
)
```

---
## 8. Embeddings

### Generate Embeddings

```python
from mistralai.client import MistralClient

client = MistralClient(api_key="...")

# Single text
embeddings = client.embeddings(
    model="mistral-embed",
    input=["Your text here"]
)

vector = embeddings.data[0].embedding
print(f"Dimension: {len(vector)}")

# Batch embeddings
texts = [
    "First document",
    "Second document",
    "Third document"
]

embeddings = client.embeddings(
    model="mistral-embed",
    input=texts
)

for i, emb in enumerate(embeddings.data):
    print(f"Text {i+1}: {len(emb.embedding)} dimensions")
```

### Similarity Search

```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Find most similar
query = "What is AI?"
query_emb = client.embeddings(model="mistral-embed", input=[query]).data[0].embedding

docs = ["Artificial Intelligence explained", "Cooking recipes", "AI applications"]
doc_embs = client.embeddings(model="mistral-embed", input=docs).data

similarities = [
    cosine_similarity(query_emb, doc.embedding)
    for doc in doc_embs
]

best_match = docs[np.argmax(similarities)]
print(f"Best match: {best_match}")
```

---
## 9. API Parameters

### Chat Completion Parameters

```python
response = client.chat(
    model="mistral-large-latest",
    messages=messages,
    temperature=0.7,          # Randomness (0.0-1.0)
    max_tokens=1024,          # Max response length
    top_p=1.0,                # Nucleus sampling
    random_seed=42,           # Reproducibility
    safe_prompt=False,        # Prefix safety prompt
    tools=None,               # Function definitions
    tool_choice="auto",       # auto, any, none
    response_format=None,     # {"type": "json_object"}
)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | required | Model ID |
| `messages` | array | required | Conversation history |
| `temperature` | float | 0.7 | Sampling temperature (0-1) |
| `max_tokens` | int | null | Max tokens to generate |
| `top_p` | float | 1.0 | Nucleus sampling threshold |
| `random_seed` | int | null | Reproducibility seed |
| `safe_prompt` | bool | false | Prepend safety instructions |
| `tools` | array | null | Function definitions |
| `tool_choice` | string | auto | Tool selection strategy |
| `response_format` | object | null | {"type": "json_object"} |

---
## 10. CLI Integration

### Using Mistral CLI (Unofficial)

```bash
# Install wrapper
pip install mistral-cli

# Chat interactively
mistral chat --model mistral-large-latest

# One-shot query
mistral chat --model mistral-large-latest "Explain quantum computing"

# With system prompt
mistral chat --model mistral-large-latest \
  --system "You are a Python expert" \
  "Explain decorators"
```

### Using with LiteLLM

```bash
pip install litellm

export MISTRAL_API_KEY="..."

litellm --model mistral/mistral-large-latest
```

### cURL Examples

```bash
# Basic chat
curl https://api.mistral.ai/v1/chat/completions \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-large-latest",
    "messages": [{"role": "user", "content": "Hello"}]
  }'

# Streaming
curl https://api.mistral.ai/v1/chat/completions \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-large-latest",
    "messages": [{"role": "user", "content": "Count to 10"}],
    "stream": true
  }' \
  --no-buffer

# List models
curl https://api.mistral.ai/v1/models \
  -H "Authorization: Bearer $MISTRAL_API_KEY"
```

---
## 11. Rate Limits & Pricing

### Rate Limits

| Tier | RPM | TPM |
|------|-----|-----|
| Free Trial | 5 | 50K |
| Pay-as-you-go | 100+ | 1M+ |
| Enterprise | Custom | Custom |

### Pricing (per 1M tokens)

| Model | Input | Output |
|-------|-------|--------|
| mistral-large-latest | $2.00 | $6.00 |
| mistral-small-latest | $0.20 | $0.60 |
| codestral-latest | $0.20 | $0.60 |
| mistral-embed | $0.10 | - |
| open-mistral-7b | $0.25 | $0.25 |
| open-mixtral-8x7b | $0.70 | $0.70 |
| open-mixtral-8x22b | $2.00 | $6.00 |

**Free research tier:** Codestral is free for research and testing

---
## 12. Best Practices

### Temperature Settings

| Task Type | Recommended Temperature |
|-----------|------------------------|
| Code generation | 0.0 - 0.2 |
| Factual QA | 0.1 - 0.3 |
| Technical writing | 0.3 - 0.5 |
| Creative writing | 0.5 - 0.8 |
| Brainstorming | 0.7 - 1.0 |

### Error Handling

```python
from mistralai.exceptions import MistralException, MistralAPIException

try:
    response = client.chat(
        model="mistral-large-latest",
        messages=messages
    )
except MistralAPIException as e:
    print(f"API Error: {e.http_status} - {e.message}")
except MistralException as e:
    print(f"Client Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

### Retry Logic

```python
import time
from mistralai.exceptions import MistralAPIException

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat(
                model="mistral-large-latest",
                messages=messages
            )
        except MistralAPIException as e:
            if e.http_status == 429:  # Rate limit
                if attempt < max_retries - 1:
                    wait = 2 ** attempt
                    print(f"Rate limited. Waiting {wait}s...")
                    time.sleep(wait)
                else:
                    raise
            else:
                raise
```

---
## 13. Self-Hosting (Open Models)

### Using vLLM

```bash
# Install vLLM
pip install vllm

# Serve Mistral-7B
vllm serve mistralai/Mistral-7B-Instruct-v0.3 \
  --host 0.0.0.0 \
  --port 8000

# Query local server
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistralai/Mistral-7B-Instruct-v0.3",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Using Ollama

```bash
# Pull model
ollama pull mistral

# Run locally
ollama run mistral "Explain AI"
```

### Using llama.cpp

```bash
# Download GGUF model
huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.2-GGUF \
  mistral-7b-instruct-v0.2.Q4_K_M.gguf

# Run with llama.cpp
./main -m mistral-7b-instruct-v0.2.Q4_K_M.gguf \
  -p "Explain quantum computing" \
  -n 256
```

---
## 14. Advanced Features

### Prompt Caching (La Plateforme)

```python
# Prefix caching for repeated system prompts
response = client.chat(
    model="mistral-large-latest",
    messages=[
        ChatMessage(
            role="system",
            content="Very long system prompt..." * 100  # Cached
        ),
        ChatMessage(role="user", content="Question")
    ]
)

# Subsequent calls with same prefix are faster/cheaper
```

### Guardrails

```python
# Use safe_prompt for content filtering
response = client.chat(
    model="mistral-large-latest",
    messages=messages,
    safe_prompt=True  # Prepends safety instructions
)
```

---
## 15. Comparison

### vs GPT-4

- ✅ **5x cheaper** ($2 vs $10 per 1M input)
- ✅ **Faster inference** (especially Large 2)
- ✅ **European data privacy** (GDPR compliant)
- ⚠️ **Smaller context** (128K vs 128K - tied)
- ⚠️ **Slightly weaker** reasoning on complex tasks

### vs Claude 3.5

- ✅ **33% cheaper** ($2 vs $3 per 1M input)
- ✅ **Open-source options** available
- ⚠️ **Smaller context** (128K vs 200K)
- ⚠️ **Less nuanced** writing

### Strengths

- Excellent price-to-performance
- Strong multilingual support (especially French)
- Fast inference
- Open-source models available
- European AI sovereignty
- Code specialist (Codestral)

---
## 16. Troubleshooting

### Common Issues

**Invalid API Key:**
```bash
# Verify key
curl https://api.mistral.ai/v1/models \
  -H "Authorization: Bearer $MISTRAL_API_KEY"
```

**Model Not Found:**
```python
# List available models
models = client.list_models()
for model in models.data:
    print(model.id)
```

**Rate Limit Exceeded:**
```python
# Check headers for limit info
response_obj = client.chat(...)
# Retry with exponential backoff (see error handling above)
```

**JSON Mode Not Working:**
```python
# Always mention JSON in prompt
response = client.chat(
    model="mistral-large-latest",
    messages=[
        ChatMessage(
            role="user",
            content="Return JSON with name and age: John, 30"
        )
    ],
    response_format={"type": "json_object"}
)
```

---
**Last Updated:** 2026-03-24  
**API Version:** v1

*Part of the [my_agents](../../) repository*
