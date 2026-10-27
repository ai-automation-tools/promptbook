# The eight passes

The method for each pass of `business-plan-builder`. Read the pass before you run it. Each section says what the pass is for, how it gets faked, what it must output, and what would make it worth deleting.

Passes 1–4 are the strategy half. Pass 4 ends in a gate. Passes 5–8 run only past a greenlight.

---

## Pass 1 — Framing and sizing

**Output:** `research/*.md` (one file per source) → `analysis/market-scan.md`

A framework is a lens, not a deliverable. If running it does not change the recommendation, don't run it and definitely don't ship it. The most common failure is not a wrong analysis — it's a well-formatted analysis that would have reached the same conclusion with no analysis at all.

### TAM / SAM / SOM

Three different questions, not three sizes:

| Term | The actual question | How it gets corrupted |
|:---|:---|:---|
| **TAM** | If every entity with this problem bought a full solution from someone, what's the annual spend? | Cited from an analyst press release; includes segments you can't legally or physically serve. |
| **SAM** | Of that, what's reachable by *your* product, *your* channel, *your* geography, *your* price? | Set equal to TAM with a hand-wave, or shrunk by an unexplained round fraction. |
| **SOM** | What can you win in three to five years against the competitors who already exist? | "1% of TAM." |

**Bottom-up by default. Top-down only as a sanity check.** Top-down starts from a published figure and cuts it with percentages — fast, citable, and almost always wrong in a way you can't detect, because the published figure has its own definition of the market and every percentage on top is a guess multiplied by a guess. Three multiplicative assumptions at ±50% each span roughly 8x, and a single top-down number hides that entirely.

Bottom-up starts from countable units, and each input is arguable — which is what makes it honest. A reviewer can attack "42,000 US dental practices" or "$3,600/yr seat price." Nobody can attack "we assume 4% penetration."

If bottom-up and top-down disagree by more than about 3x, that gap is a finding worth writing down, not an error to average away.

### Sizing when no report exists

The normal case. Assemble it from countable things:

1. **Find the unit** a contract gets signed per — a practice, a truck, a warehouse, a store location, a developer seat.
2. **Count it from a registry, not a vibe.** Census of business by NAICS/SIC, BLS occupational employment counts, state licensing boards, FDA/FCC registries, trade association member counts, public company 10-K segment disclosures, job-posting volume as a proxy for role headcount. These are `[fact]` with a URL and retrieval date.
3. **Apply qualifiers, each named and sourced or explicitly `[assum]`.** Not "serviceable share = 30%." Instead: "of 42,000 practices, ~61% have ≥3 chairs `[fact, ADA 2025 survey]`, our minimum viable size `[assum: below 3 chairs the workflow pain doesn't justify $300/mo]`."
4. **Price it from observable pricing.** A competitor's public price page is `[fact]` about list price and `[assum]` about realized revenue per account — discounting is invisible from outside.
5. **Multiply in Python**, and output low/base/high on each qualifier rather than one number.

### The "1% of a huge market" fallacy

Name all three reasons when you see it: it reverses the direction of reasoning (1% was chosen because $400M sounded good, not derived from anything); it treats market share as a lottery rather than something won account by account against a named competitor; and 1% of a market with two entrenched incumbents is a completely different proposition from 1% of a fragmented market with 400 sub-scale players, which the phrasing erases.

The replacement is always the same: **name the first twenty customers, the channel that reaches them, and who they pay today.** If the answer is "nobody, this is a new category," that's a harder sizing problem and a bigger risk — surface it rather than dissolving it into a percentage.

### Jobs-to-be-Done

JTBD asks what progress the customer is trying to make, so the competitive set is defined by *what they'd do instead* — the spreadsheet, the intern, the do-nothing. That competitive set is its real output.

**Faked by** writing job statements that restate your feature list ("when I need to manage my pipeline, I want a pipeline manager"), and by inventing customer quotes. Never invent a quote.

