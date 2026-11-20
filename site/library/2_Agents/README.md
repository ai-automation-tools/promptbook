# 2_Agents: subagent definitions

Installable agent definitions in the Claude Code subagent shape: a markdown file whose
frontmatter carries `name:` and `description:` (and usually `tools:` and `model:`), followed by
the agent's system prompt. Drop one into `.claude/agents/` and it loads.

Since 2026-10-21 this section holds **only** real definitions. The 456 role-play and
"act as X" prompts that used to live here were removed (git history keeps them); a prompt that
is not an installable agent belongs in `4_Prompts`.

## What is here

| Folder | Files | What |
|:---|---:|:---|
| `Development/Backend/` | 50 | Language and framework specialists, backend architecture |
| `Development/` | 9 | Refactoring, code exploration and architecture, git workflow, planning, docs-drift edits |
| `DevOps/` | 9 | Kubernetes, Terraform, Docker, CI, observability, incident response, SRE, platform, chaos |
| `Quality/` | 13 | Test, QA, accessibility, security, debugging, performance and code-review analysers |
| `Modernization/` | 2 | Legacy-code analysis and business-rule extraction |
| `Product/` | 2 | Product management and UX research |
| `AI_ML/MCP/` | 8 | MCP server builders and reviewers |
| `AI_ML/Other/` | 10 | ADRs, model evaluation, agent and plugin authoring, assorted AI engineering |
| `AI_ML/AI_Engineering_SMEs/` | 6 | AI engineering specialists |
| `AI_ML/Data_SMEs/`, `Power-BI/`, `Prompting/` | 7 | Data, PostgreSQL, BI and prompt engineering |
| **Total** | **116** | |

## Provenance

Every file carries an `upstream:` block (`scripts/attribute-upstream.mjs --agents`); nearly all are
`exact` copies, a few `similar`, and a few `unknown` (our own). Sources:
`VoltAgent/awesome-claude-code-subagents` (46), `wshobson/agents` (13),
`anthropics/claude-plugins-official` (11), `davila7/claude-code-templates` (22),
`github/awesome-copilot` (17), `affaan-m/everything-claude-code` (4), `0xfurai/claude-code-subagents` (3). The
Monday drift check compares the `exact` and `similar` ones with their upstream and the Saturday
roadmap job resyncs drifted ones (`scripts/resync-upstream.mjs 2_Agents/<path>`).

## Adding one

The Thursday agents finder (`promptbook-find-agents`) adds 3–5 trending ones a run from permissively licensed repos. By hand:
copy the file, keep its frontmatter, run `node scripts/attribute-upstream.mjs --agents --write`
and `node scripts/backfill-tags.mjs --write` from the repo root, then rebuild the index.
