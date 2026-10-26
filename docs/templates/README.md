# Prompt Library Templates

This directory contains standardized templates for each type of content in the Promptbook project. Use these templates as a guide when creating new prompts, agents, skills, or system instructions.

## Available Templates

### 1. 📌 Prompt Library Template
**File:** `prompt-library-template.md`  
**Use for:** General-purpose prompts for AI assistants

This template is for traditional prompt engineering - creating reusable prompts that users can copy and paste into AI tools like ChatGPT, Claude, Gemini, etc.

**Key Features:**
- Required frontmatter: title (with 📌 icon), tags, category, subcategory
- A prompt copied from a public collection adds an `upstream:` block (`match`, `repo`,
  `checked`), which the card shows as the repo link at the top
- Purpose, instructions, output format sections
- Optional examples and tips
- Support for "featured" tag

**Example Subcategories:**
- 4_Prompts/Business/Marketing
- 4_Prompts/Engineering/Code_Review
- 4_Prompts/Writing/Content_Creation

---

### 2. 📋 Agent Guides Template
**File:** `agent-guides-template.md`  
**Use for:** Documentation and guides for AI agent platforms and tools

This template documents how to configure and use AI coding assistants and agents (Claude Code, Codex, Cursor, etc.).

**Key Features:**
- Required frontmatter: title (with 💻 icon), tags, category, subcategory, and `repo:` naming
  the GitHub repo of the tool the guide documents (the link at the top of the card)
- Agent configuration settings (model, temperature, tools)
- Complete system prompt
- Workflow and procedures
- Example interactions
- Troubleshooting section

**Example Subcategories:**
- 1_Guides/Claude_Code/
- 1_Guides/Codex/
- 1_Guides/Cursor/

---

### 3. 🤖 Agents Template
**File:** `agents-template.md`  
**Use for:** Installable subagent definitions (the Claude Code `.claude/agents/` shape)

This template defines a subagent: frontmatter with `name:` and `description:` (plus `tools:` and `model:`), then its system prompt. Since 2026-10-21 `2_Agents` holds only these; a role-play or "act as X" prompt without `name:` belongs in `4_Prompts`.

**Key Features:**
- Required frontmatter: title (with 🤖 icon), tags, category, subcategory
- Additional metadata: name, description, tools, model
- Multiple example use cases with context/user/assistant/commentary
- Communication protocols (JSON examples)
- Phase-based workflows
- Progress tracking formats
- Integration points with other agents

**Example Categories:**
- 2_Agents/Git/
- 2_Agents/DevOps/
- 2_Agents/Security/

---

### 4. 📝 System Prompts Template
**File:** `system-prompts-template.md`  
**Use for:** A real system prompt, copied verbatim from a source you can link

`5_System_Prompts` archives the prompts AI products actually run. Nothing here is written or
reconstructed: the body is the source's text, unchanged.

**Key Features:**
- Required frontmatter: title (with 📝 icon), tags, category, subcategory
- An `upstream:` block naming the GitHub repo, path and commit it was copied from, or
  `match: vendor` + `url` for a prompt the vendor publishes only on its own page
- CI (`scripts/upstream.test.mjs`) fails on a file with neither

**Example Subcategories:**
- 5_System_Prompts/V0.Dev/
- 5_System_Prompts/Claude/
- 5_System_Prompts/ChatGPT/

---

### 5. 🔧 Skills Template
**File:** `skills-template.md`  
**Use for:** Reusable agent skills and tool integrations

This template defines specific skills that agents can use - usually involving external tools, CLIs, APIs, or specific workflows. Similar to OpenClaw skills or Claude Code slash commands.

**Key Features:**
- Required frontmatter: title (with 🔧 icon), tags, category, subcategory
- Additional metadata: name, description
- Prerequisites and setup instructions
- Usage examples with actual commands
- Configuration options
- Common workflows
- Troubleshooting section
- Hooks configuration (if applicable)

**Example Categories:**
- 3_Skills/Git/
- 3_Skills/Docker/
- 3_Skills/Cloud/

---

## Required Metadata Fields

**All templates MUST include these 4 frontmatter fields:**

1. **`title`** - Human-readable name with emoji icon (quoted string)
   - Example: `"📌 Email Marketing Campaign"`
   - Icon is required and should match content type

2. **`tags`** - Array of keywords for filtering and search
   - Example: `["email", "marketing", "campaign"]`
   - 3-6 tags recommended

3. **`category`** - Top-level category (quoted string)
   - Example: `"4_Prompts"`, `"2_Agents"`, `"3_Skills"`
   - Must match folder structure

4. **`subcategory`** - Second-level category (quoted string)
   - Example: `"Marketing"`, `"Git"`, `"Claude_Code"`
   - Must match subfolder structure

**Additional optional metadata:**
- **Agents:** `name`, `description`, `tools`, `model`
- **Skills:** `name`, `description`, `metadata`, `hooks`

**Example:**
```yaml
---
title: "📌 Email Marketing Campaign"
tags: ["email", "marketing", "campaign"]
category: "Prompt_Library"
subcategory: "Business"
---
```

---

## Template Selection Guide

**Choose the right template based on:**

