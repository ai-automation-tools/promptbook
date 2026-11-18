---
title: "🦙 llama.cpp Guide: Run GGUF Models Locally"
tags: ["llama-cpp", "gguf", "local-llm", "llama-server", "inference", "openai-compatible"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
checked: 2026-11-18
repo: ggml-org/llama.cpp
---

<!-- Last Updated: 2026-11-18 - Checked against the repo README, docs/build.md, tools/cli and tools/server READMEs -->

# llama.cpp Guide: Run GGUF Models Locally

llama.cpp runs LLM inference with minimal setup on a wide range of hardware, built on the
ggml library. This guide covers llama.cpp itself: installing or building it, chatting with
`llama-cli`, and serving an OpenAI-compatible API with `llama-server`. For the packaged
wrappers see the [Ollama](ollama_cli_guide.md) and [LocalAI](localai_cli_guide.md) guides.

## Install

The README lists these routes:

| Route | Command or place |
|:---|:---|
| Install script (Linux/macOS) | `curl -LsSf https://llama.app/install.sh \| sh` |
| Install script (Windows) | `irm https://llama.app/install.ps1 \| iex` |
| Pre-built binaries | https://github.com/ggml-org/llama.cpp/releases |
| Docker | `docs/docker.md` in the repo |
| From source | `docs/build.md` |

The README's quick start, run after installing:

```bash
llama cli -hf ggml-org/Qwen3.5-0.8B-GGUF      # download from Hugging Face and chat
llama serve -hf ggml-org/Qwen3.5-0.8B-GGUF    # OpenAI-compatible API server
```

Releases are tagged by build number (b12521 was the latest on 2026-11-18) and appear several
times a day.

## Build from source

```bash
cmake -B build
cmake --build build --config Release
```

Add `-j 8` for parallel jobs. Enable a backend at configure time:

| Backend | Flag |
|:---|:---|
| CUDA (NVIDIA) | `-DGGML_CUDA=ON` |
| Metal (macOS) | on by default; `-DGGML_METAL=OFF` disables |
| Vulkan | `-DGGML_VULKAN=ON` |
| HIP (AMD) | `-DGGML_HIP=ON` |
| BLAS | `-DGGML_BLAS=ON -DGGML_BLAS_VENDOR=OpenBLAS` |

```bash
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release
```

Backends can be combined (`-DGGML_CUDA=ON -DGGML_VULKAN=ON`). At run time pick devices with
`--device` and list them with `--list-devices`. On Windows, install Visual Studio 2022 with the
"Desktop development with C++" workload and build from a Developer Command Prompt or Developer
PowerShell. Build only the server with `cmake --build build --config Release -t llama-server`.

## Models: GGUF and -hf

llama.cpp loads models in GGUF format. Two ways to point at one:

- `-m, --model FNAME` loads a local `.gguf` file.
- `-hf, --hf-repo <user>/<model>[:quant]` downloads from Hugging Face. The quant is optional and
  case-insensitive; it defaults to Q4_K_M, or the first file in the repo if that is missing.
  The server also fetches the multimodal projector when the repo has one.

```bash
llama-server -hf ggml-org/GLM-4.7-Flash-GGUF:Q4_K_M
```

## Key flags

Shared by `llama-cli` and `llama-server` (descriptions from the tool READMEs):

| Flag | Meaning |
|:---|:---|
| `-c, --ctx-size N` | Prompt context size; 0 (default) reads it from the model |
| `-ngl, --gpu-layers N` | Layers kept in VRAM: a number, `auto` or `all` (default `auto`) |
| `-t, --threads N` | CPU threads for generation (default -1) |
| `-fa, --flash-attn on\|off\|auto` | Flash Attention (default `auto`) |
| `--jinja` | Jinja chat-template engine (on by default in the server) |

`llama-cli` adds `-n, --predict N` (tokens to generate, -1 = infinite), `-p, --prompt`,
`--temp` (default 0.80) and `-st, --single-turn` (one turn, then exit).

`llama-server` adds:

| Flag | Meaning |
|:---|:---|
| `--host HOST` | Listen address, default `127.0.0.1` |
| `--port PORT` | Listen port, default 9931 per the server README |
| `-np, --parallel N` | Number of server slots (-1 = auto) |
| `--api-key KEY` | Require a key; comma-separate several. Env `LLAMA_API_KEY`; `--api-key-file` reads from a file |

Router mode (several models behind one server) uses `--models-dir PATH`, `--models-preset PATH`
and `--models-max N` (default 4 loaded at once).

## Serve an OpenAI-compatible API

```bash
llama-server -m models/7B/ggml-model.gguf -c 2048
```

The built-in chat web UI (Llama Chat) is on by default at the same address. Call it like OpenAI:

```python
import openai

client = openai.OpenAI(
    base_url="http://localhost:9931/v1",
    api_key="sk-no-key-required",
)
```

```bash
curl http://localhost:9931/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer no-key" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Write a limerick about python exceptions"}]}'
```

Other endpoints: `GET /health` (no key needed), `POST /v1/completions`, `POST /v1/embeddings`,
`POST /v1/rerank`, `POST /completion` (native, not OpenAI-shaped), `POST /tokenize`,
`POST /detokenize`, `POST /apply-template`, `POST /infill`, `GET /props`.

Docker, from the server README:

```bash
docker run -p 8080:8080 -v /path/to/models:/models ghcr.io/ggml-org/llama.cpp:server \
  -m models/7B/ggml-model.gguf -c 512 --host 0.0.0.0 --port 8080
```

There are no accounts: bind to `0.0.0.0` only on a network you trust, and set `--api-key` if you do.

## Sources

- https://github.com/ggml-org/llama.cpp (README.md)
- https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md
- https://github.com/ggml-org/llama.cpp/blob/master/tools/cli/README.md
- https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md
- https://github.com/ggml-org/llama.cpp/releases
