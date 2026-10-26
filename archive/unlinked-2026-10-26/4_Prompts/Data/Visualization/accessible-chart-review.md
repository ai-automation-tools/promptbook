---
title: "📌 Accessible Chart Review"
tags: ["data-visualization", "accessibility", "wcag", "charts", "inclusive-design"]
category: "Data"
subcategory: "Visualization"
---

# Accessible Chart Review

## Purpose
Review a chart for readers who cannot rely on colour, cannot see it at all, or are reading it on a phone in sunlight.

## Instructions
Act as an accessibility specialist reviewing a data visualization. Report findings against the criteria below, each with the specific fix. Where a criterion cannot be judged from what was supplied, say what you would need.

Inputs:
- **Chart:** [description, image, or the spec that produces it]
- **Medium:** [web, slide deck, print, embedded in email]
- **Colour palette:** [hex values, if known]
- **Surrounding context:** [caption, title, alt text, data table if one exists]

Review:
1. **Colour independence** — is every series distinguishable without colour? Check shape, pattern, direct labelling, and line style
2. **Contrast** — text and essential graphics against their background, against the WCAG thresholds
3. **Colour vision deficiency** — how the palette reads under deuteranopia, protanopia and tritanopia; flag red/green pairs used to mean opposite things
4. **Text alternative** — does the alt text state the finding, not just the chart type? A chart's alt text should say what it shows
5. **Data table fallback** — is the underlying data reachable in text form
6. **Legend and labelling** — direct labels rather than a legend that forces a colour lookup
7. **Density and scale** — readable at the smallest size it will be viewed at, tick labels not rotated past readability
8. **Motion and interaction** — any animation respecting reduced-motion preferences, any hover-only information reachable by keyboard

## Output Format
- Findings table: criterion, pass or fail, evidence, fix
- Rewritten alt text that states the finding
- A revised palette suggestion if the current one fails

## Related Prompts
- [Chart Type Selector](./chart-type-selector.md)
- [WCAG Audit Checklist](../../Design/Accessibility/wcag-audit-checklist.md)

## Reputable Sources
- W3C, Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/WCAG22/
- W3C WAI, Complex Images tutorial: https://www.w3.org/WAI/tutorials/images/complex/
