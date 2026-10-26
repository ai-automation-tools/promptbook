---
title: "📌 Enterprise Technical Documentation Prompt Library"
tags: ["it", "operations", "documentation"]
category: "IT"
subcategory: "Operations"
---
# Enterprise Technical Documentation Prompt Library

*Download this file and use the prompts to generate implementation-ready technical documentation.*

---

## 1. Identity & Access Management (IAM)

### Prompt Title: IAM Role-Based Access Control (RBAC) Matrix
- **Purpose of the Document:** To define explicit, non-conflicting role definitions and associated permissions across hybrid systems.
- **Full Prompt:**
    "Generate a comprehensive Role-Based Access Control (RBAC) matrix for a multinational enterprise with 5,000+ employees. The document must define role families (e.g., Engineering, Finance, HR, C-Suite) and map them to specific systems (Active Directory, AWS, Azure, Salesforce, Workday, ServiceNow). Include: 1) Role Name and unique ID; 2) Job Function alignment; 3) Granular system entitlements (read/write/delete/execute); 4) Segregation of Duties (SoD) conflict pairs (e.g., user creation vs. payment approval); 5) Recertification frequency (quarterly/annually). Align with NIST Digital Identity Guidelines (800-63-3) and SOX compliance requirements. Output must be in a format ready for import into an IGA tool like SailPoint or Okera. Avoid generic descriptions; permissions must be system-specific."
- **Required Standards Alignment:** NIST 800-63, SOX, ISO 27001 (Control A.9)
- **Target Audience:** IAM Engineers, Identity Governance Team, Internal Auditors
- **Maturity Level:** Advanced

### Prompt Title: Privileged Access Management (PAM) Implementation Blueprint
- **Purpose of the Document:** To secure, manage, and monitor administrative accounts.
- **Full Prompt:**
    "Generate a Privileged Access Management (PAM) implementation blueprint for a hybrid cloud environment (on-prem servers, AWS, Azure). The document must detail: 1) Discovery phase (locating all local admin, domain admin, and service accounts); 2) Vaulting strategy (credential rotation frequency, password complexity requirements); 3) Session management (just-in-time access requests, session recording and auditing requirements); 4) Emergency break-glass procedure (tamper-proof, audited); 5) Integration roadmap with SIEM (specific log forwarding requirements). Align to the Center for Internet Security (CIS) Critical Security Control 5. Provide concrete PowerShell or AWS CLI examples for implementing credential rotation where applicable."
- **Required Standards Alignment:** CIS Controls v8 (Control 5), ISO 27001 (A.9.4)
- **Target Audience:** Security Architects, IAM Operations
- **Maturity Level:** Advanced

---

## 2. Cyber Security

### Prompt Title: Enterprise Security Hardening Standard (OS & Middleware)
- **Purpose of the Document:** To define the secure baseline configuration for all servers and endpoints.
- **Full Prompt:**
    "Create an enterprise security hardening standard for Windows Server 2022 and RHEL 9. The document must be a checklist format suitable for automation (Ansible/Puppet). Cover: 1) Filesystem configuration (separate partitions, mounting options); 2) Kernel/System hardening (removing unnecessary modules, ASLR); 3) Network stack hardening (SYN cookies, ICMP redirects); 4) Authentication settings (PAM/Credential Guard configurations); 5) Audit logging (specific event IDs to collect). Align with CIS Benchmarks and DISA STIGs. Where a CIS benchmark recommends a registry key, include the exact registry path and value. Output must be technically precise and verifiable via scanning tools."
- **Required Standards Alignment:** CIS Benchmarks, DISA STIG, PCI DSS v4.0
- **Target Audience:** System Administrators, SecOps, Compliance Teams
- **Maturity Level:** Intermediate

---

## 3. IT Architecture

