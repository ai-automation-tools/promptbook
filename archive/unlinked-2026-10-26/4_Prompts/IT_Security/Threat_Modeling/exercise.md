---
title: "📌 Threat Modeling Exercise"
tags: ["collections", "engineering", "threat", "modeling", "exercise"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt: Threat Modeling Exercise

## Description
This prompt provides a template for conducting a threat modeling exercise for a web application. The exercise helps to identify, analyze, and mitigate potential security threats.

## Template

### 1. Application Description
*   **Application Name:** My Awesome Web App
*   **Description:** A web application that allows users to create and share to-do lists.
*   **Architecture:**
    *   Frontend: React single-page application (SPA).
    *   Backend: Node.js API with a MongoDB database.
    *   Authentication: JWT-based authentication.
    *   Deployment: Docker containers running on AWS ECS.

### 2. Attack Vectors
*   **Network:**
    *   Man-in-the-middle (MITM) attacks.
    *   Denial-of-service (DoS) attacks.
    *   DNS spoofing.
*   **Application:**
    *   Cross-site scripting (XSS).
    *   Cross-site request forgery (CSRF).
    *   SQL injection (or NoSQL injection in this case).
    *   Insecure direct object references (IDOR).
    *   Authentication and authorization bypass.
*   **Host:**
    *   Malware infection.
    *   Privilege escalation.
    *   Insecure configuration.

### 3. Threats
*   **Spoofing:** An attacker could impersonate a legitimate user.
*   **Tampering:** An attacker could modify data in transit or at rest.
*   **Repudiation:** A user could deny performing an action.
*   **Information Disclosure:** Sensitive data could be exposed to unauthorized users.
*   **Denial of Service:** The application could become unavailable to legitimate users.
*   **Elevation of Privilege:** An attacker could gain unauthorized access to privileged functionality.

### 4. Mitigations
*   **Spoofing:**
    *   Implement strong authentication and session management.
    *   Use HTTPS to encrypt all communication.
*   **Tampering:**
    *   Use digital signatures to verify the integrity of data.
    *   Implement input validation and output encoding.
*   **Repudiation:**
    *   Implement comprehensive logging and auditing.
*   **Information Disclosure:**
    *   Encrypt sensitive data at rest and in transit.
    *   Implement proper access controls.
*   **Denial of Service:**
    *   Use a web application firewall (WAF).
    *   Implement rate limiting.
*   **Elevation of Privilege:**
    *   Implement the principle of least privilege.
    *   Regularly patch and update all software.