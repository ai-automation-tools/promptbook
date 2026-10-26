---
title: "📌 GDPR-Compliant Privacy Policy Generator"
tags: ["gdpr", "privacy-policy", "compliance", "legal", "featured"]
category: "Legal_Compliance"
subcategory: "Privacy"
---

# GDPR-Compliant Privacy Policy Generator

## Purpose
Generates comprehensive, GDPR-compliant privacy policies tailored to your organization's specific data processing activities. Covers all required disclosure elements under Articles 13-14 GDPR.

## Instructions

I want you to act as a privacy law expert drafting a GDPR-compliant privacy policy for [organization name]. 

Based on the following information, create a complete privacy policy:

### Organization Details
- **Company name:** [Legal entity name]
- **Location:** [Country]
- **Industry:** [e.g., e-commerce, SaaS, healthcare]
- **Website:** [URL]
- **DPO contact:** [Email or form URL]

### Data Processing Activities
For each activity, specify:
- **What data:** [Specific data types collected]
- **Why:** [Purpose of processing]
- **Legal basis:** [Consent, contract, legitimate interest, etc.]
- **Who has access:** [Internal teams, third parties]
- **How long kept:** [Retention period]
- **Where stored:** [Location/jurisdiction]

### Third-Party Services
- **Service 1:** [Name, purpose, location, link to their privacy policy]
- **Service 2:** [...]

### User Rights
Confirm which rights you support:
- [x] Right to access
- [x] Right to rectification
- [x] Right to erasure ("right to be forgotten")
- [x] Right to data portability
- [x] Right to object
- [x] Right to restrict processing
- [ ] Automated decision-making (if applicable)

The policy should be clear, concise, user-friendly, and legally compliant. Use plain language where possible.

## Output Format

Structure the privacy policy with these mandatory sections:

```markdown
# Privacy Policy

**Last Updated:** [Date]

## 1. Introduction
[Who you are, commitment to privacy]

## 2. Data Controller Information
- **Company:** [Name]
- **Address:** [Full address]
- **Email:** [Contact]
- **Data Protection Officer:** [Contact]

## 3. What Data We Collect

### 3.1 Information You Provide
- [Data type 1]: [When/how collected]
- [Data type 2]: [...]

### 3.2 Information We Collect Automatically
- [Cookies, analytics, etc.]

## 4. How We Use Your Data

### 4.1 [Purpose Category 1]
- **Data used:** [Specific fields]
- **Legal basis:** [GDPR Article 6(1)(a-f)]
- **Retention:** [Period]

### 4.2 [Purpose Category 2]
[...]

## 5. How We Share Your Data

### 5.1 Service Providers
| Provider | Purpose | Location | Safeguards |
|----------|---------|----------|------------|
| [Name] | [Purpose] | [Country] | [DPA/SCC/Other] |

### 5.2 Legal Disclosures
[When you may disclose data to authorities]

## 6. International Data Transfers
[If applicable: describe transfers outside EEA and safeguards]

## 7. Your Rights Under GDPR
- **Right to access:** [How to request]
- **Right to rectification:** [Process]
- **Right to erasure:** [Conditions and process]
- **Right to data portability:** [Format and process]
- **Right to object:** [How to exercise]
- **Right to restrict processing:** [Conditions]
- **Right to withdraw consent:** [How to withdraw]
- **Right to lodge a complaint:** [Supervisory authority details]

## 8. Data Security
[Security measures in place]

## 9. Data Retention
| Data Type | Retention Period | Reason |
|-----------|------------------|--------|
| [Type] | [Period] | [Legal/business justification] |

## 10. Cookies and Tracking
[Cookie policy summary, link to full cookie policy if separate]

## 11. Children's Privacy
[Policy for users under 16, if applicable]

## 12. Changes to This Policy
[How you'll notify users of changes]

## 13. Contact Us
[How to reach you with privacy questions]
```

## Example

**Input:**
Create a privacy policy for "CloudDocs Inc", a SaaS document collaboration platform. We collect: name, email, company name, uploaded documents. We use AWS eu-central-1 for storage, SendGrid for transactional emails, and Google Analytics. Legal basis: contract for service delivery, legitimate interest for analytics. Data retention: account lifetime + 90 days. Users can delete their accounts and data.

**Output:**

# Privacy Policy

**Last Updated:** March 31, 2026

## 1. Introduction

CloudDocs Inc ("we", "us", "our") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our document collaboration platform.

## 2. Data Controller Information

- **Company:** CloudDocs Inc
- **Address:** 123 Tech Street, Berlin, Germany
- **Email:** privacy@clouddocs.com
- **Data Protection Officer:** dpo@clouddocs.com

## 3. What Data We Collect

### 3.1 Information You Provide

- **Account Information:** Name, email address, company name (collected when you create an account)
- **Documents:** Files and content you upload to our platform
- **Support Communications:** Messages you send us for customer support

### 3.2 Information We Collect Automatically

- **Usage Data:** Pages visited, features used, time spent (via Google Analytics)
- **Device Information:** Browser type, operating system, IP address
- **Cookies:** Essential cookies for authentication, optional analytics cookies

