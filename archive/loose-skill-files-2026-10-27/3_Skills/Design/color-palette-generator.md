---
title: "🛠️ Color Palette Generator"
tags: ["skills", "design", "ui"]
category: "Skills"
subcategory: "Design"
---

# Color Palette Generator

## Description
A skill that generates accessible, cohesive color palettes based on a given mood or theme.

## Prerequisites
- Understanding of HEX/RGB color codes and contrast ratios.

## Implementation Guidelines

### Step 1: Define Theme
Understand the required mood (e.g., "corporate trust", "vibrant energetic").

### Step 2: Select Base Color
Choose a primary color that fits the theme.

### Step 3: Generate Palette
Derive secondary, accent, and neutral colors using color theory (analogous, complementary). Ensure WCAG contrast compliance.

## Code Example

```css
/* Theme: Corporate Trust */
:root {
  --primary: #0A369D;
  --secondary: #4E7AC7;
  --accent: #F26419;
  --background: #F8F9FA;
  --text-dark: #212529;
}
```

## Usage Constraints
- Must verify contrast ratios for text accessibility.

## Verification Steps
1. Test primary vs background colors using a contrast checker tool.
