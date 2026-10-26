---
title: "📌 Colour Contrast Remediation"
tags: ["design", "accessibility", "color", "contrast", "wcag"]
category: "Design"
subcategory: "Accessibility"
---

# Colour Contrast Remediation

## Purpose
Fix a palette that fails contrast without abandoning the brand, by changing the smallest set of values that resolves the most failures.

## Instructions
Act as an accessibility-minded visual designer. Analyse the palette below, find the failing combinations, and propose the minimum change that fixes them. Adjust lightness before hue wherever possible — hue is what the brand is recognized by.

Inputs:
- **Palette:** [hex values with their roles]
- **Combinations in use:** [foreground on background pairs, and where each appears]
- **Text sizes and weights:** [which pairs carry small text, large text, or non-text]
- **Themes:** [light, dark, or both]
- **Brand constraints:** [colours that cannot change, and why]

Produce:
1. **Current state** — every combination with its contrast ratio and its verdict against the applicable threshold: 4.5:1 for normal text, 3:1 for large text and for user interface components and graphical objects
2. **Failures ranked by exposure** — the ones appearing most often, since fixing those resolves the most real instances
3. **Proposed values** — the adjusted hex, the new ratio, and the visual difference from the original described in words
4. **Ripple check** — every other combination the changed colour participates in, re-checked
5. **Non-text contrast** — borders, focus indicators, icons, chart series, and form field boundaries, which are the most commonly missed
6. **Colour vision deficiency** — pairs that are distinguishable by luminance and not by hue alone
7. **Dark theme** — computed separately, never by inverting, and with the note that saturated colours behave differently on dark surfaces

## Output Format
- Before-and-after table: pair, use, old ratio, new hex, new ratio, verdict
- A minimal change set: the fewest colour changes that clear the most failures
- Any failure that cannot be fixed by colour alone, with the design change needed instead

## Related Prompts
- [WCAG Audit Checklist](./wcag-audit-checklist.md)
- [Accessible Chart Review](../../Data/Visualization/accessible-chart-review.md)

## Reputable Sources
- W3C, WCAG 2.2 contrast requirements: https://www.w3.org/TR/WCAG22/#contrast-minimum
- W3C WAI, contrast and colour use: https://www.w3.org/WAI/perspective-videos/contrast/
