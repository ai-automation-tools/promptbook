---
title: "📌 GDPR Data Breach Response Plan"
tags: ["gdpr", "data-breach", "incident-response", "compliance", "security"]
category: "Legal_Compliance"
subcategory: "Privacy"
---

# GDPR Data Breach Response Plan

## Purpose
Provides a structured incident response plan for data breaches under GDPR Articles 33-34, ensuring 72-hour notification to supervisory authority and appropriate communication to affected individuals.

## Instructions

I want you to act as a GDPR incident response coordinator. Help me create a data breach response plan for [incident description].

**Incident Details:**
- **Discovery date:** [When breach was discovered]
- **Incident type:** [Unauthorized access / Ransomware / Lost device / Misconfiguration / Other]
- **Affected systems:** [List systems/databases]
- **Data types compromised:** [Personal data involved]
- **Number of affected individuals:** [Estimated count]
- **Breach duration:** [When it started, when it was contained]

**Response Timeline: 72-Hour Clock Starts Now**

### Phase 1: Detection & Containment (Hour 0-4)

**Immediate Actions:**
1. **Contain the breach**
   - Isolate affected systems
   - Revoke compromised credentials
   - Implement temporary access controls
   - Document containment actions

2. **Assess scope**
   - What data was accessed/disclosed/altered/destroyed?
   - How many individuals are affected?
   - What are the potential consequences for data subjects?
   - Can you identify the cause and who (if anyone) accessed the data?

3. **Activate incident team**
   - DPO (Data Protection Officer)
   - IT Security
   - Legal Counsel
   - Communications/PR
   - Executive Leadership

### Phase 2: Impact Assessment (Hour 4-24)

**Determine if notification is required:**

According to GDPR Article 33, you MUST notify the supervisory authority within 72 hours if the breach is likely to result in a risk to individuals' rights and freedoms.

**Risk Assessment Checklist:**
- [ ] Type of data (sensitive/special category data = high risk)
- [ ] Volume of data (large scale = higher risk)
- [ ] Ease of identification (directly identifiable = higher risk)
- [ ] Consequences (financial loss, discrimination, identity theft = high risk)
- [ ] Vulnerability of affected individuals (children, vulnerable adults = higher risk)
- [ ] Mitigating factors (encryption, breach quickly contained = lower risk)

**Risk Level:**
- **Low:** No notification required (but document the decision!)
- **Medium:** Notify supervisory authority within 72 hours
- **High:** Notify supervisory authority + affected individuals "without undue delay"

### Phase 3: Authority Notification (Hour 24-72)

If notification required, prepare supervisory authority notification including:

1. **Description of breach**
   - Nature of breach
   - Categories and approximate number of data subjects
   - Categories and approximate number of personal data records

2. **Contact details**
   - Name and contact details of DPO or other contact point

3. **Consequences**
   - Likely consequences of the breach

4. **Mitigation measures**
   - Measures taken or proposed to address the breach
   - Measures to mitigate possible adverse effects

**Submit to:** [Your national supervisory authority - e.g., ICO (UK), CNIL (France), BfDI (Germany)]

### Phase 4: Individual Notification (If High Risk)

If the breach is likely to result in high risk to individuals, notify them directly.

**Notification must include:**
- Description of the breach in clear, plain language
- Contact details of DPO
- Likely consequences
- Measures taken to address the breach
- Measures data subjects can take to protect themselves

**Delivery method:**
- Direct communication (email/letter) preferred
- Public communication if direct contact impossible or disproportionately difficult

### Phase 5: Documentation & Follow-up

**Maintain breach register:**
- Facts of the breach
- Effects of the breach
- Remedial action taken

**Post-incident review (within 30 days):**
- Root cause analysis
- What worked/what didn't in response
- Preventive measures to implement
- Update incident response plan
- Staff training needs identified

## Output Format

