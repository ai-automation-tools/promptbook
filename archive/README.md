# Archive

Library items taken out of `site/library/` but not thrown away. Nothing here is served,
indexed or checked by CI: this folder sits outside `site/`, the deploy root, so the index
builder, the MCP server and `scripts/upstream.test.mjs` never see it.

| Folder | What | Why |
|:---|:---|:---|
| `unlinked-2026-10-26/` | 669 hand-written prompts (every `4_Prompts` category except `Awesome_ChatGPT`) and 28 guides (`Concepts/`, the hand-written agent configs, tools with no public repo) | Since 2026-10-26 every card shows a GitHub repo link at the top, and these name no repo. Paths are kept as they were under `site/library/`. |
| `skill-libraries-2026-10-27/` | 224 skill folders from the 30 repos we had copied 2 or more skills from (addyosmani/agent-skills, anthropics/skills, JoelLewis/finance_skills, ai-automation-tools/agent-skills…), plus two orphaned finance_skills plugin manifests | Since 2026-10-27 a skill library is one card in `site/library/3_Skills/Libraries/` that links to its repo, instead of a copy of each skill. Paths are kept as they were under `site/library/`. |
| `prompt_generation/` | `generate_prompts.py` and `generate_character_prompts.js`, which wrote prompt files from templates (formerly `scripts/prompt_generation/`) | Prompts are copied from public collections now, never written here, so the generators have no use in the library. |

**To restore an item:** move it back (a skill: its whole folder; it already carries its `upstream:` block) to the same path under `site/library/`, give it a repo
(`upstream:` block on a prompt, `repo:` on a guide; see `docs/CONTRIBUTING.md`), then
`cd site && npm run build:index`.
