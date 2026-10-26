# Discovery ledger

GitHub repos that `scripts/discover-repos.mjs` found and that the library might vendor or link:
skills, prompt collections, agent definitions and MCP servers that are **new** (created in the
last year with 500+ stars) or **popular** (5000+ stars) and that nothing here already tracks.
The weekly **Prompt-Library Discovery** job (`jobs\promptbook-discovery` in the Routines
fleet, Tuesdays) appends rows and opens a `discovery/auto-*` PR; a person changes **Status**.

| Status | Meaning | Who acts |
|:---|:---|:---|
| `pending` | Found, not decided | Mike |
| `accept` | Vendor its content with provenance (or, for `mcp`, write a card) | the Catalog Refresh job |
| `link` | Worth a Resources-menu link, nothing to vendor | `discover-repos.mjs --write` |
| `reject` | Not for this library (stays here so it is not found again) | nobody |
| `done` | Content vendored, or an MCP card written; the catalog job sets this | nobody |

Rules the catalog job follows on an `accept` row: read the licence that run (a row that says
`none` is never vendored, only linked); copy at most 6 files per repo per run, each with an
`upstream:` block (`repo`, `path`, `ref`, `checked`, `match: exact`) and `tags`; skills go to
`3_Skills/<Category>/<Sub>/`, prompts to `4_Prompts/`, agent definitions to `2_Agents/`, in the
neighbours' format. An `mcp` row becomes one card in `site/library/6_MCP_Servers/`, written from
`docs/templates/mcp-servers-template.md` with install lines read from its README that run. Then
set the row to `done` and note what was taken.

First triage, 2026-10-21: the 25 rows of the first run plus the three seed rows. Skills
collections with a licence were accepted, apps and agent harnesses rejected, licence-less or
tool-only lists linked, and three MCP servers written up straight away.

Columns: repo, kind (`skills` / `prompts` / `agents` / `mcp`), stars when found, licence key,
last push, date found, status, note. Newest rows at the top. The script dedupes on the repo
column, so never delete a row: change its status instead.

| Repo | Kind | Stars | Licence | Pushed | Found | Status | Note |
|:---|:---|---:|:---|:---|:---|:---|:---|
| [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) | skills | 53,545 | mit | 2026-10-19 | 2026-10-21 | done | 6 skills → 3_Skills/Data/ (scikit-learn, statsmodels, pymc, shap, seaborn, networkx); the other ~140 left, the science set is large |
| [morluto/rea](https://github.com/morluto/rea) | mcp | 356,277 | mit | 2026-10-21 | 2026-10-21 | done | MCP card: 6_MCP_Servers/Developer_Tools/rea.md |
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | skills | 86,994 | mit | 2026-10-21 | 2026-10-21 | done | SKILL.md + references/ → 3_Skills/Design/archify/ (bin, renderers and examples, 18 MB, left out) |
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | mcp | 208,240 | Other | 2026-10-21 | 2026-10-21 | reject | the n8n product, not content; the n8n-mcp card covers MCP |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | skills | 171,228 | mit | 2026-10-18 | 2026-10-21 | done | 6 skills → 3_Skills/Development/Engineering/ponytail* |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | skills | 109,256 | mit | 2026-10-13 | 2026-10-21 | accept | engineering skills; dedupe by purpose |
| [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | skills | 105,594 | mit | 2026-10-21 | 2026-10-21 | reject | an agent-management app, not content |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | skills | 103,051 | apache-2.0 | 2026-10-21 | 2026-10-21 | reject | a design workspace app, not content |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | skills | 102,114 | apache-2.0 | 2026-10-21 | 2026-10-21 | link | a Claude Code memory plugin; a tool, nothing to vendor |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | skills | 100,436 | mit | 2026-10-20 | 2026-10-21 | accept | frontend taste skill |
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | mcp | 96,708 | mit | 2026-10-18 | 2026-10-21 | link | the largest MCP server list; source for future cards |
| [koala73/worldmonitor](https://github.com/koala73/worldmonitor) | mcp | 89,074 | agpl-3.0 | 2026-10-21 | 2026-10-21 | reject | an AGPL dashboard app, not content |
| [D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) | mcp | 89,018 | bsd-3-clause | 2026-10-21 | 2026-10-21 | reject | its MCP server is pitched on CAPTCHA and Cloudflare bypass |
| [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | mcp | 78,157 | mit | 2026-10-21 | 2026-10-21 | reject | an agent harness, not content |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | skills | 77,604 | none | 2026-09-18 | 2026-10-21 | link | popular skill list with no licence; link only |
| [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) | skills | 70,244 | Other | 2026-10-21 | 2026-10-21 | reject | an agent harness with an unclear licence |
| [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | prompts | 69,995 | cc0-1.0 | 2026-10-19 | 2026-10-21 | reject | leaked prompts are never vendored (catalog rule); filter fixed the same day |
| [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) | agents | 67,877 | mit | 2026-10-21 | 2026-10-21 | link | Claude Code practice notes; overlaps 1_Guides |
| [upstash/context7](https://github.com/upstash/context7) | mcp | 63,434 | mit | 2026-10-21 | 2026-10-21 | done | MCP card: 6_MCP_Servers/Developer_Tools/context7.md |
| [sansan0/TrendRadar](https://github.com/sansan0/TrendRadar) | mcp | 63,079 | gpl-3.0 | 2026-10-20 | 2026-10-21 | reject | a GPL news-monitoring app, not content |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | skills | 59,437 | mit | 2026-10-21 | 2026-10-21 | accept | diagram design skill |
| [blader/humanizer](https://github.com/blader/humanizer) | skills | 59,217 | mit | 2026-10-16 | 2026-10-21 | accept | writing skill; check overlap with existing humanizer passes |
| [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) | skills | 58,134 | mit | 2026-10-19 | 2026-10-21 | accept | output-format skill |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | skills | 56,185 | Other | 2026-10-21 | 2026-10-21 | link | curated Claude Code list (licence: other) |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | skills | 55,801 | mit | 2026-10-19 | 2026-10-21 | accept | marketing skills; dedupe against 3_Skills/Business/Marketing |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | mcp | 53,946 | apache-2.0 | 2026-10-21 | 2026-10-21 | done | MCP card: 6_MCP_Servers/Browser_Automation/chrome-devtools.md |
| [VoltAgent/awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) | skills | 53,256 | mit | 2026-10-19 | 2026-10-21 | link | OpenClaw skill list, 5,400+ entries |
| [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio) | skills | 52,833 | agpl-3.0 | 2026-10-21 | 2026-10-21 | reject | a desktop AI client (AGPL), not content |
<!-- discover-repos: new rows go above this line -->
