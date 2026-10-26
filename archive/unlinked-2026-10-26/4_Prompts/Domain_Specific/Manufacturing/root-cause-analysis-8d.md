---
title: "📌 8D Root Cause Analysis"
tags: ["manufacturing", "quality", "8d", "root-cause", "corrective-action"]
category: "Domain_Specific"
subcategory: "Manufacturing"
---

# 8D Root Cause Analysis

## Purpose
Work a quality problem through the eight disciplines so the corrective action addresses a verified cause rather than the first plausible one.

## Instructions
Act as a quality engineer. Work the problem below through the 8D method. Do not move past D4 on a theory — a root cause is confirmed when you can turn the defect on and off by manipulating the suspected cause.

Inputs:
- **Problem:** [what was observed, where, and by whom]
- **Detection:** [how it was found, and at which step]
- **Scope:** [quantity affected, lots, date codes, and what is known to be contained]
- **Process:** [the operation involved, equipment, materials, and any recent changes]
- **Data:** [measurements, inspection results, process parameters]

Work through:
- **D1 Team** — the disciplines required, and why each is on it
- **D2 Problem description** — is/is-not analysis: what is affected and what comparable thing is not, across part, location, time and magnitude. This is where the cause is usually narrowed
- **D3 Interim containment** — what stops the customer seeing another one today, how it is verified, and how long it can be sustained
- **D4 Root cause** — 5 Whys or a fishbone, tested against the is/is-not table; separate the occurrence cause from the escape cause, since something also let it past inspection
- **D5 Chosen corrective actions** — addressing both causes, each with a verification method chosen before implementation
- **D6 Implementation and validation** — evidence the defect is gone, over a stated production volume rather than a single good lot
- **D7 Prevention** — the control plan, FMEA, work instruction, and drawing updates; the read-across to similar parts and processes
- **D8 Closure** — recognition, and the lessons captured somewhere a future engineer will find them

Flag any proposed corrective action that depends on an operator remembering something. Those are the actions that fail quietly.

## Output Format
- Full 8D report in the sections above
- Is/is-not table
- Action table: action, owner, due date, verification method, status
- A read-across list of other parts or lines with the same exposure

## Related Prompts
- [Supplier Quality Audit](./supplier-quality-audit.md)
- [Incident and Near-Miss Report](./incident-and-near-miss-report.md)

## Reputable Sources
- ASQ, quality tools and problem solving: https://asq.org/quality-resources
- NIST Manufacturing Extension Partnership: https://www.nist.gov/mep
