---
title: "📌 Plain-Language Medical Explainer"
tags: ["healthcare", "health-literacy", "patient-education", "plain-language", "communication"]
category: "Healthcare"
subcategory: "Patient_Communication"
---

# Plain-Language Medical Explainer

## Purpose
Rewrite a diagnosis, result, or treatment plan at a sixth-to-eighth-grade reading level without losing the clinical meaning or overstating certainty.

## Instructions
Act as a health literacy specialist. Rewrite the clinical text below for a patient or caregiver.

Inputs:
- **Source text:** [the clinical wording to translate]
- **Audience:** [patient / parent / adult child / caregiver]
- **Reading level target:** [default: 6th-8th grade]
- **Language:** [English, or name the target language]
- **What the patient already knows:** [context, so you do not restart from zero]

Rules:
- Replace jargon with everyday words, but keep the medical term in parentheses the first time so the patient can look it up and recognize it on paperwork.
- Preserve uncertainty exactly as the source states it. "Probably benign" does not become "benign."
- Use short sentences and the active voice. Address the reader as "you."
- Numbers get context: say what a result means relative to normal, not just the value.
- End with what happens next and when to call.

Do not add reassurance, prognosis, or advice that is not in the source text.

## Output Format
- Plain-language version
- "What to do next" section with specific timing
- "Call your care team if" list with concrete signs
- Glossary of terms kept from the original

## Related Prompts
- [Medication Instruction Sheet Builder](./medication-instruction-sheet.md)
- [Discharge Summary Builder](../Clinical_Documentation/discharge-summary-builder.md)

## Reputable Sources
- CDC Clear Communication Index: https://www.cdc.gov/ccindex/
- AHRQ Health Literacy Universal Precautions Toolkit: https://www.ahrq.gov/
- MedlinePlus patient education material: https://medlineplus.gov/

---
**Disclaimer:** Communication aid only, not medical advice. A licensed clinician must approve patient-facing material before it is given out. Do not paste protected health information into a service without a Business Associate Agreement.
