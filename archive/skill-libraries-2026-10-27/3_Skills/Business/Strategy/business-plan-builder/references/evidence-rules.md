# Evidence rules

The rules that keep a `business-plan-builder` run from laundering guesses into a decision. Read this before pass 1. Every other reference in this skill assumes it.

The failure mode here isn't laziness — it's fluency. A model that has read a thousand funding announcements can produce a completely plausible revenue figure for a company that never disclosed one, and once that number is in `analysis/`, nobody downstream can tell it was invented.

---

## 1. Claim tags

Every claim carries one of three tags, inline, in the document. Not in a footnote, not in a methodology appendix nobody reads. When a claim gets copied into a memo, the tag goes with it.

| Tag | Means | Requires |
|:---|:---|:---|
| `[fact]` | Came from a source | A URL (or a filed document identifier) and a retrieval date |
| `[est]` | Derived from facts | The derivation, shown — or a pointer to the model file that computes it |
| `[assum]` | A judgment call | Whose judgment, and why it's reasonable |

**A conclusion inherits the weakest tag in its chain.** Three `[assum]`s do not average into an `[est]`. If a number in a memo can't be walked back to a file, it doesn't go in the memo — no exception for numbers "everyone knows."

Two habits that make the tags real rather than decorative:

- **Tag as you write, not in a cleanup pass.** A retro-tagging pass is where a remembered figure quietly acquires a citation.
- **When sources conflict, show the conflict** and say which you'd bet on and why. Don't average them into a number nobody supports.

---

## 2. Dates

**Get the real date from the environment.** On Windows: `Get-Date -Format yyyy-MM-dd`. A model's internal sense of "today" drifts toward its training cutoff, and a wrong retrieval date silently falsifies every `[fact]` in the repo.

- Every `research/` capture opens with its URL and retrieval date.
- Market data carries an "as of" date in the finding, not just in the source file. A 2023 TAM cited flat in 2026 is wrong, not stale.
- A teardown states the date it goes stale. Competitor pages change without notice; an undated pricing claim is worthless in six months.

---

## 3. Source grading (A–D)

Every claim in competitive work carries a grade alongside its tag: `"Enterprise tier starts at $50k/yr [fact, C, pricing page, 2026-08-17]"`.

| Grade | Means | Examples |
|:---:|:---|:---|
| **A** | Primary, filed, or legally attested | 10-K segment revenue; a granted patent; a filed contract award; a state licensing registry |
| **B** | Credible secondary — independent of the vendor, verifiable | A job posting on their careers page; a dated changelog entry; their API docs |
| **C** | Vendor self-report | Their pricing page, their "10,000 customers" claim, a press release, an analyst quadrant quoting them |
| **D** | Rumor or inference | A Reddit comment; an ex-employee's LinkedIn; your own reasoning from B-grade inputs |

Three rules for using the scale:

1. **A conclusion inherits the worst grade in its chain.** Three C-grade vendor claims don't average into a B.
2. **Check whether your two sources are actually one source wearing two hats.** Corroboration across *independent* sources raises confidence; corroboration across sources that all trace to the same press release raises nothing. This is how trade-press numbers launder themselves into facts.
3. **C is not worthless — it's evidence of a different thing.** A vendor's pricing page is grade-A evidence of what they *want* to charge and who they want to sell to, and grade-D evidence of what they realize per customer. Grade the claim you're making, not the document.

**D-grade material is a hypothesis generator, never a finding.** If a forum thread says a competitor is bleeding enterprise accounts, that's a lead: go look for a change in enterprise-facing job postings, a pricing restructure, a case study quietly removed. Then you have B-grade evidence of something, or you have nothing — and nothing is a reportable result.

---

## 4. Where to look

Work down this list. Most teardowns stop at the website and are worthless for it.

| Source | What it gives you | Grade |
|:---|:---|:---:|
| **SEC filings** (10-K, 10-Q, S-1, 8-K, DEF 14A) | Public companies only, but: segment revenue, customer concentration, named risks, and in an S-1 the cohort data a private company will never volunteer again | A |
| **Court records, patents, trademark filings** | Patents show what they tried ~18 months ago (publication lag); trademark filings often precede product names by months | A |
| **Regulatory / licensing registries** | FCC, FDA, state licensing, procurement awards — existence and dates, not opinion | A |
| **Public procurement / contract awards** | Actual contract values with governments. Rare and gold. | A |
| **Job postings** | Team shape, tech stack, geography, and — the useful part — what they're about to build | B |
| **Changelog / release notes / status page** | Shipping cadence, incident frequency, deprecations | B |
| **GitHub, docs, API references** | Real capability surface. Docs describe what exists; marketing describes what's coming. | B |
| **Review sites** (G2, Capterra, app stores) | Complaint *themes* and named alternatives. Volume is gameable; themes are harder to fake. | C |
| **Pricing page** | Their list price and their segmentation theory | C |
| **Blog, decks, press releases, funding announcements** | Their positioning. Evidence of what they want believed. | C |
| **Analyst quadrants, trade press, "sources say"** | Often recycled vendor claims with a logo on top | C |
| **Forums, Reddit, ex-employee posts** | Hypotheses to go verify | D |

