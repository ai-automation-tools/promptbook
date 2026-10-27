---
title: "📌 Dependency Audit"
tags: ["dependencies", "audit", "security", "maintenance", "versions"]
category: "Architecture_and_Design"
subcategory: "Dependency_Management"
---

Audit project dependencies for outdated packages, vulnerabilities, and bloat.

## Prompt

```
Audit this project dependencies. For each major dependency: current version, latest version, any known vulnerabilities, whether it is actively maintained, and whether it could be replaced with something simpler or built-in. Flag anything that needs immediate attention.
```

## Usage Notes

- Covers both security and maintenance concerns in one pass
- "Could it be replaced" surfaces unnecessary complexity
- Flags critical issues separately from nice-to-have updates
- Good to run before major releases or security reviews
