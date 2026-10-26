---
title: "🧵 Fabric CLI Guide"
tags: ["agent-guides", "fabric", "cli", "prompt-framework"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: danielmiessler/fabric
---

# Fabric CLI Guide

## Overview
Fabric is an open-source framework for augmenting humans using AI. It provides a modular approach to using AI through small, single-purpose markdown prompts (patterns). The Fabric CLI allows you to pipe output from any command-line tool directly into these specialized patterns, creating powerful data processing pipelines.

## Agent Configuration

### Basic Settings
- **Agent Name:** Fabric CLI
- **Model:** Anthropic Claude Sonnet 5 (recommended) or OpenAI GPT-4o
- **Temperature:** 0.0 - 0.7 (depending on the pattern)
- **Context Window:** Model dependent (128k+ recommended for large inputs)

### Tools & Permissions
- Tool 1: File system access (Read/Write for inputs and outputs)
- Tool 2: Network access (for API calls to configured LLM providers)
- Tool 3: YouTube transcript tool (built-in integration)

## System Prompt

```xml
<system_info>
Fabric CLI operates as a specialized pattern executor. Its identity is defined by the specific pattern being invoked by the user. It acts strictly according to the pattern's instructions, taking standard input and formatting the output exactly as specified by the pattern without adding conversational filler or meta-commentary.
</system_info>
```

## Workflow

1. **Input Generation**: Data is generated via commands, file reads, or web scraping.
2. **Pattern Selection**: A specific Fabric pattern is chosen based on the desired transformation.
3. **Piping & Execution**: Input is piped into the Fabric CLI along with the selected pattern.
4. **Output Handling**: The transformed output is displayed, saved, or piped into another command.

## Example Interactions

### Example 1: Summarizing a YouTube Video
**Command:**
`yt --transcript https://www.youtube.com/watch?v=example | fabric --pattern extract_wisdom`

**Output:**
```markdown
# WISDOM SUMMARY
... (structured insights extracted from the video)
```

### Example 2: Analyzing Code
**Command:**
`cat src/main.js | fabric --pattern analyze_code`

**Output:**
```markdown
# CODE ANALYSIS
... (code quality, bugs, and improvement suggestions)
```

## Best Practices

- **Chain Commands**: Leverage Unix piping to chain tools before and after Fabric. Example: `curl -s URL | fabric -p extract_article | fabric -p summarize`.
- **Use the Right Pattern**: Take time to explore `fabric --list` to find the exact pattern for your task instead of writing custom prompts every time.
- **Set Default Models**: Configure your preferred models for different tasks using the `~/.config/fabric/.env` file.

## Customization Options

- **Custom Patterns**: You can create your own patterns by adding markdown files to `~/.config/fabric/patterns/`.
- **Context Files**: Use the `-c` flag to include additional context files along with your prompt.

## Troubleshooting

- **API Key Errors**: Ensure your API keys are correctly set in `~/.config/fabric/.env`.
- **Empty Output**: Check if your input command actually generated output before piping it to Fabric.
- **Pattern Not Found**: Run `fabric --update` to pull the latest official patterns.

## Integration

Fabric integrates seamlessly with standard Unix utilities (`cat`, `curl`, `jq`, `grep`) and specialized tools like the `yt` (YouTube transcript fetcher) companion tool.

## Version History

- **v1.0.0**: Initial public release with core patterns.
- **v1.2.0**: Added Claude 3 support and more coding patterns.

## References

- [Fabric GitHub Repository](https://github.com/danielmiessler/fabric)
- [Fabric Patterns Directory](https://github.com/danielmiessler/fabric/tree/main/patterns)
