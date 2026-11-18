---
title: "🐍 MCP Python SDK Guide: Build a Server and Client"
tags: ["mcp", "python", "sdk", "mcp-server", "mcp-client", "model-context-protocol"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: modelcontextprotocol/python-sdk
---

<!-- Last Updated: 2026-11-18 - Checked against py.sdk.modelcontextprotocol.io -->

# MCP Python SDK Guide: Build a Server and Client

The official Python SDK for the Model Context Protocol (package `mcp`) lets you build servers
that expose tools, resources and prompts, and clients that connect to any MCP server. It speaks
stdio, Streamable HTTP and SSE. The docs describe the current line as v2 (`pip install mcp`
installs 2.x).

## Install

Requires Python 3.11+.

```bash
uv add "mcp[cli]"      # or: pip install "mcp[cli]"
```

The `cli` extra adds the `mcp` command (`mcp dev`, `mcp run`, `mcp install`). Plain `mcp` is
enough if you do not need it.

## A server

```python
# server.py
from mcp.server import MCPServer

mcp = MCPServer("Demo")


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


@mcp.resource("greeting://{name}")
def greeting(name: str) -> str:
    """Greet someone by name."""
    return f"Hello, {name}!"
```

Type hints are the schema: no hand-written JSON Schema, request parsing or validation. The
docstring becomes the description.

| Decorator | Exposes |
|:---|:---|
| `@mcp.tool()` | A function the model can call |
| `@mcp.resource("uri://{param}")` | Readable data, fixed or templated by URI |

Prompts are also supported; the Servers section of the docs covers them.

## Run and inspect

| Goal | Command |
|:---|:---|
| Try it in the MCP Inspector | `uv run mcp dev server.py` |
| Serve over Streamable HTTP | `uv run mcp run server.py --transport streamable-http` |

Over HTTP the client URL in the README is `http://localhost:8000/mcp`.

## A client

```python
import asyncio

from mcp import Client


async def main() -> None:
    async with Client("http://localhost:8000/mcp") as client:
        result = await client.call_tool("add", {"a": 1, "b": 2})
        print(result.structured_content)  # {'result': 3}


asyncio.run(main())
```

One `Client` object handles connect, protocol negotiation and disconnect through `async with`.
It cannot be reused after the block ends.

| Pass this to `Client(...)` | Transport |
|:---|:---|
| A URL string | Streamable HTTP |
| `StdioServerParameters(...)` | Local subprocess over stdio |
| The server object | In-memory, for tests |

### Stdio subprocess

```python
from mcp import Client, StdioServerParameters

server = StdioServerParameters(
    command="uv",
    args=["run", "server.py"],
    env={"MY_API_KEY": "..."},
)

async def main() -> None:
    async with Client(server) as client:
        result = await client.list_tools()
        print([tool.name for tool in result.tools])
```

The child does not inherit your whole environment, only a minimal allow-list plus what you put
in `env`, so pass API keys there.

## Client calls

| Call | Returns |
|:---|:---|
| `list_tools()` | `.tools`, each with `name`, `title`, `description`, `input_schema` |
| `call_tool(name, args)` | `content` blocks, `structured_content`, `is_error` |
| `list_resources()` / `list_resource_templates()` | Fixed URIs / parameterised templates |
| `read_resource(uri)` | `.contents` (`TextResourceContents` or `BlobResourceContents`) |
| `list_prompts()` / `get_prompt(name, args)` | Prompt definitions / rendered `messages` (argument values are strings) |

A tool that raises does not raise in the client: the call returns `is_error=True` with the
message in `content`. Check `is_error` before trusting `structured_content`. `MCPError` is
raised only when the server returns a JSON-RPC error.

## Test without a subprocess

```python
import pytest
from mcp import Client
from server import mcp


@pytest.mark.anyio
async def test_add() -> None:
    async with Client(mcp) as client:
        result = await client.call_tool("add", {"a": 1, "b": 2})
        assert result.structured_content == {"result": 3}
```

## Coming from v1

| v1 | v2 |
|:---|:---|
| `from mcp.server.fastmcp import FastMCP` | `from mcp.server import MCPServer` |
| `ctx.fastmcp` | `ctx.mcp_server` |
| `FastMCPError` | `MCPServerError` |
| `McpError` | `MCPError` |
| Transport + `ClientSession` + manual `initialize()` | One `Client` (session still at `client.session`) |
| WebSocket transport | Removed |

See the migration guide in the docs for the full list.

## Sources

- https://github.com/modelcontextprotocol/python-sdk
- https://py.sdk.modelcontextprotocol.io/get-started/
- https://py.sdk.modelcontextprotocol.io/client/
- https://py.sdk.modelcontextprotocol.io/client/transports/
- https://py.sdk.modelcontextprotocol.io/whats-new/
