---
title: "🔌 Google Analytics"
description: "Google's server for Analytics 4: account and property details, core, funnel, conversion and realtime reports, from the Admin and Data APIs."
tags: ["mcp-server", "apps-and-services", "google-analytics", "analytics", "reporting", "official"]
server:
  repo: googleanalytics/google-analytics-mcp
  license: "Apache-2.0"
  maintainer: "Google Analytics (official)"
  transport: "stdio, HTTP"
  checked: 2026-11-20
---

# Google Analytics MCP server

Google's server for Analytics 4: account and property details, core, funnel, conversion and realtime reports, from the Admin and Data APIs.

## Install

Enable the Google Analytics Admin API and Data API in a Google Cloud project, then set up Application Default Credentials with the read-only scope (`https://www.googleapis.com/auth/analytics.readonly`) as the README describes.

**Claude Code** (needs [pipx](https://pipx.pypa.io/stable/#install-pipx))

```bash
claude mcp add analytics-mcp \
  --scope user \
  -e "GOOGLE_APPLICATION_CREDENTIALS=PATH_TO_CREDENTIALS_JSON" \
  -e "GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID" \
  -- pipx run analytics-mcp
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "analytics-mcp": {
      "command": "pipx",
      "args": ["run", "analytics-mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "PATH_TO_CREDENTIALS_JSON",
        "GOOGLE_CLOUD_PROJECT": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

## What it can do

- List accounts and properties, and read property details, Google Ads links, annotations and key events
- Run core, funnel, conversions (ad cost, ROAS, attribution) and realtime reports
- Read custom dimensions and metrics

## Notes

Read-only by default. The write tools (`create_property_annotation`, `create_custom_dimension`, `create_key_event`) appear only when you add `--allow-write` to the args and grant the `analytics.edit` scope, and they need an Editor or Marketer role on the property. The same package can run as a shared HTTP service (`--transport http`, with per-user OAuth through `--oauth`); the README also covers Docker and Cloud Run.

## Details

| | |
|:---|:---|
| **Source** | [googleanalytics/google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) |
| **Maintainer** | Google Analytics (official) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio, HTTP |
| **Auth** | Google Application Default Credentials (user login or service-account impersonation); OAuth 2.1 in HTTP mode |
| **Needs** | Python 3.10+ with pipx, a Google Cloud project with both APIs enabled, access to a GA4 property |

_Install lines read from the server's README on 2026-11-20. The Monthly Upkeep re-checks every card._
