---
title: "📌 Slo/sla Definition"
tags: ["collections", "engineering", "definition", "prompt"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt: SLO/SLA Definition

## Objective
This prompt generates a comprehensive Service Level Objective (SLO) and Service Level Agreement (SLA) definition for a given service.

## Instructions
1.  **Identify the service:** Clearly define the service for which you are creating the SLO/SLA.
2.  **Define the metrics:** Specify the key metrics that will be used to measure the service's performance (e.g., uptime, latency, error rate).
3.  **Set the targets:** Establish the target values for each metric.
4.  **Define the error budget:** Determine the acceptable level of deviation from the target.
5.  **Specify the monitoring signals:** List the signals that will be used to monitor the service's performance.

## Example
**Service:** Agent Runtime
**Metrics:**
*   Uptime
*   Request latency
*   Error rate
**Targets:**
*   Uptime: 99.9%
*   Request latency: < 500ms
*   Error rate: < 0.1%
**Error Budget:** 0.1%
**Monitoring Signals:**
*   Ping checks
*   API response time
*   Server error logs