### Prompt Title: Solution Architecture Design Document (ADD) Template
- **Purpose of the Document:** To ensure new solutions fit the enterprise landscape and meet NFRs.
- **Full Prompt:**
    "Generate a Solution Architecture Design Document (ADD) template for a TOGAF-compliant enterprise. The template must require the architect to fill in: 1) Architectural Context (Current vs. Target state); 2) Functional Requirements mapping to application components; 3) Non-Functional Requirements (Scalability: concurrent user load; Resilience: RTO/RPO; Security: data encryption in transit/rest); 4) Interface specifications (API contracts, messaging protocols); 5) Data model impact (logical and physical changes); 6) Infrastructure requirements (compute, network latency). The template must explicitly require the architect to document trade-offs and decisions using Architecture Decision Records (ADRs). Include placeholders for Visio/C4 diagrams."
- **Required Standards Alignment:** TOGAF 9.2, Zachman Framework
- **Target Audience:** Enterprise Architects, Solution Architects, Project Managers
- **Maturity Level:** Foundational (Template) / Advanced (Content)

---

## 4. IT Infrastructure

### Prompt Title: Data Center / MDF Rack Elevation and Cabling Standard
- **Purpose of the Document:** To define physical infrastructure layout to ensure cooling, power, and maintenance reliability.
- **Full Prompt:**
    "Write a technical standard for data center and wiring closet (IDF/MDF) physical layout. The document must include: 1) Rack elevation standards (U positioning: never mount switches upside down, patch panel placement); 2) Power specifications (PDU load balancing, voltage requirements, redundant A/B feed requirements); 3) Structured cabling specifications (Cat6A vs. Fiber OM4, cable dressing (Velcro vs. zip ties), bend radius restrictions); 4) Labeling convention (ANSI/TIA-606-B compliant syntax for port-to-patch panel mapping); 5) Environmental requirements (temperature/humidity ranges). Output must be detailed enough for a data center technician to build a rack without asking questions."
- **Required Standards Alignment:** ANSI/TIA-942, TIA-606-B, Uptime Institute
- **Target Audience:** Data Center Managers, Facilities, Network Engineers
- **Maturity Level:** Foundational

---

## 5. IT Development & DevSecOps

### Prompt Title: CI/CD Pipeline Security Controls (DevSecOps)
- **Purpose of the Document:** To embed security gates within the software delivery lifecycle.
- **Full Prompt:**
    "Generate a DevSecOps pipeline controls document for a Jenkins/GitLab CI environment. The document must specify mandatory security gates that fail the build if not passed. Include: 1) SAST integration (e.g., SonarQube: must have critical/high bug fixes); 2) SCA scanning (e.g., Snyk: fail on high-severity library vulnerabilities); 3) Container scanning (e.g., Trivy: fail on critical OS-level CVEs in base images); 4) Secret detection (prevent commits of AWS keys, passwords); 5) Infrastructure as Code (IaC) scanning (Checkov/Terraform scan for misconfigurations). Align to OWASP SAMM. Define thresholds (e.g., 'Code coverage must be >80%'). Provide YAML pipeline snippets for each gate."
- **Required Standards Alignment:** OWASP SAMM, NIST SSDF (800-218)
- **Target Audience:** DevOps Engineers, Security Champions, AppSec
- **Maturity Level:** Advanced

---

## 6. IT Operations

### Prompt Title: Standard Operating Procedure (SOP) - User Account Lifecycle
- **Purpose of the Document:** To standardize the daily tasks of the service desk regarding identity management.
- **Full Prompt:**
    "Create a detailed Standard Operating Procedure (SOP) for the Service Desk regarding user account management. The document must be step-by-step, suitable for a Level 1 technician. Cover: 1) Onboarding: Step-by-step account creation in Active Directory, group membership based on HR data, MFA enrollment process; 2) Transfers: Moving groups, disabling old permissions; 3) Offboarding: Immediate disabling, revocation of MFA, forwarding emails, manager approval workflow. Include screenshots of the specific tools used (e.g., Active Directory Users and Computers). Define SLAs (e.g., 'New hire account created within 4 hours of ticket receipt')."
- **Required Standards Alignment:** ITIL 4 (Service Request Management)
- **Target Audience:** Service Desk Analysts, IT Operations Managers
- **Maturity Level:** Foundational

---

## 7. Cloud Architecture & Security

