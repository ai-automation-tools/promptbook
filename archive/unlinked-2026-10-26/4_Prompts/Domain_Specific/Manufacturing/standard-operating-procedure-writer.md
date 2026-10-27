---
title: "📌 Standard Operating Procedure Writer"
tags: ["manufacturing", "sop", "documentation", "operations", "training"]
category: "Domain_Specific"
subcategory: "Manufacturing"
---

# Standard Operating Procedure Writer

## Purpose
Write a procedure someone can follow on their first day at the machine, with the safety information where it is needed rather than collected at the front.

## Instructions
Act as a manufacturing engineer writing work instructions. Write for the actual operator: standing at the equipment, possibly wearing gloves, possibly reading in a second language. Short sentences, one action per step, and the hazard warning immediately before the step that carries it.

Inputs:
- **Operation:** [what the procedure covers, and where it sits in the process]
- **Equipment and tooling:** [make, model, fixtures, gauges]
- **Materials:** [inputs and their specifications]
- **Quality requirements:** [dimensions, tolerances, inspection points and frequency]
- **Known hazards:** [mechanical, electrical, chemical, thermal, ergonomic]
- **Operator level:** [who performs this, and what training they have]

Write:
1. **Purpose and scope** — one paragraph; what this covers and what it does not
2. **Safety** — required PPE, lockout/tagout requirements, and the hazards specific to this operation. Repeat each hazard inline at the step where it applies
3. **Prerequisites** — tooling, materials, machine state, and the setup verification before starting
4. **Steps** — numbered, one action each, in the imperative. Include the parameter values, the acceptance criterion at each check, and what the correct result looks like
5. **Quality checks** — what, when, with which gauge, to what tolerance, and the reaction plan when a part is out
6. **Abnormal conditions** — the three or four things that go wrong most often, what to do, and when to stop and escalate
7. **Shutdown and changeover** — end-of-run state, cleaning, and what the next operator needs
8. **Records** — what gets recorded, where, and by whom

Never write "as required", "as appropriate", or "use judgement". If the value depends on something, state what it depends on and give the values.

## Output Format
- Complete SOP in the sections above
- A one-page visual aid outline listing the photographs or diagrams needed and what each must show
- A training sign-off sheet and the competency check questions

## Related Prompts
- [Production Changeover Plan](./production-changeover-plan.md)
- [Preventive Maintenance Plan](./preventive-maintenance-plan.md)

## Reputable Sources
- US OSHA, control of hazardous energy (lockout/tagout): https://www.osha.gov/control-hazardous-energy
- NIST Manufacturing Extension Partnership: https://www.nist.gov/mep

---
**Disclaimer:** A drafted procedure is not a substitute for a site-specific hazard assessment. Safety-critical steps must be reviewed by a qualified EHS professional and validated against local regulation before use.
