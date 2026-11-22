---
title: "🧵 Fabric CLI Guide"
tags: ["agent-guides", "fabric", "cli", "prompt-framework"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: danielmiessler/Fabric
checked: 2026-11-21
---

# Fabric CLI Guide

## Overview
Fabric is an open-source framework for augmenting humans using AI. It provides a modular approach to using AI through small, single-purpose markdown prompts (patterns). The Fabric CLI allows you to pipe output from any command-line tool directly into these specialized patterns, creating powerful data processing pipelines.

## Agent Configuration

### Basic Settings
- **Agent Name:** Fabric CLI
- **Model:** Any model from a vendor you configured (`fabric --setup`; list with `fabric --listmodels`, change the default with `fabric -d`)
- **Temperature:** `-t`, default 0.7 (lower for extraction patterns)
- **Context Window:** Model dependent (128k+ recommended for large inputs)

### Tools & Permissions
- Tool 1: File system access (Read/Write for inputs and outputs)
- Tool 2: Network access (for API calls to configured LLM providers)
- Tool 3: YouTube transcripts (built in: `-y <url>`, optionally with `--transcript` or `--transcript-with-timestamps`)

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
`fabric -y "https://www.youtube.com/watch?v=example" --pattern extract_wisdom`

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
- **Set Default Models**: Run `fabric --setup` to pick vendors and a default model, or set per-pattern models through environment variables (see the README).
- **Keep Patterns Updated**: `fabric --updatepatterns` pulls the latest from the repository.

## Customization Options

- **Custom Patterns**: Each pattern is a folder holding a `system.md`, e.g. `~/.config/fabric/patterns/my-analyzer/system.md`. To keep them safe from updates, set a custom patterns directory under `fabric --setup` > Custom Patterns; those take precedence over built-ins of the same name.
- **Context Files**: `-C <name>` applies a saved context (`fabric --listcontexts` lists them). `-c` only copies the output to the clipboard.
- **Shell aliases**: the README shows loops that turn every pattern into a command (`summarize` instead of `fabric --pattern summarize`).

## Troubleshooting

- **API Key Errors**: Re-run `fabric --setup`; keys live in `~/.config/fabric/.env`.
- **Empty Output**: Check if your input command actually generated output before piping it to Fabric. Also check the input fits the model's context limit.
- **Pattern Not Found**: Run `fabric --updatepatterns`, then `fabric --listpatterns`.

## Integration

Fabric integrates with standard Unix utilities (`cat`, `curl`, `jq`, `grep`) and shell scripts; `-y` fetches YouTube transcripts itself, and `-u` scrapes a URL to markdown via Jina AI.

## Version History

- Checked 2026-11-21 against the README (flags: `-p`, `-y`, `-C`, `-l`, `-U`, `-S`).

## References

- [Fabric GitHub Repository](https://github.com/danielmiessler/fabric)
- [Fabric Patterns Directory](https://github.com/danielmiessler/fabric/tree/main/patterns)
