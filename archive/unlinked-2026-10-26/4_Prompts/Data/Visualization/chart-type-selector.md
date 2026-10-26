---
title: "📌 Chart Type Selector"
tags: ["data-visualization", "charts", "analytics", "communication", "design"]
category: "Data"
subcategory: "Visualization"
---

# Chart Type Selector

## Purpose
Pick the chart from the question being asked and the shape of the data, rather than from what the tool offers first.

## Instructions
Act as a data visualization specialist. Recommend a chart for the situation below, and say plainly what each rejected alternative would have hidden.

Inputs:
- **Question the chart must answer:** [one sentence, phrased as a question]
- **Data shape:** [number of series, number of categories, time or not, aggregated or raw]
- **Audience:** [who reads it and how long they will look]
- **Medium:** [dashboard, slide, printed report, small screen]

Work through:
1. **The comparison type** — is this a part-to-whole, a change over time, a distribution, a relationship between two variables, a ranking, or a deviation from a target? Name it before naming a chart
2. **The recommended chart**, and the encoding for each variable — position, length, colour, size — in that order of preference, since position and length are read most accurately
3. **Axis decisions** — zero baseline required or not, log scale or not, and why
4. **Colour** — sequential, diverging or categorical, and the number of colours the audience can actually distinguish
5. **Rejected alternatives** — for each, what it would have obscured
6. **When the chart is the wrong answer** — cases where a sorted table or a single number reads better

Refuse dual y-axes, 3D effects, and pie charts with more than four slices, and say why in one line.

## Output Format
- Recommended chart with the encoding for every variable
- Rejected alternatives table: chart, what it hides
- A plain-language title for the chart that states the finding rather than the subject

## Related Prompts
- [Dashboard Spec Writer](./dashboard-spec-writer.md)
- [Accessible Chart Review](./accessible-chart-review.md)

## Reputable Sources
- Cleveland and McGill, graphical perception research summary: https://www.jstor.org/stable/2288400
- Vega-Lite documentation: https://vega.github.io/vega-lite/docs/
