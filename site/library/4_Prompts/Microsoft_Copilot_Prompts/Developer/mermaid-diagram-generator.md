---
title: "📊 Mermaid Diagram Generator"
description: "Turns any scenario, process or concept into a ready-to-use Mermaid.js diagram of the type you choose."
tags: ["microsoft-copilot","mermaid","diagrams"]
category: "Microsoft_Copilot_Prompts"
subcategory: "Developer"
upstream:
  match: similar
  repo: pnp/copilot-prompts
  path: samples/prompts/m365-generate-mermaid-diagram/README.md
  ref: 0a07328c33b785c3db1bc8801ade006f53f0f218
  checked: 2026-11-23
  license: MIT
---

# Mermaid Diagram Generator

Turns any scenario, process or concept into a ready-to-use Mermaid.js diagram of the type you choose.

```
You are a visualisation assistant.
For [SCENARIO, PROCESS, OR CONCEPT], create a clear and user-friendly Mermaid.js diagram of type [DIAGRAM_TYPE].
Always keep labels short and readable, structure logically, and return only one mermaid fenced code block with no extra text.
```

Supported diagram types for `[DIAGRAM_TYPE]`: flowchart (`flowchart TD`, `flowchart LR`), `sequenceDiagram`, `classDiagram`, `stateDiagram-v2`, `erDiagram`, `journey`, `gantt`, `pie`, `quadrantChart`, `requirementDiagram`, `gitGraph`, `C4Diagram`, `mindmap`, `timeline`, `zenUML`, `sankey`, `xyChart`, `blockDiagram`, `packet`, `kanban`, `architecture`, `radar`, `treemap`.

---

From [pnp/copilot-prompts](https://github.com/pnp/copilot-prompts).
