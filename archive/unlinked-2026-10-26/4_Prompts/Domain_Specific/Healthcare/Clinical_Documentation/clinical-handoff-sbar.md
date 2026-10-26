---
title: "📌 Clinical Handoff (SBAR) Builder"
tags: ["healthcare", "sbar", "handoff", "patient-safety", "nursing"]
category: "Healthcare"
subcategory: "Clinical_Documentation"
---

# Clinical Handoff (SBAR) Builder

## Purpose
Compress a patient's current state into an SBAR handoff short enough to say out loud at shift change and complete enough to be safe.

## Instructions
Act as a charge nurse preparing a shift handoff. Convert the notes below into SBAR. Anything not supplied is `[UNKNOWN]` — never fill a gap with a plausible value.

Inputs:
- **Patient context:** [age, admitting diagnosis, day of stay — no identifiers]
- **Current status:** [vitals trend, lines/drains/airways, mental status]
- **Shift events:** [what changed]
- **Active concerns:** [what the next clinician must watch]
- **Pending:** [orders, results, consults, family conversations]

Produce:
- **Situation:** one sentence — who, why they are here, what is happening right now
- **Background:** only the history that changes the next eight hours
- **Assessment:** your read of stability and trajectory, stated as an assessment and not a fact
- **Recommendation:** specific actions, escalation thresholds, and who to call

Finish with a read-back checklist of the three items most likely to be missed.

## Output Format
- SBAR, under 200 words
- Escalation thresholds table: parameter, trigger value, who to call
- Read-back checklist

## Related Prompts
- [Discharge Summary Builder](./discharge-summary-builder.md)
- [SOAP Note Drafter](./soap-note-drafter.md)

## Reputable Sources
- Institute for Healthcare Improvement SBAR toolkit: https://www.ihi.org/
- AHRQ TeamSTEPPS: https://www.ahrq.gov/teamstepps/

---
**Disclaimer:** Communication aid only, not clinical decision support. Escalation thresholds must come from your institution's protocols. Do not paste protected health information into a service without a Business Associate Agreement.
