---
title: "📝 Knowledge Base Setup"
tags: ["writing", "create-documentation", "knowledge", "base", "setup"]
category: "Writing"
subcategory: "Create_Documentation"
---
# Knowledge Base Setup

Create and organize an Obsidian-based knowledge management system for technical projects, agent documentation, and workflows.

## Purpose
Build a searchable, well-organized knowledge vault for AI agent resources, prompts, system documentation, and daily notes.

## Requirements

### Structure
- **Agents/** - Agent configurations and guides
  - Agent_Guides/ - Platform documentation
  - System_Prompts/ - Agent instructions
    - My_System_Prompts/ - Personal system prompts
    - System_Prompts_Library/ - Curated agent instructions
  - Agent_Templates/ - Boilerplates
  - My_Agents/ - Custom configurations
- **Prompts/** - Prompt libraries
  - My_Prompts/ - Personal workspace
  - Prompt_Catagories/ - Curated collections
- **Skills/** - Custom capabilities
- **Workflows/** - Process documentation
- **Other/** - Daily notes and attachments

### Organization Principles
- No spaces in directory names (use underscores)
- README.md in every category
- Wikilinks for navigation
- Consistent naming conventions
- Logical grouping by function
- Separate personal content from curated libraries

### Navigation System
- **Vault Map** - Complete structure guide
- **Welcome** - Entry point with quick links
- **Category READMEs** - Section overviews
- **Cross-linking** - Related content connections

### Search Optimization
- Consistent tagging
- Descriptive filenames
- Front matter metadata
- Table of contents for long docs
- Keyword-rich summaries

## Obsidian Configuration

### .obsidian/app.json
```json
{
  "alwaysUpdateLinks": true,
  "newFileLocation": "current",
  "attachmentFolderPath": "Other/attachments",
  "defaultViewMode": "source",
  "useMarkdownLinks": true
}
```

### vault/.obsidian/workspace.json
Basic workspace configuration for Obsidian desktop.

## CLI Integration

### Setup obsidian-cli
```bash
# Install notesmd-cli
wget https://github.com/Yakitrak/notesmd-cli/releases/latest/download/notesmd-cli_linux_amd64.tar.gz
tar -xzf notesmd-cli_linux_amd64.tar.gz
mv notesmd-cli ~/bin/obsidian-cli
chmod +x ~/bin/obsidian-cli

# Configure vault
mkdir -p ~/.config/obsidian
cat > ~/.config/obsidian/obsidian.json << 'JSON'
{
  "vaults": {
    "my-vault": {
      "path": "/path/to/vault",
      "ts": 1709337000000,
      "open": true
    }
  }
}
JSON

# Set default
obsidian-cli set-default "my-vault"
```

### Common Commands
```bash
# List vault contents
obsidian-cli list

# Search
obsidian-cli search "query"
obsidian-cli search-content "text"

# Create note
obsidian-cli create "Folder/Note Name"

# Daily note
obsidian-cli daily

# Print content
obsidian-cli print "Note Name"
```

## Documentation Standards

### README Template
```markdown
# [Section Name]

Brief description of this section.

## Contents

- Item 1 - Description
- Item 2 - Description

## Usage

How to use this section.

## Related

- [[Other Section]]
- [[Related Resource]]
```

### Note Template
```markdown
# [Title]

## Overview
Brief summary

## Content
Main content

## References
- Links
- Sources

## Related
- [[Related Note 1]]
- [[Related Note 2]]

---

*Created: YYYY-MM-DD*  
*Tags: #tag1 #tag2*
```

## Maintenance

### Regular Tasks
- Review and update README files
- Consolidate duplicate content
- Archive outdated notes
- Rebuild search index
- Check broken links
- Update cross-references

### Git Integration
```bash
# Track vault in git
cd vault/
git init
git add .
git commit -m "Initial vault setup"

# Regular backups
git add -A
git commit -m "Daily update"
git push origin main
```

## Best Practices
- Update Vault Map when adding sections
- Create READMEs before populating folders
- Use consistent naming (no spaces)
- Link to files, not folders
- Tag important notes
- Keep daily notes separate
- Separate personal content from shared libraries
- Regular cleanup and archiving

---

*Based on: Obsidian vault creation for my-agents project*  
*Location: `~/.openclaw/workspace/projects/my-agents/vault/`*
