# Template Summary

Created **5 comprehensive templates** for the Promptbook project to guide agents and contributors when adding new content.

## Created Templates

### 1. 📌 Prompt Library Template
- **Purpose:** General-purpose AI prompts for ChatGPT, Claude, etc.
- **Size:** 2.1 KB
- **Key Sections:** Frontmatter (plus an `upstream:` block when copied from a collection), Purpose, Instructions, Output Format, Examples, Tips
- **Icon:** 📌
- **Use Case:** Traditional prompt engineering content

### 2. 📋 Agent Guides Template
- **Purpose:** Documentation and guides for AI agent platforms and tools
- **Size:** 4.3 KB
- **Key Sections:** Frontmatter with `repo:` (the tool's GitHub repo), Overview, Configuration, System prompt, Workflow, Examples, Troubleshooting, Integration
- **Icon:** Various (depending on platform)
- **Use Case:** Platform documentation, CLI references, usage guides

### 3. 🤖 Agents Template
- **Purpose:** Complete autonomous agent definitions
- **Size:** 5.2 KB
- **Key Sections:** Agent metadata, Responsibilities, Workflows, Communication protocols, Progress tracking
- **Icon:** Various (depending on agent domain)
- **Use Case:** Installable subagent definitions (`name:` + `description:` frontmatter); role-play prompts go in `4_Prompts`

### 4. 📝 System Prompts Template
- **Purpose:** A real system prompt, copied verbatim, with its source
- **Key Sections:** Frontmatter with an `upstream:` block (repo, path, commit, or a vendor `url`), then the prompt unchanged
- **Icon:** 📝
- **Use Case:** Full AI platform system prompts (v0.dev, Claude, etc.)

### 5. 🔧 Skills Template
- **Purpose:** Reusable agent skills and tool integrations
- **Size:** 7.6 KB
- **Key Sections:** Prerequisites, Setup, Usage, Configuration, Examples, Troubleshooting, API reference
- **Icon:** 🔧
- **Use Case:** CLI tools, APIs, external integrations

### 6. 🔌 MCP Servers Template (added 2026-10-21)
- **Purpose:** One card per MCP server for `6_MCP_Servers/`
- **Key Sections:** Frontmatter with a `server:` block (repo, licence, transport, checked), Install (Claude Code and `mcpServers` JSON), What it can do, Notes, Details
- **Icon:** 🔌
- **Use Case:** Install lines read from the server's own README, re-checked monthly by `scripts/check-mcp-servers.mjs`

### 7. 📚 README
- **Purpose:** Comprehensive guide for choosing and using templates
- **Size:** 8.7 KB
- **Content:** Template selection guide, quick start instructions, validation checklist, examples

## Template Features

### Consistent Structure
All templates include:
- ✅ 4 required YAML frontmatter fields: title, tags, category, subcategory
- ✅ Icon/emoji at the start of titles (📌 📋 🤖 📝 🔧)
- ✅ Clear section organization
- ✅ Placeholder text in `[brackets]` for easy replacement
- ✅ Concrete examples and use cases
- ✅ Best practices and guidelines
- ✅ Validation requirements

### Comprehensive Coverage
Templates cover all 5 main content categories:
1. **Prompt Library** - Traditional prompts for AI assistants
2. **Agent Guides** - Documentation and usage guides
3. **Agents** - Full agent definitions and behaviors
4. **System Prompts** - Complete LLM system instructions
5. **Skills** - Reusable tool skills and integrations

### Developer-Friendly
- Clear instructions in each template
- Copy-paste ready structure
- Comments explaining each section
- Real-world examples referenced
- Validation checklist at bottom of README

## File Locations

```
docs/templates/
├── README.md                              # Main guide (8.7 KB)
├── TEMPLATE-SUMMARY.md                    # This file
├── prompt-library-template.md             # 📌 Prompts (2.1 KB)
├── agent-guides-template.md               # 📋 Agent guides (4.3 KB)
├── agents-template.md                     # 🤖 Agent definitions (5.2 KB)
├── system-prompts-template.md             # 📝 System prompts (6.8 KB)
└── skills-template.md                     # 🔧 Skills (7.6 KB)
```

## Template Metadata

**Required fields for ALL templates:**
1. `title` - With icon emoji (📌 📋 🤖 📝 🔧)
2. `tags` - Array of 3-6 keywords
3. `category` - Top-level category
4. `subcategory` - Second-level category

**Prompt Library:**
```yaml
title: "📌 [Your Prompt Title]"
tags: ["tag1", "tag2", "tag3"]
category: "[Category_Name]"
subcategory: "[Subcategory_Name]"
```

**Agent Guides:**
```yaml
title: "💻 [Guide Title]"
tags: ["agent-guides", "platform-name", "domain"]
category: "Agent_Guides"
subcategory: "[Agent_Platform]"
```

**Agents:**
```yaml
title: "🤖 [Agent Name]"
tags: ["agent", "role", "domain"]
category: "Agents"
subcategory: "[Category_Name]"
name: agent-name-lowercase
description: "Use this agent when..."
tools: [Tool1, Tool2, Tool3]
model: model-name
```

**System Prompts:**
```yaml
title: "📝 [System Name]"
tags: ["system-prompt", "llm", "instructions", "platform-name"]
category: "System_Prompts"
subcategory: "[Platform_Name]"
```

**Skills:**
```yaml
title: "🔧 [Skill Name]"
tags: ["skill", "skill-type", "domain"]
category: "Skills"
subcategory: "[Category_Name]"
name: skill-name-lowercase
description: "[One-sentence description]"
```

## Usage Instructions

### For Agents Adding Content

1. **Identify content type** - Prompt, Agent Guide, Agent, System Prompt, or Skill?
2. **Copy appropriate template** from `docs/templates/`
3. **Read template comments** - Understand each section's purpose
4. **Replace all `[placeholders]`** with actual content
5. **Follow naming conventions** - Lowercase with hyphens
6. **Validate frontmatter** - Ensure YAML is valid
7. **Check directory structure** - Match category/subcategory folders
8. **Review examples** - Look at existing content for reference
9. **Run validation checklist** - See README for checklist

### Quick Template Selection

| Creating... | Use Template |
|------------|--------------|
| Reusable prompt | `prompt-library-template.md` |
| Agent config guide | `agent-guides-template.md` |
| Complete agent | `agents-template.md` |
| LLM system instructions | `system-prompts-template.md` |
| Tool/CLI skill | `skills-template.md` |

## Examples Referenced

Each template references real examples from the library:

- **Prompt Library:** `site/library/4_Prompts/Ai_Development/Prompt_Engineering/prompt-generator.md`
- **Agent Guides:** `site/library/1_Guides/Claude_Code/flags-reference.md`
- **Agents:** `site/library/2_Agents/Git/git-workflow-manager.md`
- **System Prompts:** `site/library/5_System_Prompts/V0.Dev/v0.md`
- **Skills:** `site/library/3_Skills/Git/gh-address-comments/SKILL.md`

## Standards Enforced

All templates enforce:

1. **File Naming:** Lowercase with hyphens (`example-prompt-name.md`)
2. **Required Metadata:** 4 fields - title (with icon), tags, category, subcategory
3. **Icons:** Emoji in title for visual identity (📌 📋 🤖 📝 🔧)
4. **Structure:** Logical section organization
5. **Examples:** Concrete, actionable content
6. **Documentation:** Clear explanations and use cases
7. **Validation:** Checklist items for quality control

## Future Enhancements

Potential additions:
- Template generator script
- Automated validation tool
- VS Code snippets for templates
- Pre-commit hooks for validation
- Template versioning

---

**Created:** March 28, 2026  
**By:** OpenClaw AI Assistant  
**Location:** `/docs/templates/`  
**Total Files:** 6 (5 templates + README)  
**Total Size:** ~35 KB
