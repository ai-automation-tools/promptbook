---
title: "🔧 API Security Auditor"
tags: ["skill", "development", "api", "security"]
category: "Skills"
subcategory: "API"
name: api-security-auditor
description: "Audits API specifications for common security flaws. Use when: (1) reviewing new APIs, (2) pre-deployment checks. NOT for: active penetration testing."
---

# API Security Auditor

Statically analyzes API definitions for security best practices like rate limiting, auth, and data exposure.

## Prerequisites
- **Required Tool/Service:** None

## Usage

### Basic Usage
```bash
openclaw run api-security-auditor --spec api.yaml
```

**What it does:**
1. Checks authentication requirements
2. Looks for missing rate limits
3. Validates input constraints

## Configuration
### Required Configuration
No special configuration required.

## Examples

### Example 1: Check Auth
**Context:** Have an OpenAPI spec
**Task:** Audit for security
**Commands:**
```bash
openclaw run api-security-auditor --spec my-api.yaml
```
**Output:**
```
Warning: Endpoint /users/{id} lacks authorization scope definition.
Warning: Global rate limit not defined.
```

## Best Practices
### Do's ✅
- Run this in CI/CD pipelines
- Fix all high severity warnings
### Don'ts ❌
- Rely on this as the only security measure
