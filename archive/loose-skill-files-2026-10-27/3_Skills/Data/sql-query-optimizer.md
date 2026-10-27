---
title: "🔧 SQL Query Optimizer"
tags: ["sql", "data"]
category: "Skills"
subcategory: "Data"
---

# SQL Query Optimizer

Optimizes slow SQL queries.

## Prerequisites
- Database access

### Setup Instructions
1. Connect to DB.

**Verification:**
```bash
psql --version
```

Expected output:
```
psql (PostgreSQL) 14.0
```

## Usage
### Basic Usage
```bash
EXPLAIN ANALYZE SELECT * FROM users;
```
**What it does:**
1. Shows query plan.

## Configuration
### Optional Configuration
None.

## Examples
### Example 1
**Context:** Slow query.
**Task:** Analyze it.
**Commands:**
```bash
EXPLAIN SELECT 1;
```
**Output:**
```
Plan
```
