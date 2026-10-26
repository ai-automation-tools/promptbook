---
title: "Kimi CLI Guide"
tags: ["kimi", "moonshot", "cli", "reference", "api", "chinese-ai","featured"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: MoonshotAI/kimi-cli
---
## CLI Sync Notes (March 2026)

Includes current **Kimi Code CLI** direction.

### Notable March 2026 CLI updates
- Plugin system support (`plugin.json`) and multi-plugin repo install flows.
- Subagent delegation tooling and unified approval runtime.
- Plan-mode/interaction improvements and visualization/reporting enhancements.
- Ongoing reliability fixes in print/non-interactive and shell/task handling.

### Official references
- https://moonshotai.github.io/kimi-cli/en/release-notes/changelog.html
- https://github.com/MoonshotAI/kimi-cli

### Maintainer note
- Preserve Moonshot API examples, but weekly sync should anchor to the CLI changelog first.

---
# Kimi (Moonshot AI) Agent Guide

Comprehensive reference for building and managing agents with Kimi/Moonshot AI models via CLI and API.

**Key Features:**
- 🌙 Up to 200K context window (longest available)
- 🇨🇳 Strong Chinese language capabilities
- 💬 Optimized for long-form conversation
- 🔧 OpenAI-compatible API
- 📚 Document understanding and analysis
- 🚀 Fast inference with competitive pricing

---
## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [kimi.moonshot.cn](https://kimi.moonshot.cn/) |
| **API Platform** | [platform.moonshot.cn](https://platform.moonshot.cn/) |
| **API Documentation** | [platform.moonshot.cn/docs](https://platform.moonshot.cn/docs/api/chat) |
| **GitHub** | [github.com/moonshotai](https://github.com/moonshotai) |
| **Pricing** | [platform.moonshot.cn/pricing](https://platform.moonshot.cn/pricing) |
| **Developer Console** | [platform.moonshot.cn/console](https://platform.moonshot.cn/console/api-keys) |
| **Chat Interface** | [kimi.moonshot.cn](https://kimi.moonshot.cn/) |

---
## 2. Installation & Setup

### API Key Setup

```bash
# Get your API key from platform.moonshot.cn
export MOONSHOT_API_KEY="sk-..."

# Add to shell profile for persistence
echo 'export MOONSHOT_API_KEY="sk-..."' >> ~/.bashrc
source ~/.bashrc
```

### Using with cURL

```bash
# Basic chat completion
curl https://api.moonshot.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MOONSHOT_API_KEY" \
  -d '{
    "model": "moonshot-v1-8k",
    "messages": [
      {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手"},
      {"role": "user", "content": "你好"}
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
    base_url="https://api.moonshot.cn/v1"
)

response = client.chat.completions.create(
    model="moonshot-v1-8k",
    messages=[
        {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手"},
        {"role": "user", "content": "你好"}
    ]
)

print(response.choices[0].message.content)
```

---
## 3. Available Models

### Production Models

| Model | Context Window | Description | Use Case |
|-------|----------------|-------------|----------|
| `moonshot-v1-8k` | 8K | Fast responses | General chat, quick queries |
| `moonshot-v1-32k` | 32K | Balanced performance | Technical docs, articles |
| `moonshot-v1-128k` | 128K | Large documents | Books, research papers |
| `moonshot-v1-200k` | 200K | Ultra-long context | Code analysis, thesis review |

### Model Selection Guide

**Use 8K when:**
- Simple Q&A
- Quick translations
- Brief summaries
- Cost optimization

**Use 32K when:**
- Technical documentation review
- Multi-turn conversations
- Standard article analysis

**Use 128K when:**
- Large codebase analysis
- Long-form content generation
- Complex research papers

**Use 200K when:**
- Full book analysis
- Massive code repository review
- PhD thesis evaluation
- Multi-document synthesis

---
## 4. API Parameters

### Chat Completion Parameters

```json
{
  "model": "moonshot-v1-8k",
  "messages": [...],
  "temperature": 0.3,
  "max_tokens": 2048,
  "top_p": 1.0,
  "n": 1,
  "stream": false,
  "stop": null,
  "presence_penalty": 0.0,
  "frequency_penalty": 0.0
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | required | Model ID to use |
| `messages` | array | required | Conversation history |
| `temperature` | float | 0.3 | Sampling temperature (0-1) |
| `max_tokens` | int | 2048 | Maximum tokens to generate |
| `top_p` | float | 1.0 | Nucleus sampling threshold |
| `n` | int | 1 | Number of completions |
| `stream` | boolean | false | Enable streaming responses |
| `stop` | string/array | null | Stop sequences |
| `presence_penalty` | float | 0.0 | Encourage topic diversity (-2.0 to 2.0) |
| `frequency_penalty` | float | 0.0 | Reduce repetition (-2.0 to 2.0) |

---
## 5. File Upload & Document Analysis

### Upload File

```python
# Upload a file for analysis
file = client.files.create(
    file=open("document.pdf", "rb"),
    purpose="file-extract"
)

file_id = file.id
print(f"File uploaded: {file_id}")
```

### List Files

```python
# List all uploaded files
files = client.files.list()

for file in files.data:
    print(f"{file.id}: {file.filename}")
```

### Retrieve File Content

```python
# Get extracted content
file_content = client.files.retrieve_content(file_id)
print(file_content)
```

### Delete File

```python
# Delete a file
client.files.delete(file_id)
```

### Use File in Chat

```python
# Reference uploaded file in conversation
response = client.chat.completions.create(
    model="moonshot-v1-32k",
    messages=[
        {
            "role": "system",
            "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手"
        },
        {
            "role": "system",
            "content": f"文件内容:\n{file_content}"
        },
        {
            "role": "user",
            "content": "请总结这份文档的主要内容"
        }
    ]
)
```

---
## 6. Function Calling (Tools)

### Define Tools

```python
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

response = client.chat.completions.create(
    model="moonshot-v1-8k",
    messages=[{"role": "user", "content": "北京今天天气怎么样？"}],
    tools=tools,
    tool_choice="auto"
)
```

### Handle Tool Calls

```python
import json

if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        function_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)
        
        # Execute function
        if function_name == "get_weather":
            result = get_weather(arguments["city"])
            
            # Append tool result
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "name": function_name,
                "content": json.dumps(result, ensure_ascii=False)
            })
    
    # Get final response
    final_response = client.chat.completions.create(
        model="moonshot-v1-8k",
        messages=messages
    )
```

---
## 7. Streaming Responses

### Python Example

```python
stream = client.chat.completions.create(
    model="moonshot-v1-8k",
    messages=[{"role": "user", "content": "讲一个故事"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### cURL Example

```bash
curl https://api.moonshot.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MOONSHOT_API_KEY" \
  -d '{
    "model": "moonshot-v1-8k",
    "messages": [{"role": "user", "content": "你好"}],
    "stream": true
  }' \
  --no-buffer
```

---
## 8. CLI Integration Examples

### Using with LiteLLM

```bash
# Install LiteLLM
pip install litellm

# Set environment
export MOONSHOT_API_KEY="sk-..."

# Use via CLI
litellm --model moonshot/moonshot-v1-8k
```

### Custom CLI Wrapper

```bash
#!/bin/bash
# kimi-chat.sh

MOONSHOT_API_KEY="sk-..."
MODEL="moonshot-v1-8k"

while true; do
    read -p "You: " user_input
    
    response=$(curl -s https://api.moonshot.cn/v1/chat/completions \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $MOONSHOT_API_KEY" \
        -d "{
            \"model\": \"$MODEL\",
            \"messages\": [{\"role\": \"user\", \"content\": \"$user_input\"}]
        }" | jq -r '.choices[0].message.content')
    
    echo "Kimi: $response"
    echo ""
done
```

---
## 9. Best Practices

### System Prompt

**Recommended system prompt:**
```python
system_prompt = "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
```

### Temperature Settings

| Task Type | Recommended Temperature |
|-----------|------------------------|
| Factual QA | 0.1 - 0.3 |
| Technical writing | 0.3 - 0.5 |
| Creative writing | 0.5 - 0.7 |
| Brainstorming | 0.7 - 0.9 |

### Context Management

```python
def calculate_tokens(text):
    """Approximate token count (Chinese: 1 char ≈ 1.5 tokens)"""
    return int(len(text) * 1.5)

def trim_context(messages, max_tokens=6000):
    """Keep conversation within token limits"""
    total = 0
    trimmed = []
    
    # Always keep system message
    if messages[0]["role"] == "system":
        trimmed.append(messages[0])
        messages = messages[1:]
    
    # Add messages from most recent
    for msg in reversed(messages):
        tokens = calculate_tokens(msg["content"])
        if total + tokens < max_tokens:
            trimmed.insert(1 if trimmed[0]["role"] == "system" else 0, msg)
            total += tokens
        else:
            break
    
    return trimmed
```

---
## 10. Rate Limits & Pricing

### Rate Limits

| Tier | RPM (Requests/Min) | TPM (Tokens/Min) |
|------|-------------------|------------------|
| Free | 3 | 10,000 |
| Standard | 30 | 100,000 |
| Pro | 100 | 500,000 |
| Enterprise | Custom | Custom |

### Pricing (CNY per 1M tokens)

| Model | Input | Output |
|-------|-------|--------|
| moonshot-v1-8k | ¥12 | ¥12 |
| moonshot-v1-32k | ¥24 | ¥24 |
| moonshot-v1-128k | ¥60 | ¥60 |
| moonshot-v1-200k | ¥120 | ¥120 |

**Note:** Pricing is in Chinese Yuan (CNY). As of 2025, $1 USD ≈ ¥7.2 CNY.

---
## 11. Comparison with Other Models

### vs GPT-4

- ✅ **Longer context** (200K vs 128K)
- ✅ **Better Chinese understanding**
- ✅ **Lower latency in Asia**
- ⚠️ **Weaker in complex reasoning**
- ⚠️ **Less multilingual (primarily CN/EN)**

### vs Claude 3

- ✅ **2x longer context** (200K vs 100K)
- ✅ **Better for Chinese documents**
- ✅ **Lower cost** (~60% cheaper)
- ⚠️ **Less creative** in English writing
- ⚠️ **Weaker coding** capabilities

### Strengths

- Industry-leading context window (200K)
- Excellent Chinese language support
- Fast document processing
- Competitive pricing
- OpenAI-compatible API
- Good at information extraction

---
## 12. Advanced Features

### Batch Processing

```python
# Process multiple queries efficiently
queries = ["问题1", "问题2", "问题3"]
responses = []

for query in queries:
    response = client.chat.completions.create(
        model="moonshot-v1-8k",
        messages=[{"role": "user", "content": query}]
    )
    responses.append(response.choices[0].message.content)
```

### Conversation Memory

```python
class KimiChat:
    def __init__(self, model="moonshot-v1-8k"):
        self.client = OpenAI(
            api_key="sk-...",
            base_url="https://api.moonshot.cn/v1"
        )
        self.model = model
        self.messages = [
            {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手"}
        ]
    
    def chat(self, user_input):
        self.messages.append({"role": "user", "content": user_input})
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.messages
        )
        
        assistant_message = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": assistant_message})
        
        return assistant_message
    
    def reset(self):
        self.messages = self.messages[:1]  # Keep only system message
```

---
## 13. Troubleshooting

### Common Issues

**Invalid API Key:**
```bash
# Verify key format
echo $MOONSHOT_API_KEY
# Should start with: sk-...
```

**Context Length Exceeded:**
```python
# Use appropriate model for content size
def select_model(content):
    tokens = len(content) * 1.5
    
    if tokens < 6000:
        return "moonshot-v1-8k"
    elif tokens < 28000:
        return "moonshot-v1-32k"
    elif tokens < 120000:
        return "moonshot-v1-128k"
    else:
        return "moonshot-v1-200k"
```

**Encoding Issues (Chinese):**
```python
# Ensure proper UTF-8 encoding
import json

data = {
    "model": "moonshot-v1-8k",
    "messages": [{"role": "user", "content": "你好"}]
}

response = requests.post(
    "https://api.moonshot.cn/v1/chat/completions",
    headers={
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Bearer {api_key}"
    },
    data=json.dumps(data, ensure_ascii=False).encode('utf-8')
)
```

**Rate Limit Errors:**
```python
import time
from openai import RateLimitError

def call_with_retry(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except RateLimitError:
            if i < max_retries - 1:
                wait_time = (2 ** i) * 5  # Exponential backoff
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise
```

---
## 14. Use Cases

### Long Document Analysis

```python
# Analyze a research paper
with open("paper.txt", "r", encoding="utf-8") as f:
    paper_content = f.read()

response = client.chat.completions.create(
    model="moonshot-v1-128k",
    messages=[
        {"role": "system", "content": "你是学术论文分析专家"},
        {"role": "user", "content": f"请分析以下论文：\n\n{paper_content}\n\n总结：1) 研究问题 2) 方法 3) 主要发现 4) 创新点"}
    ]
)
```

### Code Review

```python
# Review large codebase
with open("app.py", "r") as f:
    code = f.read()

response = client.chat.completions.create(
    model="moonshot-v1-32k",
    messages=[
        {"role": "system", "content": "你是资深代码审查专家"},
        {"role": "user", "content": f"请审查以下代码，指出潜在问题和改进建议：\n\n```python\n{code}\n```"}
    ]
)
```

### Translation

```python
# High-quality translation
response = client.chat.completions.create(
    model="moonshot-v1-8k",
    messages=[
        {"role": "system", "content": "你是专业翻译，精通中英互译"},
        {"role": "user", "content": "请将以下内容翻译成英文：人工智能正在改变世界"}
    ],
    temperature=0.3
)
```

---
**Last Updated:** 2026-03-24  
**API Version:** v1

*Part of the [my_agents](../../) repository*
