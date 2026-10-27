---
title: "💻 LocalAI CLI Tools"
tags: ["cli", "localai"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: mudler/LocalAI
---

# LocalAI CLI Tools

## Overview
LocalAI is a drop-in replacement REST API that’s compatible with OpenAI API specifications for local inferencing. It allows you to run LLMs, generate images, or perform audio transcriptions locally or on-premise without GPU requirements. This guide will show you how to use it.

## Agent Configuration
No specific agent configuration is needed for the CLI. However, ensure that the API URL points to the local instance (e.g., `http://localhost:8080/v1`).

## System Prompt
There is no specific system prompt required for LocalAI itself, as it acts as a backend service. Use system prompts depending on the model you deploy through LocalAI.

## Workflow
1. Download LocalAI binaries or use the docker image.
2. Place your model files (e.g., `ggml-model-q4_0.bin`) in the `models` directory.
3. Start the server with `local-ai --models-path ./models`.
4. Use standard OpenAI CLI tools pointing to `http://localhost:8080/v1`.

## Example Interactions
Using curl to test the LocalAI CLI backend:
```bash
curl http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello, how are you?"}],
  "temperature": 0.7
}'
```

## Best Practices
- Always ensure you have sufficient RAM to load the models.
- Quantized models (e.g., 4-bit) offer the best balance between performance and quality.

## Customization Options
You can configure a `yaml` file for each model to define specific behavior, prompt templates, and defaults.

## Troubleshooting
- **Model not found:** Check the models directory and verify the model name.
- **Out of memory:** Try using a smaller or quantized model.

## Integration
Integrates easily with LangChain, LlamaIndex, and other tools designed for the OpenAI API.

## Version History
- Initial release: LocalAI Guide v1.0

## References
- [LocalAI Documentation](https://localai.io)
