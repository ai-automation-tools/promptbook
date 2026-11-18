# 5_System_Prompts - Platform System Prompts

**Last Updated:** March 31, 2026  
**Status:** ✅ Reorganized (Phase 5 complete)

---

## 📂 Directory Structure

This directory contains system prompts from various AI platforms and tools. These are the actual prompts that platforms use internally to configure their AI behavior.

### Organization

```
5_System_Prompts/
├── Anthropic/              # Claude system prompts
├── OpenAI/                 # GPT system prompts
├── Google/                 # Gemini system prompts
├── Cursor/                 # Cursor AI IDE prompts
├── Windsurf/               # Windsurf Cascade prompts
├── DeepSeek/               # DeepSeek AI prompts
├── Mistral/                # Mistral AI prompts
├── Copilot/                # GitHub Copilot prompts
├── Perplexity/             # Perplexity AI prompts
├── Meta/                   # Meta AI (Llama) prompts
├── Microsoft/              # Microsoft Copilot prompts
├── [30+ more platforms]    # Other AI platforms
└── Misc/                   # Miscellaneous & general prompts
```

---

## 📊 Statistics

- **Total Files:** 118 (reduced from 142)
- **Platforms:** 39
- **Duplicates Eliminated:** 24 files
- **Structure Simplified:** 2 duplicate folders merged into 1

### Files by Platform (Top 10)

| Platform | Files | Description |
|----------|-------|-------------|
| OpenAI | 15+ | GPT-4, ChatGPT system prompts |
| Anthropic | 12+ | Claude system prompts |
| Google | 10+ | Gemini system prompts |
| Cursor | 8+ | Cursor AI IDE prompts |
| Windsurf | 6+ | Windsurf Cascade prompts |
| DeepSeek | 5+ | DeepSeek AI prompts |
| Mistral | 4+ | Mistral AI prompts |
| Copilot | 4+ | GitHub Copilot prompts |
| Microsoft | 3+ | Microsoft Copilot prompts |
| Others | 51+ | Various platforms |

---

## 🎯 Consolidation Completed

### What Changed

**Before (Messy):**
```
System_Prompts/
├── Anthropic/           ← Main folders
├── Openai/
├── Google/
├── Cursor.Com/
├── Codeium/
└── [30 more platforms]
│
└── Llm_Instructions/    ← DUPLICATE STRUCTURE
    ├── Anthropic/ ❌    (duplicates!)
    ├── OpenAI/ ❌
    ├── Google/ ❌
    ├── Cursor/ ❌
    └── [20 more duplicates]
│
├── General/ ❌          (vague)
└── Other/ ❌            (anti-pattern)
```

**After (Clean):**
```
5_System_Prompts/
├── Anthropic/           # Merged duplicates
├── OpenAI/              # Merged duplicates
├── Google/              # Merged duplicates
├── Cursor/              # Renamed from Cursor.Com, merged
├── Windsurf/            # Renamed from Codeium, merged
├── DeepSeek/            # Standardized capitalization
├── Mistral/             # Merged duplicates
├── Perplexity/          # Renamed from Perplexity.Ai
├── Meta/                # Renamed from Meta.Ai
└── [30+ platforms alphabetized]
```

### Eliminated

