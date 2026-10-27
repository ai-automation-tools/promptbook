---
title: "🛠️ TypeScript Interface Generator"
tags: ["skills", "development", "typescript"]
category: "Skills"
subcategory: "Development"
---

# TypeScript Interface Generator

## Description
A skill to generate accurate TypeScript interfaces from raw JSON payloads.

## Prerequisites
- Basic understanding of JSON and TypeScript types.

## Implementation Guidelines

### Step 1: Analyze JSON
Review the JSON payload structure, identifying nested objects and arrays.

### Step 2: Determine Types
Map JSON types to TypeScript (string, number, boolean, null -> standard TS types).

### Step 3: Handle Optionality
Identify fields that might be optional (if multiple JSON samples are provided).

## Code Example

```typescript
// Input JSON:
// { "id": 1, "name": "Alice", "isActive": true, "tags": ["admin"] }

// Output TS:
export interface User {
  id: number;
  name: string;
  isActive: boolean;
  tags: string[];
}
```

## Usage Constraints
- Cannot automatically detect complex unions without multiple examples.

## Verification Steps
1. Run `tsc` to ensure the generated interfaces compile without errors.
