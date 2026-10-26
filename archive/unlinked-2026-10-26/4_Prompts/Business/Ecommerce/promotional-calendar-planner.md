---
title: "📌 Promotional Calendar Planner"
tags: ["ecommerce", "promotions", "margin", "planning", "merchandising"]
category: "Business"
subcategory: "Ecommerce"
---

# Promotional Calendar Planner

## Purpose
Plan a year of promotions with the margin math attached, so the calendar shows what each event costs as well as what it sells.

## Instructions
Act as a merchandising planner.

Inputs:
- **Category mix and gross margin by category:** [text]
- **Seasonality:** [monthly revenue index, if known]
- **Inventory position and aging:** [what must clear, by when]
- **Last year's promotions:** [event, discount depth, revenue, margin, and baseline]
- **Fixed calendar events:** [the ones your market observes]
- **Customer acquisition cost and repeat rate:** [text]

For each planned event specify: dates, mechanic (percentage off, threshold, bundle, gift with purchase, tiered), products included and excluded, discount depth, the margin at that depth, and the incremental units needed to break even against the margin given up.

Then apply the checks that keep a calendar honest:
- **Incrementality.** Revenue during a promotion is not the same as revenue caused by it. Estimate the baseline that would have sold anyway and subtract it.
- **Cannibalization** of the full-price weeks on either side, and of adjacent events.
- **Training effects.** A predictable monthly discount teaches customers to wait, which shows up as declining full-price sell-through over quarters rather than within an event.
- **Margin floor** per category, below which an event is rejected regardless of volume.
- **Inventory purpose.** Clearance and demand generation are different objectives and should not share a mechanic.

Leave deliberate full-price gaps and say why they are there.

## Output Format
- Annual calendar with event detail
- Per-event margin and break-even table
- Incrementality and cannibalization assumptions, stated
- Rejected events with the reason

## Related Prompts
- [Pricing Strategy](./pricing-strategy.md)
- [Product Bundle Designer](./product-bundle-designer.md)

## Reputable Sources
- Harvard Business Review pricing and promotion research: https://hbr.org/
- MIT Sloan Management Review on promotional strategy: https://sloanreview.mit.edu/
