---
title: "🔌 Kubernetes"
description: "Connect an agent to a Kubernetes cluster: kubectl operations, Helm, node management and a pod troubleshooting prompt."
tags: ["mcp-server", "cloud-platforms", "kubernetes", "helm", "community"]
server:
  repo: Flux159/mcp-server-kubernetes
  license: "MIT"
  maintainer: "Flux159 (community)"
  transport: "stdio"
  checked: 2026-11-18
---

# Kubernetes MCP server

Connect an agent to a Kubernetes cluster: kubectl operations, Helm, node management and a pod troubleshooting prompt.

## Install

**Claude Code**

```bash
claude mcp add kubernetes -- npx mcp-server-kubernetes
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "npx",
      "args": ["mcp-server-kubernetes"]
    }
  }
}
```

## What it can do

- Run kubectl-style operations: inspect, scale deployments, port-forward, clean up failed pods
- Install, upgrade and uninstall Helm charts (Helm v3 optional)
- Cordon, drain and uncordon nodes
- A `k8s-diagnose` prompt walks through pod troubleshooting; optional OpenTelemetry tracing

## Notes

It uses your kubeconfig (`~/.kube/config` by default), so check `kubectl get pods` works first and point it at a non-production context. Start with `ALLOW_ONLY_NON_DESTRUCTIVE_TOOLS=true`, which disables deletes. Secrets are masked in `kubectl get secrets` output.

## Details

| | |
|:---|:---|
| **Source** | [Flux159/mcp-server-kubernetes](https://github.com/Flux159/mcp-server-kubernetes) |
| **Maintainer** | Flux159 (community) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | Your kubeconfig |
| **Needs** | Node.js, kubectl and a cluster; Helm v3 optional |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
