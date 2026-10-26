---
title: "📌 WCAG Audit Checklist"
tags: ["design", "accessibility", "wcag", "audit", "compliance"]
category: "Design"
subcategory: "Accessibility"
---

# WCAG Audit Checklist

## Purpose
Audit a page against WCAG with findings written so a developer can fix them, rather than a pass/fail score nobody can act on.

## Instructions
Act as an accessibility specialist. Audit the interface below against WCAG 2.2 at the stated conformance level. For each failure, cite the success criterion, describe who it affects and how, and give the fix. Do not report an automated-checker result as a full audit — say which criteria require manual testing and whether that testing was done.

Inputs:
- **What to audit:** [URL, screens, or component; paste markup if available]
- **Conformance target:** [A, AA, or AAA]
- **Testing done so far:** [automated scan, keyboard walkthrough, screen reader, none]
- **Assistive technology in scope:** [screen readers, magnification, voice control, switch access]

Audit by principle:
1. **Perceivable** — text alternatives, captions, contrast for text and non-text, reflow at 320 CSS pixels, text spacing, content on hover or focus
2. **Operable** — keyboard access with no traps, focus visible and not obscured, target size, timing adjustable, no flashing above threshold, bypass blocks, descriptive page titles and headings
3. **Understandable** — language of page and parts, consistent navigation and help, error identification, labels and instructions, error suggestion, redundant entry, accessible authentication
4. **Robust** — valid parsing, name/role/value on every custom control, status messages announced

For each finding give: criterion number and name, level, location, what a user experiences, and the fix in code or design terms. Rank by user impact rather than by criterion order.

## Output Format
- Findings table: criterion, level, location, user impact, severity, fix
- A list of criteria that cannot be judged from what was supplied, with what is needed
- A short remediation order, highest user impact first

## Related Prompts
- [Screen Reader Flow Script](./screen-reader-flow-script.md)
- [Colour Contrast Remediation](./color-contrast-remediation.md)

## Reputable Sources
- W3C, Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/WCAG22/
- W3C WAI, How to Meet WCAG quick reference: https://www.w3.org/WAI/WCAG22/quickref/
