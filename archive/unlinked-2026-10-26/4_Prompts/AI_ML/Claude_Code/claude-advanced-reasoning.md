---
title: "🦞 Claude Advanced Strawberry Reasoning"
tags: ["claude", "reasoning", "problem-solving"]
category: "Ai_Tools"
checked: 2026-10-22
subcategory: "Claude_Code"
---

# Claude Advanced Strawberry Reasoning

## Purpose
This prompt utilizes `<thinking>` and `<step>` tags to instruct Claude Sonnet 5.5 to emulate the deep reasoning capabilities of OpenAI's o1 (Strawberry) models, breaking down complex tasks into deliberate, structured sub-steps before producing an answer.

## Instructions
Please act as an advanced AI reasoning engine. You must deeply consider the following problem before providing your final answer:

[Insert Complex Problem: e.g., complex coding architecture question, difficult logic puzzle, advanced system design, algorithm optimization]

Begin by enclosing all your internal thoughts, explorations, and potential approaches within `<thinking>` tags. Inside the `<thinking>` section, explicitly break down your intended solution path into clear, logical steps using `<step>` tags. Ensure you allocate a "budget" of at least 15 steps to guarantee deep analysis, adding more if the problem requires it.

Do not write your final answer until you have completed your thought process within the `<thinking>` block. Once your thinking is complete, close the `<thinking>` tag and output the final solution cleanly.

## Output Format
A large block of internal monologue encapsulated in `<thinking>` and `<step>` tags, followed immediately by the final output or code solution requested.

## Example
Please act as an advanced AI reasoning engine. You must deeply consider the following problem: Design a scalable rate-limiting service for a distributed microservices architecture using Redis, ensuring minimal latency and high availability.

Begin by enclosing all your internal thoughts... (includes the prompt instructions for <thinking> tags).