```markdown
# Data Breach Incident Report

**Incident ID:** [Unique identifier]
**Report Date:** [Date]
**Status:** [Contained / Ongoing / Resolved]

## 1. Executive Summary
[2-3 sentence overview of incident, impact, and current status]

## 2. Incident Details

### 2.1 Discovery
- **Discovered by:** [Name/Role]
- **Discovery date/time:** [Timestamp]
- **How discovered:** [Method]

### 2.2 Incident Description
- **Type:** [e.g., Unauthorized access, ransomware, misconfiguration]
- **Affected systems:** [List]
- **Attack vector:** [How breach occurred]
- **Duration:** [Start - end time]

### 2.3 Data Affected
| Data Category | Records | Sensitivity | Risk Level |
|---------------|---------|-------------|------------|
| Names | 10,000 | Low | Medium |
| Emails | 10,000 | Low | Medium |
| Passwords (hashed) | 10,000 | Medium | Medium (mitigated by hashing) |
| Payment cards | 0 | N/A | N/A |

**Total affected individuals:** 10,000

## 3. Risk Assessment

### 3.1 Likelihood of Harm
[Assessment of probability that individuals will be harmed]

### 3.2 Severity of Harm
[Assessment of potential consequences: identity theft, financial loss, etc.]

### 3.3 Overall Risk Level
**Risk Rating:** [ ] Low [ ] Medium [X] High

**Rationale:** [Explanation]

## 4. Notification Decision

### 4.1 Supervisory Authority Notification
- **Required:** [Yes/No]
- **Reason:** [Explanation based on risk assessment]
- **Deadline:** [72 hours from discovery = [datetime]]
- **Status:** [ ] Not started [ ] In progress [X] Submitted
- **Submission date:** [If submitted]

### 4.2 Individual Notification
- **Required:** [Yes/No]
- **Reason:** [High risk to individuals]
- **Method:** [Email/Letter/Public announcement]
- **Status:** [ ] Not started [X] In progress [ ] Complete
- **Notification date:** [If sent]

## 5. Containment & Remediation

### 5.1 Immediate Actions Taken
1. [Action 1] - [Timestamp] - [By whom]
2. [Action 2] - [Timestamp] - [By whom]
3. [Action 3] - [Timestamp] - [By whom]

### 5.2 Recovery Actions
1. [Action 1]
2. [Action 2]

### 5.3 Preventive Measures
1. [Long-term fix 1]
2. [Long-term fix 2]

## 6. Communications

### 6.1 Internal Communications
- [Date]: Notified IT Security Team
- [Date]: Notified Executive Leadership
- [Date]: All-staff email sent

### 6.2 External Communications
- [Date]: Submitted to [Supervisory Authority Name]
- [Date]: Individual notifications sent
- [ ] Public statement (if applicable)

## 7. Root Cause Analysis

**Primary Cause:** [e.g., Misconfigured S3 bucket]

**Contributing Factors:**
1. [Factor 1]
2. [Factor 2]

**Lessons Learned:**
1. [Lesson 1]
2. [Lesson 2]

## 8. Follow-up Actions

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Implement MFA | IT Security | 2026-04-15 | In Progress |
| Security training | HR | 2026-04-30 | Not Started |
| Pen test | External Vendor | 2026-05-30 | Not Started |

## 9. Incident Team

| Role | Name | Contact |
|------|------|---------|
| DPO | [Name] | [Email/Phone] |
| IT Security Lead | [Name] | [Email/Phone] |
| Legal Counsel | [Name] | [Email/Phone] |

## 10. Regulatory Filing

**Supervisory Authority:** [e.g., ICO, CNIL, BfDI]
**Reference Number:** [If provided by authority]
**Filed by:** [Name]
**Filed on:** [Date]
**Follow-up required:** [Yes/No]

---

**Document Owner:** [Name]
**Last Updated:** [Date]
**Next Review:** [Date + 6 months]
```

## Example

**Input:**
We discovered an AWS S3 bucket was publicly accessible for 48 hours due to misconfiguration during a routine deployment. The bucket contained customer names, emails, and order history (no payment data) for approximately 5,000 customers. Discovery was made by external security researcher who reported it responsibly. Bucket was secured within 2 hours of notification.

**Output:**

# Data Breach Incident Report

**Incident ID:** INC-2026-001
**Report Date:** March 31, 2026
**Status:** Contained & Resolved

## 1. Executive Summary

An AWS S3 bucket containing customer names, emails, and order history was publicly accessible for 48 hours (March 29-31, 2026) due to misconfiguration during deployment. Approximately 5,000 customers affected. Breach discovered by external security researcher; contained within 2 hours. Risk assessed as MEDIUM - supervisory authority notification required, individual notification not required due to mitigating factors (no sensitive data, quick containment).

