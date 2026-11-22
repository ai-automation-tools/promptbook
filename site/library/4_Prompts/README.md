# 4_Prompts

Prompts copied from public collections, one markdown file each. Every file names the
collection it came from in an `upstream:` block, and the item page shows that repo at the
top; `scripts/upstream.test.mjs` fails CI on a prompt without one.

```
4_Prompts/
├── Fabric/<Topic>/                # danielmiessler/Fabric patterns, 265 prompts (match: exact)
├── ChatGPT_Shortcut/<Tag>/        # rockbenben/ChatGPT-Shortcut, 119 prompts
├── ChatGPT_System_Prompts/<Group>/  # mustvlad/ChatGPT-System-Prompts, 38 prompts
├── Microsoft_Prompts_For_Edu/<Audience>/  # microsoft/prompts-for-edu, 15 prompts
├── Microsoft_Copilot_Prompts/<Topic>/     # pnp/copilot-prompts, 4 prompts
├── Claude_Cookbooks/<Topic>/              # anthropics/claude-cookbooks, 12 prompts
├── OpenAI_Cookbook/<Topic>/               # openai/openai-cookbook, 9 prompts
├── Claude_Plugins_Official/<Topic>/       # anthropics/claude-plugins-official, 4 command prompts (Apache-2.0)
├── Gemini_CLI/<Topic>/                    # google-gemini/gemini-cli, 6 command prompts (Apache-2.0)
├── Gemini_CLI_Action/<Topic>/             # google-github-actions/run-gemini-cli, 5 prompts (Apache-2.0)
├── Anthropic_Quickstarts/<Topic>/         # anthropics/claude-quickstarts, 5 agent prompts
└── Claude_Code_Action/<Topic>/            # anthropics/claude-code-action, 1 command prompt
```

One top-level folder per collection, then the collection's own grouping. Every collection is
MIT (Claude_Plugins_Official, Gemini_CLI and Gemini_CLI_Action are Apache-2.0); `NOTICE` at the repo root carries each licence. A Fabric file
is the pattern's `system.md` byte for byte, so the weekly drift resync keeps it current; the
others were reshaped from JSON or Markdown sections and are `match: similar`. ChatGPT-Shortcut
cards that it copied from Awesome ChatGPT, and any prompt whose title is already here, were
left out when it was imported.

## Awesome ChatGPT was removed

`Awesome_ChatGPT/General/` (1,353 prompts from `f/prompts.chat`, formerly
`f/awesome-chatgpt-prompts`) was deleted on 2026-11-05 at Mike's request; it is not archived.
Don't re-create the folder or copy prompts from that collection back in. Git history has it if
it is ever wanted again.

The hand-written categories that used to live here (AI_ML, Business, Content, Engineering,
Finance, Media, …) named no repo; they were archived on 2026-10-26 and removed on 2026-11-22, and are in git
history at `86ff6925` (`archive/unlinked-2026-10-26/4_Prompts/`). See `archive/README.md` to bring
one back.

## Adding prompts

1. Copy the prompt from a public collection; do not write one here.
2. Use `docs/templates/prompt-library-template.md`: frontmatter with `title`, `tags`,
   `category`, `subcategory` and the `upstream:` block (`match`, `repo`, `checked`).
3. Keep the collection's attribution line at the end of the body.
4. Run `npm run build:index` from `site/` and commit `api/prompt-index.json` with it.
