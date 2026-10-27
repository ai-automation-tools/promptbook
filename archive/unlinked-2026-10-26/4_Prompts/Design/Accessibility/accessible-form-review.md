---
title: "📌 Accessible Form Review"
tags: ["design", "accessibility", "forms", "validation", "wcag"]
category: "Design"
subcategory: "Accessibility"
---

# Accessible Form Review

## Purpose
Review a form for the things that stop people completing it: unlabelled fields, errors nobody hears, and validation that fires while you are still typing.

## Instructions
Act as an accessibility specialist. Review the form below and report findings with the fix in markup terms. Judge it by whether someone can complete it using only a keyboard and a screen reader, not by whether it passes an automated scan.

Inputs:
- **Form:** [paste markup, or describe every field and control]
- **Validation behaviour:** [when it fires, what it shows, where]
- **Submission behaviour:** [what happens on success and on failure]
- **Context:** [what the form is for, and the consequence of getting it wrong]

Review:
1. **Labels** — every control programmatically labelled; placeholder text is not a label; a visible label persists while typing
2. **Grouping** — related radios and checkboxes in a fieldset with a legend; address and name groups labelled as groups
3. **Required fields** — indicated in text as well as colour, and exposed programmatically
4. **Input purpose and autofill** — autocomplete attributes so stored values can be filled, which is a WCAG requirement and not only a convenience
5. **Instructions** — format requirements stated before the field, not revealed as an error afterwards
6. **Validation timing** — on blur or on submit, never on every keystroke; success and error states both announced
7. **Errors** — identified in text, associated with their field, summarized at the top with links to each field, and focus moved to the summary on submit
8. **Keyboard and focus** — logical order, visible focus not obscured by sticky headers, custom controls operable by the keys their role implies
9. **Authentication and redundant entry** — no cognitive-function test without an alternative, and information already provided not asked for again
10. **Timing** — any session timeout warned about and extendable

## Output Format
- Findings table: issue, field, WCAG criterion, user impact, fix in markup
- Corrected markup for the two or three worst fields
- An error summary pattern the form can adopt

## Related Prompts
- [Screen Reader Flow Script](./screen-reader-flow-script.md)
- [Empty State and Error Copy](../UI_Design/empty-state-and-error-copy.md)

## Reputable Sources
- W3C WAI, forms tutorial: https://www.w3.org/WAI/tutorials/forms/
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