### Prompt Title: Multi-Account AWS/Organizations Security Guardrails
- **Purpose of the Document:** To enforce security and compliance consistently across all cloud accounts.
- **Full Prompt:**
    "Generate a cloud security guardrails document for an AWS Organization using a multi-account strategy (Log Archive, Security Tooling, Dev, Prod). The document must define: 1) Service Control Policies (SCPs): Explicitly list services that must be denied (e.g., disable leaving GuardDuty, disable disabling CloudTrail). Provide JSON policy examples. 2) Networking: Mandatory VPC configuration (no public IPs by default, flow logs enabled); 3) Encryption: Requirement for S3 bucket encryption (KMS) and EBS encryption by default; 4) Compliance: Enablement of AWS Config rules (e.g., require MFA for root account). Align to the AWS Well-Architected Framework (Security Pillar) and CIS AWS Foundations Benchmark."
- **Required Standards Alignment:** CIS AWS Foundations, NIST 800-53, AWS WAFR
- **Target Audience:** Cloud Architects, Cloud SecOps, FinOps
- **Maturity Level:** Advanced

---

## 8. Data Governance

### Prompt Title: Data Classification and Handling Policy
- **Purpose of the Document:** To define how data is labeled and protected based on sensitivity.
- **Full Prompt:**
    "Draft a Data Classification and Handling Policy for a global organization subject to GDPR and CCPA. Define at least four classification levels (e.g., Public, Internal, Confidential, Restricted). For each level, specify: 1) Definition and examples (e.g., 'Restricted: PII, Trade Secrets'); 2) Data at rest requirements (encryption algorithm: AES-256); 3) Data in transit requirements (TLS 1.3 minimum); 4) Sharing rules (approved methods, need-to-share basis); 5) Retention period and disposal method (cryptographic shredding vs. degaussing). Align to ISO 27001 (A.8) and GDPR Article 32. The policy must include a matrix table for quick reference."
- **Required Standards Alignment:** ISO 27001 (A.8), GDPR, CCPA
- **Target Audience:** Data Owners, Data Stewards, Legal, Compliance
- **Maturity Level:** Intermediate

---

## 9. Logging & Monitoring

### Prompt Title: Comprehensive Log Ingestion and Retention Strategy
- **Purpose of the Document:** To ensure all critical logs are collected, stored securely, and queryable for investigations.
- **Full Prompt:**
    "Develop a logging and monitoring strategy document for a hybrid enterprise (Windows, Linux, AWS CloudTrail, Azure AD, Network Flows). The document must include: 1) Log Sources Table: List all critical sources, the specific log types (e.g., Security Event ID 4625), and the facility/severity; 2) SIEM Integration: Parsing requirements and field extraction; 3) Retention Tiers: Hot storage (30 days), Cold storage (1-7 years) with justification (regulatory/compliance); 4) Protection: Log integrity (hashing/immutability) and access controls to log repositories. Align to NIST 800-92 (Guide to Computer Security Log Management). Include a sample architecture diagram."
- **Required Standards Alignment:** NIST 800-92, ISO 27001 (A.12.4)
- **Target Audience:** SOC Managers, SIEM Engineers, Compliance Officers
- **Maturity Level:** Intermediate

---

## 10. Incident Response

### Prompt Title: Incident Response Playbook - Ransomware
- **Purpose of the Document:** To provide technical, step-by-step instructions for containing and eradicating ransomware.
- **Full Prompt:**
    "Create a technical Incident Response playbook specifically for a Ransomware outbreak. Structure it by phase: 1) Triage: Specific log queries to run (EDR, DNS logs) to identify patient zero and scope; 2) Containment: Immediate network isolation commands (e.g., 'netsh' commands on Windows, disabling AD accounts, disabling SMBv1); 3) Eradication: Steps to remove the binary, registry persistence mechanisms, and rollback credentials; 4) Recovery: Specific steps for restoring from clean backups (validating backup integrity before restore). Align to NIST 800-61. Include command-line snippets for common EDR tools (CrowdStrike, SentinelOne) or native OS tools. The language must be prescriptive, not theoretical."
- **Required Standards Alignment:** NIST 800-61, CISA Ransomware Guide
- **Target Audience:** SOC Analysts, Incident Responders, Threat Hunters
- **Maturity Level:** Advanced

