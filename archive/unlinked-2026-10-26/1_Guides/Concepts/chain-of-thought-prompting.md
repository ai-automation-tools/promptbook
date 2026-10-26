---
title: "🧠 Chain of Thought Prompting"
tags: ["guide", "prompt-engineering", "cot"]
category: "Agent_Guides"
subcategory: "Concepts"
---

# 🧠 Chain of Thought Prompting

## Overview
Chain of Thought (CoT) prompting enables large language models to solve complex problems by breaking them down into intermediate reasoning steps. It significantly improves performance on reasoning tasks compared to standard prompting.

## Agent Configuration
When configuring agents for tasks requiring reasoning, ensure the `reasoning_mode` or equivalent setting allows for verbose step-by-step output. Agents should be instructed to "think aloud."

## System Prompt
In the system prompt, include a directive such as:
"Before answering the user's query, output your step-by-step reasoning within `<Thinking>` tags. Once you have reached a conclusion, provide the final answer."

## Workflow
1. The user provides a complex problem.
2. The agent breaks down the problem.
3. The agent outputs the reasoning process.
4. The agent formulates the final response based on the reasoning.

## Example Interactions
**User:** If John has 5 apples and gives 2 to Mary, then buys 3 more, how many apples does he have?

**Agent:**
`<Thinking>`
1. John starts with 5 apples.
2. He gives 2 to Mary, so he has 5 - 2 = 3 apples.
3. He buys 3 more apples, so he now has 3 + 3 = 6 apples.
`</Thinking>`
John has 6 apples.

## Best Practices
- Encourage explicit intermediate steps.
- Use few-shot examples demonstrating CoT.
- Use XML tags (like `<Thinking>`) to separate reasoning from the final answer.

## Customization Options
You can configure the strictness of the CoT. For example, mandate a specific format or limit the number of reasoning steps.

## Troubleshooting
If the model skips steps, explicitly instruct it: "Do not skip any logical steps. Provide a complete chain of thought."

## Integration
Integrate CoT into the base system prompt of all complex reasoning agents to make it a default behavior.

## Version History
- v1.0.0: Initial guide on Chain of Thought prompting.

## References
- Wei, J., et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.
