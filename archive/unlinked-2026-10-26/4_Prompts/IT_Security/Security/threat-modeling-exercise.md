---
title: "📌 Prompt: Threat Modeling Exercise"
tags:
- collections
- it
- threat
- modeling
- exercise
category: Collections
subcategory: IT
---
# Prompt: Threat Modeling Exercise

## Goal
To conduct a structured threat modeling exercise that identifies, analyzes, and prioritizes potential security threats to a system, application, or architecture, enabling teams to implement effective mitigations before vulnerabilities are exploited.

## Inputs
- **System Description:** A detailed overview of the system being analyzed, including its purpose, components, and business context.
- **Architecture Diagram:** Visual representation of system components, data flows, trust boundaries, and external dependencies (can be textual description if diagram unavailable).
- **Data Classification:** Types of data processed by the system and their sensitivity levels (e.g., PII, financial, healthcare, public).
- **User Roles:** Different actors who interact with the system and their privilege levels.
- **Deployment Environment:** Where and how the system is deployed (cloud, on-premise, hybrid, containerized).

## Instructions

### Phase 1: System Decomposition
1. **Identify Assets:** List all valuable assets the system protects (data, functionality, reputation, availability).
2. **Map Data Flows:** Trace how data moves through the system from entry to storage to exit.
3. **Define Trust Boundaries:** Identify where trust levels change (e.g., internet to DMZ, DMZ to internal network, user input to application).
4. **Catalog Entry Points:** Document all interfaces where external entities interact with the system (APIs, UIs, file uploads, network protocols).

### Phase 2: Threat Identification (STRIDE Analysis)
For each component and data flow, systematically identify threats using the STRIDE framework:

| Category | Description | Key Questions |
|:---------|:------------|:--------------|
| **S**poofing | Impersonating something or someone | Can an attacker pretend to be another user, system, or component? |
| **T**ampering | Modifying data or code | Can data be modified in transit or at rest without detection? |
| **R**epudiation | Denying actions | Can users deny performing actions? Are audit logs adequate? |
| **I**nformation Disclosure | Exposing data to unauthorized parties | Can sensitive data leak through logs, errors, or side channels? |
| **D**enial of Service | Disrupting service availability | Can the system be overwhelmed or crashed? |
| **E**levation of Privilege | Gaining unauthorized access | Can attackers escalate from low to high privileges? |

### Phase 3: Risk Assessment (DREAD Scoring)
Rate each identified threat on a scale of 1-10 for each DREAD factor:

| Factor | Description | Scoring Guidance |
|:-------|:------------|:-----------------|
| **D**amage Potential | How severe is the impact? | 1=Minor inconvenience, 10=Complete system compromise |
| **R**eproducibility | How easily can it be reproduced? | 1=Very difficult, 10=Trivial to reproduce |
| **E**xploitability | How much skill/resources needed? | 1=Expert-level attack, 10=Script kiddie can exploit |
| **A**ffected Users | How many users impacted? | 1=Single user, 10=All users |
| **D**iscoverability | How easy to find the vulnerability? | 1=Requires insider knowledge, 10=Publicly documented |

**Risk Score = (D + R + E + A + D) / 5**

### Phase 4: Mitigation Strategy
For each high-priority threat (Risk Score >= 6), develop mitigations:
1. **Preventive Controls:** Stop the threat from occurring
2. **Detective Controls:** Identify when threat activity occurs
3. **Corrective Controls:** Respond to and recover from incidents

### Phase 5: Validation and Documentation
1. Review threat model with stakeholders
2. Map mitigations to implementation tasks
3. Define acceptance criteria for security testing
4. Establish review cadence for threat model updates

## Output Format

### Threat Model Summary
```
System: [System Name]
Analysis Date: [Date]
Participants: [Team Members]
Scope: [What's included/excluded]
```

### Asset Inventory
| Asset ID | Asset Name | Type | Sensitivity | Owner |
|:---------|:-----------|:-----|:------------|:------|
| A-001 | Customer PII | Data | High | Data Team |

