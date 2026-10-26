---
title: "📌 Marketplace Listing Adapter"
tags: ["ecommerce", "marketplace", "amazon", "etsy", "multichannel", "listings"]
category: "Business"
subcategory: "Ecommerce"
---

# Marketplace Listing Adapter

## Purpose
Adapt one product listing across marketplaces whose formats, ranking signals, and content rules differ, without flattening it to the lowest common denominator.

## Instructions
Act as a multichannel merchandising specialist.

Inputs:
- **Source listing:** [title, bullets, description, images, attributes]
- **Target marketplaces:** [Amazon, Etsy, eBay, Walmart, own store]
- **Product category:** [and the marketplace category if known]
- **Attributes available:** [GTIN, brand, material, dimensions, variations]
- **Pricing and shipping per channel:** [text]

For each target produce a version that respects: the title character limit and what that marketplace's title is actually for, the bullet or attribute structure it expects, the required and recommended attribute fields for the category, image count and dimension rules, and the prohibited-content rules that differ by platform.

Understand what differs, not just the limits. A marketplace that ranks on exact-match attributes rewards complete structured fields more than prose. One with a handmade or vintage framing rewards the maker story. One with an established buyer intent of price comparison rewards clarity on what is in the box.

Also produce:
- A shared attribute source of truth, so a spec change propagates instead of drifting per channel
- A duplicate-content note where the same prose across channels could harm the owned store's ranking
- A per-channel compliance check against prohibited claims and restricted category rules

Flag any attribute a target marketplace requires that the source listing does not have.

## Output Format
- One adapted listing per marketplace
- Shared attribute table
- Missing-attribute list per channel
- Compliance and duplicate-content notes

## Related Prompts
- [Product Listing SEO Optimizer](./product-listing-seo-optimizer.md)
- [Product Catalog Taxonomy Designer](./product-taxonomy-designer.md)

## Reputable Sources
- Google Merchant Center product data specification: https://support.google.com/merchants
- GS1 product identification standards: https://www.gs1.org/
