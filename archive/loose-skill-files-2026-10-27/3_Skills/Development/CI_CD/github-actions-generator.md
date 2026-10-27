---
title: "⚡ GitHub Actions Generator"
tags: ["skill", "ci-cd", "github-actions", "automation", "devops"]
category: "Skills"
subcategory: "Development/CI_CD"
name: "github-actions-generator"
description: "Generates robust, secure, and optimized GitHub Actions workflow YAML files for CI/CD pipelines. Use when: (1) setting up a new repository, (2) adding automated testing/linting, (3) creating deployment pipelines. NOT for: configuring other CI systems like Jenkins or GitLab CI."
---

# GitHub Actions Generator

This skill assists agents and developers in creating best-practice GitHub Actions workflows. It ensures workflows use specific commit hashes for actions, implement proper caching, and follow least-privilege permission models.

## Prerequisites

- **Environment:** A local directory containing a `.github/workflows/` folder.
- **Knowledge:** Understanding of the target language/framework to configure the correct build steps.

### Setup Instructions

Ensure the workflows directory exists.
```bash
mkdir -p .github/workflows
```

## Usage

### Basic Usage

Generate a basic Node.js CI pipeline.

```bash
cat << 'EOF' > .github/workflows/ci.yml
name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
EOF
```

### Common Workflows

#### Workflow 1: Python Lint and Test Matrix

Use this to test across multiple language versions.

**Steps:**
1. Create `python-tests.yml`.
2. Define the matrix strategy.

```yaml
name: Python Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install ruff pytest
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
      - name: Lint with Ruff
        run: ruff check .
      - name: Test with pytest
        run: pytest
```

#### Workflow 2: Docker Build and Push

Securely build and push an image to GitHub Container Registry (GHCR).

```yaml
name: Docker Build & Push
on:
  push:
    tags: [ 'v*.*.*' ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.ref_name }}
```

## Advanced Usage

### OIDC Integration with AWS

Avoid long-lived credentials by using OpenID Connect (OIDC).

```yaml
permissions:
  id-token: write # Required for OIDC
  contents: read

steps:
  - name: Configure AWS Credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::111122223333:role/github-actions-role
      aws-region: us-east-1
```

## Security & Safety

### Permissions Required

Always specify minimum permissions at the job level.
```yaml
permissions:
  contents: read # Default for read-only checkout
```

### Safety Considerations

⚠️ **Important Warnings:**
- Never `run` commands directly interpolating untrusted input (like `github.event.pull_request.title`) to prevent script injection.
- Always use specific SHAs or major version tags for third-party actions.

## License

MIT
