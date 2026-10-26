---
title: "📌 Component API Specification"
tags: ["design", "design-systems", "components", "api-design", "frontend"]
category: "Design"
subcategory: "Design_Systems"
---

# Component API Specification

## Purpose
Design a component's public interface so it covers the real cases without growing a boolean for every one of them.

## Instructions
Act as a design systems engineer. Specify the API for the component below. Start from the known use cases and resist adding anything not demanded by one — every prop is permanent, and a prop added speculatively is a prop you maintain forever.

Inputs:
- **Component:** [what it is, and the problem it solves]
- **Known use cases:** [every place it will be used, concretely]
- **Variants needed:** [visual or behavioural]
- **Existing similar components:** [what it should be consistent with]

Specify:
1. **Props** — name, type, default, required or not, and the use case that demands it. A prop with no use case behind it does not ship
2. **Variant strategy** — a single `variant` union rather than several booleans that can contradict each other; state which combinations are impossible and how the types prevent them
3. **Composition** — what is passed as children or slots instead of configured through props, which is usually the right answer for content
4. **Controlled and uncontrolled** — which state the consumer owns, which the component owns, and how both modes are supported without ambiguity
5. **Events** — names, payloads, and whether the underlying native event is forwarded
6. **Accessibility contract** — what the component guarantees, and what the consumer must supply for it to be accessible. State this explicitly; an accessible-by-default component that silently degrades when given no label is a trap
7. **Escape hatches** — `className`, `style`, ref forwarding, and rest-prop spreading, with the stated limits of support
8. **What it deliberately does not do** — the neighbouring component that handles it instead

## Output Format
- Props table: name, type, default, required, use case
- TypeScript interface as written
- Usage examples: the common case, the composed case, the controlled case
- A non-goals section

## Related Prompts
- [Design Token Namer](./design-token-namer.md)
- [Design System Contribution Review](./design-system-contribution-review.md)

## Reputable Sources
- W3C WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- React documentation, component composition: https://react.dev/learn/passing-props-to-a-component
