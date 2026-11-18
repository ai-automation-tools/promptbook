---
title: "🎯 DSPy Guide: Signatures, Modules and Optimizers"
tags: ["dspy", "prompt-optimization", "signatures", "gepa", "python", "llm-programming"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: stanfordnlp/dspy
---

<!-- Last Updated: 2026-11-18 - Checked against dspy.ai getting-started docs (docs/ in stanfordnlp/dspy) -->

# DSPy Guide: Signatures, Modules and Optimizers

DSPy is a framework for "programming, rather than prompting" language models. You declare what a
step takes and returns (a Signature), choose how it runs (a Module), and let an optimizer improve
the instructions or demos against a metric.

## Install and connect a model

```bash
pip install dspy        # or: uv add dspy
```

DSPy works in Python 3.10+. LiteLLM is optional: `pip install "dspy[litellm]"`.

```python
import dspy

lm = dspy.LM("openai/gpt-5-nano", api_key="YOUR_OPENAI_API_KEY")
dspy.configure(lm=lm)      # default LM for every program in the process
print(lm("What is the capital of France?"))
```

| Service | Example model string | Credentials |
|:---|:---|:---|
| Anthropic | `anthropic/claude-sonnet-4-5-20250929` | `ANTHROPIC_API_KEY` or `api_key=` |
| Google AI Studio | `gemini/gemini-2.5-pro` | `GEMINI_API_KEY` or `api_key=` |
| Azure OpenAI | `azure/your-deployment-name` | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT` |
| Local Ollama | `ollama_chat/llama3.2:1b` | Ollama running, model pulled |

An OpenAI-compatible server: `dspy.LM("openai/your-model-name", api_base="https://.../v1", api_key=...)`.
Override the global LM for one block with `dspy.context`.

## Signatures

A string signature is `"inputs -> outputs"`; field names are part of the prompt.

```python
haiku_generator = dspy.Predict("subject -> haiku")
result = haiku_generator(subject="computer science")
print(result.haiku)
```

A class-based signature adds a docstring (task instructions) and field descriptions.

```python
from typing import Literal

Season = Literal["spring", "summer", "autumn", "winter"]

class HaikuBot(dspy.Signature):
    """Write a classical haiku given the provided inputs."""
    location: str = dspy.InputField(desc="The setting of the poem")
    mood: str = dspy.InputField()
    season: Season = dspy.InputField()
    haiku: str = dspy.OutputField()
```

Typing with `Literal` constrains values at call time and when parsing the reply; a mismatch logs a
warning. Keep docstrings short: the docs say long rules are the optimizer's job, and note that
optimizers do not rewrite field descriptions, so choose field names carefully.

## Modules

`Predict` is the base module. Swapping the module changes the strategy without touching the
signature.

```python
bot = dspy.ChainOfThought(HaikuBot)     # adds a reasoning output field
result = bot(location="Bodega Bay", mood="mysterious", season="autumn")
print(result.reasoning, result.haiku)
```

`dspy.ReAct(HaikuBot, tools=[...])` adds tool calling. To see the exact prompt and response, call
`dspy.inspect_history(n=1)`. Calls are cached by default, so identical calls return cached responses.

## Metrics and data

A metric is a function `(example, prediction) -> float`, by convention 0.0 to 1.0.

```python
examples = [
    dspy.Example(location=..., season=..., mood=...).with_inputs("location", "season", "mood")
]

def haiku_score(example, prediction) -> float:
    return 0.0 if example.season.lower() in prediction.haiku.lower() else 1.0

evaluate = dspy.Evaluate(devset=val, metric=haiku_score)
baseline = evaluate(bot)
```

`.with_inputs(...)` names the fields passed to the program; the rest (such as a gold answer) stay
available to the metric.

## Optimizers

`compile()` returns a new program and leaves the original untouched.

| Optimizer | Tunes | Notes |
|:---|:---|:---|
| `dspy.LabeledFewShot(k=16)` | Demos | No LM calls at compile time; honest baseline |
| `dspy.BootstrapFewShot` | Demos | Keeps traces that pass the metric; a safe first try |
| `dspy.BootstrapFewShotWithRandomSearch` (alias `BootstrapRS`) | Demos | Many bootstrap runs, keeps the best |
| `dspy.KNNFewShot` | Demos | Picks nearest examples at inference time |
| `dspy.COPRO` | Instructions | Breadth-first instruction proposals |
| `dspy.GEPA` | Instructions | Reflective evolution; metric can return `dspy.Prediction(score=..., feedback=...)` |
| `dspy.MIPROv2` | Instructions and demos | Bayesian search; `auto` of `"light"`, `"medium"` or `"heavy"` |
| `dspy.SIMBA`, `dspy.InferRules` | Instructions / demos | See the optimizer guide |
| `dspy.BootstrapFinetune` | Weights | Needs an LM with a fine-tuning API |

```python
reflection_lm = dspy.LM("openai/gpt-5.4")
optimizer = dspy.GEPA(metric=haiku_metric, reflection_lm=reflection_lm,
                      auto="light", num_threads=2)
optimized = optimizer.compile(bot, trainset=train, valset=val)
```

Guidance from the docs:

- Start prompt-only; try fine-tuning last.
- Demo tuning tends to overfit small sets; instruction tuning tends to generalise.
- GEPA wins when you have a strong reflection LM and a feedback-shaped metric; otherwise COPRO or
  MIPROv2 may do better on the same budget.
- GEPA `trainset` feeds reflection, `valset` selects the returned program; keep a separate test
  set. If `valset` is omitted, `trainset` is reused and can overfit.
- `auto="light"` evaluates around six candidate prompts; compile runs can be costly, so compile once
  and reuse the saved result.

## Save and load

```python
optimized.save("bot.json")                       # learned state only (instructions, demos)
fresh = dspy.ChainOfThought(HaikuBot)
fresh.load("bot.json")

optimized.save("bot/", save_program=True)        # whole program; contains executable Python
loaded = dspy.load("bot/")                       # only load from sources you trust
```

The save file excludes LM configuration (keys, provider, temperature); call `dspy.configure` again
after loading.

## Sources

- https://dspy.ai/ (docs; pages below read from docs/docs/ in the repo)
- https://github.com/stanfordnlp/dspy (README)
- docs/docs/getting-started/installation.md, first-program.md, class-based-signatures.md, changing-modules.md, metrics.md, gepa-optimization.md, saving-and-loading.md
- docs/docs/diving-deeper/choosing-an-optimizer.md
