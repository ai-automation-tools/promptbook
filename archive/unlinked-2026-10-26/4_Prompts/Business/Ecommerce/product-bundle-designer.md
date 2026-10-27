---
title: "📌 Product Bundle Designer"
tags: ["ecommerce", "bundling", "aov", "pricing", "merchandising"]
category: "Business"
subcategory: "Ecommerce"
---

# Product Bundle Designer

## Purpose
Design bundles around what customers buy together for a reason, and price them so the discount buys attachment rather than subsidizing a sale that was already happening.

## Instructions
Act as a merchandising analyst designing product bundles.

Inputs:
- **Catalog with unit margin:** [products, price, cost]
- **Co-purchase data:** [pairs and triples bought together, with frequency]
- **Sequential purchase data:** [what gets bought second, and how long after]
- **Inventory position:** [overstock, constrained, seasonal]
- **Average order value and its distribution:** [not just the mean]

Design each bundle with:
- **A stated rationale** — completion (the thing needed to use the main product), consumables (the thing bought again), upgrade, or discovery. A bundle with no rationale is a discount with extra steps.
- **Discount depth** derived from the blended margin, with the floor stated
- **The attachment assumption**: what share of buyers of the anchor product would have bought the second item anyway. Bundling a high-attachment pair gives away margin on a sale you already had; that is the main way bundling loses money.
- **Inventory effect**, especially where a bundle consumes a constrained item

Also evaluate:
- Whether an unbundled option must remain visible, since removing it reads as a price increase
- Decoy and anchoring effects across the bundle tiers, and whether the middle tier is the intended choice
- Returns handling when one item in a bundle comes back — the policy and the refund math, which is where bundles quietly lose margin after launch

Rank bundles by expected incremental margin, not by expected revenue.

## Output Format
- Bundle definitions with rationale and pricing
- Margin and attachment assumptions per bundle
- Partial-return handling rules
- Ranked list by incremental margin, with the discarded candidates and why

## Related Prompts
- [Upsell and Cross-Sell](./upsell-cross-sell.md)
- [Promotional Calendar Planner](./promotional-calendar-planner.md)

## Reputable Sources
- Harvard Business Review on bundling and pricing: https://hbr.org/
- MIT Sloan Management Review pricing research: https://sloanreview.mit.edu/
