---
title: "📌 SaaS Agreement Review Checklist"
tags: ["legal", "contracts", "saas", "vendor-risk", "procurement", "sla"]
category: "Legal_Compliance"
subcategory: "Contracts"
---

# SaaS Agreement Review Checklist

## Purpose
Review a SaaS master agreement from the customer side and separate the terms worth negotiating from the ones that only look important.

## Instructions
Act as commercial counsel reviewing a SaaS agreement for a customer.

Inputs:
- **Agreement text:** [paste MSA, order form, SLA, and DPA]
- **What the service does:** [and how critical it is to operations]
- **Data involved:** [personal data, regulated data, IP, none]
- **Contract value and term:** [text]
- **Leverage:** [competitive alternatives, deal size, timing]

Review these areas and quote the operative clause for each: scope of licence and permitted users; fees, uplift caps, and true-up mechanics; term, auto-renewal, and notice windows; service levels, the remedy for missing them, and whether that remedy is exclusive; data ownership and the return or deletion obligation at termination; security commitments and audit rights; privacy and subprocessor terms; confidentiality; IP indemnity; limitation of liability, its carve-outs, and whether the cap is measured against fees paid or fees payable; and termination for convenience and for cause.

Rank findings by what actually bites:
- **Exit risk.** Data export format, the window to retrieve it, and cost. A customer that cannot leave has no leverage at renewal regardless of the other terms.
- **Liability cap versus realistic exposure**, especially where the cap sits below the cost of a breach of the data being processed.
- **Service credits as the sole remedy** for an outage that would cost far more than the credit.
- **Uncapped uplift** at renewal, or renewal notice periods short enough to miss.
- **Unilateral amendment** rights over terms incorporated by URL.

For each, give fallback language at two levels: what to ask for, and what to accept.

## Output Format
- Clause-by-clause review with quotes
- Ranked risk list
- Negotiation positions: ask, fallback, walk-away
- Terms that are standard and not worth the negotiating capital

## Related Prompts
- [Vendor Agreement Review](./vendor-agreement-review.md)
- [Data Processor Agreement](../Privacy/data-processor-agreement.md)

## Reputable Sources
- International Association of Privacy Professionals resources: https://iapp.org/
- Cloud Security Alliance STAR registry: https://cloudsecurityalliance.org/star

---
**Disclaimer:** Informational template only, not legal advice. Qualified counsel must review any agreement before execution.
