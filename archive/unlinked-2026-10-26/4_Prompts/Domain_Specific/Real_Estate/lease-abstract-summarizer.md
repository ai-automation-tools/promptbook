---
title: "📌 Lease Abstract Summarizer"
tags: ["real-estate", "lease", "commercial", "abstract", "contracts"]
category: "Domain_Specific"
subcategory: "Real_Estate"
---

# Lease Abstract Summarizer

## Purpose
Reduce a commercial lease to the terms that get relied on daily, with every entry pointing back to the clause it came from.

## Instructions
Act as a lease administrator. Abstract the lease below. Cite the section number for every extracted term. Where the lease is silent or ambiguous, write `not addressed` or `ambiguous — see section X` rather than supplying the market norm.

Inputs:
- **Lease document:** [paste, or the relevant sections]
- **Perspective:** [landlord or tenant]
- **Amendments:** [any that modify the original, with dates]

Extract:
1. **Parties and premises** — legal names, suite, rentable and usable area, and the measurement standard used
2. **Term** — commencement, rent commencement if different, expiry, and the exact renewal mechanics including the notice window and how rent is set on renewal
3. **Rent** — base rent schedule, escalations and their basis, free rent periods, and percentage rent if any
4. **Operating expenses** — structure (gross, modified gross, triple net), base year, the tenant's proportionate share, caps, exclusions, and the audit right
5. **Security** — deposit, letter of credit, guaranty, and the burn-down conditions
6. **Critical dates** — every date with a deadline attached, with the notice period and the consequence of missing it, which is the section most likely to cost real money
7. **Use and exclusivity** — permitted use, restrictions, exclusive rights, continuous operation
8. **Assignment and sublet** — consent standard, recapture rights, permitted transfers
9. **Maintenance and repair** — the split, HVAC and roof specifically, and the end-of-term restoration obligation
10. **Options and rights** — expansion, contraction, right of first refusal, termination, with exercise mechanics
11. **Default and remedies** — cure periods, and the events with no cure period

## Output Format
- Abstract in the sections above, with a clause citation on every line
- A critical dates calendar: date, obligation, notice required, consequence of missing
- An open items list: ambiguous terms and terms not addressed

## Related Prompts
- [Due Diligence Checklist](./due-diligence-checklist.md)
- [Vendor Agreement Review](../Legal/Contracts/vendor-agreement-review.md)

## Reputable Sources
- BOMA International, floor measurement standards: https://www.boma.org/
- US Small Business Administration, leasing business space: https://www.sba.gov/

---
**Disclaimer:** A lease abstract is a summary for administration, not a legal interpretation. The lease document controls; qualified counsel should review anything consequential.