| If you're creating... | Use this template |
|----------------------|-------------------|
| A reusable prompt for ChatGPT/Claude | Prompt Library Template |
| Configuration docs for Claude Code | Agent Guides Template |
| A complete autonomous agent persona | Agents Template |
| Full system instructions for an AI platform | System Prompts Template |
| A tool skill or CLI integration | Skills Template |

---

## Quick Start

### For Adding a New Prompt

1. **Copy the appropriate template:**
   ```bash
   cp docs/templates/prompt-library-template.md site/library/4_Prompts/[Category]/[Subcategory]/your-prompt-name.md
   ```

2. **Update the frontmatter:**
   - Replace `[Your Prompt Title]` with actual title
   - Add 3-6 relevant tags
   - Set category and subcategory to match folder structure

3. **Fill in the content:**
   - Write clear purpose and instructions
   - Add examples if helpful
   - Replace all `[placeholder]` text

4. **Name the file correctly:**
   - Use lowercase with hyphens: `your-prompt-name.md`
   - Should match the content topic

5. **Test and validate:**
   - Check YAML frontmatter is valid
   - Verify file is in correct directory
   - Test the prompt with an AI assistant

### For Adding a New Guide

1. **Copy the agent guides template:**
   ```bash
   cp docs/templates/agent-guides-template.md site/library/1_Guides/[Platform]/guide-name.md
   ```

2. **Update the content:**
   - Set title and tags
   - Document the platform/tool
   - Add examples and references

### For Adding a New Agent

1. **Copy the agents template:**
   ```bash
   cp docs/templates/agents-template.md site/library/2_Agents/[Category]/agent-name.md
   ```

2. **Update the frontmatter:**
   - Set `name` (lowercase with hyphens)
   - Write comprehensive `description` with multiple examples
   - List required `tools`
   - Specify `model`

3. **Define the agent:**
   - Core responsibilities and workflow
   - Communication protocols
   - Integration points
   - Best practices

### For Adding a New Skill

1. **Create skill directory:**
   ```bash
   mkdir -p site/library/3_Skills/[Category]/[skill-name]
   cp docs/templates/skills-template.md site/library/3_Skills/[Category]/[skill-name]/SKILL.md
   ```

2. **Update the frontmatter:**
   - Set skill name (lowercase with hyphens)
   - Write one-sentence description with use cases
   - Add metadata fields
   - Configure hooks if needed

3. **Document the skill:**
   - Prerequisites and setup
   - Usage examples with real commands
   - Configuration options
   - Troubleshooting

---

## Icon Reference

Use these emojis at the start of titles based on content type:

- 📌 **Prompt Library** - General prompts
- 📋 **Agent Guides** - Documentation and guides
- 🤖 **Agents** - Full agent definitions
- 📝 **System Prompts** - LLM system instructions
- 🔧 **Skills** - Tool skills and integrations
- 🔐 **Security** - Security-related content
- 🚀 **DevOps** - CI/CD, deployment, infrastructure
- 💼 **Business** - Business-related prompts
- 🎨 **Design** - UI/UX, creative content
- 📊 **Analytics** - Data analysis, reporting

---

## Validation Checklist

Before committing new content, verify:

- [ ] Used the correct template for content type
- [ ] YAML frontmatter is valid (no syntax errors)
- [ ] All `[placeholders]` replaced with actual content
- [ ] File name is lowercase with hyphens
- [ ] File is in correct directory matching category/subcategory
- [ ] Title includes appropriate emoji icon
- [ ] Tags are relevant (3-6 recommended)
- [ ] Examples are concrete and actionable
- [ ] No sensitive information included
- [ ] Markdown formatting is correct
- [ ] Links work (if any)

---

## Directory Structure

Templates follow these directory patterns:

```
library/
├── 4_Prompts/              # General AI prompts
│   ├── [Category]/
│   │   └── [Subcategory]/
│   │       └── prompt-name.md
│
├── 1_Guides/                # Agent configuration docs
│   └── [Agent_Platform]/
│       └── guide-name.md
│
├── 2_Agents/                      # Full agent definitions
│   └── [Category]/
│       └── agent-name.md
│
├── 5_System_Prompts/              # LLM system instructions
│   └── [Platform]/
│       └── system-name.md
│
└── 3_Skills/                      # Reusable agent skills
    └── [Category]/
        └── [skill-name]/
            └── SKILL.md
```

---

## Examples in the Wild

Browse these existing prompts to see templates in action:

**Prompt Library:**
- `site/library/4_Prompts/Ai_Development/Prompt_Engineering/prompt-generator.md`

**Agent Guides:**
- `site/library/1_Guides/Claude_Code/flags-reference.md`

**Agents:**
- `site/library/2_Agents/Git/git-workflow-manager.md`

**System Prompts:**
- `site/library/5_System_Prompts/V0.Dev/v0.md`

**Skills:**
- `site/library/3_Skills/Git/gh-address-comments/SKILL.md`

---

## Additional Resources

- **Main Documentation:** See `docs/prompt-template-guide.md` for detailed formatting rules
- **Architecture:** See `docs/ARCHITECTURE.md` for project structure
- **Contributing:** See main `README.md` for contribution guidelines

---

## Need Help?

If you're unsure which template to use or how to structure content:

1. **Check existing examples** in the library that match your content type
2. **Review the full guide:** `docs/prompt-template-guide.md`
3. **Ask in issues** with the `documentation` label

---

**Last Updated:** March 28, 2026  
**Version:** 1.0
