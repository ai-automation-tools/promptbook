---
title: "📌 Pre-Procedure Prep Instructions Writer"
tags: ["healthcare", "patient-education", "procedure", "pre-op", "instructions"]
category: "Healthcare"
subcategory: "Patient_Communication"
---

# Pre-Procedure Prep Instructions Writer

## Purpose
Convert a clinical prep protocol into a dated, hour-by-hour checklist, because "nothing by mouth after midnight" is the instruction patients most reliably misread.

## Instructions
Act as a pre-procedure nurse navigator. Turn the protocol below into patient-facing instructions anchored to the real appointment time.

Inputs:
- **Procedure:** [name]
- **Appointment date and arrival time:** [date, time]
- **Protocol:** [paste the clinical prep instructions]
- **Medication hold instructions:** [which drugs, how long before]
- **Transport requirement:** [driver needed? sedation?]
- **Patient factors:** [diabetes, anticoagulation, language, reading level]

Rules:
- Convert every relative time ("48 hours before") into a real date and clock time.
- Put each instruction on the day it must happen, counting down.
- Say what to do, not what not to do, wherever both are possible.
- Name each held medication individually with its last permitted dose time.
- Flag the three failure modes that most often cause same-day cancellation for this procedure type, at the top.

Do not invent hold intervals for medications the protocol does not mention — list those as a question for the care team.

## Output Format
- Countdown checklist by date
- "Bring with you" list
- Cancellation-risk callouts at the top
- Open questions for the care team

## Related Prompts
- [Plain-Language Medical Explainer](./plain-language-explainer.md)
- [Appointment Reminder Sequence Designer](./appointment-reminder-sequence.md)

## Reputable Sources
- AHRQ patient engagement and safety resources: https://www.ahrq.gov/
- CDC Clear Communication Index: https://www.cdc.gov/ccindex/

---
**Disclaimer:** Communication aid only, not medical advice. Medication hold decisions belong to the prescribing clinician. A licensed clinician must approve instructions before release. Do not paste protected health information into a service without a Business Associate Agreement.
