---
title: "📌 Data Quality Check Designer"
tags: ["data-engineering", "data-quality", "observability", "testing", "pipelines"]
category: "Data"
subcategory: "Data_Engineering"
---

# Data Quality Check Designer

## Purpose
Design the checks for a dataset so that a broken upstream fails loudly on the pipeline instead of quietly in a dashboard three weeks later.

## Instructions
Act as a data platform engineer. Propose a check suite for the dataset below. Every check must name the failure it catches and what should happen when it fires — a check with no owner and no action is noise that trains people to ignore alerts.

Inputs:
- **Dataset:** [name, grain, refresh cadence, row volume]
- **Upstream sources:** [systems and their reliability history]
- **Downstream consumers:** [dashboards, models, reverse ETL, external reports]
- **Past incidents:** [what has actually broken before]

Propose checks in four tiers:
1. **Structural** — schema drift, column type changes, unexpected new or dropped columns
2. **Volume and freshness** — row count against a trailing baseline with a stated tolerance, max timestamp against the cadence
3. **Semantic** — uniqueness of the key, null rates per column against a baseline, referential integrity, accepted value sets, sums that must reconcile with a source of record
4. **Distributional** — shifts in a numeric column's median or a categorical column's mix, with a stated threshold and the reason it was chosen

For each check give: the rule, the threshold and where the threshold came from, severity, the owner, and the runbook action on failure. Mark any check that will be noisy on the first run and say how to season it.

## Output Format
- Check table: name, tier, rule, threshold, severity, owner, action on failure
- A short list of checks deliberately not added, with the reason
- A note on which checks should block the pipeline and which should only alert

## Related Prompts
- [dbt Model Reviewer](./dbt-model-reviewer.md)
- [Data Pipeline Incident Postmortem](./data-pipeline-incident-postmortem.md)

## Reputable Sources
- Great Expectations documentation: https://docs.greatexpectations.io/
- Google SRE Workbook, alerting on SLOs: https://sre.google/workbook/alerting-on-slos/
