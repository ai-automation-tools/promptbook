---
title: "📌 Records Retention Schedule Builder"
tags: ["legal", "compliance", "records-management", "retention", "data-governance"]
category: "Legal_Compliance"
subcategory: "Regulatory"
---

# Records Retention Schedule Builder

## Purpose
Build a retention schedule that names a legal basis for every period, so records are destroyed on a defensible schedule instead of kept forever by default.

## Instructions
Act as a records and information governance analyst.

Inputs:
- **Organization type and sector:** [text]
- **Jurisdictions:** [where you operate and where data subjects are]
- **Record categories in scope:** [HR, financial, contracts, customer data, communications, operational]
- **Systems holding them:** [including backups, archives, and collaboration tools]
- **Existing schedule:** [paste, or say "none"]
- **Active legal holds:** [if any]

For each record category produce: a description, the system of record, the retention period, the legal or regulatory citation or business justification for that period, the trigger that starts the clock (creation, termination, contract end, fiscal year close), the disposition method, and the owner.

Rules the schedule must satisfy:
- Every period has a stated basis. "Seven years" with no citation is a habit, not a policy.
- Where jurisdictions conflict, the longest applicable period controls for that population — but note the tension, because a GDPR storage limitation obligation can cut the other way and needs a decision rather than a default.
- Legal hold overrides the schedule and suspends disposition. State how a hold is applied, tracked, and released.
- Backups and collaboration tools are in scope. A schedule that ignores them does not survive discovery.
- Disposition must be logged, since the log is what makes routine destruction defensible.

Flag categories with no owner, no system of record, or an indefinite period.

## Output Format
- Retention schedule table
- Jurisdictional conflicts with a recommended resolution
- Legal hold procedure
- Flags: unowned, unlocated, or indefinite categories

## Related Prompts
- [GDPR Data Mapping](../Privacy/gdpr-data-mapping.md)
- [Compliance Audit Checklist](./compliance-audit-checklist.md)

## Reputable Sources
- ARMA International records management principles: https://www.arma.org/
- U.S. National Archives records management guidance: https://www.archives.gov/records-mgmt
- EDRM discovery reference model: https://edrm.net/

---
**Disclaimer:** Informational template only, not legal advice. Retention periods must be confirmed against current law in each applicable jurisdiction by qualified counsel.
