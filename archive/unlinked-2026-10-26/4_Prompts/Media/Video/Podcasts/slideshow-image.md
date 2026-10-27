---
title: "🎙️ Slideshow Image Prompts"
tags: ["video", "podcasts", "slideshow", "image", "prompts"]
category: "Video"
subcategory: "Podcasts"
---
# Slideshow Image Prompts Generator

<!-- Converts a podcast script into a series of visual prompts (e.g., for Midjourney) to create a slideshow for video podcasts. -->

---

## Metadata

- **Category:** Video
- **Subcategory:** Podcasts
- **Complexity:** Intermediate
- **Use Case:** Creating visual assets (slides/images) to accompany an audio-first podcast on video platforms like YouTube
- **Version:** 1.0
- **Last Updated:** 2024-05-23

---

## Prompt

```
You are an expert visual director and AI image generation specialist (e.g., Midjourney, DALL-E).

I am converting an audio podcast into a video format using a slideshow of images that change as the topics progress. I will provide the podcast script. Your job is to generate a series of highly descriptive AI image prompts that correspond to the key topics and stories in the script.

Here is the podcast script:
[PODCAST_SCRIPT]

Visual Style Guide: [VISUAL_STYLE_GUIDE] (e.g., photorealistic, 2D vector art, cinematic lighting, cyberpunk, minimalist)
Aspect Ratio: [ASPECT_RATIO] (e.g., 16:9 for YouTube)

Review the script and divide it into logical visual "slides" (roughly one new image every 15-30 seconds of dialogue, or whenever the topic changes).

For each slide, provide:
1. The script snippet or topic being discussed (to know when to show the image).
2. A detailed AI image generation prompt. The prompt must include the subject, setting, lighting, color palette, and the requested [VISUAL_STYLE_GUIDE].
3. Any on-screen text or graphics you recommend overlaying on the image in post-production.

Ensure the visual style remains consistent across all prompts.
```

---

## Purpose

Many podcasters publish their audio episodes on video platforms (like YouTube) to increase reach. Instead of a static logo, this prompt helps create a dynamic, visually engaging slideshow by generating specific image generation prompts tied to the script's content.

---

## Input Requirements

**Required:**
- [PODCAST_SCRIPT]: The text of the podcast.
- [VISUAL_STYLE_GUIDE]: The desired aesthetic for the images to ensure consistency.

**Optional:**
- [ASPECT_RATIO]: The dimensions of the images (defaults to 16:9).

---

## Expected Output

A structured list mapping sections of the script to AI image generation prompts.

**Format:**
- List of visual cues and prompts

**Key components to include:**
- Script context
- AI Image Prompt (ready to copy/paste)
- On-screen text suggestions

**Example structure:**
- **Slide 1 (0:00 - 0:30):** Topic / Prompt / Text
- **Slide 2 (0:30 - 1:15):** Topic / Prompt / Text

---

## Example Usage

### Input
```
[PODCAST_SCRIPT]: "In 1969, the world watched as Apollo 11 launched. The sheer power of the Saturn V rocket was mind-boggling. Millions sat glued to their tiny, black-and-white television sets."
[VISUAL_STYLE_GUIDE]: Retro 1960s illustration, vintage colors, grain
[ASPECT_RATIO]: 16:9
```

### Output
```
### Visual Slideshow Plan

**Slide 1: The Launch**
- **Context:** "In 1969, the world watched as Apollo 11 launched. The sheer power of the Saturn V rocket was mind-boggling."
- **Image Prompt:** A massive Saturn V rocket launching from the pad, massive plumes of fire and smoke, retro 1960s illustration style, vintage colors, film grain, cinematic angle from below, --ar 16:9
- **On-Screen Text:** "Apollo 11 - 1969"

**Slide 2: The Audience**
- **Context:** "Millions sat glued to their tiny, black-and-white television sets."
- **Image Prompt:** A 1960s living room with a family gathered around a glowing vintage television set, looking amazed, retro 1960s illustration style, warm vintage colors, film grain, dim lighting, --ar 16:9
- **On-Screen Text:** None
```

---

## Tips & Best Practices

- **Tip 1:** Consistency is key. Make sure your `[VISUAL_STYLE_GUIDE]` is detailed so the AI includes it in every single prompt, preventing the images from looking disconnected.
- **Tip 2:** If generating images with Midjourney, consider adding `--cref` (character reference) or `--sref` (style reference) parameters to the generated prompts for maximum consistency.
- **Tip 3:** Don't change images too quickly; allow the viewer time to absorb the visual while listening.

---

## Related Prompts

- `ai_video_storyboard.md`
- `thumbnail_designer.md`

---

## Tags

`#video` `#podcasts` `#images` `#midjourney` `#visuals`

---

## Notes

This technique is excellent for storytelling, history, or educational podcasts where visual aids can significantly enhance the listener's comprehension and retention.

---

**Created by:** AI Generated
