---
title: "📌 GDPR DSAR Response Workflow"
tags: ["gdpr", "dsar", "data-subject-rights", "compliance"]
category: "Legal_Compliance"
subcategory: "Privacy"
---

# GDPR Data Subject Access Request (DSAR) Response Workflow

## Purpose
Guides organizations through the process of responding to Data Subject Access Requests (DSARs) under GDPR Article 15, ensuring compliance with the 30-day response requirement.

## Instructions

I want you to act as a GDPR compliance specialist helping me respond to a Data Subject Access Request. 

**Request Details:**
- **Requester:** [Name]
- **Email:** [Email address]
- **Request Type:** [Access / Rectification / Erasure / Portability / Object / Restrict]
- **Request received:** [Date]
- **Response deadline:** [Date + 30 days]

**Step-by-step process:**

### 1. Identity Verification
- Confirm the requester's identity (2+ forms of verification)
- Verify the request came from the data subject (not impersonation)
- Document verification method used

### 2. Request Assessment
- Determine if the request is valid and within scope
- Check if request is manifestly unfounded or excessive (GDPR Article 12(5))
- Identify all systems/databases where the subject's data exists

### 3. Data Retrieval
For Access Requests, compile:
- **Personal data:** All personal information we hold
- **Processing purposes:** Why we process each data type
- **Recipients:** Who has access/received the data
- **Retention periods:** How long we keep each data type
- **Data sources:** Where we obtained the data
- **Automated decision-making:** Any profiling or automated decisions
- **Rights information:** How to exercise their rights

### 4. Response Drafting
Draft a response that includes:
- Acknowledgment of the request
- Data provided in clear, structured format (machine-readable if portability request)
- Explanation of each data point and its purpose
- Information about their rights
- Timeline for any actions taken (e.g., deletion)

### 5. Response Delivery
- Deliver response within 30 days (extendable by 60 days if complex)
- Use secure method (encrypted email, secure portal)
- Request confirmation of receipt
- Log the response in DSAR register

**Output the complete response letter and action checklist.**

## Output Format

```markdown
## DSAR Response Letter

[Your Company Letterhead]

Date: [Response date]
DSAR Reference: [Tracking number]

Dear [Requester name],

### 1. Request Acknowledgment
We received your Data Subject Access Request on [date]. This letter constitutes our response under Article 15 GDPR.

### 2. Identity Verification
Your identity was verified on [date] using [verification method].

### 3. Personal Data We Hold

#### 3.1 Account Information
| Data Type | Value | Purpose | Legal Basis | Retention |
|-----------|-------|---------|-------------|-----------|
| Name | [Redacted in template] | Account management | Contract | Account lifetime |
| Email | [Redacted] | Communications | Contract | Account lifetime + 2 years |

#### 3.2 Usage Data
[List of usage/activity data]

#### 3.3 Marketing Preferences
[Consent status for various marketing channels]

### 4. Data Processing
**Purposes:** [Service delivery, analytics, marketing]
**Legal basis:** [Contract, consent, legitimate interest]
**Recipients:** [Third-party processors - see Section 5]

### 5. Third-Party Data Sharing
| Recipient | Purpose | Location | Safeguards |
|-----------|---------|----------|------------|
| [Processor name] | [Purpose] | [Country] | [SCC/Adequacy] |

### 6. Data Sources
[Where we obtained your data: directly from you, public sources, third parties]

### 7. Automated Decision-Making
[If applicable: explanation of any profiling or automated decisions]

### 8. Your Rights
You have the right to:
- Request rectification (if data is inaccurate)
- Request erasure ("right to be forgotten")
- Restrict processing
- Object to processing
- Data portability
- Withdraw consent (where processing is based on consent)
- Lodge a complaint with supervisory authority

To exercise these rights, contact [privacy@company.com]

### 9. Data Retention
[Explanation of retention periods for each data type]

### 10. Enclosed Data
This response includes:
- [ ] Personal data export (see attached file)
- [ ] Data processing record
- [ ] Copy of privacy policy

If you have questions or wish to exercise additional rights, please contact our Data Protection Officer at [dpo@company.com].

Sincerely,
[Data Protection Officer name]
[Company name]

---

## Action Checklist

- [ ] Identity verified (method: ________)
- [ ] Request logged in DSAR register (ID: ________)
- [ ] All data sources queried (systems: ________)
- [ ] Data compiled and reviewed
- [ ] Response drafted and reviewed by legal
- [ ] Data export prepared (if applicable)
- [ ] Response sent via secure method
- [ ] Deadline met: [Y/N] Date sent: ________
- [ ] Follow-up actions completed (if any)
- [ ] DSAR register updated with completion
```

## Example

**Input:**
John Doe (john.doe@example.com) requests access to all personal data. He's an active customer since 2022. Our systems: CRM (Salesforce), Email (SendGrid), Analytics (Mixpanel), Support (Zendesk).

**Output:**

[Full response letter with John Doe's data from all four systems, formatted as shown above, with specific data points, purposes, retention periods, and third-party sharing details]

## Tips for Use

- **Act quickly:** Log requests immediately and set calendar reminder for 30-day deadline
- **Be thorough:** Missing data can result in non-compliance penalties
- **Use templates:** Create pre-filled templates for common request types
- **Train staff:** Ensure support/HR teams can identify and escalate DSARs
- **Track metrics:** Monitor response times, types of requests, and compliance rate

## Related Prompts

- [GDPR Data Mapping Analyzer](gdpr-data-mapping.md)
- [Data Breach Response Plan](data-breach-response-plan.md)
- [GDPR Right to Erasure Processor](right-to-erasure-processor.md)
