---
title: "🟦 MCP TypeScript SDK Guide: Build a Server and Client"
tags: ["mcp", "typescript", "sdk", "mcp-server", "mcp-client", "model-context-protocol"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: modelcontextprotocol/typescript-sdk
---

<!-- Last Updated: 2026-11-18 - Checked against github.com/modelcontextprotocol/typescript-sdk -->

# MCP TypeScript SDK Guide: Build a Server and Client

The repo's `main` branch is **v2** of the SDK, the stable release line, implementing the
2026-07-28 MCP spec. v2 is split into two packages. The older v1.x line
(`@modelcontextprotocol/sdk`) lives on the `v1.x` branch and gets bug and security fixes for at
least six months after the v2 release (2026-07-27). It runs on Node.js, Bun and Deno.

## Packages

| Package | Purpose |
|:---|:---|
| `@modelcontextprotocol/server` | Build MCP servers |
| `@modelcontextprotocol/client` | Build MCP clients |
| `@modelcontextprotocol/node` | Optional: Node.js Streamable HTTP wrapper (`IncomingMessage` / `ServerResponse`) |
| `@modelcontextprotocol/express` | Optional: Express helpers (defaults, Host header validation) |
| `@modelcontextprotocol/fastify` | Optional: Fastify helpers |
| `@modelcontextprotocol/hono` | Optional: Hono helpers |

Tool and prompt schemas use Standard Schema, so Zod v4, Valibot, ArkType or any compatible
library works.

```bash
npm install @modelcontextprotocol/server
npm install @modelcontextprotocol/client
# or: bun add ... / deno add npm:...
```

Coming from v1, use the migration guide (`upgrade-to-v2`) on the docs site.

## Project setup

The first-server tutorial needs Node.js 20 or later and ES modules:

```bash
mkdir weather && cd weather
npm init -y
npm pkg set type=module
npm install @modelcontextprotocol/server zod tsx
mkdir src
```

`tsx` runs TypeScript directly, so there is no build step.

## A server

```ts
// src/index.ts
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

function createServer(): McpServer {
    const server = new McpServer({ name: 'greeting-server', version: '1.0.0' });

    server.registerTool(
        'greet',
        {
            description: 'Greet someone by name',
            inputSchema: z.object({ name: z.string().describe('Who to greet') })
        },
        async ({ name }) => ({
            content: [{ type: 'text', text: `Hello, ${name}!` }]
        })
    );

    return server;
}

void serveStdio(createServer);
console.error('greeting MCP server running on stdio');
```

The Zod schema is the only schema you write: the SDK derives the JSON Schema for the model,
validates arguments before your handler runs, and infers its types.

Rules worth keeping:

- Log with `console.error`. Stdout carries the protocol.
- On failure return `{ content: [...], isError: true }` rather than throwing blindly.
- The README's own minimal example connects manually instead:
  `await server.connect(new StdioServerTransport())`, with `StdioServerTransport` imported from
  `@modelcontextprotocol/server/stdio`.

## Run and inspect

```bash
npx tsx src/index.ts                                   # waits on stdin
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

In the Inspector: Connect, open Tools, pick the tool, enter arguments, run.

## A client

```ts
// src/client.ts
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const client = new Client({ name: 'my-first-client', version: '1.0.0' });

const transport = new StdioClientTransport({
    command: 'npx',
    args: ['tsx', 'src/index.ts']
});

await client.connect(transport);

const { tools } = await client.listTools();
for (const tool of tools) {
    console.log(tool.name, '-', tool.description);
}

const result = await client.callTool({ name: 'greet', arguments: { name: 'Ada' } });
for (const block of result.content) {
    if (block.type === 'text') console.log(block.text);
}

await client.close();
```

Run it with `npx tsx src/client.ts`. `connect()` spawns the server over stdio and completes the
initialize handshake, so do not start the server separately. Without `client.close()` the
script keeps running because the server process stays alive.

## What else the docs cover

| Topic | Where |
|:---|:---|
| Resources and prompts, Streamable HTTP, OAuth | Documentation site (v2) |
| Runnable client/server pairs | `examples/` in the repo |
| Common errors | `docs/troubleshooting.md` in the repo |
| Framework wiring | The middleware packages above |

## Sources

- https://github.com/modelcontextprotocol/typescript-sdk
- https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/docs/get-started/first-server.md
- https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/docs/get-started/first-client.md
- https://ts.sdk.modelcontextprotocol.io/v2/
