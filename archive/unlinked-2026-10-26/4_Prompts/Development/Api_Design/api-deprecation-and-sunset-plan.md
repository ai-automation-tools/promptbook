---
title: "🌇 API Deprecation and Sunset Plan"
tags: ["api", "deprecation", "migration", "versioning", "communication"]
category: "Development"
subcategory: "Api_Design"
---

# API Deprecation and Sunset Plan

## Purpose
Retire an API version or endpoint on a dated schedule that tells each consumer what to do, and prove from usage data when it is safe to switch off.

## Instructions
Act as an API product owner running a retirement. Build the plan below. Every date must be tied to a measurable condition, and the shutdown must depend on observed traffic, not only on the calendar. If usage data is missing, make instrumenting it step one instead of guessing who is still calling.

Inputs:
- **What is being retired:** [version, endpoint, or field]
- **Replacement:** [the new equivalent, and anything it cannot do yet]
- **Reason:** [security, cost, redesign — consumers accept some reasons more readily than others]
- **Consumers:** [internal teams, partners, public developers, with contact route for each]
- **Traffic data:** [calls per day, distinct callers, top callers, whether callers are identifiable]
- **Hard constraints:** [contract terms, regulatory dates, a vendor end-of-life]

Produce:
1. **Gap check** — what the old API does that the replacement does not. Close or document each gap before announcing, because consumers who find a gap mid-migration stop trusting the schedule.
2. **Timeline** — announce, warn-and-brownout, read-only or degraded mode if useful, shutdown. Set the notice period from how slowly the slowest consumer ships, not from your own release cycle.
3. **In-band signals** — the `Deprecation` and `Sunset` response headers with the dates, a `Link` header to the migration guide, and a log line on every call so the signal reaches people who never read the announcement.
4. **Per-consumer migration notes** — before/after request examples for each changed call, and the order to migrate in.
5. **Brownouts** — short scheduled outages that surface forgotten callers while the cost is still low; propose duration and cadence.
6. **Go/no-go criteria for shutdown** — for example, zero calls from named partners for 14 days and under a stated number of anonymous calls. Say who can veto.
7. **Rollback** — how to restore the old behaviour in minutes if shutdown breaks something important, and for how long it stays possible.

## Output Format
- A dated timeline table: date, action, owner, success measure
- Draft announcement (under 200 words) and a draft final-warning email
- The usage query or dashboard definition that tracks remaining callers
- Risks and the specific consumer each one comes from

## Related Prompts
- [API Breaking Change Review](./api-breaking-change-review.md)
- [Vendor Agreement Review](../../Domain_Specific/Legal/Contracts/vendor-agreement-review.md)

## Reputable Sources
- RFC 8594, The Sunset HTTP Header Field: https://www.rfc-editor.org/rfc/rfc8594
- Semantic Versioning 2.0.0: https://semver.org/

---
**Disclaimer:** Contractual notice periods and regulatory deadlines override any schedule this prompt produces. Have the owner of those terms confirm the dates.
