---
title: "🎯 SWOT Analysis Generator"
tags: ["skill", "business", "strategy", "analysis", "frameworks"]
category: "Skills"
subcategory: "Business"
name: swot-analysis-generator
description: "Generates structured, strategic SWOT (Strengths, Weaknesses, Opportunities, Threats) analyses based on business context. Use when: (1) evaluating a new product launch, (2) assessing a competitor, (3) conducting quarterly strategic planning. NOT for: granular financial modeling or tactical day-to-day task planning."
---

# SWOT Analysis Generator

This skill leverages strategic business frameworks to automatically construct comprehensive SWOT analyses. By processing context about a company, product, or market scenario, it identifies internal factors (Strengths/Weaknesses) and external factors (Opportunities/Threats), organizing them into a clear, executive-ready grid along with actionable strategic recommendations (TOWS mapping).

## Prerequisites

To use this skill effectively, you must provide sufficient context about the subject being analyzed.

- **Required Tool/Service:** Text interface (to provide the prompt and receive the markdown output).
- **Environment:** Compatible with any standard LLM chat interface or programmatic API call.

### Setup Instructions

No special setup is required beyond having access to the agent.

**Verification:**
Ask the agent: "Are you ready to perform a SWOT analysis?"

## Usage

### Basic Usage

Provide the context and target of the analysis.

```text
# Example prompt
"Conduct a SWOT analysis for a local mid-sized coffee roaster considering expanding into ready-to-drink (RTD) canned cold brew in grocery stores."
```

**What it does:**
1. Categorizes internal capabilities (roasting expertise, local brand loyalty) vs. internal deficits (lack of canning infrastructure).
2. Categorizes external market factors (growth in RTD segment) vs. external risks (established massive competitors like Starbucks).
3. Outputs a formatted markdown document.

### Common Workflows

#### Workflow 1: Competitor Analysis

Evaluating a rival to find strategic advantages.

**Steps:**
1. Provide competitor context.
   ```text
   "Create a SWOT analysis for 'Competitor X', a B2B SaaS CRM company. They recently raised $50M, have an outdated UI, but deep integrations with legacy ERPs."
   ```
2. The skill extracts the data into the matrix.
3. Review the outputs to identify "Attack Vectors" (e.g., targeting their Weakness in UI with our Opportunity for a modern mobile app).

#### Workflow 2: Internal Strategic Planning

Assessing your own company's current position.

**Steps:**
1. Input your company's recent performance metrics and market changes.
2. The skill generates the SWOT.
3. Use the output to align stakeholders on priorities for the upcoming quarter.

## Configuration

### Optional Configuration

You can guide the formatting and depth of the output:

| Setting | Default | Description |
|---------|---------|-------------|
| `format` | `markdown_grid` | Can be set to `bulleted_list` or `json` for programmatic integration. |
| `include_tows` | `true` | Whether to automatically generate TOWS strategic pairings (e.g., SO, WT strategies). |
| `depth` | `standard` | Set to `executive_summary` for brevity or `deep_dive` for exhaustive analysis. |

## Examples

### Example 1: New Product Launch

**Context:** A tech company entering the hardware space.

**Task:** Evaluate the risks and advantages.

**Commands (Prompt):**
```text
Generate a SWOT analysis for a software company (known for its popular task management app) launching its first physical product: a dedicated e-ink productivity tablet. Format as a markdown table.
```

**Output:**
```markdown
# SWOT Analysis: E-Ink Productivity Tablet Launch

| **Internal Factors** | **Helpful** (to achieving the objective) | **Harmful** (to achieving the objective) |
|---|---|---|
| **Strengths** | - Massive existing user base of the software app to cross-sell to.<br>- Deep expertise in productivity workflows and UX.<br>- High brand trust and established marketing channels. | **Weaknesses** | - Zero prior experience in hardware manufacturing or supply chain.<br>- Hardware margins are historically lower than SaaS.<br>- Customer support infrastructure is not set up for physical returns/repairs. |

| **External Factors** | **Helpful** | **Harmful** |
|---|---|---|
| **Opportunities** | - Growing consumer backlash against screen fatigue (perfect for e-ink).<br>- Potential to lock users into a premium subscription tier bundled with the hardware.<br>- Niche market with few established dominant players (unlike smartphones). | **Threats** | - Established hardware giants (Apple, Samsung) could release competitive features on existing tablets.<br>- Global supply chain disruptions could delay launch.<br>- Economic downturns reduce consumer spending on niche, single-use hardware. |

### Strategic Implications (TOWS Matrix)
* **Maxi-Maxi Strategy (S-O):** Leverage the existing user base to run a highly targeted pre-order campaign, capitalizing on the screen-fatigue trend.
* **Mini-Maxi Strategy (W-O):** Partner with an established OEM manufacturer to mitigate hardware inexperience while still capturing the niche market.
```

## Advanced Usage

### The TOWS Matrix Integration

Go beyond simply listing factors by asking the skill to generate strategic actions based on intersections:

- **S-O Strategies:** How to use strengths to take advantage of opportunities.
- **W-O Strategies:** How to overcome weaknesses by taking advantage of opportunities.
- **S-T Strategies:** How to use strengths to avoid threats.
- **W-T Strategies:** Defensive tactics to minimize weaknesses and avoid threats.

**Prompt Example:**
```text
"Based on the SWOT you just generated, create a TOWS matrix focusing specifically on defensive W-T (Weakness-Threat) strategies we should implement immediately."
```

## Integration

### With Other Skills

- **market-research-analyst**: Feeds external data (market size, competitor moves) directly into the Opportunities and Threats quadrants.
- **financial-forecasting**: Uses the identified Threats to model downside financial risk scenarios.

## Troubleshooting

### Common Issues

#### Issue 1: Confusing Internal vs. External

**Symptoms:**
- The output lists "Rising interest rates" as a Weakness instead of a Threat.

**Cause:**
The model lost the strict definition of internal (controllable) vs external (uncontrollable) factors.

**Solution:**
Refine the prompt: "Remember strictly: Strengths/Weaknesses are INTERNAL to the company. Opportunities/Threats are EXTERNAL market/macro factors."

## Best Practices

### Do's ✅

- Provide specific, quantifiable context (e.g., "We have a 15% churn rate" rather than "We lose customers").
- Use the SWOT as a starting point for discussion, not a final unchangeable document.
- Prioritize the points in each quadrant (list the most impactful Strength first).

### Don'ts ❌

- Don't use vague descriptors like "Good product." Specify *why* it's good (e.g., "Patented algorithm reduces processing time by 40%").
- Don't confuse Opportunities (external favorable conditions) with "things we could do" (strategies).

## References

### External Resources
- [Harvard Business Review: How to Do a SWOT Analysis](https://hbr.org/2024/02/how-to-do-a-swot-analysis)
- [MindTools: The TOWS Matrix](https://www.mindtools.com/pages/article/newSTR_89.htm)
