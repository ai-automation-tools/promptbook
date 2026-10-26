---
title: "💻 Continue.dev Guide"
tags: ["featured", "continue", "vscode", "jetbrains", "ai-coding", "open-source"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: continuedev/continue
---

<!-- Last Updated: 2026-03-31 - Based on official Continue.dev documentation -->

# Continue.dev Agent Guide

Comprehensive reference for using Continue.dev, the open-source AI coding assistant for VS Code and JetBrains IDEs.

**Key Features:**
- 🤖 Four AI-powered modes: Agent, Chat, Autocomplete, Edit
- 💬 Works in VS Code and JetBrains IDEs
- 🔧 Fully customizable via YAML configuration
- 🌐 Support for multiple LLM providers (OpenAI, Anthropic, local models)
- 🎯 Open-source and privacy-friendly
- 🛡️ Community-driven with active development

**Philosophy:** Continue.dev transforms your IDE into an AI-assisted development environment with full customization and control.

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **Official Website** | [continue.dev](https://continue.dev/) |
| **Documentation** | [docs.continue.dev](https://docs.continue.dev/ide-extensions/quick-start) |
| **GitHub Repo** | [github.com/continuedev/continue](https://github.com/continuedev/continue) |
| **Configuration Guide** | [docs.continue.dev/configuration](https://docs.continue.dev/customize/deep-dives/configuration) |
| **VS Code Marketplace** | [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=Continue.continue) |
| **JetBrains Plugin** | [plugins.jetbrains.com](https://plugins.jetbrains.com/plugin/22707-continue) |
| **Customization** | [docs.continue.dev/customize](https://docs.continue.dev/customize/overview) |

---

## 2. Installation

### VS Code

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions marketplace)
3. Search for "Continue"
4. Click Install
5. Reload VS Code

**Or via command line:**
```bash
code --install-extension Continue.continue
```

### JetBrains IDEs

1. Open Settings > Plugins
2. Search for "Continue"
3. Click Install
4. Restart IDE

**Supported JetBrains IDEs:**
- IntelliJ IDEA
- PyCharm
- WebStorm
- PhpStorm
- GoLand
- RubyMine
- CLion
- Rider

### Continue CLI (Recommended for JetBrains)

**Note:** The JetBrains plugin is community-maintained. The Continue team recommends using the CLI (`cn`) for more reliable experience.

```bash
# Installation instructions at docs.continue.dev
npm install -g @continuedev/cli
```

---

## 3. Quick Start

### First Launch

After installation:

1. Open Continue Chat: `Cmd+L` (Mac) or `Ctrl+L` (Windows/Linux)
2. Continue automatically creates `continue_config.yaml`
3. Add your API keys (see Configuration section)

### Basic Usage

**Chat Mode:**
- Press `Cmd/Ctrl+L` to open chat
- Ask questions about your code
- Get debugging help
- Request explanations

**Autocomplete:**
- Start typing
- Continue suggests completions
- Press `Tab` to accept

**Edit Mode:**
- Select code
- Press `Cmd/Ctrl+I` (inline edit)
- Describe changes
- Review and accept

**Agent Mode:**
- Open chat with `Cmd/Ctrl+L`
- Request complex multi-step tasks
- Agent reads files, makes changes, runs commands

---

## 4. AI Modes

### Agent Mode

Autonomous coding assistant for complex tasks.

**Capabilities:**
- Read files across codebase
- Make multi-file changes
- Run terminal commands
- Handle multi-step workflows

**Example:**
```
Build a user authentication system with:
- User model with email/password
- Registration endpoint with validation
- Login endpoint with JWT tokens
- Unit tests for all endpoints
```

### Chat Mode

Conversational AI for questions and guidance.

**Use cases:**
- "How does the authentication flow work?"
- "What's the best way to handle errors in Express?"
- "Review this code for security issues"
- "Explain the decorator pattern"

**Example:**
```
@workspace explain the database schema
@folder src/models describe the relationships between models
```

### Autocomplete

Inline code suggestions as you type.

**Features:**
- Context-aware completions
- Function implementations from comments
- Multi-line suggestions
- Respects coding style

**Example:**
```python
# Suggest implementation
def validate_email(email: str) -> bool:
    # Continue suggests full regex validation
```

### Edit Mode

Modify selected code without leaving file.

**Keyboard shortcut:** `Cmd/Ctrl+I`

**Use cases:**
- Refactoring
- Adding documentation
- Fixing bugs
- Adding features to existing code

**Example:**
```
Select function → Cmd+I → "Add error handling and logging"
```

---

## 5. Configuration

### Config File Location

Continue creates `continue_config.yaml`:

**VS Code:**
```
~/.continue/config.yaml
```

**JetBrains:**
```
~/.continue/config.yaml
```

### Basic Configuration

```yaml
models:
  - provider: openai
    model: gpt-5.6-sol
    apiKey: ${OPENAI_API_KEY}
  
  - provider: anthropic
    model: claude-sonnet-4
    apiKey: ${ANTHROPIC_API_KEY}
  
  - provider: ollama
    model: codellama
    apiBase: http://localhost:11434

customCommands:
  - name: "test"
    description: "Generate unit tests"
    prompt: "Write comprehensive unit tests for the selected code"
  
  - name: "docs"
    description: "Generate documentation"
    prompt: "Generate detailed documentation for this code"

rules:
  - "Use TypeScript strict mode"
  - "Prefer functional components"
  - "Write tests for all features"

context:
  - type: file
    path: .continue/project_context.md
```

### API Keys (Secure)

**Never hardcode API keys!** Use environment variables:

```yaml
models:
  - provider: openai
    apiKey: ${OPENAI_API_KEY}  # References env variable
```

**Set environment variables:**

```bash
# .bashrc or .zshrc
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
```

---

## 6. Keyboard Shortcuts

### VS Code

```
Cmd/Ctrl + L           # Open Continue Chat
Cmd/Ctrl + I           # Inline Edit (Edit Mode)
Cmd/Ctrl + Shift + L   # Toggle Continue sidebar
Tab                    # Accept autocomplete suggestion
```

### JetBrains

```
Cmd/Ctrl + J           # Open Continue Chat
Cmd/Ctrl + I           # Inline Edit
Tab                    # Accept autocomplete
```

---

## 7. Slash Commands

Custom prompts (slash commands) for quick actions:

### Built-in Commands

```
/edit <instruction>    # Edit selected code
/comment               # Add comments/documentation
/test                  # Generate tests
/fix                   # Fix bugs or errors
```

### Custom Commands

Define in `continue_config.yaml`:

```yaml
customCommands:
  - name: "review"
    description: "Security review"
    prompt: "Review this code for security vulnerabilities and suggest fixes"
  
  - name: "optimize"
    description: "Performance optimization"
    prompt: "Optimize this code for performance and explain changes"
  
  - name: "refactor"
    description: "Refactor code"
    prompt: "Refactor this code following SOLID principles"
```

**Usage in chat:**
```
/review
/optimize
/refactor
```

---

## 8. Context Providers

Control what context Continue has access to:

### File Context

```yaml
context:
  - type: file
    path: README.md
  
  - type: file
    pattern: "src/**/*.ts"
```

### Folder Context

```yaml
context:
  - type: folder
    path: src/models
```

### Codebase Search

```
@workspace search for authentication logic
@folder src/api find all error handlers
```

---

## 9. Model Selection

### Per-Task Model Assignment

```yaml
models:
  - provider: anthropic
    model: claude-sonnet-4
    usage: ["chat", "edit"]  # Use for chat and edit modes
  
  - provider: openai
    model: gpt-5.6-sol
    usage: ["autocomplete"]  # Use for autocomplete
  
  - provider: ollama
    model: codellama
    usage: ["agent"]  # Use for agent mode
```

### Switching Models

In Continue Chat:
```
@model gpt-5.6-sol
@model claude-sonnet-4
```

---

## 10. Best Practices

### For Users

- **Be Specific:** Clear requests yield better code
  - ❌ "Fix this"
  - ✅ "Fix the null pointer exception when user is not authenticated"

- **Use Context:** Reference specific files/folders
  - `@workspace analyze the database schema`
  - `@folder src/api review error handling`

- **Iterate:** Refine in conversation
  - "Add error handling"
  - "Make it async"
  - "Add unit tests"

- **Review Changes:** Always inspect generated code

### For Projects

- **Configure Rules:** Define coding standards in config
  ```yaml
  rules:
    - "Use TypeScript strict mode"
    - "Prefer async/await over Promises"
    - "Write Jest tests for all features"
  ```

- **Create Custom Commands:** Automate repetitive tasks
  ```yaml
  customCommands:
    - name: "api"
      prompt: "Generate REST API endpoint with validation and tests"
  ```

- **Use Local Models:** For sensitive codebases
  ```yaml
  - provider: ollama
    model: codellama
  ```

### Security

- **Environment Variables:** Store API keys securely
- **Local Models:** Use Ollama for private code
- **Review Suggestions:** Don't blindly accept autocomplete
- **Audit Config:** Regularly review what context is shared

---

## 11. Example Workflows

### Feature Development

```
1. Open Continue Chat (Cmd+L)
2. "Create a user registration API with email validation"
3. Review generated code
4. "Add unit tests"
5. "Add JSDoc comments"
6. Accept changes
```

### Bug Fixing

```
1. Select buggy code
2. Cmd+I (Inline Edit)
3. "Fix the authentication timeout error"
4. Review diff
5. Accept
```

### Code Review

```
Chat:
@workspace review recent changes for security issues
```

### Refactoring

```
1. Select class
2. Cmd+I
3. "Refactor to use dependency injection"
4. Review changes
5. "Add interface definitions"
```

---

## 12. Integration with Tools

### VS Code Extensions

Continue works alongside:
- ESLint (linting)
- Prettier (formatting)
- GitLens (Git integration)
- REST Client (API testing)

### JetBrains Plugins

Compatible with JetBrains plugins for enhanced workflows.

### Terminal Integration

Use Continue CLI for terminal-based workflows:

```bash
cn chat "explain this codebase"
cn agent "build authentication system"
```

---

## 13. Local Model Support (Ollama)

Run Continue with local models for privacy:

### Setup Ollama

```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull model
ollama pull codellama

# Start server
ollama serve
```

### Configure Continue

```yaml
models:
  - provider: ollama
    model: codellama
    apiBase: http://localhost:11434
```

**Supported models:**
- `codellama` (code generation)
- `deepseek-coder` (code understanding)
- `mistral` (general purpose)
- `llama2` (chat)

---

## 14. Troubleshooting

### Common Issues

**Issue: "API key not found"**
- **Cause:** Missing environment variable
- **Solution:** Set `OPENAI_API_KEY` or relevant variable

**Issue: "Model not responding"**
- **Cause:** API rate limit or network issue
- **Solution:** Check API status, try different model

**Issue: "Config file not found"**
- **Cause:** Continue not properly initialized
- **Solution:** Reload IDE, check `~/.continue/config.yaml`

**Issue: "Autocomplete not working"**
- **Cause:** Model not configured for autocomplete
- **Solution:** Add model with `usage: ["autocomplete"]`

---

## 15. Comparison with Other Tools

| Feature | Continue.dev | Cursor | GitHub Copilot |
|---------|-------------|--------|----------------|
| **Open Source** | Yes | No | No |
| **IDE Support** | VS Code, JetBrains | Cursor only | VS Code, JetBrains |
| **Local Models** | Yes (Ollama) | Limited | No |
| **Customization** | Full (YAML) | Limited | Limited |
| **Cost** | API cost only | Subscription | Subscription |
| **Agent Mode** | Yes | Yes | Chat only |

---

## 16. Community & Contributing

Continue.dev is open source:

- **GitHub:** [github.com/continuedev/continue](https://github.com/continuedev/continue)
- **Discord:** Active community for support
- **Issues:** Report bugs and request features
- **Pull Requests:** Contribute code improvements

---

## 17. Version History

- **2026 Q1:** Enhanced agent mode, improved local model support
- **2025 Q4:** Custom commands, rules system
- **2025 Q2:** JetBrains plugin, multi-provider support
- **2024:** Initial release

---

## 18. References

- [Official Documentation](https://docs.continue.dev/)
- [Quick Start Guide](https://docs.continue.dev/ide-extensions/quick-start)
- [Configuration Deep Dive](https://docs.continue.dev/customize/deep-dives/configuration)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Continue.continue)
- [Complete Guide](https://www.askcodi.com/documentation/integrations/continue/complete-guide-to-continue-dev)
- [Scaleway Tutorial](https://www.scaleway.com/en/docs/generative-apis/reference-content/adding-ai-to-vscode-using-continue/)

---

**Note:** Continue.dev is ideal for developers who want full control over their AI coding assistant. Its open-source nature, local model support, and deep customization make it perfect for teams with specific requirements or privacy concerns.
