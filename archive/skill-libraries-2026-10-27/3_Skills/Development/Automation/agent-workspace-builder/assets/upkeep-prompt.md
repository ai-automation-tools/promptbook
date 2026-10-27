# Weekly upkeep: ⟨workspace⟩ (`⟨owner/repo⟩`)

You are running unattended, once a week, on an agent workspace. Nobody will answer questions
mid-run. Keep everything the workspace already has accurate and current, and propose (never
install) what it should gain. Ship **one pull request**, or none if nothing changed.

## This workspace

- **Field:** ⟨one line⟩
- **Sources to watch:** ⟨vendor advisories, changelogs, standards bodies, regulators: URLs⟩
- **Intel files** (in `docs/intel/`): ⟨file → what it holds⟩
- **Hold paths:** `.claude/settings.json`, `.claude/hooks/`, `.mcp.json` ⟨plus any data file⟩.
  Edit one only when this week's intel shows it's wrong, never to widen permissions, and list
  it under `Touches a hold path:` in the PR body.
- **Hard rules:** ⟨field-specific: e.g. defense only, no exploit code; no figures from memory⟩

## Scope

You may write: the intel files and `docs/intel/README.md` + `archive/`; `skills/`;
`.claude/skills/`, `agents/`, `commands/`, `rules/`; `docs/reference/RESOURCES.md`;
`docs/reference/CAPABILITIES.md` (regenerate only); new `- [ ]` items under `### 🔭 Later` in
`docs/ROADMAP.md`; one `docs/CHANGELOG.md` entry; broken relative links anywhere.
Never touch AGENTS.md, CLAUDE.md, README.md, code, scripts, tests, `.github/`, existing
roadmap items, or the work folders. Commit each part separately; write messages to a file.

## 1. Intel

Read AGENTS.md and every intel file; the newest `Retrieved` date is where you start (30 days
back if empty). Search for what changed since, primary sources first. Every entry cites a URL
you fetched this run and that says what the entry says. Record only what changes how this
workspace's agents work. Entry shape: `## <date>: <headline>` with **What**, **Why it matters
here**, **Source** (URL, retrieved date). Update an entry rather than duplicate it; move
entries older than 90 days to `docs/intel/archive/<yyyy>-Q<n>.md`. Keep a candidates list of
tools, MCP servers, skills and guides you meet; parts 4 and 5 use it.

## 2. Portable skills (`skills/`)

Pass A, every skill: does any intel since it last changed make it wrong? Fix it. Pass B, the
rotation skill (oldest last commit; ties alphabetical): check every tool, flag, version and URL
against upstream docs, and that its steps work today. Fix what you can verify; if nothing,
list the checks that passed. Never delete or rename a skill. No change without a source or
repo fact behind it.

## 3. Wired config (`.claude/`)

The same two passes over `.claude/skills/`, `agents/`, `commands/` and `rules/`; the
rotation item is the file with the oldest last commit across all four. Keep frontmatter
valid. Never delete or rename an item, and never add a write tool to an agent or command:
that widens permissions, so it's a part-5 proposal. If anything in `.claude/` or `skills/`
changed, regenerate CAPABILITIES with the workspace's generator and the other CLIs' config
with `python scripts/gen-vendor-configs.py`; never edit `.agents/`, `.codex/` or
`docs/reference/OTHER-CLIS.md` by hand.

## 4. Resources (`docs/reference/RESOURCES.md`)

Re-open every link (or the oldest-verified third of a long list): working and accurate gets
today's date; drifted descriptions get fixed; dead or superseded rows move to `🪦 Retired`
with a reason. Add up to five new rows from your candidates and a short targeted search, each
opened this run and scoring well on relevance, maintenance (activity in the last 12 months),
trust (first-party or known author) and licence. Never a download or install-script link,
never anything in Retired. Keep the list around 60 rows. Bump `Last updated:`.

## 5. Proposals and checks

Anything worth wiring in (an MCP server, a published skill to adopt, a permission change, a
gap no skill covers) becomes one `- [ ]` item under `### 🔭 Later` with its source link and
`(proposed by upkeep <date>)`; at most three, no duplicates, never install or run it.
Never tag a proposal `🔒`: the roadmap job decides it by default unless it's money,
credentials, going public, an outward action or a permission change. Add one
CHANGELOG entry. Run `check-structure.py`, `validate-skills.py --strict`, the capability
generator's `--check`, `check-links.py` and `gen-vendor-configs.py --check`. A failure your change caused that you can't fix
means no PR for that part: revert it and say why.

## 6. Ship

If no part changed anything, open no PR and report what you checked. Otherwise push the run's
branch and open one PR against ⟨deploy-branch⟩. If last week's upkeep PR is still open, read
its comments first, commit on top and comment instead of opening a second one.

PR body: **Intel** (each entry + source; what you left out), **Skills** (`Rotation: <skill>
(last changed <date>): <changed | no change: checks>` then other changes), **Wired config**
(same shape), **Resources** (added with why, retired with why, re-verified count),
**Proposals**, **Checks** (each with its result), `Touches a hold path:` (files or `none`).

Don't merge. Don't push to ⟨deploy-branch⟩.
