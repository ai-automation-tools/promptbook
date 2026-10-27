---
title: "💻 GitHub Copilot CLI Guide"
tags: ["featured", "github", "copilot", "cli", "gh", "terminal-ai"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: github/gh-copilot
---

<!-- Last Updated: 2026-03-31 - Based on official GitHub Copilot CLI documentation -->

# GitHub Copilot CLI Agent Guide

Comprehensive reference for using GitHub Copilot directly in your terminal via the GitHub CLI extension.

**Key Features:**
- 🤖 Terminal-native AI coding assistant
- 💬 Natural language to command translation
- 🔧 Deep GitHub workflow integration
- 📝 Code explanations and debugging help
- 🎯 Multi-model support (Claude Sonnet 4.5, GPT-5)
- 🛡️ Context-aware suggestions based on project

**Installation:** Copilot CLI is a GitHub CLI (`gh`) extension that brings AI directly to your command line.

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Page** | [github.com/features/copilot/cli](https://github.com/features/copilot/cli) |
| **GitHub Repo** | [github.com/github/gh-copilot](https://github.com/github/gh-copilot) |
| **CLI Reference** | [docs.github.com/copilot/cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| **Agents Overview** | [docs.github.com/copilot/agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-agents/overview) |
| **Blog: CLI 101** | [github.blog/copilot-cli-101](https://github.blog/ai-and-ml/github-copilot-cli-101-how-to-use-github-copilot-from-the-command-line/) |
| **Slash Commands Cheat Sheet** | [github.blog/slash-commands-cheat-sheet](https://github.blog/ai-and-ml/github-copilot/a-cheat-sheet-to-slash-commands-in-github-copilot-cli/) |

---

## 2. Installation & Setup

### Prerequisites

Install GitHub CLI first:

**macOS:**
```bash
brew install gh
```

**Windows:**
```powershell
winget install GitHub.cli
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora
sudo dnf install gh
```

### Install Copilot CLI Extension

```bash
gh extension install github/gh-copilot
```

### Verify Installation

```bash
gh copilot version
```

### Authentication

First time use:
```bash
copilot
# You'll be prompted to run: /login
```

Or explicitly:
```bash
copilot login
```

---

## 3. Core Commands

### Interactive Session

```bash
# Launch interactive Copilot interface
copilot
```

**On first launch in a project directory:**
- You'll be prompted to log in via `/login`
- Copilot indexes your project for context

### Suggest (Code/Script Generation)

```bash
# Generate command suggestions
gh copilot suggest "find all Python files modified in last week"

# Short form
copilot suggest "create a new branch and push it"
```

**Interactive prompts:**
- Generic shell command
- `gh` CLI command
- `git` command

### Explain (Command Explanation)

```bash
# Explain complex commands
gh copilot explain "find . -name '*.js' -exec grep -l 'TODO' {} \;"

# Explain git command
copilot explain "git rebase -i HEAD~5"
```

---

## 4. Command-Line Options

### Help & Information

```bash
copilot help [topic]           # Help on: config, commands, environment, logging, permissions
copilot version                # Display version and check for updates
```

### Initialization & Configuration

```bash
copilot init                   # Initialize Copilot custom instructions for repo
copilot update                 # Download and install latest version
```

### Authentication

```bash
copilot login                  # Authenticate via OAuth device flow
copilot logout                 # Sign out and remove stored credentials
```

### Plugin Management

```bash
copilot plugin                 # Manage plugins and plugin marketplaces
```

---

## 5. Interactive Interface Shortcuts

### Context & File Inclusion

```
@ FILENAME                     # Include file contents in context
```

**Example:**
```
@ src/auth.js explain the token validation logic
```

### Command Execution

```
! COMMAND                      # Execute command in local shell (bypass Copilot)
```

**Example:**
```
! git status
```

### Control & Navigation

```
Esc                           # Cancel current operation
Ctrl + C                      # Cancel operation / clear input / exit (press twice)
Ctrl + D                      # Shutdown Copilot CLI session
Ctrl + L                      # Clear screen
```

### Input Editing

```
Ctrl + A                      # Move to beginning of line
Ctrl + E                      # Move to end of line
Ctrl + B                      # Move to previous character
Ctrl + F                      # Move to next character
Ctrl + G                      # Edit prompt in external editor
↑ / ↓                        # Navigate command history
```

### Mode Switching

```
Shift + Tab                   # Cycle between standard, plan, and autopilot modes
```

### Response Timeline

```
Ctrl + O                      # Expand recent items in response timeline
Ctrl + E                      # Expand all items in response timeline
Ctrl + T                      # Expand/collapse reasoning in responses
```

### Slash Command After Typing

```
Ctrl + X then /               # Run slash command after starting prompt
```

---

## 6. Slash Commands

Type `/` in the interactive interface to see available commands.

### Session Management

```
/clear                        # Reset session context
/cwd                          # Confirm Copilot is scoped to correct directory
/session                      # Display session usage metrics
/resume                       # Return to long-running work
```

### Configuration

```
/model                        # Change AI model (Claude Sonnet 4.5, GPT-5, etc.)
/agent                        # Shape behavior with custom instructions
/skills                       # Define custom instructions and tool access
```

### Workflow

```
/plan                         # Outline work using team of agents
/fleet                        # Enable parallel execution / multiple models
/help                         # Detailed info about commands and usage
/login                        # Authenticate GitHub account
```

---

## 7. AI Models

Select different models for different tasks:

```
/model
```

**Available models:**
- **Claude Sonnet 4.5:** Strong reasoning, complex tasks
- **GPT-5:** Latest OpenAI model, balanced performance
- **GPT-5.6 Sol:** Fast, general-purpose
- **Codex-based models:** Specialized for code generation

---

## 8. Copilot CLI Agents

GitHub Copilot CLI supports specialized agents for different workflows.

### Agent Types

**General Agent:**
- Default conversational agent
- Handles broad coding questions

**Plan Agent:**
- Multi-step task planning
- Uses team of specialized agents

**Fleet Agent:**
- Parallel execution
- Run multiple models simultaneously

### Activate Agents

```
/plan "refactor the authentication module to use OAuth2"
/fleet "compare performance of different sorting algorithms"
```

---

## 9. Custom Instructions

Initialize project-specific instructions:

```bash
copilot init
```

This creates a `.github/copilot-instructions.md` file in your repo.

**Example `.github/copilot-instructions.md`:**

```markdown
# Copilot Instructions for MyProject

## Code Style
- Use TypeScript strict mode
- Follow ESLint Airbnb config
- Prefer async/await over Promises

## Architecture
- Clean architecture with domain/application/infrastructure layers
- Repository pattern for data access
- Dependency injection for services

## Testing
- Jest for unit tests
- Cypress for e2e tests
- Minimum 80% code coverage
```

Copilot will follow these guidelines when generating code.

---

## 10. Best Practices

### For Users

- **Be Specific:** Clear prompts yield better results
  - ❌ "Fix the bug"
  - ✅ "Fix the authentication timeout in src/auth.js"

- **Use Context:** Include files with `@`
  - `@ package.json suggest dependencies for React testing`

- **Iterate:** Refine suggestions in conversation
  - "Make it more secure"
  - "Add error handling"

- **Check Suggestions:** Always review generated commands before executing

### For Projects

- **Initialize Custom Instructions:** Run `copilot init` early in project
- **Document Conventions:** Keep instructions up-to-date
- **Integrate with CI/CD:** Use Copilot to generate GitHub Actions workflows

### Security

- **Review Scripts:** Inspect generated shell commands for safety
- **Avoid Secrets:** Never paste API keys or credentials in prompts
- **Sandbox Testing:** Test destructive commands in safe environment first

---

## 11. Example Workflows

### Git & GitHub Workflows

```bash
# Interactive session
copilot

# Examples
> Create a new feature branch called user-auth
> Find all commits by author in last month
> Squash last 5 commits with message "refactor: clean up auth module"
> Create a pull request for current branch
```

### Script Generation

```bash
gh copilot suggest "backup database to S3 with timestamp"

# Copilot generates:
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump mydb | gzip | aws s3 cp - s3://backups/db_$TIMESTAMP.sql.gz
```

### Command Explanation

```bash
gh copilot explain "docker run -it --rm -v $(pwd):/app -w /app node:18 npm test"

# Copilot explains:
# - docker run: Create and start container
# - -it: Interactive terminal
# - --rm: Remove container after exit
# - -v $(pwd):/app: Mount current directory to /app
# - -w /app: Set working directory
# - node:18: Use Node.js 18 image
# - npm test: Run tests
```

### Debugging

```bash
copilot

> @ src/api.js explain why the POST endpoint returns 404
> Suggest a fix for the route registration
> Generate tests for the fixed endpoint
```

---

## 12. Integration with GitHub Workflow

### Issues & Pull Requests

```bash
copilot

> List open issues assigned to me
> Create a branch for issue #123
> Generate PR description for current changes
```

### CI/CD

```bash
gh copilot suggest "create GitHub Actions workflow for Node.js testing"

# Generates .github/workflows/test.yml
```

### Code Review

```bash
copilot

> @ src/auth.js review this code for security issues
> Suggest improvements for error handling
> Generate unit tests
```

---

## 13. Troubleshooting

### Common Issues

**Issue: "Authentication failed"**
- **Cause:** Not logged in or token expired
- **Solution:** Run `/login` or `copilot login`

**Issue: "Copilot command not found"**
- **Cause:** Extension not installed or `gh` not in PATH
- **Solution:** Run `gh extension install github/gh-copilot`

**Issue: "No suggestions generated"**
- **Cause:** Insufficient context or unclear prompt
- **Solution:** Provide more details, include files with `@`

**Issue: "Wrong directory context"**
- **Cause:** Copilot scoped to wrong directory
- **Solution:** Run `/cwd` to verify, navigate to correct directory

---

## 14. Advanced Usage

### Scripting with Copilot

```bash
#!/bin/bash
# Use Copilot in scripts (non-interactive)

# Note: Copilot is primarily interactive
# For automation, use GitHub API or gh CLI directly
```

### Environment Variables

```bash
# Set log level
export GITHUB_COPILOT_LOG_LEVEL=debug

# Set custom config directory
export GITHUB_COPILOT_CONFIG_DIR=~/.config/copilot
```

---

## 15. Comparison with Other Tools

| Feature | Copilot CLI | Cursor | Aider |
|---------|-------------|--------|-------|
| **Interface** | Terminal | IDE | Terminal |
| **GitHub Integration** | Native | Plugin | Git only |
| **Context Scope** | Project + GitHub | Codebase | Files in chat |
| **Multi-file Edits** | Via conversation | Yes | Yes |
| **Cost** | GitHub subscription | Subscription | API cost |

---

## 16. Version History

- **2026 Q1:** Multi-model support, enhanced agents, fleet mode
- **2025 Q4:** Plan agent, slash commands expansion
- **2025 Q2:** Initial CLI release, basic suggest/explain

---

## 17. References

- [Official CLI Page](https://github.com/features/copilot/cli)
- [CLI Command Reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- [GitHub Blog: CLI 101](https://github.blog/ai-and-ml/github-copilot-cli-101-how-to-use-github-copilot-from-the-command-line/)
- [Slash Commands Cheat Sheet](https://github.blog/ai-and-ml/github-copilot/a-cheat-sheet-to-slash-commands-in-github-copilot-cli/)
- [Medium Guide](https://robertwijntjes.medium.com/github-copilot-a-guide-to-the-cli-tool-2da8ebabf8a2)

---

**Note:** GitHub Copilot CLI is designed for developers who live in the terminal. It deeply integrates with GitHub workflows, making it ideal for git operations, CI/CD, and command-line development.
