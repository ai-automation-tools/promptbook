# API Documentation

## Base URL

```
http://localhost:3010/api
```

Hosted demo (read-only): `https://promptbook-demo.ai-automation-tools.dev/api`

The handlers live in `site/api/index.ts` (prompts, previews, skill downloads) and
`site/api/skill-packs.ts` (skill packs). Locally `server.ts` mounts both on one Express app;
on Vercel `site/vercel.json` routes `/api/skill-packs/*` to the second function and every
other `/api/*` path to the first.

## Access and read-only mode

There are no accounts, sessions or API keys. Every endpoint is open to whoever can reach the
server, which by default is only this machine (the server binds to `127.0.0.1`).

Two checks run before every route, locally:

- **Host:** a request whose `Host` is not `localhost`, `*.localhost`, an IP address or a name
  in `ALLOWED_HOSTS` gets `403 { "error": "Unknown Host refused. Add it to ALLOWED_HOSTS if it is yours." }`.
  This is what stops DNS rebinding. Skipped on Vercel.
- **Origin:** a write (`POST`, `PUT`, `DELETE`, `PATCH`) whose `Origin` is another site, or
  `null`, gets `403 { "error": "Cross-site request refused" }`. Requests with no `Origin`
  (curl, scripts) pass.

**Read-only mode** is on when `READ_ONLY=true`, and always on Vercel (which sets `VERCEL`).
It serves the Public Library only: the My Library list and `?library=my` packs are empty, and
a My Library id on `GET /api/prompts/:id` is refused like any other non-library path. Every
route that writes to My Library returns:

```
403 Forbidden
{ "error": "This copy of the library is read-only. Clone the repo to keep your own prompts." }
```

The write routes are `POST /api/prompts`, `PUT /api/prompts/:id`, `DELETE /api/prompts/:id`,
`POST /api/prompts/:path/copy-to-my-prompts`, `POST /api/prompts/:id/pull-upstream`, `POST /api/skill-packs/:packId/add-to-library`
and `DELETE /api/skill-packs/:packId/remove-from-library`. All reads keep working.

## Two kinds of id

| Library | Id looks like | Where it lives |
|:---|:---|:---|
| Public | `4_Prompts/Awesome_ChatGPT/General/emoji-translator.md` (path under `site/library/`, forward slashes) | `site/library/` |
| My Library | `market-research-plan-3fa9c1` (bare file name, no `.md`, no `/`) | `MY_LIBRARY_DIR`, default `site/my-library/` |

`GET /api/prompts/:id` uses the slash to tell them apart. My Library ids match
`^[a-z0-9-]+$`; anything else is never looked up as a file. When an id goes in a URL path,
encode it with `encodeURIComponent` so the slashes in public ids survive.

---

## Prompt Endpoints

### GET /api/prompts

List prompts.

**Query Parameters:**
- `library`: `public` (default behaviour) or `my`
- `lightweight` (optional): `true` or `false` (default: `false`)

**Public Library (`?library=public`):**
- Every prompt under `site/library/`, from the prebuilt index when it can be used
- `isUserOwned: false`
- `README.md` files, the `Legacy/` section, non-`SKILL.md` files under `3_Skills/` and files
  over 500 KB are left out

**My Library (`?library=my`):**
- Every `.md` file in the My Library folder, newest `updated` first
- `isUserOwned: true`
- Returns `[]` when the folder does not exist yet, and always in read-only mode, whatever
  the folder holds

**Lightweight Mode (`?lightweight=true`):**
- Public library: `content` is an empty string. No body text of any kind, not even a
  preview. For all 3,088 public prompts this was **117.6 KB gzipped**, against 338 KB when
  each entry carried a 200-character preview (measured 2026-09-08; it scales roughly with
  prompt count).
- My Library: `content` is the first 200 characters, inline, since it is one person's
  prompts rather than the whole library.
- Use `POST /api/prompts/previews` for public card blurbs and `GET /api/prompts/:id` for the
  full body. Never treat a lightweight `content` as the real prompt.

