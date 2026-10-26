---
title: "💻 Windsurf Cascade Guide"
tags: ["featured", "windsurf", "cascade", "codeium", "ide", "ai-coding"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
---

<!-- Last Updated: 2026-03-31 - Based on official Windsurf documentation -->

# Windsurf Cascade Agent Guide

Comprehensive reference for using Windsurf's Cascade AI agent for agentic coding workflows.

**Key Features:**
- 🤖 Persistent agentic AI that understands entire codebases
- 💬 Autonomous multi-step task execution
- 🔧 Built on VS Code with full extension compatibility
- 🌐 Context-aware across files, terminal, and project structure
- 🎯 Multiple AI models (GPT-5.6 Sol, Claude, BYOK support)
- 📡 MCP (Model Context Protocol) for external integrations

**Background:** Originally developed by Codeium, acquired by OpenAI in 2025. Cascade is the flagship agentic feature of the Windsurf IDE.

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [windsurf.com](https://windsurf.com/) |
| **Cascade Overview** | [windsurf.com/cascade](https://windsurf.com/cascade) |
| **Documentation** | [docs.windsurf.com](https://docs.windsurf.com/windsurf/getting-started) |
| **Cascade Docs** | [docs.windsurf.com/cascade](https://docs.windsurf.com/windsurf/cascade/cascade) |
| **AI Models** | [docs.windsurf.com/models](https://docs.windsurf.com/windsurf/models) |
| **GitHub** | [github.com/codeium](https://github.com/codeium) |

---

## 2. Installation & Setup

### Desktop IDE

Download Windsurf from [windsurf.com](https://windsurf.com/) for macOS, Windows, or Linux.

### First Launch

1. Install Windsurf IDE
2. Open Cascade panel: `Cmd+L` (macOS) or `Ctrl+L` (Windows/Linux)
3. Sign in with your account
4. Select preferred AI model

---

## 3. Cascade Modes

### Code Mode (Default)
Enables Cascade to create, modify, and refactor code across multiple files.

**Use for:**
- Writing new features
- Refactoring codebases
- Fixing bugs across files
- Implementing multi-file changes

**Activate:** Open Cascade with `Cmd+L` / `Ctrl+L`

### Chat Mode
Optimized for questions about codebase or general coding principles.

**Use for:**
- Understanding existing code
- Asking "how does X work?"
- Learning about patterns in the codebase
- Getting explanations without modifications

**Activate:** Switch mode in Cascade panel or use `@docs` for documentation queries

---

## 4. Core Features

### Persistent Agent

Cascade maintains a mental model of your project, tracking:
- **Project structure:** File organization, dependencies
- **Codebase context:** Functions, classes, patterns
- **Middleware & stack:** Frameworks, libraries, DB models
- **User actions:** Edits, commands, conversation history
- **Terminal output:** Build errors, test results

### Real-Time Awareness

Cascade infers intent by tracking:
- Manual code edits
- Terminal commands and output
- Conversation context
- Linter warnings/errors

### Multi-Step Execution

Cascade can autonomously:
- Create and edit multiple files
- Run terminal commands
- Iterate on its own output
- Execute plans across project

---

## 5. Tool Calling & Integration

### Built-in Capabilities

- **File operations:** Read, write, create, delete
- **Terminal execution:** Run builds, tests, scripts
- **Linter integration:** Real-time error awareness
- **Git operations:** Commit suggestions, branch awareness

### Model Context Protocol (MCP)

Connect Cascade to external tools and data sources:

**Supported integrations:**
- Databases (PostgreSQL, MongoDB, etc.)
- APIs (REST, GraphQL endpoints)
- Documentation sites (via `@docs`)
- Custom tools and services

**Configuration:**
Add MCP servers in Windsurf settings to expand Cascade's capabilities.

---

## 6. AI Model Selection

### Available Models

**Premium Models (Complex Tasks):**
- GPT-5.6 Sol (OpenAI)
- Claude Sonnet/Opus (Anthropic)
- Gemini Pro (Google)

**Fast Models (Quick Tasks):**
- GPT-5.6 Luna
- Claude Haiku

### Bring Your Own Key (BYOK)

Configure your own API keys for supported models:

1. Open Windsurf Settings
2. Navigate to AI Models
3. Add your API key for preferred provider
4. Select model in Cascade panel

**BYOK Benefits:**
- No rate limits
- Direct billing
- Access to latest models

---

## 7. Context Management

### Project Indexing

Cascade automatically indexes:
- All source files in workspace
- Project dependencies
- Framework configurations
- Database schemas (if connected via MCP)

### Custom Context via `@docs`

Search and reference documentation:

```
@docs React hooks best practices
@docs Python async/await
@docs SQL joins
```

**Supported docs:**
- Windsurf help documentation
- Popular framework docs (React, Vue, Django, etc.)
- Custom documentation via URLs

### Custom Project Instructions

Create `.windsurf/instructions.md` in project root:

```markdown
# Project Instructions for Cascade

## Code Style
- Use TypeScript strict mode
- Follow Airbnb ESLint config
- Prefer functional components

## Architecture
- Domain-driven design
- Repository pattern for data access
- Services for business logic

## Testing
- Write Jest tests for all new features
- Minimum 80% coverage
```

Cascade will follow these guidelines for all code generation.

---

## 8. Voice Input

Cascade supports voice-to-text for hands-free coding:

1. Click microphone icon in Cascade panel
2. Speak your request
3. Cascade transcribes and executes

**Use cases:**
- Accessibility
- Hands-free coding sessions
- Rapid iteration while reviewing code

---

## 9. Checkpoints & Iteration

### Checkpoints

Cascade creates automatic checkpoints during multi-step tasks:

**Benefits:**
- Rollback to previous state
- Review intermediate steps
- Branch from specific checkpoint

### Iterative Refinement

Cascade can iterate on its own output:

```
User: "Build a user authentication system"
Cascade: [Creates auth module]

User: "Add password reset functionality"
Cascade: [Builds on previous checkpoint]

User: "Add email verification"
Cascade: [Continues iterating]
```

---

## 10. Best Practices

### For Users

- **Be Specific:** Clear requests yield better results
  - ❌ "Fix the bug"
  - ✅ "Fix the null pointer exception in UserService.authenticate()"

- **Use Context:** Leverage `@docs` for framework-specific code
  - "Add a React component for user profile using @docs React hooks"

- **Iterate Incrementally:** Break large tasks into steps
  - "First, create the data model"
  - "Now add validation"
  - "Finally, add API endpoints"

- **Review Changes:** Always review generated code before committing

### For Projects

- **Set Up Project Instructions:** Create `.windsurf/instructions.md` early
- **Configure Linters:** Cascade respects linter rules
- **Use MCP:** Connect databases and APIs for richer context
- **Enable Git:** Cascade provides better suggestions with version control

### Security

- **Review Generated Code:** Check for security vulnerabilities
- **Limit API Access:** Use BYOK with scoped permissions
- **Validate External Calls:** Review MCP integrations before production

---

## 11. Example Workflows

### Feature Development

```
User: "Create a REST API for managing blog posts with CRUD operations"

Cascade:
1. Creates Post model with schema
2. Implements PostRepository
3. Builds PostService with business logic
4. Creates REST controllers
5. Adds validation middleware
6. Writes unit tests
7. Updates API documentation
```

### Debugging

```
User: "The authentication endpoint returns 500 errors. Check the logs."

Cascade:
1. Reads error logs from terminal
2. Identifies null pointer in token validation
3. Traces issue to missing environment variable
4. Suggests fix and implements it
5. Re-runs tests to verify
```

### Refactoring

```
User: "Refactor UserController to use dependency injection"

Cascade:
1. Analyzes current tight coupling
2. Creates service interfaces
3. Updates constructor for DI
4. Refactors all method calls
5. Updates tests with mocks
6. Validates with linter
```

---

## 12. Troubleshooting

### Common Issues

**Issue: "Cascade is not responding"**
- **Cause:** Model API rate limit or network issue
- **Solution:** Switch to different model or check internet connection

**Issue: "Cascade made incorrect changes"**
- **Cause:** Insufficient context or unclear request
- **Solution:** Provide more specific instructions, reference files explicitly

**Issue: "MCP server connection failed"**
- **Cause:** Invalid credentials or server down
- **Solution:** Verify MCP configuration in settings, check server status

**Issue: "Code doesn't follow project style"**
- **Cause:** Missing project instructions
- **Solution:** Create `.windsurf/instructions.md` with coding standards

---

## 13. Integration with Other Tools

### VS Code Extensions

Full compatibility with VS Code extensions:
- ESLint, Prettier (linting/formatting)
- GitLens (enhanced Git)
- REST Client (API testing)
- Database clients

### Git Integration

Cascade understands Git context:
- Current branch
- Uncommitted changes
- Recent commits
- Merge conflicts

### CI/CD

While Cascade is IDE-based, you can:
- Generate CI/CD configs (GitHub Actions, GitLab CI)
- Write deployment scripts
- Create Docker/Kubernetes manifests

---

## 14. Keyboard Shortcuts

```
Cmd+L / Ctrl+L         # Open Cascade panel
Cmd+K / Ctrl+K         # Quick command palette
Cmd+Shift+P            # VS Code command palette
Cmd+T / Ctrl+T         # File finder
Cmd+P / Ctrl+P         # Quick open
```

---

## 15. AI Coding Agent Rules (Community Best Practices)

From the Windsurf community, recommended agent policies:

### Core Principles

- **Understand First:** Read and comprehend before making changes
- **Ask Clarifying Questions:** When requirements are ambiguous
- **Follow Project Conventions:** Respect existing patterns and styles
- **Incremental Changes:** Small, testable modifications
- **Document Decisions:** Explain complex logic in comments

### Code Quality

- **Write Tests:** Unit tests for new features
- **Handle Errors:** Graceful error handling and logging
- **Security Awareness:** Validate inputs, sanitize outputs
- **Performance Mindful:** Consider time/space complexity

### Communication

- **Explain Changes:** Summarize what was done and why
- **Highlight Trade-offs:** Mention alternative approaches
- **Flag Concerns:** Note potential issues or technical debt

---

## 16. Version History

- **2026 Q1:** OpenAI acquisition, enhanced models, improved MCP
- **2025 Q4:** Initial Cascade release, agentic workflows
- **2025 Q2:** Windsurf IDE launch (formerly Codeium IDE)

---

## 17. References

- [Windsurf Documentation](https://docs.windsurf.com/)
- [Cascade Agent Overview](https://docs.windsurf.com/windsurf/cascade/cascade)
- [AI Model Selection](https://docs.windsurf.com/windsurf/models)
- [Deployment Guide](https://www.deployhq.com/guides/windsurf)
- [Community Guidelines](https://gist.github.com/boxabirds/74d3d55f44587f509b76b04236c523e9)

---

**Note:** Windsurf Cascade represents a shift from code completion to agentic AI assistance. It's designed to handle complex, multi-step tasks while maintaining context across your entire project.
