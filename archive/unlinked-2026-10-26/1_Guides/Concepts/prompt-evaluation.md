---
title: "Evaluating Prompt Effectiveness"
tags: ["guide", "prompt-engineering", "evaluation"]
category: "Agent_Guides"
subcategory: "Concepts"
---

# Evaluating Prompt Effectiveness

How to systematically measure and improve prompt quality.

## Key Metrics for Evaluation

1. **Accuracy**: Does the prompt consistently yield factually correct information?
2. **Adherence**: How strictly does the model follow formatting instructions and constraints?
3. **Efficiency**: Is the prompt concise, avoiding unnecessary tokens while maintaining clarity?
4. **Robustness**: Does the prompt hold up against edge cases or slightly varied inputs?

## A/B Testing Prompts
When refining a critical system prompt, test two variations simultaneously against a standard dataset of 10-20 queries to objectively measure which version performs better.

## Feedback Loops
Implement human-in-the-loop review for early versions of a prompt. Use the failures to explicitly add new constraints to the prompt design.
