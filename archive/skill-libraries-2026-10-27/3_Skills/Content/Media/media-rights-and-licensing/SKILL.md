---
title: "✍️ media-rights-and-licensing"
name: media-rights-and-licensing
description: Establish that every element in a piece of media is actually cleared to use, and record it, instead of assuming — music and sound, stock footage and images, fonts, AI-generated content and its training-data questions, a person's voice or likeness, and the attribution a license requires. Use before publishing anything with third-party or generated elements, when sourcing an asset, or when a rights question needs a defensible answer rather than a guess.
tags: ["skill","content","media","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/media/media-rights-and-licensing/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Media Rights and Licensing

## Never assert a right you did not confirm

The dangerous sentence in media production is "that's probably fine." Music, a font, a
stock clip, a voice, a likeness — each is cleared for a specific use or it is not, and
the model cannot see a license by looking at a file. The cost of getting it wrong is
not abstract: a takedown, a demonetized video, a muted upload, or a claim against
whoever published it.

So the rule is flat: **flag every element as needing clearance and say what license it
needs; never assume it is cleared.** An honest "this track needs a license before we
publish" is worth far more than a confident silence that ships an infringement.

## What needs clearing

Every element that you did not create from scratch, and some that you did.

| Element | The question |
|:---|:---|
| Music and sound effects | Licensed for this use, this platform, commercially? |
| Stock footage and images | What does the license permit — editorial only? commercial? modification? |
| Fonts | Licensed for embedding, for video, for the distribution channel? |
| AI-generated content | What do the tool's terms grant, and what do they warrant? |
| A person's voice or likeness | Consent or a release on file? |
| Brands, logos, trademarks | Nominative use, or infringement? |
| Existing content you are building on | Fair use, licensed, or neither? |

## Music and sound

The category that trips the most people, because platform detection is automated and
unforgiving.

- **"Free to use" is not one thing.** It may mean free for non-commercial use only,
  free with attribution, free on one platform but not another, or free until the
  creator changes the terms. Read the specific grant.
- **Royalty-free is not royalty-free forever or everywhere.** It usually means one
  payment for ongoing use within stated limits — check the limits.
- **A license usually names the use.** Streaming, broadcast, paid ads, and monetized
  video are often separate, more expensive grants than personal or non-commercial use.
- **Content-ID will find it.** Platform audio fingerprinting flags copyrighted music
  automatically, even a few seconds, even under narration. A clip that "no one will
  notice" gets caught by a machine that notices everything.

## Stock and images

- **Editorial vs. commercial** is the distinction that catches people. An editorial
  license permits news and commentary use but forbids using the image to sell or
  endorse — using an editorial image in an ad is a breach.
- **Model and property releases** matter for recognizable people and some private
  property. A stock image of a person may lack a release for commercial use even
  though you licensed the image.
- **Check whether modification is permitted**, and whether the license covers the
  platform and audience size you are publishing to.

## Fonts

Underestimated and genuinely restrictive.

- A desktop font license often does not cover embedding in a video, an app, or a
  web page — those are separate grants.
- "Free for personal use" fonts are common and are not licensed for commercial
  publishing. This is a frequent, quiet breach.
- Confirm the license covers the specific use: video render, embedded, distributed.

## AI-generated content

The newest and least settled area. Do not assume "the tool made it" means "I own it
and can do anything with it."

- **Read the tool's terms.** They vary — some grant broad commercial rights to
  outputs, some restrict commercial use, some reserve rights, some change the terms
  between the free and paid tiers.
- **Ownership and copyrightability are unsettled.** In several jurisdictions purely
  AI-generated work may not be copyrightable at all, which affects whether you can
  protect it, not just whether you can use it.
- **Training-data provenance is a live risk.** A tool may output something close to a
  copyrighted work or a recognizable style, and the tool's terms typically do not
  indemnify you for that. Treat outputs that closely resemble an existing work or a
  named artist's style as a rights flag.
- **Generated voices and faces** raise the likeness questions below, not just the
  copyright ones.

## Voice and likeness

Distinct from copyright — this is a person's right to control the use of their
identity, and it does not expire the way a stock license is bought.

- **Recognizable faces or voices need consent or a release**, especially for
  commercial or endorsement use. This includes AI-generated or cloned voices that
  imitate a specific real person.
- **A cloned voice of a real person** without their consent is a likeness problem
  regardless of how it was produced. Flag it, do not ship it on assumption.
- **A release names the scope** — what use, what duration, what territory. A release
  for one campaign does not cover the next one.

## Attribution

Some licenses are free precisely because they require credit, and the credit is a
contractual condition, not a nicety.

- **Capture the exact required attribution string** and where it must appear — in the
  video, the description, a credits screen. Creative Commons and many free-tier stock
  and music licenses require it.
- **Attribution you discover after publishing** is a re-edit and a re-upload. Get it
  into the piece before export.
- Record which asset required which credit, so a later audit can confirm it is there.

## Record it — the rights log

An assertion nobody wrote down is one nobody can verify later. Attach clearance to the
asset's provenance record: for each licensed or generated element, capture the source,
the license type and its scope, any required attribution, any release on file, and the
date. When a claim or a question comes months later, this record is the defensible
answer — and its absence is why "I think it was fine" is the only answer available.

## Before publish

- [ ] Every third-party element identified and its license scope confirmed for this
      use, platform, and audience
- [ ] Music cleared for the specific use (commercial / monetized / broadcast as
      applicable), knowing Content-ID will scan it
- [ ] Stock checked for editorial-vs-commercial and for required model/property
      releases
- [ ] Fonts licensed for the actual use (video / embedded / distributed)
- [ ] AI-tool terms read; outputs resembling an existing work or named style flagged
- [ ] Recognizable or cloned voices and faces have consent or a release on file
- [ ] Required attribution strings captured and placed before export
- [ ] Clearance recorded in the asset's provenance log with source, scope, and date
- [ ] Anything unresolved is flagged as blocking publish, not shipped on assumption
