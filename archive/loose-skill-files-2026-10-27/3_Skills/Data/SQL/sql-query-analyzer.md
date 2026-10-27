---
title: "🔧 SQL Query Analyzer"
tags: ["skill", "sql", "database", "performance"]
category: "Skills"
subcategory: "Data"
name: sql-query-analyzer
description: "Analyzes SQL queries for performance bottlenecks, missing indexes, and anti-patterns. Use when: (1) queries are slow, (2) database CPU is high, (3) reviewing PRs with database migrations."
---

# SQL Query Analyzer

Evaluates complex SQL queries, identifies performance issues (like N+1 queries, missing indexes, full table scans), and suggests optimized alternatives.

## Prerequisites

- **Required Tool/Service:** Database specific EXPLAIN plan access
- **Environment:** PostgreSQL, MySQL, or SQL Server

### Setup Instructions

1. Obtain slow query log or specific query
2. Connect to non-production database replica

## Usage

### Basic Usage

Analyze a specific SQL query.

```bash
sql-analyzer explain --query "SELECT * FROM users WHERE status = 'active'"
```

**What it does:**
1. Generates EXPLAIN plan
2. Analyzes execution nodes
3. Suggests indexes or query rewrites

### Common Workflows

#### Workflow 1: Index Optimization

When a query is performing a full table scan.

**Steps:**
1. Analyze query execution
2. Identify missing indexes
3. Generate CREATE INDEX statement

## Best Practices

### Do's ✅

- Select only needed columns (avoid SELECT *)
- Use JOINs appropriately instead of subqueries
- Add indexes on frequently filtered columns

### Don'ts ❌

- Use functions on indexed columns in WHERE clauses (prevents index usage)
- Perform implicit type conversions

## Security & Safety

### Safety Considerations

⚠️ **Important Warnings:**
- Never run EXPLAIN ANALYZE on destructive queries (INSERT/UPDATE/DELETE) in production without understanding side effects.