**Done properly**, a job statement is grounded in an observed switch — somebody fired something and hired something else, and you know when and why. Format is *situation → motivation → desired outcome*: "When a claim is denied and I have 14 days to appeal `[fact: state regs]`, I want the denial reason extracted without reading the PDF, so I can decide whether appealing is worth the hour."

With no interviews — the usual case for a fresh idea — JTBD is a hypothesis generator, tagged `[assum]` throughout. Still useful. Not evidence. Say which it is.

### Porter's Five Forces

An industry-level tool that explains why structural profitability is what it is. It earns its place when the question is "is there durable profit here at all?"

**Abused by** applying it to one company (wrong unit of analysis), or filling a five-box grid with adjectives — "buyer power: high" — that support whatever you already believed.

**Done properly**, each force gets a mechanism and a number: "one supplier controls ~80% of certified sensor supply `[est: three teardowns + supplier 10-K segment revenue]`, and switching requires 9-month recertification `[fact: FAA AC 20-115D]` — so COGS is structurally exposed to one counterparty's pricing." A force that doesn't attach to a line item in the model is an adjective, not a force.

### SWOT

Usually a waste of time, and you should say so rather than produce it politely. It has no theory — nothing tells you what qualifies as a strength, how to weigh items, or what to do with the grid. It reliably produces four lists of unranked, mostly flattering adjectives that justify the decision already made.

One defensible use: a fast alignment exercise meant to surface disagreement between people who think they agree. Even then, force-rank (top three per quadrant, no ties), make every item a falsifiable tagged claim, and require each W and T to pair to a decision. Otherwise use Five Forces for structure, JTBD for demand, and a teardown for rivals — SWOT is a worse version of all three at once.

### Picking the framework

Work backward from the decision, never forward from the catalog:

| The decision on the table | What earns its place |
|:---|:---|
| Is this market big enough to fund the plan? | Bottom-up sizing + the plan's own revenue requirement |
| Will there be profit here in five years, for anyone? | Five Forces, with numbers |
| Who do we compete with, and why do people switch? | JTBD + teardown |
| Which segment first? | Bottom-up sizing *by segment* + reachability per channel |
| Build, buy, or partner? | Not a framework — a model plus a memo |

Before writing any section, state in one sentence what result would flip the call. If nothing would, delete the section — and if nothing would flip the whole decision, that's the finding, and the memo should say the decision is already made.

---

## Pass 2 — Competitive intelligence

**Output:** `research/*.md` → `analysis/teardown-<competitor>.md`, `analysis/landscape.md`

Mostly an exercise in discipline about what you don't know. The public record is thin and lopsided: you can learn a lot about a private company's *intentions* and almost nothing about its *results*. The failure mode isn't laziness, it's fluency — a model that has read a thousand funding announcements can generate a completely plausible revenue figure for a company that never disclosed one.

**Absence of evidence is a finding.** "We cannot determine their churn from public sources" is a correct, complete, valuable answer.

Source hierarchy, grading, what you can and can't infer, and the research ethics line are all in [`evidence-rules.md`](./evidence-rules.md). Work down that source list; most teardowns stop at the website and are worthless for it.

### What a teardown must contain

- **Verdict up top** — the one thing this competitor means for the decision.
- **Claims with grades inline**, ordered by what matters rather than what was easy to find.
- **An explicit "Unknown / not determinable" section.** Mandatory. It's the section that stops someone else inventing the numbers later, and it tells you what a paid data source would actually buy.
- **Retrieval dates on everything**, plus the date the teardown goes stale.

### The landscape file

One file that maps the set: who's here, which segment each has taken, where the gap is, and — the part that matters — whether the gap exists because nobody has tried it or because everybody has and it doesn't work. An empty quadrant on a positioning chart is a hypothesis, not an opportunity.

---

## Pass 3 — The quantitative model

