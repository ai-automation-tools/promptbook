---
title: "🔌 Stripe"
description: "Stripe's hosted server: customers, products, prices, payment links, invoices and the Stripe docs."
tags: ["mcp-server", "apps-and-services", "payments", "billing", "official"]
server:
  repo: stripe/ai
  license: "MIT"
  maintainer: "Stripe (official)"
  transport: "HTTP (remote)"
  checked: 2026-11-18
---

# Stripe MCP server

Stripe's hosted server: customers, products, prices, payment links, invoices and the Stripe docs.

## Install

**Claude Code**

```bash
claude mcp add --transport http stripe https://mcp.stripe.com
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "stripe": {
      "url": "https://mcp.stripe.com"
    }
  }
}
```

## What it can do

- Create and look up customers, products and prices
- Create payment links and invoices
- Search the Stripe documentation

## Notes

The old `@stripe/mcp` and agent-toolkit npm packages are deprecated; use the hosted server. Connect a test-mode account first. Anything it does in live mode moves real money.

## Details

| | |
|:---|:---|
| **Source** | [stripe/ai](https://github.com/stripe/ai) |
| **Maintainer** | Stripe (official) |
| **Licence** | MIT |
| **Transport** | HTTP (remote) |
| **Auth** | OAuth sign-in to your Stripe account |
| **Needs** | A Stripe account |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
