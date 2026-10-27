# Output templates

Every file `business-plan-builder` writes, and the house style it writes them in. The style is `repo-docs-builder` — if that skill is installed, it's the authority and this file is the condensed travel copy. If it isn't, everything you need is here.

Sections: [1 house style](#1-house-style) · [2 voice](#2-voice--the-humanizer-pass) · [3 root README](#3-root-readme) · [4 folder indexes](#4-folder-readme-indexes) · [5 research capture](#5-research-capture) · [6 decision memo](#6-decision-memo) · [7 product spec](#7-product-spec) · [8 ADR](#8-adr) · [9 build plan](#9-build-plan)

---

## 1. House style

**Two header types.** The root `README.md` gets the hero block. Every folder `README.md` gets the lighter centered emoji header. Never put the hero on a folder index, and never leave a folder index as a bare `#` heading.

**Rendering.** Everything has to work in GitHub and in Obsidian, which means: no markdown nested inside HTML block elements (`<table>`, `<div>`, `<td>`), native `#`/`##` headings so Obsidian can fold them, GitHub-style callouts (`> [!NOTE]`, `> [!WARNING]`), and relative links only.

**Catalog tables.** Every down-link goes in the leftmost column, bold, with the description beside it:

```markdown
| Document | What it says |
|:---|:---|
| [**market-scan.md**](market-scan.md) | Bottom-up SAM of $41–68M across 4,100 mid-size clinics. The seat-price assumption owns the range. |
| [**landscape.md**](landscape.md) | Four incumbents, all enterprise-first. The SMB gap is real but two players have tried and retreated. |
```

Not a separate "Link" column, not a link buried at the end of the description, and never a description cell that restates the filename.

**Badges.** Values use `_` for spaces and `·` for lists — a `|` or a comma breaks the shields URL. Colors: green `2ea44f` (positive/live), amber `F59E0B` (caution/early), red `e74c3c` (stop/active), purple `8B5CF6` (plan/stage), blue `0078D4` (platform), gray `6B7280` (neutral, back-links). Three on the root header, one to three on a folder header. More reads as noise.

---

## 2. Voice — the humanizer pass

Structure is templated. Prose isn't. Every sentence you write into these files gets this pass before the file ships — taglines, table cells, section intros, footers.

**Exempt** (they're navigation, keep them): emoji section prefixes, bold leftmost links, badges, callout markers, code blocks and paths.

**Strip these:**

- **Inflated significance** — *stands as, serves as, is a testament to, plays a pivotal role, underscores, evolving landscape, marks a shift.* Worst in the opening paragraph.
- **`-ing` tails bolted on to fake depth** — *ensuring…, highlighting…, enabling…, fostering…, showcasing…* → just end the sentence.
- **Promotional adjectives** — *seamless, powerful, robust, comprehensive, cutting-edge, blazing-fast.* If a claim is real, prove it with a number; otherwise cut it.
- **AI vocabulary** — *delve, leverage (verb), crucial, key (adjective), enhance, streamline, foster, underscore, showcase, intricate, landscape, tapestry, holistic, elevate, unlock, empower.* One is a slip; three in a paragraph is a signature.
- **Copula avoidance** — *serves as / functions as / represents* where *is* / *has* would do.
- **Negative parallelism** — *It's not just X, it's Y.* Cut the setup.
- **Forced rule of three** — *fast, reliable, and scalable* when only one is measured.
- **Vague attribution** — *industry best practices suggest, experts recommend.* Name it or drop it.
- **Filler** — *in order to* → *to*; *due to the fact that* → *because*; *has the ability to* → *can*; *it is important to note that* → delete the clause, keep the fact.
- **Formulaic closers** — "Challenges and Future Prospects," "The future looks bright."
- **Chatbot residue** — "Certainly!", "I hope this helps," "Let me know if…"
- **Em dash overuse** — roughly one per paragraph, max.
- **Curly quotes.** Straight `"` and `'` everywhere. The middle dot `·` in nav rows is intentional and stays.
- **Inline-header bullets that restate themselves** — `- **Performance:** Performance was improved.`

**Then give it a pulse.** Vary sentence length — uniform rhythm is the loudest tell once the vocabulary is clean. Be concrete over complete: "breaks even at 1,340 seats" beats "demonstrates strong unit economics." Say the honest thing: "this is the number I'm least confident in" is more useful than a hedge.

**The two-question audit**, run per file as you finish it, never batched at the end:

1. "What makes this obviously AI generated?" Answer honestly. There's almost always something.
2. "Now make it not obviously AI generated." Ship that version.

---

## 3. Root README

Tier 1. The front door, and the only file most people will read. It opens with the verdict.

```markdown
<a id="readme-top"></a>

<h1 align="center">📈 ⟨Idea Name⟩</h1>

<p align="center">
  <em>⟨One sentence: what the business does and who pays for it.⟩</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/verdict-⟨BUILD|NO_GO|PARK⟩-⟨2ea44f|e74c3c|F59E0B⟩?style=for-the-badge" alt="Verdict">
  <img src="https://img.shields.io/badge/evidence-⟨sourced|mixed|unsourced_·_hypothesis⟩-⟨COLOR⟩?style=for-the-badge" alt="Evidence">
  <img src="https://img.shields.io/badge/stage-⟨screen|full_analysis|build_planned⟩-8B5CF6?style=for-the-badge" alt="Stage">
</p>

---

## 🎯 The call

**⟨Recommendation, unhedged, in one or two sentences.⟩**

⟨The single assumption it rests on, with its range and where the call flips.
Cite the model file. Two sentences, no more — the memo carries the detail.⟩

**Read the full reasoning:** [⟨the memo⟩](decisions/⟨file⟩.md)

## 💡 The idea

⟨The idea restated in your own words, one paragraph. Then the decision this
analysis serves, stated as a question with a timeframe.⟩

| | |
|:---|:---|
| **Decision on the table** | ⟨e.g. "Build this in H1 2027, or not?"⟩ |
| **Analysed** | ⟨YYYY-MM-DD⟩ |
| **Depth** | ⟨full analysis / screen only⟩ |
| **Sources captured** | ⟨N⟩ |

## 🗂️ What's in here

| Folder | What's inside |
|:---|:---|
| [**📚 research/**](research/README.md) | ⟨N⟩ source captures, one per source, with URLs and retrieval dates. |
| [**🔍 analysis/**](analysis/README.md) | Market sizing, the competitive landscape, ⟨N⟩ teardowns, the business case. |
| [**🧮 models/**](models/README.md) | The ROI model and its sensitivity sweep. Runnable Python, executed output pasted in. |
| [**⚖️ decisions/**](decisions/README.md) | The decision memo — the call, the key assumption, and what would prove it wrong. |
| [**🔨 build/**](build/README.md) | Spec, architecture decisions, estimate, and build plan. *(Only exists if the memo said build.)* |

## ⚠️ What this analysis does not know

⟨The honest gaps. What could not be determined and what it would take to
determine it. If the run had no sources, that goes here and in the opening
paragraph both.⟩

---

<p align="center">
  <a href="decisions/README.md">The decision →</a> ·
  <a href="analysis/README.md">The analysis</a> ·
  <a href="models/README.md">The numbers</a>
</p>
```

Drop the `build/` row when the gate closed. Don't leave a link to a folder that doesn't exist.

---

## 4. Folder README indexes

Tier 2. One per pipeline folder. Header, catalog table down to the folder's own files, footer back up.

```markdown
<h1 align="center">⟨emoji⟩ ⟨Folder Title⟩</h1>

<p align="center">
  <em>⟨One sentence on what lives in this folder.⟩</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/⟨label⟩-⟨value⟩-⟨COLOR⟩?style=for-the-badge" alt="⟨alt⟩">
  <a href="../README.md"><img src="https://img.shields.io/badge/↩-analysis_home-6B7280?style=for-the-badge" alt="Back to root"></a>
</p>

---

⟨One short paragraph of orientation — what to read first and why.⟩

| Document | What it says |
|:---|:---|
| [**⟨file.md⟩**](⟨file.md⟩) | ⟨The finding, not the filename. One line.⟩ |

---

<p align="center">
  <a href="../README.md">← ⟨Idea Name⟩ home</a> ·
  <a href="../⟨sibling⟩/README.md">Next: ⟨Sibling⟩ →</a>
</p>
```

Folder-specific notes:

- **`research/README.md`** — the table is a source ledger: `source · grade · retrieved · what it gave us`. This is the file that proves the analysis has a floor under it.
- **`models/README.md`** — paste the **executed output** of every model here, in a fenced block, under a heading naming the file and the date it was run. A model whose output only ever existed in a terminal is not evidence.
- **`decisions/README.md`** — one row per memo with its status (`proposed` / `decided` / `superseded by …`). Superseded memos stay; the record is the point.

---

## 5. Research capture

One file per source in `research/`. Capture before reasoning. Append-only — don't rewrite history here.

```markdown
# ⟨Source title⟩

**URL:** ⟨url⟩
**Retrieved:** ⟨YYYY-MM-DD⟩
**Grade:** ⟨A|B|C|D⟩ — ⟨why it's that grade⟩
**Publisher / author:** ⟨who, and what interest they have⟩

## What it gives us

⟨The claims worth extracting, quoted or closely paraphrased, each with the
figure and its context. No interpretation in this section.⟩

## What it does not support

⟨The things a reader might over-read from it. A pricing page tells you list
price, not realized revenue. Say so here so nobody has to re-derive it later.⟩
```

---

## 6. Decision memo

`decisions/<YYYY-MM-DD>-<slug>.md`. Recommendation first, always.

```markdown
# Decision: ⟨the call, as a verb phrase⟩

**Date:** ⟨YYYY-MM-DD⟩ · **Decision owner:** ⟨name⟩
**Status:** proposed | decided | superseded by ⟨link⟩

## Recommendation

⟨The call, in one or two sentences. Unhedged. If conditional, the condition is
explicit and observable: "Build X, unless ⟨specific check⟩ comes back negative."⟩

## The decision on the table

⟨What is being decided, by whom, by when, and what is explicitly not in scope
for this memo.⟩

## Reversibility

**⟨One-way | Two-way⟩ door.** Cost to undo: ~$⟨X⟩, ~⟨N⟩ weeks, ⟨who we'd have
to tell⟩. The evidence bar is set accordingly.

## Options considered

1. **⟨Recommended⟩** — ⟨one line⟩
2. **⟨Rejected⟩** — ⟨one line⟩
3. **Do nothing** — ⟨one line; a real entry, not a placeholder⟩

### Why not option 2 (steelmanned)

⟨The strongest case FOR option 2, stated so its advocate would endorse it.
Then: precisely why we're not persuaded — the specific fact or tradeoff that
decides it, not a vibe.⟩

## Evidence

| Claim | Tag / grade | Source |
|:---|:---|:---|
| ⟨claim⟩ | `[fact]` A | ⟨analysis/x.md → research/y.md, URL, YYYY-MM-DD⟩ |
| ⟨claim⟩ | `[est]` | ⟨models/roi.py — derivation⟩ |
| ⟨claim⟩ | `[assum]` | ⟨whose judgment, and why it's reasonable⟩ |

**Not determinable:** ⟨what we could not learn, and what it would take.⟩

## The key assumption

⟨The single assumption this call rests on, with its plausible range and the
point where the call flips. From the sensitivity sweep — cite the model.⟩

## Strongest counterargument

⟨The best case against this recommendation, in our own words. Then: why we're
proceeding anyway, or what we're doing to cover it.⟩

## What would change my mind

- If ⟨observable⟩ is ⟨threshold⟩ by ⟨date⟩, this call is wrong and we ⟨action⟩.
- If ⟨observable⟩ …, we revisit ⟨specific part⟩.

## Next step

⟨Concrete first action, owner, date.⟩
```

Sections can be dropped when the decision genuinely doesn't have them — a two-way door with one real option doesn't need a steelman. **"What would change my mind" is never one of them.** Drop it and you've written a pitch.

After the call is made, mark the status and leave the reasoning intact. Never retro-edit a memo to look smarter than it was; that destroys the only calibration data the repo has.

---

## 7. Product spec

`build/spec.md`. Only past the gate.

```markdown
# Spec: ⟨product/feature, as a noun phrase⟩

**Decision it serves:** [⟨memo⟩](../decisions/⟨file⟩.md) · **Status:** draft | approved
**The bet being tested:** ⟨the one assumption from the memo this build validates⟩

## Users & jobs

⟨Each user type, the job they're hiring this for, traced to analysis/. Tag any
job that came from reasoning rather than an observed switch.⟩

## In scope (this version)

### Must
- **⟨story name⟩** — As a ⟨user⟩, I want ⟨action⟩, so that ⟨outcome⟩.
  - AC: Given ⟨context⟩, When ⟨action⟩, Then ⟨observable result⟩.

### Should / Could
⟨Same format, lower priority.⟩

## Explicitly out of scope (Won't, this version)

- ⟨thing⟩ — ⟨why it's deferred, so it isn't relitigated in week three⟩

## Non-functional requirements

⟨Performance, scale, security, accessibility, platforms — each with a number
and a tag. "Fast" is not a requirement; "P95 < 2s" is. The concurrency figure
comes from the sizing in analysis/, tagged, not invented.⟩

## Open questions

⟨What's undecided, who owns deciding it, and by when.⟩
```

---

## 8. ADR

`build/adr-<nnn>-<slug>.md`. One per decision that matters — the one-way doors, the build-vs-buys, the load-bearing tradeoffs. Never a ceremonial ADR for a library swap.

```markdown
# ADR-⟨00N⟩: ⟨the decision, as a statement⟩

**Status:** proposed | accepted | superseded by ⟨link⟩ · **Reversibility:** one-way | two-way
**Serves:** [⟨spec⟩](spec.md)

## Context

⟨The forces: the non-functional requirements from the spec, the constraints
(budget, team skills, deadline), the scale from analysis/.⟩

## Options considered

1. **⟨Chosen⟩** — ⟨one line⟩ · cost: ⟨build + recurring, tagged⟩
2. **⟨Rejected⟩** — ⟨one line, steelmanned⟩ · cost: ⟨…⟩

## Decision

⟨What we're doing, and the one concrete reason that decides it.⟩

## Exit cost

⟨If this is wrong, undoing it costs ~⟨weeks/$⟩ once we have users. That's why
the evidence bar was set where it was.⟩

## Cost envelope

⟨Monthly infrastructure and per-service cost at launch and at target scale,
traceable to pricing pages `[fact]` and usage assumptions `[assum]`. Feed it
back into models/roi.py.⟩

## Consequences

⟨What we're committed to, what we're giving up, where the first bottleneck is.⟩
```

---

## 9. Build plan

`build/build-plan.md`. Slices, ordered by risk, with a stopping point.

```markdown
# Build plan: ⟨product/feature⟩

**Spec:** [spec.md](spec.md) · **Architecture:** [adr-001-⟨x⟩.md](adr-001-⟨x⟩.md) · **Estimate:** [estimate.md](estimate.md)

## Slice 0 — Walking skeleton

⟨Thinnest UI→DB path that runs and deploys. Proves: ⟨the one-way-door
assumption from the ADR⟩.⟩

## Slice 1 — ⟨riskiest Must-story, end to end⟩

- **Delivers:** ⟨story⟩
- **De-risks:** ⟨assumption⟩
- **Done when:** ⟨AC pass, deployed somewhere a person can use it⟩

## Slice 2..N — ⟨next by risk, then by learning⟩

## Definition of done

⟨The standing bar, written once: acceptance criteria pass including empty
states and error paths; tests at the level that matters, in CI, concentrated
where failure costs most; input validated at the boundary; nothing secret
logged; deployed, not merged.⟩

## Cut list (if the estimate runs over)

Could → ⟨items⟩ · Should → ⟨items⟩. Must is defended; if Must has to be cut,
the spec reopens.

## What we learn, and when we'd stop

⟨The earliest slice after which we can test the memo's bet with a real user,
and the falsifier — quoted from the memo — that would tell us to stop.⟩
```

That last section is the whole reason to slice. A build plan without it is a plan to spend the entire budget regardless of what the first users say.

**When the plan becomes a repo.** The build plan is the source of the repo's `docs/ROADMAP.md`, and that file is written to the lab's one roadmap format: the `repo-docs-builder` skill's `references/roadmap-standard.md`. Map it straight across: each slice becomes a `## <emoji> Phase N: <name>` heading, each "Done when" becomes a `- [ ]` item whose text says what proves it, the Definition of done becomes the `## 🚦` go-live checklist, and the cut list, promotion and revenue work go below the go-live heading. Don't invent a second shape; the routines that build the repo only read that one.

---

<p align="center">
  <a href="../SKILL.md">← business-plan-builder</a> ·
  <a href="./analysis-passes.md">The eight passes</a> ·
  <a href="./evidence-rules.md">Evidence rules</a>
</p>