**Response (200 OK):**
```json
[
  {
    "id": "2_Agents/Developer/General/devops-engineer.md",
    "title": "⚙️ DevOps Engineer",
    "section": "2_Agents",
    "category": "Developer",
    "subcategory": "General",
    "tags": ["featured", "devops"],
    "content": "",
    "lastModified": "2026-03-25T10:15:00.000Z",
    "isUserOwned": false
  }
]
```

If the library cannot be read the response is `200` with `[]`; the error goes to the server
log.

**Examples:**
```bash
curl "http://localhost:3010/api/prompts?library=public&lightweight=true"
curl "http://localhost:3010/api/prompts?library=my"
```

---

### POST /api/prompts/previews

Card blurbs for a batch of public library ids. This fills in the excerpt under a card title,
since the lightweight listing ships none.

**Request:**
```json
{ "ids": ["1_Guides/API_Providers/anthropic_api_guide.md", "4_Prompts/Awesome_ChatGPT/General/x.md"] }
```

**Response (200 OK):** a map of id → first 200 characters of the body.
```json
{
  "1_Guides/API_Providers/anthropic-api-guide.md": "\n# Anthropic API Guide\n\n## Overview\n..."
}
```

**Behavior:**
- Served from a Map built once out of `api/prompt-index.json`; ids the index does not have
  fall back to reading the file.
- **Capped at 200 ids per request.** Extra ids are dropped, not rejected. The client
  (`src/hooks/usePromptPreviews.ts`) chunks to match.
- Ids that do not resolve are **omitted from the response** rather than failing the batch.
  Non-`.md` ids and anything that escapes `library/` (checked with `resolveInside`) resolve
  to nothing.
- Public library files only. My Library's listing carries its previews inline.

**Errors:**
- `400 Bad Request`: body is not `{ ids: [...] }`

**Example:**
```bash
curl -X POST http://localhost:3010/api/prompts/previews \
  -H "Content-Type: application/json" \
  -d '{"ids":["1_Guides/API_Providers/anthropic-api-guide.md"]}'
```

---

### GET /api/prompts/:id

One prompt with its full content.

