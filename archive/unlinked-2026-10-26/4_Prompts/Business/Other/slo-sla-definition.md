---
title: "📌 Service Level Objective (slo) And Service Level Agreement (sla) Definition"
tags: ["collections", "business", "definition", "prompt"]
category: "Collections"
subcategory: "Business"
---
# Prompt: Service Level Objective (SLO) and Service Level Agreement (SLA) Definition

## Objective

To define, establish, and maintain clear, measurable, and actionable Service Level Objectives (SLOs) and Service Level Agreements (SLAs) for our core services and agent runtime. This prompt will guide the process of proposing, negotiating, and implementing these standards to ensure service reliability, performance, and availability.

## Core Concepts

*   **Service Level Indicator (SLI):** A quantitative measure of some aspect of the level of service that is provided.
    *   *Example:* The fraction of successful HTTP requests (request success rate).
*   **Service Level Objective (SLO):** A target value or range of values for an SLI.
    *   *Example:* 99.9% of HTTP requests should be successful.
*   **Service Level Agreement (SLA):** A formal or informal contract with users that includes consequences for failing to meet SLOs.
    *   *Example:* If the success rate is below 99.9% for a certain period, customers are entitled to a service credit.
*   **Error Budget:** The amount of time or number of events that a service is allowed to be down or in an error state without violating its SLO.
    *   *Example:* For a 99.9% SLO, the error budget is 0.1% of the time.

## Prompt Structure

### 1. Service Identification and Scoping

*   **Identify Core Services:** List all critical services and the agent runtime components that require SLOs/SLAs.
*   **Define Service Boundaries:** For each service, clearly define its boundaries, dependencies, and user-facing entry points.
*   **Identify Key Stakeholders:** List the internal and external stakeholders for each service (e.g., product managers, engineering teams, customers).

### 2. SLI Definition

For each identified service, define a set of SLIs that accurately reflect the user's experience. Consider the following categories:

*   **Availability:**
    *   *SLI:* `(successful requests / total requests)`
    *   *Measurement:* Measured at the load balancer or application layer.
*   **Latency:**
    *   *SLI:* `(number of requests faster than X ms / total requests)`
    *   *Measurement:* Measured at the application layer. Define latency buckets (e.g., <100ms, <500ms, <2s).
*   **Quality/Correctness:**
    *   *SLI:* `(number of requests with valid, non-error responses / total requests)`
    *   *Measurement:* Measured by monitoring for specific error codes or response patterns.
*   **Freshness (for data processing pipelines):**
    *   *SLI:* `(time since the last successful data update)`
    *   *Measurement:* Measured by a monitoring job that checks the age of the latest data.
*   **Agent Runtime Specific SLIs:**
    *   **Execution Success Rate:** `(successful agent runs / total agent runs)`
    *   **Task Completion Latency:** `(time to complete a task)`
    *   **Tool Call Success Rate:** `(successful tool calls / total tool calls)`

### 3. SLO Proposal

For each SLI, propose an SLO. The SLO should be:

*   **Achievable:** Based on historical performance data.
*   **Meaningful:** Reflective of user expectations.
*   **Measurable:** Clearly defined and easy to monitor.

**Proposed SLOs:**

| Service | SLI | Proposed SLO | Justification |
| :--- | :--- | :--- | :--- |
| **API Gateway** | Availability | 99.95% | Critical entry point for all services. |
| | Latency (p99) | < 500ms | User-facing requests should be fast. |
| **Agent Runtime** | Execution Success Rate | 99.9% | Core functionality of the agent. |
| | Task Completion Latency (p95) | < 10s | Reflects the user's perception of agent speed. |
| **Data Processing** | Freshness | < 1 hour | Data should be reasonably up-to-date. |

### 4. Error Budget Calculation

Calculate the error budget for each SLO.

*   **Formula:** `(1 - SLO) * (total time in measurement window)`
*   **Example (99.9% SLO over 30 days):** `(1 - 0.999) * 30 * 24 * 60 = 43.2 minutes`

### 5. Monitoring and Alerting Strategy

*   **Tooling:** Specify the monitoring tools to be used (e.g., Prometheus, Grafana, Datadog).
*   **Dashboards:** Design dashboards to visualize SLIs and SLOs in real-time.
*   **Alerting Rules:** Define alerting rules based on the rate of error budget consumption.
    *   *Example:* Alert if more than 5% of the error budget is consumed in the last hour.

### 6. SLA Definition (if applicable)

If an SLA is required, define the following:

*   **Scope:** Which services and SLOs are covered by the SLA.
*   **Consequences:** The penalties for violating the SLA (e.g., service credits, financial penalties).
*   **Exclusions:** Conditions under which the SLA does not apply (e.g., scheduled maintenance, force majeure).

## Review and Approval

*   **Review Process:** The proposed SLOs/SLAs should be reviewed by all stakeholders.
*   **Approval:** Once approved, the SLOs/SLAs should be documented and communicated to all relevant parties.
*   **Iteration:** SLOs/SLAs should be reviewed and updated on a regular basis (e.g., quarterly) to reflect changes in the services and user expectations.