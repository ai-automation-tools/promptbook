---
title: "💻 task-router"
name: task-router
description: >-
  Decide how much machinery a request deserves before starting it — answer inline,
  delegate to one subagent, recon-then-plan, or fan out across agents — and pick a
  model tier to match, so a two-line answer doesn't cost a five-agent workflow. Use
  when a request's size or blast radius is unclear, before spawning any subagent or
  workflow, when choosing which model an agent should run on, or when the user asks
  "how should we approach this", "is this a big job", "what's the best way to tackle
  this", "route this", "delegate this", "who should do this", or "which model should
  handle this". Also use when a task spans several repos, domains, or unknown files,
  and before any multi-agent fan-out to confirm the fan-out is actually warranted.
  The cost policy is a parameter — set it once and the routing table follows it.
tags: ["skill","development","automation","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/core/automation/task-router/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Task Router

Pick the **execution shape** first, the **model** second. Wrong shape is the expensive
mistake — a fan-out for a typo burns tokens and wall-clock; an inline guess at an
architecture change burns an afternoon.

> **This skill is the authorization to delegate.** The standing rule in this environment
> is *don't use the Agent tool or Workflows unless the user, a CLAUDE.md, or a skill asks
> for it.* This skill asks for it — but only at the tier it selects. Tier 0 still means
> no agent.

## When to use

- Before spawning **any** subagent or workflow.
- When you can't yet name the files a request touches.
- When a request spans multiple repos, domains, or review axes.
- When choosing which model to hand a delegated task.
- When the user asks how to approach, size, delegate, or staff a piece of work.

**Don't use it** for a request whose target and scope are already obvious — that is
Tier 0 by inspection, and routing it is ceremony.

---

## 1. Model policy — read this first

This is a **hard constraint**, not a preference. It comes before any efficiency argument.

### 🚫 The excluded tier

Most setups have at least one model tier that is off-limits — it bills outside the plan,
it isn't approved, or it costs more than any task here justifies. **Name that tier
explicitly and never pass it**, because tool APIs accept a model name silently: nothing
warns you that you just left your billing plan. If a task seems to want the excluded
tier, it wants the highest permitted one instead.

> **Worked example — the setup this skill was written against.** A Claude Max
> subscription where `fable` (Fable 5.1, `claude-fable-5-1`) bills as direct API tokens
> rather than against the subscription, so it is excluded outright. Substitute your own
> excluded tier; the routing logic below doesn't change.

### The tiers

Named for Claude models below. On another provider, map the three roles — *mechanical*,
*default*, *hard* — onto the equivalent tiers and keep the table's logic.

| Model | Use for | Never for |
|:---|:---|:---|
| **`haiku`** (Haiku 4.5) | Purely mechanical, no-judgment passes — grep sweeps, file inventories, mass renames, formatting, link checks | Anything deciding *what* to change |
| **`sonnet`** (Sonnet 5.5) | **The default.** Documentation updates, basic research and fact-gathering, features, refactors, tests, standard review, release notes | — |
| **`opus`** (Opus 5.5) | Genuinely complex work — architecture, security audits, root-cause debugging, cross-system migrations, anything where a wrong answer is expensive to *detect* | Bulk mechanical work |
| *the excluded tier* | **Nothing. Ever.** | Everything — see above |

**Documentation and basic research are `sonnet`, not `haiku`.** They read as cheap but
they are judgment work: what to include, what's stale, what the source actually says.
Haiku is only for passes where the answer is mechanical.

Omitting `model` inherits the parent's model, which is fine and often correct. When
genuinely unsure between two tiers, take `sonnet`.

---

## 2. Score the request

Answer these before choosing a tier. Each is countable, not a vibe.

| # | Question | Escalates if |
|:--|:---|:---|
| 1 | **Do I know which files change?** | No → at least Tier 2 (recon first) |
| 2 | **How many files?** | 1–3 → Tier 0/1 · 4–15 → Tier 1/2 · 15+ → Tier 2/3 |
| 3 | **How many independent dimensions?** (repos, domains, review axes) | 3+ → Tier 3 |
| 4 | **Is it reversible?** (deploy, delete, force-push, external send, DB write) | No → risk gate, below |
| 5 | **Would two readings produce different work?** | Yes → **ask, don't route** |
| 6 | **Does the answer already exist?** (memory, docs, an earlier turn) | Yes → Tier 0, just say it |

**Risk overrides size.** A one-line change that deploys to production is not Tier 0. Small
and irreversible means: do the work, then stop and confirm before the irreversible step.

**Ambiguity is not complexity.** Q5 firing means the request is underspecified — more
agents will not fix that. One clarifying question beats a confident fan-out.

---

## 3. Pick the tier

### Tier 0 — Inline (no agent)

**When:** the files are known and there are three or fewer, or the answer is recall.
**Do:** just do it. Read, edit, answer.
**This is the default.** Most requests stop here.

### Tier 1 — One subagent

**When:** scoped to one domain, the target is known, and the result is independently
verifiable.
**Do:** one `Agent` call. Agent by domain (§5), model by §1.
**Why bother:** it keeps a large *read* out of the main context. Delegate when the reading
is big, not merely when the writing is.

### Tier 2 — Recon or plan, then act

**When:** you cannot name the files yet, or the change touches shared code where the real
fix is upstream of the reported symptom.
**Do:** `Explore` (locate) or `Plan` (design) → then execute at Tier 0/1 with what came back.
**Never skip to Tier 1 here** — a subagent that has to find its own target will guess.

### Tier 3 — Fan-out

**When:** three or more genuinely independent dimensions **and** the user opted in.
**Do:** parallel `Agent` calls in a single message, or `Workflow` if the user asked for one.
**Gate:** if the dimensions share state or must run in order, it is Tier 2, not Tier 3.

**Escalating a tier costs one more call; de-escalating means throwing away finished work.
Start one tier low.**

---

## 4. Report the decision

State the routing decision in **one line** before acting, so it is cheap to override:

> `Tier 1 · security-auditor · sonnet — scoped to one repo, findings are verifiable.`

Then act. Do not narrate the scoring.

---

## 5. Agent selection

Check the project's `.claude/agents/` first — a project-scoped agent knows the repo.
Fall back to user scope. If nothing fits, `general-purpose`.

| Domain | Agent |
|:---|:---|
| Locate code across many files | `Explore` |
| Design an approach before building | `Plan` |
| Feature spanning DB + API + UI | `fullstack-developer` |
| Backend, schema, auth | `backend-designer` |
| UI, components, styling | `frontend-designer`, `frontend-developer` |
| API contracts, OpenAPI | `api-designer` |
| Tests, characterization | `test-engineer` |
| Security sweep | `security-auditor` |
| Business case, pricing, prioritization | `business-analyst` |
| Reference and API documentation | `technical-writer` |
| Breakdown, sequencing, estimates | `project-manager` |
| Fits none of the above | `general-purpose` |

---

## 6. Calibration

These are the reference points. If a routing decision disagrees with the nearest row,
re-check §2 before overriding it.

| Request | Tier | Model | Shape |
|:---|:---:|:---|:---|
| "Fix the typo in the hero headline" | 0 | — | Edit it |
| "What port does the SSE server bind?" | 0 | — | Recall or one grep |
| "Add a `--dry-run` flag to this script" | 0 | — | Known file, do it |
| "Find every place we read `GEMINI_API_KEY`" | 1 | `haiku` | `Explore`, mechanical |
| "Update the hosting docs for the new subdomain" | 1 | `sonnet` | Docs are Sonnet |
| "Research how Vercel handles cron on the free tier" | 1 | `sonnet` | Basic research is Sonnet |
| "Why is this test flaky?" | 1 | `sonnet` | One agent |
| "Write release notes for the last 10 commits" | 1 | `sonnet` | One agent |
| "Rename this concept across the repo" | 2 | `haiku` after recon | `Explore` → mechanical edit |
| "Our LCP is 4.2s, fix it" | 2 | `sonnet` | `Plan` → Tier 1 |
| "Migrate auth from sessions to JWT" | 2 | `opus` | `Plan` → execute |
| "Audit all 20 repos for leaked secrets" | 3 | `sonnet` | Fan out per repo |
| "Review this PR for bugs, perf, and security" | 3 | `opus` | 3 parallel agents |
| "Make the site better" | — | — | **Ask.** Q5 fired. |

---

## Anti-patterns

- **Passing the excluded model tier.** Ever, for anything — nothing warns you that you just left your billing plan.
- **Sending documentation or research to `haiku`** because it "looks cheap." Both are
  judgment work — they are `sonnet`.
- **Fanning out to look thorough.** Three agents on one dimension is one agent plus noise.
- **Tier 1 with an unknown target.** The subagent will guess at what to change. Recon first.
- **Routing an ambiguous request.** If two readings give different work, ask one question.
- **Treating a small diff as low risk.** Reversibility, not line count, sets the risk gate.
- **Narrating the scoring.** One line, then act.
- **Opus for bulk mechanical work.** That is what the tiers are for.
