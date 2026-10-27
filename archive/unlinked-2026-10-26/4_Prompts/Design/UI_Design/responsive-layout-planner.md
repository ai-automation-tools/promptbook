---
title: "📌 Responsive Layout Planner"
tags: ["design", "ui-design", "responsive", "css", "layout"]
category: "Design"
subcategory: "UI_Design"
---

# Responsive Layout Planner

## Purpose
Plan a layout that adapts to content and container rather than to a list of device widths that will be out of date next year.

## Instructions
Act as a frontend designer. Plan the responsive behaviour for the layout below. Derive breakpoints from where the content actually breaks, not from device names, and say what the breaking point is in each case.

Inputs:
- **Layout:** [regions and what each contains]
- **Content ranges:** [shortest and longest realistic strings, smallest and largest counts]
- **Priority order:** [what matters most when space is short]
- **Constraints:** [existing grid, framework, browser support]

Plan:
1. **Content-out breakpoints** — for each region, the width at which its content stops working, and what the failure looks like. That width is the breakpoint
2. **Reflow strategy per region** — reorder, stack, collapse behind a disclosure, truncate, or scroll; with the reason
3. **Intrinsic sizing first** — where `flex-wrap`, `grid-template-columns` with `auto-fit` and `minmax`, and `clamp()` on type remove the need for a breakpoint entirely
4. **Container queries** — components whose layout depends on their container rather than the viewport, which is most reusable components
5. **Priority under pressure** — what is shown at the narrowest width, and what is hidden. Anything hidden must be reachable
6. **Touch and pointer** — target sizes, hover-dependent affordances and their touch equivalent
7. **The awkward middle** — the widths between the obvious layouts, where designs usually fail
8. **Zoom and text scaling** — behaviour at 200% zoom and with a large system font, since both are accessibility requirements rather than edge cases

## Output Format
- Region table: region, content range, break width, reflow strategy
- The CSS approach per region, favouring intrinsic sizing over media queries
- A list of widths to test, including the awkward middle
- Anything hidden at narrow widths, with its alternative access path

## Related Prompts
- [Wireframe Specification Writer](./wireframe-spec-writer.md)
- [WCAG Audit Checklist](../Accessibility/wcag-audit-checklist.md)

## Reputable Sources
- MDN, CSS layout and container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- W3C WCAG 2.2, reflow and text spacing: https://www.w3.org/TR/WCAG22/