**Output:** `models/roi.py` (executed) → `analysis/business-case.md`

A model is an argument about causality with numbers attached. Its job is not to produce The Number — it's to show **which assumption the decision hangs on**. Finish a model and you should be able to name that assumption in one sentence. If you can't, it isn't done.

The model's output precision is capped by its worst assumption. A five-year NPV built on a guessed churn rate is a guess with a currency symbol.

### Unit economics

Get the unit right first: the thing that repeats. Everything is per-unit-per-period, and mixing units (blended CAC across two channels with 5x different costs) is the most common way a model lies without any individual number being wrong.

| Metric | The definition that survives scrutiny |
|:---|:---|
| **Contribution margin** | Revenue minus *all* variable cost to serve — COGS, payment fees, support, infra, the human in the loop. Not gross margin with the inconvenient parts moved to opex. |
| **CAC** | Fully loaded: paid spend **plus** sales and marketing salaries, tooling, commissions, over *new* customers in the cohort. |
| **Payback** | Months of contribution margin (not revenue) to repay CAC. The cash-flow constraint that kills companies. |
| **LTV** | Contribution margin × expected lifetime, discounted. Lifetime from observed retention, not `1/churn` on two months of data. |

**How LTV:CAC gets gamed** — every abuse is an inflated numerator or a deflated denominator. Revenue LTV instead of margin LTV (turns a real 1.2:1 into a reported 3:1 at 40% margin — the most common version). Undiscounted LTV. Marketing-only CAC that drops the sales team. Blended CAC that hides an unprofitable marginal channel. `1/churn` on a young cohort, where front-loaded early churn produces fantasy lifetimes.

Report LTV:CAC alongside payback months and the CAC definition used, or don't report it. And note that a healthy ratio with a 30-month payback is a financing problem, not a business.

### NPV, IRR, break-even

**NPV is the default.** The discount rate is a real choice with a real defense — the opportunity cost of this capital in this business, not the number that made the answer come out right. Pick one, label it `[assum]`, and sweep it: if the call flips between 10% and 15%, the recommendation is "this depends on our cost of capital," which is a different and more useful memo.

**IRR is a trap on non-conventional cash flows.** When signs flip more than once (upfront build, positive years, then a re-platform cost), the polynomial has multiple real roots and every one is a valid IRR — your tool reports whichever it found first. IRR also assumes interim cash reinvests at the IRR itself, and ignores scale entirely: 80% on $50k loses to 20% on $5M every time. Use NPV to decide, IRR only to communicate, and never compute IRR on a series that changes sign more than once.

**Break-even** is the output non-analysts argue with productively. Give it in units and in months, in the language of the business: "we break even at 1,340 seats, 6% of the serviceable base `[est]`." That sentence gets a "no way" or a "sure" from someone who knows the market, and either answer is worth more than the NPV.

### Model structure rules

Non-negotiable, because these are what make a model reviewable:

1. **Assumptions are named constants in one block at the top**, each with a unit, a tag, and a source comment. If a reviewer has to scroll to find what drives the answer, the model failed at its main job.
2. **One source of truth per input.** A number appears exactly once. Two copies of the price will diverge, and the model will be wrong in a way that passes every review.
3. **No magic numbers mid-formula.** A bare `* 0.85` on line 60 is an undocumented assumption smuggled past review.
4. **Compute in Python; never mentally.** The file is the artifact — the number in the memo is a citation to it.
5. **Output a range, not a point.**

