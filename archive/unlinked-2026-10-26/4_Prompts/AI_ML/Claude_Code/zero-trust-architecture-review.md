---
title: "📌 Zero Trust Architecture Review"
tags: ["zero-trust", "security", "architecture", "iam", "least-privilege"]
category: "Security_and_IAM"
subcategory: "Zero_Trust"
---

Review a system against Zero Trust principles and produce a gap analysis.

## Prompt

```
Review [SYSTEM] against Zero Trust principles:
1) Never trust, always verify — are all requests authenticated?
2) Least privilege — are permissions minimal?
3) Assume breach — is lateral movement limited?
4) Verify explicitly — is context (device, location, behavior) considered?

Produce a gap analysis.
```

## Usage Notes

- Replace `[SYSTEM]` with your architecture, service mesh, or network design
- Each Zero Trust pillar is evaluated separately for clear gap identification
- Gap analysis output maps to remediation priorities
- Particularly useful for IAM-heavy or microservices architectures
