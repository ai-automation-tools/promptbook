---
title: "🔧 OpenAPI Spec Generator"
tags: ["skill", "development", "api", "openapi"]
category: "Skills"
subcategory: "API"
name: openapi-spec-generator
description: "Generates OpenAPI 3.0 YAML/JSON specifications from code or descriptions. Use when: (1) documenting new APIs, (2) standardizing endpoints. NOT for: generic code generation."
---

# OpenAPI Spec Generator

Generates standardized OpenAPI specifications from raw endpoint descriptions or code snippets.

## Prerequisites
- **Required Tool/Service:** spectral (Optional for linting)
- **Environment:** Any text editor

## Usage

### Basic Usage
Run the skill with your API description:
```bash
openclaw run openapi-spec-generator --input "GET /users returns list of users"
```

**What it does:**
1. Parses description
2. Identifies paths, methods, and responses
3. Outputs valid OpenAPI YAML

## Configuration
### Required Configuration
No special configuration required.

## Examples

### Example 1: Simple CRUD
**Context:** Need a spec for a simple item API
**Task:** Generate spec
**Commands:**
```bash
openclaw run openapi-spec-generator --input "CRUD for /items with standard responses"
```
**Output:**
Returns a complete YAML spec including GET, POST, PUT, DELETE for `/items`.

## Best Practices
### Do's ✅
- Provide clear request/response body schemas
- Specify required headers
### Don'ts ❌
- Forget authentication schemes