```python
"""ROI model — <decision this serves>.  Run: python models/roi.py"""
from dataclasses import dataclass, replace

# ---- ASSUMPTIONS -------------------------------------------------------
# Every driver lives here. Nothing numeric below this block.
@dataclass(frozen=True)
class A:
    price_mo:    float = 300.0    # $/seat/mo  [fact] competitor pricing page, 2026-08-17
    cogs_pct:    float = 0.22     # of revenue [est] infra+support, see research/costs.md
    cac:         float = 1_450.0  # $/customer [assum] marginal paid channel; no history yet
    churn_mo:    float = 0.025    # monthly    [assum] 2.5%; SMB SaaS band is 2-5%
    horizon_mo:  int   = 36       # cap        [assum] refuse to model beyond 3y
    discount_yr: float = 0.12     # annual     [assum] no firm hurdle rate exists

def unit_economics(a: A) -> dict:
    contrib_mo = a.price_mo * (1 - a.cogs_pct)
    d_mo = (1 + a.discount_yr) ** (1 / 12) - 1
    ltv = sum(
        contrib_mo * (1 - a.churn_mo) ** m / (1 + d_mo) ** m
        for m in range(a.horizon_mo)
    )
    return {
        "contrib_mo": contrib_mo,
        "ltv": ltv,
        "ltv_cac": ltv / a.cac,
        "payback_mo": a.cac / contrib_mo,   # undiscounted: the cash constraint
    }

def sweep(a: A, field: str, lo: float, hi: float, out: str = "ltv_cac"):
    """One-way sensitivity: hold everything else at base, move one driver."""
    base = unit_economics(a)[out]
    for v in (lo, getattr(a, field), hi):
        r = unit_economics(replace(a, **{field: v}))[out]
        print(f"{field:12} = {v:>8.4g} -> {out} {r:6.2f}  ({r - base:+.2f} vs base)")

if __name__ == "__main__":
    a = A()
    for k, v in unit_economics(a).items():
        print(f"{k:12} {v:,.2f}")
    print()
    sweep(a, "churn_mo", 0.015, 0.05)   # the band, not a flinch either side
    sweep(a, "cac", 900, 2_600)
    sweep(a, "cogs_pct", 0.15, 0.35)
```

`replace()` on a frozen dataclass means a sweep can't mutate the base case, and every driver goes through the same code path that produced the headline number.

### Sensitivity is the main event

**The sweep is the deliverable. The base case is the excuse to run it.**

**One-way sensitivity** — move one driver across its *plausible range* with the rest at base. The range is the argument; a ±10% flinch around your guess is theater. If churn could be 1.5% or 5%, sweep 1.5% to 5%.

**Tornado** — run every driver across its range, record the swing, sort descending. The top bar is the whole finding. It routinely reveals that the input the team argued about for a week moves the answer by 2%, while the number somebody typed from memory moves it by 60%. The wide bar is where the next hour of research goes; the narrow bars are where you stop working. A sorted table of `driver | low | high | output swing` carries the same information as a chart and belongs in the memo.

**Break-even on the killer assumption** — instead of "what's NPV at 3% churn," ask "at what churn does NPV cross zero?" Then say it plainly: "this works if churn stays under 3.4%/mo `[est: models/roi.py]`; comparable SMB tools run 2–5% `[fact]`, so we're betting on the good half of the band." That sentence is the analysis — it converts a model into a bet a human can accept or reject.

**Scenarios** are a supplement, not a substitute: three internally coherent worlds where drivers move together the way they actually correlate (high growth pulls CAC up, not down). Never build a worst case by moving every driver to its worst value independently — the joint probability is near zero and it makes the downside look absurd, which gets the whole model dismissed.

---

## Pass 4 — The decision memo

**Output:** `decisions/<YYYY-MM-DD>-<slug>.md`

The artifact the decision gets made from and the record of why. Two jobs, and the second is the one people skip: **make the call, and make it possible to find out you were wrong.**

A memo with no "what would change my mind" section is advocacy, not analysis. That section is load-bearing — it converts an opinion into a bet, tells the reader where to aim their disagreement, and gives the future a way to grade you. Write it first if you have to. If you genuinely can't name anything that would change your mind, you didn't do analysis, and the memo should say so.

### Section order (fixed)

