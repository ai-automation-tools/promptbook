---
title: "softaworks/agent-toolkit"
description: "A curated collection of skills for AI coding agents. Skills are packaged instructions and scripts that extend agent capabilities across development, documentation, planning, and professional workflows."
repo: softaworks/agent-toolkit
tags: ["skill","skill-library","enterprise","ai-ml"]
---
# softaworks/agent-toolkit

A curated collection of skills for AI coding agents. Skills are packaged instructions and scripts that extend agent capabilities across development, documentation, planning, and professional workflows.

A skill library: browse and install its skills from [the repo on GitHub](https://github.com/softaworks/agent-toolkit). Promptbook keeps one card for it rather than a copy of each skill.

---

*The repo's README, copied 2026-10-27:*

# Softaworks Agent Skills

Opinionated skills shared by [@leonardocouy](https://github.com/leonardocouy) for improving daily work efficiency with Claude Code. Skills are packaged instructions and scripts that extend agent capabilities across development, documentation, planning, and professional workflows.

Skills follow the [Agent Skills](https://agentskills.io/) format.

---

## 🧭 Quick Navigation

**[🚀 Installation](#-installation)** • **[📚 Available Skills](#-available-skills)** • **[🤖 Agents & Commands](#-agents--commands)** • **[📖 Skill Structure](#-skill-structure)** • **[🤝 Contributing](#-contributing)** • **[📄 License](#-license)** • **[🔗 Links](#-links)**

---

## 🚀 Installation

### Quick Install (Recommended)

```bash
npx skills add softaworks/agent-toolkit
```

This method works with multiple AI coding agents (Claude Code, Codex, Cursor, AdaL, etc.)

### Register as Plugin Marketplace

Run the following commands in Claude Code:

```bash
/plugin marketplace add softaworks/agent-toolkit
/plugin
```

### Install Plugins

**Option 1: Via Browse UI**

1. Switch to **Marketplaces** tab (use arrow keys or Tab)
2. Select **agent-toolkit**, press Enter
3. Browse and select the plugin(s) you want to install
4. Select **Install now**

**Option 2: Direct Install**

```bash
# Install specific skill
/plugin install codex@agent-toolkit
/plugin install humanizer@agent-toolkit

# Install specific agent
/plugin install agent-codebase-pattern-finder@agent-toolkit

# Install specific command
/plugin install command-codex-plan@agent-toolkit
```

**Option 3: Ask the Agent**

Simply tell Claude Code:

> Please install Skills from github.com/softaworks/agent-toolkit

### Available Plugins

Each skill, agent, and command is an individual plugin that can be installed separately:

- **Skills** → See [Available Skills](#-available-skills) for the full list
- **Agents** → See [Agents](#agents) (install as `agent-<name>@agent-toolkit`)
- **Commands** → See [Slash Commands](#slash-commands) (install as `command-<name>@agent-toolkit`)

### Update Plugins

To update plugins to the latest version:

1. Run `/plugin` in Claude Code
2. Switch to **Marketplaces** tab
3. Select **agent-toolkit**
4. Choose **Update marketplace**

You can also **Enable auto-update** to get the latest versions automatically.

### Manual Installation

**For Claude Code (Manual)** — Skills only
```bash
cp -r skills/<skill-name> ~/.claude/skills/
```

**For claude.ai** — Skills only

Add skills to project knowledge or paste SKILL.md contents into the conversation.

---

## 📚 Available Skills

| Category | Skill | Description |
|----------|-------|-------------|
| 🤖 AI Tools | [codex](https://github.com/softaworks/agent-toolkit/blob/main/skills/codex/README.md) | Advanced code analysis with GPT-5.2 |
| 🤖 AI Tools | [gemini](https://github.com/softaworks/agent-toolkit/blob/main/skills/gemini/README.md) | Large-scale review (200k+ context) |
| 🤖 AI Tools | [perplexity](https://github.com/softaworks/agent-toolkit/blob/main/skills/perplexity/README.md) | Web search & research |
| 🔮 Meta | [agent-md-refactor](https://github.com/softaworks/agent-toolkit/blob/main/skills/agent-md-refactor/README.md) | Refactor bloated agent instruction files |
| 🔮 Meta | [command-creator](https://github.com/softaworks/agent-toolkit/blob/main/skills/command-creator/README.md) | Create Claude Code slash commands |
| 🔮 Meta | [plugin-forge](https://github.com/softaworks/agent-toolkit/blob/main/skills/plugin-forge/README.md) | Build Claude Code plugins & manifests |
| 🔮 Meta | [skill-judge](https://github.com/softaworks/agent-toolkit/blob/main/skills/skill-judge/README.md) | Evaluate skill design quality |
| 📝 Documentation | [backend-to-frontend-handoff-docs](https://github.com/softaworks/agent-toolkit/blob/main/skills/backend-to-frontend-handoff-docs/README.md) | API handoff docs for frontend |
| 📝 Documentation | [c4-architecture](https://github.com/softaworks/agent-toolkit/blob/main/skills/c4-architecture/README.md) | C4 architecture diagrams with Mermaid |
| 📝 Documentation | [crafting-effective-readmes](https://github.com/softaworks/agent-toolkit/blob/main/skills/crafting-effective-readmes/README.md) | Write effective README files |
| 📝 Documentation | [draw-io](https://github.com/softaworks/agent-toolkit/blob/main/skills/draw-io/README.md) | Create & edit draw.io diagrams |
| 📝 Documentation | [excalidraw](https://github.com/softaworks/agent-toolkit/blob/main/skills/excalidraw/README.md) | Work with Excalidraw diagrams |
| 📝 Documentation | [frontend-to-backend-requirements](https://github.com/softaworks/agent-toolkit/blob/main/skills/frontend-to-backend-requirements/README.md) | Document API requirements |
| 📝 Documentation | [marp-slide](https://github.com/softaworks/agent-toolkit/blob/main/skills/marp-slide/README.md) | Professional presentation slides |
| 📝 Documentation | [mermaid-diagrams](https://github.com/softaworks/agent-toolkit/blob/main/skills/mermaid-diagrams/README.md) | Software diagrams with Mermaid |
| 📝 Documentation | [writing-clearly-and-concisely](https://github.com/softaworks/agent-toolkit/blob/main/skills/writing-clearly-and-concisely/README.md) | Clear, professional writing |
| 🎨 Design & Frontend | [design-system-starter](https://github.com/softaworks/agent-toolkit/blob/main/skills/design-system-starter/README.md) | Create design systems |
| 🎨 Design & Frontend | [mui](https://github.com/softaworks/agent-toolkit/blob/main/skills/mui/README.md) | Material-UI v7 patterns |
| 🎨 Design & Frontend | [openapi-to-typescript](https://github.com/softaworks/agent-toolkit/blob/main/skills/openapi-to-typescript/README.md) | Convert OpenAPI to TypeScript |
| 🎨 Design & Frontend | [react-dev](https://github.com/softaworks/agent-toolkit/blob/main/skills/react-dev/README.md) | Type-safe React 18-19 with TypeScript |
| 🎨 Design & Frontend | [react-useeffect](https://github.com/softaworks/agent-toolkit/blob/main/skills/react-useeffect/README.md) | React useEffect best practices |
| 🛠️ Development | [database-schema-designer](https://github.com/softaworks/agent-toolkit/blob/main/skills/database-schema-designer/README.md) | Design robust database schemas |
| 🛠️ Development | [dependency-updater](https://github.com/softaworks/agent-toolkit/blob/main/skills/dependency-updater/README.md) | Smart dependency management |
| 🛠️ Development | [naming-analyzer](https://github.com/softaworks/agent-toolkit/blob/main/skills/naming-analyzer/README.md) | Suggest better variable/function names |
| 🛠️ Development | [lesson-learned](https://github.com/softaworks/agent-toolkit/blob/main/skills/lesson-learned/README.md) | Extract SE lessons from recent code changes |
| 🛠️ Development | [reducing-entropy](https://github.com/softaworks/agent-toolkit/blob/main/skills/reducing-entropy/README.md) | Minimize codebase size |
| 🛠️ Development | [session-handoff](https://github.com/softaworks/agent-toolkit/blob/main/skills/session-handoff/README.md) | Seamless AI session transfers |
| 🎯 Planning | [game-changing-features](https://github.com/softaworks/agent-toolkit/blob/main/skills/game-changing-features/README.md) | Find 10x product opportunities |
| 🎯 Planning | [gepetto](https://github.com/softaworks/agent-toolkit/blob/main/skills/gepetto/README.md) | Detailed implementation planning |
| 🎯 Planning | [requirements-clarity](https://github.com/softaworks/agent-toolkit/blob/main/skills/requirements-clarity/README.md) | Clarify requirements before coding |
| 🎯 Planning | [ship-learn-next](https://github.com/softaworks/agent-toolkit/blob/main/skills/ship-learn-next/README.md) | Turn learning into actionable reps |
| 👔 Professional | [daily-meeting-update](https://github.com/softaworks/agent-toolkit/blob/main/skills/daily-meeting-update/README.md) | Interactive daily standup generator |
| 👔 Professional | [difficult-workplace-conversations](https://github.com/softaworks/agent-toolkit/blob/main/skills/difficult-workplace-conversations/README.md) | Navigate difficult conversations |
| 👔 Professional | [feedback-mastery](https://github.com/softaworks/agent-toolkit/blob/main/skills/feedback-mastery/README.md) | Deliver constructive feedback |
| 👔 Professional | [professional-communication](https://github.com/softaworks/agent-toolkit/blob/main/skills/professional-communication/README.md) | Technical communication guide |
| 🧪 Testing | [qa-test-planner](https://github.com/softaworks/agent-toolkit/blob/main/skills/qa-test-planner/README.md) | Comprehensive QA test planning |
| 📦 Git | [commit-work](https://github.com/softaworks/agent-toolkit/blob/main/skills/commit-work/README.md) | High-quality git commits |
| 🔧 Utilities | [datadog-cli](https://github.com/softaworks/agent-toolkit/blob/main/skills/datadog-cli/README.md) | Debug with Datadog logs & metrics |
| 🔧 Utilities | [domain-name-brainstormer](https://github.com/softaworks/agent-toolkit/blob/main/skills/domain-name-brainstormer/README.md) | Generate & check domain names |
| 🔧 Utilities | [humanizer](https://github.com/softaworks/agent-toolkit/blob/main/skills/humanizer/README.md) | Remove AI writing patterns |
| 🔧 Utilities | [meme-factory](https://github.com/softaworks/agent-toolkit/blob/main/skills/meme-factory/README.md) | Generate memes with API |
| 🔧 Utilities | [jira](https://github.com/softaworks/agent-toolkit/blob/main/skills/jira/README.md) | Natural language Jira interaction |
| 🔧 Utilities | [web-to-markdown](https://github.com/softaworks/agent-toolkit/blob/main/skills/web-to-markdown/README.md) | Convert webpages to Markdown |

---

## 🤖 Agents & Commands

> **Requires [Claude Code CLI](https://docs.anthropic.com/claude-code)** — These agents and commands are exclusive to Claude Code users.
>
> For full access, add the marketplace and install plugins:
> ```bash
> /plugin marketplace add softaworks/agent-toolkit
> /plugin install codex@agent-toolkit
> ```

### Agents

Specialized sub-agents that Claude Code can delegate tasks to:

| Agent | Description |
|-------|-------------|
| ascii-ui-mockup-generator | Visualize UI concepts through ASCII mockups |
| codebase-pattern-finder | Find similar implementations and patterns |
| communication-excellence-coach | Email refinement, tone calibration, roleplay |
| general-purpose | Default agent for complex multi-step tasks |
| mermaid-diagram-specialist | Create flowcharts, sequence diagrams, ERDs |
| ui-ux-designer | Research-backed UI/UX design feedback |

### Slash Commands

Reusable workflows invoked with `/command-name`:

| Command | Description |
|---------|-------------|
| `/codex-plan` | Create implementation plans using Codex 5.2 |
| `/compose-email` | Draft professional emails |
| `/explain-changes-mental-model` | Build mental model of code changes |
| `/explain-pr-changes` | Generate PR summaries |
| `/sync-branch` | Sync feature branch with main |
| `/sync-skills-readme` | Update README skills table |
| `/viral-tweet` | Optimize tweet ideas for X engagement |

---

## 📖 Skill Structure

Each skill contains:
- `SKILL.md` - Detailed instructions for the agent (with YAML frontmatter)
- `README.md` - User-friendly documentation with examples
- `scripts/` - Helper scripts for automation (optional)
- `references/` - Supporting documentation (optional)

---

## 🤝 Contributing

Contributions are welcome! When adding new skills:

1. Follow the [Agent Skills](https://agentskills.io/) format
2. Include both `SKILL.md` (for agents) and `README.md` (for users)
3. Add YAML frontmatter to `SKILL.md` with `name:` and `description:` fields
4. Update this README.md with a link to your skill

---

## 📄 License

MIT

---

## 🔗 Links

- [Agent Skills Format](https://agentskills.io/)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs)
- [GitHub Repository](https://github.com/softaworks/agent-toolkit)
