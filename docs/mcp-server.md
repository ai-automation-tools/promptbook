# MCP Server

Promptbook's library as a Model Context Protocol server, on one page. The design (why stdout is
guarded, how paths are contained, which prompts are registered) is in
[features/MCP-SERVER.md](features/MCP-SERVER.md); install lines for users are in the
[README](../README.md#use-it-from-an-agent).

## At a glance

| | |
|:---|:---|
| Entry file | [`site/mcp/server.ts`](../site/mcp/server.ts), with [`site/mcp/setup.ts`](../site/mcp/setup.ts) imported first (sends console output to stderr, loads `.env` quietly) |
| Launched by | `npm run mcp` in `site/` (`tsx mcp/server.ts`), started by the MCP client. Nothing else needs to be running |
| Transport | stdio (`@modelcontextprotocol/server` 2.x, `serveStdio()`). Stdout carries only JSON-RPC |
| MCP id | `promptbook` (was `my-prompt-library` until 2026-10-22; re-add it under the new name if you installed the old one) |
| Test | `npm run test:mcp` (`site/scripts/mcp-server.test.mjs`), in CI |

## Install

After `npm install` in `site/`, with the absolute path to your clone:

```bash
claude mcp add promptbook -- npm --prefix /path/to/promptbook/site run --silent mcp
```

The README also has the `mcpServers` JSON block for other clients.

## Tools

| Tool | Does |
|:---|:---|
| `search_library` | Searches every section and My Library by words, section, category or tags; returns ids |
| `get_item` | The full markdown of one item, by library path or My Library id |
| `list_sections` | The sections with what each holds and its count, plus the My Library count |
| `list_categories` | One section's category and subcategory folders with counts |
| `get_skill` | A skill's `SKILL.md` and the list of its support files |
| `get_skill_file` | One text file from inside a skill folder |
| `list_skill_packs` | Every Skill Pack: id, name, skill count, what it covers |
| `get_skill_pack` | One Skill Pack with every skill in it |
| `save_to_my_library` | Copies a library item into My Library, or writes a new prompt from text or a local `.md` file, with an optional `source_url` (not registered when read-only) |
| `update_my_prompt` | Changes a My Library prompt's title, content, tags, source link or place; `file` re-reads the body from a local `.md` file; `version` (from `get_item`) refuses the update if the file changed since (not registered when read-only) |
| `update_from_public` | Pulls the current public version into a My Library copy; the public item is never changed (not registered when read-only) |
| `delete_my_prompt` | Deletes one of the user's own prompts (not registered when read-only) |

It also serves MCP prompts: `library_prompt` (any prompt, system prompt or agent by id), every
featured prompt and system prompt, and every My Library prompt as `my-<id>`.

## Environment

Names only. All optional; set them in `site/.env` (see `site/.env.example`).

| Variable | Effect |
|:---|:---|
| `MY_LIBRARY_DIR` | Where My Library lives (default `site/my-library`) |
| `READ_ONLY` | `true` drops the four write tools. `VERCEL` being set implies it |
| `IMPORT_ROOTS` | Folders the `file` argument may read from, `;`-separated on Windows. Unset, `file` is refused |

---

[← Docs home](README.md) · [MCP Server design →](features/MCP-SERVER.md)
