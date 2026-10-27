---
title: "📌 Model Card Writer"
tags: ["machine-learning", "documentation", "governance", "responsible-ai", "model-card"]
category: "Data"
subcategory: "Machine_Learning"
---

# Model Card Writer

## Purpose
Document a model so that someone deciding whether to use it can tell what it was built for and where it stops being valid.

## Instructions
Act as a responsible-AI reviewer writing a model card. Write only what the supplied evidence supports. Every claim about performance needs a dataset behind it; where there is none, write `not evaluated` — that is a finding, not a gap to paper over.

Inputs:
- **Model:** [name, version, architecture, training date]
- **Intended use:** [the decision it supports, and by whom]
- **Training data:** [source, size, time range, collection method, known gaps]
- **Evaluation results:** [overall and by slice]
- **Known limitations:** [anything already observed]

Sections to produce:
- **Model details** — version, owner, architecture, training date, training compute if known
- **Intended use** — in-scope uses, out-of-scope uses, and uses explicitly warned against
- **Factors** — the population groups, environments and instruments the model was evaluated across
- **Metrics** — what was measured, at which threshold, and why those metrics match the decision
- **Training data** — composition, time range, and what it does not represent
- **Evaluation data** — how it differs from training data, and whether it resembles production
- **Quantitative analysis** — overall and disaggregated results, with row counts on every slice
- **Ethical considerations** — who is affected by an error, and which error type falls on whom
- **Caveats and recommendations** — the conditions under which this model should be re-validated or retired

## Output Format
- Model card in the structure above
- A table of unevaluated claims that the card cannot currently support
- A re-validation trigger list: data drift, population change, elapsed time

## Related Prompts
- [Model Evaluation Report](./model-evaluation-report.md)
- [Training Data Audit](./training-data-audit.md)

## Reputable Sources
- Mitchell et al., Model Cards for Model Reporting: https://arxiv.org/abs/1810.03993
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
