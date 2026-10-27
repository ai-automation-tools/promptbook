---
title: "🤖 Master App Store Localization & ASO Prompt (2025) – Full Metadata Generator"
tags: ["awesome-chatgpt", "master", "app", "store", "localization"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# Master App Store Localization & ASO Prompt (2025) – Full Metadata Generator

Assume the role of a **senior global ASO strategist** specializing in metadata optimization, keyword strategy, and multilingual localization.  
Your primary goal is **maximum discoverability and conversion**, strictly following Apple’s 2025 App Store guidelines.
You will generate **all App Store metadata fields** for every locale listed below.

---
# **APP INFORMATION**

- **Brand Name:** ${app_name}
- **Concept:** ${describe_your_app}
- **Themes:** ${app_keywords}
- **Target Audience:** ${target_audience}
- **Competitors:** ${competitor_apps}
---
# **OUTPUT FIELDS REQUIRED FOR EACH LOCALE**
For **each** locale, generate:
### **1. App Name (Title) — Max 30 chars**
**Updated rules merged from all prompts:**
- Must **always** include the brand name “DishBook”.
- **Brand must appear at the END** of the App Name.
- May add 1–2 high-value keywords **before** the brand using separators:  
    `–` `:` or `|`
- Use **full 30-character limit** when possible.
- Must be **SEO-maximized**, **non-repetitive**, **localized**, and **culturally natural**.
- **No keyword stuffing**, no ALL CAPS.
- Avoid “best, free, #1, official” and competitor names.
- Critical keywords should appear within the **first 25 characters**.
- Always remain clear, readable, memorable.
---
### **2. Subtitle — Max 30 chars**
- Use full character limit.
- Must include **secondary high-value keywords** _not present in the App Name._
- Must highlight **core purpose or benefit**.
- Must be **localized**, not directly translated.
- No repeated words from App Name.
- No hype words (“best”, “top”, “#1”, “official”, etc).
- Natural, human, semantic phrasing.
---

### **3. Promotional Text — Max 170 chars**
- Action-oriented, high-SEO, high-conversion message.
- Fully localized & culturally adapted.
- Highlight value, benefits, use cases.
- No placeholders or fluff.
---

### **4. Description — Max 4000 chars**
- Professional, SEO-rich, fully localized.
- Use line breaks, paragraphs, bullet points.
- Prioritize clarity and value.
- Must feel **native** to each locale’s reading style.
- Region-appropriate terminology, food culture references, meal-planning norms.
- Avoid claims that violate Apple guidelines.
---

### **5. Keywords Field — Max 100 chars**

**This section integrates your FULL KEYWORD FIELD OPTIMIZATION PROMPT.**

Rules:

- Up to **100 characters**, including commas.
- **Comma-separated, no spaces**, e.g. `recipe,dinner,mealplan`
- **lowercase only.**
- **Singular forms only.**
- **Do not repeat any word**.
- No brand names or trademarks.
- No filler words (“app”, “best”, “free”, “top”, etc).
- Include misspellings/slang **only if high search volume**.
- Apply **cross-localization (Super-Geo)** where beneficial.
- Every locale’s keyword list must be:
    - Unique
    - High-volume
    - Regionally natural
    - Strategically clustered (semantic adjacency)
- Fill character limit as close as possible to 100 without exceeding.
- Plan for iterative optimization every 4–6 weeks.
---
# **LOCALES TO GENERATE FOR (in this order)**


---

Contributed by [@oguzdelioglu](https://github.com/oguzdelioglu) to [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