| Section | The question it answers | Fails when |
|:---|:---|:---|
| **Recommendation** | What are we doing? | Hedged into unfalsifiability — "consider exploring" |
| **The decision** | What call is on the table, by when, by whom? | Left implicit, so the memo argues with itself about scope |
| **Reversibility** | One-way or two-way door? What's the exit cost? | Skipped, so the evidence bar gets set by mood |
| **Options considered** | What else was on the table, and why not? | Two strawmen and the answer |
| **Evidence** | What do we know, how well? | Ungraded claims, no dates, numbers with no file behind them |
| **The key assumption** | What single thing does this rest on? | Buried in a list of ten, all weighted equally |
| **Strongest counterargument** | What's the best case against this? | The easy objection you can knock down |
| **What would change my mind** | What observation flips this? | Absent, or too vague to ever trigger |
| **Next step** | What happens Monday, and who owns it? | "Align stakeholders" |

### One-way vs two-way doors

Most decisions are two-way doors — walk through, look around, walk back at modest cost. A minority are one-way: a signed lease, a shipped public API, a database you migrated onto, a public price change.

**Reversibility sets the evidence bar. Nothing else does.**

| Door | Bar | Failure mode |
|:---|:---|:---|
| **Two-way** | Decide on what you have. Bias to action; the experiment is cheaper than the analysis. | Treating it as one-way — six weeks of research to justify something you could have tested in three days. The more common and more expensive error, because nobody gets blamed for over-analysis. |
| **One-way** | Slow down. Steelman the rejected option. Name the assumption. Demand grade-A evidence on the part that can't be undone. | "We can always revisit" about something you provably cannot revisit. |

Two complications worth stating when they apply. Doors have hinges that rust — a two-way door becomes one-way once customers depend on it, so what matters is reversibility at the moment you'd actually want to reverse. And people misclassify in a predictable direction: **the pressure is always to call a one-way door two-way**, because that licenses moving fast. Ask what undoing it costs in dollars, weeks, and credibility. If the answer includes "we'd have to tell customers," it's one-way.

### Surviving disagreement

**Steelman the rejected option.** Build the strongest version of the case against your recommendation — the version its best advocate would make, with their best evidence — then say precisely why you're not persuaded. The test: could the person who prefers option B read your paragraph on option B and say "yes, that's my argument"? If not, you haven't understood it and you can't have rejected it on the merits.

**State the strongest counterargument in your own words.** Not the easy one — the one that actually worries you. If the reader finds a hole you didn't name, everything else you wrote is now suspect. If you named it first, you've shown you looked.

**Name the key assumption, singular.** Most calls rest on one thing, and the tornado told you which. Promote it out of the list: "This works if we hold churn under 3.4%/mo `[est: models/roi.py]`. Comparable tools run 2–5% `[fact]`. We are betting on the good half of that band." That's a sentence someone can disagree with productively, which is the point.

**Falsifiers need an observable, a threshold, and a date.** "If growth disappoints" is not a falsifier. "If we're under 40 paying accounts by 2026-12-01, the channel assumption is wrong and we stop" is. Write it before the outcome is known, because otherwise you'll renegotiate it afterward, unconsciously.

**Say "I don't know" where you don't.** A memo with two honest gaps beats one with zero admitted gaps — the reader can calibrate the first and can only distrust the second. Unknowns from pass 2 carry through as unknowns; they don't quietly become estimates on the way.

The full skeleton is in [`output-templates.md`](./output-templates.md) §6.

### The gate

The memo's recommendation decides whether passes 5–8 run. *Build* opens the gate. *Don't build*, *park*, *validate first* — all close it. Write the memo, finish the root README, hand it over, and say the build layer wasn't written and why. A no-go is a complete run, and it's usually the more valuable one.

---

## Pass 5 — Product spec

**Output:** `build/spec.md`

The contract between a decision and the code. The memo said *build this thing*; the spec says *exactly this thing, and here's how we'll know it's the thing*.

