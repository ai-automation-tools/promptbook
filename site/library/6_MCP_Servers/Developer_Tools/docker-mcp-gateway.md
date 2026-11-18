---
title: "🔌 Docker MCP Gateway"
description: "One gateway that runs MCP servers as isolated Docker containers and gives every client the same tools, secrets and OAuth."
tags: ["mcp-server", "developer-tools", "docker", "gateway", "official"]
server:
  repo: docker/mcp-gateway
  license: "MIT"
  maintainer: "Docker (official)"
  transport: "stdio, HTTP"
  checked: 2026-11-18
---

# Docker MCP Gateway

One gateway that runs MCP servers as isolated Docker containers and gives every client the same tools, secrets and OAuth.

## Install

Needs Docker Desktop 4.59+ with the MCP Toolkit feature enabled; recent versions already include the `docker mcp` plugin. To build the latest one:

```bash
git clone https://github.com/docker/mcp-gateway.git
cd mcp-gateway
mkdir -p "$HOME/.docker/cli-plugins/"
make docker-mcp
docker mcp --help
```

**Connect a client**

```bash
docker mcp client ls
docker mcp client connect <client-name> --profile <profile-id>
```

## What it can do

- Run catalog servers (Docker MCP Catalog) in containers; npx and uvx servers get minimal host privileges
- Keep API keys in Docker Desktop's secrets store, not environment variables
- Handle OAuth flows for servers that need them
- Manage profiles and catalogs, trace calls and discover tools dynamically

## Notes

This is a gateway, not one service: what an agent can reach depends on the servers in the profile. Building from source also needs Go 1.24+.

## Details

| | |
|:---|:---|
| **Source** | [docker/mcp-gateway](https://github.com/docker/mcp-gateway) |
| **Maintainer** | Docker (official) |
| **Licence** | MIT |
| **Transport** | stdio, HTTP |
| **Auth** | Per server, through Docker Desktop secrets and OAuth |
| **Needs** | Docker Desktop 4.59+ |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
