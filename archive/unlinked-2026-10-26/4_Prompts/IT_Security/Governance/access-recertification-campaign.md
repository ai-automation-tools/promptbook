---
title: "🔐 Access Recertification Campaign Planner"
tags: ["access-review", "recertification", "least-privilege", "audit", "governance"]
category: "IT_Security"
subcategory: "Governance"
---

# Access Recertification Campaign Planner

## Purpose
Plan a periodic user-access review that reviewers can actually complete, so approvals reflect a real decision and not a bulk click-through.

## Instructions
Act as an identity governance lead. Design a recertification campaign for the systems below. Reviewers rubber-stamp when the list is long, unlabelled or unowned, so every design choice should reduce reviewer effort per decision while keeping the decision meaningful.

Inputs:
- **Scope:** [systems, applications or data stores under review]
- **Population:** [approximate number of users, contractors and service accounts]
- **Reviewers available:** [managers, application owners, both]
- **Driver:** [audit requirement, regulation, internal policy, or incident follow-up]
- **Deadline:** [date the evidence must be complete]
- **Tooling:** [IGA product, spreadsheets, ticketing system]

Cover:
1. **Review unit:** decide whether managers certify their reports' access, owners certify who holds their application, or both. State which catches which failure (managers miss obscure entitlements; owners miss leavers).
2. **Risk tiering:** split entitlements into high-risk (admin, production data, payment, privileged roles) and routine. Review high-risk on a shorter cycle and routine on a longer one.
3. **Reviewer packet:** for each line show user, role, entitlement in plain language, last used date, granted by, and a recommended action (keep, remove, investigate). Unused for 90 days is a default recommendation to remove.
4. **Special populations:** contractors with end dates, service and shared accounts without a human owner, dormant accounts, and users who changed role since the last campaign.
5. **Escalation timeline:** kick-off, reminder cadence, manager escalation, and the default outcome when a reviewer never answers. State whether silence means revoke or escalate, and the cost of each.
6. **Revocation:** who performs removals, within how many days, and how you confirm access is actually gone rather than the ticket closed.
7. **Evidence:** what the auditor needs: scope definition, reviewer list, decisions with timestamps, exceptions with approvals, and revocation proof.

## Output Format
- Campaign calendar working back from the deadline
- Reviewer packet template (columns above)
- Risk-tier table with review frequency per tier
- Metrics to report: completion rate, revoke rate, time to revoke, number of high-risk entitlements removed
- Known weak points of this design and how to measure whether reviewers are rubber-stamping (for example, a revoke rate near zero)

## Related Prompts
- [IAM Prompt Library](../Iam/iam-prompt-library.md)
- [Data Governance Prompt](./data-governance-prompt.md)

---
**Disclaimer:** Review cycles and evidence requirements depend on your regulator, auditor and internal policy. Confirm them with your compliance function before you rely on this plan.
