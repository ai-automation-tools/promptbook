---
title: "elevenlabs/skills"
description: "Collections of skills for building with ElevenLabs"
repo: elevenlabs/skills
tags: ["skill","skill-library","elevenlabs","tts","audio"]
---
# elevenlabs/skills

Collections of skills for building with ElevenLabs

A skill library: browse and install its skills from [the repo on GitHub](https://github.com/elevenlabs/skills). Promptbook keeps one card for it rather than a copy of each skill.

---

*The repo's README, copied 2026-11-18:*

![LOGO](https://raw.githubusercontent.com/elevenlabs/skills/main/logo.png)

# ElevenLabs Skills

Agent skills for [ElevenLabs](https://elevenlabs.io) developer products. These skills follow the [Agent Skills specification](https://agentskills.io/specification) and can be used with any compatible AI coding assistant.

## Installation

```bash
npx skills add elevenlabs/skills
```

## Available Skills

| Skill | Description |
|-------|-------------|
| [text-to-speech](https://github.com/elevenlabs/skills/blob/main/text-to-speech) | Convert text to lifelike speech using ElevenLabs' AI voices |
| [speech-to-text](https://github.com/elevenlabs/skills/blob/main/speech-to-text) | Transcribe audio files to text with timestamps |
| [speech-engine](https://github.com/elevenlabs/skills/blob/main/speech-engine) | Add real-time voice conversations to a custom LLM or chat agent |
| [realtime](https://github.com/elevenlabs/skills/blob/main/realtime) | Run agents on ElevenLabs Realtime models, or migrate an OpenAI Realtime voice app to them |
| [agents](https://github.com/elevenlabs/skills/blob/main/agents) | Build conversational voice AI agents |
| [sound-effects](https://github.com/elevenlabs/skills/blob/main/sound-effects) | Generate sound effects from text descriptions |
| [music](https://github.com/elevenlabs/skills/blob/main/music) | Generate music tracks using AI composition |
| [voice-changer](https://github.com/elevenlabs/skills/blob/main/voice-changer) | Transform the voice in an audio recording into a different target voice (speech-to-speech) |
| [voice-isolator](https://github.com/elevenlabs/skills/blob/main/voice-isolator) | Remove background noise and isolate vocals/speech from audio |
| [dubbing](https://github.com/elevenlabs/skills/blob/main/dubbing) | Dub audio/video into other languages while preserving the original speakers' voices |
| [onboarding](https://github.com/elevenlabs/skills/blob/main/onboarding) | Add ElevenLabs to a project from scratch: sign-in, API key, SDK and a first request |
| [setup-api-key](https://github.com/elevenlabs/skills/blob/main/setup-api-key) | Fix or hand-configure an existing ElevenLabs API key |

## Configuration

All skills require an ElevenLabs API key in `ELEVENLABS_API_KEY`. The `onboarding` skill puts one in your project's env file for you. To set one by hand:

```bash
export ELEVENLABS_API_KEY="your-api-key"
```

Keys come from the [API keys page](https://elevenlabs.io/app/api/api-keys?quickstart=true); the `setup-api-key` skill helps with an existing key that stopped working or was issued by an administrator.

## SDK Support

Most skills include examples for:

- **Python** - `pip install elevenlabs`
- **JavaScript/TypeScript** - `npm install @elevenlabs/elevenlabs-js`
- **CLI** - `npm install -g @elevenlabs/cli` or `brew install elevenlabs/tap/elevenlabs` (wraps the REST API; reads `ELEVENLABS_API_KEY` automatically)

> **JavaScript SDK Warning:** Always use `@elevenlabs/elevenlabs-js`. Do not use `npm install elevenlabs` (that's an outdated v1.x package).

See the installation guide in any skill's `references/` folder for complete setup instructions including migration from deprecated packages.

## Evaluations

The `evals/` directory contains trigger and functional evaluations for all skills.

```bash
# Run all evaluations (trigger + functional)
python3 evals/run_all.py -v

# Trigger evals only — tests if skills fire for the right queries (~3 min)
python3 evals/run_all.py --trigger-only -v

# Functional evals only — tests if skills produce correct output (~15 min)
python3 evals/run_all.py --functional-only -v

# Specific skills
python3 evals/run_all.py --skills text-to-speech agents -v

# Custom model (see `cursor-agent --list-models`)
python3 evals/run_all.py --model gpt-5.4-high -v
```

Results are saved to `evals/results/<timestamp>/` with a `report.md` summary and `results.json` for programmatic access.

Functional evals use an isolated `cursor-agent` workspace per test case (under that results tree); they do **not** modify skill sources under each skill’s directory.

Requires the [Cursor Agent CLI](https://cursor.com/docs/cli/using) (`cursor-agent` on your `PATH`; override binary with `CURSOR_AGENT`) and Cursor authentication (`cursor-agent login` or `CURSOR_API_KEY`).

## License

MIT
