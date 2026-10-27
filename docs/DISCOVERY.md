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
| [danielmiessler/Fabric](https://github.com/danielmiessler/Fabric) | prompts | 44,440 | mit | 2026-10-26 | 2026-10-26 | done | 265 patterns → 4_Prompts/Fabric/<topic>/ (system.md verbatim, match: exact), Mike 2026-10-26 |
| [rockbenben/ChatGPT-Shortcut](https://github.com/rockbenben/ChatGPT-Shortcut) | prompts | 8,872 | mit | 2026-10-09 | 2026-10-26 | done | 119 English cards → 4_Prompts/ChatGPT_Shortcut/<tag>/; the 160 it took from Awesome ChatGPT left out, Mike 2026-10-26 |
| [mustvlad/ChatGPT-System-Prompts](https://github.com/mustvlad/ChatGPT-System-Prompts) | prompts | 1,228 | mit | 2024-12-11 | 2026-10-26 | done | 38 prompts → 4_Prompts/ChatGPT_System_Prompts/<group>/; 8 whose titles were already here left out, Mike 2026-10-26 |
| [microsoft/prompts-for-edu](https://github.com/microsoft/prompts-for-edu) | prompts | 1,887 | mit | 2024-04-05 | 2026-10-26 | done | 15 prompts → 4_Prompts/Microsoft_Prompts_For_Edu/<audience>/, Mike 2026-10-26 |
| [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | skills | 27,666 | mit | 2026-10-24 | 2026-10-26 | done | skill (scripts and templates included, i18n copies left) → 3_Skills/Development/Engineering/planning-with-files/, Mike 2026-10-26 |
| [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | skills | 27,391 | mit | 2026-10-16 | 2026-10-26 | done | 6 skills → 3_Skills/Business/Strategy/ (create-prd, pre-mortem, opportunity-solution-tree, north-star-metric, lean-canvas, strategy-red-team); 55 left, Mike 2026-10-26 |
| [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | mcp | 47,534 | mit | 2026-10-26 | 2026-10-26 | done | MCP card: 6_MCP_Servers/Developer_Tools/codebase-memory.md, Mike 2026-10-26 |
| [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) | skills | 53,545 | mit | 2026-10-19 | 2026-10-21 | done | 6 skills → 3_Skills/Data/ (scikit-learn, statsmodels, pymc, shap, seaborn, networkx); the other ~140 left, the science set is large |
| [morluto/rea](https://github.com/morluto/rea) | mcp | 356,277 | mit | 2026-10-21 | 2026-10-21 | done | MCP card: 6_MCP_Servers/Developer_Tools/rea.md |
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | skills | 86,994 | mit | 2026-10-21 | 2026-10-21 | done | SKILL.md + references/ → 3_Skills/Design/archify/ (bin, renderers and examples, 18 MB, left out) |
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | mcp | 208,240 | Other | 2026-10-21 | 2026-10-21 | reject | the n8n product, not content; the n8n-mcp card covers MCP |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | skills | 171,228 | mit | 2026-10-18 | 2026-10-21 | done | 6 skills → 3_Skills/Development/Engineering/ponytail* |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | skills | 109,256 | mit | 2026-10-13 | 2026-10-21 | done | 6 skills → 3_Skills/Development/Engineering/ (code-review-and-quality, spec-driven-development, incremental-implementation, security-and-hardening, context-engineering, doubt-driven-development); 19 left, 2026-10-26 |
| [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | skills | 105,594 | mit | 2026-10-21 | 2026-10-21 | reject | an agent-management app, not content |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | skills | 103,051 | apache-2.0 | 2026-10-21 | 2026-10-21 | reject | a design workspace app, not content |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | skills | 102,114 | apache-2.0 | 2026-10-21 | 2026-10-21 | link | a Claude Code memory plugin; a tool, nothing to vendor |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | skills | 100,436 | mit | 2026-10-20 | 2026-10-21 | done | SKILL.md + references/ → 3_Skills/Design/design-taste-frontend/ (its own name); assets, library JSON and scripts (2.4 MB) left out, 2026-10-26 |
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
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | skills | 59,437 | mit | 2026-10-21 | 2026-10-21 | done | SKILL.md + references/ + scripts/ → 3_Skills/Design/diagram-design/; the 150 example HTML files in assets/ (6 MB) left out, 2026-10-26 |
| [blader/humanizer](https://github.com/blader/humanizer) | skills | 59,217 | mit | 2026-10-16 | 2026-10-21 | done | it is the origin of the humanizer already in 3_Skills/Content/General/: re-pointed to blader/humanizer (match: exact) and updated to v3.1.0, 2026-10-26 |
| [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) | skills | 58,134 | mit | 2026-10-19 | 2026-10-21 | done | skill → 3_Skills/Content/General/i-have-adhd/, 2026-10-26 |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | skills | 56,185 | Other | 2026-10-21 | 2026-10-21 | link | curated Claude Code list (licence: other) |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | skills | 55,801 | mit | 2026-10-19 | 2026-10-21 | done | 6 skills → 3_Skills/Business/Marketing/ (cro, ab-testing, cold-email, marketing-psychology, onboarding, churn-prevention); 46 left, pricing skipped (Business/Strategy/pricing-strategy covers it), 2026-10-26 |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | mcp | 53,946 | apache-2.0 | 2026-10-21 | 2026-10-21 | done | MCP card: 6_MCP_Servers/Browser_Automation/chrome-devtools.md |
| [VoltAgent/awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) | skills | 53,256 | mit | 2026-10-19 | 2026-10-21 | link | OpenClaw skill list, 5,400+ entries |
| [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio) | skills | 52,833 | agpl-3.0 | 2026-10-21 | 2026-10-21 | reject | a desktop AI client (AGPL), not content |
| [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) | skills | 48,524 | mit | 2026-10-24 | 2026-10-26 | pending | new |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | skills | 48,335 | apache-2.0 | 2026-10-22 | 2026-10-26 | pending | new |
| [reactive-resume/reactive-resume](https://github.com/reactive-resume/reactive-resume) | skills | 44,893 | mit | 2026-10-26 | 2026-10-26 | pending | popular |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | skills | 36,392 | mit | 2026-10-25 | 2026-10-26 | pending | new |
| [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) | skills | 36,170 | mit | 2026-10-25 | 2026-10-26 | pending | new |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | skills | 32,776 | apache-2.0 | 2026-10-26 | 2026-10-26 | pending | popular |
| [mksglu/context-mode](https://github.com/mksglu/context-mode) | mcp | 32,391 | Other | 2026-10-26 | 2026-10-26 | pending | new |
| [feder-cr/invisible_dots](https://github.com/feder-cr/invisible_dots) | skills | 32,257 | mit | 2026-10-25 | 2026-10-26 | pending | popular |
| [oraios/serena](https://github.com/oraios/serena) | mcp | 30,733 | Other | 2026-10-26 | 2026-10-26 | pending | popular |
| [assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher) | mcp | 30,302 | apache-2.0 | 2026-10-10 | 2026-10-26 | pending | popular |
| [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) | skills | 26,977 | mit | 2026-09-10 | 2026-10-26 | pending | new |
| [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) | skills | 26,606 | mit | 2026-10-23 | 2026-10-26 | pending | new |
| [titanwings/distilly](https://github.com/titanwings/distilly) | skills | 26,048 | mit | 2026-10-13 | 2026-10-26 | pending | new |
| [activepieces/activepieces](https://github.com/activepieces/activepieces) | mcp | 25,236 | Other | 2026-10-26 | 2026-10-26 | pending | popular |
| [1Panel-dev/MaxKB](https://github.com/1Panel-dev/MaxKB) | mcp | 23,041 | gpl-3.0 | 2026-10-26 | 2026-10-26 | pending | popular |
| [modelscope/FunASR](https://github.com/modelscope/FunASR) | mcp | 20,827 | mit | 2026-10-22 | 2026-10-26 | pending | popular |
| [nukeop/nuclear](https://github.com/nukeop/nuclear) | mcp | 18,786 | agpl-3.0 | 2026-10-26 | 2026-10-26 | pending | popular |
| [latent-spaces/brag](https://github.com/latent-spaces/brag) | skills | 18,761 | mit | 2026-10-23 | 2026-10-26 | pending | new |
| [wanshuiyin/Auto-claude-code-research-in-sleep](https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep) | mcp | 18,111 | mit | 2026-10-24 | 2026-10-26 | pending | new |
| [microsoft/mcp-for-beginners](https://github.com/microsoft/mcp-for-beginners) | mcp | 17,516 | mit | 2026-10-25 | 2026-10-26 | pending | popular |
| [xerj-org/xerj](https://github.com/xerj-org/xerj) | mcp | 16,760 | apache-2.0 | 2026-10-26 | 2026-10-26 | pending | new |
| [triggerdotdev/trigger.dev](https://github.com/triggerdotdev/trigger.dev) | mcp | 16,621 | apache-2.0 | 2026-10-26 | 2026-10-26 | pending | popular |
| [xpzouying/xiaohongshu-mcp](https://github.com/xpzouying/xiaohongshu-mcp) | mcp | 16,583 | apache-2.0 | 2026-10-26 | 2026-10-26 | pending | popular |
| [budtmo/docker-android](https://github.com/budtmo/docker-android) | mcp | 16,040 | Other | 2026-10-26 | 2026-10-26 | pending | popular |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | skills | 15,573 | none | 2026-04-28 | 2026-10-26 | pending | popular; no licence, ask before vendoring |
| [yusufkaraaslan/Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers) | skills | 15,235 | mit | 2026-09-30 | 2026-10-27 | pending | popular |
| [nidhinjs/prompt-master](https://github.com/nidhinjs/prompt-master) | skills | 15,148 | mit | 2026-10-22 | 2026-10-27 | pending | new |
| [NevaMind-AI/memU](https://github.com/NevaMind-AI/memU) | skills | 14,567 | Other | 2026-10-27 | 2026-10-27 | pending | popular |
| [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | skills | 14,059 | apache-2.0 | 2026-10-17 | 2026-10-27 | pending | new |
| [YouMind-OpenLab/awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts) | prompts | 13,696 | Other | 2026-10-27 | 2026-10-27 | pending | new |
| [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts) | prompts | 13,014 | mit | 2026-10-26 | 2026-10-27 | pending | new |
| [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | skills | 12,085 | mit | 2026-10-26 | 2026-10-27 | pending | popular |
| [BehiSecc/awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills) | skills | 10,314 | none | 2026-09-21 | 2026-10-27 | pending | popular; no licence, ask before vendoring |
| [YouMind-OpenLab/awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2) | prompts | 10,183 | Other | 2026-10-27 | 2026-10-27 | pending | new |
| [SnailSploit/Claude-Red](https://github.com/SnailSploit/Claude-Red) | skills | 9,598 | mit | 2026-10-12 | 2026-10-27 | pending | new |
| [nexu-io/html-anything](https://github.com/nexu-io/html-anything) | skills | 9,263 | apache-2.0 | 2026-10-13 | 2026-10-27 | pending | new |
| [anbeime/skill](https://github.com/anbeime/skill) | skills | 8,766 | none | 2026-10-27 | 2026-10-27 | pending | new; no licence, ask before vendoring |
| [zenstory-ai/oh-story-claudecode](https://github.com/zenstory-ai/oh-story-claudecode) | skills | 8,055 | mit | 2026-10-26 | 2026-10-27 | pending | new |
| [WenyuChiou/awesome-agentic-ai-zh](https://github.com/WenyuChiou/awesome-agentic-ai-zh) | skills | 8,038 | mit | 2026-10-27 | 2026-10-27 | pending | new |
| [SawyerHood/dev-browser](https://github.com/SawyerHood/dev-browser) | skills | 6,704 | mit | 2026-10-18 | 2026-10-27 | pending | new |
| [joeseesun/qiaomu-anything-to-notebooklm](https://github.com/joeseesun/qiaomu-anything-to-notebooklm) | skills | 6,418 | mit | 2026-10-22 | 2026-10-27 | pending | new |
| [Jakeschincariol/replica-skill](https://github.com/Jakeschincariol/replica-skill) | skills | 5,989 | mit | 2026-10-03 | 2026-10-27 | pending | new |
| [irinabuht12-oss/marketing-skills](https://github.com/irinabuht12-oss/marketing-skills) | skills | 5,928 | none | 2026-10-27 | 2026-10-27 | pending | new; no licence, ask before vendoring |
| [langgptai/awesome-claude-prompts](https://github.com/langgptai/awesome-claude-prompts) | prompts | 5,551 | none | 2026-10-15 | 2026-10-27 | pending | popular; no licence, ask before vendoring |
| [sergebulaev/linkedin-skills](https://github.com/sergebulaev/linkedin-skills) | skills | 5,251 | mit | 2026-10-27 | 2026-10-27 | pending | new |
| [gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) | skills | 5,062 | apache-2.0 | 2026-10-24 | 2026-10-27 | pending | new |
| [jherrodthomas/automotive-skills-suite](https://github.com/jherrodthomas/automotive-skills-suite) | skills | 3,326 | mit | 2026-10-16 | 2026-10-27 | pending | new |
| [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) | skills | 3,299 | mit | 2026-09-13 | 2026-10-27 | pending | new |
| [Jakeschincariol/youtube-agent-skill](https://github.com/Jakeschincariol/youtube-agent-skill) | skills | 3,290 | mit | 2026-09-16 | 2026-10-27 | pending | new |
| [yaojingang/yao-open-prompts](https://github.com/yaojingang/yao-open-prompts) | prompts | 2,953 | Other | 2026-10-08 | 2026-10-27 | pending | new |
<!-- discover-repos: new rows go above this line -->
