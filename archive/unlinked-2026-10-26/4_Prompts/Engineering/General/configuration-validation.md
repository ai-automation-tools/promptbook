---
title: "📌 Configuration Validation Script Generation"
tags: ["collections", "engineering", "configuration", "validation", "prompt"]
category: "Collections"
subcategory: "Engineering"
---
# Configuration Validation Script Generation (Based on Schema-Driven and Policy-as-Code Principles)

**Prompt:**
"Generate a comprehensive configuration validation script for [Configuration File Type: YAML/JSON/TOML/INI/ENV] targeting [Technology/Platform: Kubernetes, Docker, Terraform, Ansible, Application Config, etc.].
Include:
1. Schema validation with type checking, required fields, and allowed values constraints.
2. Cross-reference validation for dependent configuration values (e.g., if feature X is enabled, setting Y must be defined).
3. Environment-specific validation rules (dev/staging/prod) with appropriate strictness levels.
4. Security checks for sensitive data exposure (hardcoded secrets, insecure defaults, overly permissive settings).
5. Best practice enforcement aligned with [Relevant Standard: CIS Benchmarks, 12-Factor App, Cloud Provider Guidelines].
6. Clear, actionable error messages with line numbers, expected vs. actual values, and remediation suggestions.
7. Exit codes and structured output (JSON/YAML) for CI/CD pipeline integration.

Output as a [Language: Python/Bash/Go/TypeScript] script with:
- CLI interface accepting config file path and validation profile
- Modular rule definitions for easy extension
- Example usage and sample configuration files demonstrating pass/fail scenarios
- Documentation comments explaining each validation rule"

---

## Use Cases

- **Pre-commit hooks**: Validate configuration files before they enter version control
- **CI/CD pipelines**: Gate deployments on configuration correctness
- **Infrastructure as Code**: Validate Terraform, CloudFormation, or Pulumi configurations
- **Container orchestration**: Validate Kubernetes manifests, Helm values, Docker Compose files
- **Application configuration**: Validate environment variables and config files before application startup

## Example Invocation

```
# Basic validation
python validate_config.py --config app-config.yaml --profile production

# With structured output for CI
python validate_config.py --config k8s-deployment.yaml --profile security --output json

# Multi-file validation
python validate_config.py --config-dir ./configs/ --recursive --fail-fast
```

## Expected Validation Categories

| Category | Examples |
|----------|----------|
| Schema | Missing required fields, type mismatches, invalid enums |
| Security | Exposed secrets, insecure protocols, permissive RBAC |
| Dependencies | Missing referenced resources, circular dependencies |
| Best Practices | Deprecated fields, suboptimal settings, missing labels |
| Environment | Production-inappropriate values, missing env-specific configs |