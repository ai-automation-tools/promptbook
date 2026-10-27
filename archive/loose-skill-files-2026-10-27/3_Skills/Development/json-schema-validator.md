---
title: "🔧 JSON Schema Validator"
tags: ["skill", "json", "validation", "development"]
category: "Skills"
subcategory: "Development"
name: json-schema-validator
description: "Generates JSON Schema definitions from example objects or natural language, and validates JSON payloads against schemas. Use when: (1) defining API contracts, (2) validating configuration files, (3) ensuring data integrity in document databases. NOT for: transforming XML or CSV data."
---

# JSON Schema Validator

This skill helps define and enforce data structures using the JSON Schema standard (Draft 7, 2019-09, or 2020-12). It can automatically infer schemas from example JSON payloads or construct strict validation rules based on descriptions.

## Prerequisites

- A valid JSON object or a clear description of the required data structure.

## Usage

### Basic Usage

Generate a schema from an example JSON object.

```bash
json-schema-validator generate '{"id": 1, "name": "Alice", "isActive": true}'
```

**What it does:**
1. Analyzes the provided JSON object.
2. Infers data types (integer, string, boolean).
3. Generates a Draft-7 compliant JSON Schema.

### Common Workflows

#### Workflow 1: Schema Creation with Constraints

When you need to enforce specific rules beyond just data types.

**Steps:**
1. Describe the object and its constraints.
   ```bash
   json-schema-validator create "An object representing a user with a required 'username' (string, min 3 chars), an optional 'age' (integer, min 18), and a required 'role' (enum: admin, user)"
   ```

**Expected Outcome:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "minLength": 3
    },
    "age": {
      "type": "integer",
      "minimum": 18
    },
    "role": {
      "type": "string",
      "enum": ["admin", "user"]
    }
  },
  "required": ["username", "role"]
}
```

#### Workflow 2: Validating a Payload

Checking if a JSON object conforms to a schema.

**Steps:**
1. Provide the schema and the payload.
   ```bash
   json-schema-validator validate --schema ./user-schema.json --payload '{"username": "al", "role": "admin"}'
   ```
*(This would return an error indicating "username" fails the minLength constraint).*

## Configuration

### Optional Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `draft_version` | `draft-07` | JSON Schema draft version to use |
| `strict_mode` | `false` | Automatically add `additionalProperties: false` to all objects |

## Examples

### Example 1: Array Validation

**Context:** Validating a list of tags.

**Task:** Create a schema for an array of unique strings, maximum 5 items.

**Commands:**
```bash
json-schema-validator create "An array of strings, must have unique items, max 5 items"
```

**Output:**
```json
{
  "type": "array",
  "items": {
    "type": "string"
  },
  "uniqueItems": true,
  "maxItems": 5
}
```

## Best Practices

### Do's ✅

- Explicitly define the `"required"` array for properties that must be present.
- Use `additionalProperties: false` when you want to strictly control the exact shape of an object and prevent unknown fields.
- Use `$ref` to reuse common definitions (like an address object) across a large schema.

### Don'ts ❌

- Don't make every property required by default; consider what the application actually needs to function.
- Avoid overly complex nested schemas without using definitions (`$defs`), as it makes the schema hard to read.
