---
title: "Prompt: Build an MCP Server from Scratch"
tags: ["prompt","ai-ml","claude-code"]
---

# Prompt: Build an MCP Server from Scratch

**Use when:** You want Claude Code to scaffold, implement, test, and document a complete MCP server that exposes tools to Claude and other MCP clients.

---

## Prompt — Full MCP Server Build (TypeScript)

```
Build a complete MCP server in TypeScript.

**Server name:** [e.g. my-api-server]
**What it exposes:** [Describe each tool — be specific about operations, not just "CRUD"]
**Target API / service:** [The service or data source this wraps]
**Auth method:** [API key via env var | OAuth | none]
**Transport:** [stdio (local) | streamable HTTP (remote/shared)]
**Deployment:** [local npm package | Docker | Cloudflare Worker | other]

For each tool, implement:
1. Descriptive name in verb_noun format (e.g. list_projects, create_record, search_files)
2. Zod input schema with field descriptions and constraints
3. outputSchema for structured responses
4. Async implementation with proper error handling
5. Annotations: readOnlyHint, destructiveHint, idempotentHint, openWorldHint

Project structure to create:
```
[server-name]/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          (server entry, transport setup)
│   ├── tools/
│   │   ├── [tool-group].ts
│   │   └── index.ts
│   ├── client.ts         (API client with auth)
│   └── types.ts          (shared types)
├── README.md
└── .env.example
```

After building:
1. Run: npm run build (verify zero TypeScript errors)
2. Show the MCP Inspector test command
3. Write the JSON config block to add this server to Claude Code
4. Create an evaluation file with 5 test questions that verify the tools work
```

---

## Prompt — Full MCP Server Build (Python / FastMCP)

```
Build a complete MCP server in Python using FastMCP.

**Server name:** [e.g. my-data-server]
**Tools to expose:** [list each operation]
**Data source / API:** [what it connects to]
**Auth:** [env var / none]
**Transport:** [stdio | streamable HTTP]

Use FastMCP patterns:
- @mcp.tool() decorator for each tool
- Pydantic models for structured inputs
- Type hints on all parameters and return types
- Descriptive docstrings (these become tool descriptions for LLMs)

Project structure:
```
[server-name]/
├── pyproject.toml (or requirements.txt)
├── server.py         (FastMCP server + tool definitions)
├── client.py         (API/DB client)
├── models.py         (Pydantic models)
├── README.md
└── .env.example
```

Requirements:
1. Each tool description must clearly state: what it does, parameters, return type
2. Error messages must be actionable: tell the LLM what to do next
3. Paginate results that could exceed 100 items
4. Return structured data (dict/list) not raw strings where possible
5. Run: python -m py_compile server.py (verify syntax)

Then write the Claude Code config JSON to connect it.
```

---

## Prompt — Add Tools to an Existing MCP Server

```
I have an existing MCP server at [PATH]. I want to add new tools.

**Existing server:** Read [PATH] to understand current structure
**New tools to add:**
  1. [Tool 1]: [description, inputs, outputs]
  2. [Tool 2]: [description, inputs, outputs]
  3. [Tool 3]: [description, inputs, outputs]

For each new tool:
1. Follow the existing patterns in the codebase exactly
2. Add it to the appropriate file or create a new one if the group is new
3. Register it in the server's tool index
4. Add an annotation block
5. Write a test case for it

After adding:
- Run the build/lint step
- Update README.md with the new tools
- Bump the package version (patch increment)
```

---

## Prompt — MCP Server Security Hardening

```
Audit and harden this MCP server for production use:

**Server path:** [PATH]

Check for:
1. **Auth validation** — is every tool protected? Can tools be called without auth?
2. **Input sanitization** — are inputs validated before reaching the underlying API/DB?
3. **Injection risks** — SQL injection, command injection, path traversal
4. **Output scrubbing** — are secrets or PII being returned accidentally?
5. **Rate limiting** — is there protection against tool call flooding?
6. **Destructive operations** — are delete/modify tools properly gated?
7. **Error leakage** — do error messages expose internal details?
8. **Tool annotations** — are destructiveHint and readOnlyHint correctly set?

For each issue found:
- Severity: Critical / High / Medium / Low
- Description of the vulnerability
- Concrete fix with code

Implement all Critical and High severity fixes. Present Medium/Low as recommendations.
```

---

## Tool Naming & Quality Checklist

```
Review the tool definitions in this MCP server against quality standards:

For each tool, verify:
- [ ] Name is verb_noun format (list_items, create_record, delete_user)
- [ ] Description answers: what does this do, when to use it, what it returns
- [ ] All parameters have descriptions in the schema
- [ ] Required vs optional parameters are correctly marked
- [ ] Error messages include what went wrong AND what to try next
- [ ] Paginated results use cursor/offset pattern, not page numbers
- [ ] readOnlyHint = true for GET operations, false for mutations
- [ ] destructiveHint = true for deletes and irreversible operations
- [ ] Large responses include a summary + truncation notice

Fix any violations found.
```
