---
title: "🎓 Simulator"
description: "The prompt instructs the AI to engage in a role-play exercise with the user, where the user wants to practice a specific concept. The AI must create a scenario allowing the user to apply a skill, encounter problems, and make a consequential decision. After four interactions and a significant choice, the AI should wrap up the exercise by providing feedback on the user's performance and suggesting improvements."
tags: ["education","prompts-for-edu","students","simulator"]
category: "Microsoft_Prompts_For_Edu"
subcategory: "Students"
upstream:
  match: similar
  repo: microsoft/prompts-for-edu
  path: Students/Prompts/Simulator.MD
  ref: 508567d4008b17dc1df98cbb89f88708c250f666
  checked: 2026-10-26
---

# Simulator

The prompt instructs the AI to engage in a role-play exercise with the user, where the user wants to practice a specific concept. The AI must create a scenario allowing the user to apply a skill, encounter problems, and make a consequential decision. After four interactions and a significant choice, the AI should wrap up the exercise by providing feedback on the user's performance and suggesting improvements.

**Note:** The intent is to replace the values in brackets (e.g. *\[concept\]*) with your own values. For example, "*\[concept\]*" may be "lead a team meeting."

```
I want to practice my knowledge of [concept]. You’ll play [the role(s) in a specific situation]. I’ll 
play [student’s role]. The goal is to practice [concept and a given situation]. Create a scenario 
in which I can practice [applying my skill in a situation]. I should have to [encounter specific 
problems, and make a consequential decision]. Give me dilemmas or problems [during the 
specific scenario]. After 4 interactions, set up a consequential choice for me to make. Then wrap 
up by telling me how [performed in my specific scenario] and what I can do better next time. Do 
not play my role. Only play the [others’ role]. Wait for me to respond
```

---

From [microsoft/prompts-for-edu](https://github.com/microsoft/prompts-for-edu).
