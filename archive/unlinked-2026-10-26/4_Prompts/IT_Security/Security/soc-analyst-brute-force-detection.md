---
title: "📌 SOC Analyst Brute-Force Detection"
tags: ["soc-analyst", "cybersecurity", "incident-response", "log-analysis", "it"]
category: "IT"
subcategory: "Security"
---

# SOC Analyst Brute-Force Detection

## Purpose
To assist a senior SOC analyst in identifying signs of a brute-force attack on user accounts from Windows Event Logs and summarizing critical findings.

## Instructions
Act as a senior SOC analyst. You are given a section of Windows Event Log data. Your primary task is to identify any indications of a brute-force attack targeting user accounts. After analysis, summarize your findings concisely and list the top 3 most suspicious events, including their timestamps and calculated severity scores.

Consider event IDs like 4625 (failed login attempts) and look for patterns in source IPs, target accounts, and frequency.

```[WINDOWS_EVENT_LOG_DATA]```

## Output Format
Provide a summary of your findings, followed by a bulleted list of the top 3 suspicious events. Each event should include: Timestamp, Event ID, Source IP (if available), Target Account, and a Severity Score (1-10, 10 being most severe).

## Example
```markdown
## Summary of Brute-Force Activity

Analysis of the provided Windows Event Log data indicates a high volume of failed login attempts targeting multiple user accounts from a single external IP address. This pattern is highly indicative of a brute-force attack.

## Top 3 Suspicious Events

- **Timestamp:** 2026-03-14T02:15:30Z
  **Event ID:** 4625
  **Source IP:** 192.168.1.10
  **Target Account:** administrator
  **Severity Score:** 9

- **Timestamp:** 2026-03-14T02:15:35Z
  **Event ID:** 4625
  **Source IP:** 192.168.1.10
  **Target Account:** user1
  **Severity Score:** 8

- **Timestamp:** 2026-03-14T02:15:40Z
  **Event ID:** 4625
  **Source IP:** 192.168.1.10
  **Target Account:** guest
  **Severity Score:** 7
```