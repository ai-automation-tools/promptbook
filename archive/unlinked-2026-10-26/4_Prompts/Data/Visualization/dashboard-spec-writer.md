---
title: "📌 Dashboard Spec Writer"
tags: ["data-visualization", "dashboard", "analytics", "requirements", "bi"]
category: "Data"
subcategory: "Visualization"
---

# Dashboard Spec Writer

## Purpose
Write a dashboard specification that starts from the decisions it serves, so the result is not a wall of charts nobody acts on.

## Instructions
Act as an analytics lead. Write a specification for the dashboard requested below. Begin by asking what changes as a result of looking at it — any chart that does not change a decision does not go on the dashboard.

Inputs:
- **Requester and audience:** [who opens it, how often, for how long]
- **Decisions it supports:** [list them; if the answer is "to keep an eye on things", push back and ask for the specific worry]
- **Available data:** [tables, grain, freshness, known gaps]
- **Existing reporting:** [what this replaces or duplicates]

Specify:
1. **Top-line** — the two or three numbers that answer "is anything wrong", each with a comparison so the number has meaning
2. **Diagnostic layer** — the breakdowns someone reaches for once the top line looks wrong
3. **Per chart** — the question it answers, the metric definition, the filters, the default time range, the chart type, and the action it triggers
4. **Filters and defaults** — what is filtered globally, what is per chart, and the default state a first-time viewer sees
5. **Freshness** — the refresh cadence, and how staleness is shown on the page rather than assumed
6. **Explicitly out of scope** — the charts requested but not built, with the reason
7. **Retirement** — the condition under which this dashboard should be deleted

## Output Format
- Layout sketch in text, top to bottom
- Chart table: question answered, metric, filters, chart type, action it triggers
- Out-of-scope list with reasons
- Definition links for every metric used

## Related Prompts
- [Chart Type Selector](./chart-type-selector.md)
- [Metric Definition Writer](../Analysis/metric-definition-writer.md)

## Reputable Sources
- Google SRE Workbook, monitoring and dashboards: https://sre.google/workbook/monitoring/
- Vega-Lite documentation: https://vega.github.io/vega-lite/docs/
