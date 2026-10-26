---
title: "📌 Screen Reader Flow Script"
tags: ["design", "accessibility", "screen-reader", "aria", "testing"]
category: "Design"
subcategory: "Accessibility"
---

# Screen Reader Flow Script

## Purpose
Write out what a screen reader will say as someone moves through a flow, so the experience can be reviewed before it is built.

## Instructions
Act as an accessibility specialist. Produce the expected screen reader output for the flow below, step by step. Write the announcement for each step, then judge whether it is sufficient to complete the task without sight.

Inputs:
- **Flow:** [the steps, and what the user is trying to accomplish]
- **Markup:** [paste HTML, or describe the components and their roles]
- **Target combinations:** [for example NVDA with Firefox, VoiceOver with Safari, TalkBack with Chrome]
- **Dynamic behaviour:** [what updates without a page load]

For each step produce:
- **Navigation action** — Tab, arrow key, heading navigation, landmark jump, or a virtual cursor move
- **Expected announcement** — role, name, state and position, in the order the screen reader gives them
- **Is it sufficient?** — could someone act on this without seeing the screen
- **Gap and fix** — the missing name, role, state, or relationship, and the markup change

Pay particular attention to:
1. **Landmarks and headings** — whether the page can be skimmed structurally rather than read linearly
2. **Focus management** — where focus goes when a dialog opens and where it returns when it closes
3. **Dynamic updates** — live region politeness, and whether the update is announced at all
4. **Form errors** — announced on submit, associated with the field, and reachable
5. **Custom widgets** — whether the keyboard interaction matches what the announced role promises
6. **Reading order** — DOM order against visual order, and anywhere they disagree

## Output Format
- Step table: action, expected announcement, sufficient (yes/no), fix
- A list of markup changes required
- A manual test script someone can follow with a real screen reader

## Related Prompts
- [WCAG Audit Checklist](./wcag-audit-checklist.md)
- [Accessible Form Review](./accessible-form-review.md)

## Reputable Sources
- W3C WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- W3C WAI, involving users and testing with assistive technology: https://www.w3.org/WAI/test-evaluate/
