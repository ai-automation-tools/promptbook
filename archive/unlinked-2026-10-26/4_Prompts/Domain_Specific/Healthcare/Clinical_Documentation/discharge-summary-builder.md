---
title: "📌 Discharge Summary Builder"
tags: ["healthcare", "discharge", "care-transitions", "clinical-documentation", "readmission"]
category: "Healthcare"
subcategory: "Clinical_Documentation"
---

# Discharge Summary Builder

## Purpose
Assemble a discharge summary the receiving clinician can act on, with the medication reconciliation and pending-results sections that care transitions most often drop.

## Instructions
Act as a hospitalist drafting a discharge summary for the patient's next provider. Use only the supplied record; list anything absent as `[PENDING — CONFIRM]`.

Inputs:
- **Admission reason and date:** [text]
- **Course in hospital:** [key events, procedures, consults]
- **Discharge diagnoses:** [primary and secondary]
- **Medications:** [on admission / added / changed / stopped]
- **Pending results at discharge:** [labs, cultures, imaging, pathology]
- **Disposition:** [home / SNF / rehab / home health]
- **Follow-up arranged:** [who, when, why]

Required sections: reason for admission, hospital course, discharge diagnoses, a medication reconciliation table (admission vs discharge, with a reason for every change), pending results with a named owner for each, functional status at discharge, follow-up appointments, and explicit return precautions.

Call out every medication that changed without a stated reason and every pending result with no named owner — those two gaps are the common readmission drivers.

## Output Format
- Discharge summary, sectioned
- Medication reconciliation table
- Open-items list: pending results, unassigned follow-ups, unexplained medication changes

## Related Prompts
- [SOAP Note Drafter](./soap-note-drafter.md)
- [Plain-Language Medical Explainer](../Patient_Communication/plain-language-explainer.md)

## Reputable Sources
- AHRQ Re-Engineered Discharge (RED) toolkit: https://www.ahrq.gov/
- The Joint Commission transitions of care resources: https://www.jointcommission.org/

---
**Disclaimer:** Documentation aid only. A licensed clinician must verify every medication, diagnosis, and follow-up before release. Do not paste protected health information into a service without a Business Associate Agreement.
