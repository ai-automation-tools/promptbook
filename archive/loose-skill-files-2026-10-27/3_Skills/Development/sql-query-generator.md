---
title: "🗄️ SQL Query Generator"
tags: ["skill", "sql", "database", "querying"]
category: "Skills"
subcategory: "Development"
name: "sql-query-generator"
description: "Generates complex SQL queries based on natural language descriptions and schema context. Use when: (1) writing complex JOINs, (2) creating analytical queries, (3) optimizing existing queries. NOT for: executing queries directly without review."
---

# SQL Query Generator

This skill empowers the agent to translate natural language requirements into efficient, accurate SQL queries, taking into account the provided database schema.

## Prerequisites

- **Required Context:** The agent must be provided with the relevant database schema (tables, columns, relationships).

## Usage

Provide the schema and describe the data you want to retrieve.

## Configuration

Specify the SQL dialect (e.g., PostgreSQL, MySQL, SQL Server).

## Examples

**User:** Schema: `users (id, name, created_at)`, `orders (id, user_id, amount, date)`. Get the top 5 users by total order amount this month. Dialect: PostgreSQL.

**Agent:**
```sql
SELECT
    u.id,
    u.name,
    SUM(o.amount) AS total_amount
FROM
    users u
JOIN
    orders o ON u.id = o.user_id
WHERE
    DATE_TRUNC('month', o.date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY
    u.id, u.name
ORDER BY
    total_amount DESC
LIMIT 5;
```

## Advanced Usage

Can generate queries involving window functions, CTEs (Common Table Expressions), and complex aggregations.

## Integration

Can be integrated into workflows where an agent analyzes data requirements and generates the necessary SQL for a reporting tool.

## Troubleshooting

- **Issue:** Query syntax error.
- **Solution:** Verify the correct SQL dialect was specified.

## Best Practices

- Always review generated queries before running them in production.
- Provide constraints and indexes in the schema context for better query optimization.

## Performance Considerations

The agent should aim to generate performant queries (e.g., avoiding `SELECT *`, using appropriate JOINs).

## Security & Safety

### Permissions Required
- None for generation. Read-only access if the agent executes the query.

### Safety Considerations
⚠️ **Important Warnings:**
- Never execute generated queries against a production database without manual review.
- Be wary of SQL injection if incorporating user input into the prompt.

### Data Handling
- Does not handle sensitive data directly unless provided in the schema/prompt.

## API Reference
N/A

## File Structure
N/A

## References

### Documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## Changelog

### Version 1.0.0 - 2024-05-15
- Initial release with support for PostgreSQL and MySQL.

## Contributing
Please provide examples of complex schemas and desired queries when contributing improvements.

## License
MIT
