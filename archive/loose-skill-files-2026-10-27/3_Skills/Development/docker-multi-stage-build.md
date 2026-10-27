---
title: "🔧 Docker Multi-Stage Build"
tags: ["skill", "docker", "development"]
category: "Skills"
subcategory: "Development"
name: "docker-multi-stage"
description: "Skill for multi stage docker builds."
---

# Docker Multi-Stage Build

A skill to convert a standard Dockerfile into a multi-stage build, drastically reducing the final image size.


## Prerequisites
- **Required Tool/Service:** Docker
- **Environment:** Project with a Dockerfile

## Usage
Provide an existing Dockerfile to the skill.

## Configuration
Specify the base images for build and runtime stages.

## Examples
```dockerfile
# Build stage
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

# Final stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

## Advanced Usage
Use specific target stages during build: `docker build --target builder -t my-app-builder .`

## Integration
Crucial for CI/CD pipelines to produce efficient deployment images.

## Troubleshooting
Ensure all necessary runtime dependencies are copied to the final stage.

## Best Practices
Use lightweight images like `alpine` or `scratch` for the final stage.

## Performance Considerations
Increases build complexity but significantly improves download/startup times of the final image.

## Security & Safety
Reduces the attack surface by omitting build tools in the final image.

## API Reference
Standard Dockerfile syntax.

## File Structure
Modifies `Dockerfile`.

## References
[Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

## Changelog
1.0.0 - Initial skill creation.

## Contributing
Submit PRs to improve the skill script.

## License
MIT