### Trust Boundary Diagram (Text Representation)
```
[Internet] --HTTPS--> [WAF/CDN] --HTTP--> [Load Balancer]
                                              |
                    +-------------------------+-------------------------+
                    |                         |                         |
              [Web Server]             [API Gateway]              [Admin Portal]
                    |                         |                         |
                    +------------+------------+                         |
                                 |                                      |
                           [App Server] <-------------------------------+
                                 |
                    +------------+------------+
                    |                         |
              [Database]               [Cache Layer]
```

### Threat Register
| Threat ID | STRIDE | Component | Description | DREAD Score | Priority | Status |
|:----------|:-------|:----------|:------------|:------------|:---------|:-------|
| T-001 | Spoofing | Auth Service | Session token prediction | 7.2 | Critical | Open |
| T-002 | Tampering | API Gateway | Request parameter manipulation | 6.4 | High | Mitigated |
| T-003 | Info Disclosure | Logging | PII in application logs | 5.8 | Medium | Open |

### Detailed Threat Analysis (per threat)
```
Threat ID: T-001
Category: Spoofing
Component: Authentication Service
Attack Vector: Attacker predicts or brute-forces session tokens due to weak randomness
Impact: Complete account takeover, unauthorized access to user data
Likelihood: Medium (requires token entropy analysis)
DREAD Breakdown: D=8, R=6, E=7, A=8, D=7 = 7.2

Mitigations:
- [PREVENT] Use cryptographically secure random token generation (256-bit minimum)
- [PREVENT] Implement token binding to client fingerprint
- [DETECT] Monitor for unusual session creation patterns
- [CORRECT] Implement automatic session invalidation on anomaly detection

Validation:
- [ ] Security testing confirms token entropy >= 256 bits
- [ ] Penetration test validates session fixation resistance
```

### Mitigation Roadmap
| Mitigation ID | Threat(s) | Description | Effort | Owner | Target Date |
|:--------------|:----------|:------------|:-------|:------|:------------|
| M-001 | T-001 | Implement secure token generation | Medium | Auth Team | Q2 2025 |
| M-002 | T-002, T-003 | Input validation framework | High | Platform Team | Q3 2025 |

## Example Threat Modeling Session

**Scenario:** E-commerce checkout API

**Asset Identified:** Payment card data (PCI-DSS scope)

**Data Flow:**
```
User Browser --> Checkout API --> Payment Gateway --> Bank
```

**STRIDE Analysis for Checkout API:**
- **Spoofing:** Can attacker submit orders as another user? Check: Session validation, CSRF protection
- **Tampering:** Can order amounts be modified? Check: Server-side price validation, request signing
- **Repudiation:** Can users deny placing orders? Check: Audit logging, transaction receipts
- **Info Disclosure:** Can card data leak? Check: TLS enforcement, no logging of card numbers
- **DoS:** Can checkout be overwhelmed? Check: Rate limiting, queue management
- **EoP:** Can users access admin checkout functions? Check: Role-based access control

## What NOT to Do
- Do not limit analysis to only technical threats; include business logic and process vulnerabilities
- Do not skip trust boundary analysis; most critical vulnerabilities occur at boundaries
- Do not assign arbitrary risk scores without consistent criteria across the team
- Do not create a threat model once and never update it; systems evolve and so do threats
- Do not focus only on external attackers; consider insider threats and supply chain risks
- Do not ignore "unlikely" threats with catastrophic impact
- Do not document threats without actionable mitigations and clear ownership
- Do not conduct threat modeling in isolation; involve developers, architects, and operations

## Implementation Notes

### Techniques Used
- **STRIDE Framework:** Provides comprehensive coverage of threat categories, ensuring systematic analysis
- **DREAD Scoring:** Enables consistent risk prioritization across different threat types
- **Structured Output Tables:** Facilitates tracking, reporting, and integration with ticketing systems
- **Phased Approach:** Breaks complex analysis into manageable steps for team collaboration

### Why These Choices
- STRIDE is widely adopted and understood, reducing training overhead
- DREAD provides quantifiable metrics for executive reporting and prioritization
- Tabular format integrates easily with JIRA, Azure DevOps, and security tools
- Phased approach allows incremental progress and early stakeholder feedback

### Expected Outcomes
- Comprehensive threat register with prioritized risks
- Clear mapping between threats and mitigations
- Actionable security requirements for development teams
- Audit-ready documentation for compliance frameworks
- Foundation for security test case development
