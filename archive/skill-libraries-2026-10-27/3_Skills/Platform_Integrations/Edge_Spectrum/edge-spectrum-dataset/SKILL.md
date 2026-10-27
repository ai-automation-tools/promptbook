---
title: "🔌 edge-spectrum-dataset"
name: edge-spectrum-dataset
description: >-
  Change, audit or debug the Edge Spectrum dataset — the canonical 187 edge records in
  site/src/data/edges.ts, the four artifacts `npm run gen:edges` writes from it (the inlined RAW
  block in public/spectrum/index.html, edges.json, Versions/Streamlit/data.py, Data/edge_dataset.md),
  and the guards that hold them: check:edges (count, categories, provenance ratchet) and
  check:spectrum (the three measures, read live out of the HTML). Use for "add/edit an edge record",
  "add a category", "update a return figure", "cite a source", "gen:edges --check failed in CI",
  "the artifact reverted my edit", "record count mismatch", "check:spectrum is failing", "ruin
  point", "return on capital vs expected turnover cost", "the chart is squashed flat", and any
  question about where this data actually lives.
tags: ["skill","platform-integrations","edge-spectrum","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/projects/edge-spectrum/edge-spectrum-dataset/SKILL.md
  ref: abbfc6537c23437de45c2d1ec602364e52cc6a2a
  checked: 2026-10-23
---

# The dataset and its artifacts

**`site/src/data/edges.ts` is the only place these 187 records are authored. Everything else that
holds them is generated.**

Editing an artifact by hand is reverted by the next `npm run gen:edges` and fails CI in the
meantime. That is the whole design: three hand-maintained copies used to drift, and the markdown
ended up 21 records behind — missing the entire Precious Metals and Insurance & Annuities
categories — because nothing compared them.

All commands run from **`site/`**.

---

## 1. The flow

```
site/src/data/edges.ts          ← the ONLY file you edit
        │  npm run gen:edges
        ├─→ site/public/spectrum/index.html   (the inlined `const RAW = [ … ]` block)
        ├─→ site/public/spectrum/edges.json   (machine-readable, for the eventual React port)
        └─→ data/edge_dataset.md              (the human-readable tables)
```

`npm run gen:edges -- --check` is the CI form — it rewrites nothing and exits 1 listing every
drifted file. **Edit `edges.ts`, run `gen:edges`, commit all four files together.**

`data/edge_analysis*.md` (and `data/Legacy/`) are **frozen archives, not inputs.** Their horizon columns were computed
under the single-axis model retired on 2026-08-31 and nothing recomputes them. Do not sync them.

## 2. The record shape

Two variants, discriminated on `m`:

| | `m: 'i'` — held asset, **compounds** | `m: 'g'` — repeated wager, **linear** |
|:---|:---|:---|
| Carries | `a` — annual return, percent | `e` — edge per decision, percent (negative for every game here) |
| | | `du` — decisions per day at typical play |
| | | `ced` — capital exposed per decision, percent of bankroll |
| Both | `n` (unique name), `cat` (must be in `EDGE_CATEGORIES`), `ly` (`'raw' \| 'fee' \| 'tax'`), optional `Provenance` | |

**Only fields that carry information live here.** `g`, `type`, `vol`, `wp` and `sk` are pure
functions of `cat` and `m` — `toSpectrumRow()` re-expands them for the visualizer rather than
storing 187 copies of the string `"Varies"`. If you find yourself adding a field that is derivable,
derive it in `toSpectrumRow` instead.

Provenance (`source`, `asOf`, `window`, `methodology`) is optional and **ratcheted**: `check:edges`
fails if the count of records carrying a `source` ever goes *down*. Adding citations is always safe;
removing one requires `npm run check:edges -- --write-baseline` and an explanation.

## 3. What the guards actually assert

| Guard | Holds |
|:---|:---|
| `npm run gen:edges -- --check` | all three artifacts byte-match a fresh generation (LF-normalised, so CRLF working trees pass) |
| `npm run check:market` | guards `dataGenerator.ts`'s simulated market hold — runs between `gen:edges --check` and `check:edges` in CI, but doesn't test the edge dataset itself |
| `npm run check:edges` | record count matches `provenance-baseline.json`; every category has ≥1 record and no record has an unlisted one; names unique; `a > -100`; `du > 0`; `0 < ced ≤ 100`; the provenance ratchet |
| `npm run check:spectrum` | the three measures — see [`references/measures.md`](references/measures.md) |

**Two counts must agree and they live in different files.** `EXPECTED_RECORDS = 187` is hardcoded
in `scripts/check-spectrum.ts`; `totalRecords` lives in `src/data/provenance-baseline.json`. Adding
or removing a record means updating **both**, plus `docs/ROADMAP.md` — `check-spectrum` says so in
its own failure message.

## 4. Changing the record count

1. Edit `EDGES` in `site/src/data/edges.ts`.
2. `npm run gen:edges` — rewrites all three artifacts.
3. `npm run check:edges -- --write-baseline` — records the new `totalRecords` / `withSource`.
4. Update `EXPECTED_RECORDS` in `scripts/check-spectrum.ts`.
5. Update the count wherever prose states it: `docs/ROADMAP.md`, `AGENTS.md`, and the `spectrum`
   tool's `blurb` in `src/tools.ts` (it says "187 financial & betting activities").
6. `npm run check:edges && npm run check:spectrum` — then `npm run lint`.

A new **category** additionally needs the string added to `EDGE_CATEGORIES`, and at least one
record using it — an empty category fails `check:edges`.

## 5. The three measures are not interchangeable

This is the one piece of domain logic in the dataset, and it has already been got wrong once:

- **`returnOnCapital`** is the primary measure and is **floored at −100%**. Total capital loss is
  −100% by definition; `RUIN_FLOOR = -100` and `check:spectrum` fails if it moves.
- **`expectedTurnoverCost`** is the same loss left **deliberately unfloored** — it runs to
  −136,875% for slots, and that is the point. `check:spectrum` fails if *nothing* passes −100%,
  because that means someone floored it.
- **They must keep agreeing on `ruinPoint`.** For every game row at every horizon, "at the floor"
  and "past the ruin point" must be the same boolean. A disagreement means the chart and the ruin
  markers are telling different stories and one is lying.

> [!WARNING]
> **Never plot them on one axis.** That was roadmap Action 2.1: a −136,875% slot bar squashed every
> investment on the board to a flat line, the best investment occupying 2.83% of the 10-year span.
> `check:spectrum` now fails below a 25% share. If a change makes the chart "look better by using
> one scale", it is re-introducing the bug the guard exists for.

## 6. Editing the Spectrum page itself

`site/public/spectrum/index.html` is self-contained — Plotly and fonts over CDN, math and data
inlined, **no build step.** So `check:spectrum` gets at it by string-slicing the file and `eval`ing
the result. That creates a contract in an unusual place:

- The banners **`// MATH & CONSTANTS`**, **`// DATA INJECTION`**, **`const RAW = [`** and
  **`const AR_DEFAULT`** are load-bearing. Renaming or reordering one breaks the guard with
  `no longer contains "…"`. `gen:edges` splices on the same two markers.
- The names the script destructures are equally load-bearing: `RAW`, `HZ`, `RUIN_FLOOR`,
  `decisionCount`, `expectedTurnoverCost`, `returnOnCapital`, `ruinDecisions`, `decayYears90`,
  `rowHzLabel`. Renaming any of them is a rename in two files.
- **The data stays inlined, on purpose.** Fetching `edges.json` instead would leave `check:spectrum`
  testing a file that no longer ships. `edges.json` exists for the future React port, not for the
  page.

## 7. Anti-patterns

- **Hand-editing `RAW`, `edges.json` or `data/edge_dataset.md`.** Reverted by the next
  `gen:edges`; fails CI before that.
- **Committing `edges.ts` without the regenerated artifacts.** The PR goes red on `--check`.
- **Changing the record count in one place.** Three files and three prose mentions carry it.
- **Flooring `expectedTurnoverCost`,** or plotting it against `returnOnCapital` on one axis.
- **Renaming a section banner in `index.html`** while "tidying up".
- **Storing a derivable field on a record.** Derive it in `toSpectrumRow`.
- **Syncing `data/edge_analysis*.md`.** Frozen archives, computed under a retired model.
- **Dropping a `source` to "clean up" a record.** The ratchet only goes one way.

---

## Related

| For | See |
|:---|:---|
| The three measures, ruin point, and the banner contract in full | [`references/measures.md`](references/measures.md) |
| The DU/CED framework and ruin formulas | the repo's `docs/methodology.md` |
| Why the two measures are no longer on one axis | `docs/ideas/hub_improvement_plan.md` §8 |
| The `/spectrum` tile and hub registry | the `edge-spectrum-hub-tool` skill |
