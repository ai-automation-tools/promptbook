---
title: "📌 GDPR Data Mapping Analyzer"
tags: ["gdpr", "privacy", "data-mapping", "compliance", "featured"]
category: "Legal_Compliance"
subcategory: "Privacy"
---

# GDPR Data Mapping Analyzer

## Purpose
Helps organizations create comprehensive data flow maps to identify where personal data is collected, stored, processed, and transferred across systems. Essential for GDPR Article 30 compliance (Record of Processing Activities).

## Instructions

I want you to act as a GDPR data mapping specialist. You will help me create a comprehensive data flow analysis for [organization/system name].

For each data processing activity, analyze and document:

### 1. Data Collection
- **What personal data is collected?** (List specific fields: name, email, IP address, etc.)
- **From whom?** (Customers, employees, partners, etc.)
- **How is it collected?** (Web forms, APIs, third-party integrations, etc.)
- **Legal basis for collection:** (Consent, contract, legitimate interest, legal obligation, vital interest, public task)

### 2. Data Storage
- **Where is data stored?** (Database, cloud storage, filesystem, etc.)
- **Data location:** (EU, US, other regions)
- **Retention period:** (How long is data kept?)
- **Who has access?** (Roles, departments, third parties)

### 3. Data Processing
- **What processing occurs?** (Analytics, profiling, automated decision-making, etc.)
- **Purpose of processing:** (Business justification)
- **Processing tools/systems:** (Software, services, platforms)

### 4. Data Transfers
- **Internal transfers:** (Between departments, systems)
- **External transfers:** (Third parties, processors, countries)
- **Transfer mechanisms:** (Standard Contractual Clauses, adequacy decisions, etc.)
- **Third-party processors:** (Names, locations, purposes)

### 5. Data Subject Rights
- **How can subjects access their data?**
- **How can they request deletion/modification?**
- **Process for data portability:**

### 6. Security Measures
- **Technical safeguards:** (Encryption, access controls, etc.)
- **Organizational safeguards:** (Policies, training, etc.)

Your output should be formatted as a markdown table and detailed narrative for each processing activity. Flag any compliance gaps or risks you identify.

## Output Format

For each data processing activity, provide:

```markdown
## Processing Activity: [Name]

### Overview
- **Category:** [e.g., Customer Management, HR, Marketing]
- **Data Controller:** [Organization name]
- **Data Protection Officer Contact:** [Email/Name]

### Data Inventory
| Data Type | Source | Legal Basis | Retention | Location |
|-----------|--------|-------------|-----------|----------|
| Name | Web form | Consent | 2 years | AWS EU-Central-1 |
| Email | API import | Contract | Account lifetime | AWS EU-Central-1 |

### Data Flow Map
[Collection] → [Storage] → [Processing] → [Transfer/Deletion]

### Third-Party Processors
| Processor | Purpose | Location | Safeguards |
|-----------|---------|----------|------------|
| Mailchimp | Email marketing | US | Standard Contractual Clauses |

### Risk Assessment
- ⚠️ **Risk 1:** [Description and mitigation]
- ✅ **Compliant:** [What's working well]

### Recommendations
1. [Action item 1]
2. [Action item 2]
```

## Example

**Input:**
Analyze data processing for our e-commerce customer checkout system. We collect name, email, shipping address, payment card details (tokenized), and order history. Data is stored in MySQL on AWS eu-west-1 and processed by Stripe for payments.

**Output:**

## Processing Activity: E-commerce Customer Checkout

### Overview
- **Category:** Customer Management & Sales
- **Data Controller:** Example E-commerce Ltd
- **Data Protection Officer Contact:** dpo@example.com

### Data Inventory
| Data Type | Source | Legal Basis | Retention | Location |
|-----------|--------|-------------|-----------|----------|
| Name | Checkout form | Contract fulfillment | 7 years (tax law) | AWS eu-west-1 |
| Email | Checkout form | Contract fulfillment | Account lifetime + 2 years | AWS eu-west-1 |
| Shipping address | Checkout form | Contract fulfillment | 7 years (tax law) | AWS eu-west-1 |
| Payment card token | Stripe API | Contract fulfillment | Until card expires | Stripe (EU) |
| Order history | Database | Contract fulfillment | 7 years (tax law) | AWS eu-west-1 |

### Data Flow Map
```
Customer → Checkout Form (HTTPS) → Application Server (eu-west-1) 
→ MySQL Database (encrypted at rest) 
→ Stripe API (PCI-compliant tokenization)
→ Order fulfillment → Archive (7 years) → Deletion
```

### Third-Party Processors
| Processor | Purpose | Location | Safeguards |
|-----------|---------|----------|------------|
| Stripe | Payment processing | EU | GDPR-compliant processor, SCC in place |
| AWS | Infrastructure | EU | GDPR-compliant processor, DPA signed |

### Risk Assessment
- ✅ **Compliant:** Data stays within EU, processors have DPAs
- ✅ **Compliant:** Encryption at rest and in transit
- ⚠️ **Risk 1:** 7-year retention exceeds minimum necessary for customer data (only required for tax records). **Mitigation:** Implement data minimization - pseudonymize customer PII after 2 years, retain only order/transaction data for tax compliance.

### Recommendations
1. Implement automated data pseudonymization after 2-year active period
2. Add data subject access request (DSAR) automation via customer portal
3. Document legitimate interest assessment for marketing emails (if applicable)
4. Conduct annual DPA/SCC review with Stripe and AWS

## Tips for Use

- **Start with high-risk activities:** Customer data, employee data, health data, children's data
- **Document everything:** GDPR requires written records - this analysis IS your Article 30 documentation
- **Review annually:** Data flows change - update mappings yearly or after major system changes
- **Involve stakeholders:** Work with IT, legal, and business teams for complete picture
- **Use this for:** Data Protection Impact Assessments (DPIAs), audit preparation, vendor due diligence

## Related Prompts

- [GDPR Privacy Policy Generator](gdpr-privacy-policy-generator.md)
- [DSAR Response Workflow](dsar-response-workflow.md)
- [Data Breach Response Plan](data-breach-response-plan.md)

---

**Note:** This analysis is a starting point. Consult legal counsel for compliance validation.
