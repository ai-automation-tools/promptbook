---
title: "📌 Returns Policy Generator"
tags: ["ecommerce", "returns", "policy", "customer-experience", "reverse-logistics"]
category: "Business"
subcategory: "Ecommerce"
---

# Returns Policy Generator

## Purpose
Write a returns policy that customers can understand before buying and that operations can actually execute, with the cost of each choice made explicit.

## Instructions
Act as an e-commerce operations lead. Draft a returns policy and the process behind it.

Inputs:
- **Products:** [category, price band, size and weight, perishability, hygiene constraints]
- **Markets sold to:** [countries or states]
- **Current return rate and top reasons:** [if known]
- **Return shipping cost per unit:** [text]
- **Restocking capability:** [can returned goods be resold, refurbished, or only written off]
- **Current policy:** [paste, or say "none"]

Produce the customer-facing policy: window, condition requirements, who pays return shipping, refund method and timing, exchanges, exclusions with the reason stated, and how to start a return. Write it in plain language — a policy that requires interpretation generates tickets, which cost more than the returns do.

Then produce the internal process: inspection criteria, disposition rules by condition, refund authorization thresholds, fraud signals, and the exception path.

State the economics plainly: for each policy lever (window length, free vs paid return shipping, exchange incentives, keep-it thresholds below the reverse logistics cost) give the effect on conversion, the effect on return rate, and the net cost direction. A more generous policy usually raises both conversion and returns; the decision needs both numbers, not one.

Flag statutory minimums in the listed markets that override whatever the policy says — distance-selling withdrawal rights and consumer guarantee regimes are the common ones.

## Output Format
- Customer-facing policy
- Internal process and disposition rules
- Lever-by-lever economics table
- Statutory override flags by market

## Related Prompts
- [Customer Service Macro Library](./customer-service-macro-library.md)
- [Shipping and Fulfillment](./shipping-fulfillment.md)

## Reputable Sources
- FTC business guidance on refunds and returns: https://www.ftc.gov/business-guidance
- European Commission consumer rights on distance selling: https://commission.europa.eu/
- Baymard Institute research on returns and conversion: https://baymard.com/

---
**Disclaimer:** Informational template only, not legal advice. Consumer protection requirements vary by market and must be confirmed with qualified counsel.
