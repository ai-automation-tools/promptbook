---
title: "🕸️ GraphQL Schema Designer"
tags: ["skill", "graphql", "api", "schema"]
category: "Skills"
subcategory: "Development"
name: "graphql-schema-designer"
description: "Designs GraphQL schemas, types, and resolvers based on data models. Use when: (1) starting a new GraphQL API, (2) migrating from REST, (3) optimizing graph structure. NOT for: implementing business logic within resolvers."
---

# GraphQL Schema Designer

This skill allows the agent to design well-structured, scalable GraphQL schemas and define appropriate types, queries, and mutations based on provided data requirements.

## Prerequisites

- **Knowledge:** Understanding of GraphQL concepts (Types, Queries, Mutations, Subscriptions).

## Usage

Provide the data models and the operations needed.

## Configuration

None specific.

## Examples

**User:** Design a GraphQL schema for a blog. We need Users, Posts, and Comments. Users can create posts and leave comments.

**Agent:**
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  comments: [Comment!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  createdAt: String!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
  createdAt: String!
}

type Query {
  getUser(id: ID!): User
  getPost(id: ID!): Post
  getAllPosts: [Post!]!
}

type Mutation {
  createPost(title: String!, content: String!, authorId: ID!): Post!
  createComment(content: String!, postId: ID!, authorId: ID!): Comment!
}
```

## Advanced Usage

Designing interfaces, unions, and custom scalar types.

## Integration

Useful for tools that scaffold GraphQL servers based on schemas (e.g., Apollo Server, Hasura).

## Troubleshooting

- **Issue:** Circular dependencies.
- **Solution:** The agent should ensure types are correctly linked without causing infinite loops during resolution.

## Best Practices

- Design schemas based on client needs, not just mirroring the database.
- Use explicit naming conventions for mutations.

## Performance Considerations

Consider the N+1 problem when designing the schema and suggest appropriate dataloader usage.

## Security & Safety

### Permissions Required
- None.

### Safety Considerations
⚠️ **Important Warnings:**
- Be mindful of deeply nested queries which can cause performance issues (query depth limiting recommended).

### Data Handling
- Does not handle live data.

## API Reference
N/A

## File Structure
N/A

## References

### Documentation
- [GraphQL Documentation](https://graphql.org/learn/)

## Changelog

### Version 1.0.0 - 2024-06-01
- Initial release.

## Contributing
Contributions should focus on adhering to GraphQL best practices and evolving schema design patterns.

## License
MIT
