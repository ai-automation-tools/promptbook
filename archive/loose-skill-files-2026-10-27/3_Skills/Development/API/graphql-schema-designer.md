---
title: "🔧 GraphQL Schema Designer"
tags: ["skill", "development", "api", "graphql"]
category: "Skills"
subcategory: "API"
name: graphql-schema-designer
description: "Designs robust GraphQL schemas with proper types, queries, and mutations. Use when: (1) starting a new graph, (2) adding features. NOT for: REST APIs."
---

# GraphQL Schema Designer

Helps build and validate GraphQL schemas following best practices.

## Prerequisites
- **Required Tool/Service:** Node.js (for validation scripts if used)

## Usage

### Basic Usage
```bash
openclaw run graphql-schema-designer --entities "User, Post, Comment"
```

**What it does:**
1. Generates types
2. Creates relationships
3. Defines root Query and Mutation types

## Configuration
### Required Configuration
No special configuration required.

## Examples

### Example 1: Blog Schema
**Context:** Need a schema for a blog
**Task:** Generate schema
**Commands:**
```bash
openclaw run graphql-schema-designer --description "A blog with Authors and Posts"
```
**Output:**
```graphql
type Author {
  id: ID!
  name: String!
  posts: [Post!]!
}
type Post {
  id: ID!
  title: String!
  content: String!
  author: Author!
}
```

## Best Practices
### Do's ✅
- Use pagination (e.g., Connections) for lists
- Use input types for mutations
### Don'ts ❌
- Return overly deep nested structures by default
