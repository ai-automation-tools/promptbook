---
title: "OpenAI API & CLI Guide"
tags: ["openai", "gpt-6", "gpt-5", "cli", "reference", "api", "codex", "responses-api"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: openai/openai-python
---
## CLI Sync Notes (September 2026)

Two separate CLIs live under the OpenAI name — don't conflate them:

- **Codex CLI** is the agentic coding tool (`codex` in your terminal, this is what
  runs autonomous edits against a repo). Current release line is **0.153.x**, with
  `gpt-6-astra` now selectable from its bundled model picker.
- **OpenAI CLI** (`openai`) is the thin command-line wrapper around the API itself —
  responses, images, audio, files — described in this guide's CLI section below.
  Older `openai` Python SDK versions installed a legacy CLI under the same command
  name; if `openai --version` looks unfamiliar, check which one your shell resolves.

### Official references
- [developers.openai.com/api/docs](https://developers.openai.com/api/docs) — API reference, pricing, models
- [developers.openai.com/api/docs/libraries/openai-cli](https://developers.openai.com/api/docs/libraries/openai-cli) — the CLI covered here
- [learn.chatgpt.com/docs/codex](https://learn.chatgpt.com/docs/codex) — Codex CLI docs and changelog

---
# OpenAI API & CLI Agent Guide

Reference for building and managing agents with current OpenAI models via the API,
official SDKs, and the `openai` CLI.

**Key Features:**
- 🧠 Frontier reasoning (GPT-6 Astra, GPT-5.6, o-series)
- 👁️ Vision and multimodal input across the current model lineup
- 🎯 Function calling, structured outputs, and the Responses API's typed tool items
- 🔊 Realtime and audio (speech, transcription, speech-to-speech translation)
- 📊 Context windows up to ~1M tokens on the GPT-5.6/GPT-6 family
- 🚀 Cost-tiered models (Luna/mini/nano) for high-volume work

---
## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [openai.com](https://openai.com/) |
| **API Documentation** | [developers.openai.com/api/docs](https://developers.openai.com/api/docs) |
| **Model List** | [developers.openai.com/api/docs/models](https://developers.openai.com/api/docs/models) |
| **Pricing** | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| **Deprecations** | [developers.openai.com/api/docs/deprecations](https://developers.openai.com/api/docs/deprecations) |
| **API Keys** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Rate & Usage Limits** | [platform.openai.com/settings/organization/limits](https://platform.openai.com/settings/organization/limits) |
| **Status Page** | [status.openai.com](https://status.openai.com/) |

---
## 2. Installation & Setup

### Install Official SDK

```bash
# Python (v3.x — HTTPX2-based client)
pip install openai

# Node.js
npm install openai

# Go
go get github.com/openai/openai-go
```

### Install Official CLI

```bash
# Homebrew
brew install openai/tools/openai

# Go 1.25+
go install 'github.com/openai/openai-cli/cmd/openai@latest'

# Verify installation
openai --version
```

> This is the API CLI. For the agentic coding tool, install Codex CLI separately:
> `curl -fsSL https://chatgpt.com/codex/install.sh | sh` (macOS/Linux).

### API Key Setup

```bash
# Set environment variable
export OPENAI_API_KEY="sk-..."

# Add to shell profile
echo 'export OPENAI_API_KEY="sk-..."' >> ~/.bashrc
source ~/.bashrc

# Admin operations (usage, project management) use a separate key
export OPENAI_ADMIN_KEY="sk-admin-..."
```

### Using with cURL

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6-sol",
    "input": "You are a helpful assistant. Hello!"
  }'
```

---
## 3. Available Models

Model names and pricing change often enough that this table can go stale — check
[developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing)
before quoting a number to anyone. As of September 2026:

| Model | Context | Description | Use Case |
|-------|---------|-------------|----------|
| `gpt-6-astra` | ~1.05M | Most capable, end-to-end complex work | Hardest reasoning + agentic tasks |
| `gpt-5.6-sol` | ~1.05M | Flagship for professional/complex tasks | General purpose, best overall |
| `gpt-5.6-terra` | ~1.05M | Balanced capability and cost | Everyday production workloads |
| `gpt-5.6-luna` | ~1.05M | Cost-optimized | High-volume, latency-sensitive tasks |
| `gpt-5-mini` | 128K | Small, fast GPT-5 variant | Budget-conscious general use |
| `o3` | 128K | Reasoning model | Complex multi-step problems |
| `o3-mini` | 128K | Fast reasoning | STEM, coding |
| `gpt-4o` | 128K | Prior-generation multimodal flagship | Legacy compatibility |
| `gpt-4o-mini` | 128K | Prior-generation budget model | Legacy compatibility |

### Pricing (per 1M tokens, September 2026 — verify before relying on it)

| Model | Input | Output |
|-------|-------|--------|
| gpt-6-astra | $10.00 | $50.00 |
| gpt-5.6-sol | $4.00 (promotional through Nov 2026) | $20.00 |
| gpt-5.6-terra | $2.00 | $12.00 |
| gpt-5.6-luna | $0.20 | $1.20 |
| gpt-5-mini | $0.25 | $2.00 |
| o3 | $2.00 | $8.00 |
| o3-mini | $1.10 | $4.40 |
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |

Batch mode is roughly half price; requests past ~272K tokens of context bill at a
premium; cached input on repeated prompt prefixes bills far below standard input
rates. Exact modifiers are on the pricing page above.

---
## 4. CLI Commands

The current `openai` CLI is built around the **Responses API**, not the older
`chat.completions` object model.

### Text Responses

```bash
# Basic response
openai responses create \
  --model gpt-5.6-sol \
  --input "Hello!"

# With instructions (system-level guidance)
openai responses create \
  --model gpt-5.6-sol \
  --instructions "You are a Python expert" \
  --input "Explain list comprehensions"
```

### Image Generation

```bash
openai images generate \
  --model gpt-image-2 \
  --prompt "A serene landscape with mountains" \
  --size 1024x1024 \
  --transform \
  --output landscape.png
```

### Audio: Speech and Transcription

```bash
# Text-to-speech
openai audio:speech create \
  --model gpt-4o-mini-tts \
  --voice marin \
  --input "Hello, world!" \
  --output output.mp3

# Transcription (plain text, SRT/VTT, or speaker-labeled diarization)
openai audio:transcriptions create \
  --model gpt-4o-transcribe \
  --file audio.mp3
```

### Files

```bash
openai files create --file training_data.jsonl --purpose fine-tune
openai files list
```

---
## 5. Python SDK Examples

### Basic Response

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6-sol",
    instructions="You are a helpful assistant.",
    input="Hello!"
)

print(response.output_text)
```

### Streaming

```python
stream = client.responses.create(
    model="gpt-5.6-sol",
    input="Count to 10",
    stream=True
)

for event in stream:
    if event.type == "response.output_text.delta":
        print(event.delta, end="")
```

### Function Calling (Tools)

```python
tools = [
    {
        "type": "function",
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }
]

response = client.responses.create(
    model="gpt-5.6-sol",
    input="What's the weather in Tokyo?",
    tools=tools
)

for item in response.output:
    if item.type == "function_call":
        # Execute the function and send the result back as a function_call_output item
        pass
```

### Structured Outputs

```python
from pydantic import BaseModel

class UserInfo(BaseModel):
    name: str
    age: int
    occupation: str

response = client.responses.parse(
    model="gpt-5.6-sol",
    input="John Doe, 30, engineer",
    text_format=UserInfo
)

user = response.output_parsed
print(user.name)  # "John Doe"
```

### Vision

```python
response = client.responses.create(
    model="gpt-5.6-sol",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "What's in this image?"},
                {"type": "input_image", "image_url": "https://example.com/image.jpg"}
            ]
        }
    ]
)
```

### Chat Completions (still supported, existing code only)

OpenAI has said Chat Completions remains supported indefinitely, but new
integrations should build on the Responses API above — it carries reasoning items
and tool calls in one typed output array instead of a flat `choices` list.

```python
response = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

---
## 6. API Parameters (Responses API)

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Model ID |
| `input` | string/array | Prompt text or typed input items |
| `instructions` | string | System-level guidance (replaces the old `system` message) |
| `tools` | array | Function/tool definitions |
| `tool_choice` | string/object | Tool selection strategy |
| `text_format` / `response_format` | object | Structured output schema |
| `reasoning` | object | `{"effort": "low"\|"medium"\|"high"}` on reasoning-capable models |
| `stream` | boolean | Enable streaming |
| `previous_response_id` | string | Chain a response onto prior turns without resending history |
| `max_output_tokens` | int | Max tokens to generate |
| `temperature` | float | Sampling temperature (0-2); ignored by pure reasoning models |

---
## 7. Best Practices

### Temperature Guide

| Task | Temperature |
|------|-------------|
| Code generation | 0.0 - 0.2 |
| Data extraction | 0.0 - 0.3 |
| Technical writing | 0.3 - 0.7 |
| Creative writing | 0.7 - 1.0 |
| Brainstorming | 1.0 - 1.5 |

### Reasoning Effort

On `o3`, `gpt-6-astra`, and other reasoning-capable models, set effort instead of
(or alongside) temperature:

```python
response = client.responses.create(
    model="gpt-6-astra",
    input="Design a database schema for a multi-tenant SaaS app",
    reasoning={"effort": "high"}
)
```

Use `low` for latency-sensitive, well-specified tasks; `high` for open-ended or
high-stakes problems where you can afford to wait longer.

### Error Handling

```python
from openai import OpenAIError, RateLimitError, APITimeoutError
import time

def call_with_retry(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.responses.create(model="gpt-5.6-sol", input=prompt)
        except RateLimitError:
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                print(f"Rate limited. Waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
        except APITimeoutError:
            if attempt < max_retries - 1:
                print("Timeout. Retrying...")
                continue
            else:
                raise
        except OpenAIError as e:
            print(f"API error: {e}")
            raise
```

---
## 8. Rate Limits

Rate limits are set per organization by usage tier and change as OpenAI adjusts
them, so no fixed numbers belong in a reference doc. Check your actual limits at
[platform.openai.com/settings/organization/limits](https://platform.openai.com/settings/organization/limits) —
it lists RPM/TPM per model for your account, and the API returns
`x-ratelimit-*` response headers on every call so you can track usage without
guessing.

---
## 9. Advanced Features

### Multi-turn Without Resending History

```python
first = client.responses.create(model="gpt-5.6-sol", input="Remember the number 42")

second = client.responses.create(
    model="gpt-5.6-sol",
    previous_response_id=first.id,
    input="What number did I tell you?"
)
```

### Batch Processing

```python
# Create batch file (Responses API batch entries)
with open("batch.jsonl", "w") as f:
    f.write('{"custom_id": "req-1", "method": "POST", "url": "/v1/responses", "body": {"model": "gpt-5.6-terra", "input": "Hello"}}\n')

batch_file = client.files.create(file=open("batch.jsonl", "rb"), purpose="batch")
batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/responses",
    completion_window="24h"
)

status = client.batches.retrieve(batch.id)
```

---
## 10. Troubleshooting

### Common Errors

**Invalid API Key:**
```bash
openai models list
```

**Context Length Exceeded:**
```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")  # tiktoken has not added GPT-5/6 encodings; gpt-4o is the closest stand-in
tokens = enc.encode("Your text here")
print(f"Token count: {len(tokens)}")
```

**Rate Limit:**
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_api():
    return client.responses.create(...)
```

**Model Not Found:**
```python
models = client.models.list()
for model in models.data:
    if "gpt" in model.id:
        print(model.id)
```

---
## 11. Security & Compliance

### API Key Management

```bash
# Never commit keys
echo "OPENAI_API_KEY=sk-..." >> .env
echo ".env" >> .gitignore

# Load from a secrets manager or .env loader rather than shelling out to cat/grep
```

### Content Moderation

```python
moderation = client.moderations.create(
    model="omni-moderation-latest",
    input="User content here"
)

if moderation.results[0].flagged:
    print("Content violates policies")
else:
    pass  # proceed with the request
```

### Prompt Injection Protection

Simple keyword blocklists (`"ignore previous instructions"`, etc.) are trivial to
evade with paraphrasing or encoding. Treat untrusted input as data, not
instructions: keep it out of the `instructions` field, and use the model's own
judgment plus tool-permission scoping rather than string matching as your actual
defense.

---
## 12. Migration Notes

### From Chat Completions to the Responses API

```python
# Old (Chat Completions)
response = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[{"role": "user", "content": "Say hello"}]
)
print(response.choices[0].message.content)

# New (Responses API)
response = client.responses.create(
    model="gpt-5.6-sol",
    input="Say hello"
)
print(response.output_text)
```

Chat Completions keeps working — this is a recommendation for new code, not a
forced migration.

---
**Last Updated:** 2026-09-05
**API Version:** v1

*Part of the [my_agents](../../) repository*
