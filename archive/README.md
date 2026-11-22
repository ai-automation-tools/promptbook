# Archive

Library items taken out of `site/library/` but not thrown away. Nothing here is served,
indexed or checked by CI: this folder sits outside `site/`, the deploy root, so the index
builder, the MCP server and `scripts/upstream.test.mjs` never see it.

| Folder | What | Why |
|:---|:---|:---|
| `leaked-sources-2026-11-18/` | 122 system prompts and 3 folder readmes from `5_System_Prompts/`: 113 from 38 vendors (OpenAI, Google, xAI, Copilot, Cursor, Perplexity, Meta…) and 9 Anthropic ones Anthropic doesn't publish (Chrome extension, Cowork, the "soul document"), that duplicated a re-sourced file, or (`anthropic-claude-sonnet-3-5.md`) was a hand-written summary labelled as Anthropic's | They were sourced from leak collections (`jujumilk3/leaked-system-prompts`, `0xeb/TheBigPromptLibrary`, `LouisShark/chatgpt_system_prompt`), and the library takes only vendor-published prompts (Mike, 2026-11-18). 14 Anthropic files were re-sourced from Anthropic's release notes instead, and `computer-use.md` from `anthropics/claude-quickstarts`. Don't restore one unless its vendor publishes it: then copy the vendor's text, not this one. |

**Removed 2026-11-22 (PB-05).** The rest of this folder left the tree: the 669 unlinked prompts
and 28 guides (`unlinked-2026-10-26/`), the 224 copied skill-library skills
(`skill-libraries-2026-10-27/`, including four Anthropic document skills marked "All rights
reserved"), `skill-libraries-2026-11-18/`, the five unlicensed skills (`unlicensed-2026-10-27/`),
the 81 loose skill files (`loose-skill-files-2026-10-27/`) and the old `prompt_generation/`
scripts. Unlicensed and proprietary text has no place in a public tree, even unserved. They are
in git history: `git show 86ff6925:archive/<path>` reads one, and
`git checkout 86ff6925 -- archive/<folder>` brings a folder back.

**To restore an item to the library:** move it back to the same path under `site/library/`, give
it a repo (`upstream:` block on a prompt, `repo:` on a guide; see `docs/CONTRIBUTING.md`) and,
for a skill, a redistributable licence, then `cd site && npm run build:index`.
