---
title: "🎙️ Short Form Clip Visuals Planner"
tags: ["video", "podcasts", "short", "form", "clip"]
category: "Video"
subcategory: "Podcasts"
---
# Short-Form Clip Visuals Planner

<!-- Analyzes a long-form podcast script to identify viral moments and plan visual overlays for Shorts/Reels. -->

---

## Metadata

- **Category:** Video
- **Subcategory:** Podcasts
- **Complexity:** Intermediate
- **Use Case:** Identifying highly engaging 30-60 second clips from a long script and planning the visual edits (b-roll, pop-ups, text) to maximize retention on TikTok/Reels/Shorts
- **Version:** 1.0
- **Last Updated:** 2024-05-23

---

## Purpose

The key to podcast growth is often short-form video (TikTok, YouTube Shorts, Instagram Reels). However, a simple clip of two people talking is rarely enough to hold attention. This prompt analyzes a full script, identifies the most "viral" moments, and acts as a video editor to plan the fast-paced visual hooks, pop-up graphics, and pacing needed to retain viewership.

---

## Input Requirements

**Required:**
- [PODCAST_SCRIPT_SEGMENT]: A 5-10 minute segment of the podcast script to analyze.

**Optional:**
- [TARGET_AUDIENCE]: Who the short clip is intended for (e.g., Gen Z entrepreneurs, fitness enthusiasts).

---

## Prompt

```
You are an expert short-form video editor and social media growth strategist specializing in TikTok, YouTube Shorts, and Instagram Reels.

I am going to provide you with a segment of a podcast script. Your task is to find the single most engaging 30-60 second "clip" hidden within this text, and then provide a detailed editing plan to make that clip highly retentive.

Here is the podcast script segment:
[PODCAST_SCRIPT_SEGMENT]

Target Audience (Optional): [TARGET_AUDIENCE]

Please provide the following:
1. **The Hook:** Identify the strongest 1-2 sentences to start the clip with. (You may need to pull a sentence from the middle of the segment and move it to the front to act as a cold open).
2. **The Clip Script:** Provide the exact text of the 30-60 second clip you have isolated.
3. **The Visual Editing Plan:** For every 3-5 seconds of the clip, tell the video editor exactly what to show on screen to maintain attention. Include:
   - When to zoom in or out on the host.
   - Specific B-roll footage to overlay.
   - Pop-up graphics, emojis, or sound effects.
   - Key words to highlight dramatically in the captions.
```

---

## Expected Output

A clearly defined short-form video clip, including a rearranged hook and a second-by-second visual editing blueprint.

**Format:**
- Structured editing plan

**Key components to include:**
- The Hook strategy
- The isolated script
- Timeline-based visual instructions

**Example structure:**
- **The Hook:** [Opening line]
- **The Script:** [30-60s of text]
- **Visual Plan:**
  - `0:00-0:03`: [Visual action]
  - `0:03-0:08`: [Visual action]

---

## Example Usage

### Input
```
[PODCAST_SCRIPT_SEGMENT]: "Host: We started the company in a garage. It was tough. We ate ramen for two years. But the real turning point wasn't when we got funding. The turning point was when we almost went bankrupt in 2018. We had $500 left in the bank account. I remember looking at my co-founder and saying, we either launch this feature tomorrow, or we close the doors forever. We stayed up for 48 hours straight. We launched it. And within a week, we hit our first million in MRR."
[TARGET_AUDIENCE]: Aspiring founders, tech entrepreneurs
```

### Output
```
### Short-Form Clip Plan

**1. The Hook (Cold Open):**
"We had $500 left in the bank account... we either launch this tomorrow, or we close the doors forever."
*(Note: Pulled from the middle to create immediate stakes, then jump back to the story.)*

**2. The Clip Script:**
"We had $500 left in the bank account. I remember looking at my co-founder and saying, we either launch this feature tomorrow, or we close the doors forever. We started the company in a garage. We ate ramen for two years. But the real turning point wasn't funding... it was when we almost went bankrupt. We stayed up for 48 hours straight. We launched it. And within a week, we hit our first million in MRR."

**3. The Visual Editing Plan:**
- `0:00 - 0:03`: **Text:** "We had $500 left in the bank account." **Visual:** Tight zoom on host's face. Red caption text for "$500". **SFX:** Cash register error sound.
- `0:03 - 0:07`: **Text:** "...we either launch tomorrow, or we close forever." **Visual:** Cut to B-roll of a dark, empty office or a closed sign.
- `0:07 - 0:12`: **Text:** "We started in a garage. Ate ramen for two years." **Visual:** Quick cut back to host, wide shot. Pop-up emoji of a bowl of ramen 🍜 over their shoulder.
- `0:12 - 0:18`: **Text:** "But the turning point wasn't funding... it was almost going bankrupt." **Visual:** B-roll of a downward trending red graph. **SFX:** Heartbeat or tense bass drop.
- `0:18 - 0:24`: **Text:** "Stayed up 48 hours straight. Launched it." **Visual:** Fast time-lapse B-roll of someone coding at night.
- `0:24 - 0:30`: **Text:** "Within a week... hit our first million in MRR." **Visual:** Sudden bright lighting/color grade shift. Fast zoom in on the host. Green highlighted text for "One Million". **SFX:** Cash register "Cha-Ching!".
```

---

## Tips & Best Practices

- **Tip 1:** The visual pacing for TikTok/Shorts needs to be incredibly fast. A visual change (a cut, a zoom, a pop-up graphic) should happen every 2 to 4 seconds.
- **Tip 2:** Always pull the most dramatic or controversial statement to the very front to act as the hook. The chronological order of the original podcast doesn't matter for short-form.
- **Tip 3:** Emphasize the emotional journey. Use visual cues (color shifts, B-roll) to match the low points and high points of the story.

---

## Related Prompts

- `audiogram_design_guide.md`
- `b_roll_suggestions.md`

---

## Tags

`#video` `#podcasts` `#shorts` `#tiktok` `#editing` `#social-media`

---

## Notes

This prompt bridges the gap between a raw audio recording and a highly edited, high-retention social media asset by doing the heavy lifting of narrative restructuring and visual pacing.

---

**Created by:** AI Generated
