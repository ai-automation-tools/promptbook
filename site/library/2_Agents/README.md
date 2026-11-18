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
| `Development/Backend/` | 49 | Language and framework specialists |
| `Development/` | 6 | Refactoring, TDD, git workflow, cloud, Python, React |
| `AI_ML/MCP/` | 8 | MCP server builders and reviewers |
| `AI_ML/Other/` | 8 | ADRs, model evaluation, assorted AI engineering |
| `AI_ML/AI_Engineering_SMEs/` | 5 | AI engineering specialists |
| `AI_ML/Data_SMEs/`, `Power-BI/`, `Prompting/` | 6 | Data, BI and prompt engineering |
| `Content/` | 3 | Blog writer, copyeditor, social media manager |
| `Business/` | 1 | SEO optimization |
| **Total** | **86** | |

## Provenance

Every file carries an `upstream:` block (`scripts/attribute-upstream.mjs --agents`): 71 `exact`,
6 `similar`, 9 `unknown` (our own). Sources: `VoltAgent/awesome-claude-code-subagents` (36),
`davila7/claude-code-templates` (22), `github/awesome-copilot` (17), `wshobson/agents` (2). The
Monday drift check compares the `exact` and `similar` ones with their upstream and the Saturday
roadmap job resyncs drifted ones (`scripts/resync-upstream.mjs 2_Agents/<path>`).

## Adding one

The Thursday agents finder (`promptbook-find-agents`) adds 3–5 trending ones a run from permissively licensed repos. By hand:
copy the file, keep its frontmatter, run `node scripts/attribute-upstream.mjs --agents --write`
and `node scripts/backfill-tags.mjs --write` from the repo root, then rebuild the index.