**Path Parameters:**
- `id`: a public library path or a My Library id (see [Two kinds of id](#two-kinds-of-id)),
  URL-encoded

**Response (200 OK):**
```json
{
  "id": "2_Agents/Developer/General/devops-engineer.md",
  "title": "⚙️ DevOps Engineer",
  "section": "2_Agents",
  "category": "Developer",
  "subcategory": "General",
  "tags": ["featured", "devops", "infrastructure"],
  "content": "Full markdown content...",
  "lastModified": "2026-03-25T10:15:00.000Z",
  "isUserOwned": false
}
```

For a public prompt, `section`, `category` and `subcategory` come from the path and `title`
from frontmatter, the first `#` heading, or the file name. For a My Library prompt they come
from the file's frontmatter and `isUserOwned` is `true`.

A My Library prompt also carries `version`, the value a `PUT` sends back to detect a
conflicting edit. Both carry `extra`: the file's frontmatter beyond the fields above (a skill's `name`,
`description`, `license`, `allowed-tools`…; never `upstream`). The Download button writes it
back into the `.md`, so a downloaded skill still loads.

A My Library prompt also carries `upstream`: `null` when it has no Public Library source, or
`{ "source": "<public id>", "updateAvailable": bool, "localEdits": bool }`. `updateAvailable`
means the public content changed since the copy was saved; `localEdits` means the copy was
edited since. A copy saved before 2026-10-22 has no recorded source and is matched by section,
category, subcategory and title; with no saved hash to compare, any difference counts as both.

**Errors:**
- `400 Bad Request`: the path escapes `library/`
- `404 Not Found`: prompt not found
- `500 Internal Server Error`: failed to read the prompt

**Example:**
```bash
curl http://localhost:3010/api/prompts/2_Agents%2FDeveloper%2FGeneral%2Fdevops-engineer.md
curl http://localhost:3010/api/prompts/market-research-plan-3fa9c1
```

---

### POST /api/prompts

Create a prompt in My Library. Writes one new `.md` file. **Write route: `403` in read-only
mode.**

**Request:**
```json
{
  "title": "My Custom Prompt",
  "section": "4_Prompts",
  "category": "Business",
  "subcategory": "Marketing",
  "tags": ["custom", "marketing"],
  "sourceUrl": "https://github.com/owner/repo",
  "content": "Full prompt content in markdown..."
}
```

`subcategory`, `tags` and `sourceUrl` are optional. `sourceUrl` is where the item stems from;
it is stored as `source_url` in the file's frontmatter and comes back as `sourceUrl` on the
prompt, which the item page shows as a link. On `PUT`, `""` or `null` clears it.

**Field rules** (the same for `PUT`, and for the MCP write tools, because the My Library store
checks them):

| Field | Rule |
|:---|:---|
| `title`, `category` | Text, not blank. Title up to 300 characters, category up to 100 |
| `section` | One of `1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`, `6_MCP_Servers` |
| `subcategory` | Text up to 100 characters, or `null` |
| `tags` | A list of up to 50 non-blank strings, each up to 100 characters |
| `sourceUrl` | An `http(s)` URL up to 2,000 characters, or `null` |
| `content` | Text, not blank, up to 500 KB |

A refused write changes no file.

**Response (200 OK):**
```json
{
  "id": "my-custom-prompt-a41f0e",
  "title": "My Custom Prompt",
  "section": "4_Prompts",
  "category": "Business",
  "subcategory": "Marketing",
  "tags": ["custom", "marketing"],
  "content": "Full prompt content in markdown...",
  "lastModified": "2026-10-21T10:27:36.000Z",
  "isUserOwned": true,
  "message": "Prompt created successfully"
}
```

The id is the slugged title (up to 60 characters) plus 6 random hex characters. It is also
the file name, and it does not change when the prompt is renamed later.

**Errors:**
- `400 Bad Request`: a field is missing or breaks a rule above; `error` names it, e.g.
  `{ "error": "category must be text" }`
- `403 Forbidden`: read-only mode
- `500 Internal Server Error`: the file could not be written

**Example:**
```bash
curl -X POST http://localhost:3010/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Prompt",
    "section": "4_Prompts",
    "category": "Business",
    "content": "# My Prompt\n\nContent here..."
  }'
```

---

### PUT /api/prompts/:id

Update a My Library prompt in place. **Write route: `403` in read-only mode.**

**URL Parameters:**
- `id`: My Library id (e.g. `my-custom-prompt-a41f0e`)

**Request:** any of `title`, `section`, `category`, `subcategory`, `tags`, `content`. Fields
left out keep their current value; send `"subcategory": null` to clear it. A field that is
sent must pass the field rules above: an empty `content` or `title` is refused with `400`,
not ignored.

Send `version` (from `GET /api/prompts/:id`, a hash of the file on disk) to make the update
conditional: if the file changed since, from another tab, the MCP server or a text editor,
the update is refused with `409` and nothing is written. Leave it out for an unconditional
update. The file is replaced atomically (temp file, then rename), so a crash mid-write
leaves the old one whole.

**Response (200 OK):** the updated prompt, same shape as `POST /api/prompts`, with
`"message": "Prompt updated successfully"`.

**Errors:**
- `400 Bad Request`: a field breaks a rule above
- `403 Forbidden`: read-only mode
- `404 Not Found`: no My Library file with that id
- `409 Conflict`: `version` is stale. The body carries `current`, the prompt as it is now
  (with its new `version`); the app reloads its editor with it

**Example:**
```bash
curl -X PUT http://localhost:3010/api/prompts/my-custom-prompt-a41f0e \
  -H "Content-Type: application/json" \
  -d '{ "title": "New Title", "content": "New content..." }'
```

---

### DELETE /api/prompts/:id

Delete a My Library prompt (removes its file). **Write route: `403` in read-only mode.**

**Response (200 OK):**
```json
{ "message": "Prompt deleted successfully" }
```

**Errors:**
- `403 Forbidden`: read-only mode
- `404 Not Found`: no My Library file with that id

**Example:**
```bash
curl -X DELETE http://localhost:3010/api/prompts/my-custom-prompt-a41f0e
```

---

### POST /api/prompts/:path/copy-to-my-prompts

Copy a public prompt into My Library as a new file. `title` (or a skill's `name`) and `tags`
carry over, section, category and subcategory come from the path, and the rest of the library
file's frontmatter (a skill's `name`, `description` and the like) is kept, minus provenance.
The copy also gets `forked_from` (the public id) and `forked_hash` (a hash of the public content
as copied), which `upstream` and `pull-upstream` compare against. **Write route: `403` in read-only mode.**

**URL Parameters:**
- `path`: public prompt path, e.g. `4_Prompts/Awesome_ChatGPT/General/emoji-translator.md`

**Request:** no body.

**Response (200 OK):** the new My Library prompt, same shape as `POST /api/prompts`, with
`"message": "Prompt copied to My Library"`.

**Errors:**
- `400 Bad Request`: the path escapes `library/`
- `403 Forbidden`: read-only mode
- `404 Not Found`: source prompt not found
- `409 Conflict`: My Library already has a prompt with the same title (case-insensitive) in
  the same section, category and subcategory
- `500 Internal Server Error`: copy failed

**Example:**
```bash
curl -X POST "http://localhost:3010/api/prompts/4_Prompts%2FBusiness%2FMarketing%2Fmarket-research.md/copy-to-my-prompts"
```

---

### POST /api/prompts/:id/pull-upstream

Replace a My Library copy's content with the current version of the public prompt it came
from, and reset its `forked_hash`. Edits made to the copy are overwritten; the site asks first
when `upstream.localEdits` is true. The public file is only read. **Write route: `403` in read-only mode.**

**Request:** no body.

**Response (200 OK):** the updated My Library prompt with `upstream`, and
`"message": "Updated from the Public Library"`.

**Errors:**
- `403 Forbidden`: read-only mode
- `404 Not Found`: no such My Library prompt, or it has no Public Library source
- `500 Internal Server Error`: update failed

---

### GET /api/skills/download/:skillPath

Download one skill directory under `library/3_Skills/` as a ZIP.

**Errors:**
- `400 Bad Request`: the path is outside `3_Skills/`, or is not a directory
- `404 Not Found`: directory not found
- `500 Internal Server Error`: archive failed

---

## Skill Pack Endpoints

Packs are JSON files under `site/library/3_Skills/packs/`. See
[Skill Packs](../skill-packs/README.md) for the format.

A pack counts as "in My Library" while at least one My Library prompt carries the tag
`skill-pack:<packId>`. There is no separate install record: adding a pack tags every skill it
copies, and removing it deletes those files.

### GET /api/skill-packs?library=public|my

List packs as summaries (`id`, `name`, `description`, `icon`, `version`, `tags`,
`category`, `skillCount`, `author`, `created_at`, `updated_at`).

- `public` (default): every pack
- `my`: only packs with at least one My Library prompt tagged `skill-pack:<packId>`. Always empty
  in read-only mode.

### GET /api/skill-packs/:packId

The full pack, with each skill's frontmatter resolved into `metadata`. Skills whose file
cannot be read are left out.

**Errors:** `404 Not Found` if the pack does not exist.

### POST /api/skill-packs/:packId/add-to-library

Copy every skill in the pack into My Library, in section `3_Skills`, tagged
`skill-pack:<packId>`. All or nothing: if any skill fails to read or save, the skills this
request already wrote are deleted and it returns `500`, so a retry starts clean. Skills
already in My Library are skipped, so a retry never duplicates. **Write route: `403` in
read-only mode.**

**Body:**
```json
{ "confirm": true }
```

**Response (200 OK):**
```json
{ "message": "Added 4 skills from Developer Essentials Pack (1 skipped)", "added": 4, "skipped": 1, "packId": "developer-essentials-pack" }
```

A skill is skipped when My Library already has a prompt with the same title, section and
category, so adding a pack twice does not duplicate it.

**Errors:**
- `400 Bad Request`: `confirm` is not `true`
- `403 Forbidden`: read-only mode
- `404 Not Found`: pack not found

### DELETE /api/skill-packs/:packId/remove-from-library

Delete every My Library prompt in section `3_Skills` tagged `skill-pack:<packId>`.
**Write route: `403` in read-only mode.**

**Body:**
```json
{ "confirm": true }
```

**Response (200 OK):**
```json
{ "message": "Removed 4 skills from My Library", "removed": 4, "packId": "developer-essentials-pack" }
```

**Errors:**
- `400 Bad Request`: `confirm` is not `true`
- `403 Forbidden`: read-only mode

### GET /api/skill-packs/:packId/download

Download the pack as a ZIP.

**Errors:** `404 Not Found` if the pack does not exist.

---

## Response Formats

Success responses are `200 OK` with the resource as the body (an array for listings, an
object otherwise). Errors carry an `error` field:

```json
{ "error": "Description of what went wrong" }
```

**Status codes in use:**
- `200 OK`: success
- `400 Bad Request`: invalid input or path
- `403 Forbidden`: write attempted in read-only mode
- `404 Not Found`: resource doesn't exist
- `409 Conflict`: the prompt is already in My Library
- `500 Internal Server Error`: server error

There is no CORS configuration (same-origin only), no rate limiting and no server-side
pagination.

---

## Data Model

### Prompt

```typescript
{
  id: string;              // public: path under library/; My Library: file name without .md
  title: string;
  section: string;         // 1_Guides | 2_Agents | 3_Skills | 4_Prompts | 5_System_Prompts
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;         // full markdown, or a preview/empty string in lightweight mode
  lastModified: string;    // ISO 8601; My Library uses the frontmatter `updated` value
  isUserOwned: boolean;    // true for My Library, false for public
}
```

### My Library file

```markdown
---
title: My Custom Prompt
section: 4_Prompts
category: Business
subcategory: Marketing
tags:
  - custom
created: '2026-10-21T10:27:36.000Z'
updated: '2026-10-21T10:27:36.000Z'
---
Full prompt content in markdown...
```

See [SETUP.md](../setup/SETUP.md#my-library-on-disk) for the defaults applied to
hand-edited files.

---

## Testing

```bash
npm run test:routes      # the route table, and that no auth router is mounted
npm run test:my-library  # the file store, against a temp folder
npm run test:read-only   # read-only mode hides My Library
npm run test:prompt-content  # the UI's full-prompt fetch fails closed
npm run test:markdown-file   # the Download button's .md round-trips
npm run test:mcp             # the MCP server shares these readers and the store
npm run test:safe-path       # ../ escapes and links out of library/ are refused
npm run test:browser         # after npm run build: the built app in Chrome
```

**Quick cURL round trip** (local, not read-only):
```bash
# Create
curl -X POST http://localhost:3010/api/prompts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Prompt","section":"4_Prompts","category":"Business","content":"Test content"}'

# List
curl "http://localhost:3010/api/prompts?library=my"

# The file is in site/my-library/test-prompt-<hex>.md
```

---

## Performance Optimizations

### Prebuilt Index

The API uses a prebuilt static index for faster cold starts on Vercel.

**Build Process:**
```bash
npm run build:index
```

**Index Location:** `api/prompt-index.json`

**Index Structure:**
```json
{
  "version": 1,
  "buildTime": "2026-03-25T18:00:00.000Z",
  "promptCount": 1151,
  "prompts": [
    {
      "id": "4_Prompts/path/to/prompt.md",
      "title": "Prompt Title",
      "section": "2_Agents",
      "category": "Developer",
      "subcategory": "General",
      "tags": ["featured", "tag1"],
      "contentPreview": "First 200 chars...",
      "lastModified": "2026-03-25T10:15:00.000Z",
      "isUserOwned": false
    }
  ]
}
```

**Timestamps:** `lastModified` is the file's mtime *when that entry last changed*. A rebuild
reuses the previous index's value for any entry whose metadata is unchanged and whose file has no
uncommitted edits (`git diff HEAD`), and keeps `buildTime` too if nothing changed at all — so
rebuilding an untouched library, including on a fresh checkout or on Vercel, reproduces the
committed file byte for byte. CI relies on that.

**Performance Impact:**
- **Cold start time:** 2-5s → <100ms (50x faster)
- **Payload size:** 13MB → 700KB for lightweight mode
- **Memory usage:** Reduced by ~90%

### Caching

- 5-minute in-memory cache for public listings, lightweight and full, kept as the bytes sent with
  their ETag, so a repeat request costs no parsing, stringifying or hashing; `If-None-Match` gets a `304`
- A library edit can take up to five minutes to show in a listing
- Resets on server restart (or a new Vercel instance)
- The My Library listing is never cached; it reads the folder on every request, so
  hand-edits show up on the next load

### Lightweight Mode

**Recommended Pattern:**
```javascript
// 1. Load the list with lightweight mode — metadata only, no body text
const list = await fetch('/api/prompts?library=public&lightweight=true');

// 2. Blurbs for the cards actually on screen (~50), batched
const previews = await fetch('/api/prompts/previews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids: visiblePrompts.map(p => p.id) }),
});

// 3. Full content on demand — opening, copying, downloading or editing a prompt
const full = await fetch(`/api/prompts/${encodeURIComponent(promptId)}`);
```

### File Size Limits

- Files >500KB are excluded from the index and the listing
- Prevents bulk collections from slowing down the API
- Skipped files are logged during build

**Affected Files:**
- `act-as-an-expert.md` (3.3MB) - excluded
- `promptsdotchat-opensource.md` (2.5MB) - excluded

### Pagination

- 50 prompts per page (`ITEMS_PER_PAGE` in `src/hooks/usePromptFilters.ts`)
- Client-side pagination; the full listing is loaded once and filtered in the browser
- Consider server-side pagination for >5000 prompts

---

## Changelog

### v2.0.0 (October 2026)
- **Removed:** all `/api/auth/*` endpoints, cookie sessions and rate limiting
- My Library is a folder of markdown files; its ids are file names, not database ids
- Write routes return `403` in read-only mode (`READ_ONLY=true`, or on Vercel)
- Skill-pack "installed" state is derived from `skill-pack:<packId>` tags

### v1.3.0 (September 2026)
- **New Endpoint:** `POST /api/prompts/previews` — batched card blurbs, 200 ids max
- **Payload:** lightweight public listings no longer carry body text at all
  (338 KB → 117.6 KB gzipped)
- A lightweight `content` is no longer a usable prompt body under any mode — copy,
  download and edit all go to `GET /api/prompts/:id`

### v1.2.0 (April 2026)
- Added skill pack library-mode endpoint behavior (`public` vs `my`)
- Added skill pack install/remove APIs with explicit confirmation
- Improved search ranking to prioritize prompt title matches first

### v1.1.0 (March 2026)
- **Performance:** Added prebuilt index for 50x faster cold starts
- **New Endpoint:** `GET /api/prompts/:id` for individual prompt fetching
- **Lightweight Mode:** Added `?lightweight=true` parameter (95% payload reduction)
- **Caching:** 5-minute in-memory cache for public library
- **File Filtering:** Automatic exclusion of files >500KB
- **Pagination:** Frontend pagination at 50 items per page

### v1.0.0
- Initial release
- Prompt CRUD operations
- Public/My Library separation
- Copy prompts from public to personal library
