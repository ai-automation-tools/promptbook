---
title: "📌 Checkout Friction Audit"
tags: ["ecommerce", "checkout", "conversion", "ux", "cart-abandonment"]
category: "Business"
subcategory: "Ecommerce"
---

# Checkout Friction Audit

## Purpose
Audit a checkout flow against the abandonment reasons that research consistently finds, and rank fixes by the share of abandonment each one plausibly recovers.

## Instructions
Act as a conversion optimization analyst auditing the checkout below.

Inputs:
- **Flow description:** [each step, each field, in order — or paste screenshots described]
- **Platform:** [Shopify, WooCommerce, custom]
- **Device split:** [mobile vs desktop share of traffic and of conversions]
- **Abandonment rate by step:** [if instrumented]
- **Payment methods offered:** [list]
- **Average order value and shipping policy:** [text]

Audit against the dominant abandonment causes, in rough order of how often they dominate: unexpected extra cost revealed late; forced account creation; a flow that looks long or has no visible progress; distrust at the payment step; a limited payment method set; and slow or error-prone form handling.

For each finding report: the step, what the user experiences, the abandonment cause it maps to, and the fix. Then estimate the plausible recovery range and say what it depends on — an estimate without its assumptions is a guess with a number attached.

Check specifically:
- Total cost including shipping and tax shown before the final step
- Guest checkout present and not visually subordinate to account creation
- Field count, and every field that is not strictly required
- Address autocomplete, input types correct on mobile, and autofill compatibility
- Inline validation with errors that say how to fix them
- Trust signals placed at the payment field, not in the footer
- Mobile tap targets, keyboard type per field, and whether the pay button is reachable without scrolling past errors

## Output Format
- Findings by step with abandonment-cause mapping
- Prioritized fix list with effort and estimated recovery range
- Test plan: what to measure, sample size needed, and the guardrail metric

## Related Prompts
- [Abandoned Cart Recovery Strategy](./abandoned-cart-recovery.md)
- [Conversion Rate Optimization](./conversion-rate-optimization.md)

## Reputable Sources
- Baymard Institute checkout usability research: https://baymard.com/
- Nielsen Norman Group e-commerce research: https://www.nngroup.com/
