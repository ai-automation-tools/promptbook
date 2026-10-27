# GraphQL Schema Builder

Skill for constructing efficient, strictly-typed GraphQL schemas.

## Prerequisites
- Understanding of GraphQL Types, Queries, Mutations, and Subscriptions.
- Familiarity with the N+1 query problem.

## Usage
Describe your data model and relationships, and receive a complete GraphQL schema definition language (SDL) file.

## Configuration
None needed.

## Examples
User: "Create a GraphQL schema for a blog with users, posts, and comments."
Response: (Provides `type User`, `type Post`, queries like `getPost(id: ID!)`, and mutations like `createComment`).

## Advanced Usage
Generates custom scalars, interface types, and union types. Suggests Relay-compliant cursor-based pagination.

## Integration
Compatible with Apollo Server and standard GraphQL implementations.

## Troubleshooting
If relationships are missing, clarify the cardinality (1-to-1, 1-to-many) in the prompt.

## Best Practices
- Design the schema based on frontend requirements, not just the database schema.
- Use descriptive, specific mutation names (e.g., `updateUserEmail` instead of `updateUser`).

## Performance Considerations
Highlights potential nested queries that could cause performance bottlenecks.

## Security & Safety

### Permissions Required
None.

### Safety Considerations
Warns about overly deep query nesting which could be exploited.

### Data Handling
N/A

## API Reference
N/A

## File Structure
Outputs raw SDL (`.graphql` format).

## References
- GraphQL Official Documentation

## Changelog
- 1.0.0 - Initial version.

## Contributing
Accepting PRs for specific framework directives.

## License
MIT
