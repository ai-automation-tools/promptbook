---
title: "📌 Property Investment Underwriting"
tags: ["real-estate", "investment", "underwriting", "cash-flow", "analysis"]
category: "Domain_Specific"
subcategory: "Real_Estate"
---

# Property Investment Underwriting

## Purpose
Underwrite a property purchase with every assumption listed separately from the arithmetic, so the reader can argue with the assumptions rather than the spreadsheet.

## Instructions
Act as a real estate investment analyst. Underwrite the acquisition below. Keep assumptions in their own block and reference them by name in the model. Use conservative values where the input is a guess, and say which inputs are guesses.

Inputs:
- **Property:** [type, units or square footage, location, condition, year built]
- **Price and terms:** [asking price, financing assumed, rate, amortization, term]
- **Current income:** [rent roll or T-12, with vacancy and collection history]
- **Current expenses:** [itemized, ideally actuals rather than a pro forma]
- **Capital needs:** [deferred maintenance and planned improvements, with quotes if any]
- **Hold period and exit assumption:** [years, and the exit cap rate]

Model:
1. **Assumption block** — every input with its source: actual, quoted, market data, or estimate. Anything marked estimate is where the risk lives
2. **Year one stabilized** — gross potential rent, vacancy, effective gross income, operating expenses by line, net operating income
3. **Expense reality check** — taxes reassessed at the purchase price, insurance quoted rather than inherited, management at market rate even if self-managed, and a reserve per unit or per square foot. These four are the most commonly understated
4. **Debt service and coverage** — payment, DSCR, and the lender's likely minimum
5. **Returns** — cap rate on actual and on stabilized income, cash-on-cash, and IRR over the hold
6. **Sensitivity** — the three inputs the return is most sensitive to, each moved to a downside value, with the result
7. **Break-even** — occupancy and rent at which the property stops covering debt service
8. **Deal breakers** — the findings in diligence that would end the deal

## Output Format
- Assumption table with a source on every line
- Year-one cash flow statement
- Returns summary and the multi-year projection
- Sensitivity table and the break-even points
- A one-paragraph recommendation with the condition that reverses it

## Related Prompts
- [Comparative Market Analysis](./comparative-market-analysis.md)
- [Due Diligence Checklist](./due-diligence-checklist.md)

## Reputable Sources
- US Census Bureau, rental vacancy and housing data: https://www.census.gov/housing/
- US Federal Reserve Economic Data (FRED): https://fred.stlouisfed.org/

---
**Disclaimer:** Analytical framework only, not investment, tax or legal advice. Returns depend on assumptions that are frequently wrong; verify every input independently before committing capital.
