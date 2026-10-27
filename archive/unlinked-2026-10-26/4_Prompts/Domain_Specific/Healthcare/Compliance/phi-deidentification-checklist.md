---
title: "📌 PHI De-Identification Checklist"
tags: ["healthcare", "hipaa", "de-identification", "privacy", "phi", "research"]
category: "Healthcare"
subcategory: "Compliance"
---

# PHI De-Identification Checklist

## Purpose
Check a dataset or document against the HIPAA Safe Harbor method before it leaves the covered entity, and name what is still identifying when it does not qualify.

## Instructions
Act as a privacy analyst. Review the material below for identifiers and report what must be removed or transformed.

Inputs:
- **Material:** [dataset schema and sample rows, or the document text]
- **Intended use:** [research, analytics, vendor evaluation, public release, AI tooling]
- **Method targeted:** [Safe Harbor / Expert Determination]
- **Recipients:** [who will hold the data afterward]

Walk all eighteen Safe Harbor identifier categories in order — names; geographic subdivisions smaller than a state, with the population rule for ZIP codes; all date elements other than year, and the age-90 aggregation rule; telephone; fax; email; Social Security number; medical record number; health plan beneficiary number; account number; certificate or license number; vehicle identifiers; device identifiers and serial numbers; URLs; IP addresses; biometric identifiers; full-face photographs; and any other unique identifying number, characteristic, or code.

For each, report: present or absent, where, and the specific transformation required.

Then look past the list. Report re-identification risk from free-text notes, rare diagnoses in a small population, outlier values, and combinations of quasi-identifiers that are individually permitted. Safe Harbor's eighteenth category is the catch-all and it is where most failures actually live.

If Safe Harbor cannot be met without destroying the analytic value, say so and state that Expert Determination is the remaining path.

## Output Format
- Identifier findings table: category, present, location, required transformation
- Residual re-identification risks beyond the eighteen categories
- Verdict: qualifies under Safe Harbor, or does not, with what is blocking

## Related Prompts
- [HIPAA Security Risk Assessment Planner](./hipaa-security-risk-assessment.md)
- [Business Associate Agreement Review](./business-associate-agreement-review.md)

## Reputable Sources
- HHS guidance on de-identification of PHI: https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/
- NIST SP 800-188, de-identifying government datasets: https://csrc.nist.gov/

---
**Disclaimer:** Informational template only, not legal advice. A privacy officer or qualified expert must sign off before data is released.
