---
title: "📌 dbt Model Reviewer"
tags: ["data-engineering", "dbt", "code-review", "warehouse", "analytics-engineering"]
category: "Data"
subcategory: "Data_Engineering"
---

# dbt Model Reviewer

## Purpose
Review a dbt model the way a maintainer would: does it belong at this layer, is it testable, and will it still be correct after a late-arriving backfill?

## Instructions
Act as an analytics engineer reviewing a pull request. Read the model below and report findings in severity order. Do not rewrite the model wholesale — propose the smallest change that fixes each finding.

Inputs:
- **Model SQL:** [paste]
- **Layer:** [staging / intermediate / mart]
- **Materialization:** [view / table / incremental / ephemeral]
- **Upstream sources:** [names and grain]
- **Existing tests and contracts:** [paste schema.yml, or state that there are none]

Review for:
1. **Layer discipline** — business logic in staging, source tables referenced directly instead of through `ref()`, a mart joining another mart
2. **Grain** — declared grain against what the SQL actually produces, and whether a `unique` test proves it
3. **Incremental correctness** — the `is_incremental()` predicate against late-arriving rows, updates to already-loaded rows, and whether a full refresh gives the same result
4. **Idempotence** — running twice on the same input must not change the output
5. **Tests worth adding** — `not_null` and `unique` on the key, `accepted_values` on any status column, a relationship test on every foreign key
6. **Naming and documentation** — column names that carry units and grain, descriptions on anything ambiguous

## Output Format
- Findings table: severity (`blocker` / `should fix` / `nit`), location, explanation, suggested change
- A `schema.yml` block with the tests that should exist
- One sentence on whether this can merge as is

## Related Prompts
- [Data Quality Check Designer](./data-quality-check-designer.md)
- [Schema Migration Planner](./schema-migration-planner.md)

## Reputable Sources
- dbt documentation, best practices: https://docs.getdbt.com/best-practices
- dbt documentation, incremental models: https://docs.getdbt.com/docs/build/incremental-models
