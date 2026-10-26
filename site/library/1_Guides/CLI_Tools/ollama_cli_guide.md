---
title: "💻 Ollama CLI Guide"
tags: ["guide", "cli", "ollama", "local-llm"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: ollama/ollama
---

# Ollama CLI Guide

## Overview
This guide covers the usage of the Ollama CLI for running and managing Large Language Models locally.

## Agent Configuration
Agents using Ollama must be configured to point to the local Ollama API endpoint, typically `http://localhost:11434`.

## System Prompt
System prompts in Ollama can be defined directly in Modelfiles.
```dockerfile
FROM llama3
SYSTEM "You are a local AI assistant. Provide concise and helpful answers."
```

## Workflow
1. Install Ollama.
2. Pull the desired model using `ollama run <model_name>`.
3. Interact via CLI or the local API.

## Example Interactions
```bash
# Run a model
ollama run llama3

# List local models
ollama list

# Create a custom model
ollama create my-custom-model -f Modelfile
```

## Best Practices
- Ensure sufficient RAM/VRAM is available for the models you intend to run.
- Regularly update models using `ollama pull <model_name>`.

## Customization Options
Customize models using Modelfiles, adjusting parameters like temperature and system prompts.

## Troubleshooting
- If Ollama fails to start, check if port 11434 is already in use.
- Performance issues are often due to insufficient hardware resources.

## Integration
Ollama integrates well with LangChain and LlamaIndex for local RAG pipelines.

## Version History
- v1.0 - Initial guide creation

## References
- [Ollama Documentation](https://github.com/ollama/ollama/tree/main/docs)
