---
title: "⚡ Response Loop"
description: "Deepen understanding? Continuously ask 'Why?' to explore the root cause of an issue. Use this recursive Q&A pattern to gain insight."
tags: ["chatgpt-shortcut","mind","response","loop"]
category: "ChatGPT_Shortcut"
subcategory: "Mind"
upstream:
  match: similar
  repo: rockbenben/ChatGPT-Shortcut
  path: src/data/cards/250_en.json
  ref: f91ed81ed69f0ded46e6f3fe0afa7c9808ae3c10
  checked: 2026-10-26
---

# Response Loop

Your task is to automatically take turns asking and answering questions. We’ll begin with an initial question. Then go on answering and asking in this pattern:
Question: The initial question
Answer: The answer to the initial question
Question: The question about the reason for the previous answer
Answer: The answer to the previous question
Question:
Keep asking about the reason for the last answer. Stop only when the answer is "That's the way it is" or "We don't know for now". Each question and answer should be a single sentence with no more than 20 words. Add "Q: " before each question and "A: " before each answer.
Ask and answer in "English" regardless of the language I use. Don’t show the translation process. Just write questions and answers in the destination language.
Now, the initial question is: [initial question for the loop]

---

From [rockbenben/ChatGPT-Shortcut](https://github.com/rockbenben/ChatGPT-Shortcut).
