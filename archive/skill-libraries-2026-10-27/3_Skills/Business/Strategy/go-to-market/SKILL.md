---
title: "💼 go-to-market"
name: go-to-market
description: Plan how a product actually reaches buyers — segment and beachhead selection, positioning against the alternative the buyer would otherwise pick, choosing channels that fit the price point and sales motion, sequencing a launch, and setting the CAC and payback math that says whether the plan can work. Use when planning a launch, deciding where to spend acquisition effort, writing positioning, or diagnosing why a product with real users is not growing.
tags: ["skill","business","strategy","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/business/go-to-market/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Go-to-Market

## The gap this closes

A product can be good, correctly priced, and still reach nobody. Go-to-market is the
argument for how a specific buyer finds out this exists, decides it is for them, and
buys — and whether the cost of making that happen is less than what they are worth.

Two failures dominate. The first is a channel plan that does not match the price
point: enterprise-style sales motions attached to a $20/month product, or pure
self-serve attached to a product that needs a security review. The second is
positioning written against an idealized competitor instead of against what the
buyer would actually do otherwise, which for most products is nothing.

## Pick a beachhead, not a market

"Small and medium businesses" is not a segment. It is a census category. A segment
you can go to market against has four properties:

1. **Reachable** — there is a place where they already gather, a list you can get,
   or a search they already run. If you cannot name how you would reach 100 of them
   this month, it is not a segment yet.
2. **Homogeneous in the problem** — they have the same version of the pain, so one
   message works for all of them. A message that has to be rewritten per prospect
   means the segment is really several.
3. **Has budget and an owner** — someone in it can approve the spend.
4. **Small enough to win a meaningful share of**, and adjacent to a larger one you
   can expand into.

Choosing narrow feels like leaving money on the table and is almost always right
early. A segment you can dominate produces references, case studies, and word of
mouth inside a network that talks to itself. A broad launch produces scattered users
in unrelated contexts, none of whom can refer another.

Write down the expansion path from the beachhead. A beachhead with no adjacency is
just a small market.

## Position against the real alternative

Positioning is a comparison. The buyer is choosing between you and something, and
the something is usually one of these:

| Alternative | What positioning has to do |
|:---|:---|
| Doing nothing | Make the cost of the status quo visible and specific |
| A spreadsheet or manual process | Compete on time and error rate, not features |
| An incumbent product | Name the specific thing they do badly, without disparaging the whole |
| Building it internally | Compete on opportunity cost and maintenance, not on capability |

Doing nothing wins more deals than any competitor, and it is the one most positioning
ignores.

A usable positioning statement answers four things in a sentence or two: who it is
for, what category it belongs to, the one thing it does better than the alternative,
and why that claim is credible. If the "why credible" part is missing, you have a
slogan.

Two tests before it ships:

- **The competitor test.** Could a competitor put their name on this sentence? If
  yes, it says nothing.
- **The rejection test.** Does it make some buyers self-select out? Good positioning
  repels the wrong buyer on purpose. Positioning that offends nobody attracts nobody.

## Match the channel to the motion

The price point determines what sales motion is affordable, and the motion
determines which channels can work. Getting this backwards is expensive and slow to
notice.

| Annual contract value | Affordable motion | Channels that fit |
|:---|:---|:---|
| Under ~$1k | Self-serve only | Content and search, community, product-led loops, integrations and marketplaces |
| ~$1k–15k | Low-touch, inside sales | Above, plus outbound email, webinars, review sites, partner referral |
| ~$15k–100k | Inside sales with demos | Outbound, events, partners, analyst and review presence |
| Over ~$100k | Field sales | Relationships, references, channel partners, industry events |

The arithmetic that governs it: a salesperson's fully-loaded cost divided by the
deals they can close in a year sets a floor on contract value. If the floor is above
your price, the motion cannot work no matter how good the salesperson is.

Pick two channels to start, not six. Each channel needs enough sustained effort to
produce a readable signal, and a half-worked channel produces noise that looks like
failure. Add a third only when one of the first two is working or has been honestly
declared dead.

## The acquisition math

Do this before the launch, not after the first quarter's spend.

- **CAC by channel**, fully loaded — ad spend plus the people time it consumes.
  Content and community look free and are not; they cost salary.
- **Payback period** — months of contribution margin to recover CAC. Under twelve
  months is comfortable for most software businesses; beyond eighteen you are
  financing growth out of capital you may not have.
- **LTV to CAC**, computed from real retention once you have any, and flagged as an
  assumption while you do not. Early LTV estimates are among the least reliable
  numbers in a business plan because they extrapolate from months of data to years
  of behavior.
- **Sales cycle length**, which determines how long before you can read the result.
  A ninety-day cycle means a channel test started today reports in the next quarter.

Model these per channel, not in aggregate. An aggregate CAC hides that one channel
is carrying the whole result and another is a pure loss.

## Sequencing a launch

Treat a launch as a sequence with gates, not a date.

1. **Design partners** — a handful of real users, deeply supported, in exchange for
   honest feedback and eventually a reference. The gate is whether they keep using
   it unprompted.
2. **Quiet availability** — open to people who find you, without announcement. The
   gate is whether onboarding works without you in the room.
3. **Channel tests** — the two chosen channels, run long enough to read. The gate is
   a CAC within range on at least one.
4. **Public launch** — the announcement, once there is something to point at and a
   funnel that converts.

Launching at step four first is the standard mistake. It spends the one-time
attention of your network on a product that cannot yet convert it.

Each gate needs a stated criterion before you start, and a kill condition. "We will
stop spending on this channel if CAC exceeds X after Y weeks" is what keeps a channel
test from becoming a permanent line item.

## Diagnosing a product that is not growing

Find the stage that is broken before changing anything, because the fixes are
unrelated and usually applied to the wrong stage.

| Symptom | Likely broken |
|:---|:---|
| Little traffic, good conversion | Awareness — channel reach |
| Traffic, poor signup | Positioning or the landing page promise |
| Signups, poor activation | Onboarding, or the wrong segment showing up |
| Activation, poor retention | The product, or a problem that is real but not recurring |
| Retention, no growth | No referral or expansion loop |
| Good metrics, unprofitable | CAC exceeds value — pricing or channel mix |

The last row is the one most often misdiagnosed as a marketing problem. It is
usually a pricing decision.

## Traps

- **A launch plan with no kill conditions.** Every channel then runs forever because
  stopping feels like admitting failure.
- **Positioning by feature list.** Features are evidence for a claim, not the claim.
- **Assuming the beachhead's behavior generalizes.** The next segment buys
  differently. Re-test rather than scale the same motion into it.
- **Counting content and community as free.** They are among the most expensive
  channels in people time, and the cost is invisible because it is salary.
- **Reading a channel test before the sales cycle has elapsed.** You are measuring
  noise and will kill something that was working.
- **One channel carrying everything without anyone noticing.** Report CAC per
  channel or the concentration risk stays hidden until the channel changes its
  algorithm.