**A requirement with no acceptance criterion is a wish.** "The app should be fast" can't be built, tested, or argued with. "P95 page load under 2s on a mid-tier Android over 4G `[assum: our users' modal device]`" can. Any line a reasonable engineer could satisfy two incompatible ways is a defect — it gets discovered during integration and relitigated as a scope fight.

**What a spec is not:** a feature list ("login, dashboard, settings, export" is a table of contents); a design doc (*what and why*, not *how* — "users can recover a forgotten password" is spec, "send a JWT reset token via SendGrid" is architecture); or a wish list ranked by enthusiasm.

**User stories.** *As a `<user>`, I want to `<action>`, so that `<outcome>`.* The `so that` is the part that gets dropped and the part that matters — it's the only thing that lets a reviewer ask whether the action serves the outcome. Faked by tautology: "As a user, I want a pipeline manager, so that I can manage my pipeline." The outcome has to reach outside the product: "…so that I stop losing deals I forgot to follow up on."

Every story carries acceptance criteria written so QA and the author read them the same way. Given/When/Then is a good default and doubles as the test case.

**MoSCoW, honestly.** The universal corruption is that everything becomes a Must.

- **Must** — the product is pointless without it. Not "important," *load-bearing*. Test: cut it, and is this still a coherent thing that delivers the core value from the memo? If yes, it wasn't a Must.
- **Should** — painful to omit, works without it. Ships in v1.1.
- **Could** — cheap and opportunistic. First cut when the estimate comes back over.
- **Won't** — explicitly out of scope for this version, written down so it stops being reintroduced. **The Won't list is the most valuable part of the spec.** An unwritten "won't" gets rebuilt as a "surely we should" three weeks in.

**The MVP is the smallest thing that tests the key assumption from the memo** — not the smallest impressive thing, and not v1 of the real product. If the memo bet that people will pay to automate X, the MVP is the thinnest slice that makes someone pay to automate X.

**Non-functional requirements are requirements.** Target platforms and their floor, the P95 latency budget, the concurrent-user figure the architecture must survive (from the sizing in pass 1, tagged, not invented), the data-sensitivity and compliance surface. Omit them and the architect invents them, optimistically.

Any feature that can't be walked back to the decision or a validated job is `[assum]` — say so in the open questions. Unvalidated features are the single biggest source of wasted build.

---

## Pass 6 — Technical architecture

**Output:** `build/adr-<nnn>-<slug>.md`, one per decision that matters

An architecture is a decision with a cost and a reversibility class, and it gets the same treatment as any other decision here. The dominant failure isn't picking the "wrong" stack — it's picking one for reasons that never get written down (what the engineer already knows, what's fashionable) with no cost and no reversibility attached, so the choice can never be argued with.

**Boring by default; novelty must be earned.** A boring stack fails in ways someone has already hit, blogged about, and fixed. This is budget allocation, not conservatism: a team has a small number of innovation tokens before the operational surface area sinks the project. Spend them where the novelty *is* the product's edge. Every novel choice answers one question — what concrete business need does this serve that the boring option cannot? "It scales better" for a product with 200 prospective users is a fantasy about a problem you'd be lucky to have.

**Reversibility table:**

| Choice | Door | Why |
|:---|:---|:---|
| Database engine | One-way | Data migration is the project that eats a quarter. |
| Primary language / runtime | One-way | Rewrites are near-total, and you're hiring for it for years. |
| Data model / schema semantics | One-way-ish | Migrating live data with users on it is where the risk lives. |
| Auth & identity model | One-way | Everything depends on it; changing it touches every endpoint. |
| Proprietary cloud primitives | One-way-ish | Lock-in is the cost you don't see until you want out. |
| UI framework | Two-way | Contained to the frontend; expensive but bounded. |
| CSS approach, component library | Two-way | Swappable in an afternoon per screen. |
| Hosting platform (portable app) | Mostly two-way | If you didn't marry proprietary primitives. |

**Spend rigor on the one-way doors; move fast on the two-way ones.** The common error is inverted — a week bikeshedding the CSS framework and an afternoon on the database because someone likes Mongo.

**Build vs. buy vs. borrow.** For every non-core capability — auth, payments, email, search, file storage, analytics — default to buy or borrow. Building auth to save $70/month is how a two-week MVP becomes a two-month security liability. The number people forget is **perpetual maintenance**: built code isn't a one-time cost, it's a liability you service forever. "We can build it in a week" is `[assum]` and historically the most optimistic number in any architecture doc.

**Design for the scale you have, plus one order of magnitude.** A monolith on one boring database serves a startling number of users. Architect for current load and the next 10x from the sizing in pass 1, and leave a note on where the first real bottleneck will be — "here's the seam we'd cut when writes hit ~X/sec `[est]`" beats building the seam now. Microservices are an organizational answer to a team-scale problem, not a technical default.

**Write an ADR only for the choices that matter** — the one-way doors, the build-vs-buys, the load-bearing tradeoffs. Never a ceremonial ADR for `axios` vs `fetch`. Each carries a **cost envelope**: monthly infrastructure and per-service cost at launch and at target scale, traceable to pricing pages `[fact]` and usage assumptions `[assum]`, fed back into the model. An architecture with no dollar figure attached is a diagram, not a decision. Skeleton in [`output-templates.md`](./output-templates.md) §8.

---

## Pass 7 — Build estimate

**Output:** `models/estimate.py` (executed) → `build/estimate.md`

A build estimate is a model and lives under the same law as pass 3: assumptions hoisted and tagged, a range not a point, a sweep that names the driver the timeline hangs on, computed in Python. A schedule is a P&L measured in weeks; it fabricates the same way and it's defended the same way.

**The planning fallacy** is the dominant failure. People estimate by imagining the project going as planned — the inside view — and systematically ignore that projects never go as planned, not from bad luck but because the unplanned is the norm. The correction is structural, not "add buffer to feel safe."

- **Inside view** — decompose, estimate each part, sum. Feels rigorous. Reliably 2–3x optimistic, because the decomposition only contains work you can currently see, and integration, rework, and the ambiguous requirement are exactly what you can't see from here.
- **Outside view (reference-class forecasting)** — find how long comparable things actually took: the last three features of similar size, a published build log, the last time anyone integrated this payment provider. It already contains the surprises, because it's measured from reality.

**Do both, lead with the outside view, and when they disagree the inside view is the one that's wrong.** If your bottom-up sum says 3 weeks and the last two comparable features took 7, the honest estimate is ~7 — not 3, and not the average.

**Three-point ranges.** Optimistic / most likely / pessimistic per task, combined in Python. PERT `(O + 4M + P) / 6` for the expected value, `(P − O) / 6` for the standard deviation, reported as "≈M, 80% likely within [low, high]." The math is trivial; the discipline is refusing to collapse it because somebody wants one number.

**Uncertainty compounds.** Ten tasks each "about 3 days" is not 30 days — the uncertainties accumulate rather than cancel, and a slip in task 3 stalls tasks 4–7. Sum the expected values, sum the variances for independent tasks, take the square root for the total standard deviation, and the aggregate range widens honestly the way real schedules do. Then sweep it: which single task's uncertainty dominates total variance? That task is the schedule risk, and it's almost never the one the team argued about in standup.

**The multipliers people leave out**, each a named tagged constant in the model rather than a vague "+20% buffer" that gets cut first: integration and wiring, testing and bug-fixing (often as large as the initial build), code review and iteration, the spec's open questions resolving into more work, environment/deploy/CI, coordination overhead, and an unknown-unknown reserve sized from the reference class's historical overrun.

```python
TESTING_TAX     = 0.40   # [fact: last 3 features, git history — test+fix vs build]
INTEGRATION_TAX = 0.20   # [assum: no prior integration with this provider]
UNKNOWN_RESERVE = 0.25   # [est: reference class overran base by ~25% median]
TEAM_VELOCITY   = 3.5    # productive dev-days/week/dev [fact: last quarter]
BLENDED_COST_D  = 900    # fully-loaded $/dev-day [fact: comp + overhead]
```

**Report the range and the date it implies, never a single week count.** Name in one sentence the task whose uncertainty owns the schedule — that's what to de-risk first (spike it, prototype it, renegotiate the requirement) and it's worth more than the estimate. State the reference class you anchored on and its grade; an estimate with no outside view is an inside-view guess and should be labeled one. If the honest range doesn't fit the deadline, **that's the finding** — surface it with the sweep showing what scope would have to be cut, rather than promising the optimistic tail and discovering the truth in week six.

---

## Pass 8 — Build plan

**Output:** `build/build-plan.md`

Turning the spec and the architecture into a sequence that ships value early and lets you learn before the budget is gone. The point of slicing is to test the memo's bet with real users before you've spent the whole estimate — not to build tidily.

**Build vertically, not horizontally.** The most expensive delivery mistake is horizontal layers — the whole database, then the whole API, then the whole UI — because nothing is demonstrable or shippable until the last layer lands, which is exactly when you discover the layers don't fit and the thing nobody wanted got built in full.

Instead: a **walking skeleton** first — the thinnest path from UI to database that actually runs and deploys, doing one trivial thing for real. It proves the one-way-door assumptions from pass 6 while they're still cheap to change. Then each slice adds one Must-story end to end.

**Sequence by risk and learning, not by comfort.** Easy-first feels productive and is usually wrong.

1. **Riskiest assumption first** — the one-way-door bet, the integration nobody's done, the feature the value prop rests on. Build or spike it while there's budget and time to react to a bad answer. From pass 7's variance sweep, the schedule-owning task and the risk-owning task are often the same task.
2. **Highest learning-per-day next** — whatever teaches you most about whether the memo's bet holds. Ship it to someone real as early as it's coherent.
3. **Then the merely necessary** — the CRUD, the settings screen, the plumbing.

**Definition of done, written before the work.** Without it, "done" drifts to "the happy path ran once on my machine," and the gap between that and shippable is where deadlines die. A story is done when its acceptance criteria pass including the ugly cases (empty states, error paths, slow network, hostile input); it has tests at the level that matters running in CI, concentrated where failure costs the most — money, auth, data loss; input is validated at the boundary and nothing secret is logged; and it's deployed somewhere a person can use it, not merged.

**Cutting scope is the skill that saves the project.** When the estimate meets the deadline and loses, scope is the honest lever — not quality (cut it and you ship a liability), not the deadline (often externally fixed), not "work harder." Could → cut first, Should → cut next, Must → defend. Cutting into Must isn't a scheduling problem, it's a signal the MVP was scoped as a product; reopen the spec.

Two failure modes to name on sight. **Gold-plating** — polishing past what the bet needs, on something you haven't validated anyone wants; every hour there is stolen from proving the bet. **The 90% trap** — the last 10% (error states, deploy, edge cases, the load-bearing polish) is routinely half the real work.

The plan reads as a sequence of shippable slices, each mapped to the Must-story it delivers and the assumption it de-risks. It closes with **what we learn and when we'd stop**: the earliest point you can test the bet with a real user, and the falsifier from the memo that would make continuing a mistake. A build plan with no "when we'd stop" is a plan to spend the whole budget regardless of what the first users say. Skeleton in [`output-templates.md`](./output-templates.md) §9.

---

<p align="center">
  <a href="../SKILL.md">← business-plan-builder</a> ·
  <a href="./evidence-rules.md">Evidence rules</a> ·
  <a href="./output-templates.md">Output templates →</a>
</p>
