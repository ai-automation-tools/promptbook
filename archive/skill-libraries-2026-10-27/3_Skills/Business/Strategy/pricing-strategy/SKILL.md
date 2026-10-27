---
title: "💼 pricing-strategy"
name: pricing-strategy
description: Set or change a price with an argument behind it — choosing the value metric, structuring tiers and packaging, estimating willingness to pay from evidence rather than from competitors' pages, modeling the revenue effect of a change, and running a price increase on existing customers. Use when pricing a new product, restructuring plans, deciding what to meter, questioning whether a price is too low, or planning a migration to new pricing.
tags: ["skill","business","strategy","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/business/pricing-strategy/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Pricing Strategy

## Price is a product decision

Pricing is usually treated as a last step — build the thing, look at two
competitors, land somewhere between them, round to $29. That produces a number with
no argument behind it, and it is close to the highest-leverage decision in the
business: a price change moves margin with no delivery cost attached, and it
selects which customers you get.

The most common error is not picking the wrong number. It is pricing on the wrong
*metric*, which no amount of adjusting the number can fix.

## Start with the value metric

The value metric is what the price scales with. Get this right and the price grows
naturally with the value the customer receives; get it wrong and you spend years
fighting it with discounts and exceptions.

A good value metric:

1. **Tracks the value the customer gets**, not the cost you incur. Customers accept
   paying more for more benefit. They resent paying more for your inefficiency.
2. **Is predictable enough to budget.** A metric that can spike tenfold without
   warning gets a spending cap put on it by procurement, which caps you too.
3. **Is measurable and hard to argue with.** If the customer cannot verify the
   count, every invoice is a negotiation.
4. **Grows as the customer succeeds.** This is what makes expansion revenue happen
   without a sales conversation.

| Metric | Fits when | Watch for |
|:---|:---|:---|
| Per seat | Value scales with people using it | Seat-sharing; teams that get value without logging in |
| Per usage | Value scales with volume | Unpredictable bills; customers optimizing usage down |
| Per outcome | The outcome is attributable and countable | Attribution disputes; long measurement lag |
| Flat platform fee | Value is access, not volume | No expansion path; every customer pays the same |
| Hybrid | A platform fee plus a metered component | Complexity; hard to compare against rivals |

Test a candidate metric against your own customer list: if the biggest users are not
paying meaningfully more than the smallest, the metric is not capturing value.

## Estimating willingness to pay

Never from a competitor's pricing page alone. That tells you what they decided, not
what buyers will bear, and you have no idea whether it is working for them.

**Evidence that carries weight:**

- What the customer spends on the problem today — tools, contractor hours, internal
  staff time. This is the substitute cost and it is the real anchor.
- The value of the outcome, quantified with the customer's own numbers. Hours saved
  times a loaded rate, or error rate times cost per error.
- Actual win/loss data. Deals lost on price, at what price, against whom.
- Discount depth. Salespeople routinely discounting 30% is a pricing signal, not a
  sales problem.

**Structured research** when you have access to enough buyers — the four-question
Van Westendorp battery ("at what price is this too expensive / expensive but worth
considering / a bargain / so cheap you would doubt the quality") produces a range
rather than a point, which is the honest shape of the answer. Treat it as a sanity
check on a range you derived from substitute cost, not as the primary source.

**What does not count:** asking people what they would pay for something they have
not used. Hypothetical willingness to pay is consistently overstated by people being
polite and understated by people anchoring low. It is the weakest input available.

Report willingness to pay as a range with the assumption that drives it named, and
tag the figures by evidence grade.

## Packaging and tiers

Tiers exist to let different segments self-select, not to create the illusion of
choice.

- **Three tiers is the common shape** because it gives a clear default. More than
  four and buyers stall; the cost of an extra tier is paid in decision paralysis.
- **Differentiate on a dimension the buyer already understands** — volume, number of
  users, or a feature they know they need. A tier boundary drawn on an internal
  technical distinction confuses everyone.
- **Put the constraint that grows on the upgrade path.** The thing that pushes a
  customer to the next tier should be the thing that increases as they succeed.
- **Do not put security or basic reliability behind a premium tier** if you sell to
  businesses. Procurement and security review will simply disqualify the lower tiers,
  turning a three-tier ladder into one expensive product.
- **An enterprise tier with "contact us"** is fine and often correct, but only if
  someone will actually answer. An unanswered contact form is worse than a price.

Free tiers deserve their own argument. A free tier is a marketing cost, and it needs
a stated purpose — distribution, a network effect, or a genuine trial — plus a limit
that makes upgrading natural rather than punitive. "Free because everyone has one"
is not a purpose.

## Modeling a price change

Do the arithmetic before the decision, in code, with named assumptions.

The core relationship: a price change moves revenue per customer and moves the
number of customers, usually in opposite directions. What matters is the product.

```python
# Break-even churn for a price increase: how much volume you can lose
# before the increase stops being worth it.
def breakeven_volume_loss(pct_increase: float) -> float:
    """Fraction of customers you can lose and still hold revenue flat."""
    return pct_increase / (1 + pct_increase)


breakeven_volume_loss(0.20)   # 0.167 -> a 20% raise survives losing 16.7%
```

That asymmetry is why underpricing is the more expensive mistake. A 20% increase
holds revenue flat even if one customer in six leaves — and the ones who leave are
usually the most price-sensitive and most support-hungry.

Model at minimum:

- Revenue at the current price and the proposed price, at several churn assumptions.
- The effect on contribution margin, not just top-line revenue.
- The effect on payback period and on customer lifetime value, since both move.
- A sensitivity sweep on the churn assumption, because it is the input you know
  least and it drives the result.

Present a range with the driving assumption named. A single-point revenue
projection from a price change is false precision.

## Raising prices on existing customers

The mechanics matter as much as the number.

- **Grandfather deliberately, with an end date.** Permanent grandfathering creates a
  population you can never move and a growing gap between what you charge and what
  you earn.
- **Give real notice** — a full billing cycle at minimum, more for annual contracts.
- **Pair the increase with something visible** shipped recently. The increase is
  easier to accept next to a change the customer noticed.
- **Tell them yourself, plainly, before the invoice does.** An unannounced increase
  discovered on a credit card statement costs more in goodwill than the increase
  earns.
- **Expect and budget for churn.** Model it, then measure the actual number against
  the model. The gap is the most useful pricing data you will get all year.

## Traps

- **Cost-plus pricing.** Your costs are not the customer's concern and they cap your
  upside at whatever you happened to spend.
- **Matching a competitor's price without matching their cost structure.** A price
  that works for a venture-funded company burning capital may be a slow death for
  you.
- **Pricing on a metric that penalizes success.** If a customer getting more value
  means an unpredictable bill, they will cap usage, which caps value, which caps
  retention.
- **Too many tiers.** Every additional tier is a decision the buyer has to make with
  incomplete information.
- **Never testing upward.** If you have never lost a deal on price, the price is too
  low, and that is a finding worth writing down.
- **Treating the price as permanent.** Pricing is a decision with a review date, not
  a constant. Set the date when you set the price.
