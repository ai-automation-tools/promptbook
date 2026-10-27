---
title: "📌 Incident Response Playbook Generator"
tags:
- collections
- it
- incident
- response
- playbook
- prompt
category: Collections
subcategory: IT
---
# Incident Response Playbook Generator

## Instructions:
Provide the following details about the incident to generate a tailored Incident Response Playbook.

**Incident Details:**
* **Incident Type:** (e.g., Outage, Security Incident, Data Breach, Performance Degradation)
* **Severity Level:** (e.g., SEV-1, SEV-2, SEV-3)
* **Service(s) Affected:** (e.g., API, Web App, Database)
* **Brief Description of the Incident:**

---

## Generated Playbook:

### 1. Triage & Initial Assessment

**Objective:** Quickly assess the situation, understand the impact, and gather critical information.

**Steps:**
1.  **Acknowledge the alert:**
    *   [ ] Assign yourself to the incident ticket.
    *   [ ] Notify the team in the `#incidents` channel.
2.  **Validate the incident:**
    *   [ ] Check monitoring dashboards for the affected service(s).
    *   [ ] Review recent deployments and changes.
    *   [ ] Escalate to the on-call engineer if the impact is unclear.
3.  **Determine the severity:**
    *   [ ] Use the severity matrix to confirm the SEV level.
    *   [ ] Update the incident ticket with the correct severity.

### 2. Communications

**Objective:** Keep internal stakeholders and external customers informed.

**Internal Comms (Team & Leadership):**
*   **Initial Notification:**
    *   **Who:** All Engineers, Product Managers, and Leadership.
    *   **What:** "Investigating reports of [Incident Type] affecting [Service(s)]. Severity is currently [Severity Level]."
    *   **Where:** `#incidents` Slack channel.
*   **Regular Updates (every 30 mins for SEV-1, 60 mins for SEV-2):**
    *   **What:** "Update: [Summary of what's known]. Next steps: [Action plan]."

**External Comms (Customers):**
*   **Status Page Update:**
    *   [ ] Update `status.ax.com` with an "Investigating" notice.
    *   [ ] Post regular, non-technical updates as more information is available.

### 3. Remediation

**Objective:** Contain the incident and restore service.

**Steps:**
1.  **Formulate a hypothesis:**
    *   Based on the triage, what is the likely cause?
2.  **Develop a remediation plan:**
    *   What is the safest and fastest way to restore service? (e.g., rollback deployment, failover database)
3.  **Execute the plan:**
    *   [ ] Announce the intended action in the `#incidents` channel.
    *   [ ] Execute the remediation steps.
    *   [ ] Verify that service is restored.

### 4. Postmortem & Follow-up

**Objective:** Learn from the incident and prevent recurrence.

**Steps:**
1.  **Schedule a postmortem meeting:**
    *   Invite all involved parties.
2.  **Create a postmortem document:**
    *   **Timeline:** Detailed, timestamped log of events.
    *   **Root Cause Analysis:** What was the underlying cause?
    *   **Action Items:** What will be done to prevent this from happening again?
3.  **Track action items to completion.**