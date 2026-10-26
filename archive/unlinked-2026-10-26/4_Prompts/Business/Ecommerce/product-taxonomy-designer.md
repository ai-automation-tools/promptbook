---
title: "📌 Product Catalog Taxonomy Designer"
tags: ["ecommerce", "taxonomy", "navigation", "merchandising", "information-architecture"]
category: "Business"
subcategory: "Ecommerce"
---

# Product Catalog Taxonomy Designer

## Purpose
Design a catalog taxonomy around how customers narrow a choice, and separate the browse hierarchy from the filter attributes, which are different jobs.

## Instructions
Act as an information architect for an e-commerce catalog.

Inputs:
- **Catalog:** [product count, current categories, current filters]
- **Customer segments and their entry intent:** [browsing, replacing, gifting, specifying]
- **Search log terms:** [top queries, and queries with zero results]
- **Current navigation performance:** [category exit rates, filter usage, search share]
- **Merchandising constraints:** [brand blocks, supplier terms, seasonal]

Design:
1. **Browse hierarchy.** Three levels at most. Each level answers one question a customer is actually asking. A category that exists because the warehouse is organized that way is a supply-side artifact and will underperform.
2. **Facet set.** Attributes that narrow within a category, each one a real decision axis. Test each facet by asking whether a customer would ever exclude on it; if not, it is a spec, not a facet.
3. **Attribute schema** for products, including which attributes are required per category — an incomplete attribute makes a product invisible to the filter that would have sold it.
4. **Cross-category paths** for intents that cut across the hierarchy (gifting, compatibility, use case), as curated collections rather than as extra branches.

Report: zero-result queries that reveal a missing category, categories with too few products to justify a node, facets no one uses, and products that would be unreachable by browse.

## Output Format
- Browse hierarchy
- Facet definitions with the decision each supports
- Required attribute schema per category
- Findings: gaps, thin nodes, dead facets, unreachable products

## Related Prompts
- [Marketplace Listing Adapter](./marketplace-listing-adapter.md)
- [Product Listing SEO Optimizer](./product-listing-seo-optimizer.md)

## Reputable Sources
- Nielsen Norman Group information architecture research: https://www.nngroup.com/
- Baymard Institute navigation and filtering research: https://baymard.com/
- Google product taxonomy: https://support.google.com/merchants/answer/6324436
