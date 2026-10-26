---
title: "📌 Business Associate Agreement Review"
tags: ["healthcare", "hipaa", "baa", "vendor-risk", "contracts", "compliance"]
category: "Healthcare"
subcategory: "Compliance"
---

# Business Associate Agreement Review

## Purpose
Review a BAA against the Security Rule's required terms and against the vendor's actual data practices, which is where the gap usually is.

## Instructions
Act as a healthcare privacy counsel reviewing a Business Associate Agreement.

Inputs:
- **Vendor and service:** [what they do with ePHI]
- **Agreement text:** [paste the BAA]
- **Data flow:** [what ePHI they receive, where it is stored, who else touches it]
- **Subcontractors:** [known downstream processors]
- **Your role:** [covered entity / business associate passing through]

Check for every required element: permitted uses and disclosures, the prohibition on other use, safeguards obligations, reporting of security incidents and breaches with a stated timeline, subcontractor flow-down, access and amendment obligations under the Privacy Rule, accounting of disclosures, availability of records to HHS, return or destruction on termination, and termination for breach of the agreement.

For each: present, absent, or present but weaker than required. Quote the clause.

Then flag the commercial terms that routinely undercut the compliance terms: breach notification measured in business days rather than a fixed short period, indemnity caps below plausible breach cost, a right to use de-identified or aggregated data with no de-identification standard named, and secondary use for product improvement or model training.

## Output Format
- Required-element checklist with quoted clauses
- Gap list with proposed replacement language
- Commercial-risk flags, ranked
- Go / no-go recommendation with conditions

## Related Prompts
- [HIPAA Security Risk Assessment Planner](./hipaa-security-risk-assessment.md)
- [PHI De-Identification Checklist](./phi-deidentification-checklist.md)

## Reputable Sources
- HHS business associate guidance and sample provisions: https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/
- HHS HIPAA Security Rule guidance: https://www.hhs.gov/hipaa/for-professionals/security/

---
**Disclaimer:** Informational template only, not legal advice. Qualified counsel must review any agreement before execution.
