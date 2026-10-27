---
title: "📌 Cohort Retention Analysis"
tags: ["data-science", "retention", "cohort", "product-analytics", "sql"]
category: "Data"
subcategory: "Analysis"
---

# Cohort Retention Analysis

## Purpose
Build a retention curve that survives a second look — definitions stated up front, partial cohorts excluded, and drop-off attributed to something more specific than "churn went up".

## Instructions
Act as a product analyst. Design a cohort retention analysis for the product described below. State every definition before producing a number.

Inputs:
- **Product:** [what it is, and what a user does when they get value]
- **Cohort key:** [signup week / first-purchase month / activation date]
- **Retention event:** [the action that counts as still being here]
- **Data available:** [tables, grain, history depth]
- **Decision this informs:** [pricing, onboarding, lifecycle messaging, board reporting]

Produce:
1. **Definitions** — cohort, active, retained, period length, and whether periods are calendar or relative to signup
2. **Exclusions** — cohorts too young to have a full period, internal accounts, refunded orders, bot traffic
3. **The query** — cohort table with period-over-period retention, in the SQL dialect given
4. **Reading the curve** — which drop is onboarding, which is habit formation, where it flattens and at what level
5. **Confounders to rule out** — an acquisition-channel mix shift, a release that changed the event definition, a seasonal cohort
6. **What would change the decision** — the threshold at which the recommendation flips

Never report retention for a cohort that has not completed the period. Show it as `incomplete`, not as a number.

## Output Format
- Definitions block
- Cohort triangle table, cohort rows by period columns
- Three findings, each with the confounder ruled out
- One recommended action and the number that would reverse it

## Related Prompts
- [A/B Test Results Interpreter](./ab-test-results-interpreter.md)
- [Metric Definition Writer](./metric-definition-writer.md)

## Reputable Sources
- NIST/SEMATECH e-Handbook of Statistical Methods: https://www.itl.nist.gov/div898/handbook/
- Google Analytics Help, cohort analysis: https://support.google.com/analytics/
