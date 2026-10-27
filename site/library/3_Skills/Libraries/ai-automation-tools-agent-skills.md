---
title: "ai-automation-tools/agent-skills"
description: "Portable Agent Skills for Claude Code and compatible agents — each a self-contained SKILL.md an agent loads only when it is needed."
repo: ai-automation-tools/agent-skills
tags: ["skill","skill-library","development","platform-integrations","content","business","security"]
---
# ai-automation-tools/agent-skills

Portable Agent Skills for Claude Code and compatible agents — each a self-contained SKILL.md an agent loads only when it is needed.

A skill library: browse and install its skills from [the repo on GitHub](https://github.com/ai-automation-tools/agent-skills). Promptbook keeps one card for it rather than a copy of each skill.

---

*The repo's README, copied 2026-10-27:*

<a id="readme-top"></a>

<h1 align="center">🧩 Agent Skills</h1>

<p align="center">
  <em>Portable capabilities for Claude Code and compatible agents —<br>each one a single <code>SKILL.md</code> the agent loads only when it needs it.</em>
</p>

<p align="center">
  <a href="https://github.com/ai-automation-tools/agent-skills/blob/main/docs/README.md"><strong>Explore the docs »</strong></a>
</p>

<p align="center">
  <a href="https://agent-skills.ai-automation-tools.dev">Showcase site</a> ·
  <a href="#-skill-catalog">Catalog</a> ·
  <a href="#-using-a-skill">Install</a> ·
  <a href="https://github.com/ai-automation-tools/agent-skills/blob/main/docs/USING-SKILLS.md">Authoring guide</a> ·
  <a href="https://github.com/ai-automation-tools/agent-skills/blob/main/docs/ROADMAP.md">Roadmap</a> ·
  <a href="https://github.com/ai-automation-tools/agent-skills/blob/main/docs/CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <a href="https://agent-skills.ai-automation-tools.dev"><img src="https://img.shields.io/badge/live-agent--skills.ai--automation--tools.dev-F2B34B?style=for-the-badge" alt="Live at agent-skills.ai-automation-tools.dev"></a>
  <img src="https://img.shields.io/badge/skills-10-2ea44f?style=for-the-badge" alt="10 skills">
  <img src="https://img.shields.io/badge/format-SKILL.md-8B5CF6?style=for-the-badge" alt="SKILL.md format">
  <img src="https://img.shields.io/badge/agent-Claude%20Code-D97757?style=for-the-badge" alt="Built for Claude Code">
  <a href="https://github.com/ai-automation-tools"><img src="https://img.shields.io/badge/org-ai--automation--tools-0078D4?style=for-the-badge&logo=github&logoColor=white" alt="ai-automation-tools"></a>
</p>

---

A collection of reusable skills for Claude Code and compatible AI agents. Each skill is a folder with a `SKILL.md` file that tells the agent how to handle a specific task.

<a id="-skill-catalog"></a>

## 🗂️ Browse skills

| Folder | What's inside |
|:---|:---|
| [**🧩 Core**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/core/README.md) | Reusable skills that work across repositories and install into your agent's user-level skills directory. |
| [**🧭 Domain**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/domain/README.md) | Field-specific skills (engineering, security, business, media, API) mirrored from the org's agent workspaces. Portable, installed on request. |
| [**🗂️ Projects**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/projects/README.md) | Additional skills for specific repositories, installed into the project they belong to. |
| [**🖥️ Showcase site**](https://github.com/ai-automation-tools/agent-skills/blob/main/site/README.md) | A static page that presents every Core skill as a card, with screenshots and install commands. Published at [agent-skills.ai-automation-tools.dev](https://agent-skills.ai-automation-tools.dev). |

## 📦 Core skills

| Skill | Category | What it does |
|:---|:---|:---|
| [**✉️ html-email-templates**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/automation/html-email-templates/README.md) | Automation | Creates HTML emails for notifications, reports, and digests. |
| [**🏭 automated-dev-pipeline**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/automation/automated-dev-pipeline/README.md) | Automation | Sets up scheduled AI agents that build projects through PRs, publish them to a GitHub account or organization behind scripted gates and a human approval, and keep every repo current. Also covers pipelines whose stages are folders in one repo that deploys a site. |
| [**🧠 agent-workspace-builder**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/automation/agent-workspace-builder/README.md) | Automation | Creates or standardizes a specialized agent workspace repo (AGENTS.md doctrine, docs tree, capability reference, curated resources, portable skills) and sets up its weekly roadmap and upkeep automations. |
| [**🚦 task-router**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/automation/task-router/README.md) | Automation | Chooses a workflow and model tier based on the task. |
| [**📈 business-plan-builder**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/business/business-plan-builder/README.md) | Business | Evaluates business ideas and writes a decision memo and build plan. |
| [**🍳 recipe-validator**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/cooking/recipe-validator/README.md) | Cooking | Checks recipes for food safety, nutrition, quantities, and allergens. |
| [**🏗️ repo-docs-builder**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/documentation/repo-docs-builder/README.md) | Documentation | Organizes repositories and creates linked READMEs, a docs tree, and the roadmap + changelog that go with it. |
| [**🖼️ news-images**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/image-gen/news-images/README.md) | Image-Gen | Generates illustrated news collages and montages. |
| [**🌐 project-hub-scaffold**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/web/project-hub-scaffold/README.md) | Web | Builds a local web interface for browsing project documents. |
| [**🎨 web-house-style**](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/skill-data/core/web/web-house-style/README.md) | Web | Gives a page the org sites' shared look: dark-first tokens, a Light / Dark switch top right, the source bar, a top bar or icon sidebar, and the phone pass. |

## 🧭 Domain skills

Field-specific skills from the org's five agent workspaces, copied here unchanged by a weekly
harvest. They're kept apart from Core so Core stays a short list, and they install only
when you ask: `install-skills.ps1 -Domain`. Edit them in their workspace repo; the
[harvest ledger](https://github.com/ai-automation-tools/agent-skills/blob/main/docs/HARVEST.md) says which one.

| Domain folder | What's inside |
|:---|:---|
| [**🛠️ Engineering**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/domain/engineering/) | How to build software well: debugging, performance work, and test strategy. From `fullstack-agent`. |
| [**🌐 API**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/domain/api/) | Working with third-party APIs: judging one before you integrate, writing clients that survive failures, staying inside rate limits and quotas, normalizing responses into one traceable shape, and testing integrations without hitting live services. From `api-agent`. |
| [**📈 Business**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/domain/business/) | Field tactics for business decisions: running customer discovery interviews, planning go-to-market, and setting prices. From `business-agent`. |
| [**🔐 Security**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/domain/security/) | Communicating and steering security work: turning verified findings into a report a client acts on, disclosing a vulnerability responsibly, and measuring a security program with metrics, SLAs and a risk register. From `security-agent`. |
| [**🎬 Media**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/domain/media/) | Getting a media asset ready to publish and learning from it afterward: captions, alt text, accessibility checks, rights clearance, and reading post-publish analytics. From `media-agent`. |

## 🗂️ Project skills

Each folder lists the project's existing skills and any additional skills provided here.

| Project folder | Additional skills in this repo |
|:---|:---|
| [**💬 agent-chat**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/projects/agent-chat/README.md) | `agent-chat-conv-types`, `agent-chat-delivery` and `agent-chat-run-triage`. |
| [**⏱️ cronsole**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/projects/cronsole/README.md) | `cronsole-windows-jobs` and `cronsole-claude-routines`. |
| [**📡 edge-radar**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/projects/edge-radar/README.md) | `edge-radar-strategy-profiles` and `edge-radar-strategy-evidence`. |
| [**📉 edge-spectrum**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/projects/edge-spectrum/README.md) | `edge-spectrum-hub-tool`, `edge-spectrum-dataset` and `edge-spectrum-endpoint`. |
| [**🌐 project-hub**](https://github.com/ai-automation-tools/agent-skills/blob/main/skills/projects/project-hub/README.md) | `project-hub-scan`, `project-hub-client` and `project-hub-demo`. (`project-hub-scaffold` is listed under Core.) |

<a id="-using-a-skill"></a>

See the [Using Skills guide](https://github.com/ai-automation-tools/agent-skills/blob/main/docs/USING-SKILLS.md) for installation and authoring instructions, or browse [Resources](https://github.com/ai-automation-tools/agent-skills/blob/main/resources/README.md) for examples and supporting material. What's planned next is in the [roadmap](https://github.com/ai-automation-tools/agent-skills/blob/main/docs/ROADMAP.md), and what has already changed is in the [changelog](https://github.com/ai-automation-tools/agent-skills/blob/main/docs/CHANGELOG.md).
