# 4_Prompts

Prompts copied from public collections, one markdown file each. Every file names the
collection it came from in an `upstream:` block, and the item page shows that repo at the
top; `scripts/upstream.test.mjs` fails CI on a prompt without one.

```
4_Prompts/
└── Awesome_ChatGPT/General/   # f/awesome-chatgpt-prompts, 1,349 prompts
```

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
