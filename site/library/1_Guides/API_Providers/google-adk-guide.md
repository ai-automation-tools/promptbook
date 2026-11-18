---
title: "🧩 Google Agent Development Kit (ADK) Guide"
tags: ["agent-guides", "google", "adk", "python", "agent-framework"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: google/adk-python
---

<!-- Last Updated: 2026-11-18 - Checked against the repo README at aa0f434a8b09 -->

# Google Agent Development Kit (ADK) Guide

## Overview
ADK is an open-source, code-first Python framework for building, evaluating and deploying AI
agents. It is optimized for Gemini but model-agnostic and deployment-agnostic. The 2.0 README
adds a graph-based **Workflow** runtime and a **Task API** for agent-to-agent delegation. ADK
also exists for Java, Kotlin, Go and TypeScript (separate repos linked from the README).

## Install
Python 3.11+.

```bash
pip install google-adk
pip install "google-adk[extensions]"      # optional integrations
```

Releases are roughly bi-weekly. For the unreleased main branch:
`pip install git+https://github.com/google/adk-python.git@main`. The README also publishes
constraints files per Python version (`constraints-3.11.txt` and up) to pin transitive
dependencies: `pip install google-adk -c constraints-3.11.txt`.

## Two building blocks
**Agent**: instructions, tools and behaviour.

```python
from google.adk import Agent

root_agent = Agent(
    name="greeting_agent",
    model="gemini-3.5-flash",
    instruction="You are a helpful assistant. Greet the user warmly.",
)
```

**Workflow**: orchestrates agents and tasks as a graph (routing, fan-out/fan-in, loops, retry,
state, human-in-the-loop, nested workflows).

```python
from google.adk import Agent, Workflow

generate_fruit_agent = Agent(
    name="generate_fruit_agent",
    instruction="Return the name of a random fruit. Return only the name.",
)
generate_benefit_agent = Agent(
    name="generate_benefit_agent",
    instruction="Tell me a health benefit about the specified fruit.",
)

root_agent = Workflow(
    name="root_agent",
    edges=[("START", generate_fruit_agent, generate_benefit_agent)],
)
```

## Run, evaluate, deploy
```bash
adk run path/to/my_agent                 # interactive CLI
adk web path/to/agents_dir               # dev UI: test, evaluate, debug

adk eval \
    contributing/samples/evaluation/home_automation_agent \
    contributing/samples/evaluation/basic_criteria/home_automation.evalset.json \
    --config_file_path contributing/samples/evaluation/basic_criteria/eval_config.json

adk deploy docker --with_ui <agent-folder>
adk deploy cloud_run --with_ui <agent-folder>
```

Pass environment variables to `adk deploy` (for example `--env GOOGLE_GENAI_USE_ENTERPRISE=1`)
or put them in a `.env` file. The `adk eval` example is run from the repo root.

## Other features
- **Tools**: pre-built tools, custom functions, OpenAPI specs and MCP tools.
- **Tool confirmation**: a human-in-the-loop flow that guards tool execution with explicit confirmation.
- **Agent Config**: build agents without code (docs: adk.dev/agents/config/).
- **Multi-agent**: compose specialised agents into hierarchies.
- **Vibe coding**: adk.dev publishes `llms.txt` and `llms-full.txt` to use as LLM context.

## Sources
- https://github.com/google/adk-python (README)
- https://adk.dev/ (docs linked from the README)
