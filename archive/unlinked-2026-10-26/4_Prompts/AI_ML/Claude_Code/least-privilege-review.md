---
title: "📌 Least Privilege Review"
tags: ["iam", "permissions", "least-privilege", "access-control", "zero-trust"]
category: "Security_and_IAM"
subcategory: "IAM_and_Permissions"
---

Ensure all roles and service accounts follow least-privilege access principles.

## Prompt

```
Review the permissions and access controls in [SYSTEM/CONFIG]. For each role or service account: list its current permissions, identify any permissions it has but does not actually need, and propose a tighter permission set. Follow least-privilege principles.
```

## Usage Notes

- Replace `[SYSTEM/CONFIG]` with your IAM config, policy files, or role definitions
- Scope to a specific system or role for focused output
- Output is a permission delta — current vs. recommended
- Useful for cloud IAM, Kubernetes RBAC, database roles, and API key scopes