For sizing specifically, the registries are the workhorses: census of business by NAICS/SIC, BLS occupational employment counts, state licensing boards, trade association member counts, and 10-K segment disclosures. These give you a countable unit rather than a percentage of a percentage.

---

## 5. What you can infer

Inference is the value-add of a teardown, and it's legitimate when the mechanism is stated and the output is tagged `[est]`.

- **Hiring → roadmap.** Six ML-infra roles at a company that ships a CRM means something, and the postings name the stack. Job posts are the least-guarded artifact any company produces — legal reviews the press release, not the JD. Track them over time; the *delta* is the signal.
- **Job locations → cost structure and expansion.** A new Warsaw office is a cost-per-engineer decision. A sales role in a new geography precedes the launch.
- **Pricing page → segment and self-perception.** A per-seat floor of $500/mo says they've given up on SMB. Removing a free tier says CAC hurts. The lowest tier tells you who they've abandoned; "contact us" tells you deal size is big enough to be worth a human.
- **Changelog cadence → team size and health, roughly.** Weekly releases across four surfaces implies engineering scale. A changelog that goes quiet for five months at a funded company implies a re-platform, an acquisition integration, or trouble — say which you'd bet on and why.
- **Docs and API surface → real capability.** Marketing claims an integration; the docs show whether it's read-only. Docs are written by people who'd get the support tickets if they lied.
- **Deprecations and sunset notices → strategy.** What they're killing is a louder signal than what they're launching, and far less spun.
- **Case-study churn → account health.** A logo that disappears from the customer wall is a lead, not a fact. Archive.org makes it checkable.

---

## 6. What you cannot infer

**Revenue, churn, margins, CAC, burn, and runway are unknowable for a private company from public sources. Flag them as unknowable. Do not estimate them.**

This is the hard line. The tempting move — headcount × $200k revenue-per-employee, or funding round ÷ an assumed multiple — produces numbers with error bars so wide they carry no information, and the appearance of an estimate is worse than the acknowledged gap because it stops the reader asking. Revenue per employee varies by 10x across companies in the same category. Funding raised tells you what a VC believed about a story, at a moment, under deal pressure — not what the business does.

Also unknowable from outside: actual discounting off list, contract length, gross retention vs net, concentration risk, unit costs, and whether that impressive logo is a $2M account or a free pilot.

Write it like this:

> **Revenue:** not determinable from public sources. They have never disclosed; no filings. If this decision hinges on their revenue, we need a different method — customer references, channel checks, or a paid data provider — and that's a scope decision, not an analysis gap I can close.

That sentence is more useful than any number you could have written, because it routes the problem correctly.

The exception is a public company or a live S-1, where these figures are grade A — and you read the actual filing, not the coverage of it.

**Every teardown carries an explicit "Unknown / not determinable" section.** It's mandatory and it isn't a failure. It's what stops someone else inventing the numbers later.

---

## 7. The research line

Public sources only. This isn't squeamishness — pretexting is fraud in several jurisdictions, and the downside of getting caught dwarfs any finding.

- **No pretexting.** Never misrepresent who you are or why you're asking — not to their sales team, their support, their customers, candidates, or a former employee.
- **No posing as a customer.** Booking a demo under false pretenses to mine a roadmap is pretexting with a calendar invite.
- **No scraping behind auth, no bypassing paywalls or rate limits, no accepting credentials.** Anything requiring a login you shouldn't have or a ToS you'd have to break is off the table. Archive.org and search caches of public pages are fine.
- **No confidential material** — no ex-employee documents, no leaked decks, no material non-public information, no asking anyone to violate an NDA.
- **No inducing a breach.** Asking a competitor's employee what they're building puts *them* in breach even when you've broken no rule yourself.
- **Never paste the user's private or NDA'd material into a web search** or a third-party tool. If the idea arrived under confidence, research the market around it rather than the idea itself.

If a finding would require any of the above, it does not exist. Report the gap.

---

## 8. The no-sources run

Sometimes there's no web access, or the idea is too novel for anything to exist. That's a legitimate run with one obligation: **say so in the first paragraph of the root README**, set the evidence badge to `unsourced_·_hypothesis`, and tag every figure `[assum]`.

A structured hypothesis with named assumptions and a sensitivity sweep is genuinely useful — it tells the user which number to go find first. What's not acceptable is the same document with the tags quietly upgraded.

---

<p align="center">
  <a href="../SKILL.md">← business-plan-builder</a> ·
  <a href="./analysis-passes.md">The eight passes</a> ·
  <a href="./output-templates.md">Output templates →</a>
</p>