---

## 11. Vulnerability Management

### Prompt Title: Vulnerability Remediation SLA Matrix
- **Purpose of the Document:** To define business timelines for fixing security flaws based on risk.
- **Full Prompt:**
    "Generate a Vulnerability Remediation SLA document. Define severity levels (Critical, High, Medium, Low) based on CVSS v3 scoring AND environmental context (e.g., 'Critical if Public-Facing'). For each severity, specify: 1) Remediation timeframe (e.g., Critical = 48 hours, High = 7 days); 2) Validation requirements (e.g., rescanner must confirm fix); 3) Exemption process (compensating controls required). Map these timelines to common vulnerability types (e.g., RCE, XSS, default credentials). Align to PCI DSS Requirement 6 (although PCI timelines are strict, this must be tighter). Include a workflow diagram for exception handling."
- **Required Standards Alignment:** PCI DSS v4.0, ISO 27001 (A.12.6)
- **Target Audience:** Vulnerability Managers, Patch Teams, Application Owners
- **Maturity Level:** Intermediate

---

## 12. Business Continuity (Technical Aspects)

### Prompt Title: Technical Disaster Recovery Runbook (Critical Application)
- **Purpose of the Document:** To provide the exact commands and steps to failover a critical application.
- **Full Prompt:**
    "Write a Technical Disaster Recovery Runbook for a mission-critical web application (3-tier: Web, App, DB) hosted in a hybrid cloud. The document must be so precise that an on-call engineer can execute it under stress. Include: 1) Prerequisites: Specific software versions, network connectivity checks (IPs/ports); 2) Failover Steps: Exact CLI commands to promote the replica database (e.g., AWS RDS failover, or SQL Server ALTER DATABASE), DNS cutover steps (TTL changes), load balancer reconfiguration; 3) Fallback steps: Steps to return to primary site once restored; 4) Success Criteria: Specific HTTP return codes and database connectivity tests. Align to ISO 22301."
- **Required Standards Alignment:** ISO 22301, ITIL Service Continuity Management
- **Target Audience:** Site Reliability Engineers (SREs), Infrastructure Ops
- **Maturity Level:** Advanced

---

## 13. Change & Release Management

### Prompt Title: Change Advisory Board (CAB) Package Template
- **Purpose of the Document:** To standardize the information required to approve a high-risk change.
- **Full Prompt:**
    "Generate a Change Advisory Board (CAB) submission template. The template must force the requester to provide: 1) Risk Assessment (scope of impact, user impact); 2) Technical Implementation Plan (rollback steps first, then forward steps); 3) Testing Evidence (unit test results, UAT sign-off); 4) Communication Plan (draft user outage notification). The template must explicitly include a 'Back-out Plan' section requiring specific commands or steps to revert the change. Align to ITIL 4 Change Enablement practices. The output should be a form-like structure ready for pasting into a ticketing system like Jira or ServiceNow."
- **Required Standards Alignment:** ITIL 4, COBIT (APO10)
- **Target Audience:** Change Managers, Release Managers, Application Teams
- **Maturity Level:** Foundational

---

## 14. Asset & Configuration Management

### Prompt Title: Configuration Management Database (CMDB) Data Population Standards
- **Purpose of the Document:** To define what constitutes a 'golden record' in the CMDB.
- **Full Prompt:**
    "Create a data population and normalization standard for a Configuration Management Database (CMDB). Define mandatory attributes for key Configuration Items (CIs) like Servers, Applications, and Databases. For a Server CI, require: Hostname, Serial Number, Environment (Prod/Dev), Cluster Name, CPU Cores, Memory, Storage LUNs, and Business Owner. Define the 'Source of Truth' for each attribute (e.g., 'IP address comes from Infoblox, Owner comes from ServiceNow'). Specify reconciliation rules (what to do when AWS API says 8GB RAM but the user says 16GB). Align to ITIL 4 Service Configuration Management."
- **Required Standards Alignment:** ITIL 4, ISO 27001 (A.8.1.1)
- **Target Audience:** CMDB Administrators, Asset Managers, Service Owners
- **Maturity Level:** Intermediate