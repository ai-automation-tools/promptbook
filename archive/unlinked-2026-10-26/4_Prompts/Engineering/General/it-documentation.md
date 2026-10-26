---
title: "📌 IT Team Technical Documentation Prompt Library"
tags: ["collections", "engineering", "documentation"]
category: "Collections"
subcategory: "Engineering"
---
# IT Team Technical Documentation Prompt Library

A collection of ready-to-use prompts for generating high-quality, structured technical documentation for an IT/software development team.  
These can be used with AI tools (e.g. Grok, ChatGPT, Claude, etc.) to create architecture overviews, standards, guides, templates, and procedures.

Last updated: February 2025  
Number of prompts: 30

## General Guidelines for Using These Prompts
- Add your company/project name where appropriate (e.g., "our company", "Project X").
- Specify technologies if relevant (e.g., "using React and TypeScript", "on AWS").
- Request specific formats when needed: "Use Markdown with headings, tables, and code blocks", "Include example diagrams in Mermaid syntax".

## Architecture & Design Prompts

1. Write a comprehensive overview of the system architecture for our IT projects, including high-level diagrams (use Mermaid syntax), key components, data flows, integration points between services, and major technology choices.

2. Create a detailed guide on network architecture standards, covering topology designs, firewall configurations, VPN setups, segmentation, zero-trust principles, and best practices for scalability, high availability, and security.

3. Develop a technical document explaining our data architecture principles, including database schemas, data modeling techniques (relational vs. NoSQL), ETL/ELT processes, data lakes/warehouses, master data management, and data governance policies.

4. Write a complete microservices architecture overview document, including service boundaries, communication patterns (REST, gRPC, messaging), service discovery, API gateway usage, saga/choreography patterns, and decomposition strategies.

5. Create guidelines for cloud infrastructure architecture (AWS/Azure/GCP), covering multi-account strategy, landing zone setup, networking (VPCs, subnets), identity management, IaC tools (Terraform/CloudFormation), and cost governance.

## Coding & Development Standards Prompts

6. Outline coding standards for Python development in our team, including style guidelines (PEP 8 / Black), naming conventions, docstrings, error handling, type hints, modular organization, and testing expectations.

7. Produce coding standards for JavaScript/TypeScript (frontend/backend), covering ESLint/Prettier rules, naming conventions, component structure, hooks usage, state management patterns, and folder organization.

8. Write detailed code review guidelines, including mandatory checklists, tools (GitHub PRs, GitLab MRs), review turnaround time, severity levels, approval rules, and best practices for giving/receiving feedback.

9. Create a Git version control and branching strategy guide, covering GitFlow / GitHub Flow / Trunk-Based Development, commit message conventions, branch naming, rebase vs. merge, and handling of hotfixes.

10. Develop API design and documentation standards, including RESTful principles, resource naming, HTTP methods/ status codes, versioning strategies, OpenAPI/Swagger usage, pagination, filtering, and authentication patterns.

## Software Development Lifecycle (SDLC) Prompts

11. Describe the full software development lifecycle (SDLC) used by our IT team, covering phases from ideation → requirements → design → implementation → testing → deployment → operations → decommissioning, including roles, key deliverables, and tools per phase.

12. Create a detailed template and guide for writing software requirements specifications (SRS), including functional and non-functional requirements, user stories, acceptance criteria, prioritization frameworks (MoSCoW, WSJF), and stakeholder sign-off process.

13. Write a software design document (SDD) template, including sections for purpose, scope, high-level design, detailed component design, data models, interface definitions, sequence diagrams, and design decision records (ADR).

14. Develop a comprehensive testing strategy document, covering unit, integration, contract, component, end-to-end, performance, security, and accessibility testing; include recommended frameworks, coverage targets, and automation expectations.

15. Create deployment and release management procedures, detailing environments (dev/test/staging/prod), CI/CD pipeline structure, blue-green/canary/rolling strategies, feature flags, rollback plans, and post-deployment verification.

## Operations & Reliability Prompts

16. Outline standards for application monitoring, observability, and alerting, including metrics (RED/USE), logs (structured JSON), traces (OpenTelemetry), tools (Prometheus/Grafana/ELK/New Relic/Datadog), SLO/SLI definitions, and on-call escalation.

17. Write a production incident management and post-mortem process guide, including severity levels, incident declaration, communication channels, blameless post-mortem template, action item tracking, and lessons-learned integration.

18. Develop a disaster recovery and business continuity plan, covering RTO/RPO targets, backup strategies, failover/failback procedures, DR testing cadence, and recovery playbooks for critical systems.

19. Create backup and data recovery procedures, detailing backup types (full/incremental), retention policies, storage locations (on-prem/cloud), encryption, testing frequency, and restore validation steps.

20. Write performance engineering guidelines, including profiling tools, load testing methodology (k6/Locust/JMeter), caching strategies, database optimization, front-end optimization, and performance budget enforcement.

## Security, Compliance & Quality Prompts

21. Produce a software security policy and secure development lifecycle (SDL) document, covering threat modeling, secure coding practices, dependency scanning, SAST/DAST, secrets management, OWASP Top 10 mitigation, and penetration testing requirements.

22. Create accessibility development standards based on WCAG 2.1/2.2 AA level, including semantic HTML, ARIA usage, keyboard navigation, color contrast, screen reader testing, and automated/manual validation tools.

23. Develop internationalization (i18n) and localization (l10n) guidelines, covering string externalization, pluralization, date/number/currency formatting, RTL support, build pipeline integration, and translation management tools.

24. Outline dependency and supply chain security standards, including approved sources, automated vulnerability scanning (Dependabot/Snyk), pinning versions, SBOM generation, and processes for handling security advisories.

## Team & Process Prompts

25. Write a developer onboarding guide and checklist, including laptop setup, tool installation, account provisioning, first-week tasks, code base tour, key documentation links, and 30/60/90-day milestones.

26. Create team workflow and communication standards, covering tools (Jira/Confluence/Slack/Teams), daily standup/retrospective formats, ticket lifecycle, definition of done, and documentation update responsibilities.

27. Develop an Agile/Scrum process guide tailored to our team, including sprint length, ceremonies, backlog refinement, estimation (story points), velocity tracking, and continuous improvement practices.

28. Write a legacy system maintenance and modernization strategy document, covering code audits, technical debt tracking, strangler fig pattern, incremental migration approaches, and risk-based prioritization.

29. Create a knowledge management and documentation lifecycle guide, including where/how to store docs (Confluence/Git repo/Wiki), when to update docs, ownership rules, review cadence, and deprecation process.

30. Outline containerization and orchestration standards using Docker and Kubernetes, covering Dockerfile best practices, multi-stage builds, Helm charts, pod security policies, resource requests/limits, and deployment patterns.

## Bonus / Specialized Prompts

- Write DevSecOps integration guidelines, explaining how security, compliance, and quality checks are embedded into the CI/CD pipeline.
- Create a template for Architecture Decision Records (ADR), including context, decision, consequences, and status fields.

Feel free to copy-paste individual prompts or modify them to fit your team's specific stack and processes.