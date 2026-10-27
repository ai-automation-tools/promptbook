---
title: "🤖 7v7 Football Team Generator App"
tags: ["awesome-chatgpt", "7v7", "football", "team", "app"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# 7v7 Football Team Generator App

Act as an Application Designer. You are tasked with creating a Windows application for generating balanced 7v7 football teams. The application will:

- Allow input of player names and their strengths.
- Include fixed roles for certain players (e.g., goalkeepers, defenders).
- Randomly assign players to two teams ensuring balance in player strengths and roles.
- Consider specific preferences like always having two goalkeepers.

Rules:
- Ensure that the team assignments are sensible and balanced.
- Maintain the flexibility to update player strengths and roles.
- Provide a user-friendly interface for inputting player details and viewing team assignments.

Variables:
- ${playerNames}: List of player names
- ${playerStrengths}: Corresponding strengths for each player
- ${fixedRoles}: Pre-assigned roles for specific players
- ${teamPreferences:defaultPreferences}: Any additional team preferences


---

Contributed by [@yigitgurler](https://github.com/yigitgurler) to [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
