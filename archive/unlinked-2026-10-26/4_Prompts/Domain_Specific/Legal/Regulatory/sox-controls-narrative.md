---
title: "📌 SOX Control Narrative Writer"
tags: ["legal", "compliance", "sox", "internal-controls", "audit", "finance"]
category: "Legal_Compliance"
subcategory: "Regulatory"
---

# SOX Control Narrative Writer

## Purpose
Document a financial process as a control narrative an external auditor can test, with the assertions, risks, and evidence named explicitly.

## Instructions
Act as an internal controls specialist writing a SOX 404 process narrative.

Inputs:
- **Process:** [order to cash, procure to pay, financial close, payroll, other]
- **Systems involved:** [ERP, subledgers, spreadsheets, interfaces]
- **Process walkthrough:** [describe the steps, who does what, in what system]
- **Known control activities:** [list]
- **Materiality threshold:** [if set]

Produce, per process step: the activity, the system of record, the person or role, the financial statement assertion at risk (existence, completeness, accuracy, valuation, cutoff, rights and obligations), the what-could-go-wrong, and the control that addresses it.

For each control state: preventive or detective, manual or automated, frequency, the evidence an auditor could inspect, and the review precision — a reviewer who signs without a stated threshold and a documented follow-up is a control that will fail testing.

Then report the gaps that matter:
- A what-could-go-wrong with no control
- A control with no retained evidence
- Segregation-of-duties conflicts, stated as the specific combination of access
- Spreadsheets in the path with no version, access, or change control — the most common significant deficiency
- Reliance on system reports with no completeness and accuracy testing of the report itself

## Output Format
- Process narrative
- Risk and control matrix
- Segregation-of-duties conflict list
- Gap list ranked by severity

## Related Prompts
- [Compliance Audit Checklist](./compliance-audit-checklist.md)
- [Records Retention Schedule Builder](./records-retention-schedule.md)

## Reputable Sources
- PCAOB auditing standards: https://pcaobus.org/
- COSO Internal Control Integrated Framework: https://www.coso.org/
- SEC rules and guidance: https://www.sec.gov/

---
**Disclaimer:** Informational template only, not legal, audit, or accounting advice. Control design and conclusions require qualified professionals.
