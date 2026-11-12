---
title: "🔌 Hugging Face"
description: "Connect an agent to the Hugging Face Hub: search models, datasets and papers, and call Gradio Spaces as tools."
tags: ["mcp-server", "apps-and-services", "hugging-face", "machine-learning", "datasets", "official"]
server:
  repo: huggingface/hf-mcp-server
  license: "MIT"
  maintainer: "Hugging Face (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-12
---

# Hugging Face MCP server

Connect an agent to the Hugging Face Hub: search models, datasets and papers, and call Gradio Spaces as tools.

## Install

**Claude Code**

```bash
claude mcp add hf-mcp-server -t http https://huggingface.co/mcp?login
```

Then start `claude` and follow the prompts to authenticate. To use an access token instead:

```bash
claude mcp add hf-mcp-server \
  -t http https://huggingface.co/mcp \
  -H "Authorization: Bearer <YOUR_HF_TOKEN>"
```

**Any MCP client** (`mcp.json` config, token in a header)

```json
"huggingface": {
  "url": "https://huggingface.co/mcp",
  "headers": {
    "Authorization": "Bearer <YOUR_HF_TOKEN>"
  }
}
```

## What it can do

- Search the Hub through its API and search endpoints
- Expose Gradio Spaces you pick as tools (configure them at `huggingface.co/settings/mcp`)
- Offer an `?bouquet=openai` variant with Hub filesystem, repository search and creation, dynamic Space, Jobs and sandbox tools

## Notes

Repository creation, Jobs, dynamic Spaces and sandbox tools need Hugging Face authentication. Use a fine-grained token with only the scopes you need. Add `?no_image_content=true` to the URL to drop image blocks returned by Gradio servers. The repo also contains the server's own code, so you can self-host it.

## Details

| | |
|:---|:---|
| **Source** | [huggingface/hf-mcp-server](https://github.com/huggingface/hf-mcp-server) |
| **Maintainer** | Hugging Face (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | Browser login, or a Hugging Face token in an `Authorization: Bearer` header |
| **Needs** | A Hugging Face account |

_Install lines read from the server's README on 2026-11-12. The Monthly Upkeep re-checks every card._
