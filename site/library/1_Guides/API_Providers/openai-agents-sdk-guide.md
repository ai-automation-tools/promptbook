---
title: "🤖 OpenAI Agents SDK Guide (Python)"
tags: ["openai", "agents-sdk", "python", "handoffs", "guardrails", "tracing", "sessions"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: openai/openai-agents-python
---

<!-- Last Updated: 2026-11-18 - Checked against openai.github.io/openai-agents-python -->

# OpenAI Agents SDK Guide (Python)

The OpenAI Agents SDK is a small Python framework for agents: an LLM with instructions and
tools, optional handoffs to other agents, guardrails on input and output, sessions for memory,
and tracing on by default. This guide takes you from install to a routed, traced app.

## Install and first run

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install openai-agents        # or `uv add openai-agents`
export OPENAI_API_KEY=sk-...     # PowerShell: $env:OPENAI_API_KEY = "sk-..."
```

```python
from agents import Agent, Runner

agent = Agent(name="Assistant", instructions="You are a helpful assistant")

result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
print(result.final_output)
```

Async form: `result = await Runner.run(agent, "...")`.

## Core pieces

| Piece | What it is |
|:---|:---|
| `Agent` | Name, `instructions`, and optionally `tools`, `handoffs`, guardrails |
| `Runner` | Runs the loop: `Runner.run` (async), `Runner.run_sync`, `Runner.run_streamed` |
| Tools | Hosted tools, function tools, MCP, agents as tools |
| Handoffs | Delegation to another agent |
| Guardrails | Validation of input, output and tool calls |
| Sessions | Conversation memory across runs |
| Tracing | Built-in run traces |

## Tools

The tools page names five categories: hosted OpenAI tools, local/runtime execution tools,
`FunctionTool` instances wrapping Python functions, agents as tools, and an experimental Codex
tool. Hosted tool classes include `WebSearchTool`, `FileSearchTool`, `CodeInterpreterTool`,
`HostedMCPTool` and `ImageGenerationTool`.

A function tool, from the quickstart:

```python
from agents import Agent, Runner
from agents.decorators import tool

@tool
def history_fun_fact() -> str:
    """Return a short history fact."""
    return "Sharks are older than trees."

agent = Agent(
    name="History Tutor",
    instructions="Answer history questions clearly. Use history_fun_fact when it helps.",
    tools=[history_fun_fact],
)
```

MCP servers live in `agents.mcp`: `MCPServerStreamableHttp`, `MCPServerStdio` and
`MCPServerSse` (the docs mark SSE deprecated). `MCPServerManager` manages several.

## Handoffs

```python
from agents import Agent

history_tutor_agent = Agent(
    name="History Tutor",
    handoff_description="Specialist agent for historical questions",
    instructions="You answer history questions clearly and concisely.",
)
math_tutor_agent = Agent(
    name="Math Tutor",
    handoff_description="Specialist agent for math questions",
    instructions="You explain math step by step and include worked examples.",
)

triage_agent = Agent(
    name="Triage Agent",
    instructions="Route each homework question to the right specialist.",
    handoffs=[history_tutor_agent, math_tutor_agent],
)
```

Run `Runner.run(triage_agent, ...)` and read `result.last_agent.name` to see who answered.
A handoff appears to the model as a tool named `transfer_to_<agent_name>`. Wrap an agent in
`handoff()` to customise it: `tool_name_override`, `tool_description_override`, `on_handoff`,
`input_type`, `input_filter`, `is_enabled`, `nest_handoff_history`.

## Guardrails

| Kind | Runs on | Decorator |
|:---|:---|:---|
| Input | The first agent's initial input | `input_guardrail` |
| Output | The final agent's output | `output_guardrail` |
| Tool input / output | Guarded function-tool calls | `tool_input_guardrail`, `tool_output_guardrail` |

A guardrail returns a `GuardrailFunctionOutput`; when `tripwire_triggered` is true the run
raises `InputGuardrailTripwireTriggered`, `OutputGuardrailTripwireTriggered`,
`ToolInputGuardrailTripwireTriggered` or `ToolOutputGuardrailTripwireTriggered`. Attach with
`Agent(..., input_guardrails=[my_guardrail])`. The docs' own example runs a small second agent
inside the guardrail to classify the input.

## Sessions

```python
from agents import Agent, Runner, SQLiteSession

session = SQLiteSession("conversation_123")
result = await Runner.run(agent, "What state is it in?", session=session)
```

`SQLiteSession("user_123", "conversations.db")` persists to a file. Other backends named in the
docs: `AsyncSQLiteSession`, `RedisSession`, `SQLAlchemySession`, `MongoDBSession`, `DaprSession`,
`OpenAIConversationsSession`, plus wrappers `EncryptedSession` and
`OpenAIResponsesCompactionSession`.

## Tracing

Tracing is on by default; each run is wrapped in a trace named `Agent workflow`.

| To do this | Use |
|:---|:---|
| Disable everywhere | `OPENAI_AGENTS_DISABLE_TRACING=1` or `set_tracing_disabled(True)` |
| Disable one run | `RunConfig(tracing_disabled=True)` |
| Group runs | `trace()` context manager |
| Custom span | `custom_span()` |
| Send elsewhere | `add_trace_processor()`, `set_trace_processors()` |
| Keep sensitive data out | `RunConfig.trace_include_sensitive_data` |

The docs list many external processors (Langfuse, MLflow, Braintrust, Datadog and others).

## Tips

- Give each specialist a `handoff_description`; the triage agent routes on it.
- Check the docs' import path for decorators (`agents.decorators`) against your installed
  version; the SDK releases often (v0.25.0 on 2026-11-18).

**Sources**

- Overview: https://openai.github.io/openai-agents-python/
- Quickstart: https://openai.github.io/openai-agents-python/quickstart/
- Tools: https://openai.github.io/openai-agents-python/tools/
- Handoffs: https://openai.github.io/openai-agents-python/handoffs/
- Guardrails: https://openai.github.io/openai-agents-python/guardrails/
- Sessions: https://openai.github.io/openai-agents-python/sessions/
- Tracing: https://openai.github.io/openai-agents-python/tracing/
- MCP: https://openai.github.io/openai-agents-python/mcp/
- Release v0.25.0: https://github.com/openai/openai-agents-python/releases/tag/v0.25.0
