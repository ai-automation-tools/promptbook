---
title: "🤗 smolagents Guide: Code Agents and Tools"
tags: ["smolagents", "huggingface", "agents", "code-agent", "tools", "python"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: huggingface/smolagents
---

<!-- Last Updated: 2026-11-18 - Checked against huggingface.co/docs/smolagents -->

# smolagents Guide: Code Agents and Tools

`smolagents` is Hugging Face's small agent library. Its `CodeAgent` writes its actions as Python
code rather than JSON. It works with any LLM and can take tools from MCP servers, LangChain or a
Hub Space.

## Install and first run

```bash
pip install "smolagents[toolkit]"
```

```python
from smolagents import CodeAgent, WebSearchTool, InferenceClientModel

model = InferenceClientModel()
agent = CodeAgent(tools=[WebSearchTool()], model=model, stream_outputs=True)

agent.run("How many seconds would it take for a leopard at full speed to run through Pont des Arts?")
```

An agent needs two arguments at minimum: `model` and `tools` (the list can be empty).
`add_base_tools=True` adds the default toolbox (from the `toolkit` extra: DuckDuckGo web search,
a Python interpreter for `ToolCallingAgent`, and a Whisper-based transcriber).

## CodeAgent or ToolCallingAgent

| | `CodeAgent` | `ToolCallingAgent` |
|:---|:---|:---|
| Action format | Python snippets calling tools as functions | Structured JSON tool calls |
| Strength | Expressive: loops, chaining, transforming results | Validated arguments, no code execution |
| Weakness | Needs a safe execution environment | Cannot compose results dynamically |
| Pick it for | Problem solving, composing tools | Simple atomic tools, dispatcher roles |

```python
from smolagents import ToolCallingAgent, WebSearchTool
agent = ToolCallingAgent(tools=[WebSearchTool()], model=model)
```

## Pick a model class

| Class | Install extra / note |
|:---|:---|
| `InferenceClientModel` | Hub Inference Providers; set `HF_TOKEN` or pass `token=`; optional `provider=` |
| `LiteLLMModel` | `smolagents[litellm]`; 100+ providers, e.g. `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` |
| `OpenAIModel` | Any OpenAI-compatible server via `api_base=` and `api_key=` |
| `AzureOpenAIModel` | `smolagents[openai]`; `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `OPENAI_API_VERSION` |
| `AmazonBedrockModel` | `smolagents[bedrock]` |
| `TransformersModel` | `smolagents[transformers]`; local model |
| `MLXModel` | `smolagents[mlx-lm]` |

```python
from smolagents import OpenAIModel
import os

model = OpenAIModel(
    model_id="openai/gpt-4o",
    api_base="https://openrouter.ai/api/v1",   # leave blank for OpenAI itself
    api_key=os.environ["OPENROUTER_API_KEY"],
)
```

Extra keyword arguments such as `temperature` and `max_tokens` are forwarded to the underlying
completion call.

## Code execution safety

`CodeAgent` runs generated code locally by default, limited to your tools, a set of safe functions
and a safe import list. Widen imports deliberately:

```python
agent = CodeAgent(tools=[], model=model, additional_authorized_imports=['requests', 'bs4'])
```

Submodules are blocked unless listed: `'numpy.random'` or `'numpy.*'`. The docs warn the LLM can
generate arbitrary code, so do not add unsafe imports. For real isolation pass `executor_type`:

| `executor_type` | Setup |
|:---|:---|
| `"docker"` | Docker available locally |
| `"e2b"` | Set `E2B_API_KEY` |
| `"blaxel"` | Set `BL_API_KEY` and `BL_WORKSPACE` |

## Write a tool

```python
from smolagents import tool

@tool
def model_download_tool(task: str) -> str:
    """
    Returns the most downloaded model of a given task on the Hugging Face Hub.

    Args:
        task: The task for which to get the download count.
    """
    ...
```

The function needs a descriptive name, type hints on inputs and output, and a docstring with an
`Args:` section. All of it is baked into the agent's system prompt. For heavy initialisation,
subclass `Tool` instead and set `name`, `description`, `inputs`, `output_type` and a `forward`
method.

## Multi-agent and control

```python
web_agent = CodeAgent(tools=[WebSearchTool()], model=model,
                      name="web_search_agent",
                      description="Runs web searches for you. Give it your query as an argument.")
manager_agent = CodeAgent(tools=[], model=model, managed_agents=[web_agent])
```

| Need | Use |
|:---|:---|
| Validate the final answer | `final_answer_checks=[fn]`, each returning True/False; a False continues the run |
| Keep conversation memory | `agent.run(task, reset=False)` |
| Stop a running agent | `agent.interrupt()` (stops after the current step) |
| Inspect a run | `agent.logs`, `agent.write_memory_to_messages()` |
| Chat UI | `GradioUI(agent).launch()` |
| Share / load | `agent.push_to_hub("user/name")`, `agent.from_hub("user/name", trust_remote_code=True)` |

## CLI

```bash
smolagent "Plan a trip to Tokyo, Kyoto and Osaka." --model-type "InferenceClientModel" --model-id "Qwen/Qwen2.5-Coder-32B-Instruct" --imports "pandas numpy" --tools "web_search"
smolagent        # no prompt: interactive mode
```

## Sources

- https://huggingface.co/docs/smolagents/guided_tour
- https://github.com/huggingface/smolagents (README)
