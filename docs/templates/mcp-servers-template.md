---
title: "🔌 [Server Name]"
description: "[One sentence: what the server gives an agent.]"
tags: ["mcp-server", "[folder-slug]", "[topic]", "[topic]", "official"]
server:
  repo: [owner/repo]
  path: [subfolder, only for a monorepo like modelcontextprotocol/servers]
  license: "[SPDX id, read from the repo this run]"
  maintainer: "[Org (official) | name (community)]"
  transport: "[stdio | HTTP (remote) | stdio, HTTP]"
  checked: [YYYY-MM-DD, the day the install lines were read]
---

# [Server Name] MCP server

[The description sentence again.]

| | |
|:---|:---|
| **Source** | [owner/repo](https://github.com/owner/repo) |
| **Maintainer** | [same as frontmatter] |
| **Licence** | [same as frontmatter] |
| **Transport** | [same as frontmatter] |
| **Auth** | [None / OAuth / API key in a header / token in an env var] |
| **Needs** | [Runtime and accounts: Node.js 18+, uv, Docker, a Stripe account] |

## Install

**Claude Code**

```bash
claude mcp add [name] -- npx -y [package]
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "[name]": {
      "command": "npx",
      "args": ["-y", "[package]"]
    }
  }
}
```

## What it can do

- [Two to four capabilities, from the README, not guessed]

## Notes

[Scope and safety: what it can reach, which credentials to narrow, read-only modes.]

_Install lines read from the server's README on [YYYY-MM-DD]. The Monthly Upkeep re-checks every card._

<!--
Rules (the Promptbook Content job's catalog run and anyone adding by hand):
- One file per server: site/library/6_MCP_Servers/<Folder>/<server>.md, lowercase-hyphenated.
  Folders: Reference, Browser_Automation, Developer_Tools, Cloud_Platforms, Apps_and_Services.
- Every install line comes from the server's own README or docs, read that day. Never invent
  a package name or flag. Placeholders for secrets (YOUR_API_KEY, ntn_****), never real values.
- Only servers that are maintained (pushed in the last year), not archived, and licensed.
  Prefer the vendor's official server over a community one for the same service.
- No servers whose main pitch is bypassing CAPTCHAs, bot detection or access controls.
-->
