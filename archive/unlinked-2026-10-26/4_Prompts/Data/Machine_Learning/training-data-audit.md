---
title: "📌 Training Data Audit"
tags: ["machine-learning", "data-quality", "bias", "labels", "dataset"]
category: "Data"
subcategory: "Machine_Learning"
---

# Training Data Audit

## Purpose
Audit a training set before a model is fit to it, so the problems found are cheap to fix rather than discovered as unexplained model behaviour.

## Instructions
Act as a machine learning engineer auditing a dataset. Work through the checks below and report what you find, what you cannot check with the information supplied, and what you would need in order to check it.

Inputs:
- **Dataset:** [size, time range, source, how rows were selected]
- **Label:** [definition, who or what produced it, and when relative to the features]
- **Known collection quirks:** [sampling, filtering, retries, deduplication]
- **Deployment population:** [who the model will actually run on]

Audit:
1. **Selection** — how rows entered the dataset, and who is systematically absent
2. **Label quality** — label source, inter-annotator agreement if human, the proxy gap if the label is a stand-in for what you actually care about
3. **Label leakage** — any feature that is a downstream consequence of the label
4. **Duplicates and near-duplicates** — and whether they can straddle the train/test split
5. **Temporal structure** — drift across the time range, and whether a random split leaks the future into the past
6. **Class balance** — overall and within each slice that matters
7. **Representativeness** — training population against deployment population, named gap by gap
8. **Sensitive attributes** — present directly, or reconstructable from proxies

## Output Format
- Findings table: check, result, severity, recommended action
- A "cannot check with what was supplied" list, each with the artefact needed
- A go/no-go statement on training against this dataset as it stands

## Related Prompts
- [Feature Engineering Planner](./feature-engineering-planner.md)
- [Model Card Writer](./model-card-writer.md)

## Reputable Sources
- Gebru et al., Datasheets for Datasets: https://arxiv.org/abs/1803.09010
- scikit-learn user guide, common pitfalls: https://scikit-learn.org/stable/common_pitfalls.html
