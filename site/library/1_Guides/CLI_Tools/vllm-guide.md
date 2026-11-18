---
title: "⚡ vLLM OpenAI-Compatible Server Guide"
tags: ["vllm", "inference", "openai-compatible", "self-hosted", "llm-serving"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: vllm-project/vllm
---

<!-- Last Updated: 2026-11-18 - Checked against docs.vllm.ai (getting_started/quickstart, serving/online_serving, cli/serve) -->

# vLLM OpenAI-Compatible Server Guide

How to serve a model with `vllm serve` and call it with any OpenAI client.

## Requirements

| Item | Value |
|:---|:---|
| OS | Linux |
| Python | 3.11 to 3.14 |
| GPU | NVIDIA via the pip install below; AMD ROCm, Intel GPUs, TPUs, Ascend NPUs and Apple Silicon have separate install paths |

## Install

```bash
uv venv --python 3.12 --seed
uv pip install vllm --torch-backend=auto
vllm download-kernels
```

`vllm download-kernels` fetches precompiled kernels that would otherwise be built at startup, which can take several minutes on Hopper and newer GPUs.

## Start the server

```bash
vllm serve Qwen/Qwen2.5-1.5B-Instruct
```

It listens on `http://localhost:8000`. Check it:

```bash
curl http://localhost:8000/v1/models
```

## Call it

Completions:

```bash
curl http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "Qwen/Qwen2.5-1.5B-Instruct", "prompt": "San Francisco is a", "max_tokens": 7, "temperature": 0}'
```

With the OpenAI Python client, point `base_url` at `http://localhost:8000/v1`. Any placeholder API key works unless you set `--api-key`. Use `client.completions.create` or `client.chat.completions.create` with the same model name.

## Endpoints

| Endpoint | Purpose |
|:---|:---|
| `/v1/models` | List served models |
| `/v1/completions` | Text completions |
| `/v1/chat/completions` | Chat |
| `/v1/chat/completions/batch` | Chat batch |
| `/v1/responses` | Responses API (also `/v1/responses/{response_id}` and `.../cancel`) |
| `/v1/embeddings` | Embeddings |
| `/v1/audio/transcriptions` | Transcription |
| `/v1/audio/translations` | Translation |

## Key `vllm serve` options

| Option | Meaning |
|:---|:---|
| `--host` | Host name |
| `--port` | Port (default `8000`) |
| `--api-key` | Require one of the given keys in the request header. Covers only the `/v1`, `/v2`, `/inference` and `/cohere` prefixes; other endpoints stay unauthenticated |
| `--max-model-len` | Context length for prompt plus output; derived from the model config if unset; accepts `k`/`M` suffixes and `-1` or `auto` |
| `--tensor-parallel-size`, `-tp` | Number of tensor-parallel groups (default `1`) |
| `--gpu-memory-utilization` | Fraction (0 to 1) of GPU memory for this instance. Unset: 1.0 with the extensible KV cache, 0.92 otherwise |
| `--served-model-name` | Name(s) the API answers to; the first appears in responses. Defaults to the model value |
| `--chat-template` | Path or string for a chat template |
| `--config` | Read options from a YAML file |

## Chat needs a chat template

The model's tokenizer config must include a chat template. Without one, chat requests error. Supply one with `--chat-template`:

```bash
vllm serve <model> --chat-template ./path-to-chat-template.jinja
```

## Offline use instead of a server

```python
from vllm import LLM, SamplingParams

llm = LLM(model="facebook/opt-125m")
```

`llm.generate` does not apply a chat template; use `llm.chat` for chat models.

## Sources

- https://docs.vllm.ai/en/latest/getting_started/quickstart/
- https://docs.vllm.ai/en/latest/serving/online_serving/
- https://docs.vllm.ai/en/latest/cli/serve/
