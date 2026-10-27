---
title: "🎙️ AI Video Storyboard"
tags: ["video", "podcasts", "storyboard"]
category: "Video"
subcategory: "Podcasts"
---
# AI Video Storyboard Generator

<!-- Converts a podcast script into video generation prompts for tools like Runway or Sora to create b-roll. -->

---

## Metadata

- **Category:** Video
- **Subcategory:** Podcasts
- **Complexity:** Advanced
- **Use Case:** Generating dynamic AI video clips to serve as visual accompaniment for an audio podcast
- **Version:** 1.0
- **Last Updated:** 2024-05-23

---

## Purpose

This prompt analyzes a text-based podcast script and generates a sequence of video prompts optimized for AI video generators (e.g., Runway Gen-2, OpenAI Sora, Pika). It creates a shot-by-shot storyboard that visually represents the spoken narrative, turning an audio-only podcast into a fully realized video production.

---

## Input Requirements

**Required:**
- [PODCAST_SCRIPT]: The segment of the podcast script to be visualized.

**Optional:**
- [CINEMATIC_STYLE]: The overarching look of the video (e.g., 35mm film, documentary, hyperrealistic, 3D animation).
- [CAMERA_MOVEMENT]: The preferred style of camera motion (e.g., slow pan, drone shot, handheld, static).

---

## Prompt

```
You are an expert film director and AI video generation specialist (e.g., Runway, Sora, Pika).

I am creating a video version of an audio podcast by generating AI video clips to serve as B-roll over the narration. I will provide you with the podcast script. Your task is to create a detailed shot-by-shot storyboard and generate the specific text prompts needed to create those video clips.

Here is the podcast script:
[PODCAST_SCRIPT]

Cinematic Style: [CINEMATIC_STYLE]
Default Camera Movement: [CAMERA_MOVEMENT]

Break the script down into individual scenes (each lasting roughly 3 to 10 seconds of narration).

For each shot, provide:
1. The exact line of dialogue it corresponds to.
2. The AI Video Generation Prompt. This must be highly descriptive, including the subject, action, lighting, setting, [CINEMATIC_STYLE], and specific camera motion (e.g., "slow pan right," "tracking shot").
3. The estimated duration of the clip.

Ensure the sequence of shots tells a cohesive visual story that directly enhances the audio narrative.
```

---

## Expected Output

A storyboard format detailing the prompts needed for AI video generation.

**Format:**
- Structured list

**Key components to include:**
- Dialogue Trigger
- Video Generation Prompt
- Estimated Duration

**Example structure:**
- **Shot 1:** [Details]
- **Shot 2:** [Details]

---

## Example Usage

### Input
```
[PODCAST_SCRIPT]: "Host: Deep in the Amazon rainforest, there are species we haven't even discovered yet. The canopy is so thick, sunlight barely reaches the forest floor. It's a world untouched by time."
[CINEMATIC_STYLE]: 4k, BBC Nature Documentary, hyperrealistic, macro lens
[CAMERA_MOVEMENT]: Slow, steady drone or tracking shots
```

### Output
```
### AI Video Storyboard

**Shot 1**
- **Dialogue:** "Deep in the Amazon rainforest, there are species we haven't even discovered yet."
- **Video Prompt:** An aerial drone shot flying slowly over the dense, lush green canopy of the Amazon rainforest at sunrise. Mist rolling over the trees. 4k, BBC Nature Documentary style, hyperrealistic.
- **Duration:** 5 seconds

**Shot 2**
- **Dialogue:** "The canopy is so thick, sunlight barely reaches the forest floor."
- **Video Prompt:** A slow pan up from the dark, damp forest floor of the Amazon, showing massive tree trunks and thick vines. Shafts of golden sunlight pierce through the dense green canopy above. 4k, BBC Nature Documentary style.
- **Duration:** 4 seconds
```

---

## Tips & Best Practices

- **Tip 1:** AI video generators currently excel at slow, establishing shots rather than complex interactions between multiple characters. Structure your prompts accordingly.
- **Tip 2:** If you have generated reference images first (using the `slideshow_image_prompts.md`), you can instruct the video generator to use those images as the starting frame (Image-to-Video).
- **Tip 3:** Keep video prompts concise but highly descriptive regarding lighting, lens choice, and motion.

---

## Related Prompts

- `slideshow_image_prompts.md`
- `b_roll_suggestions.md`

---

## Tags

`#video` `#podcasts` `#ai-video` `#storyboard` `#runway` `#sora`

---

## Notes

This process can be computationally expensive and time-consuming. It is best used for high-value short-form clips (like intros or promotional audiograms) rather than a full 60-minute episode, unless highly automated.

---

**Created by:** AI Generated
