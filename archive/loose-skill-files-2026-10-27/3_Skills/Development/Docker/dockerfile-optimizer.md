---
title: "🔧 Dockerfile Optimizer"
tags: ["skill", "docker", "devops", "optimization"]
category: "Skills"
subcategory: "Development"
name: dockerfile-optimizer
description: "Analyzes and rewrites Dockerfiles to reduce image size, improve caching, and enhance security. Use when: (1) building production images, (2) CI/CD pipelines are slow, (3) scanning shows vulnerabilities in base images."
---

# Dockerfile Optimizer

Analyzes and automatically refactors Dockerfiles to follow best practices, implementing multi-stage builds, layer caching optimization, and secure base images.

## Prerequisites

- **Required Tool/Service:** Docker
- **Environment:** Any system with Docker installed

### Setup Instructions

1. Ensure Docker is installed
2. Have target Dockerfile ready

**Verification:**
```bash
docker --version
```

Expected output:
```
Docker version 24.0.0, build ...
```

## Usage

### Basic Usage

Analyze and optimize a Dockerfile.

```bash
dockerfile-optimizer analyze ./Dockerfile
```

**What it does:**
1. Parses Dockerfile instructions
2. Identifies anti-patterns (e.g., adding unnecessary files, running multiple RUN commands)
3. Generates optimized Dockerfile

### Common Workflows

#### Workflow 1: Production Optimization

When preparing an image for production deployment.

**Steps:**
1. Analyze current Dockerfile
   ```bash
   dockerfile-optimizer check ./Dockerfile
   ```
2. Apply multi-stage build optimization
   ```bash
   dockerfile-optimizer apply --strategy multi-stage ./Dockerfile
   ```

## Best Practices

### Do's ✅

- Use specific tags (e.g., `node:18-alpine` instead of `node:latest`)
- Combine RUN commands to reduce layers
- Use `.dockerignore`

### Don'ts ❌

- Store secrets in Dockerfile
- Run containers as root

## Security & Safety

### Safety Considerations

⚠️ **Important Warnings:**
- Ensure compiled binaries are copied correctly in multi-stage builds.
