---
title: "🟦 Claude Agent SDK for TypeScript Guide"
tags: ["claude", "agent-sdk", "typescript", "nodejs", "mcp", "hooks", "anthropic"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: anthropics/claude-agent-sdk-typescript
---

<!-- Last Updated: 2026-11-18 - Checked against code.claude.com/docs/en/agent-sdk/typescript and agent-sdk/quickstart -->

# Claude Agent SDK for TypeScript Guide

The TypeScript SDK runs Claude Code's agent loop from Node. `query()` returns an async generator of
messages while Claude reads files, runs tools and edits code. This guide is the TypeScript view:
install, the `query()` loop, the options you reach for first, in-process tools, hooks and result
handling. For the Python equivalent see the Python guide in this folder.

## Install

Requires Node.js 18.14+.

```bash
npm init -y
npm pkg set type=module
npm install @anthropic-ai/claude-agent-sdk
npm install --save-dev tsx
```

`"type": "module"` allows top-level `await`; `tsx` runs `.ts` files directly (use `agent.mts` in a
CommonJS project). The package bundles a native Claude Code binary through npm optional
dependencies, so `npm ci --omit=optional` leaves no binary; reinstall without it, or install Claude
Code natively and set `pathToClaudeCodeExecutable`.

Set `ANTHROPIC_API_KEY` in the environment of the process that runs the agent. The SDK does not
load `.env` files itself. Other providers are selected with `CLAUDE_CODE_USE_BEDROCK=1`,
`CLAUDE_CODE_USE_VERTEX=1` or `CLAUDE_CODE_USE_FOUNDRY=1` plus that cloud's credentials.

## The query loop

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"], // auto-approve these
    permissionMode: "acceptEdits"           // auto-approve file edits
  }
})) {
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) console.log(block.text);
      else if ("name" in block) console.log(`Tool: ${block.name}`);
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`);
  }
}
```

Run it with `npx tsx agent.ts`. The signature is
`query({ prompt, options? }): Query`, where `prompt` is a `string` or an
`AsyncIterable<SDKUserMessage>` (streaming input) and `Query` extends
`AsyncGenerator<SDKMessage, void>`.

## Options you will use first

| Option | Type | Notes |
|:---|:---|:---|
| `allowedTools` | `string[]` | Auto-approves these tools. It does not restrict Claude to them; use `disallowedTools` to block |
| `permissionMode` | `PermissionMode` | `"default"`, `"acceptEdits"`, `"bypassPermissions"`, `"plan"`, `"dontAsk"`, `"auto"` |
| `systemPrompt` | string, or `{ type: 'preset', preset: 'claude_code', append? }` | Default is a minimal prompt, not Claude Code's |
| `mcpServers` | `Record<string, McpServerConfig>` | External or in-process MCP servers |
| `hooks` | `Partial<Record<HookEvent, HookCallbackMatcher[]>>` | Callbacks per event |
| `agents` | `Record<string, AgentDefinition>` | Programmatic subagents |
| `cwd` | `string` | Defaults to `process.cwd()` |
| `model` | `string` | Alias or full model name |
| `maxTurns` | `number` | Caps agentic turns |
| `settingSources` | `("user" \| "project" \| "local")[]` | Default loads all; pass `[]` to load none |
| `canUseTool` | `CanUseTool` | Called only when the permission flow would otherwise prompt |

Passing `tools` limits the built-in tool set; listing tools in `allowedTools` only pre-approves them.

## A custom tool (in-process MCP)

```typescript
import { tool, createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const search = tool(
  "search",
  "Search the web",
  { query: z.string() },
  async ({ query }) => ({ content: [{ type: "text", text: `Results for: ${query}` }] }),
  { annotations: { readOnlyHint: true, openWorldHint: true } }
);

const server = createSdkMcpServer({ name: "my-tools", version: "1.0.0", tools: [search] });
```

`tool(name, description, inputSchema, handler, extras?)` takes a Zod raw shape. `createSdkMcpServer`
accepts `name`, `version`, `instructions`, `tools`, `alwaysLoad` and `timeout`. Pass the result under
`mcpServers` in `options`.

## Hooks

Hook callbacks are functions, not shell commands:

```typescript
type HookCallback = (
  input: HookInput,
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;

interface HookCallbackMatcher {
  matcher?: string;
  hooks: HookCallback[];
  timeout?: number;                      // seconds, for all hooks in this matcher
  onFailure?: "continue" | "block";
}
```

Register them as `options.hooks = { PostToolUse: [{ matcher: "Edit|Write", hooks: [myCallback] }] }`.
Event names include `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`,
`SessionStart`, `SessionEnd`, `Stop`, `SubagentStart`, `SubagentStop`, `PreCompact`, `PostCompact`,
`PermissionRequest`, `Notification` and others (the full `HookEvent` union is in the reference).

## Reading the result

The final message has `type: "result"`. On success `subtype` is `"success"` and `result` is a string.
On failure `subtype` is one of `"error_max_turns"`, `"error_during_execution"`,
`"error_max_budget_usd"` or `"error_max_structured_output_retries"`, with `errors: string[]` instead
of `result`. Both carry `session_id`, `num_turns`, `total_cost_usd`, `usage` and `permission_denials`.

## Sources

- https://code.claude.com/docs/en/agent-sdk/typescript
- https://code.claude.com/docs/en/agent-sdk/quickstart
- https://github.com/anthropics/claude-agent-sdk-typescript (README)
