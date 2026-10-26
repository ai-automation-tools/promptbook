---
title: "🎙️ AI Voice Generation Cues"
tags: ["video", "podcasts", "voice", "generation", "cues"]
category: "Video"
subcategory: "Podcasts"
---
# AI Voice Generation Cues

<!-- Analyzes a script and adds pacing, emotion, and emphasis tags for AI text-to-speech tools. -->

---

## Metadata

- **Category:** Video
- **Subcategory:** Podcasts
- **Complexity:** Intermediate
- **Use Case:** Preparing a flat text script for emotive, realistic voice generation using tools like ElevenLabs or PlayHT
- **Version:** 1.0
- **Last Updated:** 2024-05-23

---

## Purpose

When using AI text-to-speech (TTS) platforms, pasting a large block of text often results in a robotic, monotonous delivery. This prompt helps "direct" the AI voice actor by breaking the script into distinct phrases and suggesting where to add pauses, emphasize words, or shift emotional tone to create a more natural, engaging podcast host.

---

## Input Requirements

**Required:**
- [PODCAST_SCRIPT]: The raw text of the podcast script.

**Optional:**
- [HOST_PERSONA]: A description of the host's personality (e.g., energetic, serious investigative journalist, sarcastic, comforting).

---

## Prompt

```
You are an expert voice director and audio producer specializing in AI text-to-speech generation (such as ElevenLabs, PlayHT, or Speechify).

I will provide you with a podcast script. Your task is to rewrite the script, adding specific "directorial cues" so that an AI voice model can read it with natural pacing, emotion, and emphasis.

Here is the podcast script:
[PODCAST_SCRIPT]

Desired Host Persona (Optional): [HOST_PERSONA]

Please rewrite the script incorporating the following formatting to guide the AI:
1. **[PAUSE: 1s]** or **[PAUSE: 2s]**: Insert these where the speaker should take a breath, build tension, or let a point land.
2. **_Italicize_**: Italicize words that need strong emphasis or a change in pitch.
3. **[EMOTION: Whisper]**, **[EMOTION: Excited]**, **[EMOTION: Serious]**: Add these tags before sentences or paragraphs where the underlying tone should shift.
4. **Break up long sentences:** If a sentence is too long for a single breath, break it into shorter, punchy phrases separated by commas or ellipses (...).

Ensure the final output sounds like a human conversationalist rather than a robot reading an essay.
```

---

## Expected Output

The original script heavily annotated with pacing, emphasis, and emotional tags.

**Format:**
- Annotated script block

**Key components to include:**
- Pause tags
- Emphasis markers (italics)
- Emotional state tags

**Example structure:**
[EMOTION: Curious] "So... _how_ did they get away with it?" [PAUSE: 1s] "Well, the answer might surprise you."

---

## Example Usage

### Input
```
[PODCAST_SCRIPT]: "Host: Today we are looking at the great bank robbery of 1972. It was a flawless execution. The thieves walked in through the front door, disabled the cameras, and left with three million dollars in cash. And the craziest part? They were never caught."
[HOST_PERSONA]: True Crime, intense, gripping
```

### Output
```
### AI Voice Generation Script

[EMOTION: Serious, low volume] "Today... [PAUSE: 1s] we are looking at the great bank robbery of _1972_."

[EMOTION: Faster pace, gripping] "It was a _flawless_ execution. The thieves walked in through the front door... disabled the cameras... and left with _three million dollars_ in cash."

[PAUSE: 2s]

[EMOTION: Intense, almost a whisper] "And the _craziest_ part? [PAUSE: 1.5s] They were _never_ caught."
```

---

## Tips & Best Practices

- **Tip 1:** AI voices often sound better when fed shorter chunks of text. This prompt helps identify natural breaking points in the script.
- **Tip 2:** Use the `[HOST_PERSONA]` to dictate the style. A "morning radio DJ" will require different pacing and emphasis than a "late-night meditation guide."
- **Tip 3:** Some platforms (like ElevenLabs) respond surprisingly well to written cues like ellipses (`...`) for trailing off or dashes (`-`) for abrupt stops.

---

## Related Prompts

- `sound_effects_map.md`
- `background_music_score.md`

---

## Tags

`#video` `#podcasts` `#audio` `#elevenlabs` `#voiceover`

---

## Notes

While this prompt adds visual cues, the user must understand how their specific TTS platform interprets them. For instance, ElevenLabs reads the text directly, so you wouldn't paste the literal `[PAUSE: 1s]` tag, but you would use the rewritten punctuation and breaks.

---

**Created by:** AI Generated
