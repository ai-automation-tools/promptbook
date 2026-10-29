---
title: "🔌 Grafana"
description: "Grafana's server for dashboards, datasource queries (Prometheus, Loki and more), alerting and incidents on your Grafana instance."
tags: ["mcp-server", "developer-tools", "grafana", "observability", "monitoring", "official"]
server:
  repo: grafana/mcp-grafana
  license: "Apache-2.0"
  maintainer: "Grafana Labs (official)"
  transport: "stdio, HTTP"
  checked: 2026-10-29
---

# Grafana MCP server

Grafana's server for dashboards, datasource queries (Prometheus, Loki and more), alerting and incidents on your Grafana instance.

## Install

**Claude Code**

```bash
claude mcp add grafana -e GRAFANA_URL=http://localhost:3000 -e GRAFANA_SERVICE_ACCOUNT_TOKEN=YOUR_SERVICE_ACCOUNT_TOKEN -- uvx mcp-grafana
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "grafana": {
      "command": "uvx",
      "args": ["mcp-grafana"],
      "env": {
        "GRAFANA_URL": "http://localhost:3000",
        "GRAFANA_SERVICE_ACCOUNT_TOKEN": "YOUR_SERVICE_ACCOUNT_TOKEN"
      }
    }
  }
}
```

For Grafana Cloud, set `GRAFANA_URL` to your instance URL (for example `https://myinstance.grafana.net`). Docker, binary and Helm installs are in the README.

## What it can do

- Search dashboards, read summaries or single properties, and patch or create them
- Run queries against datasources and list their resources
- Read alerting and incident data, and more tools behind opt-in flags

## Notes

Needs Grafana 9.0 or later. The `--disable-write` flag runs it read-only (it also drops the raw-SQL query tools unless `--enable-query` is passed). Use a service account with a narrow role; large dashboards can fill the context window, so prefer the summary and property tools.

## Details

| | |
|:---|:---|
| **Source** | [grafana/mcp-grafana](https://github.com/grafana/mcp-grafana) |
| **Maintainer** | Grafana Labs (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio, HTTP |
| **Auth** | Service account token in an env var (`GRAFANA_SERVICE_ACCOUNT_TOKEN`) |
| **Needs** | uv (or Docker), a Grafana 9.0+ instance |

_Install lines read from the server's README on 2026-10-29. The Monthly Upkeep re-checks every card._
