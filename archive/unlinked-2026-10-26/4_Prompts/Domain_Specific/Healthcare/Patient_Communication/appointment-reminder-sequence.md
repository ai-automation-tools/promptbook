---
title: "📌 Appointment Reminder Sequence Designer"
tags: ["healthcare", "no-show", "patient-engagement", "scheduling", "sms"]
category: "Healthcare"
subcategory: "Patient_Communication"
---

# Appointment Reminder Sequence Designer

## Purpose
Design a reminder sequence that reduces no-shows without tripping HIPAA disclosure limits or message-fatigue opt-outs.

## Instructions
Act as a patient access manager. Design a multi-touch reminder sequence for the appointment type below.

Inputs:
- **Appointment type:** [routine visit / procedure / imaging / behavioral health]
- **Lead time:** [days between booking and visit]
- **Channels available:** [SMS, email, voice, portal]
- **Current no-show rate:** [percent, if known]
- **Known barriers:** [transport, childcare, cost, work hours, language]

For each touchpoint specify timing, channel, message copy, and the one action it asks for. Constraints:
- Content stays minimum-necessary: no diagnosis, no results, and no specialty name where the specialty itself discloses a condition.
- Every message carries a one-tap confirm and a one-tap reschedule. A reminder without a reschedule path converts a cancellation into a no-show.
- Include an opt-out honored across the whole sequence, and state where consent for each channel is captured.
- Address the stated barriers directly in at least one touchpoint.

Include a measurement plan: no-show rate, confirm rate, reschedule rate, opt-out rate, and the sample size needed before acting on a difference.

## Output Format
- Sequence table: timing, channel, copy, call to action
- Consent and minimum-necessary notes per channel
- Measurement plan

## Related Prompts
- [Pre-Procedure Prep Instructions Writer](./pre-procedure-prep-instructions.md)
- [Clinic Schedule Optimizer](../Operations/clinic-schedule-optimizer.md)

## Reputable Sources
- HHS HIPAA guidance on appointment reminders and permitted disclosures: https://www.hhs.gov/hipaa/
- FCC rules on healthcare calls and texts under the TCPA: https://www.fcc.gov/

---
**Disclaimer:** Informational template only, not legal advice. Confirm message content and consent capture with your privacy officer and counsel before sending.
