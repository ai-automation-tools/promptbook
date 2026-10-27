---
title: "📈 Market Researcher"
tags: ["skill", "business", "research", "marketing"]
category: "Skills"
subcategory: "Business"
name: "📈 market-researcher"
description: "Conducts automated competitor analysis and market trend aggregation. Use when: (1) entering a new market segment, (2) evaluating competitor pricing, (3) analyzing customer sentiment. NOT for: gathering proprietary or non-public financial data."
---

# Market Researcher

This skill equips the agent to perform systematic market research by querying public data sources, aggregating competitor metrics, and summarizing industry trends into actionable business insights.

## Prerequisites

- **Required Tool/Service:** Web browsing capability or search API access
- **Permissions:** Outbound network access

## Usage

### Basic Usage

Provide an industry or product category for the agent to analyze.

**What it does:**
1. Identifies top 3-5 competitors
2. Extracts their value propositions and pricing models
3. Generates a SWOT summary

### Common Workflows

#### Workflow 1: Competitor Matrix Generation

When asked to compare a specific product against alternatives.

**Steps:**
1. Agent searches for feature lists of competitors.
2. Agent structures findings into a markdown table.
3. Agent highlights areas of differentiation.

## Examples

### Example 1: Pricing Analysis

**Context:** Launching a new project management SaaS.

**Task:** Analyze pricing tiers of top 3 competitors.

**Output:**
```
| Competitor | Basic Tier | Pro Tier | Enterprise | Key Differentiator |
|------------|------------|----------|------------|--------------------|
| Asana      | Free       | $10.99   | Custom     | Timeline Views     |
| Trello     | Free       | $5.00    | $17.50     | Kanban Simplicity  |
| Monday     | $8.00      | $16.00   | Custom     | Custom Workflows   |
```

## Best Practices

### Do's ✅

- Cross-reference multiple sources to ensure pricing is up to date.
- Explicitly state when pricing requires a custom quote.

### Don'ts ❌

- Avoid hallucinating features or prices; if data is unavailable, state it clearly.

## File Structure

```
market-researcher/
├── SKILL.md              # This file
```
