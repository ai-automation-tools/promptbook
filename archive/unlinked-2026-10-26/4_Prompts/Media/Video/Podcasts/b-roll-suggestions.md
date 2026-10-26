---
title: "🎙️ B Roll And Stock Footage Suggester"
tags: ["video", "podcasts", "roll", "suggestions"]
category: "Video"
subcategory: "Podcasts"
---
# B-Roll and Stock Footage Suggester

<!-- Analyzes a podcast script to suggest specific stock video clips for B-roll overlays. -->

---

## Metadata

- **Category:** Video
- **Subcategory:** Podcasts
- **Complexity:** Simple
- **Use Case:** Identifying ideal moments to cut away to stock footage during a video podcast
- **Version:** 1.0
- **Last Updated:** 2024-05-23

---

## Purpose

To keep viewers engaged on platforms like YouTube, video podcasts often cut away from the host's face to show relevant B-roll footage. This prompt analyzes the script and provides specific, searchable suggestions for stock footage that aligns with the topic being discussed.

---

## Input Requirements

**Required:**
- [PODCAST_SCRIPT]: The segment of the podcast script to analyze.

**Optional:**
- [STOCK_LIBRARY]: The specific platform you use (e.g., Artgrid, Envato Elements, Storyblocks) to tailor the search terms.

---

## Prompt

```
You are an expert video editor working on a video podcast. Your goal is to keep the viewer visually engaged by inserting relevant B-roll footage over the host's narration.

I will provide you with a segment of the podcast script. Please identify the best moments to cut away to B-roll, and suggest specific types of stock footage that would enhance the message.

Here is the podcast script:
[PODCAST_SCRIPT]

Preferred Stock Library (Optional): [STOCK_LIBRARY]

For every 15-30 seconds of dialogue (or whenever a distinct visual concept is mentioned), provide:
1. The exact line of dialogue where the B-roll clip should begin.
2. A description of the ideal stock footage clip.
3. 3-5 specific "Search Terms" the editor can type into a stock footage website to find this exact type of clip.

Ensure the suggestions are practical, realistic to find on standard stock websites, and relevant to the tone of the script.
```

---

## Expected Output

A list mapping dialogue to specific stock footage suggestions and search keywords.

**Format:**
- Structured list

**Key components to include:**
- Dialogue Trigger
- B-Roll Description
- Search Keywords

**Example structure:**
- **Trigger:** "...the housing market crashed."
- **B-Roll:** Time-lapse of a suburban neighborhood, or a "For Sale" sign being hammered into a lawn.
- **Search Terms:** "foreclosure sign", "suburbs timelapse", "housing crisis"

---

## Example Usage

### Input
```
[PODCAST_SCRIPT]: "Host: Building a startup is exhausting. You're working 18 hour days, staring at screens until your eyes blur. And most of the time, you're just drinking way too much coffee trying to keep the server from crashing."
[STOCK_LIBRARY]: Envato Elements
```

### Output
```
### B-Roll Suggestions

**Clip 1**
- **Trigger:** "Building a startup is exhausting. You're working 18 hour days..."
- **B-Roll Description:** A tired person rubbing their eyes or temple in a dark office, lit only by the glow of a laptop screen.
- **Search Terms:** "tired programmer", "late night office working", "exhausted entrepreneur"

**Clip 2**
- **Trigger:** "...drinking way too much coffee..."
- **B-Roll Description:** A close-up, cinematic shot of dark coffee being poured into a mug, or someone holding a mug with shaking hands.
- **Search Terms:** "pouring coffee slow motion", "drinking coffee late night", "caffeine"

**Clip 3**
- **Trigger:** "...trying to keep the server from crashing."
- **B-Roll Description:** Rows of blinking lights in a dark server room, with shallow depth of field.
- **Search Terms:** "server room data center", "blinking lights server", "network hardware"
```

---

## Tips & Best Practices

- **Tip 1:** Use abstract concepts for hard-to-visualize topics. If the script is about "financial freedom," search terms like "person standing on mountain top" or "relaxing beach sunset" work well.
- **Tip 2:** Keep the tone in mind. If the podcast is serious, avoid suggesting overly cheesy, smiling "corporate" stock footage.
- **Tip 3:** These search terms can also be used as prompts for AI video generators if you cannot find suitable stock footage.

---

## Related Prompts

- `ai_video_storyboard.md`
- `slideshow_image_prompts.md`

---

## Tags

`#video` `#podcasts` `#b-roll` `#editing` `#stock-footage`

---

## Notes

This prompt is a massive time-saver for video editors who usually have to pause the edit, think of a concept, and search for clips manually. It provides a readymade shopping list for stock assets before editing even begins.

---

**Created by:** AI Generated
