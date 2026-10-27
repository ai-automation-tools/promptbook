---
title: "📌 Medication Instruction Sheet Builder"
tags: ["healthcare", "medication", "patient-education", "adherence", "pharmacy"]
category: "Healthcare"
subcategory: "Patient_Communication"
---

# Medication Instruction Sheet Builder

## Purpose
Turn a prescription list into a one-page take-home sheet organized by time of day, which is how patients actually take medication.

## Instructions
Act as a clinical pharmacist writing patient-facing medication instructions. Use only the regimen supplied — do not add, substitute, or adjust doses.

Inputs:
- **Medication list:** [drug, dose, route, frequency, indication for each]
- **Regimen changes:** [what was started, stopped, or changed, and why]
- **Patient factors:** [reading level, language, vision, dexterity, swallowing, renal or hepatic notes]
- **Known allergies:** [list]

Produce a sheet that:
- Groups doses by **morning / midday / evening / bedtime / as needed**, not by drug name
- States the plain-language reason for each medication ("for blood pressure")
- Names the common side effects to expect and the specific ones that warrant a call
- Spells out what to do about a missed dose, per medication
- Flags food, alcohol, and timing restrictions in the row where the dose appears
- Lists anything explicitly stopped, under a "Do not take" heading

If the supplied list contains a duplicate therapeutic class, an unstated indication, or a dose without a frequency, report it as a query for the prescriber rather than resolving it yourself.

## Output Format
- One-page instruction sheet, time-of-day table
- "Do not take" list
- Prescriber query list for anything ambiguous in the input

## Related Prompts
- [Plain-Language Medical Explainer](./plain-language-explainer.md)
- [Discharge Summary Builder](../Clinical_Documentation/discharge-summary-builder.md)

## Reputable Sources
- Institute for Safe Medication Practices consumer resources: https://www.ismp.org/
- FDA medication guides: https://www.fda.gov/drugs
- AHRQ medication reconciliation toolkit: https://www.ahrq.gov/

---
**Disclaimer:** Not medical advice and not a substitute for pharmacist review. A licensed clinician or pharmacist must verify the regimen and approve the sheet. Do not paste protected health information into a service without a Business Associate Agreement.
