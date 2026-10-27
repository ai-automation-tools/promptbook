---
title: "✍️ news-images"
name: news-images
description: Generate cartoon-editorial news imagery — daily, weekly, monthly, and yearly news collages (6-panel grids) and news montages (single unified scenes). Use when asked to make, create, or generate a news collage or news montage for any cadence, or to build a daily/weekly/monthly/yearly news image. Handles story research, layout, and image generation.
tags: ["skill","content","image-generation","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/core/image-gen/news-images/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# News Images

This skill generates **eight** news-image variants. Each turns recent major **U.S.** news into bright cartoon-editorial imagery. Its job is **generation** — research the stories, lay out the image, and produce the PNG. It is self-contained and not tied to any repository or automation pipeline.

There are two shapes and four cadences → an 8-cell matrix. Pick the one the user asked for and follow its prompt file under [`prompts/`](prompts/) exactly.

## The two shapes

| Shape | Layout | Canvas | Look |
|:------|:-------|:-------|:-----|
| **Collage** | 6 equal **square panels**, 3 rows × 2 columns, clean borders between panels | **1024 × 1536** (portrait, 2:3) | One story per panel; each panel a self-contained mini-scene with its own embedded caption. |
| **Montage** | **One continuous unified scene** — no grid, no boxes, no panel borders | **1536 × 1024** (landscape, 3:2) | All stories woven into a single environment (chaotic newsroom, command center, map table, city square, front page come to life). |

## The 8 variants — pick one

| Cadence | Period covered | **Collage** (portrait grid) | **Montage** (landscape scene) |
|:--------|:---------------|:----------------------------|:------------------------------|
| **Daily** | yesterday | [`prompts/daily-collage.md`](prompts/daily-collage.md) | [`prompts/daily-montage.md`](prompts/daily-montage.md) |
| **Weekly** | previous completed Mon–Sun week | [`prompts/weekly-collage.md`](prompts/weekly-collage.md) | [`prompts/weekly-montage.md`](prompts/weekly-montage.md) |
| **Monthly** | previous calendar month | [`prompts/monthly-collage.md`](prompts/monthly-collage.md) | [`prompts/monthly-montage.md`](prompts/monthly-montage.md) |
| **Yearly** | previous calendar year | [`prompts/yearly-collage.md`](prompts/yearly-collage.md) | [`prompts/yearly-montage.md`](prompts/yearly-montage.md) |

**Disambiguation:** if the user says "collage" → grid variant; "montage" → scene variant. If they say only "news image" for a cadence, ask which shape. Always confirm the **period** resolves to an absolute date range before generating.

## How to run a variant

1. **Resolve the period** to exact absolute dates in the user's locale (yesterday's date, the completed week's Mon–Sun range, last month, or last full calendar year). Use those exact dates for the whole run — never a relative phrase.
2. **Research the stories** with web search — the number and selection rules are in each prompt file.
3. **Read the prompt file** for the chosen variant and follow its Layout and Timestamp/Title sections precisely.
4. **Generate the image** at the exact canvas size (no extra height/footer/poster stretch).
5. **Save** the PNG using that variant's filename convention (see *Output* below).

The prompt files hold only what differs per variant. Everything below applies to **all eight** — read it once, apply it every run.

---

## Shared conventions (apply to every variant)

### Visual style
- Cartoon / editorial comic style; bright colors, bold outlines.
- Expressive characters and dramatic facial expressions; modern polished digital illustration.
- Satirical, energetic, fun, and still informative.
- Highly detailed but readable at a glance / at normal viewing size.

### Real-person safety (non-negotiable)
- **Never** render a recognizable face, portrait, caricature, lookalike, or physical likeness of any real living person (politicians, athletes, celebrities, private individuals).
- Depict people-driven stories through **symbolic** elements: generic cartoon figures, silhouettes, back-of-head views, hands, crowds, labeled podiums, courthouse sketches, ballot maps, policy documents, agency seals, sports scoreboards, press microphones, motorcade silhouettes, newspaper headlines, buildings, vehicles, screens.
- Real **names are allowed as in-world text** (on signs, documents, screens, placards, headlines, scoreboards, maps, labels) when needed for news clarity — but the **visual depiction must stay non-likeness**.

### Embedded text rules
- Embed short readable labels **naturally into the scene** — never a separate bottom caption bar or a row of boxed captions.
- Good carriers: document headline, protest sign, warning placard, courtroom exhibit, podium sign, scoreboard, map label, newspaper front page, computer screen, ticker board, product label, agency seal, building signage.
- **Collages:** 3–8 words per panel, one contextual caption per panel. **Montages:** 2–8 words per label, several woven through the scene.
- **Do not number** panels or stories (no `1.`, `2.`, …). Keep text high-contrast, correctly spelled, large enough to read.
- Labels must name the specific story (person/org/event/policy/place/team/company). **Avoid** vague tags like "Breaking News", "Politics", "Technology" unless paired with specific context.
- Don't let text cover important faces, symbols, or action.

### Story categories to span
Politics · Economy · Weather · Technology · Crime/legal · Sports · Health · National events · Major cultural stories. Choose nationally relevant, visually distinct stories; for multi-day periods prefer recurring/consequential stories over one-off minor updates.

### Image generation
Prefer the `nanobanana` MCP tool (Gemini image, 4K, subject consistency) or another available image generator. Always request the exact pixel dimensions for the shape and forbid extra canvas height, extended footers, or poster stretching.

### Output
- Save the finished PNG to the location the user specifies. If none is given, save to the current working directory and report the full path.
- Use the filename convention in each prompt's *Save* section (it encodes the variant and period, e.g. `Daily-News-Collage_7-6-26.png`).
- **Optional:** if the user wants a companion metadata note, write a Markdown file with the same base name capturing the period covered, the timestamp/title shown in the image, the selected stories **with source URLs**, and the embedded captions/labels.
- **Optional:** if the user asks to have it emailed, hand the PNG to whatever email skill or sender is available — each prompt lists a standardized subject/body to use.
