# Skill Packs Documentation

Complete guide to the Skill Packs feature - curated collections of related skills for specific domains and workflows.

---

## Overview

Skill Packs are pre-configured bundles of related skills designed for specific use cases. Users can browse packs, view included skills, add packs to **My Library**, remove packs from **My Library**, and download complete packages as ZIP files for offline use.

**Current Packs:**
- 💻 [Developer Essentials Pack](#developer-essentials-pack) (10 skills)
- 💰 [Finance & Portfolio Management Pack](#finance--portfolio-management-pack) (13 skills)
- 📋 [Project Management & Productivity Pack](#project-management--productivity-pack) (10 skills)

---

## Architecture

### Frontend
- **Location:** `src/components/SkillPacksView.tsx`
- **Features:**
  - Grid view of all packs
  - Detailed pack view with skill list
  - Download ZIP functionality
  - Loading states and error handling
  - Dark mode support

### Backend

**Local Development:**
- **Handler:** `api/skill-packs.ts` — a Vercel function of its own (`vercel.json` routes
  `/api/skill-packs/*` to it). Dev mounts the same handler; there is no separate Express router.
- Used when running `npm run dev`

**Production (Vercel):**
- **Serverless Function:** `api/skill-packs.ts`
- Each deployment bundles Skills library via `includeFiles` in `vercel.json`

### API Endpoints

**GET /api/skill-packs?library=public|my**
- Lists packs by library mode (summary)
- `public`: all available packs
- `my`: packs added to My Library (any My Library prompt tagged `skill-pack:<packId>`)
- Returns: Array of pack metadata

**GET /api/skill-packs/:packId**
- Gets full pack details with resolved skill metadata
- Returns: Complete pack object with skills array

**POST /api/skill-packs/:packId/add-to-library**
- Adds a pack to My Library (auth required)
- Imports pack skills into user prompts with pack tag `skill-pack:<packId>`
- Requires explicit confirmation payload: `{ "confirm": true }`

**DELETE /api/skill-packs/:packId/remove-from-library**
- Removes a pack from My Library (auth required)
- Deletes imported pack skills tagged with `skill-pack:<packId>`
- Requires explicit confirmation payload: `{ "confirm": true }`

**GET /api/skill-packs/:packId/download**
- Downloads pack as ZIP file
- Includes all skill files (SKILL.md, scripts/, references/, etc.)
- Returns: ZIP stream

---

## Pack Manifests

Packs are defined as JSON files in `library/3_Skills/packs/`.

### Location
```
library/3_Skills/packs/
├── development/developer-essentials-pack.json
├── documentation/writing-documentation-pack.json
└── finance/prediction-markets-pack.json
```

### Manifest Format

```json
{
  "name": "Pack Name",
  "id": "pack-id-lowercase",
  "description": "What this pack provides...",
  "icon": "💻",
  "version": "1.0.0",
  "author": "promptbook",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Category",
  "skills": [
    {
      "path": "library/3_Skills/Category/skill-name/SKILL.md",
      "name": "Skill Name",
      "description": "What this skill does"
    }
  ],
  "prerequisites": {
    "required_tools": ["tool1", "tool2"],
    "optional_tools": ["tool3"],
    "recommended_knowledge": ["Knowledge area 1", "Knowledge area 2"]
  },
  "installation_notes": "Important setup information...",
  "use_cases": [
    "Use case 1",
    "Use case 2"
  ],
  "related_packs": ["other-pack-id"],
  "created_at": "2026-03-28",
  "updated_at": "2026-03-28"
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Human-readable pack name |
| `id` | string | Unique identifier (lowercase-with-hyphens) |
| `description` | string | Brief description of pack purpose |
| `icon` | string | Emoji icon for visual identity |
| `version` | string | Semantic version (e.g., "1.0.0") |
| `author` | string | Pack creator |
| `tags` | array | Keywords for filtering/search |
| `category` | string | Primary category |
| `skills` | array | List of included skills |
| `prerequisites` | object | Required/optional tools and knowledge |
| `installation_notes` | string | Setup instructions |
| `use_cases` | array | Common applications |
| `related_packs` | array | Related pack IDs |
| `created_at` | string | Creation date (YYYY-MM-DD) |
| `updated_at` | string | Last update date (YYYY-MM-DD) |

---

## How to Add a New Pack

### Step 1: Create Pack Manifest

Create a new JSON file in `library/3_Skills/packs/`:

```bash
cd library/3_Skills/packs
touch my-new-pack.json
```

### Step 2: Define Pack Structure

```json
{
  "name": "My New Pack",
  "id": "my-new-pack",
  "description": "A collection of skills for...",
  "icon": "🚀",
  "version": "1.0.0",
  "author": "promptbook",
  "tags": ["tag1", "tag2"],
  "category": "Development",
  "skills": [],
  "prerequisites": {
    "required_tools": [],
    "optional_tools": [],
    "recommended_knowledge": []
  },
  "installation_notes": "Setup instructions here...",
  "use_cases": [
    "Use case 1"
  ],
  "related_packs": [],
  "created_at": "2026-03-28",
  "updated_at": "2026-03-28"
}
```

### Step 3: Add Skills

Find skills to include:

```bash
# List all available skills
find library/3_Skills -name "SKILL.md" -type f
```

Add each skill to the `skills` array:

```json
{
  "path": "library/3_Skills/Development/Git/gh-address-comments/SKILL.md",
  "name": "GitHub PR Comment Handler",
  "description": "Address review comments on GitHub PRs"
}
```

**Important:** Use relative paths from the repo root.

### Step 4: Test Locally

```bash
# Start dev server
npm run dev

# Visit http://localhost:3010
# Navigate to Skill Packs tab
# Your new pack should appear
```

### Step 5: Commit and Deploy

```bash
git add library/3_Skills/packs/my-new-pack.json
git commit -m "Add My New Pack skill pack"
git push origin main
```

Vercel will automatically deploy your new pack.

---

## How to Modify an Existing Pack

### Update Pack Metadata

Edit the JSON file directly:

```bash
# Open pack file
nano library/3_Skills/packs/developer-essentials-pack.json
```

Common updates:
- Change description
- Update version number
- Add/remove tags
- Update installation notes

### Add Skills to Pack

1. Find the skill path:
```bash
find library/3_Skills -name "SKILL.md" | grep "skill-name"
```

2. Add to `skills` array:
```json
{
  "path": "library/3_Skills/Category/new-skill/SKILL.md",
  "name": "New Skill Name",
  "description": "What it does"
}
```

3. Increment version:
```json
"version": "1.1.0",
"updated_at": "2026-03-28"
```

### Remove Skills from Pack

1. Remove skill entry from `skills` array
2. Decrement `skillCount` is auto-calculated, so no manual update needed
3. Update version and date

### Update Prerequisites

Modify the `prerequisites` object:

```json
"prerequisites": {
  "required_tools": ["git", "node", "docker"],
  "optional_tools": ["kubernetes"],
  "recommended_knowledge": ["JavaScript", "Linux basics"]
}
```

---

## Pack Guidelines

### Choosing Skills

**Good Pack Criteria:**
- 5-15 skills (not too few, not overwhelming)
- Clear, focused theme
- Skills work well together
- Cover a complete workflow or domain
- Useful for a specific audience

**Bad Pack Criteria:**
- Too few skills (< 5)
- Too many skills (> 20)
- Unrelated/random skills
- Duplicate functionality
- Missing critical skills for workflow

### Naming Conventions

**Pack ID:**
- Lowercase with hyphens
- Descriptive and concise
- Example: `web-development-pack`, `data-science-essentials`

**Pack Name:**
- Title case
- Include "Pack" suffix
- Example: "Web Development Pack", "Data Science Essentials Pack"

### Icons

Choose relevant emoji:
- 💻 Development/Programming
- 💰 Finance/Money
- 📋 Planning/Organization
- 🎨 Design/Creative
- 🔐 Security
- ☁️ Cloud/Infrastructure
- 📊 Data/Analytics
- 🤖 AI/ML
- 📱 Mobile

### Categories

Use existing top-level categories:
- Development
- Finance
- Productivity
- Engineering
- Business
- Security
- Science
- Documentation

---

## Testing Packs

### Local Testing

1. **Start dev server:**
```bash
npm run dev
```

2. **Check pack appears:**
- Navigate to http://localhost:3010
- Click "Skill Packs" tab
- Verify pack is listed

3. **Test pack details:**
- Click on your pack
- Verify all skills load
- Check prerequisites display
- Read installation notes

4. **Test download:**
- Click "Download ZIP"
- Extract ZIP file
- Verify all skill files included

### Pre-Deploy Checklist

- [ ] Valid JSON (no syntax errors)
- [ ] All required fields present
- [ ] All skill paths are correct
- [ ] All referenced skills exist
- [ ] Version number updated
- [ ] Dates updated
- [ ] Prerequisites accurate
- [ ] Use cases clear and relevant
- [ ] Installation notes helpful
- [ ] Pack tested locally

---

## Troubleshooting

### Pack Doesn't Appear

**Check:**
1. JSON syntax is valid
2. File is in `library/3_Skills/packs/` directory
3. File ends with `.json`
4. File is committed to git
5. Dev server restarted

### Skills Missing in ZIP

**Check:**
1. Skill paths are correct (use `find` to verify)
2. Skill directories exist
3. SKILL.md files present
4. Files committed to git

### Skills Show Errors

**Check:**
1. Skill paths match exactly (case-sensitive)
2. SKILL.md files have valid frontmatter
3. Skills aren't in excluded directories

---

## API Usage

### Get All Packs

```bash
curl https://promptbook-demo.ai-automation-tools.dev/api/skill-packs
```

Response:
```json
[
  {
    "id": "developer-essentials-pack",
    "name": "Developer Essentials Pack",
    "description": "Complete toolkit for modern full-stack development...",
    "icon": "💻",
    "version": "1.0.0",
    "skillCount": 10,
    "tags": ["development", "git", "api"],
    "category": "Development"
  }
]
```

### Get Pack Details

```bash
curl https://promptbook-demo.ai-automation-tools.dev/api/skill-packs/developer-essentials-pack
```

### Download Pack

```bash
curl -O https://promptbook-demo.ai-automation-tools.dev/api/skill-packs/developer-essentials-pack/download
```

---

## Existing Packs

### Developer Essentials Pack

**ID:** `developer-essentials-pack`  
**Skills:** 10  
**Focus:** Full-stack web development

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

**Best for:** Full-stack developers, DevOps engineers, open-source contributors

---

---

---

## Future Enhancements

**Planned:**
- Pack versioning with update notifications
- User ratings and reviews
- Pack dependencies (packs requiring other packs)
- Installation tracking and analytics
- Pack collections (meta-packs)
- Auto-generated packs based on skill usage patterns

**Not Planned (Current Scope):**
- User-created packs (only official/curated)
- In-app pack editing
- Pack marketplace

---

## Questions?

- **Issues:** Open GitHub issue with `skill-packs` label
- **Feature Requests:** Use `enhancement` label
- **Documentation:** See [main docs](../README.md)

---

**Last Updated:** March 28, 2026  
**Version:** 1.0  
**Maintained by:** OpenClaw AI Assistant
