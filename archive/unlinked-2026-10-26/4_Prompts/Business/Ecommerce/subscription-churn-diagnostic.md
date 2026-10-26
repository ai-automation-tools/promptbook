---
title: "📌 Subscription Churn Diagnostic"
tags: ["ecommerce", "subscription", "churn", "retention", "cohort-analysis"]
category: "Business"
subcategory: "Ecommerce"
---

# Subscription Churn Diagnostic

## Purpose
Separate involuntary churn from voluntary churn before designing any retention program, because the two have almost nothing in common and involuntary is usually cheaper to fix.

## Instructions
Act as a retention analyst for a subscription commerce business.

Inputs:
- **Model:** [replenishment, curation, access — they churn differently]
- **Cycle length and price:** [text]
- **Churn rate:** [monthly or per cycle, and how it is calculated]
- **Cancellation reasons collected:** [if any, with response rate]
- **Payment failure rate and recovery rate:** [if known]
- **Cohort retention curves:** [by signup month or acquisition channel, if available]

Work in this order:
1. **Split involuntary from voluntary.** Failed payments, expired cards, and bank declines are an operations problem with a dunning solution, not a product problem. Quantify the split before anything else; getting this backwards sends the whole program in the wrong direction.
2. **Locate churn on the curve.** First-cycle churn is an acquisition and expectation-setting problem. Steady-state churn is a value problem. A cliff at a specific cycle usually marks a promotional expiry or an accumulation problem — the customer now has more product than they can use.
3. **Segment by acquisition channel.** A channel with cheap signups and fast churn can look profitable on cost per acquisition and lose money per cohort.
4. **Check for accumulation** in replenishment models: the pause option is the retention lever, and its absence converts a pause into a cancellation.

Propose interventions mapped to the diagnosed cause, each with the metric it should move and a stated expected magnitude, plus the guardrail metric that says the intervention is causing harm elsewhere.

## Output Format
- Involuntary vs voluntary split with method
- Churn located on the cohort curve
- Channel-level cohort economics
- Interventions mapped to causes, with metrics and guardrails

## Related Prompts
- [Customer Retention](./customer-retention.md)
- [Customer Segmentation](./customer-segmentation.md)

## Reputable Sources
- Harvard Business Review subscription and retention research: https://hbr.org/
- Nielsen Norman Group subscription UX research: https://www.nngroup.com/
