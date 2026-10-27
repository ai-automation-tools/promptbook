# gRPC Service Designer

Skill for defining high-performance microservice communication interfaces using gRPC and Protocol Buffers (protobuf).

## Prerequisites
- Understanding of RPC concepts.
- Basic knowledge of protobuf syntax.

## Usage
Define the services and methods required for inter-service communication, and the skill generates the `.proto` files.

## Configuration
None needed.

## Examples
User: "Design a gRPC service for an email notification sender."
Response: (Outputs `syntax = "proto3";`, `service NotificationService { rpc SendEmail (EmailRequest) returns (EmailResponse); }`, and message definitions).

## Advanced Usage
Implements server-side, client-side, and bidirectional streaming RPC methods.

## Integration
The generated `.proto` files can be compiled using `protoc` for various languages (Go, Java, Python, C++).

## Troubleshooting
Ensure that field numbers are unique and correctly assigned. The skill will flag numbering conflicts.

## Best Practices
- Never reuse a field number.
- Use appropriate protobuf scalar types.

## Performance Considerations
gRPC inherently uses HTTP/2 and binary serialization, ensuring low latency.

## Security & Safety

### Permissions Required
None.

### Safety Considerations
Ensure SSL/TLS is mentioned for production deployments.

### Data Handling
Data serialization is handled securely via protobuf.

## API Reference
N/A

## File Structure
Outputs raw Protocol Buffers (`.proto`) format.

## References
- gRPC Documentation

## Changelog
- 1.0.0 - Initial commit.

## Contributing
Contributions welcome for adding custom protobuf options.

## License
MIT
