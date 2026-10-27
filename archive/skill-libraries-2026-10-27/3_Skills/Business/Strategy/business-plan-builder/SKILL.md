---
title: "💼 business-plan-builder"
name: business-plan-builder
description: >-
  Take a business idea — a one-line hunch, a napkin pitch, or a finished
  proposal — and run the whole business-analysis pipeline over it, writing the
  result out as a navigable folder of linked markdown. Eight passes in order:
  market sizing (TAM/SAM/SOM, JTBD, Five Forces), competitive intelligence with
  graded evidence, an ROI model with a sensitivity sweep, and a decision memo
  that makes the call — then, only if the memo greenlights it, a product spec, a
  costed architecture, a ranged build estimate, and a sliced build plan. Every
  number traces to a source or is tagged as an assumption. Use whenever the user
  hands over a business idea, startup idea, product idea, app idea, side hustle,
  or venture and wants it evaluated, researched, sized, modeled, pressure-tested,
  planned, written up, or turned into documentation — phrases like "here's my
  business idea", "is this worth building", "evaluate this idea", "write up a
  business plan", "should I build this", "do the full analysis on this", "turn
  this into a plan".
tags: ["skill","business","strategy","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/core/business/business-plan-builder/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Business plan builder

Somebody hands you an idea. Your job is to find out whether it holds up, and to leave behind a set of documents that show your work — so the reader can disagree with a specific line rather than with a vibe.

Two things make this skill different from writing a business plan:

1. **The pipeline is fixed and it has a gate.** Eight passes, in order. Nothing gets specced, architected, or estimated until the decision memo says it's worth building. A no-go is a complete, successful run.
2. **The output is a repo, not a reply.** A folder of linked markdown in the `repo-docs-builder` house style, with an index at every level and every claim traceable back to a captured source.

## WHEN TO USE THIS SKILL

- Someone gives you an idea — one sentence or twenty pages — and wants to know if it's real.
- "Write up a business plan for X" / "turn this into documentation."
- "Should I build this?" where the honest answer needs sizing, competitors, and a model behind it.
- Pressure-testing an idea the user is already attached to. This is the case the skill is built for.
- An existing plan needs the missing half — it has a market story but no unit economics, or a build estimate with no decision behind it.

**Not for:** a quick opinion (just answer), a single competitor lookup (do the teardown pass alone), or writing marketing copy for an idea already decided on.

---

## 0. THE ONE RULE

**Every number is traceable to a source, or it is labeled an assumption.**

An analysis that quietly invents a market size is worse than no analysis — it launders a guess into a decision, and downstream nobody can tell. So:

- **Never state a figure you did not get from a source or compute from one.** No "roughly $4B" from memory.
- **Tag every claim** — `[fact]` (sourced, with a URL and retrieval date), `[est]` (derived — show the math), `[assum]` (a judgment call — say whose and why). Tags live in the document, inline, forever.
- **Date-stamp everything.** Get the real date from the environment (`Get-Date -Format yyyy-MM-dd` on Windows), never from memory — a model's sense of "today" drifts to its training cutoff and quietly falsifies every retrieval date in the repo.
- **A conclusion inherits the weakest tag it depends on.** Three `[assum]`s do not sum to a `[fact]`.
- **A range beats false precision.** "$40–70M SAM, driven by \[the penetration assumption\]" is honest. "$52.3M" out of a three-step guess chain is not.
- **Compute in Python, never in your head.** Multi-step arithmetic presented as a figure is how a rounding error becomes a strategy.

Read [`references/evidence-rules.md`](./references/evidence-rules.md) before the first pass. It holds the tag definitions, the A–D source grading scale, the list of things that are genuinely unknowable about a private company, and the ethics line on research.

> [!IMPORTANT]
> Be the skeptic, not the cheerleader. Argue the strongest case *against* the thing the user appears to want. If the business case only works under one heroic assumption, that assumption **is** the finding — put it in the recommendation, not in a footnote.

---

## 1. INTAKE

Before any research, pin down four things and write them into the root README as you go.

| Thing to pin | How to get it |
|:---|:---|
| **The idea, restated in your words** | One paragraph. If your restatement surprises the user, you were about to analyze the wrong thing. |
| **The decision on the table** | Not "is this a good idea" — "do I build this in the next six months instead of the alternatives?" A memo with no decision argues with itself. |
| **What's given vs. what you're supplying** | Split the input into claims the user asserted (tag `[assum]` unless they cite something) and gaps you'll have to fill. A finished 20-page proposal is still mostly `[assum]` until you check it. |
| **Destination + slug** | Where the repo gets written, and the kebab-case slug for the folder. Default `./<idea-slug>/` in the working directory; confirm before creating anything. |

Then set the depth. **Full run is the default** — all eight passes. Drop to a screen (passes 1–4 only, gate closes, no build layer) when the user asks for a quick read or when the idea is early enough that a build estimate would be theater. Say which mode you're in, out loud, in the root README.

---

## 2. THE EIGHT PASSES

Run them in this order. Each one writes files and cites the pass before it. The full method for each — what it does, how it's commonly faked, and what it must output — is in [`references/analysis-passes.md`](./references/analysis-passes.md). Read that file before you start; the summaries below are the map, not the territory.

**Strategy half — is this worth building?**

| # | Pass | Writes | The question it settles |
|:-:|:---|:---|:---|
| 1 | **Framing & sizing** | `research/*.md`, `analysis/market-scan.md` | How big is the reachable market, counted bottom-up from units you can name? Which framework earns its place, and which is decoration? |
| 2 | **Competitive intelligence** | `research/*.md`, `analysis/teardown-*.md`, `analysis/landscape.md` | Who's already here, what can you actually learn about them, and what is flatly not determinable? |
| 3 | **Quantitative model** | `models/roi.py`, `analysis/business-case.md` | What are the unit economics, and — the real deliverable — which single assumption owns the answer? |
| 4 | **Decision memo** | `decisions/<date>-<slug>.md` | Build, don't build, or build a smaller thing first? One-way or two-way door? What would prove this wrong? |

**The gate.** Pass 4 ends in a recommendation. If it is anything other than *build*, **stop**. Write the memo, write the root README, and hand it over. Specifying a build the memo didn't greenlight is the same failure as inventing a market size, except it gets built.

**Build half — only past a greenlight.**

| # | Pass | Writes | The question it settles |
|:-:|:---|:---|:---|
| 5 | **Product spec** | `build/spec.md` | Exactly what gets built, with acceptance criteria, and — the valuable part — the written Won't list. |
| 6 | **Technical architecture** | `build/adr-*.md` | The stack as a costed decision with a reversibility class and an exit cost. One-way doors get an ADR; two-way doors get a default and no ceremony. |
| 7 | **Build estimate** | `models/estimate.py`, `build/estimate.md` | A range and the date it implies, anchored on a reference class — plus the task whose uncertainty owns the schedule. |
| 8 | **Build plan** | `build/build-plan.md` | The sequence of thin vertical slices, ordered by risk, and the point at which you'd stop. |

Passes 5–8 inherit every rule from 0–4. A schedule is a P&L measured in weeks and it fabricates the same way.

### Research reality check

Pass 1 and pass 2 need real sources. Use web search and fetch, capture one file per source into `research/` with the URL and retrieval date at the top, and only then reason over them. `research/` is append-only — capture before you conclude, not after.

If you have no web access on this run, **say so in the root README, in the first paragraph**, mark every unsourced figure `[assum]`, and treat the whole strategy half as a structured hypothesis rather than an analysis. That is a usable deliverable. Pretending the numbers are sourced is not.

---

## 3. THE OUTPUT REPO

The deliverable is a folder built to the `repo-docs-builder` house style: a clean top level, a README index in every content folder, links that go down to children and back up to parents, and prose that reads like a person wrote it.

> [!NOTE]
> If the `repo-docs-builder` skill is installed, load it and follow it for the header blocks, catalog tables, footers, and the humanizer pass — it is the source of that style. If it isn't available, [`references/output-templates.md`](./references/output-templates.md) carries the condensed version of everything you need, so this skill still works standalone.

### Layout

This is a doc library, so the top-level folders *are* the content categories. No `src/`, no `docs/` hub — the pipeline directories index themselves.

```
<idea-slug>/
├── README.md            ← Tier 1. Front door: the verdict, the pipeline table, links down to every folder.
├── research/
│   ├── README.md        ← Tier 2 index — the source ledger table (source · grade · retrieved).
│   └── <source>.md      ← one file per source. URL + retrieval date + grade at the top.
├── analysis/
│   ├── README.md        ← Tier 2 index
│   ├── market-scan.md · landscape.md · teardown-<competitor>.md · business-case.md
├── models/
│   ├── README.md        ← Tier 2 index — includes the executed output, pasted
│   └── roi.py · estimate.py
├── decisions/
│   ├── README.md        ← Tier 2 index — one row per memo, with its status
│   └── <YYYY-MM-DD>-<slug>.md
└── build/               ← only exists if the memo said build
    ├── README.md        ← Tier 2 index
    └── spec.md · adr-001-<x>.md · build-plan.md · estimate.md
```

Three tiers is the ceiling here. Don't create a folder README whose only content is a link to one file — link that file straight from the root.

### The rules that make it navigable

- **Root README opens with the verdict.** Recommendation first, always. Nobody should have to click into `decisions/` to learn what you concluded.
- **Every folder README links one level down** in a catalog table with the link bold in the leftmost column: `[**market-scan.md**](market-scan.md) | Bottom-up SAM of $41–68M, driven by the seat-price assumption.` The description cell carries information — never a restatement of the filename.
- **Every folder README links back up** in a centered footer nav row. A down-only index is a trap.
- **Links are relative** so they resolve in GitHub and in Obsidian both.
- **Headers follow the house style** — the root gets the hero block (an `# H1` fallback where there's no logo asset, never an invented image path), every folder README gets the centered emoji-`<h1>` + tagline + a badge row of one to three.
- **Prose gets the humanizer pass.** No *comprehensive*, *seamless*, *robust*, *leverage*, *delve*, no `-ing` tails bolted on to fake depth, no *serves as* where *is* works. The emoji headers, bold leftmost links, and badges are navigation and stay. Details in `references/output-templates.md` §2.

### Badges worth setting

The root header badge row is where a reader gets the state of the analysis in one glance. Set these three honestly:

| Badge | Values |
|:---|:---|
| **verdict** | `BUILD` (green `2ea44f`) · `NO_GO` (red `e74c3c`) · `PARK` / `NEEDS_VALIDATION` (amber `F59E0B`) |
| **evidence** | `sourced` (green) · `mixed` (amber) · `unsourced_·_hypothesis` (gray `6B7280`) — this one keeps you honest |
| **stage** | `screen` · `full_analysis` · `build_planned` (purple `8B5CF6`) |

---

## 4. WORKFLOW

1. **Intake** (§1). Restate the idea, name the decision, split given-vs-supplied, agree the destination. Get the real date.
2. **Scaffold.** Create the folder and the empty pipeline directories. Write a stub root README with the intake block in it, so there's a spine to hang findings on.
3. **Read the references.** `evidence-rules.md` first, then the passes you're about to run in `analysis-passes.md`.
4. **Pass 1–2 — research and capture.** Search, fetch, and write one `research/` file per source *before* reasoning over it. Then write the analysis files that cite them.
5. **Pass 3 — model it.** Write the Python file, **run it**, and paste the executed output into `models/README.md`. Sweep every driver across its plausible range and sort the swings — the widest bar is the finding. A model you didn't run is a text file.
6. **Pass 4 — the memo.** Recommendation up top. Steelman the option you rejected until its advocate would sign off on your version of it. Name the single assumption the call rests on. Write the falsifiers with an observable, a threshold, and a date.
7. **Check the gate.** Not *build*? Finish the root README and stop. Say plainly in the handoff that the build layer was not written and why.
8. **Pass 5–8** if greenlit. Spec, then ADRs for the one-way doors only, then the estimate model (run it), then the sliced plan with a "when we'd stop" section. If the plan is headed for a repo, say in the handoff that its roadmap is written from the build plan in the lab's roadmap format, the roadmap standard that ships with the `repo-docs-builder` skill (output-templates §9).
9. **Wire and audit** (§5). Every index links down and up; every claim carries a tag; every figure cites a file.
10. **Hand over.** A short inline summary: the verdict, the key assumption, the number that would flip it, and the path to the repo. Not a re-narration of the documents.

Write each file's prose through the humanizer as you finish that file — not batched at the end, where it always degrades into a rubber stamp.

---

## 5. SELF-AUDIT BEFORE HANDOVER

Run this. Every failure here is one somebody else would have found.

1. **No untagged figure anywhere.** Grep for digits in `analysis/` and `decisions/` and check each one carries `[fact]`, `[est]`, or `[assum]`.
2. **Every `[fact]` has a URL and a retrieval date**, and that date is real.
3. **Every figure in the memo traces to a file.** If it can't be walked back to `models/` or `analysis/`, it doesn't belong in the memo.
4. **`research/` actually has files in it.** An `analysis/` folder citing an empty `research/` folder is the signature failure of this whole skill.
5. **The model was executed** and its real output is pasted into `models/README.md`.
6. **The memo names one key assumption**, singular, and the sensitivity sweep supports the choice.
7. **"What would change my mind" exists** and each entry has an observable, a threshold, and a date. A memo without it is a pitch.
8. **The unknowns section exists** in the competitive work and says what is not determinable, rather than estimating it anyway.
9. **The gate held.** No `build/` folder unless the memo says build.
10. **Navigability** — every folder has a README, every README links down to its children and up to its parent, no orphan files, all links relative.
11. **Voice** — ask yourself "what makes this obviously AI generated?", answer honestly, then fix it. There is almost always something.

---

## 6. ANTI-PATTERNS

**Analysis**

- **Top-down sizing presented as the answer.** "$40B market, we need 1%" is the absence of an argument. Name the first twenty customers and who they pay today.
- **Inventing a private company's revenue, churn, or margins.** Headcount × a revenue-per-employee multiple produces a number with error bars so wide it carries no information — and it stops the reader from asking. Write "not determinable from public sources" and route the problem.
- **Fabricated customer quotes.** The single worst artifact this skill can produce; downstream it is indistinguishable from a real one.
- **A framework run for its own sake.** Before writing a Five Forces or a SWOT section, state in one sentence what result would flip the recommendation. If nothing would, delete the section.
- **A single-number model output.** The sensitivity sweep is the deliverable; the base case is the excuse to run it.
- **Averaging away a conflict between sources.** Show the conflict and say which you'd bet on.

**Process**

- **Writing the build layer without a greenlight**, or writing a greenlight because the user clearly wants one.
- **Reasoning first, capturing sources after** — that's how a remembered figure gets a citation glued on.
- **Reporting arithmetic you did in your head.**
- **Retro-editing a memo to look smarter than it was.** The value of `decisions/` in two years is entirely in the memos that were wrong and said in advance what would prove it.
- **Burying the recommendation.** The reader should never have to reach the bottom for the call.

**Output**

- **A flat pile of markdown files with no index.** Every folder gets a README that links down and up.
- **Table cells that restate the filename** — `| **spec.md** | The spec. |`.
- **A logo hero on a folder README**, or an invented image path in the root header.
- **Promotional prose in a business document.** *A comprehensive, robust platform leveraging cutting-edge…* — cut it and say what the thing does.
- **A "Challenges and Future Prospects" closer.** If there's real work left, it goes in the memo's next-step section with an owner and a date.

---

> [!NOTE]
> The eight passes are adapted from a set of standard business-analysis disciplines — market sizing, competitive intelligence, ROI modeling, decision memos, product spec, technical architecture, build estimation, and shipping discipline — condensed and re-scoped here for one-shot use on a single idea rather than run as separate tools.
