# 1_Guides

Guides to AI coding agents, IDE assistants, CLI tools and model APIs. Every guide names the
GitHub repo of the tool it documents in a `repo:` frontmatter line, and the item page shows
that repo at the top; `scripts/upstream.test.mjs` fails CI on a guide without one.

```
1_Guides/
├── Claude_Code/       # anthropics/claude-code
├── Codex/             # openai/codex
├── Gemini_CLI/        # google-gemini/gemini-cli
├── CLI_Tools/         # Aider, Fabric, Ollama, OpenHands, SWE-agent, n8n, yt-dlp, …
├── IDE_Extensions/    # Cursor, Cline, Continue, Roo Code, Zed, VS Code, Neovim, …
└── API_Providers/     # the vendors' SDK repos (OpenAI, Anthropic, Cohere, Groq, xAI, …)
```

The guides with no public repo behind them (the `Concepts/` pages, hand-written agent
configs, Windsurf, JetBrains AI Assistant, Supermaven, Cody, Kite, Docker AI, OpenClaw) were
moved to `archive/unlinked-2026-10-26/1_Guides/` at the repo root on 2026-10-26. See
`archive/README.md` to bring one back.

## Adding a guide

1. Use `docs/templates/agent-guides-template.md`: frontmatter with `title`, `tags`,
   `category: "Agent_Guides"`, `subcategory` (the folder) and `repo: owner/name`.
2. Check the repo exists (`gh api repos/owner/name`) and use the name GitHub reports.
3. Run `npm run build:index` from `site/` and commit `api/prompt-index.json` with it.
