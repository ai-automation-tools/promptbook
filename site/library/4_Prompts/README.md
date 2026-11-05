# 4_Prompts

Prompts copied from public collections, one markdown file each. Every file names the
collection it came from in an `upstream:` block, and the item page shows that repo at the
top; `scripts/upstream.test.mjs` fails CI on a prompt without one.

```
4_Prompts/
├── Awesome_ChatGPT/General/       # f/prompts.chat (was f/awesome-chatgpt-prompts), 1,353 prompts, frozen
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

## Awesome ChatGPT is a frozen capture

`Awesome_ChatGPT/` is a dated snapshot of one upstream corpus, not a mirror, and nothing
resyncs it (Mike's decision, 2026-11-05).

- **Upstream:** [`f/prompts.chat`](https://github.com/f/prompts.chat), renamed from
  `f/awesome-chatgpt-prompts`. CC0 prompt content, MIT code.
- **Captured:** the corpus came in as two bulk files on 2026-03-13 and was split into 1,349
  files on 2026-08-27 (commit `4d692924`). Four prompts copied individually later (2026-10-26
  and 2026-11-02) sit beside them, each with its own `checked:` date.
- **What frozen means:** no scheduled resync, and the drift check
  (`scripts/check-upstream-drift.mjs`, which walks only `2_Agents`, `3_Skills` and
  `5_System_Prompts`) does not read it. Bodies are never edited to match upstream. The
  Prompts & Agents Refresh still checks that the repo exists and follows a rename in
  `upstream.repo`; that is attribution, not content. Resyncing would need a drift check that
  reads upstream's single `prompts.csv`; that is a new decision for Mike, not a fix.

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
