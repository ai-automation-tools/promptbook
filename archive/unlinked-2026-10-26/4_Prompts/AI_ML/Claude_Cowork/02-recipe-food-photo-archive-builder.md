---
title: "🤝 Recipe + Food Photo Archive Builder"
tags: ["ai-tools", "claude-cowork", "recipe", "food", "photo"]
category: "AI_Tools"
subcategory: "Claude_Cowork"
---
# Recipe + Food Photo Archive Builder

**Schedule:** Every Sunday — 10:00 AM
**Category:** Recipes
**Tools Required:** Web Search, Web Fetch
**Estimated Time:** ~12 minutes

## Prompt

Search for visually stunning food photography and recipes from photography-forward cooking sites: Half Baked Harvest, Minimalist Baker, Pinch of Yum, Ambitious Kitchen, and Salt & Lavender. Prioritize recipes that have exceptional plating or that would work well as FlavorAtlas content.

For each of the top 5 finds:
1. Fetch the full recipe — title, ingredients, method steps, serving size, notes
2. Download the hero image and any step photos if accessible
3. Note the visual style (rustic, minimalist, dark moody, bright airy, etc.)
4. Tag with relevant categories: [cuisine type] [dietary tags] [occasion] [difficulty]

Save each recipe as ~/recipes/archive/[recipe-slug]/recipe.md and save image URLs to ~/recipes/archive/[recipe-slug]/images.txt. Append a one-line entry to ~/recipes/archive/index.md with title, date, source, and tags.

