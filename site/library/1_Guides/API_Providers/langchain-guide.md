---
title: "🦜 LangChain Guide: Agents with create_agent in Python"
tags: ["langchain", "agents", "python", "create-agent", "tools", "middleware"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: langchain-ai/langchain
---

<!-- Last Updated: 2026-11-18 - Checked against docs.langchain.com/oss/python/langchain -->

# LangChain Guide: Agents with create_agent in Python

LangChain describes itself as a framework for building agents and LLM-powered applications, with
a standard interface for models, tools, embeddings and vector stores. Its current agent entry
point is `create_agent`, which builds an agent that calls a model and tools in a loop. For
explicit graphs, persistence internals and interrupts, see the separate LangGraph guide; this one
covers LangChain itself.

## Install

```bash
pip install -U langchain
# or
uv add langchain
```

The install page states Python 3.10 or later. Model integrations ship as separate packages, so
add the one for your provider:

| Provider | Package |
|:---|:---|
| OpenAI | `langchain-openai` |
| Anthropic | `langchain-anthropic` |

Other providers are listed in the Integrations section of the docs. The quickstart reads the
provider key from your shell or a `.env` file (for example `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
`GOOGLE_API_KEY`, `OPENROUTER_API_KEY`). Never commit keys.

## Model strings

Models are named `provider:model-name`. Take the exact model name from the provider's own docs
or the LangChain Models page, since names change.

```python
from langchain.chat_models import init_chat_model

model = init_chat_model("openai:gpt-5.5")   # example string from the repo README
result = model.invoke("Hello, world!")
```

The quickstart also notes that Anthropic models can be given as a bare name.

## A first agent

```python
from langchain.agents import create_agent


def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"


agent = create_agent(
    model="<provider>:<model-name>",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)
print(result["messages"][-1].content_blocks)
```

Write a clear docstring and type hints on each tool function; the model sees them as the tool's
description and arguments.

## create_agent parameters

| Parameter | What it takes |
|:---|:---|
| `model` | A `"provider:model"` string or an initialized model instance |
| `tools` | Python callables, LangChain tools (`@tool`) or tool dicts |
| `system_prompt` | A string or a `SystemMessage`; use middleware for prompts that change at run time |
| `response_format` | A schema (for example a Pydantic class); the validated result lands in `result["structured_response"]` |
| `middleware` | A list of middleware: retries, PII detection, human approval |
| `checkpointer` | Required to keep history across turns by `thread_id` |
| `context_schema` | Per-run data that tools and middleware read through `runtime.context` |
| `state_schema` | Adds custom fields to `AgentState` |
| `name` | Names the agent, useful when embedded as a subgraph |

## Structured output

```python
from pydantic import BaseModel
from langchain.agents import create_agent


class Answer(BaseModel):
    summary: str
    confidence: float


agent = create_agent(model="<provider>:<model-name>", tools=tools, response_format=Answer)
# result["structured_response"] is an Answer
```

## Middleware

The agents page lists these built-ins in one example:

```python
agent = create_agent(
    model="<provider>:<model-name>",
    tools=[search],
    middleware=[
        ModelRetryMiddleware(max_retries=3),
        ToolRetryMiddleware(max_retries=2),
        PIIMiddleware("email"),
        HumanInTheLoopMiddleware(interrupt_on={"write_file": True}),
    ],
)
```

Import paths for the middleware classes are on the Middleware pages of the docs; check them
before use.

## Memory across turns

```python
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(model="<provider>:<model-name>", tools=[], checkpointer=InMemorySaver())
```

Pass the same `thread_id` in the run config to continue a conversation. `InMemorySaver` is not
durable; the LangGraph docs cover production checkpointers.

## Streaming

`agent.stream_events(...)` surfaces intermediate messages and tool calls as they happen. The
agents page shows it with `version="v3"` and iterates `stream.values`, reading
`snapshot["messages"][-1]`.

## When to use something else

| Need | Use |
|:---|:---|
| Explicit graph control, custom routing | LangGraph |
| Planning, subagents, file system use out of the box | Deep Agents (built on LangChain) |
| Tracing, evals, deployment | LangSmith |

## Sources

- https://github.com/langchain-ai/langchain
- https://docs.langchain.com/oss/python/langchain/quickstart
- https://docs.langchain.com/oss/python/langchain/install
- https://docs.langchain.com/oss/python/langchain/agents
