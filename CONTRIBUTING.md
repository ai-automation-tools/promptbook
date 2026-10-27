# Contributing

The full guide, with the content templates and formatting rules, is at
[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). This page is the short version.

## Content (prompts, agents, skills, system prompts)

1. Pick the section: `site/library/1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts` or
   `5_System_Prompts`. Lowercase, case-unique paths only.
2. Start from a template in [docs/templates/](docs/templates/). Every file needs frontmatter
   with at least `title`, `category` and `tags`.
3. If you are vendoring someone else's skill, keep its LICENSE file next to `SKILL.md` and
   add an `upstream:` block (see any existing skill for the shape). Do not add personal
   contact details or credentials, even sample ones.
4. Run `cd site && npm run build:index` and commit the regenerated
   `site/api/prompt-index.json` with your change. CI fails if it is stale.

## Code

1. Work from `site/`: `npm install`, `npm run dev`.
2. `npm run lint` and the `npm run test:*` scripts must pass (`routes`, `my-library`,
   `read-only`, `prompt-content`, `markdown-file`, `safe-path`, `mcp`, and `browser`, which
   needs `npm run build` first and Chrome installed). All of them run in CI. If you touch the
   listing, the detail read or the ZIPs, compare `npm run bench` with
   [PERFORMANCE.md](docs/development/PERFORMANCE.md).
3. Strict TypeScript, no `any`. Prefer adding to `src/components/` or `src/hooks/` over
   growing `App.tsx`.
4. Parameterized SQL only. Never commit `.env*`.

## Pull requests

Branch from `main`, keep the PR to one change, and say what you tested. Content PRs and code
PRs should be separate. Everything is LF (`.gitattributes` enforces it).

By contributing you agree your code is licensed under [Apache-2.0](LICENSE) and that any
content you add is yours to publish or carries its own license and attribution.
