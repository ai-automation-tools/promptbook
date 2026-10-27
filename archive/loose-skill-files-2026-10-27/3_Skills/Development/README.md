# Skill Packs

Curated collections of related skills for specific domains and workflows.

---

## Available Packs

### 💻 Developer Essentials Pack
**ID:** `developer-essentials-pack`  
**Skills:** 10

Complete toolkit for modern full-stack development including Git workflows, API design, web development, and database optimization.

**Includes:**
- GitHub PR Comment Handler
- Git Commit Helper
- GitHub Actions Creator
- Backend API Design
- React Component Generator
- Frontend Design
- Docker Compose Generator
- SQL Query Optimizer
- Next.js Best Practices
- Web App Testing

**Best for:** Full-stack developers, open-source contributors, DevOps engineers

---

### 💰 Finance & Portfolio Management Pack
**ID:** `finance-portfolio-pack`  
**Skills:** 13

Comprehensive wealth management and portfolio optimization toolkit covering asset allocation, risk management, performance analytics, and investment strategy.

**Includes:**
- Asset Allocation
- Portfolio Diversification
- Risk Management
- Financial Analysis
- Analyzing Financial Statements
- Performance Metrics
- Portfolio Rebalancing
- Tax Efficiency
- Equity Investing
- Corporate Fixed Income
- Alternative Investments
- Digital Assets
- Financial Modeling

**Best for:** Portfolio managers, financial advisors, personal investors, wealth managers

---

### 📋 Project Management & Productivity Pack
**ID:** `project-management-pack`  
**Skills:** 10

Essential tools for planning, executing, and organizing projects effectively including brainstorming, planning, execution frameworks, and file organization.

**Includes:**
- Brainstorming
- Plan Writing
- Concise Planning
- Executing Plans
- Think Tank
- File Organizer
- Skill Creator
- Skill Developer
- GitHub README Creator
- Documentation Templates

**Best for:** Project managers, team leads, independent developers, anyone managing complex projects

---

## Pack Structure

Each pack is defined in a JSON file with the following format:

```json
{
  "name": "Pack Name",
  "id": "pack-id",
  "description": "What this pack does",
  "icon": "📦",
  "version": "1.0.0",
  "author": "promptbook",
  "tags": ["tag1", "tag2"],
  "category": "Category",
  "skills": [
    {
      "path": "library/Skills/Category/skill-name/SKILL.md",
      "name": "Skill Name",
      "description": "What the skill does"
    }
  ],
  "prerequisites": {
    "required_tools": [],
    "optional_tools": [],
    "recommended_knowledge": []
  },
  "installation_notes": "Any notes about installing or using this pack",
  "use_cases": ["Use case 1", "Use case 2"],
  "related_packs": ["other-pack-id"],
  "created_at": "2026-03-28",
  "updated_at": "2026-03-28"
}
```

---

## Using Skill Packs

### In the Web App (Coming Soon)
1. Browse available packs
2. View pack details and included skills
3. Install entire pack to your library
4. Skills are copied to your personal collection

### Via API (Coming Soon)
```bash
# List all packs
GET /api/skill-packs

# Get specific pack
GET /api/skill-packs/:packId

# Install pack
POST /api/skill-packs/:packId/install
```

---

## Creating New Packs

Official skill packs are curated by the Promptbook team. To suggest a new pack:

1. Identify a common use case or domain
2. Select 5-15 related skills from the library
3. Create a pack manifest JSON file
4. Submit a pull request with:
   - Pack JSON file
   - Updated README listing
   - Rationale for the pack

**Pack Guidelines:**
- Clear, focused theme
- 5-15 skills (not too few, not overwhelming)
- Skills should work well together
- Cover a complete workflow or domain
- Useful for a specific audience

---

## Roadmap

**Current:** File-based official packs  
**Planned:**
- Web UI for browsing packs
- One-click pack installation
- Pack versioning and updates
- Pack analytics (installation counts, ratings)
- User-created packs (future phase)

---

## Questions?

See the main [documentation](../../../docs/) or open an issue on GitHub.

---

**Last Updated:** March 28, 2026  
**Pack Count:** 3
