# REST API Designer

Skill for designing scalable, resource-oriented RESTful APIs.

## Prerequisites
- Deep understanding of HTTP methods (GET, POST, PUT, PATCH, DELETE).
- Knowledge of standard HTTP status codes.

## Usage
Provide the core entities of your system, and the skill will generate a comprehensive REST API specification, detailing endpoints, payloads, and response codes.

## Configuration
None needed.

## Examples
User: "Design a REST API for an e-commerce shopping cart."
Response: (Generates endpoints like `POST /carts`, `GET /carts/{id}`, `POST /carts/{id}/items`, including JSON request/response bodies).

## Advanced Usage
Automatically suggests hypermedia links (HATEOAS), rate limiting strategies, and standard error response formats.

## Integration
Outputs can be directly converted into OpenAPI (Swagger) 3.0 YAML specifications.

## Troubleshooting
If the generated API feels RPC-like, explicitly prompt the skill to "use a resource-oriented architecture."

## Best Practices
- Use plural nouns for resource names.
- Keep URLs clean and hierarchical.

## Performance Considerations
Recommends pagination parameters (`limit`, `offset`) for endpoints returning collections.

## Security & Safety

### Permissions Required
None.

### Safety Considerations
Ensure sensitive data is not exposed in URL parameters.

### Data Handling
Provides secure schemas for authentication endpoints (OAuth2).

## API Reference
N/A

## File Structure
Generates structured Markdown or YAML.

## References
- REST API Design Rulebook

## Changelog
- 1.0.0 - Initial release.

## Contributing
Submit issues for specific edge-case design patterns.

## License
MIT
