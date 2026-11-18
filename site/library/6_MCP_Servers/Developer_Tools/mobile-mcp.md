---
title: "🔌 Mobile MCP"
description: "Drive iOS and Android simulators, emulators and real devices from an agent, through accessibility snapshots or screenshots."
tags: ["mcp-server", "developer-tools", "mobile", "testing", "automation"]
server:
  repo: mobile-next/mobile-mcp
  license: "Apache-2.0"
  maintainer: "Mobile Next (community)"
  transport: "stdio"
  checked: 2026-11-18
---

# Mobile MCP server

Drive iOS and Android simulators, emulators and real devices from an agent, through accessibility snapshots or screenshots.

## Install

**Claude Code**

```bash
claude mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@latest
```

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    }
  }
}
```

## What it can do

- List available devices, simulators and emulators
- Operate native apps from the accessibility tree, with screenshots and coordinate taps as a fallback
- One tool set across iOS and Android

## Notes

Needs the platform tooling for the target: Xcode and a booted simulator for iOS, the Android SDK and a running emulator (`adb`) for Android, or `adb` with USB debugging for a real Android device. It taps and types on the device, so use a test device or account. Set `MOBILEMCP_DISABLE_TELEMETRY=1` to turn off its telemetry.

## Details

| | |
|:---|:---|
| **Source** | [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp) |
| **Maintainer** | Mobile Next (community) |
| **Licence** | Apache-2.0 |
| **Transport** | stdio |
| **Auth** | None |
| **Needs** | Node.js, plus Xcode (iOS) or the Android SDK (Android) |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
