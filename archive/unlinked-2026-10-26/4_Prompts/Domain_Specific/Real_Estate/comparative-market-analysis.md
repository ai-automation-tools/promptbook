---
title: "📌 Comparative Market Analysis"
tags: ["real-estate", "valuation", "cma", "pricing", "analysis"]
category: "Domain_Specific"
subcategory: "Real_Estate"
---

# Comparative Market Analysis

## Purpose
Build a defensible pricing opinion from comparable sales, with every adjustment written down and justified.

## Instructions
Act as a real estate analyst preparing a CMA. Work only from the comparables supplied — do not introduce sales you were not given, and do not estimate a market trend that is not evidenced in the data provided.

Inputs:
- **Subject property:** [address, type, bedrooms, bathrooms, square footage, lot, year built, condition, features]
- **Comparable sales:** [for each: same attributes, sale price, sale date, days on market]
- **Active and pending listings:** [the current competition]
- **Local market conditions:** [inventory, trend, seasonality — only if you have data for it]
- **Purpose:** [listing price, offer strategy, or an owner conversation]

Produce:
1. **Comparable selection** — which comps are used and which are excluded, each with a reason. A comp excluded for being too dissimilar is a stronger analysis than one adjusted heavily to fit
2. **Adjustment grid** — line by line for size, condition, age, lot, garage, bedrooms, bathrooms and features, with the dollar or percentage adjustment and its basis
3. **Adjusted values** — per comp, with the gross and net adjustment totals, since a comp needing large gross adjustments is weak evidence even if the net is small
4. **Time adjustment** — only if the data supports a trend, with the trend stated and its source
5. **Value range** — supported low to high, with the point within it that the evidence best supports
6. **Market position** — where the subject sits against the current active competition, which is what a buyer actually chooses among
7. **Confidence** — high, medium or low, with the reason, usually comp quality or thin volume
8. **What would change this** — the missing information that would most narrow the range

## Output Format
- Comparable selection table with inclusion reasons
- Full adjustment grid
- Value range with the supported conclusion
- A confidence statement and the top two unknowns

## Related Prompts
- [Property Investment Underwriting](./property-investment-underwriting.md)
- [Property Listing Description Writer](./listing-description-writer.md)

## Reputable Sources
- The Appraisal Foundation, USPAP: https://www.appraisalfoundation.org/
- US Federal Housing Finance Agency house price data: https://www.fhfa.gov/data/hpi

---
**Disclaimer:** A comparative market analysis is a broker opinion of value, not an appraisal. Lending, tax and legal decisions require a licensed appraiser.
