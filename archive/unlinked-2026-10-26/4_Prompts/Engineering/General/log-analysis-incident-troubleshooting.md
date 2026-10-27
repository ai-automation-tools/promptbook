---
title: "📌 Log Analysis For Incident Troubleshooting"
tags: ["collections", "engineering", "analysis", "incident", "troubleshooting"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt: Log Analysis for Incident Troubleshooting

## 1. Goal
This prompt analyzes a provided log snippet to identify the root cause of a technical incident, correlate events, and recommend mitigation steps. It is designed for use by SREs, DevOps engineers, and developers during active incident response.

## 2. Inputs
- `log_snippet`: A multiline string containing raw log data from the time of the incident.
- `incident_description`: A brief, plain-text description of the incident's symptoms (e.g., "502 errors on the checkout service," "Users reporting slow page loads").
- `services_involved`: A comma-separated list of potentially affected services or components.
- `time_window`: The approximate start and end time of the incident (e.g., "2026-01-08 14:00 UTC to 14:30 UTC").

## 3. Instructions
1.  **Correlate and Summarize:** Analyze the `log_snippet` to identify a sequence of events related to the `incident_description`. Summarize the key error messages, anomalies, and state changes.
2.  **Identify Root Cause:** Based on the correlated events, formulate a hypothesis for the root cause of the incident. Pinpoint the most likely service and specific error.
3.  **Generate Timeline:** Create a chronological timeline of the critical events identified in the logs.
4.  **Recommend Actions:** Suggest immediate mitigation steps to stabilize the system and longer-term fixes to prevent recurrence.

## 4. Output Format
The output must be a well-structured Markdown document with the following sections:

-   **`## 📝 Incident Summary`**: A brief, high-level overview of the incident and its impact.
-   **`## 📉 Event Timeline`**: A chronological list of key events with timestamps.
-   **`## 🔍 Root Cause Analysis`**: A detailed explanation of the identified root cause.
-   **`## 🛠️ Recommended Actions`**:
    -   **`### Immediate Mitigation`**: Steps to take right now.
    -   **`### Long-Term Fixes`**: Recommendations for permanent solutions.

## 5. Examples

### Example 1: Database Connection Failure

-   **`log_snippet`**:
    ```
    2026-01-08T14:10:01Z service=api-gateway level=error msg="downstream request failed" error="dial tcp 10.0.1.15:5432: connect: connection refused"
    2026-01-08T14:10:05Z service=checkout level=info msg="starting checkout process for user_id=123"
    2026-01-08T14:10:06Z service=checkout level=error msg="failed to connect to database" db_host=10.0.1.15
    ```
-   **`incident_description`**: "Users are unable to complete purchases."
-   **`services_involved`**: "api-gateway, checkout, postgres-db"
-   **`time_window`**: "14:00 to 14:30 UTC"

-   **Output**:
    ```markdown
    ## 📝 Incident Summary
    The checkout service is failing due to an inability to connect to its Postgres database, resulting in failed purchases.

    ## 📉 Event Timeline
    - **14:10:01Z**: `api-gateway` reports connection refused to `10.0.1.15:5432`.
    - **14:10:06Z**: `checkout` service fails to connect to the database at `10.0.1.15`.

    ## 🔍 Root Cause Analysis
    The root cause is a database connectivity failure. The `postgres-db` service at `10.0.1.15:5432` is refusing connections, likely because it is down, restarting, or has a network policy blocking access.

    ## 🛠️ Recommended Actions
    ### Immediate Mitigation
    1.  Check the status of the `postgres-db` pod/VM.
    2.  Restart the `postgres-db` service if it is unresponsive.
    3.  Verify network ACLs between the `checkout` service and the database.

    ### Long-Term Fixes
    1.  Implement a database health check endpoint.
    2.  Add connection pooling and retry logic to the `checkout` service.
    ```

## 6. What Not to Do
-   Do not assert a root cause without direct evidence from the logs.
-   Do not provide recommendations that are not specific to the identified issue.
-   Do not include irrelevant log lines in the timeline.
-   Do not guess at the meaning of an error; if unknown, state that more information is needed.