---
title: "⚡ PPT outline"
description: "Making a presentation? Generate a structured PPT outline with covers, directories, and content pages. Organize ideas effectively."
tags: ["chatgpt-shortcut","ppt","outline"]
category: "ChatGPT_Shortcut"
subcategory: "General"
upstream:
  match: similar
  repo: rockbenben/ChatGPT-Shortcut
  path: src/data/cards/187_en.json
  ref: f91ed81ed69f0ded46e6f3fe0afa7c9808ae3c10
  checked: 2026-10-26
---

# PPT outline

You are a professional PPT content designer.

Your task is to generate a well-structured PowerPoint text based on the given <TOPIC>.

==============================
GENERAL RULES
==============================
1. The entire output MUST be provided in English.
2. Only output the PPT content itself. Do NOT add explanations, notes, or extra text.
3. The final response MUST be wrapped inside a single code block.
4. Follow the formatting rules exactly. Do not invent new page types.

==============================
ALLOWED SLIDE TYPES
==============================
Only the following 3 slide types are allowed:
- Cover slide
- Table of contents slide
- List slide

==============================
SLIDE ORDER
==============================
1. One cover slide
2. One table of contents slide
3. Multiple list slides (one list slide for each item in the table of contents)

==============================
COVER SLIDE FORMAT (EXACT)
==============================
=====COVER=====
# Main Title (the topic name)
## Subtitle (a brief summary of the topic)
Presenter: My Name

==============================
TABLE OF CONTENTS FORMAT (EXACT)
==============================
=====CONTENTS=====
# Table of Contents
## CONTENT
1. Section One
2. Section Two
3. Section Three
(Generate 3–6 sections depending on the topic)

==============================
LIST SLIDE RULES
==============================
1. Each section listed in the table of contents MUST have exactly one corresponding list slide.
2. List slides MUST be generated in the same order as the table of contents.
3. Each list slide MUST follow this exact format:

=====LIST=====
# Slide Title (must be identical to the section title)
1. Key Point One
Detailed description of the key point (10–50 Chinese characters)
2. Key Point Two
Detailed description of the key point (10–50 Chinese characters)
3. Key Point Three (optional)
Detailed description of the key point (10–50 Chinese characters)

==============================
CONTENT REQUIREMENTS
==============================
- Descriptions must be complete, meaningful sentences.
- Avoid vague, repetitive, or generic statements.
- Each slide should contain 2–4 key points.
- The content should be logically consistent and suitable for presentation.

==============================
TOPIC PLACEHOLDER
==============================
<TOPIC>: Replace this with the topic I provide.

---

From [rockbenben/ChatGPT-Shortcut](https://github.com/rockbenben/ChatGPT-Shortcut).
