# 3_Skills

Agent skills, in two forms (since 2026-10-27):

- **Library cards** in `Libraries/`, one per repo that publishes many skills (30). Each card
  links its repo and carries the repo's README; you install the skills from GitHub.
  `site/scripts/refresh-library-cards.mjs --write` keeps them current.
- **Single skills**, a folder per skill under a category, holding `SKILL.md` and its support
  files (28). Each `SKILL.md` has an `upstream:` block naming the repo, path and SPDX
  `license:` it was copied under, and the licence text sits beside it as `LICENSE`
  (`scripts/vendor-skill-licenses.mjs`). `scripts/upstream.test.mjs` fails CI otherwise.

`packs/` holds the hand-picked Skill Packs, which bundle single skills into one ZIP.

| Category | Skills |
|:--|--:|
| Development | 11 |
| Content | 4 |
| Design | 4 |
| Data | 3 |
| AI_ML | 2 |
| Business | 2 |
| Finance | 1 |
| Security | 1 |

Only `SKILL.md` files and the library cards are indexed. Any other file outside a skill
folder is invisible to the app, so it does not belong here. Skills and files taken out of
service are in `archive/` at the repo root (see its README).

Related: [`../2_Agents/`](../2_Agents/) (subagent definitions), [`../4_Prompts/`](../4_Prompts/),
[`../1_Guides/`](../1_Guides/).
