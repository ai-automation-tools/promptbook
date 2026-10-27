---
title: "📌 Prior Authorization Request Builder"
tags: ["healthcare", "prior-authorization", "revenue-cycle", "payer", "medical-necessity"]
category: "Healthcare"
subcategory: "Operations"
---

# Prior Authorization Request Builder

## Purpose
Assemble a prior authorization request that answers the payer's medical-necessity criteria point by point, instead of attaching the chart and hoping.

## Instructions
Act as a prior authorization specialist. Draft the request below.

Inputs:
- **Service requested:** [drug, procedure, DME, imaging — with code if known]
- **Payer and plan:** [name, plan type, policy number if known]
- **Payer policy criteria:** [paste the criteria, or say "unknown"]
- **Diagnosis:** [with ICD-10 code if available]
- **Clinical history supporting necessity:** [duration, severity, functional impact]
- **Conservative therapy tried:** [each treatment, dose, duration, outcome]
- **Contraindications to preferred alternatives:** [if any]

Structure the request so that each payer criterion gets its own labeled paragraph citing the specific clinical facts that satisfy it. Where a criterion is not met, say so explicitly and state the exception being requested — a silent gap reads as a failed criterion.

List every attachment and what it proves. Flag any criterion with no supporting documentation as a blocker to resolve before submission.

## Output Format
- Request letter, criterion by criterion
- Attachment index mapped to criteria
- Blocker list: criteria with no supporting evidence

## Related Prompts
- [Claim Denial Appeal Letter](./denial-appeal-letter.md)
- [Specialist Referral Letter Writer](../Clinical_Documentation/referral-letter-writer.md)

## Reputable Sources
- CMS prior authorization and pre-claim review initiatives: https://www.cms.gov/
- American Medical Association prior authorization resources: https://www.ama-assn.org/

---
**Disclaimer:** Administrative aid only, not medical or legal advice. A licensed clinician must attest to medical necessity. Do not paste protected health information into a service without a Business Associate Agreement.
