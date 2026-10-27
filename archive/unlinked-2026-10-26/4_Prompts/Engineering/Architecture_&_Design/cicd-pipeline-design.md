---
title: "📌 Ci/cd Pipeline Design"
tags: ["collections", "engineering", "cicd", "pipeline", "design"]
category: "Collections"
subcategory: "Engineering"
---
# CI/CD Pipeline Design Prompt

## Goal
To generate a comprehensive and secure CI/CD pipeline design for a given software project, covering all stages from code commit to production deployment.

## Inputs
- **Project Name:** The name of the project.
- **Project Type:** (e.g., Web Application, Mobile App, Microservice, Library)
- **Source Code Repository URL:** (e.g., GitHub, GitLab, Bitbucket)
- **Primary Programming Language(s) & Framework(s):** (e.g., Python/Django, TypeScript/React, Java/Spring)
- **Target Deployment Environment(s):** (e.g., AWS, Azure, GCP, On-premises, Kubernetes)
- **Key Pipeline Requirements:** (e.g., Static analysis, dynamic analysis, performance testing, manual approval gates)
- **Team Size & Experience Level:** (e.g., Small team of experienced developers, large distributed team)

## Instructions
Generate a detailed CI/CD pipeline design that includes the following stages and considerations:

1.  **Source Control & Branching Strategy:**
    *   Recommend a branching strategy (e.g., GitFlow, GitHub Flow, Trunk-Based Development).
    *   Define commit message conventions.

2.  **Continuous Integration (CI) Stage:**
    *   **Build:** Describe the build process, including dependency installation and compilation.
    *   **Static Analysis:** Include tools for linting, code style checking, and static application security testing (SAST).
    *   **Unit & Integration Testing:** Specify the testing frameworks and coverage goals.
    *   **Artifact Management:** Detail how build artifacts (e.g., Docker images, packages) are versioned and stored.

3.  **Continuous Delivery (CD) Stage:**
    *   **Deployment Environments:** Define the sequence of environments (e.g., Development, Staging, Production).
    *   **Deployment Strategy:** Recommend a deployment strategy (e.g., Blue/Green, Canary, Rolling).
    *   **Infrastructure as Code (IaC):** Specify tools for provisioning and managing infrastructure (e.g., Terraform, CloudFormation).
    *   **Configuration Management:** Describe how environment-specific configurations are managed.

4.  **Security & Compliance:**
    *   Integrate security scanning at each stage (e.g., dependency scanning, container scanning, DAST).
    *   Include compliance checks and audit trails.
    *   Describe how secrets are managed (e.g., Vault, AWS Secrets Manager).

5.  **Monitoring & Observability:**
    *   Integrate tools for monitoring pipeline status and performance.
    *   Define key metrics and alerting rules.

6.  **Tooling Recommendations:**
    *   Suggest specific CI/CD tools (e.g., Jenkins, GitLab CI, GitHub Actions, CircleCI).
    *   List recommended tools for each pipeline stage.

## Output Format
The output should be a well-structured Markdown document with the following sections:

1.  **Executive Summary:** A brief overview of the proposed pipeline.
2.  **Pipeline Architecture Diagram:** A high-level visual representation of the pipeline.
3.  **Detailed Pipeline Stages:**
    *   Source Control
    *   Continuous Integration
    *   Continuous Delivery
    *   Security & Compliance
    *   Monitoring & Observability
4.  **Toolchain:** A table of recommended tools.
5.  **Implementation Roadmap:** A high-level plan for implementing the pipeline.

## Examples

### Example 1: Web Application on AWS

**Inputs:**
- **Project Name:** E-commerce Frontend
- **Project Type:** Web Application
- **Source Code Repository URL:** `https://github.com/my-org/ecommerce-frontend`
- **Primary Programming Language(s) & Framework(s):** TypeScript/React
- **Target Deployment Environment(s):** AWS (S3, CloudFront, Lambda)
- **Key Pipeline Requirements:** SAST, DAST, manual approval for production
- **Team Size & Experience Level:** 10 developers, mixed experience

### Example 2: Microservice on Kubernetes

**Inputs:**
- **Project Name:** User Authentication Service
- **Project Type:** Microservice
- **Source Code Repository URL:** `https://gitlab.com/my-org/auth-service`
- **Primary Programming Language(s) & Framework(s):** Go
- **Target Deployment Environment(s):** GKE (Google Kubernetes Engine)
- **Key Pipeline Requirements:** High test coverage, Canary deployments
- **Team Size & Experience Level:** 5 experienced developers

## What Not to Do
-   Do not provide overly generic recommendations without justification.
-   Do not ignore the specific project requirements and constraints.
-   Do not recommend tools without considering the team's experience level.
-   Do not forget to include security and monitoring at every stage of the pipeline.