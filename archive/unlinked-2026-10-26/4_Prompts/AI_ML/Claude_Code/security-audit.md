---
title: "📌 Security Audit"
tags: ["security", "audit", "vulnerabilities", "injection", "owasp"]
category: "Security_and_IAM"
subcategory: "Security_Audits"
---

Audit code for common security vulnerabilities with severity ratings.

## Prompt

```
Audit [FILE/MODULE/ENDPOINT] for security issues. Check for: injection vulnerabilities, authentication/authorization bypasses, sensitive data exposure, insecure defaults, and input validation gaps. For each issue found: severity (Critical/High/Medium/Low), description, and remediation.
```

## Usage Notes

- Replace `[FILE/MODULE/ENDPOINT]` with what to audit
- Covers OWASP Top 10 categories broadly
- Each finding includes severity to enable prioritization
- Remediation steps are specific, not generic advice
