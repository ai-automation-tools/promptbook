---
title: "✍️ post-publish-analytics"
name: post-publish-analytics
description: Read what happened after a piece of media published and turn it into the next decision, instead of vanity-metric theater — reading retention and drop-off curves, distinguishing reach from engagement from conversion, running a fair A/B test on thumbnails and titles, and knowing which numbers are noise. Use when reviewing a video's or post's performance, deciding what to make next, diagnosing an underperforming piece, or setting up a test.
tags: ["skill","content","media","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/media/post-publish-analytics/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Post-Publish Analytics

## Analytics exist to change the next piece

Numbers after publish are only worth reading if they change what you make next.
Collecting views and screenshotting a nice chart is theater — it feels like rigor and
informs nothing. The whole point is the feedback loop: this piece performed this way,
for this reason, so the next one does more of what worked and less of what did not.

The discipline is to read the metric that maps to a decision and ignore the one that
just makes the dashboard look busy.

## Reach, engagement, conversion — three different questions

They get lumped into "performance" and they answer different things. Confusing them
leads to fixing the wrong stage.

| Layer | Measures | Answers |
|:---|:---|:---|
| Reach | Impressions, views, unique viewers | Did it get in front of people? |
| Engagement | Watch time, retention, likes, comments, shares, saves | Did the people who saw it care? |
| Conversion | Subscribes, clicks, sign-ups, sales | Did they do the thing it was for? |

A piece with huge reach and terrible engagement was pushed by an algorithm and
rejected by humans — the problem is the content, not the distribution. A piece with
great engagement and tiny reach is good content that is not being surfaced — the
problem is packaging or timing, not quality. You cannot tell which you have without
separating the layers, and the fix is completely different for each.

## Retention is the metric that teaches you the most

For video, the retention curve — what fraction is still watching at each moment — is
the single most useful signal, because it points at *where* the piece succeeded and
failed, not just whether it did.

- **The first few seconds decide the rest.** A steep drop in the opening means the
  hook failed, and everything after it is being watched by almost no one. This is the
  highest-leverage fix on the whole curve.
- **A sudden cliff mid-piece marks a specific problem** — a slow section, a broken
  promise, a tangent. Go to that timestamp and watch what happens there. The curve is
  telling you exactly where to look.
- **A gentle, steady decline is normal and healthy.** People leave gradually; that is
  expected, not a failure.
- **A bump upward** — rare — means people rewound or the piece got shared into a
  moment. Note what was on screen; it is a repeatable move.
- **Average view duration as a percentage** is comparable across pieces of different
  lengths; raw watch-time seconds are not.

Read the curve against the content. The curve says where; the content at that
timestamp says why.

## Which numbers are signal, which are noise

- **Rate over count**, wherever volume varies. Click-through rate, retention
  percentage, and engagement rate are comparable across pieces; raw views, likes, and
  comments are not, because they scale with reach.
- **Absolute follower count is a vanity metric.** Follower *growth attributable to a
  piece*, and what those followers then do, is the real number.
- **A single piece's numbers are noisy.** One video over- or under-performs for
  reasons you cannot see — timing, an algorithm mood, an external event. The pattern
  across five to ten pieces is the signal; one data point is an anecdote.
- **Comments are qualitative gold and quantitatively unreliable.** Read them for *why*
  something landed or did not — the count tells you little, the content tells you a
  lot.
- **Watch the trend, not the snapshot.** Is engagement rate rising or falling across
  recent pieces? That direction is the thing to act on.

## A/B testing thumbnails and titles

Packaging — thumbnail and title — often determines a piece's fate more than its
content, and it is testable, but only if the test is fair.

- **Change one variable at a time.** Test two thumbnails with the same title, or two
  titles with the same thumbnail. Change both and a winner tells you nothing about
  which change won.
- **Give it enough impressions to be real.** A difference on a few hundred views is
  noise. Let it run until the sample is large enough that the gap is unlikely to be
  chance — and resist calling it early because the number you hoped for showed up
  first.
- **Test conditions must match.** The same piece, the same audience, ideally the
  platform's built-in test tool that rotates variants on the same traffic. Comparing a
  thumbnail on Monday to a different one on Saturday is not a test — the day is a
  second variable.
- **A/B results are packaging lessons, not content lessons.** A winning thumbnail
  tells you what earns the click, not what earns the watch. Retention tells you the
  second thing.

## From numbers to the next decision

The output of an analytics review is a decision, written down, not a dashboard.

- **Name what worked and make more of it.** A hook style, a topic, a format, a length
  that retained — that is a repeatable move, so repeat it deliberately.
- **Name what failed and why.** "The intro was too long — 30% dropped in the first ten
  seconds" is actionable; "it underperformed" is not.
- **Separate a content problem from a packaging problem** before deciding, because the
  fixes are unrelated. Low CTR with high retention is packaging; high CTR with low
  retention is content.
- **Decide against the pattern, not the outlier.** Change strategy when several pieces
  agree, not because one flopped or soared.

## Traps

- **Vanity metrics.** Total views and follower count feel like success and rarely map
  to a decision. Rates and attributable growth do.
- **Reading one piece as a trend.** A single result is too noisy to steer by.
- **Confusing the three layers.** Fixing distribution when the problem is the content,
  or vice versa, because "performance" was read as one number.
- **Unfair A/B tests.** Two variables at once, too small a sample, or mismatched
  conditions — the result is confident and meaningless.
- **Calling a test early** because the hoped-for result appeared before the sample was
  large enough.
- **Collecting numbers without a decision.** If the review does not change the next
  piece, it was theater.
