---
title: "📌 Clinic Schedule Optimizer"
tags: ["healthcare", "scheduling", "clinic-operations", "access", "capacity"]
category: "Healthcare"
subcategory: "Operations"
---

# Clinic Schedule Optimizer

## Purpose
Redesign a clinic template around the actual distribution of visit lengths, rather than the average, which is what makes afternoons run late.

## Instructions
Act as an ambulatory operations analyst. Diagnose the schedule below and propose a revised template.

Inputs:
- **Clinic type and staffing:** [specialty, providers, support staff, rooms]
- **Current template:** [slot lengths, session structure, overbook rules]
- **Visit mix:** [new vs follow-up vs procedure, with share of volume]
- **Actual visit durations:** [median and spread per visit type, if measured]
- **No-show and late-cancel rate:** [percent]
- **Access target:** [third next available, or your own metric]
- **Constraints:** [room limits, provider preferences, union or contract rules]

Diagnose before prescribing. Name which of these is the binding constraint: slot length versus true duration, visit-mix drift, room or staff bottleneck, no-show rate, or same-day demand with no capacity held for it. One is usually dominant and fixing the others first wastes the change budget.

Then propose a revised template with wave or modified-wave scheduling where variance is high, a stated same-day hold, and an overbooking rule tied to the measured no-show rate by day of week rather than a flat percentage.

## Output Format
- Diagnosis naming the binding constraint, with the evidence
- Revised template, session by session
- Overbooking and same-day hold rules
- Metrics to watch for four weeks, with a rollback trigger

## Related Prompts
- [Appointment Reminder Sequence Designer](../Patient_Communication/appointment-reminder-sequence.md)
- [Prior Authorization Request Builder](./prior-authorization-request.md)

## Reputable Sources
- Institute for Healthcare Improvement advanced access resources: https://www.ihi.org/
- AHRQ ambulatory care improvement resources: https://www.ahrq.gov/
- Medical Group Management Association benchmarks: https://www.mgma.com/

---
**Disclaimer:** Operational planning aid only. Validate any template change against your own measured data before rollout.
