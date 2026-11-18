---
title: "🚇 LiteLLM Guide: One completion() for Every Provider, Plus a Proxy"
tags: ["litellm", "llm-gateway", "proxy", "python", "openai-compatible", "virtual-keys"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: BerriAI/litellm
---

<!-- Last Updated: 2026-11-18 - Checked against docs.litellm.ai -->

# LiteLLM Guide: One completion() for Every Provider, Plus a Proxy

LiteLLM translates OpenAI-style Chat Completion calls to 100+ providers (OpenAI, Anthropic,
Azure, Bedrock, Vertex AI, Gemini, Groq, Ollama, vLLM and more). Use it two ways: as a Python SDK
(`completion()`), or as a proxy server (an AI gateway) that any OpenAI client can call.

Licence note: the repo's licence is not auto-detected by GitHub, and the README says some
enterprise features fall under a separate "LiteLLM Commercial License". Read the repo's
`LICENSE` file before redistributing.

## Install

```bash
uv add litellm                        # Python SDK
uv tool install 'litellm[proxy]'      # proxy / AI gateway
```

The docs state LiteLLM 1.84.0 and newer need Python 3.10+; `uv` provisions one, while a plain
`pip install` can silently install an older release.

## SDK: completion()

Models take a `provider/model` prefix; keys come from the provider's environment variables.

```python
from litellm import completion
import os

os.environ["ANTHROPIC_API_KEY"] = "your-api-key"

response = completion(
    model="anthropic/claude-sonnet-5",
    messages=[{"role": "user", "content": "Hello, how are you?"}],
)
print(response.choices[0].message.content)
```

| Provider | `model=` prefix | Auth / settings from the docs |
|:---|:---|:---|
| OpenAI | `openai/...` | `OPENAI_API_KEY` |
| Anthropic | `anthropic/...` | `ANTHROPIC_API_KEY` |
| Azure OpenAI | `azure/<deployment>` | `AZURE_API_KEY`, `AZURE_API_BASE`, `AZURE_API_VERSION` |
| Bedrock | `bedrock/...` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION_NAME` |
| Vertex AI | `vertex_ai/...` | `VERTEXAI_PROJECT`, `VERTEXAI_LOCATION`, gcloud default credentials |
| Ollama | `ollama/...` | `api_base="http://localhost:11434"` |

Swapping providers means changing the `model` string, not the call.

Useful parameters (all OpenAI-style, translated per provider): `stream`, `stream_options`
(`{"include_usage": True}` returns usage on the last chunk), `temperature`, `top_p`,
`max_tokens`, `max_completion_tokens`, `stop`, `tools`, `tool_choice`, `response_format`,
`timeout`, `api_key`, `api_base` (alias `base_url`).

By default LiteLLM raises if you pass an OpenAI parameter the target model does not support;
set `drop_params=True` to drop it instead. `get_supported_openai_params(model=..., custom_llm_provider=...)`
lists what a model accepts.

Streaming:

```python
for chunk in completion(model="openai/<model>", messages=msgs, stream=True):
    print(chunk.choices[0].delta.content or "", end="")
```

Errors map to OpenAI exception types, so existing handlers keep working:

```python
import litellm
try:
    litellm.completion(model="anthropic/claude-sonnet-5", messages=[{"role": "user", "content": "Hey!"}])
except litellm.AuthenticationError as e: ...
except litellm.RateLimitError as e: ...
except litellm.APIError as e: ...
```

## Proxy: config.yaml

`model_list` defines what the proxy serves. `model_name` is what clients send; `litellm_params`
holds the real `model`, `api_base`, `api_key`, `rpm` and similar. Several entries with the same
`model_name` are load balanced. Prefix any value with `os.environ/` to read it from the
environment at startup, so secrets stay out of the file.

```yaml
model_list:
  - model_name: my-chat-model
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY
      rpm: 60

router_settings:
  routing_strategy: simple-shuffle

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
```

`routing_strategy` values: `simple-shuffle` (default), `least-busy`, `usage-based-routing`,
`latency-based-routing`. `router_settings` also takes `allowed_fails`, `num_retries`, `timeout`
and Redis settings for multi-instance setups.

## Run the proxy

```bash
litellm --config /path/to/config.yaml     # add --detailed_debug for verbose logs
litellm --model huggingface/bigcode/starcoder   # no config: one model
```

`CONFIG_FILE_PATH` can name the file instead, then run plain `litellm`. It listens on
`http://0.0.0.0:4000`. Call it with any OpenAI client:

```python
import openai

client = openai.OpenAI(api_key="anything", base_url="http://0.0.0.0:4000")
response = client.chat.completions.create(
    model="my-chat-model",
    messages=[{"role": "user", "content": "this is a test request, write a short poem"}],
)
```

With `master_key` set, send it as `Authorization: Bearer <key>`. The docs point to a Docker route
at /docs/proxy/docker_quick_start (proxy, database and Admin UI together).

## Virtual keys

Virtual keys let you hand out scoped keys instead of the master key. Requirements:

- A Postgres database, with `DATABASE_URL` set to its `postgresql://` string.
- A master key starting with `sk-`, in `general_settings.master_key` or `LITELLM_MASTER_KEY`.

```bash
curl 'http://0.0.0.0:4000/key/generate' \
  --header 'Authorization: Bearer <your-master-key>' \
  --header 'Content-Type: application/json' \
  --data-raw '{"models": ["my-chat-model"], "metadata": {"user": "someone@example.com"}}'
```

`models` limits which model names the key may call; `max_budget` caps spend (tracked in USD);
`duration` sets validity (for example `"30d"`). Clients then use the returned key as their
`api_key`. Behind an API gateway that owns `Authorization`, send the LiteLLM key in an
`X-Litellm-Key: Bearer sk-...` header, or rename the header with `litellm_key_header_name`
under `general_settings`.

## Sources

- https://docs.litellm.ai/docs/
- https://docs.litellm.ai/docs/completion/input
- https://docs.litellm.ai/docs/proxy/quick_start
- https://docs.litellm.ai/docs/proxy/configs
- https://docs.litellm.ai/docs/proxy/virtual_keys
- https://github.com/BerriAI/litellm (README)
