# MCP server

Promptbook as a [Model Context Protocol](https://modelcontextprotocol.io/) server, so an
agent can search the library and use what it finds without anyone copying text out of a browser.
Built 2026-10-21 (roadmap Phase 1). Install lines for users are in the
[README](../../README.md#use-it-from-an-agent); this page is how it works and why.

## Shape

| | |
|:---|:---|
| Entry | `site/mcp/server.ts`, run by `npm run mcp` in `site/` |
| SDK | `@modelcontextprotocol/server` 2.x (the v2 line; v1 `@modelcontextprotocol/sdk` is maintenance-only) |
| Transport | stdio, through `serveStdio()`, which serves both 2026-era and 2025-era clients from one factory |
| Reads | `site/library/` and `api/prompt-index.json` through `site/lib/library.ts`, My Library through `site/lib/my-library.ts`, Skill Packs through `getAllPacks()` in `api/skill-packs.ts` |
| Config | `site/.env` (`MY_LIBRARY_DIR`, `READ_ONLY`, `IMPORT_ROOTS`), loaded quietly by `site/mcp/setup.ts` |
| Test | `npm run test:mcp` (`site/scripts/mcp-server.test.mjs`), in CI |

The server shares code with the API instead of copying it. `lib/library.ts` holds the library
path, the index loader and the single-item reader that both use; `GET /api/prompts/:id` and the
copy route were moved onto it in the same change.

## Stdout belongs to the protocol

A stdio server's stdout carries JSON-RPC and nothing else. Two things here would have broken
that: library code that logs with `console.log`, and dotenv 17, which announces itself on
stdout. `mcp/setup.ts` is imported first, before anything that can log, and points
`console.log`, `console.info` and `console.debug` at stderr, then loads `.env` with
`quiet: true`. The server never imports `api/index.ts` (the Express app logs on load). The test's
handshake fails if anything slips onto stdout.

## Tools

All tools return markdown text. Read tools carry `readOnlyHint`.

| Tool | Input | Returns |
|:---|:---|:---|
| `search_library` | `query?`, `section?` (prompts, agents, guides, system-prompts, skills, mcp-servers), `tags?` (all must match), `category?`, `library?` (all, public, my), `limit?` (1–50, default 10) | One line per hit: title, id, place, tags. Fuse.js over title, tags, category, subcategory and the opening text; with no query, the filtered items by title |
| `get_item` | `id` | The full markdown. Library ids are paths (`4_Prompts/…/x.md`); a bare slug is a My Library id. A My Library skill comes back as a complete SKILL.md, frontmatter included |
| `list_sections` | none | The six sections with counts and what each holds, plus the My Library count |
| `list_categories` | `section` | Category and subcategory folders with counts |
| `get_skill` | `id`: skill folder or its `SKILL.md` id | `SKILL.md` plus the list of support files with sizes |
| `get_skill_file` | `skill`, `path` | One text file inside the skill. Refuses paths outside the folder, files over 500 KB and binaries |
| `list_skill_packs` | none | Every pack: id, name, skill count, generated or hand-picked |
| `get_skill_pack` | `id` | The pack's skills with their `SKILL.md` ids |
| `save_to_my_library` | `id` to copy, or `title` + `content`, or `title` + `file` (+ `section`, `category`, `subcategory`, `tags`, `source_url`) | The new My Library id. A copy refuses a duplicate title in the same place, as the app does, and keeps the item's own frontmatter (a skill's `name`, `description`, `license`…); new content may start with its own frontmatter block |
| `update_my_prompt` | `id` + any of `title`, `content`, `file`, `category`, `subcategory`, `tags`, `source_url` (`""` clears it), `version?` | Confirmation. With `version` (shown by `get_item` for My Library items) the update is refused if the file changed since. Both write tools follow the store's field rules (see `POST /api/prompts` in [API.md](API.md)); an empty `content` is an error, not "leave it". `destructiveHint`: it replaces the body |
| `update_from_public` | `id` | Replaces a copy's body with the current version of the public item it was saved from |
| `delete_my_prompt` | `id` | Confirmation. `destructiveHint`; the server's instructions tell the agent to ask first |

**Writes.** The four write tools are not registered at all when `READ_ONLY` is true (or
`VERCEL` is set), and each handler checks again. They go through `lib/my-library.ts`, whose ids
are `[a-z0-9-]` file names, so no id can name a path outside the folder.

**File import.** `file` on `save_to_my_library` and `update_my_prompt` is the absolute path of a
local `.md` file the server reads itself, so a long body (a 60 KB `SKILL.md`) never has to be
retyped into a tool call. It is off unless `IMPORT_ROOTS` lists the folders it may read (split
on `;` on Windows, `:` elsewhere); a path outside them, a junction that resolves outside, a
non-markdown file or one over 500 KB is refused. The file's frontmatter becomes the prompt's
(a skill's `name` and `description`), and `content`, if also passed, goes above the file as a
preface, such as a `> Source:` line.

**Containment.** Every caller-supplied path goes through `resolveInside()`: library ids against
`site/library/`, skill folders against `site/library/3_Skills/` (and the folder must hold a
`SKILL.md`), support files against their skill folder. It compares real paths too, so a link inside a skill
that points elsewhere is refused, and `get_skill`'s file list skips links. The test tries `../`
escapes against each and fails if one returns anything; `npm run test:safe-path` covers links.

## Prompts

MCP prompts appear in clients as slash commands, and clients list all of them. Registering all
~1,900 prompts and system prompts would bury the menu, so the server registers:

- `library_prompt` with arguments `id` and `input`: any prompt, system prompt or agent by id;
- every `featured` prompt and system prompt, and every one that declares `inputs:`, by a slug of
  its file name;
- every My Library prompt, as `my-<id>`.

Each takes an optional `input`, appended after the prompt text as one user message. A prompt
that declares `inputs:` in its frontmatter (since 2026-10-27) also gets one required argument
per declared `[placeholder]`, so the client asks for each value:

```yaml
inputs:
  - name: topic                 # the text between the brackets, [topic]
    description: The subject    # shown to the user; optional
  - target audience             # a bare name works too; the argument is target_audience
```

Nothing is guessed: brackets that are not declared (`[N]`, `[dict]`, links) stay as written,
and filling is one literal text swap, never a template. A name that is not in the body as
`[name]`, is malformed, or would collide with `input` is dropped, and `npm run test:mcp` fails
on such a declaration in the library (`lib/prompt-inputs.ts`). `library_prompt` keeps only `id`
and `input`, since its arguments are fixed before the id is known. The
factory runs per connection, so the My Library list is current as of connecting.

## How it stays current

The server reads the library from disk on every call, so **content needs no step of its own**:
whatever the scheduled jobs add or fix is served as soon as the clone has it. What keeps the
clone, the code and the dependencies current:

| What | Kept current by |
|:---|:---|
| Library content (prompts, skills, agents, MCP cards, packs) | The Prompt-Library job fleet, merged to `main` by the Org PR Sweep |
| The clone a user-scope MCP config runs from | The daily repo sync (`Sync-Repos.ps1`) merges `main` into `mike_desktop` |
| `site/node_modules` after a dependency change | The same sync: `promptbook` is in its `$repoInstallDirs` map, so a pulled change to `site/package-lock.json` runs `npm ci` in `site/`, after stopping the local app and any `node` process rooted in the repo (MCP sessions reconnect with `/mcp`), then restarts the app |
| SDK minor and patch releases | Dependabot's weekly grouped PR for `/site` |
| SDK majors and MCP spec revisions | The biweekly upstream check, from the `docs/UPSTREAMS.md` row |
| Every change to any of the above | CI runs `npm run test:mcp` on every PR, including every automation PR |
| A new library section | `test:mcp` fails until `SECTIONS` in `lib/library.ts` lists the same folders as `src/lib/sections.ts` |
| This server's own card in `6_MCP_Servers/` | The Monthly Upkeep's `check-mcp-servers.mjs` |

The count in the server's instructions comes from the index at start-up, so it never goes stale.

## Not built yet

These are on the roadmap and need Mike's go-ahead, because each makes something public:

- a read-only remote endpoint on the demo (Streamable HTTP at `/api/mcp`);
- an npm package, so `npx` works without a clone;
- a listing in the official MCP registry.
