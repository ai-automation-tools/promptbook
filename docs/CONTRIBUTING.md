# Contributing Guide

Thank you for contributing to Promptbook! This guide will help you add high-quality content.

---

## Quick Start

1. **Choose content type** - Prompt, Agent Guide, Agent, System Prompt, or Skill?
2. **Use appropriate template** - See [templates/](templates/)
3. **Follow formatting rules** - See sections below
4. **Submit PR** - With clear description

---

## Content Types

We have 5 content categories, each with its own template:

| Type | Use For | Template |
|------|---------|----------|
| 📌 **Prompt Library** | General AI prompts | [template](templates/prompt-library-template.md) |
| 💻 **Agent Guides** | Platform documentation | [template](templates/agent-guides-template.md) |
| 🤖 **Agents** | Agent definitions | [template](templates/agents-template.md) |
| 📝 **System Prompts** | LLM instructions | [template](templates/system-prompts-template.md) |
| 🔧 **Skills** | Tool integrations | [template](templates/skills-template.md) |

See [templates/README.md](templates/README.md) for detailed usage guide.

---

## Required Metadata

**All content MUST include these 4 fields in frontmatter:**

```yaml
---
title: "📌 Your Title Here"        # Required: With emoji icon
tags: ["tag1", "tag2", "tag3"]    # Required: 3-6 keywords
category: "Category_Name"          # Required: Top-level category
subcategory: "Subcategory_Name"    # Required: Second-level category
---
```

**Skills, agents, system prompts and MCP server cards also name their source** (since
2026-10-23). This library keeps copies of things maintained elsewhere, and the weekly drift
check can only keep a copy current if it knows where it came from:

```yaml
upstream:
  match: exact                 # exact | similar
  repo: owner/repo             # on GitHub
  path: path/in/repo.md
  ref: <full commit sha>       # the commit you copied from
  checked: YYYY-MM-DD
```

MCP cards use `server.repo` instead (see the MCP template). A system prompt the vendor publishes
only on its own docs page uses `match: vendor` + `url`. `scripts/upstream.test.mjs` fails CI on
any of these files without a source, so an item with no repo doesn't go in.

Prompts and guides carry a repo too, so every card shows the same GitHub link at the top
(since 2026-10-26). A prompt copied from a collection gets the `upstream:` block above
(`match: similar`, `repo: f/awesome-chatgpt-prompts` for the Awesome ChatGPT set). A guide is
written here, not copied, so it names the tool it documents with a bare `repo: owner/name` line
instead. The same CI check fails on a prompt or guide without one; the hand-written prompts and
guides that had no repo live in `archive/unlinked-2026-10-26/` at the repo root, not in the
library.

### Field Rules

**1. `title`**
- Include emoji icon (📌 💻 🤖 📝 🔧)
- Quoted string
- Descriptive and clear
- Example: `"📌 Email Marketing Campaign"`

