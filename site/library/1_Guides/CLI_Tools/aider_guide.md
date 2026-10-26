---
title: "💻 Aider AI Pair Programming Guide"
tags: ["featured", "aider", "cli", "pair-programming", "open-source", "terminal"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: Aider-AI/aider
---

<!-- Last Updated: 2026-03-31 - Based on official Aider documentation -->

# Aider AI Pair Programming Agent Guide

Comprehensive reference for using Aider, the open-source AI pair programming tool for your terminal.

**Key Features:**
- 🤖 Terminal-based AI pair programming
- 💬 Collaborative coding with LLMs in your local Git repo
- 🔧 Multi-language support (Python, JavaScript, TypeScript, Go, etc.)
- 🎯 Works with multiple LLMs (GPT-4, Claude, DeepSeek, local models)
- 🔄 Automatic Git commits with descriptive messages
- 🛡️ Local-first, privacy-friendly workflow

**Philosophy:** Aider brings AI pair programming to the command line, seamlessly integrating with your existing Git workflow.

---

## 1. Links & Resources

| Resource | Link |
|----------|------|
| **GitHub Repo** | [github.com/aider-ai/aider](https://github.com/aider-ai/aider) |
| **Official Docs** | [aider.chat/docs](https://aider.chat/docs/usage.html) |
| **Commands Reference** | [aider.chat/docs/commands](https://aider.chat/docs/usage/commands.html) |
| **Installation** | [aider.chat/docs/install](https://aider.chat/docs/install.html) |
| **Tips & Tricks** | [aider.chat/docs/tips](https://github.com/Aider-AI/aider/blob/main/aider/website/docs/usage/tips.md) |

---

## 2. Installation

### Via pip (Recommended)

```bash
# Install latest stable version
pip install aider-chat

# Or with pipx for isolation
pipx install aider-chat
```

### Via Homebrew (macOS)

```bash
brew install aider
```

### Verify Installation

```bash
aider --version
```

---

## 3. Quick Start

### Basic Usage

```bash
# Start Aider with files to edit
aider file1.py file2.js

# Start with files and specify model
aider --model gpt-5.6-sol file1.py

# Create new file
aider new_file.py
```

### With API Keys

```bash
# Set API key via environment variable
export OPENAI_API_KEY=your-key-here
aider

# Or pass directly
aider --api-key openai=your-key-here
```

---

## 4. Command-Line Flags

### Model Selection

```bash
--model <model_name>          # Specify LLM to use
```

**Supported models:**
- `gpt-5.6-sol`, `gpt-4-turbo` (OpenAI)
- `sonnet`, `opus`, `haiku` (Anthropic Claude)
- `deepseek` (DeepSeek)
- `gemini-pro` (Google)
- Local models via Ollama/LiteLLM

### API Keys

```bash
--api-key <provider>=<key>    # Provider API key
```

**Format:**
```bash
--api-key openai=sk-...
--api-key anthropic=sk-ant-...
```

### Input Mode

```bash
--multiline                   # Enable multi-line input mode
```

**Behavior:**
- `Enter`: Insert newline
- `Meta-Enter` (Alt/Option-Enter): Submit command

### Context Files

```bash
--read <file_or_glob>         # Read file(s) without adding to edit set
--load <context_file>         # Load files listed in context file
```

**Examples:**
```bash
# Read terms of reference
aider --read ~/.aiderCode.md

# Load context from file
aider --load .aiderContext.md
```

### Git Integration

```bash
--no-auto-commits             # Disable automatic Git commits
--commit                      # Commit pending changes before starting
--message "commit msg"        # Use specific commit message
```

### Other Options

```bash
--help                        # Show all available options
--verbose                     # Enable verbose logging
--dark-mode                   # Use dark color scheme
--light-mode                  # Use light color scheme
```

---

## 5. In-Chat Commands

Once Aider is running, use these slash commands:

### File Management

```
/add <file>                   # Add file(s) to chat session
/drop <file>                  # Remove file(s) from chat session
/read <file_or_URL>          # Read content into chat (not added to edit set)
```

**Examples:**
```
/add src/auth.py
/drop old_file.js
/read https://docs.python.org/3/library/asyncio.html
```

### Git Operations

```
/undo                         # Undo last Aider commit
/diff                         # Show diff of last commit
/commit                       # Commit pending changes with custom message
/run <command>               # Execute shell command (alias: !)
```

**Examples:**
```
/undo
/diff
/run pytest
! git status
```

### Chat Modes

```
/ask <question>              # Ask without editing files (switches to ask mode)
/code <request>              # Request code changes (switches to code mode)
/architect                   # Enter architect mode (planning)
/editor                      # Enter editor mode (implementation)
/context                     # Enter context mode (see surrounding code)
```

### Session Management

```
/clear                       # Discard chat history and start fresh
/exit                        # Exit Aider
/quit                        # Alias for /exit
```

### Configuration

```
/model <model_name>          # Switch to different LLM
/multiline-mode              # Toggle multi-line input mode
/tokens <budget>             # Set thinking token budget
/help                        # Show help information
```

### Input/Output

```
/voice                       # Enable voice input for code requests
/paste                       # Paste image or text from clipboard
/editor                      # Open external editor for next message (Ctrl-X Ctrl-E)
```

### Testing

```
/test                        # Run tests and share error output with Aider
```

---

## 6. Workflow Modes

### Code Mode (Default)

Request code changes and file edits.

```bash
aider file.py

> Add a function to validate email addresses
> Refactor the User class to use dataclasses
```

### Ask Mode

Discuss and plan without editing files.

```bash
> /ask how should I structure the authentication module?
> /ask what's the best way to handle database migrations?
```

**Or start in ask mode:**
```bash
/ask
```

### Architect Mode

High-level planning with a separate model.

```bash
/architect "design a microservices architecture for the e-commerce platform"
```

### Editor Mode

Focused implementation mode.

```bash
/editor "implement the payment processing service"
```

---

## 7. Best Practices

### For Users

- **Be Specific:** Clear requests yield better code
  - ❌ "Fix the bug"
  - ✅ "Fix the KeyError in parse_user_data() when 'email' field is missing"

- **Iterate:** Build incrementally
  - "First, add the User model"
  - "Now add validation"
  - "Finally, add tests"

- **Use /ask for Planning:** Discuss approach before coding
  - `/ask should I use REST or GraphQL for this API?`

- **Review Diffs:** Always check what Aider changed
  - `/diff` shows the last commit

### For Projects

- **Initialize Git:** Aider works best with Git repos
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```

- **Create Context Files:** Use `.aiderCode.md` for project conventions
  ```markdown
  # Coding Standards
  - Use TypeScript strict mode
  - Prefer functional components
  - Write tests for all features
  ```

- **Use .aiderignore:** Exclude files like `.gitignore`
  ```
  node_modules/
  build/
  *.log
  ```

### Security & Privacy

- **Local-First:** Aider runs locally; only prompts/code sent to LLM
- **API Keys:** Store in environment variables, never commit
- **Review Changes:** Inspect commits before pushing
- **Use Local Models:** For sensitive codebases, use Ollama

---

## 8. Example Workflows

### Feature Development

```bash
aider src/app.py

> Add a user registration endpoint with email validation
[Aider generates code]

> Add password hashing with bcrypt
[Aider updates code]

> Add unit tests for the registration endpoint
[Aider creates tests]

/diff
# Review changes

/exit
git push
```

### Bug Fixing

```bash
aider src/auth.py

> /run pytest tests/test_auth.py
# Test fails

> Fix the token expiration bug causing tests to fail
[Aider analyzes test output and fixes code]

> /run pytest tests/test_auth.py
# Tests pass

/exit
```

### Refactoring

```bash
aider src/models.py

> /ask what's the best way to refactor this to use SQLAlchemy?
[Aider suggests approach]

> Implement that refactoring
[Aider refactors code]

> Update the database migrations
[Aider creates migration]

/diff
/exit
```

### Documentation

```bash
aider README.md

> /read src/api.py
> Generate API documentation for all endpoints

/exit
```

---

## 9. Multi-Model Support

Aider supports many LLM providers:

### OpenAI

```bash
export OPENAI_API_KEY=sk-...
aider --model gpt-5.6-sol
```

### Anthropic Claude

```bash
export ANTHROPIC_API_KEY=sk-ant-...
aider --model sonnet
```

### DeepSeek

```bash
export DEEPSEEK_API_KEY=...
aider --model deepseek
```

### Local Models (Ollama)

```bash
# Start Ollama server
ollama serve

# Use with Aider
aider --model ollama/codellama
```

### Switch Models Mid-Session

```
/model gpt-4-turbo
/model sonnet
```

---

## 10. Git Integration

### Automatic Commits

Aider automatically commits changes with descriptive messages:

```
git log --oneline
a1b2c3d aider: Added email validation to User model
d4e5f6g aider: Refactored authentication to use JWT tokens
```

### Undo Commits

```
/undo
```

This reverts the last Aider commit.

### Manual Commits

```
/commit "feat: add user registration endpoint"
```

### Disable Auto-Commits

```bash
aider --no-auto-commits
```

---

## 11. Voice Input

Aider supports voice-to-text for code requests:

```
/voice
```

**Requirements:**
- Microphone access
- Internet connection (uses speech API)

**Use cases:**
- Accessibility
- Hands-free coding
- Rapid iteration

---

## 12. Integration with Editors

### VS Code

```bash
# Open VS Code and use Aider in integrated terminal
code .
# Then in terminal:
aider src/app.py
```

### Vim/Neovim

```bash
# Start Aider
aider file.py

# Make manual edits in Vim simultaneously
vim file.py
```

Aider tracks changes and incorporates your manual edits.

### External Editor for Prompts

```bash
# In Aider chat
Ctrl-X Ctrl-E
# Opens $EDITOR for composing multi-line prompt
```

---

## 13. Troubleshooting

### Common Issues

**Issue: "API key not found"**
- **Cause:** Environment variable not set
- **Solution:** `export OPENAI_API_KEY=your-key` or use `--api-key`

**Issue: "Model not available"**
- **Cause:** Invalid model name or no API access
- **Solution:** Check model name with `--help`, verify subscription

**Issue: "Git not initialized"**
- **Cause:** Not in a Git repository
- **Solution:** Run `git init` in project directory

**Issue: "Changes not committed"**
- **Cause:** `--no-auto-commits` flag or error
- **Solution:** Manually commit or re-run without flag

---

## 14. Advanced Usage

### Custom Context Files

Create `.aiderCode.md` with project-specific guidelines:

```markdown
# Project Coding Standards

## Language
- Python 3.11+
- Type hints required
- Use dataclasses for data models

## Testing
- pytest for all tests
- Minimum 80% coverage
- Mock external APIs

## Style
- Black formatter
- isort for imports
- Flake8 linting
```

Load on startup:
```bash
aider --read .aiderCode.md
```

### Context Loading

Create `.aiderContext.md` with file list:

```markdown
src/models.py
src/api.py
tests/test_api.py
```

Load files:
```bash
aider --load .aiderContext.md
```

### Token Budget

Control thinking tokens:

```
/tokens 4000
```

---

## 15. Comparison with Other Tools

| Feature | Aider | Cursor | GitHub Copilot CLI |
|---------|-------|--------|-------------------|
| **Interface** | Terminal | IDE | Terminal |
| **Open Source** | Yes | No | No |
| **Local Models** | Yes | Limited | No |
| **Git Integration** | Native | Plugin | Native (GitHub) |
| **Multi-file Edits** | Yes | Yes | Conversational |
| **Cost** | API cost only | Subscription | Subscription |

---

## 16. Contributing

Aider is open source! Contributions welcome:

- **GitHub:** [github.com/aider-ai/aider](https://github.com/aider-ai/aider)
- **Issues:** Report bugs or request features
- **Pull Requests:** Code contributions appreciated

---

## 17. Version History

- **2026 Q1:** Enhanced multi-model support, voice input improvements
- **2025 Q4:** Architect/editor modes, context management
- **2025 Q2:** Multi-language support expansion
- **2024:** Initial release

---

## 18. References

- [Official Documentation](https://aider.chat/docs/usage.html)
- [Commands Reference](https://aider.chat/docs/usage/commands.html)
- [GitHub Repository](https://github.com/aider-ai/aider)
- [Tips & Tricks](https://github.com/Aider-AI/aider/blob/main/aider/website/docs/usage/tips.md)
- [Example Workflows](https://github.com/presidio-oss/aider-based-code-generator)

---

**Note:** Aider is ideal for developers who prefer working in the terminal and want full control over their AI pair programming workflow. Its open-source nature and local model support make it perfect for privacy-conscious teams.
