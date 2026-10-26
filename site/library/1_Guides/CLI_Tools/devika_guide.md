---
title: "💻 Devika Guide"
tags: ["agent-guides", "devika", "cli-tools"]
category: "Agent_Guides"
subcategory: "CLI_Tools"
repo: stitionai/devika
---

# Devika Guide

## Overview
Devika is an advanced AI software engineer that can understand high-level human instructions, break them down into steps, research relevant information, and write code to achieve the given objective. It is an open-source alternative to tools like Devin.

## Agent Configuration

### Basic Settings
- **Agent Name:** Devika
- **Model:** Anthropic Claude Sonnet 5 (recommended), OpenAI GPT-4, or local models via Ollama.
- **Temperature:** Configurable via UI/CLI settings
- **Context Window:** Dependent on the selected model

### Tools & Permissions
- Tool 1: File System (Read/Write access to workspace)
- Tool 2: Web Browser (Read access for researching documentation and debugging)
- Tool 3: Terminal (Execute commands for building, testing, and running code)

## System Prompt

```
You are Devika, an advanced autonomous AI software engineer.
Your primary responsibilities include:

1. Analyzing user requests and breaking them down into actionable steps.
2. Researching necessary information via the web browser tool.
3. Writing, editing, and executing code to fulfill the objective.

### Core Principles
- Autonomy: Proceed through the steps of a task with minimal human intervention.
- Resourcefulness: Search the web when you lack specific knowledge or encounter unexpected errors.
- Correctness: Test the code you write to ensure it works before declaring a task complete.

### Capabilities
- Project planning and task breakdown
- Web search and documentation reading
- File creation, modification, and deletion
- Terminal command execution

### Constraints
- DO NOT execute commands that could harm the host system (e.g., `rm -rf /`).
- ALWAYS explain your reasoning when making significant architectural choices.
- NEVER assume missing dependencies are installed; install them explicitly if needed.

### Response Format
- Communicate progress clearly through the UI or CLI output.
- Output code changes cleanly.

### Error Handling
When encountering a build or test failure, you should:
1. Analyze the error output.
2. Search the web for the error if it is unfamiliar.
3. Modify the code to fix the issue and re-test.
```

## Workflow

### Initialization
1. Clone the Devika repository and install dependencies.
2. Configure your API keys (e.g., Anthropic, OpenAI, Bing/Google Search) in the configuration file or UI.
3. Start the Devika server and navigate to the web UI.

### Standard Operating Procedure

#### Phase 1: Planning
- The user inputs a high-level goal.
- Devika analyzes the goal and generates a step-by-step plan.
- The user can review and approve or modify the plan.

#### Phase 2: Execution
- Devika executes the plan step-by-step.
- It may use the browser to look up APIs or read documentation.
- It writes code, edits files, and runs terminal commands as needed.

#### Phase 3: Verification
- Devika runs tests or build commands to ensure the changes are correct.
- If errors occur, Devika attempts to debug and fix them autonomously.

### Decision Trees

**When an API is Unfamiliar:**
- Action: Devika uses the web browser tool to search for the API documentation.
- Reason: To ensure the generated code uses the API correctly and follows current best practices.

**When a Test Fails:**
- Action: Devika reads the error log, edits the relevant file, and reruns the test.
- Reason: To fulfill its mandate of providing working code.

## Example Interactions

### Example 1: Creating a React Component

**User Input:**
```
Create a React component for a user login form with email and password fields. It should include basic client-side validation.
```

**Agent Response:**
```
Plan:
1. Create `LoginForm.jsx` in the `src/components` directory.
2. Implement the form with email and password inputs using React state.
3. Add client-side validation for email format and password length.
4. Add basic CSS styling.

Executing step 1...
```

**Agent Actions:**
- Creates file `src/components/LoginForm.jsx`
- Writes React component code
- Creates `src/components/LoginForm.css`

### Example 2: Debugging an Error

**User Input:**
```
Fix the TypeScript error in `utils/math.ts`.
```

**Agent Actions:**
- Runs `tsc` to see the error.
- Reads the output: `Object is possibly 'null'.`
- Edits `utils/math.ts` to add a null check.
- Reruns `tsc` and confirms the error is resolved.

## Best Practices

### For Users
- Provide clear, specific, and detailed instructions for complex tasks.
- Review Devika's plan before execution to ensure it aligns with your expectations.
- Use a dedicated, isolated workspace directory to prevent Devika from accidentally modifying important files outside the project scope.

### For Developers
- When extending Devika, ensure new tools have clear descriptions so the LLM knows when to use them.
- Keep the system prompts concise to save context window space.

## Customization Options

### Variables
- `API_KEYS`: Configure which LLM providers and search engines Devika uses.
- `WORKSPACE_DIR`: Set the root directory where Devika is allowed to operate.

## Troubleshooting

### Common Issues

**Issue 1: Devika gets stuck in an infinite loop of fixing errors**
- **Cause:** The model may not fully understand the root cause of the error or is applying the same incorrect fix repeatedly.
- **Solution:** Pause the agent, provide a hint in the chat interface, or manually fix the specific issue and let Devika continue.

**Issue 2: Browser tool fails to read a page**
- **Cause:** The target website might have bot protection or require JavaScript rendering that the scraper doesn't support.
- **Solution:** Provide the necessary information directly in the prompt or ask Devika to look for an alternative source.

## Integration

### With External Tools
- **Search Engines:** Integrates with Bing or Google Search APIs for web research.
- **Local Models:** Can be configured to use Ollama for completely local, private execution.

## Version History

- **v1.0** (2024): Initial open-source release.

## References

- [Devika GitHub Repository](https://github.com/stitionai/devika)
