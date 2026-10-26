# 4_Prompts

Prompts copied from public collections, one markdown file each. Every file names the
collection it came from in an `upstream:` block, and the item page shows that repo at the
top; `scripts/upstream.test.mjs` fails CI on a prompt without one.

```
4_Prompts/
├── Awesome_ChatGPT/General/       # f/awesome-chatgpt-prompts, 1,349 prompts
├── Fabric/<Topic>/                # danielmiessler/Fabric patterns, 265 prompts (match: exact)
├── ChatGPT_Shortcut/<Tag>/        # rockbenben/ChatGPT-Shortcut, 119 prompts
├── ChatGPT_System_Prompts/<Group>/  # mustvlad/ChatGPT-System-Prompts, 38 prompts
└── Microsoft_Prompts_For_Edu/<Audience>/  # microsoft/prompts-for-edu, 15 prompts
```

One top-level folder per collection, then the collection's own grouping. Every collection is
MIT (CC0 for Awesome ChatGPT); `NOTICE` at the repo root carries each licence. A Fabric file
is the pattern's `system.md` byte for byte, so the weekly drift resync keeps it current; the
others were reshaped from JSON or Markdown sections and are `match: similar`. ChatGPT-Shortcut
cards that it copied from Awesome ChatGPT, and any prompt whose title is already here, were
left out.

The hand-written categories that used to live here (AI_ML, Business, Content, Engineering,
Finance, Media, …) named no repo and were moved, paths intact, to
`archive/unlinked-2026-10-26/4_Prompts/` at the repo root on 2026-10-26. See
`archive/README.md` to bring one back.

## Adding prompts

1. Copy the prompt from a public collection; do not write one here.
2. Use `docs/templates/prompt-library-template.md`: frontmatter with `title`, `tags`,
   `category`, `subcategory` and the `upstream:` block (`match`, `repo`, `checked`).
3. Keep the collection's attribution line at the end of the body.
4. Run `npm run build:index` from `site/` and commit `api/prompt-index.json` with it.
