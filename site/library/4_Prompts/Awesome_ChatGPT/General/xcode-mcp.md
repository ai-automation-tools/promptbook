---
title: "🤖 xcode-mcp"
tags: ["awesome-chatgpt", "xcode", "mcp"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# xcode-mcp

---
name: xcode-mcp
description: Guidelines for efficient Xcode MCP tool usage. This skill should be used to understand when to use Xcode MCP tools vs standard tools. Xcode MCP consumes many tokens - use only for build, test, simulator, preview, and SourceKit diagnostics. Never use for file read/write/grep operations.
---

# Xcode MCP Usage Guidelines

Xcode MCP tools consume significant tokens. This skill defines when to use Xcode MCP and when to prefer standard tools.

## Complete Xcode MCP Tools Reference

### Window & Project Management
| Tool | Description | Token Cost |
|------|-------------|------------|
| `mcp__xcode__XcodeListWindows` | List open Xcode windows (get tabIdentifier) | Low ✓ |

### Build Operations
| Tool | Description | Token Cost |
|------|-------------|------------|
| `mcp__xcode__BuildProject` | Build the Xcode project | Medium ✓ |
| `mcp__xcode__GetBuildLog` | Get build log with errors/warnings | Medium ✓ |
| `mcp__xcode__XcodeListNavigatorIssues` | List issues in Issue Navigator | Low ✓ |

### Testing
| Tool | Description | Token Cost |
|------|-------------|------------|
| `mcp__xcode__GetTestList` | Get available tests from test plan | Low ✓ |
| `mcp__xcode__RunAllTests` | Run all tests | Medium |
| `mcp__xcode__RunSomeTests` | Run specific tests (preferred) | Medium ✓ |

### Preview & Execution
| Tool | Description | Token Cost |
|------|-------------|------------|
| `mcp__xcode__RenderPreview` | Render SwiftUI Preview snapshot | Medium ✓ |
| `mcp__xcode__ExecuteSnippet` | Execute code snippet in file context | Medium ✓ |

### Diagnostics
| Tool | Description | Token Cost |
|------|-------------|------------|
| `mcp__xcode__XcodeRefreshCodeIssuesInFile` | Get compiler diagnostics for specific file | Low ✓ |
| `mcp__ide__getDiagnostics` | Get SourceKit diagnostics (all open files) | Low ✓ |

### Documentation
| Tool | Description | Token Cost |
|------|-------------|------------|
| `mcp__xcode__DocumentationSearch` | Search Apple Developer Documentation | Low ✓ |

### File Operations (HIGH TOKEN - NEVER USE)
| Tool | Alternative | Why |
|------|-------------|-----|
| `mcp__xcode__XcodeRead` | `Read` tool | High token consumption |
| `mcp__xcode__XcodeWrite` | `Write` tool | High token consumption |
| `mcp__xcode__XcodeUpdate` | `Edit` tool | High token consumption |
| `mcp__xcode__XcodeGrep` | `rg` / `Grep` tool | High token consumption |
| `mcp__xcode__XcodeGlob` | `Glob` tool | High token consumption |
| `mcp__xcode__XcodeLS` | `ls` command | High token consumption |
| `mcp__xcode__XcodeRM` | `rm` command | High token consumption |
| `mcp__xcode__XcodeMakeDir` | `mkdir` command | High token consumption |
| `mcp__xcode__XcodeMV` | `mv` command | High token consumption |

---

## Recommended Workflows

### 1. Code Change & Build Flow


---

Contributed by [@ilkerulusoy](https://github.com/ilkerulusoy) to [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
