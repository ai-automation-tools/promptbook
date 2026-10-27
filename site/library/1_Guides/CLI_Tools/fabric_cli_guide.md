---
title: "Fabric CLI Guide"
tags: ["cli", "fabric", "ai-tools"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: danielmiessler/fabric
---

# Fabric CLI Guide

## Overview
Fabric is an open-source framework for augmenting humans using AI. It provides a set of patterns (prompts) that can be applied to text streams in the terminal.

## Agent Configuration
Configure Fabric via the `~/.config/fabric/` directory. You must run the setup command to configure your API keys for OpenAI or Anthropic.

## System Prompt
Fabric uses specific pattern files as system prompts. Each pattern defines a specific task, such as extracting wisdom or summarizing content.

## Workflow
1. Obtain input text (e.g., from a file or another command).
2. Pipe the input to the Fabric CLI.
3. Specify the pattern you want to apply.
4. Receive the processed output.

## Example Interactions
User: `cat article.txt | fabric --pattern extract_wisdom`
Fabric: Outputs a structured summary of the key insights, quotes, and wisdom extracted from the article text.

## Best Practices
- Chain patterns together for complex workflows using standard Unix pipes.
- Keep your patterns updated by pulling the latest from the Fabric repository.

## Customization Options
- Create custom patterns in the `~/.config/fabric/patterns` directory to tailor Fabric to your specific needs.
- Set default models for different types of patterns.

## Troubleshooting
- Check your API keys and internet connection if requests fail.
- Ensure the input text is not exceeding the context limit of the chosen model.

## Integration
- Works with any Unix-like terminal environment.
- Can be integrated into shell scripts for automated processing.

## Version History
- v1.0.0: Comprehensive guide for Fabric CLI patterns.

## References
- https://github.com/danielmiessler/fabric
- Fabric Pattern Directory
