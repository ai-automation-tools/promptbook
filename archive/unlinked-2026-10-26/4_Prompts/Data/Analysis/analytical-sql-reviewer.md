---
title: "📌 Analytical SQL Reviewer"
tags: ["data-science", "sql", "code-review", "analytics", "warehouse"]
category: "Data"
subcategory: "Analysis"
---

# Analytical SQL Reviewer

## Purpose
Review an analytical query for correctness first and cost second, because a fast query that double-counts is worse than a slow one that does not.

## Instructions
Act as an analytics engineer reviewing a colleague's SQL. Read the query below and report what it actually computes, then what it was meant to compute, then the gap between them.

Inputs:
- **Query:** [paste SQL]
- **Warehouse:** [BigQuery / Snowflake / Postgres / DuckDB / other]
- **Intended result:** [one sentence — what number should come out]
- **Table grains:** [one row per what, for each table joined]

Check, in this order:
1. **Fan-out** — any join to a table at a finer grain that inflates a `SUM` or `COUNT`
2. **Null semantics** — `NOT IN` against a nullable column, inequality filters that silently drop nulls, outer joins filtered in `WHERE` instead of `ON`
3. **Deduplication** — `DISTINCT` covering a mistake rather than expressing intent
4. **Date boundaries** — half-open against closed ranges, the time zone of the timestamp column, DST
5. **Window frames** — a default `RANGE` frame where `ROWS` was meant
6. **Cost** — partition and cluster keys unused, `SELECT *` into a CTE, a cross join hiding in a comma list

## Output Format
- **What this query returns:** plain-English description of the real result
- Findings table: severity (`wrong` / `risky` / `slow`), line reference, explanation, fix
- A corrected query, with a comment on each changed line

## Related Prompts
- [Exploratory Data Analysis Plan](./exploratory-data-analysis-plan.md)
- [dbt Model Reviewer](../Data_Engineering/dbt-model-reviewer.md)

## Reputable Sources
- BigQuery query optimization guidance: https://cloud.google.com/bigquery/docs/best-practices-performance-overview
- PostgreSQL documentation: https://www.postgresql.org/docs/current/
