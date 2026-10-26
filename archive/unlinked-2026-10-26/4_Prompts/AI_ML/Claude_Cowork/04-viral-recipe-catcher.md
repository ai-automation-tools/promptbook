---
title: "🤝 Viral Recipe Catcher"
tags: ["ai-tools", "claude-cowork", "viral", "recipe", "catcher"]
category: "AI_Tools"
subcategory: "Claude_Cowork"
---
# Viral Recipe Catcher

**Schedule:** Daily — 11:00 AM
**Category:** Recipes
**Tools Required:** Web Search, Web Fetch
**Estimated Time:** ~8 minutes

## Prompt

Search for recipes that went viral or are trending heavily in the last 48 hours across Reddit (r/recipes, r/food, r/Cooking, r/FoodPorn), TikTok food accounts mentioned in articles, and food-focused Twitter/X. Also check Substack food newsletters for highly shared posts.

Capture any recipe with significant engagement (1k+ upvotes or widely shared). For each:
1. Fetch the full recipe if a source link exists — ingredients + method
2. Note why it went viral (unusual technique? 3-ingredient hack? nostalgia? diet trend?)
3. Rate "actual cookability" — is this genuinely good or just photogenic?
4. Tag: [trending] [platform: reddit/tiktok/etc] [difficulty] [time]

Save to ~/recipes/trending/[YYYY-MM-DD]-[slug].md. If 3 or more are captured today, also append a summary line to ~/recipes/trending/digest.md.

