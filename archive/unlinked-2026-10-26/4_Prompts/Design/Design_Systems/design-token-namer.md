---
title: "📌 Design Token Namer"
tags: ["design", "design-systems", "tokens", "naming", "theming"]
category: "Design"
subcategory: "Design_Systems"
---

# Design Token Namer

## Purpose
Name a token set so that the name survives a rebrand, a dark theme and a designer who was not there when it was created.

## Instructions
Act as a design systems engineer. Produce a token naming scheme for the set below. Separate the layers first — a system that mixes raw values with semantic meaning in one namespace cannot be re-themed.

Inputs:
- **Values to tokenize:** [colours, spacing, type, radii, shadows, motion]
- **Themes required:** [light, dark, brand variants, density modes]
- **Platforms:** [web, iOS, Android, and the output formats needed]
- **Existing names:** [what is already in use, if anything]

Produce three layers:
1. **Primitive** — the raw palette and scale. Named by what they are: `blue-600`, `space-4`. Never referenced directly by a component
2. **Semantic** — named by role: `color-surface-raised`, `color-text-muted`, `color-border-focus`. These are what themes swap
3. **Component** — only where a component genuinely needs its own hook: `button-primary-background`. Keep this layer small, and say why each entry exists

Rules to apply and state:
- Name by role, never by appearance. `color-text-danger`, not `color-text-red`, because red changes
- Name by purpose, never by location. `surface-raised`, not `sidebar-background`
- One scale per dimension, no one-off values; a value that does not fit the scale is a design decision to discuss, not a token to add
- Every semantic token needs a one-line usage note saying when to reach for it and when not to
- State the deprecation path: how a token is renamed without breaking every consumer at once

## Output Format
- Three-layer token table: name, layer, value or reference, usage note
- Naming rules as a short document a contributor can follow
- A mapping from any existing names to the new scheme, marking each as rename, merge or retire

## Related Prompts
- [Component API Specification](./component-api-spec.md)
- [Design System Contribution Review](./design-system-contribution-review.md)

## Reputable Sources
- W3C Design Tokens Community Group format specification: https://tr.designtokens.org/format/
- Material Design, design tokens: https://m3.material.io/foundations/design-tokens/overview
