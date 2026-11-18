# Featured Prompts

This document tracks which prompts are marked as "featured" and displayed in the Featured Prompts section on the landing page.

**Last Updated:** 2026-03-25

---

## Current Featured Prompts (March 2026)

### Agents Section (5 prompts)

1. **✍️ Technical Blog Post Architect**
   - Category: `Business/Documentation`
   - Tags: writing, technical, blog, post
   - Status: ✅ Featured

2. **⚙️ DevOps Engineer**
   - Category: `Developer/General`
   - Tags: devops, infrastructure, automation, ci-cd, cloud
   - Status: ✅ Featured

3. **👨‍💻 Prompt Engineer**
   - Category: `Developer/General`
   - Tags: prompt-engineering, ai, llm, optimization
   - Status: ✅ Featured

4. **🎨 Frontend Specialist**
   - Category: `Developer/General`
   - Tags: frontend, web-development, react, ui-ux
   - Status: ✅ Featured

5. **👨‍💻 Data Engineer**
   - Category: `Developer/General`
   - Tags: data-engineering, etl, data-pipelines, analytics
   - Status: ✅ Featured

### Prompt Library (7 MCP Server Collections + 2 Others)

6. **🚀 GitHub MCP Server Prompts** (15 prompts)
   - Category: `MCP_Servers/GitHub`
   - Contains: Repository operations, PR workflows, complex automation
   - Status: ✅ Featured

7. **🎭 Playwright MCP Server Prompts** (20 prompts)
   - Category: `MCP_Servers/Playwright`
   - Contains: Browser automation, testing, web scraping
   - Status: ✅ Featured

8. **🔍 Serper API MCP Server Prompts** (20 prompts)
   - Category: `MCP_Servers/Serper`
   - Contains: Search, SEO research, competitive analysis
   - Status: ✅ Featured

9. **📧 Google Workspace MCP Server Prompts** (20 prompts)
   - Category: `MCP_Servers/Google_Workspace`
   - Contains: Gmail, Drive, Calendar, Docs automation
   - Status: ✅ Featured

10. **🔄 n8n Workflow Automation MCP Server Prompts** (20 prompts)
    - Category: `MCP_Servers/N8n`
    - Contains: Workflow automation, data pipelines
    - Status: ✅ Featured

11. **🗄️ Supabase MCP Server Prompts** (20 prompts)
    - Category: `MCP_Servers/Supabase`
    - Contains: Database operations, auth, real-time features
    - Status: ✅ Featured

12. **🔥 Firebase MCP Server Prompts** (20 prompts)
    - Category: `MCP_Servers/Firebase`
    - Contains: Firestore, Cloud Functions, serverless
    - Status: ✅ Featured

13. **💼 Investor Pitch Deck**
    - Category: `Business/Documentation`
    - Status: ✅ Featured

14. **₿ Crypto Rotation & Dominance Report**
    - Category: `Finance/Crypto`
    - Status: ✅ Featured

### System Prompts (4 prompts)

_Changed 2026-11-18: Claude Cowork, GPT5 and Antigravity came from leak collections and were archived; Claude Sonnet 4.5's featured copy was a duplicate of a re-sourced file. These four, all from Anthropic's own release notes, replaced them._

15. **Claude Fable 5.2** (2026-11-09)
    - Category: `Anthropic`
    - Status: ✅ Featured

16. **Claude Opus 5.5** (2026-10-27)
    - Category: `Anthropic`
    - Status: ✅ Featured

17. **Claude Sonnet 5.5** (2026-10-27)
    - Category: `Anthropic`
    - Status: ✅ Featured

18. **Claude Haiku 5.5** (2026-10-26)
    - Category: `Anthropic`
    - Status: ✅ Featured

### Skills (1 prompt)

19. **🤖 Humanizer: Remove AI Writing Patterns**
    - Category: `Writing/General`
    - Status: ✅ Featured

### Agent Guides (2 prompts)

20. **💻 Claude Code CLI Guide**
    - Category: `Claude_Code`
    - Status: ✅ Featured

21. **💻 Codex CLI Guide**
    - Category: `Codex`
    - Status: ✅ Featured

---

## Total Count

**21 Featured Prompts** across 5 sections:
- **Agents:** 5 prompts
- **Prompt Library:** 9 collections (7 MCP servers + 2 others)
- **System Prompts:** 4 prompts
- **Skills:** 1 prompt
- **Agent Guides:** 2 prompts

