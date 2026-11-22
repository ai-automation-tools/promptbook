---
title: "📒 Decision Log Generator"
description: "Turns meeting notes into a decision log."
tags: ["microsoft-copilot","meetings","decisions"]
category: "Microsoft_Copilot_Prompts"
subcategory: "Meetings"
upstream:
  match: similar
  repo: pnp/copilot-prompts
  path: samples/prompts/m365-decision-log-generator-prompt/README.md
  ref: 0a07328c33b785c3db1bc8801ade006f53f0f218
  checked: 2026-11-18
  license: MIT
---

# Decision Log Generator

Turns meeting notes into a decision log.

```
Act as a decision archivist. Using the transcript of my most recent Teams meeting, extract every concrete decision that was made and present them as a structured decision log in a Markdown table with these columns: Decision, Owner, Rationale, Alternatives Considered, Reversibility (Reversible / Hard to reverse / Irreversible), and Review Date. Only include actual decisions — ignore open questions, action items, and general discussion. If a decision has no clear owner or review date, mark it as "Unassigned" or "TBD". After the table, add a short "Decisions Needing Follow-up" section listing any decisions that were made without a clear owner. Keep the language factual and neutral.
```

---

From [pnp/copilot-prompts](https://github.com/pnp/copilot-prompts).