## 2. Incident Details

### 2.1 Discovery
- **Discovered by:** External security researcher (John Smith)
- **Discovery date/time:** March 31, 2026, 10:00 AM UTC
- **How discovered:** Researcher found bucket via Google dorking, reported via security@company.com

### 2.2 Incident Description
- **Type:** Misconfigured cloud storage (public S3 bucket)
- **Affected systems:** AWS S3 bucket "customer-exports-prod"
- **Attack vector:** Bucket ACL set to "public-read" during deployment script execution
- **Duration:** March 29, 2026, 10:00 AM - March 31, 2026, 12:00 PM (48 hours)

### 2.3 Data Affected

| Data Category | Records | Sensitivity | Risk Level |
|---------------|---------|-------------|------------|
| Customer names | 5,000 | Low | Low |
| Email addresses | 5,000 | Low | Medium |
| Order history (product names, dates, amounts) | 15,000 orders | Low | Low-Medium |
| Payment data | 0 | N/A | N/A |
| Passwords | 0 | N/A | N/A |

**Total affected individuals:** ~5,000 customers

**Data NOT included:**
- No payment card data
- No passwords
- No sensitive/special category data
- No identification documents

## 3. Risk Assessment

### 3.1 Likelihood of Harm
**Low-Medium:** Data was technically publicly accessible, but:
- No evidence of actual unauthorized access (CloudTrail logs show only researcher's IPs)
- Bucket URL not indexed by search engines (checked Google/Bing)
- No sensitive data that would enable identity theft or fraud

### 3.2 Severity of Harm
**Low:** Potential consequences limited to:
- Spam/phishing emails (email addresses exposed)
- Privacy concern (names and purchase history visible)
- No financial risk (no payment data)
- No identity theft risk (insufficient data)

### 3.3 Overall Risk Level
**Risk Rating:** [ ] Low [X] Medium [ ] High

**Rationale:** While the breach exposed personal data, the low sensitivity of data, quick containment (48hrs), lack of evidence of access, and absence of special category data reduce risk. However, notification to supervisory authority still required as it meets "risk to rights and freedoms" threshold.

## 4. Notification Decision

### 4.1 Supervisory Authority Notification
- **Required:** Yes
- **Reason:** Breach likely results in risk (though not high risk) to individuals per GDPR Article 33
- **Deadline:** April 3, 2026, 10:00 AM (72 hours from discovery)
- **Status:** [X] Submitted
- **Submission date:** April 1, 2026, 2:00 PM

**Authority:** UK Information Commissioner's Office (ICO)
**Reference:** [ICO case number provided after submission]

### 4.2 Individual Notification
- **Required:** No
- **Reason:** Risk does NOT meet "high risk" threshold for individual notification:
  - No sensitive/special category data
  - Quick containment (48 hours)
  - No evidence of actual unauthorized access
  - Low likelihood of harm to individuals
  - Mitigating factors outweigh potential consequences
- **Decision approved by:** DPO + Legal Counsel
- **Documentation:** Retained in breach register per GDPR Article 33(5)

## 5. Containment & Remediation

### 5.1 Immediate Actions Taken
1. S3 bucket ACL reverted to private - 2026-03-31 12:00 PM - DevOps Lead
2. All S3 bucket permissions audited - 2026-03-31 2:00 PM - Security Team
3. Deployment script fix deployed - 2026-03-31 3:00 PM - Engineering
4. CloudTrail logs analyzed (no unauthorized access detected) - 2026-03-31 4:00 PM - Security
5. Google/Bing index check (bucket not indexed) - 2026-03-31 5:00 PM - Security

### 5.2 Recovery Actions
1. Verified no other public S3 buckets exist across all AWS accounts
2. Enabled AWS Config rule to detect public S3 buckets going forward
3. Added S3 bucket policy automation to block public ACLs by default

### 5.3 Preventive Measures
1. Implement S3 Block Public Access at organization level (AWS Setting)
2. Update deployment scripts to never set public ACLs
3. Add automated testing for deployment script (test in isolated environment)
4. Implement pre-deployment security review checklist
5. Enable AWS GuardDuty for anomaly detection
6. Quarterly security audit of all cloud storage

## 6. Communications

### 6.1 Internal Communications
- 2026-03-31 12:30 PM: Notified DPO and IT Security Team
- 2026-03-31 1:00 PM: Executive Leadership briefed
- 2026-03-31 3:00 PM: Engineering team all-hands on secure deployment practices

### 6.2 External Communications
- 2026-04-01 2:00 PM: Submitted breach notification to ICO
- Individual notification: Not required (see Section 4.2)
- Public statement: Not required (low/medium risk, no evidence of exploitation)

### 6.3 Researcher Communication
- 2026-03-31 12:00 PM: Confirmed receipt of researcher's report
- 2026-03-31 12:30 PM: Confirmed breach contained, thanked researcher
- 2026-04-01: Offered bug bounty reward ($500) for responsible disclosure

## 7. Root Cause Analysis

**Primary Cause:** Deployment automation script contained hardcoded "public-read" ACL as a default parameter, intended for dev environment but accidentally deployed to production bucket.

**Contributing Factors:**
1. Insufficient separation between dev and prod deployment scripts
2. No automated security testing in CI/CD pipeline
3. No alerting configured for public S3 bucket creation
4. Human error during rush deployment (Friday evening)

**Lessons Learned:**
1. Never hardcode ACL settings - use environment variables
2. Implement automated security gates in CI/CD
3. Enable real-time alerting for security-sensitive configuration changes
4. Avoid production changes during off-hours unless critical
5. Responsible disclosure programs work - researcher reported instead of exploiting

## 8. Follow-up Actions

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Implement S3 Block Public Access org-wide | DevOps Lead | 2026-04-03 | Complete |
| Deploy AWS Config rules for S3 monitoring | Security Team | 2026-04-05 | Complete |
| Update all deployment scripts | Engineering | 2026-04-10 | In Progress |
| CI/CD security gate implementation | DevOps | 2026-04-15 | Not Started |
| AWS GuardDuty enablement | Security Team | 2026-04-20 | Not Started |
| Quarterly cloud security audit schedule | DPO | 2026-04-30 | Not Started |
| Responsible disclosure policy publication | Legal/Security | 2026-04-30 | Not Started |
| Staff training on secure deployments | HR + Security | 2026-05-15 | Not Started |

## 9. Incident Team

| Role | Name | Contact |
|------|------|---------|
| DPO | Jane Smith | jane.smith@company.com / +44-XXX |
| IT Security Lead | Bob Johnson | bob.j@company.com / +44-XXX |
| DevOps Lead | Alice Chen | alice.c@company.com / +44-XXX |
| Legal Counsel | Tom Williams | tom.w@company.com / +44-XXX |
| External Researcher | John Smith | john@securityresearch.com |

## 10. Regulatory Filing

**Supervisory Authority:** UK Information Commissioner's Office (ICO)
**Filing Method:** Online portal (report.ico.org.uk)
**Reference Number:** [To be added after ICO response]
**Filed by:** Jane Smith (DPO)
**Filed on:** April 1, 2026, 2:00 PM
**Follow-up required:** Awaiting ICO response (expected within 3 months)
**Potential penalties:** Low risk (breach contained quickly, no actual harm, proactive notification, comprehensive remediation plan)

---

**Document Owner:** Jane Smith (DPO)
**Last Updated:** April 1, 2026
**Next Review:** October 1, 2026 (6-month post-incident review)
**Breach Register Entry:** Recorded per GDPR Article 33(5)

## Tips for Use

- **Don't panic:** 72 hours is manageable if you have a plan (use this template!)
- **Document everything:** Even if notification not required, you must document the decision
- **Seek advice:** When in doubt, notify - ICO won't penalize proactive disclosure
- **Learn and improve:** Every breach is an opportunity to strengthen security
- **Test your plan:** Run tabletop exercises annually to practice breach response

## Related Prompts

- [GDPR Data Mapping Analyzer](gdpr-data-mapping.md)
- [DSAR Response Workflow](dsar-response-workflow.md)
- [Legitimate Interest Assessment](legitimate-interest-assessment.md)

---

**Disclaimer:** This template is for guidance. Consult legal counsel for compliance validation. GDPR penalties for non-compliance can be up to €20 million or 4% of global annual turnover, whichever is higher.
