---
title: "🔧 Evaluation Framework Setup"
tags: ["skill", "evaluation", "agent-development"]
category: "Skills"
subcategory: "AI_ML"
name: eval-framework-setup
description: "Sets up a robust evaluation framework for LLM agents to track performance and regressions. Use when: (1) building production agents, (2) tuning prompts, (3) changing models. NOT for: simple one-off scripts."
---

# Evaluation Framework Setup

This skill provides a standardized way to implement evaluations for LLM agent outputs, ensuring quality and consistency.

## Prerequisites

- **Required Tool/Service:** Python 3.10+, Pytest
- **Authentication:** OpenAI/Anthropic API key for LLM-as-a-judge
- **Permissions:** Read/Write to test directory

## Usage
1. Define your test cases (input, expected output, criteria).
2. Implement an evaluator function using an LLM to score the output.
3. Run the evaluation suite.

## Configuration
Modify the `eval_config.yaml` to set your target model and evaluation criteria.

## Examples
```python
def test_agent_politeness():
    response = run_agent("Help me reset my password")
    score = llm_judge("Is this response polite?", response)
    assert score >= 4
```

## Advanced Usage
Implement custom metrics like hallucination detection or semantic similarity.

## Integration
Integrate into your CI/CD pipeline via GitHub Actions.

## Troubleshooting
- Flaky tests: Lower the temperature of the evaluator LLM.

## Best Practices
- Keep evaluation prompts distinct from agent system prompts.

## Performance Considerations
- Running LLM evaluations can be slow and costly. Cache results if possible.

## Security & Safety
- Do not log sensitive user data in evaluation traces.

## API Reference
N/A

## File Structure
`/evals`, `/evals/cases`, `/evals/results`

## References
- [LangSmith Docs](https://docs.smith.langchain.com/)

## Changelog
- 1.0.0: Initial release

## Contributing
Submit PRs with new evaluation templates.

## License
MIT
