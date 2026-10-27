---
title: "📌 Iconography Guidelines"
tags: ["design", "design-systems", "icons", "svg", "visual-design"]
category: "Design"
subcategory: "Design_Systems"
---

# Iconography Guidelines

## Purpose
Write the rules for an icon set so that icons drawn a year apart by different people still look like one family.

## Instructions
Act as a design systems designer. Write iconography guidelines for the product below. Specify the grid and construction rules first — consistency in an icon set comes from shared construction, not from shared taste.

Inputs:
- **Product and visual style:** [describe, or paste an example]
- **Icon sizes in use:** [the pixel sizes they render at]
- **Existing icons:** [count and condition, if any]
- **Technical delivery:** [SVG sprite, icon font, per-component, or other]

Specify:
1. **Grid and keyline shapes** — the base grid, the live area, the padding, and the circle, square and rectangle keylines that keep optical weight consistent across differently shaped icons
2. **Stroke** — weight, whether it scales with size or stays fixed, terminals, joins, and the minimum size at which the stroke weight still reads
3. **Corner radius** — the values, and where each applies
4. **Optical adjustment** — where mathematical alignment looks wrong and should be overridden, such as a triangle inside a circle
5. **Size ramp** — the sizes, and whether small sizes get a redrawn simplified version rather than a scaled one, which they usually should
6. **Colour** — `currentColor` by default, how state colour is applied, and the rule against baking colour into the file
7. **Naming** — named for what they depict, not for where they are used, so the icon survives a feature rename
8. **Accessibility** — decorative icons hidden from assistive technology, meaningful icons labelled, and the rule that an icon alone never carries an action's only label
9. **Export hygiene** — strokes outlined or not, viewBox, decimal precision, and what must be stripped from the file

## Output Format
- Construction rules with the grid and keyline values
- Naming convention with examples
- A contributor checklist for a new icon
- An audit table for existing icons: icon, rules broken, action

## Related Prompts
- [Design Token Namer](./design-token-namer.md)
- [WCAG Audit Checklist](../Accessibility/wcag-audit-checklist.md)

## Reputable Sources
- Material Design, icon design principles: https://m3.material.io/styles/icons/overview
- MDN, SVG accessibility and the img role: https://developer.mozilla.org/en-US/docs/Web/SVG
