---
title: "Qwen CLI Guide"
tags: ["qwen", "alibaba", "cli", "reference", "api", "chinese-ai"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: QwenLM/qwen-code
---
## CLI Sync Notes (March 2026)

Tracks **Qwen Code CLI** updates explicitly.

### Notable March 2026 CLI updates
- Recent Qwen Code releases include auth command additions, hooks/event improvements, and session/tooling UX changes.
- Rapid release cadence means command/flag behavior should be validated directly from release notes.

### Official references
- https://github.com/QwenLM/qwen-code/releases
- https://qwenlm.github.io/qwen-code-docs/en/
- https://github.com/QwenLM/qwen-code

### Maintainer note
- Keep DashScope/API sections for integration context, but prioritize qwen-code CLI release deltas in weekly sync.

---
# Qwen (Alibaba) Agent Guide

Comprehensive reference for building and managing agents with Qwen/Tongyi Qianwen models via CLI and API.

**Key Features:**
- 🇨🇳 Alibaba Cloud's flagship AI (Qwen/通义千问)
- 🧠 Qwen2.5: up to 1M context window
- 💬 Strong Chinese and English capabilities
- 🎨 Multimodal: text, vision, audio
- 💰 Competitive pricing
- 🔓 Open-source models available

---
## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [tongyi.aliyun.com](https://tongyi.aliyun.com/) |
| **API Platform** | [dashscope.aliyun.com](https://dashscope.aliyun.com/) |
| **Documentation** | [help.aliyun.com/zh/dashscope](https://help.aliyun.com/zh/dashscope/) |
| **Model Hub** | [modelscope.cn/models/Qwen](https://modelscope.cn/models/Qwen) |
| **GitHub** | [github.com/QwenLM](https://github.com/QwenLM) |
| **Open Models** | [huggingface.co/Qwen](https://huggingface.co/Qwen) |
| **Qwen2.5 Release** | [qwenlm.github.io/blog/qwen2.5](https://qwenlm.github.io/blog/qwen2.5/) |

---
## 2. Installation & Setup

### Install Official SDK

```bash
# Python
pip install dashscope

# Or use OpenAI SDK (compatible)
pip install openai
```

### API Key Setup

```bash
# Get API key from dashscope.aliyun.com
export DASHSCOPE_API_KEY="sk-..."

# Add to shell profile
echo 'export DASHSCOPE_API_KEY="sk-..."' >> ~/.bashrc
source ~/.bashrc
```

### Using with cURL

```bash
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-plus",
    "input": {
      "messages": [
        {"role": "user", "content": "你好"}
      ]
    }
  }'
```

---
## 3. Available Models

### Production Models (DashScope API)

| Model | Context | Description | Use Case |
|-------|---------|-------------|----------|
| `qwen-max` | 32K | Most capable | Complex reasoning, long content |
| `qwen-plus` | 32K | Balanced performance | General tasks |
| `qwen-turbo` | 8K | Fast, cost-effective | High-volume, simple tasks |
| `qwen-vl-max` | - | Vision model | Image understanding |
| `qwen-vl-plus` | - | Vision (lighter) | Image analysis |
| `qwen-audio-turbo` | - | Audio processing | Speech recognition, synthesis |

### Open-Source Models (Qwen2.5)

| Model | Params | Context | Description |
|-------|--------|---------|-------------|
| `Qwen2.5-72B-Instruct` | 72B | 128K | Flagship open model |
| `Qwen2.5-32B-Instruct` | 32B | 128K | High performance |
| `Qwen2.5-14B-Instruct` | 14B | 128K | Balanced |
| `Qwen2.5-7B-Instruct` | 7B | 128K | Efficient |
| `Qwen2.5-Coder-32B` | 32B | 128K | Code specialist |
| `Qwen2.5-Math-72B` | 72B | 4K | Math reasoning |

**Qwen2.5 highlights:**
- **1M context** on QwenLong models
- **29 languages** supported
- **Improved reasoning** over Qwen2
- **Open weights** (Apache 2.0)

---
## 4. Python SDK Examples

### Basic Chat (DashScope)

```python
from dashscope import Generation

response = Generation.call(
    model='qwen-plus',
    messages=[
        {'role': 'system', 'content': '你是一个有帮助的助手'},
        {'role': 'user', 'content': '你好，介绍一下你自己'}
    ]
)

print(response.output.text)
```

### Using OpenAI SDK (Compatible)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",  # DashScope API key
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen-plus",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手"},
        {"role": "user", "content": "你好"}
    ]
)

print(response.choices[0].message.content)
```

### Streaming

```python
# DashScope SDK
responses = Generation.call(
    model='qwen-plus',
    messages=[{'role': 'user', 'content': '讲一个故事'}],
    stream=True,
    incremental_output=True
)

for response in responses:
    if response.status_code == 200:
        print(response.output.text, end='')
    else:
        print(f'Error: {response.message}')

# OpenAI SDK
stream = client.chat.completions.create(
    model="qwen-plus",
    messages=[{"role": "user", "content": "讲一个故事"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end='')
```

---
## 5. Vision Models

### Image Understanding

```python
from dashscope import MultiModalConversation
import base64

# From local file
with open('image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

messages = [
    {
        'role': 'user',
        'content': [
            {'text': '这张图片里有什么？'},
            {'image': f'data:image/jpeg;base64,{image_data}'}
        ]
    }
]

response = MultiModalConversation.call(
    model='qwen-vl-max',
    messages=messages
)

print(response.output.choices[0].message.content)
```

### Image from URL

```python
messages = [
    {
        'role': 'user',
        'content': [
            {'text': 'Describe this image'},
            {'image': 'https://example.com/image.jpg'}
        ]
    }
]

response = MultiModalConversation.call(
    model='qwen-vl-plus',
    messages=messages
)
```

---
## 6. Function Calling

### Define Tools

```python
from dashscope import Generation
import json

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，例如：北京"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

messages = [
    {'role': 'user', 'content': '上海今天天气怎么样？'}
]

response = Generation.call(
    model='qwen-max',
    messages=messages,
    tools=tools
)
```

### Handle Tool Calls

```python
def get_weather(city, unit="celsius"):
    # Mock implementation
    return {"temperature": 25, "condition": "晴", "unit": unit}

# Check for tool calls
if response.output.choices[0].message.get('tool_calls'):
    tool_calls = response.output.choices[0].message['tool_calls']
    
    for tool_call in tool_calls:
        function_name = tool_call['function']['name']
        arguments = json.loads(tool_call['function']['arguments'])
        
        # Execute function
        if function_name == 'get_weather':
            result = get_weather(**arguments)
            
            # Append tool result
            messages.append(response.output.choices[0].message)
            messages.append({
                'role': 'tool',
                'name': function_name,
                'content': json.dumps(result, ensure_ascii=False)
            })
    
    # Get final response
    final_response = Generation.call(
        model='qwen-max',
        messages=messages,
        tools=tools
    )
    print(final_response.output.text)
```

---
## 7. Audio Processing

### Speech Recognition (ASR)

```python
from dashscope.audio.asr import Recognition

recognition = Recognition(model='paraformer-v1', format='wav', language_hints=['zh'])

# From file
result = recognition.call('audio.wav')
print(result.output.transcription)

# Streaming
with open('audio.wav', 'rb') as f:
    for result in recognition.streaming_call(f):
        if result.output.sentence:
            print(result.output.sentence.text)
```

### Text-to-Speech (TTS)

```python
from dashscope.audio.tts import SpeechSynthesizer

synthesizer = SpeechSynthesizer(
    model='sambert-zhichu-v1',
    voice='zhixiaobai'
)

audio = synthesizer.call("你好，这是一段测试语音")

with open('output.wav', 'wb') as f:
    f.write(audio.audio)
```

---
## 8. API Parameters

### Generation Parameters

```python
response = Generation.call(
    model='qwen-plus',
    messages=messages,
    
    # Sampling parameters
    temperature=0.85,         # Randomness (0.0-2.0)
    top_p=0.8,                # Nucleus sampling
    top_k=50,                 # Top-k sampling
    
    # Output control
    max_tokens=2000,          # Max response length
    stop=['END'],             # Stop sequences
    
    # Advanced
    seed=42,                  # Reproducibility
    enable_search=False,      # Web search grounding
    result_format='message',  # 'text' or 'message'
    stream=False,             # Streaming
    incremental_output=False  # Stream deltas vs full
)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | required | Model ID |
| `messages` | array | required | Conversation history |
| `temperature` | float | 1.0 | Sampling temperature (0-2) |
| `top_p` | float | 0.8 | Nucleus sampling |
| `top_k` | int | null | Top-k sampling |
| `max_tokens` | int | 1500 | Max tokens to generate |
| `stop` | array | null | Stop sequences |
| `seed` | int | null | Random seed |
| `enable_search` | bool | false | Enable web search |
| `stream` | bool | false | Enable streaming |

---
## 9. Web Search (RAG)

### Enable Search Grounding

```python
response = Generation.call(
    model='qwen-max',
    messages=[
        {'role': 'user', 'content': '2024年诺贝尔物理学奖获得者是谁？'}
    ],
    enable_search=True  # Enable web search
)

print(response.output.text)

# Access search results
if hasattr(response.output, 'search_info'):
    for item in response.output.search_info:
        print(f"Source: {item.url}")
        print(f"Title: {item.title}")
```

---
## 10. Rate Limits & Pricing

### Rate Limits (DashScope)

| Tier | QPS | Daily Quota |
|------|-----|-------------|
| Free | 2 | Limited |
| Basic | 10 | 1M tokens/day |
| Pro | 100+ | Custom |

### Pricing (CNY per 1M tokens)

| Model | Input | Output |
|-------|-------|--------|
| qwen-max | ¥40 | ¥120 |
| qwen-plus | ¥8 | ¥8 |
| qwen-turbo | ¥2 | ¥6 |
| qwen-vl-max | ¥20 | ¥20 |
| qwen-vl-plus | ¥8 | ¥8 |

**Note:** Pricing in Chinese Yuan (CNY). $1 USD ≈ ¥7.2 CNY (2025).

**Open models:** Free to use (self-hosted)

---
## 11. Self-Hosting Open Models

### Using ModelScope

```python
from modelscope import AutoModelForCausalLM, AutoTokenizer

model_name = "qwen/Qwen2.5-7B-Instruct"

tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    trust_remote_code=True
)

# Generate
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
]

text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)

inputs = tokenizer([text], return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=512)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)
```

### Using vLLM

```bash
# Install vLLM
pip install vllm

# Serve Qwen2.5-7B
vllm serve Qwen/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 \
  --port 8000 \
  --trust-remote-code

# Query
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-7B-Instruct",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Using Ollama

```bash
# Pull model
ollama pull qwen2.5:7b

# Run locally
ollama run qwen2.5:7b "你好"
```

### Using llama.cpp

```bash
# Download GGUF model
huggingface-cli download Qwen/Qwen2.5-7B-Instruct-GGUF \
  qwen2.5-7b-instruct-q4_k_m.gguf

# Run
./llama-cli -m qwen2.5-7b-instruct-q4_k_m.gguf \
  -p "你好" \
  -n 256
```

---
## 12. Best Practices

### Temperature Guide

| Task Type | Temperature |
|-----------|-------------|
| Code generation | 0.0 - 0.3 |
| Factual QA | 0.1 - 0.5 |
| Technical writing | 0.3 - 0.7 |
| Creative writing | 0.7 - 1.0 |
| Brainstorming | 1.0 - 1.5 |

### Error Handling

```python
from dashscope import Generation
from http import HTTPStatus

try:
    response = Generation.call(
        model='qwen-plus',
        messages=messages
    )
    
    if response.status_code == HTTPStatus.OK:
        print(response.output.text)
    else:
        print(f'Error code: {response.code}')
        print(f'Error message: {response.message}')
        
except Exception as e:
    print(f'Exception: {e}')
```

### Retry Logic

```python
import time
from http import HTTPStatus

def call_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = Generation.call(
                model='qwen-plus',
                messages=messages
            )
            
            if response.status_code == HTTPStatus.OK:
                return response
            elif response.status_code == 429:  # Rate limit
                if attempt < max_retries - 1:
                    wait = 2 ** attempt
                    print(f'Rate limited. Waiting {wait}s...')
                    time.sleep(wait)
                else:
                    raise Exception(f'Rate limit: {response.message}')
            else:
                raise Exception(f'API error: {response.message}')
                
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(1)
            else:
                raise
```

---
## 13. Advanced Features

### Long Context (QwenLong)

```python
# Use QwenLong for 1M context
response = Generation.call(
    model='qwen-long',  # 1M context window
    messages=[
        {
            'role': 'user',
            'content': f'Analyze this entire book:\n\n{very_long_text}'
        }
    ]
)
```

### Batch Processing

```python
from dashscope import BatchGeneration

# Submit batch job
job = BatchGeneration.call(
    model='qwen-plus',
    input_file_path='batch_input.jsonl',
    output_file_path='batch_output.jsonl'
)

# Check status
status = BatchGeneration.status(job.job_id)
print(f'Status: {status.status}')

# Download results when complete
if status.status == 'SUCCEEDED':
    BatchGeneration.download(job.job_id, 'results.jsonl')
```

---
## 14. Comparison

### vs GPT-4

- ✅ **75% cheaper** ($1.50 vs $10 per 1M input in USD)
- ✅ **Better Chinese** understanding
- ✅ **Open-source options** available
- ⚠️ **Weaker English** (but improving)
- ⚠️ **Less creative** writing

### vs Claude 3.5

- ✅ **50% cheaper**
- ✅ **Strong Chinese** support
- ✅ **Multimodal** (vision, audio)
- ⚠️ **Smaller context** (32K vs 200K for API)
- ⚠️ **Less nuanced** English

### vs DeepSeek

- ✅ **Better vision** capabilities
- ✅ **Audio processing** support
- ✅ **Web search** grounding
- ⚠️ **Slightly more expensive**
- ⚠️ **Similar performance** on Chinese tasks

### Strengths

- Excellent Chinese language understanding
- Multimodal capabilities (text, vision, audio)
- Strong math and coding (specialized models)
- Open-source models available
- Web search grounding
- Alibaba Cloud integration

---
## 15. CLI Tools

### Using with LiteLLM

```bash
pip install litellm

export DASHSCOPE_API_KEY="sk-..."

# Map to OpenAI-compatible format
litellm --model qwen/qwen-plus
```

### Custom CLI Wrapper

```bash
#!/bin/bash
# qwen-chat.sh

API_KEY="${DASHSCOPE_API_KEY}"

curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"qwen-plus\",
    \"input\": {
      \"messages\": [
        {\"role\": \"user\", \"content\": \"$1\"}
      ]
    }
  }" | jq -r '.output.text'
```

```bash
# Usage
chmod +x qwen-chat.sh
./qwen-chat.sh "你好"
```

---
## 16. Troubleshooting

### Common Issues

**Invalid API Key:**
```bash
# Verify key
echo $DASHSCOPE_API_KEY

# Test with simple request
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "qwen-turbo", "input": {"messages": [{"role": "user", "content": "test"}]}}'
```

**Encoding Issues:**
```python
import json

# Ensure UTF-8 encoding for Chinese
response = Generation.call(model='qwen-plus', messages=messages)
text = response.output.text
print(text.encode('utf-8').decode('utf-8'))
```

**Model Not Available:**
```python
# List available models
from dashscope import Model

models = Model.list()
for model in models:
    print(model.model_id)
```

**Context Length Exceeded:**
```python
# Use QwenLong for large inputs
if len(content) > 30000:
    model = 'qwen-long'  # 1M context
else:
    model = 'qwen-plus'  # 32K context
```

---
## 17. Migration Path

### From OpenAI

```python
# OpenAI
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)

# Qwen (OpenAI-compatible)
client = OpenAI(
    api_key="sk-...",  # DashScope key
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)
response = client.chat.completions.create(
    model="qwen-plus",
    messages=[{"role": "user", "content": "Hello"}]
)
```

### From Other Chinese Models

```python
# Kimi (Moonshot)
from openai import OpenAI
client = OpenAI(api_key="...", base_url="https://api.moonshot.cn/v1")

# Qwen (DashScope - native SDK)
from dashscope import Generation
response = Generation.call(model='qwen-plus', messages=messages)

# Both support Chinese well, choose based on:
# - Qwen: Better vision, audio, open models
# - Kimi: Longer context (200K)
```

---
**Last Updated:** 2026-03-24  
**API Version:** DashScope v1

*Part of the [my_agents](../../) repository*
