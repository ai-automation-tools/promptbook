---
title: "📌 Preventive Maintenance Plan"
tags: ["manufacturing", "maintenance", "reliability", "operations", "uptime"]
category: "Domain_Specific"
subcategory: "Manufacturing"
---

# Preventive Maintenance Plan

## Purpose
Build a maintenance schedule from how the equipment actually fails, rather than from a calendar that produces work nobody can justify.

## Instructions
Act as a reliability engineer. Build a preventive maintenance plan for the asset below. For every task, name the failure mode it prevents. A task with no failure mode behind it is cost without benefit, and should be proposed for removal.

Inputs:
- **Asset:** [equipment, age, duty cycle, criticality to production]
- **Failure history:** [what has failed, how often, and the downtime each time]
- **Manufacturer recommendations:** [the OEM schedule]
- **Current PM schedule:** [what is done now, and whether it is actually done]
- **Constraints:** [production windows, spare parts lead times, technician availability]

Produce:
1. **Failure mode analysis** — for each major component: how it fails, the consequence, whether failure gives warning, and the detection method if it does
2. **Task selection per mode** — condition-based monitoring where a warning exists, time or cycle-based replacement where it does not, and run-to-failure where the consequence is genuinely low. Say run-to-failure out loud where it applies; it is often the correct answer and rarely written down
3. **Intervals** — derived from failure history or OEM data, with the source stated. Where neither exists, say the interval is a starting estimate and set a review date
4. **Task detail** — what is done, the tools, the parts, the duration, the skill level, and whether the machine must be down
5. **Spares** — which parts must be on the shelf, based on lead time against the consequence of waiting
6. **Schedule** — grouped so that one shutdown covers several tasks
7. **Measures** — MTBF, PM compliance, and the ratio of planned to unplanned work, with the target for each
8. **Review** — what evidence would justify lengthening or shortening each interval

## Output Format
- Failure mode table: component, mode, consequence, warning, detection
- PM task table: task, interval, basis, duration, downtime required, parts, skill
- Spares list with reorder points
- A calendar view grouping tasks into shutdown windows

## Related Prompts
- [Standard Operating Procedure Writer](./standard-operating-procedure-writer.md)
- [Production Changeover Plan](./production-changeover-plan.md)

## Reputable Sources
- US Department of Energy, operations and maintenance best practices guide: https://www.energy.gov/femp/operations-and-maintenance
- NIST Manufacturing Extension Partnership: https://www.nist.gov/mep

---
**Disclaimer:** Maintenance on energized or pressurized equipment requires lockout/tagout and a site-specific hazard assessment. Never shorten a manufacturer-specified safety-critical interval without engineering review.
