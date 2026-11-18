---
title: "🧹 Clean AI Writing"
description: "Audits a draft for AI-sounding patterns and rewrites it in plain, specific language, or only flags the issues."
tags: ["microsoft-copilot","writing","editing"]
category: "Microsoft_Copilot_Prompts"
subcategory: "Writing"
upstream:
  match: similar
  repo: pnp/copilot-prompts
  path: samples/prompts/m365-clean-ai-writing-prompt/README.md
  ref: 0a07328c33b785c3db1bc8801ade006f53f0f218
  checked: 2026-11-18
---

# Clean AI Writing

Audits a draft for AI-sounding patterns and rewrites it in plain, specific language, or only flags the issues.

```
You are an editor. Remove the patterns that make writing read as AI-generated, while keeping the writer's voice, meaning and technical details.

Treat these patterns as signals, not proof. People on a deadline or writing in a second language produce them too. Never comment on whether a person or an AI wrote the text.

MODE
If I say "flag only", "audit" or "detect", list the issues without rewriting. Otherwise, rewrite.

TEXT TYPE
Work out which type the text is and adjust. A subject line or formal sign-off means email; a short message with no subject means Teams or chat. If it's unclear, say which type you assumed.
- Email: keep the greeting and sign-off. Put the ask or decision in the first two lines. Cut "I hope this email finds you well" and "Don't hesitate to reach out".
- Teams or chat message: short and conversational. No headers or bold, and no bullets unless there are truly separate items.
- Meeting recap or status update: decisions, owners and dates first. Keep bullets for action items. Cut filler like "The team had a productive discussion".
- Report, proposal or business case: back every claim with a number, name or example, and cut inflated significance.
- Documentation, how-to or policy: bullets, headers and an accurate "may" are fine. Keep terms consistent.
- LinkedIn post: short lists, one hook question and one or two end-of-line emoji are fine. Three hashtags at most.
- Anything else: apply every rule at full strength.

WHAT TO FIX
1. Words. Replace delve, tapestry, realm, paradigm, embark, beacon, testament to, pivotal, underscore, meticulous, seamless, utilize, showcase, deep dive, unpack, intricate, ever-evolving, holistic, impactful, learnings, at its core, synergy, robust, crucial, vital, leverage, streamline, game-changing, cutting-edge, "in order to", "serves as" and "boasts" with plain words. Flag harness, navigate, foster, elevate, unleash, bolster, spearhead, resonate, facilitate, myriad, transformative, cornerstone and paramount when two or more share a paragraph. Keep a word if it is genuinely the right one.
2. Punctuation and formatting. Remove every em dash (— or --). Fold the thought back into the sentence with a comma, "and" or a clause instead of chopping it into fragments. One bold phrase per section at most. No emoji in headers. Sentence case in subheadings. Turn bullet lists of bare noun phrases into sentences with verbs. Replace generic headers like "Overview" or "Conclusion" with ones that say something.
3. Sentence shapes. Cut "It's not X, it's Y" (allow one if it earns its place), hollow intensifiers (truly, genuinely, to be honest), stacked hedges ("could potentially"), reflexive groups of three, a sentence followed by three stranded fragments, rhetorical-question openers, false concessions ("While X is impressive, Y remains a challenge") and "-ing" tails (", showcasing X, reflecting Y").
4. Transitions and filler. Cut Moreover, Furthermore, Additionally, "In today's...", "It's worth noting", Notably, "Let's dive in", "At the end of the day" and "In conclusion". Start with the point.
5. Voice. Replace vague attributions ("studies show", "experts believe") with the source or a direct claim. Remove flattery ("Great question!"), chatbot openers and closers ("Certainly!", "I hope this helps"), generic endings ("The future looks bright") and brochure language.
6. Leftovers. Remove "As of my last update", unfilled placeholders like [Your Name], citation tokens like "citeturn0search0" or "oaicite", and URL parameters like utm_source=chatgpt.com.
7. Rhythm. Mix short and long sentences and vary paragraph length. Repeat the right word instead of cycling synonyms. Don't sand away every quirk, and don't cut so many connectors that the text turns choppy.

If most of these patterns appear at once, say that patching won't fix it and suggest a full rewrite built around the one-sentence core point.

Work in the language of the text; every language has its own tells (in German, for example, nominalised bureaucratic phrasing and "Darüber hinaus" or "Des Weiteren"). Em dashes go in every language. Leave quoted examples, code, product names and technical terms unchanged.

OUTPUT (rewrite mode)
1. Issues found: quote each one and tag it High, Medium or Low.
2. The rewritten text.
3. What changed, in a few lines.
4. Second pass: check the rewrite against every rule above, including patterns you introduced yourself, and fix them, or say it is clean.
5. End with "Em dash check: 0".

OUTPUT (flag-only mode)
1. Issues found, grouped by severity, each marked "clear problem" or "judgment call".
2. End with "Em dashes found: N".

Never add facts, names, dates, commitments, or feelings and opinions the writer didn't express. If something important is missing, point it out under "What changed" instead.

Only patterns from WHAT TO FIX count as issues, plus vagueness: a metaphor or phrase that hides what actually happened. General style opinions (an ending you'd phrase differently, a rhythm you'd change) are not issues and never justify a rewrite. Keep deliberate metaphors, jokes and stylistic choices, but when one hides the key fact, keep the voice and make the fact explicit. Decide whether to rewrite based only on those patterns. If you find none, or only one or two minor ones, don't rewrite: say the text already reads naturally and return it unchanged. You may add style tips, such as the text-type advice, as a separate list marked optional.

Text:
[Paste your draft here]
```

---

From [pnp/copilot-prompts](https://github.com/pnp/copilot-prompts).
