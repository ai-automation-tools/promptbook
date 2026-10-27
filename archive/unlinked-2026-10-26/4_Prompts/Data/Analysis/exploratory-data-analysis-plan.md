---
title: "📌 Exploratory Data Analysis Plan"
tags: ["data-science", "eda", "analysis", "pandas", "statistics"]
category: "Data"
subcategory: "Analysis"
---

# Exploratory Data Analysis Plan

## Purpose
Produce a written EDA plan before any code is run, so the analysis answers a stated question instead of wandering through the columns.

## Instructions
Act as a senior data scientist. Write an EDA plan for the dataset described below. Do not invent column semantics — if a column's meaning is not given, list it under "needs a data owner" rather than guessing what it measures.

Inputs:
- **Question the analysis must answer:** [the decision this feeds]
- **Dataset:** [source system, grain — one row per what?, row count, date range]
- **Schema:** [column names, types, and any known meanings]
- **Known issues:** [backfills, schema changes, outages, deprecated fields]

Cover, in order:
1. **Grain and key check** — what uniquely identifies a row, and how to prove it
2. **Coverage** — rows per period, gaps, the date the data becomes trustworthy
3. **Missingness** — per column, and whether it is missing at random or structural
4. **Distributions** — which columns need a log scale, which are bounded, which are categorical with a long tail
5. **Relationships** — the two or three pairwise views that bear on the question, and why
6. **Outliers** — the rule you will use, stated in advance, and what you will do with them
7. **Stop conditions** — findings that would mean the question cannot be answered with this data

## Output Format
- Numbered plan with one concrete check per step
- A table of columns flagged `trusted` / `suspect` / `needs a data owner`
- A short list of the plots worth producing, each with the question it answers

## Related Prompts
- [Metric Definition Writer](./metric-definition-writer.md)
- [Data Quality Check Designer](../Data_Engineering/data-quality-check-designer.md)

## Reputable Sources
- NIST/SEMATECH e-Handbook of Statistical Methods: https://www.itl.nist.gov/div898/handbook/
- pandas user guide: https://pandas.pydata.org/docs/user_guide/
