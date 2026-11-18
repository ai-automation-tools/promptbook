---
title: "🚣 CrewAI Guide: Agents, Tasks, Crews and Flows"
tags: ["crewai", "agents", "multi-agent", "flows", "python", "orchestration"]
category: "Agent_Guides"
subcategory: "API_Providers"
checked: 2026-11-18
repo: crewAIInc/crewAI
---

<!-- Last Updated: 2026-11-18 - Checked against docs.crewai.com and the crewAIInc/crewAI README -->

# CrewAI Guide: Agents, Tasks, Crews and Flows

CrewAI's README describes two building blocks: Crews (autonomous agent collaboration) and Flows
(event-driven, precise control over a workflow). A Crew is a set of agents and tasks; a Flow wires
steps, state and routing together and can call Crews.

## Install

CrewAI requires `Python >=3.10 and <3.14` and uses `uv`.

```shell
uv tool install crewai          # installs the CLI
uv tool update-shell            # only if you see a PATH warning
uv tool list                    # verify
uv tool install crewai --upgrade
```

`uv tool install crewai --upgrade` upgrades the global CLI only, not the version inside a project's
virtual environment.

## Create and run a crew project

```shell
crewai create crew <project_name>
cd <project_name>
crewai install
crewai run
```

The default scaffold is JSON-first: agents live in `agents/*.jsonc`, tasks and crew settings in
`crew.jsonc`. For the older Python/YAML scaffold (`crew.py`, `config/agents.yaml`,
`config/tasks.yaml`) add `--classic`.

```
my_project/
├── .env
├── agents/researcher.jsonc
├── crew.jsonc
├── knowledge/
├── skills/
├── tools/            # reference custom tools as "custom:<name>"
└── pyproject.toml
```

Put your model provider key (and `SERPER_API_KEY` if you use web search) in `.env`. Use
`{placeholder}` values in agent and task text and set defaults under `inputs` in `crew.jsonc`;
`crewai run` prompts for any that are missing.

## Agent and crew files

```jsonc
// agents/researcher.jsonc
{
  "role": "{topic} Senior Data Researcher",
  "goal": "Uncover cutting-edge developments in {topic}",
  "backstory": "You're a seasoned researcher who finds relevant information and presents it clearly.",
  "llm": "openai/gpt-4o",
  "tools": ["SerperDevTool"],
  "settings": { "verbose": true }
}
```

```jsonc
// crew.jsonc
{
  "name": "Latest AI Development",
  "agents": ["researcher", "reporting_analyst"],
  "tasks": [
    {
      "name": "research_task",
      "description": "Conduct thorough research about {topic}.",
      "expected_output": "A list with 10 bullet points about {topic}.",
      "agent": "researcher"
    },
    {
      "name": "reporting_task",
      "description": "Expand each topic into a full report section.",
      "expected_output": "A markdown report.",
      "agent": "reporting_analyst",
      "context": ["research_task"],
      "output_file": "output/report.md",
      "markdown": true
    }
  ],
  "process": "sequential",
  "inputs": { "topic": "AI Agents" }
}
```

## Agent attributes

| Parameter | Default | Meaning |
|:---|:---|:---|
| `role`, `goal`, `backstory` | required | Function, objective and personality of the agent |
| `llm` | `OPENAI_MODEL_NAME` env var, else the docs' default | The model that powers the agent |
| `tools` | empty | Capabilities the agent can use |
| `max_iter` | 20 | Iteration limit before the agent must give its best answer |
| `allow_delegation` | False | Whether it can hand tasks to other agents |
| `verbose` | False | Detailed execution logs |
| `max_rpm` | None | Requests-per-minute cap |
| `max_execution_time` | None | Time limit in seconds for a task |
| `max_retry_limit` | 2 | Retries on error |
| `cache` | True | Cache tool usage |
| `function_calling_llm` | None | Separate model for tool calls |
| `respect_context_window` | True | Summarise to stay under the context window |
| `reasoning` | False | Plan before executing |

## Task attributes

| Parameter | Meaning |
|:---|:---|
| `description`, `expected_output` | What the task is and what finished work looks like |
| `agent`, `tools` | Who does it and which tools it may use |
| `context` | Other tasks whose outputs feed this one |
| `async_execution`, `human_input`, `markdown` | Run async (default False), human review (False), Markdown answer (False) |
| `output_file`, `create_directory` | Save the result to a path; create its folder (default True) |
| `output_pydantic`, `output_json` | Pydantic model for structured output |
| `guardrail`, `guardrails`, `guardrail_max_retries` | Validate output before the next task; retries default 3 |
| `callback` | Run after the task completes |

Read a result from `task.output` (a `TaskOutput`): `.raw` is the default text, `.pydantic` and
`.json_dict` are set only when the matching output model was configured.

## Processes

| Process | Behaviour |
|:---|:---|
| `Process.sequential` | Tasks run in list order; each output is context for the next |
| `Process.hierarchical` | A manager plans, delegates and reviews; needs `manager_llm` or `manager_agent` |

```python
from crewai import Crew, Process

crew = Crew(agents=my_agents, tasks=my_tasks,
            process=Process.hierarchical, manager_llm="gpt-4o")
```

## Flows

```python
from typing import Literal
from pydantic import BaseModel
from crewai.flow.flow import Flow, and_, listen, or_, router, start


class DemoState(BaseModel):
    score: int = 0


class DemoFlow(Flow[DemoState]):
    @start()
    def begin(self):
        self.state.score = 7

    @router(begin)
    def check(self) -> Literal["high", "low"]:
        return "high" if self.state.score >= 5 else "low"

    @listen("high")
    def celebrate(self):
        return "celebrated"

    @listen("low")
    def retry(self):
        return "retried"


print(DemoFlow().kickoff())
```

| Piece | Role |
|:---|:---|
| `@start()` | Entry point |
| `@listen(method_or_label)` | Runs when that method finishes or that router label fires |
| `@router(method)` | Returns a label string that `@listen("label")` matches |
| `or_(a, b)` / `and_(a, b)` | Fire on either / on both |
| `Flow[Model]` | Pydantic state, read as `self.state.field` |
| `kickoff()` | Runs the flow; returns the last method's output |

`crewai create flow <name>` scaffolds a flow project (project type `"flow"` in `pyproject.toml`);
`crewai run` runs it, the same command as for crews.

## Sources

- https://github.com/crewAIInc/crewAI (README)
- https://docs.crewai.com/en/quickstart
- https://docs.crewai.com/en/concepts/agents
- https://docs.crewai.com/en/concepts/tasks
- https://docs.crewai.com/en/concepts/processes
- https://docs.crewai.com/en/concepts/flows
