# Archive

Library items taken out of `site/library/` but not thrown away. Nothing here is served,
indexed or checked by CI: this folder sits outside `site/`, the deploy root, so the index
builder, the MCP server and `scripts/upstream.test.mjs` never see it.

| Folder | What | Why |
|:---|:---|:---|
| `unlinked-2026-10-26/` | 669 hand-written prompts (every `4_Prompts` category except `Awesome_ChatGPT`) and 28 guides (`Concepts/`, the hand-written agent configs, tools with no public repo) | Since 2026-10-26 every card shows a GitHub repo link at the top, and these name no repo. Paths are kept as they were under `site/library/`. |

**To restore an item:** move it back to the same path under `site/library/`, give it a repo
(`upstream:` block on a prompt, `repo:` on a guide; see `docs/CONTRIBUTING.md`), then
`cd site && npm run build:index`.
