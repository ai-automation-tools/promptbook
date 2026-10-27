---
title: "📌 Model Evaluation Report"
tags: ["machine-learning", "evaluation", "metrics", "validation", "data-science"]
category: "Data"
subcategory: "Machine_Learning"
---

# Model Evaluation Report

## Purpose
Evaluate a model against the decision it will drive, not against whichever metric happens to look best.

## Instructions
Act as a machine learning engineer writing an evaluation report. Start from the cost of each error type, then choose metrics that reflect it. Never report accuracy alone on an imbalanced problem.

Inputs:
- **Task:** [classification / regression / ranking / forecasting]
- **Business decision:** [what happens when the model says yes]
- **Cost of a false positive and a false negative:** [in whatever unit the business uses]
- **Split strategy:** [random / temporal / grouped, and the rationale]
- **Baseline:** [the current rule, human process, or trivial predictor]
- **Results:** [metrics on train, validation and test]

Report:
1. **Split validity** — is the split honest for this problem? Temporal data needs a temporal split; grouped entities need a grouped split. Say if it is wrong before reading any number
2. **Against baseline** — the lift over the trivial or incumbent predictor, which is the only number that justifies the project
3. **Metrics that match the cost** — precision/recall at the operating threshold, calibration, PR-AUC on imbalance, error distribution rather than a single mean for regression
4. **Threshold selection** — where the operating point is and what it costs, with the trade-off curve
5. **Slices** — performance on the segments that matter, including the smallest one, and any slice where the model is worse than the baseline
6. **Failure modes** — the examples it gets wrong and what they have in common
7. **Fitness for purpose** — deploy, deploy with a guardrail, or do not deploy

## Output Format
- Metric table: metric, train, validation, test, baseline
- Slice table with row counts, so a good number on 40 rows is visible as such
- Threshold trade-off table
- A one-paragraph recommendation and the conditions that would reverse it

## Related Prompts
- [Feature Engineering Planner](./feature-engineering-planner.md)
- [Model Card Writer](./model-card-writer.md)

## Reputable Sources
- scikit-learn user guide, model evaluation: https://scikit-learn.org/stable/modules/model_evaluation.html
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
