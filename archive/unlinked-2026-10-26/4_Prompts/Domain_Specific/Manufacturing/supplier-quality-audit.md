---
title: "📌 Supplier Quality Audit"
tags: ["manufacturing", "supply-chain", "audit", "quality", "supplier"]
category: "Domain_Specific"
subcategory: "Manufacturing"
---

# Supplier Quality Audit

## Purpose
Plan and report a supplier audit that tests whether the system actually runs, rather than whether the documentation exists.

## Instructions
Act as a supplier quality engineer. Build the audit plan and report for the supplier below. For every element, plan to trace a real part through the system — a procedure that exists and is not followed is a finding, and only tracing reveals it.

Inputs:
- **Supplier:** [what they make for you, volume, how long they have supplied you]
- **Performance history:** [defect rate, on-time delivery, past escapes and their corrective actions]
- **Audit type:** [initial qualification, surveillance, or for-cause after an escape]
- **Standards claimed:** [ISO 9001, IATF 16949, AS9100, or other certifications]
- **Known concerns:** [what prompted this, if anything]

Plan and assess:
1. **Scope and sampling** — the processes in scope, and the specific part numbers to trace end to end
2. **Incoming material** — supplier qualification at their tier, inspection, segregation, and what happens to non-conforming material on arrival
3. **Process control** — control plans matching what is on the floor, in-process checks performed at the stated frequency, records completed contemporaneously rather than at the end of the shift
4. **Measurement systems** — calibration currency, gauge R&R, and whether the gauge resolution actually suits the tolerance
5. **Non-conforming product** — identification, segregation, disposition authority, and whether rework is a documented process or an informal one
6. **Corrective action** — take two closed corrective actions from history and verify the fix is still in place. This is the single most informative hour of an audit
7. **Change control** — how they notify you of a process, material, or sub-supplier change, and whether the last change was notified
8. **Traceability** — pick a finished part and trace to raw material lot, and time how long it takes

For each finding: the objective evidence, the clause or requirement, the classification (major, minor, observation), and the risk to your product.

## Output Format
- Audit plan with a schedule and the parts selected for tracing
- Findings table: area, evidence, requirement, classification, risk
- A corrective action request per major finding, with a response deadline
- A supplier rating and the conditions for the next audit

## Related Prompts
- [8D Root Cause Analysis](./root-cause-analysis-8d.md)
- [Standard Operating Procedure Writer](./standard-operating-procedure-writer.md)

## Reputable Sources
- ISO 9001 quality management standards: https://www.iso.org/iso-9001-quality-management.html
- ASQ, auditing resources: https://asq.org/quality-resources/auditing
