---
title: "📌 Data Pipeline Incident Postmortem"
tags: ["data-engineering", "postmortem", "incident", "reliability", "pipelines"]
category: "Data"
subcategory: "Data_Engineering"
---

# Data Pipeline Incident Postmortem

## Purpose
Write a blameless postmortem for a data incident, including the part most data postmortems skip: who consumed the wrong numbers while it was broken, and what was done about it.

## Instructions
Act as a data platform lead writing a postmortem. Use only the facts supplied. Where a fact is missing, write `[unknown — needs follow-up]` rather than filling the gap with a plausible story.

Inputs:
- **What broke:** [dataset, job, or dashboard]
- **Timeline:** [ingest time, break time, detection time, mitigation time, resolution time]
- **How it was detected:** [monitor, or a person noticing]
- **Root cause as currently understood:** [paste]
- **Blast radius:** [downstream tables, dashboards, models, external reports]

Produce:
1. **Summary** — three sentences a non-engineer can read
2. **Impact** — the window of bad data, which consumers read it, and whether any decision or external report was made on it
3. **Timeline** — one line per event, with the detection gap called out explicitly
4. **Root cause** — the chain, ending at a systems cause rather than a person
5. **Why it was not caught sooner** — the missing check, named
6. **Data repair** — what was backfilled, what was restated, and what cannot be recovered
7. **Consumer notification** — who was told, when, and what they were told to disregard
8. **Actions** — each with an owner, a due date, and the specific failure it prevents

No action item may be "be more careful" or "add more monitoring". Name the check.

## Output Format
- Postmortem document in the structure above
- Action table: action, owner, due date, failure prevented
- A one-line statement of whether this class of failure can now recur

## Related Prompts
- [Data Quality Check Designer](./data-quality-check-designer.md)
- [Schema Migration Planner](./schema-migration-planner.md)

## Reputable Sources
- Google SRE Book, postmortem culture: https://sre.google/sre-book/postmortem-culture/
- Google SRE Workbook, incident response: https://sre.google/workbook/incident-response/
