---
title: "📌 Secrets Scanner"
tags: ["security", "secrets", "credentials", "api-keys", "hardcoded"]
category: "Security_and_IAM"
subcategory: "Secrets_Management"
---

Find hardcoded secrets and credentials across the entire codebase.

## Prompt

```
Scan the entire codebase for hardcoded secrets: API keys, passwords, tokens, private keys, connection strings with credentials. Check code, config files, and test files. Report each finding with file path and line. For each, explain how to remediate using environment variables or a secrets manager.
```

## Usage Notes

- Covers code, config, AND test files — tests are often overlooked
- Each finding includes exact location for quick remediation
- Remediation suggests env vars or secrets manager (Vault, AWS Secrets Manager, etc.)
- Run before any repo is made public or shared externally
