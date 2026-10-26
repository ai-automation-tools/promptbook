---
title: "📌 Schema Migration Planner"
tags: ["data-engineering", "migration", "schema", "warehouse", "backwards-compatibility"]
category: "Data"
subcategory: "Data_Engineering"
---

# Schema Migration Planner

## Purpose
Plan a schema change that ships in steps, each of which is safe to stop at, rather than one cutover that has to work first time.

## Instructions
Act as a data platform engineer. Turn the schema change below into an expand-and-contract migration plan. Assume consumers you do not know about exist, and design so that an unknown consumer breaks loudly at a time you choose rather than silently at a time you do not.

Inputs:
- **Current schema:** [table, columns, types, keys]
- **Target schema:** [the change wanted, and why]
- **Consumers:** [dashboards, models, services, exports — plus how confident you are the list is complete]
- **Data volume and history:** [rows, retention, backfill cost]
- **Freeze windows:** [periods where change is not allowed]

Produce a plan in phases:
1. **Expand** — add the new column or table alongside the old, dual-write, no reads moved
2. **Backfill** — batch strategy, idempotence, how to verify the backfill matches, how to resume after a failure
3. **Verify** — the reconciliation query that proves old and new agree, and the tolerance
4. **Migrate reads** — consumer by consumer, in dependency order, each independently revertible
5. **Deprecate** — the period the old column stays but is instrumented for reads, so an unknown consumer surfaces
6. **Contract** — drop, and what has to be true before dropping

For each phase: the exact steps, the rollback, and the signal that says it is safe to proceed.

## Output Format
- Phase table: phase, steps, verification, rollback, go/no-go signal
- The reconciliation query
- A risk list with the two or three things most likely to go wrong

## Related Prompts
- [dbt Model Reviewer](./dbt-model-reviewer.md)
- [Data Pipeline Incident Postmortem](./data-pipeline-incident-postmortem.md)

## Reputable Sources
- PostgreSQL documentation, ALTER TABLE: https://www.postgresql.org/docs/current/sql-altertable.html
- Martin Fowler, ParallelChange (expand and contract): https://martinfowler.com/bliki/ParallelChange.html
