---
title: "📌 IAM Prompt Library"
tags: ["it", "iam", "prompt", "library"]
category: "IT"
subcategory: "IAM"
---
# 1. IAM Prompt Library

This document contains categorized prompts for building IAM documentation, standards, architecture, policies, and controls.

## IAM Policy and Access Control Prompts
1. Define a standard format for IAM policies used across AWS, Azure, and GCP.
2. Document least privilege access policy design for internal applications.
3. Write a policy for managing privileged access (PAM) within production systems.
4. Develop access control standards for external contractors and third parties.
5. Create a user role matrix for common application access levels (Admin, Read-only, etc.).
6. Document approval workflows for access requests based on criticality.
7. Create a policy for emergency or break-glass accounts.
8. Write IAM policies to enforce MFA for sensitive systems and APIs.
9. Develop a naming convention standard for IAM roles, groups, and permissions.

## Documentation and Standards Prompts
10. Create a standard operating procedure (SOP) for identity onboarding and offboarding.
11. Document the identity lifecycle management (joiner, mover, leaver) processes.
12. Establish documentation for periodic access reviews and certification campaigns.
13. Define data classification tiers and IAM mapping (Public, Internal, Confidential, Restricted).
14. Develop standards for integrating cloud applications with your IAM platform (e.g., SailPoint, Okta).
15. Write documentation on the process of federated identity and SSO integration.
16. Define guidelines for IAM logging and auditing, including log retention requirements.
17. Create IAM documentation templates for new application onboarding.

## IAM Governance & Risk Controls Prompts
18. Develop controls for detecting and preventing toxic combinations (SoD violations).
19. Create governance documentation for handling orphaned accounts.
20. Write controls to ensure timely deprovisioning of user access upon termination.
21. Document controls for monitoring inactive accounts and stale privileges.
22. Define IAM governance roles and responsibilities (e.g., Role Owner, Certifier, Sys Admin).
23. Develop control objectives aligned with ISO 27001, NIST 800-53, or CIS.
24. Create IAM risk assessment documentation for application onboarding.

## Role & Entitlement Management Prompts
25. Document the process for role mining and role modeling using SailPoint or equivalent tools.
26. Define a framework for building business roles and technical roles.
27. Create standards for entitlement classification (birthright vs requested vs privileged).
28. Develop documentation for role approval chains and role owners.
29. Write a strategy for managing dynamic access using attribute-based access control (ABAC).

## Automation & IAM Integration Prompts
30. Create documentation for integrating IAM with HRMS systems (Workday, SAP, etc.).
31. Define standards for provisioning and deprovisioning automation workflows.
32. Document integration requirements for ServiceNow IAM request and fulfillment.
33. Build a standard for onboarding applications to SailPoint IdentityNow or IIQ.

## Metrics, Reporting, and Compliance Prompts
34. Define key IAM metrics (e.g., access review completion rate, time-to-revoke access).
35. Create a reporting template for auditors showing access review logs and user attestation history.
36. Document evidence collection procedures for IAM controls (e.g., for SOX or PCI DSS).

## IAM Architecture & Data Flow Diagram Prompts
37. Create a high-level IAM architecture diagram showing integration between HRMS, SailPoint, Active Directory, and downstream apps.
38. Design a data flow diagram for identity lifecycle events: joiner, mover, leaver.
39. Document the flow of provisioning requests from a user portal through approval workflows to connected systems.
40. Develop a diagram of SailPoint IdentityIQ architecture including Application Servers, DB, Identity Cubes, and Task Schedulers.
41. Design an architecture for cross-domain federation (SAML, OAuth2, OIDC) across SaaS platforms.
42. Create a data flow diagram for an access review campaign including trigger, data collection, review, and revocation steps.
43. Document a Zero Trust IAM architecture with focus on continuous authentication and dynamic risk evaluation.
44. Diagram the RBAC model in your environment: mapping users → roles → entitlements → resources.
45. Create an architecture overview for Just-in-Time (JIT) provisioning and ephemeral access.
46. Design a microservices IAM integration architecture using centralized token issuance and validation.
47. Document data synchronization flows between IAM, authoritative sources, and directories (AD, LDAP).
48. Illustrate how access request flows integrate with ITSM tools (e.g., ServiceNow) for ticketing and fulfillment.
49. Create a compliance-focused IAM logging and auditing architecture showing log sources, storage, and analysis pipelines.
50. Develop a cloud IAM reference architecture for managing access across AWS, Azure, and GCP accounts.
51. Diagram the interaction between SailPoint, PAM tools (CyberArk, BeyondTrust), and end-user systems.