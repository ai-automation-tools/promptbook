---
title: "🧬 Pydantic AI Guide: Typed Agents, Tools and Dependencies"
tags: ["pydantic-ai", "agents", "python", "structured-output", "tools", "dependency-injection"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: pydantic/pydantic-ai
---

<!-- Last Updated: 2026-11-18 - Checked against pydantic.dev/docs/ai -->

# Pydantic AI Guide: Typed Agents, Tools and Dependencies

Pydantic AI is a Python agent framework from the Pydantic team. An `Agent` takes a model, optional
dependencies, tools and an output type, and validates everything with Pydantic.

## Install

```bash
pip install pydantic-ai
# or
uv add pydantic-ai
```

The overview page states no minimum Python version; check the repo's `pyproject.toml`.

## Smallest agent

```python
from pydantic_ai import Agent

agent = Agent('test')          # 'test' runs offline, no API key
result = agent.run_sync('Hello')
print(result.output)
```

A real model is chosen with a `'provider:model-name'` string (see the models docs for the current
list). `run_sync` is the blocking call; `await agent.run(...)` is the async one.

## The four moving parts

| Part | Where it goes | Purpose |
|:---|:---|:---|
| Model | first `Agent(...)` argument | Which LLM answers |
| `deps_type` | `Agent(deps_type=...)` | Type of the dependencies object your tools receive |
| `output_type` | `Agent(output_type=...)` | What `result.output` must be |
| Tools | `@agent.tool`, `@agent.tool_plain`, or `tools=[...]` | Functions the model may call |

## Dependencies

You pass the dependency type (not an instance) to the constructor so type checkers can verify your
code; it is not used at runtime. Pass the instance as `deps=` when you run.

```python
from dataclasses import dataclass
from pydantic_ai import Agent, RunContext


@dataclass
class MyDeps:
    api_key: str


agent = Agent('test', deps_type=MyDeps)


@agent.instructions
async def get_instructions(ctx: RunContext[MyDeps]) -> str:
    return f'Prompt: {ctx.deps.api_key}'


result = agent.run_sync('Hi', deps=MyDeps('secret'))
```

- `ctx: RunContext[MyDeps]` is the first parameter of an instructions function, tool or output
  validator; read your data from `ctx.deps`.
- Sync (`def`) functions run in a thread pool; async functions are preferred when you do I/O. This
  is independent of `run` versus `run_sync`.
- In tests, wrap calls in `with agent.override(deps=test_deps):`.

## Tools

```python
import random
from pydantic_ai import Agent, RunContext

agent = Agent('test', deps_type=str)


@agent.tool
def get_player_name(ctx: RunContext[str]) -> str:
    """Get the player's name."""
    return ctx.deps


@agent.tool_plain
def roll_dice() -> str:
    """Roll a six-sided die and return the result."""
    return str(random.randint(1, 6))
```

| Form | Use when |
|:---|:---|
| `@agent.tool` | The tool needs `RunContext` |
| `@agent.tool_plain` | It does not |
| `Agent(tools=[fn, ...])` | Register plain functions at construction |
| `Tool(fn, takes_ctx=True/False)` | You want explicit control over settings |

Every parameter except `RunContext` goes into the tool's JSON schema. The docstring is parsed (Google,
NumPy and Sphinx styles) and its description, parameter descriptions, first returns entry and
admonitions such as `Warning:` reach the model. `require_parameter_descriptions=True` raises a
`UserError` if a parameter has no description.

## Structured output

```python
from pydantic import BaseModel
from pydantic_ai import Agent


class CityLocation(BaseModel):
    city: str
    country: str


agent = Agent('test', output_type=CityLocation)
result = agent.run_sync('Where were the olympics held in 2012?')
print(result.output)   # a CityLocation instance
```

The model's schema is sent to the LLM as a tool and the reply is validated with Pydantic.

| Need | How |
|:---|:---|
| Structured data or plain text | `output_type=[Box, str]` (a list; a `Box` or `str` union also works); each member becomes an output tool |
| Extra validation after parsing | `@agent.output_validator`; raise `ModelRetry('reason')` to ask the model again |
| More retries | `Agent(retries={'output': N})`; the default is 1 |
| Streaming | `agent.run_stream()`, then `stream_output()` or `stream_text(delta=True)` |

While streaming, validators run on every partial output; check `ctx.partial_output` to do side
effects only on the final result. `ToolFailed` is not supported in output functions or validators.

## Typical pattern

1. Define a `@dataclass` for dependencies (DB handle, HTTP client, user id).
2. Define a `BaseModel` for the answer you want back.
3. Create `Agent(model, deps_type=..., output_type=...)`.
4. Add `@agent.tool` functions that read `ctx.deps`.
5. Run with `deps=...`; read `result.output`.

## Sources

- https://pydantic.dev/docs/ai/overview/
- https://pydantic.dev/docs/ai/core-concepts/tools/
- https://pydantic.dev/docs/ai/core-concepts/dependencies/
- https://pydantic.dev/docs/ai/core-concepts/output/
