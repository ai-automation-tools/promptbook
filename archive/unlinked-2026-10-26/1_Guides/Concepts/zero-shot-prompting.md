---
title: "🚀 Zero-Shot Prompting"
tags: ["guide", "prompt-engineering", "zero-shot"]
category: "Agent_Guides"
subcategory: "Concepts"
---

# 🚀 Zero-Shot Prompting

## Overview
Zero-shot prompting refers to asking a model to perform a task without providing any prior examples. It relies entirely on the model's pre-trained knowledge and instructions.

## Agent Configuration
Agents using zero-shot prompting must have highly detailed and unambiguous system prompts.

## System Prompt
Because no examples are provided, the system prompt must explicitly state all rules, constraints, and output formats.

## Workflow
1. Define the task clearly.
2. Specify constraints and output format.
3. Submit the prompt to the model.

## Example Interactions
**System:**
Classify the following text into one of these categories: [Sports, Politics, Tech]. Reply ONLY with the category name.

**User:**
The new smartphone features a 120Hz display and a faster processor.

**Agent:**
Tech

## Best Practices
- Be highly specific about the task.
- Explicitly state what *not* to do (negative constraints).
- Use clear delimiters for the user input (e.g., `Text to classify: '''[text]'''`).

## Customization Options
Combine zero-shot prompting with role-playing (e.g., "Act as an expert data analyst...") to guide the model's tone and approach.

## Troubleshooting
If the model provides extra conversational text, reinforce the negative constraint: "Do not include any conversational filler. Output only the requested data."

## Integration
Ideal for general-purpose chatbots and simple classification tasks where maintaining few-shot examples is overhead.

## Version History
- v1.0.0: Initial guide on Zero-Shot prompting.

## References
- Kojima, T., et al. (2022). Large Language Models are Zero-Shot Reasoners.
