---
title: "📌 Metric Definition Writer"
tags: ["data-science", "metrics", "analytics", "governance", "semantic-layer"]
category: "Data"
subcategory: "Analysis"
---

# Metric Definition Writer

## Purpose
Write a metric definition precise enough that two analysts computing it independently get the same number.

## Instructions
Act as an analytics lead maintaining a metric catalogue. Write a full definition for the metric below. Ambiguity is the failure mode — every phrase that could be read two ways must be pinned down.

Inputs:
- **Metric name:** [as people say it out loud]
- **What it is supposed to tell someone:** [the decision it supports]
- **Source tables:** [names and grain]
- **Known disputes:** [where teams currently disagree on the number]

Define:
- **Plain-English statement** — one sentence, no jargon
- **Formula** — numerator, denominator, and the exact filter on each
- **Grain and window** — per user, account or order; daily, weekly or trailing-28; calendar or rolling
- **Time zone and timestamp** — which column, whose clock, and how late-arriving rows are handled
- **Inclusions and exclusions** — internal accounts, test orders, refunds, cancellations, trials
- **Restatement policy** — does history change when a refund lands, and if so how far back
- **Known limitations** — what the metric cannot see
- **Not to be confused with** — the neighbouring metrics it gets mixed up with, and the difference

## Output Format
- Definition card in the structure above
- Reference SQL implementing it exactly
- A worked example on five to ten fabricated rows showing the value it produces

## Related Prompts
- [Analytical SQL Reviewer](./analytical-sql-reviewer.md)
- [Data Quality Check Designer](../Data_Engineering/data-quality-check-designer.md)

## Reputable Sources
- dbt documentation, metrics and the semantic layer: https://docs.getdbt.com/
- DAMA International, DMBOK: https://www.dama.org/
