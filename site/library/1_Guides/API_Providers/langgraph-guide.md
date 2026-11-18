---
title: "🕸️ LangGraph Guide: Stateful Agent Graphs in Python"
tags: ["langgraph", "langchain", "agents", "python", "checkpointer", "human-in-the-loop"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: langchain-ai/langgraph
---

<!-- Last Updated: 2026-11-18 - Checked against docs.langchain.com/oss/python/langgraph -->

# LangGraph Guide: Stateful Agent Graphs in Python

LangGraph is described in its docs as a "low-level orchestration framework and runtime for
long-running, stateful agents". You define a workflow as a graph of shared state, nodes and
edges, and the runtime can save state, pause for a human and resume. It does not prescribe
prompts or an agent architecture, and it works without LangChain (the examples just use
LangChain for model and tool integrations).

## Install

```bash
pip install -U langgraph
# the quickstart also installs LangChain and a model package:
pip install -U langgraph langchain langchain-anthropic
```

`uv add langgraph` works too. The quickstart expects `ANTHROPIC_API_KEY` in your shell or a
`.env` file. The install page states no Python version requirement.

## The four pieces

| Piece | What it is |
|:---|:---|
| State | A schema of channels (a `TypedDict`). Each key can carry a reducer that decides how updates merge |
| Node | A function that reads state and returns a partial update |
| Edge | `add_edge` always goes to the next node; `add_conditional_edges` calls a routing function |
| Compile | `graph.compile()` checks the structure and returns a runnable; you must compile before invoking |

## A minimal graph

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain.messages import AnyMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages


class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]


def node_a(state: State):
    return {"messages": [{"role": "assistant", "content": "hello"}]}


graph = (
    StateGraph(State)
    .add_node("node_a", node_a)
    .add_edge(START, "node_a")
    .add_edge("node_a", END)
    .compile()
)

result = graph.invoke({"messages": [{"role": "user", "content": "hi"}]})
```

`add_messages` as a reducer appends new messages and updates existing ones by ID.
`MessagesState` is a prebuilt state with just that `messages` key; subclass it to add fields:

```python
from langgraph.graph import MessagesState

class State(MessagesState):
    documents: list[str]
```

## Routing

The quickstart's tool-calling agent is built by hand: an `llm_call` node, a `tool_node`, and a
conditional edge that loops back until the model stops calling tools.

```python
agent_builder.add_edge(START, "llm_call")
agent_builder.add_conditional_edges("llm_call", should_continue, ["tool_node", END])
agent_builder.add_edge("tool_node", "llm_call")
agent = agent_builder.compile()
```

A node can also update state and route in one return with `Command`:

```python
from typing import Literal
from langgraph.types import Command

def my_node(state: State) -> Command[Literal["my_other_node"]]:
    return Command(update={"foo": "bar"}, goto="my_other_node")
```

Do not combine `Command` routing with `add_edge` from the same node: the static edge still runs.

## Prebuilt agent

The LangGraph pages you build graphs from do not show a prebuilt agent; they point to LangChain.
The LangChain agents page shows `create_agent`:

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def search(query: str) -> str:
    """Search for information."""
    return f"Results for: {query}"

agent = create_agent(model="anthropic:claude-sonnet-5", tools=[search])
```

That page does not mention `create_react_agent` or a migration from it, so check your installed
version before relying on either name. `ToolNode` is documented as a prebuilt node for running
tools inside your own graph.

## Persistence with a checkpointer

Pass a checkpointer at compile time and a `thread_id` at call time. Each thread keeps its own state.

```python
from langgraph.checkpoint.memory import InMemorySaver

graph = builder.compile(checkpointer=InMemorySaver())

config = {"configurable": {"thread_id": "thread-1"}}
graph.invoke({"messages": [{"role": "user", "content": "Hi, my name is Bob."}]}, config)

graph.get_state(config)                 # latest snapshot
list(graph.get_state_history(config))   # all snapshots, newest first
```

| Checkpointer | Use |
|:---|:---|
| `InMemorySaver` | RAM only, lost on restart. Development |
| `SqliteSaver` (`langgraph.checkpoint.sqlite`) | Local file storage |
| `PostgresSaver` (`langgraph.checkpoint.postgres`) | Recommended for production; call `.setup()` once to create tables |

```python
from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = PostgresSaver.from_conn_string("postgresql://...")
checkpointer.setup()
```

The SQLite and Postgres savers are separate installable packages; the docs name them but the
pages read here give no pip command, so look up the package names before installing. With
Postgres, keep `thread_id` under 255 characters. Add a `checkpoint_id` to the config to read a
specific checkpoint.

## Human-in-the-loop with interrupt

`interrupt()` pauses inside a node and returns a value to the caller. Resuming with
`Command(resume=...)` makes that value the return of the `interrupt()` call.

```python
from langgraph.types import interrupt, Command

def approval_node(state: State):
    approved = interrupt("Do you approve this action?")
    return {"approved": approved}

graph = builder.compile(checkpointer=checkpointer)
config = {"configurable": {"thread_id": "thread-1"}}

result = graph.invoke({"input": "data"}, config)   # paused; payload is in result["__interrupt__"]
graph.invoke(Command(resume=True), config)         # continue with the same thread_id
```

Rules from the docs:

- A checkpointer and a `thread_id` in `config["configurable"]` are required. A new ID starts an empty thread.
- The node restarts from its beginning on resume, so code before `interrupt()` must be safe to run twice.
- Do not wrap `interrupt()` in a bare `try/except`; the pause is an exception.
- Keep interrupt order deterministic inside a node (resume values match by index).
- The payload must be JSON-serializable; pass simple values, not functions or class instances.
- Use `Command(resume=...)` alone as the input to continue; not `update`, `goto` or `graph`.
- Several pending interrupts resume together with `Command(resume={i.id: value for ...})`.

## Sources

- https://docs.langchain.com/oss/python/langgraph/overview
- https://docs.langchain.com/oss/python/langgraph/install
- https://docs.langchain.com/oss/python/langgraph/quickstart
- https://docs.langchain.com/oss/python/langgraph/graph-api
- https://docs.langchain.com/oss/python/langgraph/persistence
- https://docs.langchain.com/oss/python/langgraph/checkpointers
- https://docs.langchain.com/oss/python/langgraph/interrupts
- https://docs.langchain.com/oss/python/langchain/agents
- https://github.com/langchain-ai/langgraph/releases
