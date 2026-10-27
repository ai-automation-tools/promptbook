---
title: "🔧 GraphQL Query Builder"
tags: ["skill", "api", "graphql", "development"]
category: "Skills"
subcategory: "Development"
name: graphql-query-builder
description: "Generates syntactically correct GraphQL queries, mutations, and fragments based on natural language descriptions or schema definitions. Use when: (1) interacting with a GraphQL API, (2) you need to fetch specific nested data, (3) creating GraphQL variables. NOT for: REST API requests."
---

# GraphQL Query Builder

This skill assists agents and users in constructing accurate and efficient GraphQL operations. It can interpret schema definitions (SDL) and natural language requirements to build complex queries with proper nesting, arguments, and variable declarations.

## Prerequisites

- **Required Tool/Service:** GraphQL endpoint or local schema file (optional but recommended for accuracy)

### Setup Instructions

1. Ensure you have the target GraphQL endpoint URL or schema `.graphql` file available.
2. Identify the specific data fields you need to fetch or modify.

## Usage

### Basic Usage

Provide a description of the data you want to retrieve and (optionally) the schema context.

```bash
graphql-query-builder "Fetch the user's name, email, and their last 5 posts including title and date"
```

**What it does:**
1. Parses the natural language request.
2. Constructs the GraphQL `query` syntax.
3. Formats the output with standard indentation.

### Common Workflows

#### Workflow 1: Generating a Query with Variables

When you need a reusable query that accepts dynamic inputs.

**Steps:**
1. Provide the request specifying the dynamic parts.
   ```bash
   graphql-query-builder "Get a product by ID (make it a variable) and return its price and stock status"
   ```

**Expected Outcome:**
```graphql
query GetProduct($productId: ID!) {
  product(id: $productId) {
    price
    inStock
  }
}
```

#### Workflow 2: Generating a Mutation

When you need to create or update data.

**Steps:**
1. Describe the action and the data to be returned.
   ```bash
   graphql-query-builder "Mutation to create a new comment on a post (post ID and text as variables), return the new comment's ID"
   ```

## Configuration

### Optional Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `include_typename` | `false` | Automatically include `__typename` in selections |
| `format` | `pretty` | Output format (pretty, minified) |

## Examples

### Example 1: Complex Nested Query

**Context:** Fetching dashboard data for a user.

**Task:** Get user profile, their settings, and a paginated list of their recent activity.

**Commands:**
```bash
graphql-query-builder "Query for user profile (name, avatar), settings (theme, notifications), and the first 10 activities (action, timestamp) for user ID '123'"
```

**Output:**
```graphql
query GetUserDashboard($userId: ID! = "123") {
  user(id: $userId) {
    name
    avatarUrl
    settings {
      theme
      notificationsEnabled
    }
    activities(first: 10) {
      edges {
        node {
          action
          timestamp
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

## Best Practices

### Do's ✅

- Use descriptive operation names (e.g., `GetUserProfile` instead of just `query`)
- Use variables instead of hardcoding values into the query string
- Request only the specific fields you need to minimize payload size

### Don'ts ❌

- Don't use deep arbitrary nesting without understanding the performance implications on the server
- Avoid fetching entire objects if only one property is needed