**2. `tags`**
- Array of 3-6 keywords
- Lowercase recommended
- No redundant tags (don't repeat category names)
- Example: `["email", "marketing", "b2b"]`

**3. `category`**
- Quoted string
- Must match folder structure
- Example: `"4_Prompts"`, `"2_Agents"`, `"3_Skills"` (the six numbered folders under `site/library/`)

**4. `subcategory`**
- Quoted string
- Must match subfolder structure
- Example: `"Business"`, `"Git"`, `"Claude_Code"`

---

## File Naming

**Format:** lowercase with hyphens

✅ **Good:**
- `email-marketing-campaign.md`
- `git-workflow-manager.md`
- `claude-code-flags.md`

❌ **Bad:**
- `Email Marketing.md` (spaces, capitals)
- `emailMarketing.md` (camelCase)
- `prompt123.md` (not descriptive)

---

## Directory Structure

Place files in correct location based on category/subcategory:

```
library/
├── 4_Prompts/
│   └── [Category]/
│       └── [Subcategory]/
│           └── your-prompt.md
│
├── 1_Guides/
│   └── [Platform]/
│       └── your-guide.md
│
├── 2_Agents/
│   └── [Category]/
│       └── your-agent.md         # installable subagents only: name: + description:
│
├── 5_System_Prompts/
│   └── [Platform]/
│       └── your-system.md
│
├── 6_MCP_Servers/
│   └── [Folder]/
│       └── server-name.md        # from docs/templates/mcp-servers-template.md
│
└── 3_Skills/
    └── [Category]/
        └── [skill-name]/
            └── SKILL.md
```

---

## Writing Quality Content

### Be Specific
- Define clear purpose and use cases
- Provide concrete examples
- Include expected outcomes

### Use Placeholders
- Wrap replaceable content in `[brackets]`
- Example: `[Your company name]`, `[Target audience]`

### Structure Well
- Use headings for organization
- Break down complex tasks
- Number steps when order matters

### Add Examples
- Show real usage scenarios
- Demonstrate expected output
- Illustrate best practices

---

## Best Practices by Type

### 📌 Prompt Library
- Clear role definition for the AI
- Specific instructions and constraints
- Output format specification
- Example inputs/outputs

### 💻 Agent Guides
- Platform/tool overview
- Configuration steps
- Usage examples with commands
- Troubleshooting section

### 🤖 Agents
- Multiple use case examples
- Tools and model specification
- Communication protocols
- Integration points

### 📝 System Prompts
- The real prompt, copied verbatim; never written or reconstructed
- An `upstream:` block (or `match: vendor` + `url`) naming where it was copied from
- One capture per file; a newer version is a new file

### 🔧 Skills
- An `upstream:` block naming the GitHub repo the skill lives in
- Prerequisites and setup
- Usage examples with real commands
- Configuration options
- Troubleshooting guide

---

## Validation Checklist

Before submitting, verify:

- [ ] Used correct template for content type
- [ ] All 4 required metadata fields present
- [ ] Skill, agent, system prompt or MCP card: its source is named (`upstream:` or `server.repo`)
- [ ] Prompt copied from a collection: `upstream:` names it; guide: `repo:` names the tool it documents
- [ ] Title includes appropriate emoji icon
- [ ] Tags are relevant (3-6)
- [ ] File name is lowercase with hyphens
- [ ] File is in correct directory
- [ ] Category/subcategory match folders
- [ ] All `[placeholders]` are clear
- [ ] Examples are concrete and helpful
- [ ] No sensitive information included
- [ ] Markdown formatting is correct
- [ ] Tested with AI assistant (for prompts)

---

## Submission Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b add-[content-name]
   ```
3. **Add your content** using appropriate template
4. **Test locally** if applicable
5. **Commit with clear message**
   ```bash
   git commit -m "Add [content-type]: [brief description]"
   ```
6. **Push to your fork**
7. **Open Pull Request** with:
   - Clear title
   - Description of content
   - Why it's valuable
   - Any relevant links

---

## Common Mistakes

### ❌ Invalid YAML
```yaml
title: Missing Quotes
tags: [no, quotes]
```
**Fix:** Always quote strings

### ❌ Wrong Directory
File: `site/library/2_Agents/Marketing/email-agent.md`  
Metadata: `category: "Marketing"`

**Fix:** Category should be `"Agents"`, subcategory should be `"Marketing"`

### ❌ Missing Icon
```yaml
title: "My Prompt"  # Missing emoji
```
**Fix:** `title: "📌 My Prompt"`

### ❌ Poor Tags
```yaml
tags: ["prompt", "content", "text"]  # Too generic
```
**Fix:** `tags: ["email", "marketing", "b2b"]` (specific and useful)

---

## Need Help?

- **Templates:** See [templates/README.md](templates/README.md)
- **Examples:** Browse existing content in [site/library/](../site/library/)
- **Questions:** Open an issue with `question` label
- **Feedback:** Open an issue with `feedback` label

---

## Code of Conduct

- Be respectful and constructive
- Provide helpful feedback
- Focus on content quality
- Credit sources when applicable
- No spam or low-effort content

---

**Thank you for contributing! 🎉**
