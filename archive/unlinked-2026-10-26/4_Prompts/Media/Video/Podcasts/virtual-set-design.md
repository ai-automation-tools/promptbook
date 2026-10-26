---
title: "🎙️ Virtual Set Design Prompts"
tags: ["video", "podcasts", "virtual", "design"]
category: "Video"
subcategory: "Podcasts"
---
# Virtual Set Design Prompts

<!-- Analyzes podcast themes and generates Midjourney prompts for virtual studio backgrounds. -->

---

## Metadata

- **Category:** Video
- **Subcategory:** Podcasts
- **Complexity:** Simple
- **Use Case:** Creating custom, high-quality virtual backgrounds for video podcasts shot on green screen or using AI background replacement
- **Version:** 1.0
- **Last Updated:** 2024-05-23

---

## Purpose

Many podcasters record remotely or in small rooms, utilizing green screens to appear as though they are in a professional studio. This prompt analyzes the podcast's topic and brand to generate specific AI image prompts (e.g., for Midjourney) that create stunning, realistic virtual sets perfectly tailored to the show.

---

## Input Requirements

**Required:**
- [PODCAST_TOPIC_OR_NICHE]: The main subject of the podcast (e.g., Tech news, fitness, philosophy, true crime).

**Optional:**
- [BRAND_COLORS]: Primary colors to feature in lighting or set pieces.
- [STUDIO_VIBE]: The desired atmosphere (e.g., cozy, futuristic, minimalist, academic library).

---

## Prompt

```
You are an expert set designer and AI image prompt specialist (e.g., Midjourney).

I am designing a virtual background for a video podcast. The podcast is filmed with the host sitting at a desk, looking directly at the camera. I need 3 distinct AI image prompts to generate the background behind them.

Here is the podcast's niche/topic:
[PODCAST_TOPIC_OR_NICHE]

Brand Colors (Optional): [BRAND_COLORS]
Desired Vibe (Optional): [STUDIO_VIBE]

For each of the 3 virtual set concepts, provide a highly detailed Midjourney prompt. Ensure the prompts specify:
1. The architectural style or setting (e.g., brick loft, modern glass office, cozy library).
2. Key props relevant to the niche placed naturally in the background (e.g., vintage microphones, servers, bookshelves).
3. The lighting design (e.g., warm practical lamps, neon edge lighting, cinematic softbox lighting).
4. Depth of field (the background should be slightly blurred to keep focus on the host).

Format the output clearly and include `--ar 16:9` at the end of every prompt.
```

---

## Expected Output

Three detailed Midjourney prompts designed specifically for creating realistic, themed virtual backgrounds.

**Format:**
- Numbered list of concepts and prompts

**Key components to include:**
- Concept description
- Ready-to-copy Midjourney prompt

**Example structure:**
- **Concept 1: The Modern Office**
- **Midjourney Prompt:** [Detailed prompt string ending in --ar 16:9]

---

## Example Usage

### Input
```
[PODCAST_TOPIC_OR_NICHE]: Cybersecurity and Hacking
[BRAND_COLORS]: Green and Black
[STUDIO_VIBE]: Tech-focused, slightly secretive, underground
```

### Output
```
### Virtual Set Concepts

**Concept 1: The Server Room Lounge**
- **Midjourney Prompt:** A modern, dimly lit podcast studio setup. In the blurred background, rows of sleek black server racks emit a soft, pulsing green neon glow. A dark oak desk sits in the foreground (out of focus). High-end cinematic lighting, shallow depth of field, 85mm lens, photorealistic, secretive cyber atmosphere --ar 16:9

**Concept 2: The Hacker's Loft**
- **Midjourney Prompt:** An industrial brick loft at night. The background features a large monitor displaying scrolling green code (slightly out of focus). Warm amber desk lamps contrast with cool green LED accent lighting along the walls. A vintage leather armchair is partially visible. Shallow depth of field, photorealistic, 4k, tech-noir vibe --ar 16:9

**Concept 3: The Minimalist Tech Hub**
- **Midjourney Prompt:** A clean, minimalist dark-walled studio. On a floating shelf in the blurred background, a glowing green neon sign of a padlock is displayed next to abstract geometric art. Soft, diffused overhead lighting, extremely high quality, corporate but edgy, bokeh effect in the background --ar 16:9
```

---

## Tips & Best Practices

- **Tip 1:** Always specify "shallow depth of field" or "blurred background" (bokeh) in the prompt. This simulates a high-end camera lens and prevents the background from distracting from the real host.
- **Tip 2:** Ensure the lighting in your real life recording space matches the lighting generated in the virtual set (e.g., if the virtual set has a warm lamp on the right, light yourself warmly from the right).
- **Tip 3:** Avoid generating "desks" directly in front of the camera in the prompt unless you plan to carefully mask yourself behind them in editing.

---

## Related Prompts

- `slideshow_image_prompts.md`
- `thumbnail_designer.md`

---

## Tags

`#video` `#podcasts` `#virtual-set` `#midjourney` `#design`

---

## Notes

This technique allows podcasters to have "million-dollar studios" regardless of their physical recording space.

---

**Created by:** AI Generated
