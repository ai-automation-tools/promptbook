---
title: "🔌 Terraform"
description: "HashiCorp's server for the Terraform Registry (providers, modules, policies) and HCP Terraform / Terraform Enterprise workspaces."
tags: ["mcp-server", "cloud-platforms", "terraform", "infrastructure-as-code", "devops", "official"]
server:
  repo: hashicorp/terraform-mcp-server
  license: "MPL-2.0"
  maintainer: "HashiCorp (official)"
  transport: "stdio, HTTP"
  checked: 2026-10-29
---

# Terraform MCP server

HashiCorp's server for the Terraform Registry (providers, modules, policies) and HCP Terraform / Terraform Enterprise workspaces.

## Install

**Claude Code**

```bash
claude mcp add terraform -s user -t stdio -- docker run -i --rm hashicorp/terraform-mcp-server
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "terraform": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "hashicorp/terraform-mcp-server"]
    }
  }
}
```

For HCP Terraform or Terraform Enterprise, add `"-e", "TFE_TOKEN=YOUR_TFE_TOKEN"` and `"-e", "TFE_ADDRESS=https://app.terraform.io"` before the image name.

## What it can do

- Look up providers, modules and policies in the public Terraform Registry
- List organizations and projects, and read private registry content (HCP Terraform / Enterprise)
- Create, update and delete workspaces, with variables, tags and runs

## Notes

The README warns that query results can reach the MCP client and the model: do not use it with untrusted clients or models. Registry lookups need no token; give `TFE_TOKEN` the narrowest team or user token you can, since workspace tools can change and delete workspaces. Review any generated configuration before you apply it.

## Details

| | |
|:---|:---|
| **Source** | [hashicorp/terraform-mcp-server](https://github.com/hashicorp/terraform-mcp-server) |
| **Maintainer** | HashiCorp (official) |
| **Licence** | MPL-2.0 |
| **Transport** | stdio, HTTP |
| **Auth** | None for the public registry; `TFE_TOKEN` (and `TFE_ADDRESS`) for HCP Terraform / Enterprise |
| **Needs** | Docker |

_Install lines read from the server's README on 2026-10-29. The Monthly Upkeep re-checks every card._
