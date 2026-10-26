---
title: "💻 Ollama Setup Guide"
tags: ["api", "ollama"]
category: "Agent_Guides"
subcategory: "API_Providers"
repo: ollama/ollama
---

# Ollama Setup Guide

## Overview
Ollama allows you to get up and running with large language models locally. This guide covers how to set it up as an API provider.

## Agent Configuration
When running Ollama as an API provider, the default port is `11434`.
Ensure your agent SDKs are configured to point to `http://localhost:11434`.

## System Prompt
Ollama allows defining system prompts within a `Modelfile`.
Example:
```
FROM llama2
SYSTEM You are Mario from Super Mario Bros. Answer as Mario.
```

## Workflow
1. Install Ollama.
2. Start the service.
3. Pull a model: `ollama pull llama2`.
4. Make API requests directly to the REST endpoint.

## Example Interactions
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt":"Why is the sky blue?"
}'
```

## Best Practices
- Create custom Modelfiles to lock in behavior.
- Pre-pull models to avoid cold start delays.

## Customization Options
- You can adjust parameters like `temperature` and `num_ctx` in the Modelfile.

## Troubleshooting
- Ensure port `11434` is not blocked by a firewall.
- Check Ollama service logs if models fail to load.

## Integration
Ollama provides official libraries for Python and JavaScript.

## Version History
- Version 1.0

## References
- [Ollama GitHub](https://github.com/ollama/ollama)
