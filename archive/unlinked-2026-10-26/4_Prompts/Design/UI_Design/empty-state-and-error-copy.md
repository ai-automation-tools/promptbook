---
title: "📌 Empty State and Error Copy"
tags: ["design", "ui-design", "ux-writing", "microcopy", "error-handling"]
category: "Design"
subcategory: "UI_Design"
---

# Empty State and Error Copy

## Purpose
Write the copy for the screens people see when things are empty, broken or still loading — the states that get the least design attention and the most frustrated users.

## Instructions
Act as a UX writer. Write copy for the states below. Every message must tell the person what happened and what to do next. A message that only apologizes has done half the job and the less useful half.

Inputs:
- **Product and feature:** [what this part does]
- **States to write:** [list them, or ask for the standard set]
- **Voice:** [how the product sounds elsewhere; paste an example]
- **Technical reality:** [what actually causes each state, so the copy is not a lie]

For each state, write:
- **Heading** — states the situation, not "Oops"
- **Body** — one or two sentences: what happened, and what to do
- **Action** — the button or link, labelled with the verb it performs

Cover these states distinctly, because they need different copy:
1. **First-run empty** — nothing here yet, and the next step is to create something
2. **Filtered empty** — there is data, this filter excludes it; offer to clear the filter
3. **Search empty** — nothing matched; echo the query and suggest a broader one
4. **Permission denied** — they cannot see this; say who can grant access
5. **Loading** — and the slow-loading variant after several seconds
6. **Recoverable error** — a retry that might work
7. **Unrecoverable error** — a retry that will not work; say what to do instead
8. **Offline** — what is available, and what is queued

Rules: no blame, no error codes in the primary message with a reference available on request, no "something went wrong" unless you genuinely do not know, and never an exclamation mark on an error.

## Output Format
- State table: state, heading, body, action label
- A note per state on what the user is likely feeling and why the copy addresses it
- A list of states that need a design change rather than better copy

## Related Prompts
- [Wireframe Specification Writer](./wireframe-spec-writer.md)
- [Accessible Form Review](../Accessibility/accessible-form-review.md)

## Reputable Sources
- Nielsen Norman Group, error message guidelines: https://www.nngroup.com/articles/error-message-guidelines/
- US federal plain language guidelines: https://www.plainlanguage.gov/
