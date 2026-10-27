---
title: "📌 SOAP Note Drafter"
tags: ["healthcare", "clinical-documentation", "soap", "ehr", "charting"]
category: "Healthcare"
subcategory: "Clinical_Documentation"
---

# SOAP Note Drafter

## Purpose
Turn a clinician's rough encounter notes into a structured SOAP note that is ready for review and edit before it enters the chart.

## Instructions
Act as a clinical documentation specialist. Reorganize the notes below into a SOAP note. Do not add findings, diagnoses, or vitals that were not supplied — mark anything missing as `[NOT DOCUMENTED]` instead of inferring it.

Inputs:
- **Setting:** [primary care / urgent care / specialty]
- **Visit type:** [new patient / follow-up / post-op / telehealth]
- **Raw notes:** [paste dictation or shorthand]
- **Template constraints:** [EHR field limits, required sections, billing level targeted]

Structure the output as:
- **Subjective:** chief complaint, HPI in OLDCARTS order, pertinent ROS, relevant history
- **Objective:** vitals, exam findings, results — only what was documented
- **Assessment:** problem list, each with the clinician's stated reasoning
- **Plan:** per problem — orders, medications, patient instructions, follow-up interval

Flag separately: internal contradictions, findings mentioned in the plan but absent from the objective section, and any statement that reads as a diagnosis but was phrased as a possibility.

## Output Format
- SOAP note in EHR-pasteable plain text
- A short "review before signing" list of gaps and contradictions

## Related Prompts
- [Clinical Handoff (SBAR) Builder](./clinical-handoff-sbar.md)
- [Discharge Summary Builder](./discharge-summary-builder.md)

## Reputable Sources
- AHRQ documentation and patient safety resources: https://www.ahrq.gov/
- CMS Evaluation and Management documentation guidelines: https://www.cms.gov/

---
**Disclaimer:** Documentation aid only, not clinical decision support. A licensed clinician must review and sign every note. Do not paste protected health information into a service you do not have a Business Associate Agreement with.
