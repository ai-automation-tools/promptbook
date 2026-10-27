---
title: "✍️ captions-and-accessibility"
name: captions-and-accessibility
description: Make media usable by everyone and verify it, rather than assuming it — accurate captions and transcripts, alt text and image descriptions that convey the content, sufficient contrast on text and lower-thirds, safe-area and readability on mobile, and audio described where the visuals carry meaning. Use when finishing any video, image, podcast, or social asset for publish, when captions are auto-generated and need checking, or when an accessibility pass is part of the definition of done.
tags: ["skill","content","media","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/media/captions-and-accessibility/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Captions and Accessibility

## Accessibility is part of done, not a later pass

An asset that a deaf viewer cannot follow, a blind viewer cannot understand, or a
low-vision viewer cannot read is not finished. It is finished for some of the
audience. Treating accessibility as optional polish is how it gets dropped every time
a deadline tightens, and it is also, for anything public-facing, increasingly a legal
requirement rather than a courtesy.

The rule that keeps it honest is the studio's rule for everything: **verify against
the artifact, do not assume from the intent.** Auto-generated captions look done and
are frequently wrong. Alt text you wrote from the prompt describes the image you meant
to make, not the one you made.

## Captions

Every piece of spoken audio gets captions. On social especially — most feed video is
watched muted — captions are not accessibility polish, they are whether the content
lands at all.

**Accuracy is the whole point.** Auto-generated captions are a starting draft, never
the deliverable. They mishear names, technical terms, and homophones, and they punt on
punctuation, which changes meaning. Read every auto-caption against the audio and fix:

- Proper nouns, product names, jargon — the words a general speech model gets wrong.
- Sentence boundaries and punctuation — auto-captions run sentences together and a
  missing question mark changes the meaning.
- Numbers, units, and currency read as spoken.

**Timing and readability:**

- Captions appear as the words are said, not seconds late. Drift makes them unusable.
- Keep a line to a readable length — roughly one to two lines on screen, a couple of
  seconds minimum per cue so it can be read before it changes.
- Position clear of on-screen text and the platform's UI overlay. A caption behind the
  progress bar is not a caption.

**Open vs. closed:**

- **Closed captions** (a separate track the viewer toggles) are correct where the
  platform supports them — YouTube, most players. They are searchable and
  toggleable.
- **Open captions** (burned into the frame) are correct for feed-native social where
  there is no caption track and autoplay is muted. Burned in means they must be right
  before export — there is no fixing them after.

Identify non-speech audio that carries meaning — `[laughter]`, `[phone rings]`,
`[ominous music]` — where it matters to understanding.

## Transcripts

A transcript is the full text of the audio, and it does more than captions: it is
readable without the video, searchable, indexable, and the base for show notes and
repurposing.

- Every podcast and every long-form video gets one.
- For a multi-speaker piece, label speakers and paragraph it so it reads as a
  document, not a wall.
- A cleaned transcript — false starts and filler removed where they do not matter —
  is more useful than a verbatim one for reading, though captions stay verbatim.

## Alt text and image descriptions

Alt text lets a screen-reader user get what a sighted user gets from the image. It is
not the filename and it is not a keyword list.

- **Describe the content and its function**, not "image of." What is in it, what it
  conveys, why it is here. A chart's alt text states what the chart shows, not that it
  is a chart.
- **Match length to purpose.** A decorative flourish needs empty alt so the screen
  reader skips it; an infographic carrying real information needs a full description,
  possibly in surrounding text rather than crammed into the alt attribute.
- **Write it from the actual image**, after it is generated, not from the prompt you
  hoped would produce it. This is the same verify-the-artifact rule — the generated
  image often differs from the brief in ways that matter to the description.
- **Do not restate visible caption text** in the alt. The screen reader will read
  both, and the duplication is noise.

## Contrast and readability

Text a low-vision viewer cannot read is text that is not there for them.

- **Meet a real contrast ratio** between text and its background — the WCAG AA
  thresholds (roughly 4.5:1 for body text, 3:1 for large text) are the checkable bar.
  "Looks fine on my monitor" is not a measurement.
- **Lower-thirds and captions over video need a plate or shadow.** Text over moving
  footage passes contrast in one frame and fails in the next as the background
  changes. A semi-opaque plate keeps it readable throughout.
- **Size for the smallest screen it will play on.** Text sized for a desktop preview
  is unreadable on a phone, which is where most of the audience is. Check at phone
  scale, not editor scale.
- **Do not carry meaning by color alone.** A red-vs-green distinction is invisible to
  a large share of viewers; pair color with a label, a shape, or a position.

## Audio description

When the visuals carry information the audio does not — on-screen text, a silent
demonstration, a visual gag, a chart — a blind viewer misses it entirely.

- Where the script already narrates what is shown, no separate description is needed;
  write the narration to cover the visuals in the first place.
- Where it does not, add described-video narration in the gaps, or restructure the
  script so the audio conveys the essential visual content.
- The test: close your eyes through the piece. If you lose the thread, the visuals are
  carrying meaning the audio has to pick up.

## Verify before publish

Accessibility claims are verifiable, so verify them rather than asserting them.

- [ ] Captions checked against the audio, not left as auto-generated — names, terms,
      numbers, punctuation corrected
- [ ] Caption timing tracks the speech, positioned clear of UI and on-screen text
- [ ] Burned-in captions confirmed correct before export (no post-fix possible)
- [ ] Transcript exists for every podcast and long-form video, speaker-labeled
- [ ] Alt text written from the actual generated image, describing content and function
- [ ] Text contrast meets the AA ratio; lower-thirds have a plate over video
- [ ] Readable at phone scale, not just editor scale
- [ ] No meaning conveyed by color alone
- [ ] Meaningful visual-only content is covered by narration or description
