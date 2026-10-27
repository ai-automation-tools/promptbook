---
title: "🔧 Regex Generator"
tags: ["skill", "regex", "parsing", "development"]
category: "Skills"
subcategory: "Development"
name: regex-generator
description: "Creates, explains, and optimizes Regular Expressions based on plain English requirements. Use when: (1) validating input formats, (2) extracting specific patterns from text, (3) performing complex search and replace operations. NOT for: parsing HTML/XML (use a dedicated parser)."
---

# Regex Generator

This skill translates human-readable pattern descriptions into accurate Regular Expressions (Regex). It supports multiple regex flavors (PCRE, JavaScript, Python, Go) and provides detailed explanations of how the generated pattern works.

## Prerequisites

- None. This is a standalone logic skill.

## Usage

### Basic Usage

Describe the text pattern you want to match.

```bash
regex-generator "Match a standard US phone number, with or without area code, allowing dashes or spaces"
```

**What it does:**
1. Analyzes the text requirements and edge cases.
2. Generates the appropriate regular expression.
3. Provides a breakdown of the regex components.

### Common Workflows

#### Workflow 1: Input Validation

Generating regex for form validation.

**Steps:**
1. Request validation regex with constraints.
   ```bash
   regex-generator "Validate a password: minimum 8 chars, at least one uppercase, one lowercase, and one number" --flavor javascript
   ```

**Expected Outcome:**
```javascript
// Regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
```
*(Along with a detailed explanation of the positive lookaheads used)*

#### Workflow 2: Pattern Extraction

Generating regex to pull specific data out of a larger string.

**Steps:**
1. Describe the surrounding text and the data to capture.
   ```bash
   regex-generator "Extract the invoice number that comes after 'INV-' and contains 6 digits. Put the digits in a capture group."
   ```

## Configuration

### Optional Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `flavor` | `pcre` | Target regex engine (pcre, javascript, python, java, golang) |
| `flags` | `g` | Default flags to append (e.g., g, i, m) |

## Examples

### Example 1: Email Validation

**Context:** Need a robust but not overly complex email validator.

**Task:** Match standard email formats.

**Commands:**
```bash
regex-generator "Match standard email addresses"
```

**Output:**
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

Explanation:
^                  : Start of string
[a-zA-Z0-9._%+-]+  : One or more characters allowed in the local part
@                  : Literal '@' symbol
[a-zA-Z0-9.-]+     : One or more characters allowed in the domain name
\.                 : Literal '.' symbol
[a-zA-Z]{2,}       : Top-level domain, at least 2 letters
$                  : End of string
```

## Troubleshooting

### Common Issues

#### Issue 1: Catastrophic Backtracking

**Symptoms:**
- The regex takes an extremely long time to evaluate on certain failing inputs.

**Cause:**
Nested quantifiers or overlapping alternations (e.g., `(a+)+$`).

**Solution:**
Request optimization:
```bash
regex-generator --optimize "[Your problematic regex]"
```

## Best Practices

### Do's ✅

- Use non-capturing groups `(?:...)` when you need grouping but don't need to extract the matched text.
- Be mindful of boundaries (`^`, `$`, `\b`) to prevent partial matches.

### Don'ts ❌

- Don't use regex to parse non-regular languages like HTML or nested JSON.
- Avoid overly complex, unreadable "clever" regex when simple string manipulation would suffice.
