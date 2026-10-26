---
title: "💻 Cursor AI IDE Guide"
tags: ["featured", "cursor", "ide", "cli", "ai-coding", "vscode"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: cursor/cursor
---

<!-- Last Updated: 2026-03-31 - Based on official Cursor documentation -->

# Cursor AI IDE Agent Guide

Comprehensive reference for using Cursor AI IDE and its CLI for AI-assisted coding workflows.

**Key Features:**
- 🤖 AI-native code editor built on VS Code foundation
- 💬 Multiple AI modes: Agent, Plan, and Ask
- 🔧 Full VS Code extension compatibility
- 🌐 Terminal CLI for automation and CI/CD
- 🎯 Model flexibility (GPT-5.2, Claude, Gemini)
- 🛡️ Customizable permissions and sandbox modes

**Installation:** Cursor provides both a desktop IDE and a command-line interface for different workflows.

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [cursor.com](https://cursor.com/) |
| **Documentation** | [cursor.com/docs](https://cursor.com/docs/cli/overview) |
| **CLI Reference** | [cursor.com/docs/cli/reference](https://cursor.com/docs/cli/reference/parameters) |
| **Getting Started** | [cursor.com/help/integrations/cli](https://cursor.com/help/integrations/cli) |
| **Download** | [cursor.com/download](https://cursor.com/download) |

---

## 2. Installation

### Desktop IDE

Download from [cursor.com/download](https://cursor.com/download) for macOS, Windows, or Linux.

### CLI Installation

**macOS / Linux / WSL:**
```bash
curl https://cursor.com/install -fsS | bash
```

**Windows PowerShell:**
```powershell
irm 'https://cursor.com/install?win32=true' | iex
```

**Verify Installation:**
```bash
cursor-agent --version
```

---

## 3. CLI Commands

### Core Commands

```bash
# Start interactive agent session
agent

# Start with initial prompt
agent "refactor the auth module to use JWT tokens"

# Authentication
agent login              # Authenticate with Cursor
agent logout             # Sign out and clear credentials
agent status            # Check authentication status
agent whoami            # Alias for status

# System Information
agent about             # Display version and system info
agent models            # List all available AI models
agent update            # Update Cursor Agent to latest version
```

---

## 4. AI Modes

### Agent Mode (Default)
Full access to all AI tools for complex coding tasks.

```bash
agent "build a REST API with user authentication"
```

### Plan Mode
Planning and exploration with clarifying questions before coding.

**Activate via:**
- In IDE: `Shift+Tab` or `/plan`
- CLI: `--plan` or `--mode=plan`

```bash
agent --plan "design a microservices architecture"
```

### Ask Mode
Read-only exploration without making changes.

**Activate via:**
- In IDE: `/ask`
- CLI: `--mode=ask`

```bash
agent --mode=ask "explain the authentication flow"
```

---

## 5. Global Flags & Options

### Version & Help

```bash
-v, --version           # Output version number
-h, --help             # Display help for command
```

### Authentication

```bash
--api-key <key>        # Provide API key (or use CURSOR_API_KEY env var)
-H, --header <header>  # Add custom headers (Name: Value format)
                       # Can be used multiple times
```

### Output & Formatting

```bash
-p, --print                    # Print responses to console (non-interactive)
--output-format <format>       # text | json | stream-json (default: text)
--stream-partial-output        # Stream partial output as text deltas
                              # (requires --print and stream-json)
```

### Session Management

```bash
-c, --continue                 # Continue previous session (alias: --resume=-1)
--resume [chatId]             # Resume specific chat session
-c, --cloud                   # Start in cloud mode (Cloud Agents)
```

### Model Selection

```bash
--model <model>               # Specify AI model (e.g., "gpt-5.2", "Gemini 3 Pro")
--list-models                 # List all available models
```

### Mode Control

```bash
--mode <mode>                 # Set agent mode: plan | ask (agent is default)
--plan                        # Shorthand for --mode=plan
```

### Permissions & Security

```bash
-f, --force                   # Forcefully allow commands unless explicitly denied
--yolo                        # Alias for --force
--sandbox <mode>              # enabled | disabled - Control command execution
--approve-mcps                # Auto-approve all MCP servers
--trust                       # Trust workspace without prompting (headless only)
```

### Workspace

```bash
--workspace <path>            # Specify workspace directory
```

---

## 6. Non-Interactive Mode (Scripts & CI/CD)

Use `--print` flag for automation:

```bash
# Find and fix performance issues
agent --print "analyze app.py for performance bottlenecks and suggest fixes"

# Security review
agent --print "review the authentication code for security vulnerabilities" \
  --output-format json > security-report.json

# Generate documentation
agent --print "generate API documentation for all endpoints" \
  --workspace ./backend
```

### Output Formats

**Text (default):**
```bash
agent --print "explain this function" --output-format text
```

**JSON:**
```bash
agent --print "analyze code quality" --output-format json
```

**Stream JSON:**
```bash
agent --print "refactor module" --output-format stream-json --stream-partial-output
```

---

## 7. Slash Commands (In-Chat)

When inside an interactive Cursor session:

```
/plan              # Switch to plan mode
/ask               # Switch to ask mode
/clear             # Reset session context
/cwd               # Confirm current directory scope
/model             # Change AI model
/session           # Display session usage metrics
/help              # Show available commands
/login             # Authenticate GitHub account
/fleet             # Enable parallel execution (multiple models)
/resume            # Return to long-running work
/agent             # Shape behavior with custom instructions
/skills            # Define custom instructions and tool access
```

---

## 8. Keyboard Shortcuts (Interactive Mode)

### Navigation & Control

```
Ctrl + C           # Cancel operation / clear input / exit (press twice)
Ctrl + D           # Shutdown Copilot CLI session
Ctrl + L           # Clear screen
Esc               # Cancel current operation
```

### Input & Editing

```
Ctrl + A           # Move to beginning of line
Ctrl + E           # Move to end of line
Ctrl + B           # Move to previous character
Ctrl + F           # Move to next character
Ctrl + G           # Edit prompt in external editor
↑ / ↓             # Navigate command history
```

### Context & References

```
@ FILENAME         # Include file contents in prompt
! COMMAND          # Execute command in local shell (bypass Copilot)
Ctrl + X then /    # Run slash command after typing prompt
```

### Mode Switching

```
Shift + Tab        # Cycle between standard, plan, and autopilot modes
```

### Response Timeline

```
Ctrl + O           # Expand recent items in response timeline
Ctrl + E           # Expand all items in response timeline
Ctrl + T           # Expand/collapse reasoning display
```

---

## 9. MCP (Mission Control Protocol) Integration

Cursor supports MCP for connecting external tools and data sources.

```bash
# Auto-approve MCP servers
agent --approve-mcps

# Use with custom configuration
agent --workspace ./project --approve-mcps
```

---

## 10. Best Practices

### For Users

- **Use Plan Mode First:** For complex tasks, use `--plan` to outline approach before implementation
- **Leverage Non-Interactive Mode:** Automate repetitive tasks in CI/CD pipelines with `--print`
- **Manage Permissions:** Use `--sandbox enabled` for untrusted workspaces
- **Select Right Model:** Use `--model` to choose between speed (GPT-4o mini) and capability (Claude Sonnet)

### For Scripts & Automation

- **JSON Output:** Use `--output-format json` for parsing in scripts
- **Environment Variables:** Store API keys in `CURSOR_API_KEY` instead of flags
- **Workspace Isolation:** Always specify `--workspace` for predictable behavior
- **Error Handling:** Parse JSON responses for status codes and error messages

### Security

- **Sandbox Mode:** Enable `--sandbox enabled` for unknown codebases
- **Trust Carefully:** Only use `--trust` flag in controlled environments
- **Review Commands:** Don't use `--force` without understanding implications

---

## 11. Example Workflows

### Code Review

```bash
agent --plan "review this PR for security issues and performance" \
  --workspace ./feature-branch
```

### Refactoring

```bash
agent "refactor UserController to follow SOLID principles" \
  --model "claude-sonnet-4.5"
```

### CI/CD Integration

```bash
#!/bin/bash
# .github/workflows/ai-review.sh

agent --print "analyze test coverage and suggest improvements" \
  --output-format json \
  --workspace . > coverage-report.json
```

### Documentation Generation

```bash
agent --print "generate comprehensive README.md from codebase" \
  --workspace ./my-project > README.md
```

---

## 12. Troubleshooting

### Common Issues

**Issue: "Authentication failed"**
- **Cause:** Invalid or expired API key
- **Solution:** Run `agent login` or set `CURSOR_API_KEY` environment variable

**Issue: "Workspace not found"**
- **Cause:** Invalid path specified in `--workspace`
- **Solution:** Verify path exists and use absolute paths

**Issue: "Model not available"**
- **Cause:** Specified model name doesn't exist or subscription required
- **Solution:** Run `agent --list-models` to see available options

**Issue: "Permission denied"**
- **Cause:** Sandbox mode blocking operations
- **Solution:** Use `--sandbox disabled` or `--trust` (if safe)

---

## 13. Integration with Other Tools

### VS Code Extensions

Cursor maintains full VS Code extension compatibility. All your favorite extensions work seamlessly.

### Git Integration

Cursor automatically detects Git repositories and provides context-aware suggestions for commits, PRs, and code reviews.

### Terminal Integration

Use Cursor CLI from any terminal or integrate into shell scripts for automation.

---

## 14. Version History

- **v2.x** (2026): Enhanced CLI, MCP support, multi-model selection
- **v1.x** (2025): Initial release with Agent, Plan, and Ask modes

---

## 15. References

- [Official Documentation](https://cursor.com/docs)
- [CLI Reference](https://cursor.com/docs/cli/reference/parameters)
- [Getting Started Guide](https://www.guvi.in/blog/getting-started-with-cursor-cli/)
- [Codecademy Tutorial](https://www.codecademy.com/article/getting-started-with-cursor-cli)

---

**Note:** Cursor AI IDE combines the familiar VS Code interface with powerful AI capabilities. Use the desktop IDE for interactive development and the CLI for automation and CI/CD workflows.
