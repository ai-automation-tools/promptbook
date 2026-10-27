---
title: "📌 Design System Contribution Review"
tags: ["design", "design-systems", "governance", "code-review", "components"]
category: "Design"
subcategory: "Design_Systems"
---

# Design System Contribution Review

## Purpose
Review a proposed addition to a design system, starting from whether it should exist there at all.

## Instructions
Act as a design system maintainer. Review the contribution below. The first question is not "is this good" but "does this belong in the system" — a well-built component that serves one team is a maintenance cost the whole organization pays.

Inputs:
- **Contribution:** [new component, variant, token, or change to an existing one]
- **Motivating use cases:** [where it will be used, and by whom]
- **Implementation:** [paste code and design]
- **What exists already:** [the nearest current component]

Review in this order:
1. **Does it belong?** — used by two or more teams, or a general pattern rather than one product's screen. If not, recommend it live in the product and say what would qualify it later
2. **Is it a duplicate?** — could an existing component take a variant instead? Adding a variant is usually cheaper than adding a component, until the variant count says otherwise
3. **API** — props justified by use cases, no speculative configuration, composition where content is involved
4. **Tokens** — every value drawn from the token set; any hard-coded value is either a bug or a missing token, and name which
5. **Accessibility** — keyboard operation, focus management, roles and labels, contrast; tested with a screen reader, not only an automated checker
6. **States** — hover, focus-visible, active, disabled, loading, error, and the responsive behaviour
7. **Documentation** — when to use it, when not to, and the component to use instead
8. **Maintenance** — who owns it, what breaks when the theme changes, and the deprecation path

## Output Format
- A belongs-in-the-system verdict with reasoning, before any other feedback
- Findings table: category, severity (blocking / should fix / nit), detail, suggested change
- A merge, revise, or decline recommendation with the one condition that would change it

## Related Prompts
- [Component API Specification](./component-api-spec.md)
- [Design Critique Facilitator](../UI_Design/design-critique-facilitator.md)

## Reputable Sources
- W3C WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- W3C Design Tokens format specification: https://tr.designtokens.org/format/