**Total individual prompts in MCP collections:** 135 prompts
- GitHub: 15
- Playwright: 20
- Serper: 20
- Google Workspace: 20
- n8n: 20
- Supabase: 20
- Firebase: 20

---

## Recent Changes (March 25, 2026)

### Added
- 7 comprehensive MCP server prompt libraries (135 total prompts)
- Emojis to all featured prompt titles for better visual identification
- Performance optimizations (pagination, prebuilt index)

### Updated
- Featured Agents section: Now focused on developer/technical roles
  - Technical Blog Post Architect
  - DevOps Engineer
  - Prompt Engineer
  - Frontend Specialist
  - Data Engineer

### Removed from Featured
- LeBron James (Characters/Athletes)
- Barack Obama (Characters/Politicians)
- Security Analyst (Enterprise/SMEs)

---

## How to Feature a Prompt

### Method: Tag-Based (Current Implementation)
Add `"featured"` to the tags array in prompt frontmatter:

```yaml
---
title: "🎯 Your Prompt Title"
tags: ["featured", "other-tag", "category"]
category: "Category"
subcategory: "Subcategory"
---
```

### Emoji Guidelines
All featured prompts should have an emoji in the title for better visual identification:

**Common Emojis by Category:**
- Business/Finance: 💼 📊 💰 ₿ 📈
- Developer/Tech: 👨‍💻 💻 ⚙️ 🎨 📊 🔧
- Writing/Content: ✍️ 📝 📄 📚
- AI/Models: 🧠 🤖 ✨ 🚀
- MCP Servers: 🚀 🎭 🔍 📧 🔄 🗄️ 🔥
- Guides/Skills: 📖 🛠️ 💻 ⌨️

---

## Featured Prompts Display Logic

**Code Location:** the `featuredPrompts` memo in `src/App.tsx`; the grid itself is
`PromptCardGrid` from `src/components/PromptGrid.tsx`, rendered with `columns="featured"`.

**Display on Landing Page:**
- Shows 4 featured prompts per section when no search/filter is active
- Grid layout: responsive (1 col mobile → 4 cols desktop)
- Special styling: Star badge, accent border, hover glow

**Filtering:** favorited prompts count as featured, and a section with neither falls back
to its four most recently modified prompts, so the row is never empty:
```typescript
const featuredPrompts = useMemo(() => {
  const featured = sectionPrompts
    .filter(p => p.tags.includes('featured') || favorites.includes(p.id))
    .slice(0, 4);

  if (featured.length === 0) {
    return sectionPrompts
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 4);
  }

  return featured;
}, [sectionPrompts, favorites]);
```

**Pagination:**
- Featured prompts appear on page 1 by default
- Total results are paginated at 50 prompts per page
- Navigation controls: Previous/Next with page indicators

---

## Best Practices

### Selection Criteria
- ✅ **High Quality**: Well-written, comprehensive, useful
- ✅ **Representative**: Shows variety across categories
- ✅ **Includes Emoji**: Title has appropriate emoji
- ✅ **Up-to-Date**: Recently created or reviewed
- ✅ **Diverse**: Mix of categories and use cases
- ✅ **Collections**: MCP server collections should include 10+ examples

### Emoji Selection
- Choose emojis that represent the content/category
- Keep consistent within categories
- Use common, recognizable emojis
- Avoid complex or obscure emojis

### Display Balance
- Maintain 4-6 featured prompts per major section
- Rotate seasonally or when new high-quality content added
- Keep at least 2-3 "evergreen" featured prompts
- Feature new collections to drive discovery

---

## Performance Considerations

**Index Pre-building:**
- Featured prompts are included in the prebuilt prompt index
- Index regenerates on each deployment
- Reduces cold start time from 2-5s to <100ms

**Pagination Impact:**
- Featured prompts load with first page (50 items)
- No performance penalty for featured status
- Index includes 200-char content preview

---

## Notes

- Featured prompts appear on **landing page only** (not in search/filtered views)
- The app limits display to **4 featured prompts** per view
- Featured status does NOT affect search or filtering functionality
- All featured prompts should include emojis in titles
- Large prompt collections (10+ prompts) are preferred for MCP servers

---

## Changelog

### 2026-03-25
- **Major Update**: Complete refresh of featured prompts
- Added 7 MCP server prompt collections (135 prompts total)
- Added emojis to all featured prompt titles
- Updated Agents section with technical/developer focus
- Removed character-based prompts from featured
- Updated documentation with current state
- Added performance optimization notes

### 2026-03-17
- Initial documentation created
- Listed 18 current featured prompts across 5 sections
- Added instructions for featuring/unfeaturing prompts
