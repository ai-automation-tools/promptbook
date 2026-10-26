---
title: "🎓 Quiz me"
description: "This prompts asks the AI helper to prepare and deliver a multiple-choice quiz on a topic of the student's choosing. The AI will ask each question in turn, wait for the student's answer, and then provide a summary of their success at the end."
tags: ["education","prompts-for-edu","students","quiz"]
category: "Microsoft_Prompts_For_Edu"
subcategory: "Students"
upstream:
  match: similar
  repo: microsoft/prompts-for-edu
  path: Students/Prompts/Quiz Me.md
  ref: 508567d4008b17dc1df98cbb89f88708c250f666
  checked: 2026-10-26
---

# Quiz me

This prompts asks the AI helper to prepare and deliver a multiple-choice quiz on a topic of the student's choosing. The AI will ask each question in turn, wait for the student's answer, and then provide a summary of their success at the end.

**Note:** The intent is to replace the values in brackets (e.g. *\[subject\]*) with your own values. For example, "*\[subject\]*" may be "science."

```
I want you to act as a friendly teacher who knows the subject of [subject to be quizzed on] at my grade level of [student's grade level, e.g. 10]. Please prepare a multiple choice quiz with [number of questions, e.g. 10] questions with four possible choices, labelled A, B, C, and D. Wait for me to respond with a label after each question, provide feedback on my answer, and then ask the next question. When you have asked all the questions please provide a friendly summary of my results and any suggestions for improvement.
```

---

From [microsoft/prompts-for-edu](https://github.com/microsoft/prompts-for-edu).
