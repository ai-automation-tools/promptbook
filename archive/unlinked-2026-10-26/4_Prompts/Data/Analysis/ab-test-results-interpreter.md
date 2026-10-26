---
title: "📌 A/B Test Results Interpreter"
tags: ["data-science", "experimentation", "ab-testing", "statistics", "causal-inference"]
category: "Data"
subcategory: "Analysis"
---

# A/B Test Results Interpreter

## Purpose
Read an experiment readout honestly: what the data supports, what it does not, and whether the test was capable of answering the question at all.

## Instructions
Act as an experimentation specialist. Interpret the results below. Do not compute a p-value from numbers that were not supplied, and do not describe a result as significant unless the supplied test says so.

Inputs:
- **Hypothesis:** [stated before the test, if it was]
- **Primary metric:** [definition and direction of improvement]
- **Guardrail metrics:** [what must not get worse]
- **Design:** [unit of randomization, allocation, planned duration, planned sample size]
- **Results:** [sample size, mean or rate, variance or confidence interval, per arm]
- **What actually happened:** [early stops, reassignments, outages, bot filtering]

Report:
1. **Validity first** — sample ratio mismatch, randomization unit against analysis unit, peeking, novelty window, carryover from a prior test
2. **Power** — was the observed sample size capable of detecting the effect that would justify shipping? If not, say so before interpreting anything
3. **The effect** — point estimate with interval, in the units a decision-maker uses, both absolute and relative
4. **Guardrails** — any movement, even non-significant, large enough to matter
5. **Segments** — only if pre-registered; otherwise label them exploratory and say so plainly
6. **The call** — ship, do not ship, or inconclusive and re-run at a stated sample size, with the reasoning in one paragraph

Inconclusive is a valid and common outcome. Prefer it to a strained narrative.

## Output Format
- Validity checklist with pass or fail per item
- Effect table: metric, control, treatment, absolute delta, relative delta, interval
- A one-paragraph recommendation
- A list of what is still not known

## Related Prompts
- [Cohort Retention Analysis](./cohort-retention-analysis.md)
- [Model Evaluation Report](../Machine_Learning/model-evaluation-report.md)

## Reputable Sources
- NIST/SEMATECH e-Handbook, hypothesis testing: https://www.itl.nist.gov/div898/handbook/
- CONSORT reporting guidance: https://www.equator-network.org/reporting-guidelines/consort/
