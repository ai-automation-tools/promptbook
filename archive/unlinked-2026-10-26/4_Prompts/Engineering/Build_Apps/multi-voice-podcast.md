---
title: "📌 Multi Voice Podcast"
tags: ["it", "build-apps", "multi", "voice", "podcast"]
category: "IT"
subcategory: "Build_Apps"
---
# Multi-Voice Podcast Generator

Build a podcast generation system with multiple AI voices, natural dialogue, and automated audio production.

## Context
Generate podcast episodes with 6-7 distinct character voices representing diverse perspectives, using ElevenLabs TTS for human-quality audio.

## Requirements

### Voice System
- 6-7 distinct character voices
- ElevenLabs voice cloning
- Character personality consistency
- Natural speech patterns
- Emotional range and inflection

### Script Format
- Conversational format preferred
- `[CHARACTER]` tag format
- 80-120 exchanges per episode
- Natural dialogue flow
- Diverse ideological perspectives

### Audio Generation
- Segment-by-segment TTS
- Automatic audio combination
- Volume normalization
- Export to MP3
- 10-15 minute episodes typical

### Workflow Support
- Sequential script → Conversational conversion (Scenario A)
- Direct conversational → Audio (Scenario B: 4-7x faster)
- Character voice mapping
- Batch processing
- Progress tracking

### Cost Management
- Character usage tracking
- API quota monitoring
- Cost per episode estimation
- Monthly budget alerts

## Architecture

```
Script (Conversational Format) → Parse Characters → Generate Audio Segments → Combine → Export MP3
                                                                                    ↓
                                                                              Upload to Drive
```

## Character Examples
- **Archie** - Narrator, balanced perspective
- **Dr. Vega** - Scientist, analytical
- **Billy Bob** - Rural perspective, folksy wisdom
- **Pastor Cole** - Religious/spiritual viewpoint
- **Harper** - Progressive, activist stance
- **Riley** - Youth perspective, tech-savvy
- **Chad** - Contrarian, devil's advocate

## Key Scripts
- `generate-audio.sh` - Main audio generator
- `convert-to-conversational.sh` - Format converter
- `combine-segments.sh` - Audio combiner
- Character voice mapping file
- Episode metadata tracker

## Performance Metrics
- **Scenario A** (Sequential→Audio): 20-40 minutes
- **Scenario B** (Conversational→Audio): 5-6 minutes
- Average episode: 10-15 minutes audio
- Character usage: ~9,000-20,000 chars per episode

## Tech Stack
- ElevenLabs TTS API
- Bash scripting
- ffmpeg for audio processing
- Character voice library
- Script parsing tools

## Best Practices
- Write scripts conversationally from start (Scenario B)
- Use unescaped `[CHARACTER]` tags
- Test with short samples first
- Monitor API usage
- Keep backups of generated audio

---

*Based on: Podcast generation with ElevenLabs*  
*Location: `~/.openclaw/workspace/projects/openclaw/podcasts/`*
