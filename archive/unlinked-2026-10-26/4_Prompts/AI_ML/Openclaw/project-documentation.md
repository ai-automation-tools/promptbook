---
title: "🛠️ Project Documentation"
tags: ["ai-tools", "openclaw-prompts", "project", "documentation"]
category: "AI_Tools"
subcategory: "OpenClaw_Prompts"
---
# Project Documentation Prompt

**Category:** Documentation  
**Use Case:** Generating comprehensive project documentation  
**Based on:** Work completed 2026-02-14

---

## Prompt

```
I need comprehensive documentation for the {PROJECT_NAME} project.

**Project Location:** {PROJECT_PATH}
**Repository:** {GITHUB_URL}
**Purpose:** {PROJECT_DESCRIPTION}

Please create the following documentation in the project's openclaw/ folder:

1. **PROJECT.md** - Project overview
   - Quick commands
   - Repository details
   - Project structure
   - Key information table

2. **requirements.md** - Dependencies and setup
   - System requirements
   - Installation steps
   - Environment variables
   - External services

3. **workflows.md** - Common tasks and workflows
   - Development workflow
   - Testing procedures
   - Build process
   - Deployment steps

4. **automations.md** - Scheduled jobs and automation
   - Cron jobs (if any)
   - GitHub Actions
   - Automated processes

5. **processes.md** - Team procedures
   - Code review process
   - Release process
   - Issue management
   - Documentation updates

Include:
- Clear examples and code snippets
- Quick reference tables
- Directory structure diagrams
- Troubleshooting sections

Make it practical and easy to navigate.
```

---

## Example Usage

```
I need comprehensive documentation for the heartland-table project.

**Project Location:** ~/.openclaw/workspace/projects/midwest-cookbook/
**Repository:** https://github.com/michaelschecht/heartland-table
**Purpose:** Standalone Midwest cookbook - recipes, design, and print production

Please create the following documentation in the project's openclaw/ folder:

1. **PROJECT.md** - Project overview
2. **requirements.md** - Dependencies and setup
3. **workflows.md** - Common tasks (editing recipes, building PDFs, etc.)
4. **automations.md** - Any scheduled jobs
5. **processes.md** - Publishing workflow

Include:
- Quick commands for building the cookbook
- Directory structure
- File naming conventions
- Troubleshooting guide

Make it practical and easy to navigate.
```

---

## Environment Reference Prompt

For a complete system environment reference (like we created today):

```
I need a comprehensive environment reference document that covers my entire OpenClaw setup.

Include:
1. **Directory Structure** - All important file locations
2. **Agents** - All agents with models, workspaces, credentials
3. **Workspaces** - Layout and purpose of each workspace
4. **Projects** - All projects with paths and details
5. **Configuration Files** - Where everything is configured
6. **Credentials** - Complete credential architecture
7. **Scripts** - All automation scripts
8. **Documentation** - Docs folder structure
9. **Git Repositories** - All repos with workflows
10. **Cron Jobs** - All scheduled jobs with details
11. **MCP Servers** - All servers, tools, auth methods
12. **Skills** - All available skills
13. **Helper Commands** - Quick reference for common tasks
14. **Quick Lookup Tables** - Everything in one place

Save to: ~/.openclaw/workspace/docs/environment-reference.md

Make it searchable and comprehensive - a single source of truth for finding anything.
```

---

## Variables to Replace

| Variable | Description | Example |
|----------|-------------|---------|
| `{PROJECT_NAME}` | Project identifier | "heartland-table" |
| `{PROJECT_PATH}` | Local directory | "~/.openclaw/workspace/projects/midwest-cookbook" |
| `{GITHUB_URL}` | Repository URL | "https://github.com/user/repo" |
| `{PROJECT_DESCRIPTION}` | What it does | "Midwest cookbook with recipes and design" |

---

## Documentation Standards

### PROJECT.md Should Include
- Quick info table (ID, name, status, repo, etc.)
- Quick commands (most-used operations)
- Project structure diagram
- Links to other docs

### requirements.md Should Include
- System requirements (OS, Node version, etc.)
- Dependencies (npm, system packages)
- Environment variables needed
- Setup instructions

### workflows.md Should Include
- Common development tasks
- Step-by-step procedures
- Code examples
- Troubleshooting tips

### automations.md Should Include
- Cron jobs (schedule, purpose, workflow)
- CI/CD pipelines
- Automated backups
- Scheduled tasks

### processes.md Should Include
- Team workflows
- Review procedures
- Release process
- Documentation maintenance

---

## Example Structure

```
projects/{project-name}/
├── repo/                  # Git repository (local only)
├── openclaw/             # OpenClaw docs (synced to workspace)
│   ├── PROJECT.md
│   ├── requirements.md
│   ├── workflows.md
│   ├── automations.md
│   ├── processes.md
│   └── resources/
│       └── README.md
└── {other-folders}/       # Project-specific
```

---

## Related Prompts

- `environment-reference.md` - System-wide reference
- See `docs/environment-reference.md` for full example

---

## Tips

- Keep it updated as project evolves
- Use tables for quick reference
- Include real command examples
- Add troubleshooting sections
- Link related docs together
- Make it searchable (good headers)
