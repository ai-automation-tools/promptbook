---
title: "📌 Baseline Model Selection"
tags: ["machine-learning", "baseline", "modeling", "data-science", "scoping"]
category: "Data"
subcategory: "Machine_Learning"
---

# Baseline Model Selection

## Purpose
Choose the simplest model that could answer the question, and state in advance what a more complex one would have to beat.

## Instructions
Act as a pragmatic machine learning engineer. Recommend a baseline for the problem below. Start from the assumption that the answer is a rule or a linear model, and make the case for anything heavier rather than assuming it.

Inputs:
- **Problem:** [task, target, and the decision it drives]
- **Data:** [rows, features, label availability, time range]
- **Constraints:** [latency, interpretability requirements, retraining cadence, who maintains it]
- **Current approach:** [existing rule, human process, or nothing]

Produce:
1. **The trivial predictor** — majority class, last value, or overall mean. Its score is the floor; anything not beating it is not a model
2. **The rules baseline** — can a handful of hand-written rules get most of the value? Say what they would be and what they would score
3. **The simple model** — logistic or linear regression, or gradient boosting on tabular data, with the reasoning
4. **What would justify something heavier** — the specific gain, on the specific metric, that would pay for the extra maintenance
5. **Order of work** — what to build first, and the checkpoint at which to stop or continue
6. **Cost of being wrong** — what happens if the baseline ships and is worse than hoped

Explicitly name the maintenance cost of each option: who retrains it, how often, and what breaks silently when nobody does.

## Output Format
- Options table: approach, expected effort, interpretability, maintenance cost, when it is the right call
- A recommended first build, in one paragraph
- The stated bar a more complex model must clear

## Related Prompts
- [Model Evaluation Report](./model-evaluation-report.md)
- [Feature Engineering Planner](./feature-engineering-planner.md)

## Reputable Sources
- Google, Rules of Machine Learning: https://developers.google.com/machine-learning/guides/rules-of-ml
- scikit-learn user guide, choosing an estimator: https://scikit-learn.org/stable/user_guide.html
