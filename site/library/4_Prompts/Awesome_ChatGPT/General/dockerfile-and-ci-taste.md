---
title: "🤖 Dockerfile and CI taste"
tags: ["awesome-chatgpt", "docker", "ci", "taste"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/prompts.chat
  path: prompts.csv
  ref: d2a57a8276161a45358858e0a62cd8b6c8eae03f
  checked: 2026-11-02
---

# Dockerfile and CI taste

# Dockerfile and CI taste
- Use multi-stage builds and ship only the runtime artifacts in the final stage. Confidence: 0.95
- Pin base images to a specific version tag, and to a digest for production. Confidence: 0.90
- Prefer slim or distroless final images over full OS images. Confidence: 0.85
- Run the container as a non-root user. Confidence: 0.95
- Order layers so dependency manifests are copied and installed before source code. Confidence: 0.95
- Always keep a .dockerignore that excludes node_modules, .git and local env files. Confidence: 0.95
- Add a HEALTHCHECK or an equivalent readiness probe. Confidence: 0.80
- Use BuildKit cache mounts for package manager caches. Confidence: 0.80
- Never bake secrets into images; pass them at runtime or use build secrets. Confidence: 0.95
- Use exec-form CMD so the process receives signals correctly. Confidence: 0.90
- Scan images with Trivy in CI and fail on critical vulnerabilities. Confidence: 0.80
- Cache dependencies in GitHub Actions keyed on the lockfile hash. Confidence: 0.85
- Run lint, type check and tests as separate parallel CI jobs. Confidence: 0.80
- Tag images with the git SHA and never rely on the latest tag for deploys. Confidence: 0.90
- Keep workflows short and move repeated steps into reusable workflows. Confidence: 0.70

---

From [f/prompts.chat](https://github.com/f/prompts.chat).