- ❌ **Llm_Instructions/** folder (24 duplicate files merged)
- ❌ **General/** folder (moved to Misc/)
- ❌ **Other/** folder (moved to Misc/)
- ❌ Confusing names (Cursor.Com → Cursor, Codeium → Windsurf)
- ❌ Inconsistent capitalization (Openai → OpenAI, Deepseek → DeepSeek)

---

## 📝 File Purpose

System prompts show how platforms configure AI behavior:

**Use Cases:**
- 🔍 **Research:** Understand platform approaches
- 📚 **Learning:** Study best practices in prompt engineering
- 🔬 **Comparison:** Compare different platforms' strategies
- 💡 **Inspiration:** Get ideas for custom agents

**Not for:**
- ❌ Direct usage (these are platform-specific)
- ❌ Copy-paste (copyright considerations)
- ❌ Production deployment (use proper APIs)

---

## 🔍 Finding System Prompts

### By Platform

**AI Assistants:**
- **Claude:** `Anthropic/`
- **ChatGPT:** `OpenAI/`
- **Gemini:** `Google/`
- **Copilot:** `Copilot/` or `Microsoft/`
- **Perplexity:** `Perplexity/`

**Coding Tools:**
- **Cursor:** `Cursor/`
- **Windsurf:** `Windsurf/`
- **Copilot:** `Copilot/`
- **Augment:** `Augment_Code/`
- **opencode:** `OpenCode/`
- **goose:** `Goose/`

**Other Platforms:**
- **DeepSeek:** `DeepSeek/`
- **Mistral:** `Mistral/`
- **Meta/Llama:** `Meta/`
- **Gemini Gems:** `Gemini_Gems/`
- **xAI:** `Xai/`
- **Hugging Face (smolagents):** `HuggingFace/`

### By Use Case

**General Research:**
Browse `Misc/` for general patterns and approaches

**Platform Comparison:**
Compare similar files across different platform folders

**Specific Feature:**
Search across all folders for specific capabilities

---

## 🎨 Platform Naming Conventions

For consistency, platforms are named:

- ✅ **Clear names:** `Cursor` not `Cursor.Com`
- ✅ **Proper case:** `OpenAI` not `Openai`
- ✅ **Product names:** `Windsurf` not `Codeium` (for Cascade)
- ✅ **Alphabetized:** Easy to scan and find

---

## 📖 Related

- **Guides:** `../1_Guides/` - How to use these platforms
- **Agents:** `../2_Agents/` - Agent definitions
- **Prompts:** `../4_Prompts/` - User prompt templates

---

## 💡 Using These System Prompts

### For Learning

1. **Study structure:** How do platforms organize instructions?
2. **Note patterns:** Common approaches across platforms
3. **Understand constraints:** How platforms set boundaries
4. **Learn techniques:** Effective prompt engineering

### For Inspiration

1. **Adapt ideas:** Take concepts, not exact text
2. **Understand goals:** What outcomes are platforms optimizing for?
3. **Study tone:** How different platforms communicate
4. **Note capabilities:** What tools/features are exposed

### Best Practices

- ✅ Use for research and learning
- ✅ Understand platform approaches
- ✅ Inspire your own prompts
- ❌ Don't copy verbatim (copyright)
- ❌ Don't claim as your own
- ❌ Don't use for commercial products without permission

---

## 🔧 Platform Categories

### Major AI Labs
- Anthropic (Claude)
- OpenAI (GPT)
- Google (Gemini)
- Meta (Llama)
- DeepSeek
- Mistral

### Coding Assistants
- Cursor
- Windsurf (Cascade)
- GitHub Copilot
- Augment Code
- opencode
- goose

### Specialized Tools
- Perplexity (search)
- Phind (developer search)
- V0.Dev (UI generation)
- Bolt (full-stack)

### Enterprise/Productivity
- Microsoft Copilot
- Notion AI
- Atlassian Intelligence
- Canva AI

### Other Platforms
- Discord AI
- Proton AI
- Rabbit R1
- Venice AI
- Quillbot
- And more...

---

## 🆕 What Changed

### Consolidation Stats

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Top-level folders | 32 | 39 | +7 (unique platforms from Llm_Instructions) |
| Duplicate structures | 2 | 1 | -50% |
| Total files | 142 | 118 | -24 duplicates |
| "Other" folders | 2 | 0 | -100% |
| Clear naming | Partial | Complete | ✅ |

---

## 📚 Maintenance

### Adding New Platform Prompts

1. Create folder with clear platform name (e.g., `NewPlatform/`)
2. Add system prompt files with descriptive names
3. Include metadata about version/date if available
4. Update this README

### Updating Existing Prompts

- Note version/date changes in commit messages
- Keep old versions in git history
- Document major changes

---

**Migration Date:** March 31, 2026  
**Previous Structure:** `../System_Prompts/` (archived)  
**Files Migrated:** 118 (24 duplicates eliminated)  
**Platforms:** 39
