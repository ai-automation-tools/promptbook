---
title: "📌 Feature Engineering Planner"
tags: ["machine-learning", "feature-engineering", "data-science", "leakage", "modeling"]
category: "Data"
subcategory: "Machine_Learning"
---

# Feature Engineering Planner

## Purpose
Plan a feature set with the leakage question answered before any model is trained, because leakage is the failure that looks like success until production.

## Instructions
Act as a machine learning engineer. Propose a feature set for the problem below. For every feature, state the moment in time it becomes knowable — if that moment is after the prediction time, reject the feature rather than listing it with a caveat.

Inputs:
- **Prediction target:** [what is predicted, and the label definition]
- **Prediction time:** [the exact moment the model is called in production]
- **Label time:** [when the outcome is observed]
- **Available data:** [tables, grain, update cadence, history depth]
- **Serving constraints:** [latency budget, batch or online, what is reachable at call time]

For each proposed feature give:
- Definition and the source columns
- **Knowable at prediction time?** yes or no, with the reasoning
- Aggregation window, relative to prediction time, never to the present
- Expected null behaviour for a new entity with no history
- Whether it is computable at serving time with the stated constraints
- Why it should carry signal, in one sentence

Then list separately:
- **Rejected for leakage** — the feature and the exact mechanism
- **Cold start** — what the model sees for an entity on its first day
- **Train/serve skew risks** — anywhere the training computation and serving computation could diverge

## Output Format
- Feature table with the columns above
- Rejected-features list with the leakage mechanism named
- A short note on the minimum viable feature set to try first

## Related Prompts
- [Model Evaluation Report](./model-evaluation-report.md)
- [Training Data Audit](./training-data-audit.md)

## Reputable Sources
- scikit-learn user guide, common pitfalls: https://scikit-learn.org/stable/common_pitfalls.html
- Google, Rules of Machine Learning: https://developers.google.com/machine-learning/guides/rules-of-ml