## 4. How We Use Your Data

### 4.1 Service Delivery
- **Data used:** Name, email, company name, documents
- **Legal basis:** Performance of contract (GDPR Article 6(1)(b))
- **Retention:** Duration of your account + 90 days after deletion
- **Purpose:** To provide document collaboration, storage, and sharing functionality

### 4.2 Platform Improvement
- **Data used:** Usage data, aggregated analytics
- **Legal basis:** Legitimate interest (GDPR Article 6(1)(f))
- **Retention:** 26 months (Google Analytics default)
- **Purpose:** To improve our product, identify bugs, and understand user needs

### 4.3 Communications
- **Data used:** Email address
- **Legal basis:** Performance of contract for transactional emails; Consent for marketing
- **Retention:** Account lifetime (transactional); until consent withdrawn (marketing)
- **Purpose:** Account notifications, security alerts, product updates (if opted in)

## 5. How We Share Your Data

### 5.1 Service Providers

| Provider | Purpose | Location | Safeguards |
|----------|---------|----------|------------|
| Amazon Web Services (AWS) | Infrastructure and storage | EU (Frankfurt) | GDPR-compliant, DPA in place |
| SendGrid (Twilio) | Transactional emails | US | Standard Contractual Clauses |
| Google Analytics | Usage analytics | US | Data Processing Amendment, IP anonymization enabled |

We do not sell your personal data to third parties.

### 5.2 Legal Disclosures

We may disclose your data if required by law, court order, or to protect our rights and safety.

## 6. International Data Transfers

Your data is primarily stored in the EU (AWS Frankfurt region). When we use US-based processors (SendGrid, Google), we ensure adequate safeguards through Standard Contractual Clauses approved by the European Commission.

## 7. Your Rights Under GDPR

- **Right to access:** Request a copy of your personal data via Settings > Privacy > Download My Data
- **Right to rectification:** Update your profile information in account settings
- **Right to erasure:** Delete your account via Settings > Account > Delete Account (data removed within 30 days)
- **Right to data portability:** Download your documents in standard formats (JSON, PDF, ZIP)
- **Right to object:** Opt out of analytics cookies via cookie banner or Settings > Privacy
- **Right to restrict processing:** Contact us at privacy@clouddocs.com
- **Right to withdraw consent:** Unsubscribe from marketing emails via link in email footer
- **Right to lodge a complaint:** Contact your national data protection authority ([Germany: BfDI](https://www.bfdi.bund.de))

To exercise these rights, email privacy@clouddocs.com. We respond within 30 days.

## 8. Data Security

We implement industry-standard security measures:
- **Encryption:** Data encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Access controls:** Role-based access, multi-factor authentication
- **Regular audits:** Annual security audits and penetration testing
- **Incident response:** Documented breach notification procedures (GDPR Article 33-34 compliant)

## 9. Data Retention

| Data Type | Retention Period | Reason |
|-----------|------------------|--------|
| Account data (name, email) | Account lifetime + 90 days | Business records, support continuity |
| Documents | Account lifetime | Core service feature |
| Usage analytics | 26 months | Google Analytics default, platform improvement |
| Support tickets | 3 years | Legal record-keeping |
| Deleted account backups | 30 days | System integrity, accidental deletion recovery |

## 10. Cookies and Tracking

We use:
- **Essential cookies:** Required for authentication and core functionality (cannot be disabled)
- **Analytics cookies:** Optional, used for understanding product usage (Google Analytics)

You can manage cookie preferences via our cookie banner or browser settings. [Learn more about our cookies](cookie-policy.md).

## 11. Children's Privacy

Our service is not intended for users under 16. We do not knowingly collect data from children. If you believe a child has provided us with personal information, contact us immediately.

## 12. Changes to This Policy

We may update this policy to reflect service changes or legal requirements. We'll notify you via email and in-app notification at least 30 days before material changes take effect. Continued use after changes constitutes acceptance.

## 13. Contact Us

For privacy questions or to exercise your rights:
- **Email:** privacy@clouddocs.com
- **Data Protection Officer:** dpo@clouddocs.com
- **Address:** CloudDocs Inc, 123 Tech Street, 10115 Berlin, Germany

---

This policy complies with GDPR (EU Regulation 2016/679) and is effective as of March 31, 2026.

## Tips for Use

- **Update regularly:** Review annually or when data practices change
- **Make it accessible:** Link prominently in footer, sign-up flow, and app settings
- **Keep it current:** Update "Last Updated" date whenever you make changes
- **Translate if needed:** Provide in all languages you serve (GDPR requirement)
- **Version control:** Keep archive of previous versions for compliance records

## Related Prompts

- [GDPR Data Mapping Analyzer](gdpr-data-mapping.md)
- [Cookie Consent Banner Text](cookie-consent-banner.md)
- [Terms of Service Generator](../Contracts/terms-of-service-generator.md)

---

**Disclaimer:** This is a template. Consult with legal counsel to ensure compliance with your specific jurisdiction and business model.
