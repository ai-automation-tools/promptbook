# 3_Skills - Reusable Skill Modules

**Last Updated:** August 23, 2026
**Status:** ✅ Reorganized (Phase 3 complete)

---

## 📂 Directory Structure

This directory contains reusable skill modules following the AgentSkills specification. Each skill is self-contained with its own SKILL.md file, optional references/, and scripts/.

### Categories (10 total)

```
3_Skills/
├── AI_ML/                  # AI & Machine Learning skills
├── Business/               # Business operations skills
├── Development/            # Software development skills
├── Security/               # Security & compliance skills
├── Data/                   # Data science & analytics skills
├── Content/                # Content creation & documentation
├── Finance/                # Financial analysis skills
├── Enterprise/             # Enterprise-specific skills
├── Design/                 # Design & game design skills
└── Platform_Integrations/  # Platform/tool-specific skills
```

---

## 📊 Statistics

- **Total Skills:** 256 (all SKILL.md files, counted 2026-10-26)
- **Categories:** 10 (reduced from 26)

### Skills by Category

| Category | Skills | Description |
|----------|--------|-------------|
| Development | 74 | DevOps, Git, Cloud, Mobile, Blockchain, Engineering |
| Finance | 46 | Financial analysis, prediction markets |
| Content | 30 | Documentation, writing, productivity, video |
| Business | 29 | Marketing, product strategy, operations, analytics |
| Data | 19 | Data science, analytics |
| Platform_Integrations | 15 | Linear, Notion, n8n, Feishu, Academy |
| Security | 14 | Security testing, compliance |
| Enterprise | 12 | Communications, governance |
| AI_ML | 11 | AI engineering, MCP, prompting |
| Design | 6 | UI/UX, diagrams, frontend taste, game design |

---

## 🎯 Category Consolidations

### Development (Merged from 7 categories)
- DevOps
- Development
- Engineering
- Git
- Mobile_Dev
- Cloud_Computing
- Blockchain_Web3
- Tools
- Other

### Data (Merged from 2 categories)
- Data_Science
- Science

### Content (Merged from 4 categories)
- Documentation
- Writing
- Productivity
- Video

### Design (Merged from 2 categories)
- Design
- Game_Design

### Finance (Merged from 2 categories)
- Finance
- Prediction_Markets

---

## 📝 Skill Format

All skills follow the AgentSkills specification:

```
skill-name/
├── SKILL.md          # Main skill definition
├── references/       # Optional reference docs
│   └── example.md
└── scripts/          # Optional automation scripts
    └── helper.sh
```

**SKILL.md structure:**
```markdown
---
title: "Skill Name"
tags: ["tag1", "tag2"]
category: "Skills"
subcategory: "AI_ML|Business|Development|etc."
---

# Skill Name

## Overview
[What this skill does]

## Prerequisites
[Required dependencies]

## Usage
[How to use the skill]

## Examples
[Sample usage]
```

---

## 🔍 Finding Skills

### By Development Area
- **Git:** `Development/Git/`
- **CI/CD:** `Development/CI_CD/`
- **Cloud:** `Development/Cloud/`
- **Mobile:** `Development/Mobile/`
- **Blockchain:** `Development/Blockchain/`

### By Business Function
- **Marketing:** `Business/Marketing/`
- **Analytics:** `Business/analytics-tracking/`
- **Product:** `Business/product-strategist/`

### By Data Work
- **Analysis:** `Data/analysis/`
- **Visualization:** `Data/visualization/`
- **ML Ops:** `Data/ml-ops/`

---

## 🆕 What Changed

### Eliminated Categories
- ❌ AI_Engineering (moved to AI_ML)
- ❌ DevOps (merged into Development)
- ❌ Engineering (merged into Development)
- ❌ Git (moved to Development/Git)
- ❌ Mobile_Dev (moved to Development/Mobile)
- ❌ Cloud_Computing (moved to Development/Cloud)
- ❌ Blockchain_Web3 (moved to Development/Blockchain)
- ❌ Data_Science (renamed to Data)
- ❌ Documentation (merged into Content)
- ❌ Writing (merged into Content)
- ❌ Productivity (merged into Content)
- ❌ Video (merged into Content)
- ❌ Game_Design (merged into Design)
- ❌ Prediction_Markets (merged into Finance)
- ❌ Tools (merged into Development)
- ❌ Other (merged into Development)
- ❌ Science (merged into Data)
- ❌ packs (content distributed)

### New Organization
- ✅ 10 clear categories
- ✅ Consistent naming
- ✅ Logical grouping
- ✅ No "Other" folder

---

## 🔧 Special Notes

### SKILL.md Files
Skills may have nested directory structures. The SKILL.md file defines the skill and may reference:
- `references/` - Documentation and examples
- `scripts/` - Automation scripts and helpers

### Path References
Some SKILL.md files contain relative paths to references or scripts. These paths are preserved during migration.

---

## 📖 Related

- **Agents:** `../2_Agents/` - Installable subagent definitions
- **Prompts:** `../4_Prompts/` - Prompt templates
- **Guides:** `../1_Guides/` - Tool documentation

---

**Migration Date:** March 31, 2026  
**Previous Structure:** `../Skills/` (archived)  
**Skills Migrated:** 298
