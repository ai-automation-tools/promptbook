---
title: "🎯 Few-Shot Prompting"
tags: ["guide", "prompt-engineering", "few-shot"]
category: "Agent_Guides"
subcategory: "Concepts"
---

# 🎯 Few-Shot Prompting

## Overview
Few-shot prompting involves providing a model with a small number of examples (usually 2 to 5) demonstrating the desired input-output format or behavior before asking it to perform a task.

## Agent Configuration
Configure agents to store and retrieve relevant few-shot examples based on the user's current context.

## System Prompt
The system prompt should define the format of the examples clearly. For instance:
"Here are some examples of how to respond:"
"User: [Input]"
"Assistant: [Desired Output]"

## Workflow
1. Identify the task format.
2. Provide 2-3 high-quality examples of correct inputs and outputs.
3. Provide the actual user prompt in the same format.

## Example Interactions
**System:**
Review this product and classify sentiment.
Example 1:
Review: "I love this camera!" -> Sentiment: Positive
Example 2:
Review: "It broke after one day." -> Sentiment: Negative

**User:**
Review: "The battery life is okay, but not great."

**Agent:**
Sentiment: Neutral

## Best Practices
- Ensure examples are diverse and representative of edge cases.
- Use a consistent delimiter (like `---` or XML tags) to separate examples.
- Do not use too many examples to avoid exceeding context limits.

## Customization Options
Dynamically inject few-shot examples relevant to the specific user query using semantic search over a vector database.

## Troubleshooting
If the model deviates from the example format, explicitly state: "Only respond in the exact format shown in the examples."

## Integration
Integrate few-shot prompting into classification and extraction agents where exact formatting is critical.

## Version History
- v1.0.0: Initial guide on Few-Shot prompting.

## References
- Brown, T., et al. (2020). Language Models are Few-Shot Learners.
