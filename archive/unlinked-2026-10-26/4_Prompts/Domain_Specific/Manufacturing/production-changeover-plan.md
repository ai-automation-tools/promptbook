---
title: "📌 Production Changeover Plan"
tags: ["manufacturing", "changeover", "smed", "lean", "operations"]
category: "Domain_Specific"
subcategory: "Manufacturing"
---

# Production Changeover Plan

## Purpose
Cut changeover time by moving work off the critical path, using the one distinction that does most of the work: what must happen while the machine is stopped, and what does not.

## Instructions
Act as a lean manufacturing engineer applying SMED. Analyse the changeover below. Classify every step as internal (machine must be stopped) or external (can be done while running) before proposing any improvement — most of the saving comes from reclassification, not from doing steps faster.

Inputs:
- **Changeover:** [from what product to what product, on which equipment]
- **Current steps:** [the sequence as actually performed, with timings if available]
- **Current total time:** [door to door, last good part to next good part]
- **Frequency:** [how often this changeover happens]
- **Constraints:** [crew size, tooling available, quality approval requirements]

Produce:
1. **Current state** — every step timed, classified internal or external, with the cumulative time
2. **Reclassification** — the internal steps that could be external with preparation: kitting, pre-staging tooling, pre-heating, paperwork, pre-setting fixtures offline
3. **Internal step reduction** — quick-release fasteners, standardized heights and shut positions, eliminating adjustment through positive stops, and the parallel steps a second person could take
4. **Adjustment elimination** — every trial-and-error adjustment, replaced by a setting that is either measured or mechanically fixed. Adjustment is usually the largest hidden cost
5. **First-good-part** — what it takes to get a part that passes, and how to shorten the approval step itself
6. **Future state** — the resequenced procedure with the new time, split internal and external
7. **Implementation** — what has to be bought or built, with cost and lead time
8. **Sustaining** — the standard work, the visual controls, and how changeover time is measured every time rather than once

State the payback: time saved per changeover, multiplied by frequency, against the implementation cost.

## Output Format
- Current state table: step, time, internal or external
- Future state table with the resequenced steps
- Improvement list: change, time saved, cost, lead time
- A payback calculation and an implementation order

## Related Prompts
- [Standard Operating Procedure Writer](./standard-operating-procedure-writer.md)
- [Preventive Maintenance Plan](./preventive-maintenance-plan.md)

## Reputable Sources
- NIST Manufacturing Extension Partnership, lean resources: https://www.nist.gov/mep
- ASQ, lean manufacturing resources: https://asq.org/quality-resources/lean
