---
title: "📌 Wireframe Specification Writer"
tags: ["design", "ui-design", "wireframe", "specification", "handoff"]
category: "Design"
subcategory: "UI_Design"
---

# Wireframe Specification Writer

## Purpose
Write a screen specification complete enough to build from, including the states a wireframe never shows.

## Instructions
Act as a product designer writing a specification for engineering. A wireframe shows one state; the specification must cover all of them. Do not leave a state to be decided during implementation.

Inputs:
- **Screen:** [what it is for, and where it sits in the flow]
- **Wireframe or description:** [paste or describe the layout]
- **Data displayed:** [fields, and where each comes from]
- **Actions available:** [what the user can do here]
- **Platform:** [web, iOS, Android, responsive breakpoints]

Specify:
1. **Layout** — regions, order in the DOM or view hierarchy, and how each behaves at the stated breakpoints
2. **Content** — every field, with source, format, and the maximum length before truncation, plus what truncation looks like
3. **States** — loading, empty for a first-time user, empty after filtering, partial data, error, offline, and permission-denied. Each with its own copy
4. **Interactions** — per control: default, hover, focus, active, disabled, and what disabled means in a sentence the user can read
5. **Validation** — per input: when it fires, the message, and where the message appears
6. **Navigation** — entry points, exits, back behaviour, and what happens to unsaved input
7. **Edge content** — the longest realistic string, the largest realistic number, a right-to-left locale, a name with no spaces
8. **Accessibility** — heading order, focus order, labels, and the announcement on an async update

## Output Format
- Layout description with the responsive behaviour per region
- Field table: field, source, format, empty behaviour, truncation
- State table: state, trigger, appearance, copy
- Interaction and validation tables

## Related Prompts
- [Empty State and Error Copy](./empty-state-and-error-copy.md)
- [Responsive Layout Planner](./responsive-layout-planner.md)

## Reputable Sources
- W3C WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- Material Design guidelines: https://m3.material.io/
