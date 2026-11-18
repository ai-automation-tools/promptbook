# 5_System_Prompts

System prompts that AI vendors publish themselves, copied verbatim, one dated capture per file.

**Vendor-published only** (Mike, 2026-11-18). A file comes from the vendor's own page
(`upstream: { match: vendor, url, retrieved }`, Anthropic's system-prompt release notes) or the
vendor's own repo (an open-source agent's prompt file, `upstream: { repo, path, ref }`). Never a
leaked, extracted or jailbroken prompt, and never a collection of them. Until 2026-11-18 most of
this section came from such collections; the 136 files they sourced were re-sourced from
Anthropic's pages where Anthropic publishes the prompt and otherwise archived, with their paths,
in [`archive/leaked-sources-2026-11-18/`](../../../archive/README.md). `scripts/upstream.test.mjs`
fails CI on an item that names one of those collections.

## What's here

| Folder | Files | Source |
|:---|---:|:---|
| `Anthropic/` | 25 | Anthropic's [system-prompt release notes](https://platform.claude.com/docs/en/release-notes/system-prompts) (Claude 3 through Fable 5.2), the tool-use prompt template from its docs, and the computer-use demo's prompt from `anthropics/claude-quickstarts` |
| `OpenAI/` | 5 | `openai/codex`: the Codex CLI's prompt files for GPT-5 models |
| `OpenCode/` | 5 | `anomalyco/opencode`: its per-model prompt files |
| `Goose/` | 2 | `aaif-goose/goose`: main agent and subagent |
| `Mistral/` | 1 | `mistralai/mistral-vibe`: the Vibe CLI |
| `HuggingFace/` | 1 | `huggingface/smolagents`: the CodeAgent prompt |

39 files on 2026-11-18.

## How it grows and stays current

- **New prompts:** the monthly `promptbook-find-system-prompts` job (first Sunday) adds up to 4
  that vendors have published since the newest file in their folder. A new vendor gets a folder
  and a row above.
- **Drift:** the Monday `upstream-drift.yml` report marks a file `behind` or `drifted` against its
  source; the Monthly Upkeep re-reads that source and updates the body verbatim. A newer version
  of a prompt is a new file, so the dated capture stays.
- **By hand:** copy from `docs/templates/system-prompts-template.md`, then
  `cd site && npm run build:index`.

Release-notes pages mark text that changed between versions with `**`; the copies keep those
marks, as the page shows them.
