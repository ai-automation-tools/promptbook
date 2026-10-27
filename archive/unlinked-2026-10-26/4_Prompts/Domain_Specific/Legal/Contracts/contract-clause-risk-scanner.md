---
title: "📌 Contract Clause Risk Scanner"
tags: ["legal", "contracts", "risk-review", "redlining", "negotiation"]
category: "Legal_Compliance"
subcategory: "Contracts"
---

# Contract Clause Risk Scanner

## Purpose
Scan a contract for the clauses that create asymmetric exposure, and tell the reader which side each one favours and by how much.

## Instructions
Act as contract counsel performing a first-pass risk review.

Inputs:
- **Contract text:** [paste]
- **Which party you represent:** [text]
- **Deal context:** [value, duration, criticality, relative leverage]
- **Governing law, if stated:** [text]
- **Your organization's standard positions:** [paste playbook, or say "none"]

Produce a finding per clause of interest with: the quoted language, which party it favours, the realistic worst case it permits, how far it deviates from a balanced market position, and proposed redline language.

Pay attention to the ones that hide:
- Indemnity scope broader than the corresponding liability cap, so the cap does not actually cap
- Definitions that quietly expand an operative term used elsewhere
- Obligations imported by reference to a URL the other side controls
- Notice provisions with a method or address that guarantees a missed deadline
- Automatic renewal paired with a notice window shorter than a budget cycle
- Assignment clauses that survive a change of control on one side only
- Survival clauses that keep the burdensome obligations and drop the protective ones
- Governing law and venue that make enforcement uneconomic relative to the deal value

Also report what is missing entirely — an absent limitation of liability or an absent termination right is a larger finding than any clause present in the document.

## Output Format
- Findings table: clause, quote, favours, worst case, deviation, redline
- Ranked top five by exposure
- Missing-clause list
- Summary recommendation: sign, negotiate, or escalate

## Related Prompts
- [SaaS Agreement Review Checklist](./saas-agreement-review-checklist.md)
- [Vendor Agreement Review](./vendor-agreement-review.md)

## Reputable Sources
- World Commerce and Contracting resources: https://www.worldcc.com/
- American Bar Association business law resources: https://www.americanbar.org/groups/business_law/

---
**Disclaimer:** Informational template only, not legal advice. A first-pass scan is not a substitute for review by qualified counsel.
