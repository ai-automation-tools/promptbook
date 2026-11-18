---
title: "🔌 Firebase"
description: "Firebase's official server, built into the Firebase CLI: projects, Auth users, Firestore, security rules, Crashlytics and more."
tags: ["mcp-server", "cloud-platforms", "firebase", "google", "official"]
server:
  repo: firebase/firebase-tools
  path: src/mcp
  license: "MIT"
  maintainer: "Google Firebase (official)"
  transport: "stdio"
  checked: 2026-11-18
---

# Firebase MCP server

Firebase's official server, built into the Firebase CLI: projects, Auth users, Firestore, security rules, Crashlytics and more.

## Install

**Claude Code**

```bash
claude mcp add firebase npx -- -y firebase-tools@latest mcp
```

Or install the official plugin: `claude plugin marketplace add firebase/firebase-tools`, then `claude plugin install firebase@firebase`.

**Any MCP client** (`mcpServers` config)

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools", "mcp", "--dir", "."]
    }
  }
}
```

## What it can do

- Create and manage Firebase projects and apps, and manage Authentication users
- Read and write Cloud Firestore and Realtime Database data; validate and fetch security rules
- Debug with Crashlytics data and Cloud Functions logs
- Send Cloud Messaging notifications and manage Remote Config

## Notes

It acts with the same credentials as the Firebase CLI in the environment it runs in, so it can change real projects: sign in with a narrowly scoped account. Some tools use Gemini in Firebase, whose output can be wrong; the README says not to send personal data to it.

## Details

| | |
|:---|:---|
| **Source** | [firebase/firebase-tools](https://github.com/firebase/firebase-tools) (`src/mcp`) |
| **Maintainer** | Google Firebase (official) |
| **Licence** | MIT |
| **Transport** | stdio |
| **Auth** | Your Firebase CLI login |
| **Needs** | Node.js and npm, a Firebase account |

_Install lines read from the server's README on 2026-11-18. The Monthly Upkeep re-checks every card._
