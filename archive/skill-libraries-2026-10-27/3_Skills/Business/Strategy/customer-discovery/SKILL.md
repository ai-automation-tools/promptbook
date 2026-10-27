---
title: "💼 customer-discovery"
name: customer-discovery
description: Design and run customer interviews that produce evidence instead of encouragement — asking about past behavior rather than future intent, avoiding leading and pitch-shaped questions, sampling for disconfirmation, and synthesizing a set of conversations into findings graded by how much weight they can carry. Use before sizing a market or writing a spec, when validating a problem or a willingness to pay, or when interview notes need turning into something a decision can rest on.
tags: ["skill","business","strategy","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/business/customer-discovery/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Customer Discovery

## What discovery is for

Discovery exists to find out whether a problem is real, painful, and already being
worked around at cost. It is not for validating a solution, and it is definitely not
for collecting quotes that support a decision already made.

The failure mode is specific and it is almost universal: people are kind. Asked
whether they would use your idea, they say yes, because saying no to an enthusiastic
person about a hypothetical is socially expensive and costs them nothing. You come
away with twelve yeses and no information.

Everything below is machinery for getting around that.

## Ask about the past, never the future

Future intent is free to express and unreliable. Past behavior already cost
something, so it carries real information.

| Do not ask | Ask instead |
|:---|:---|
| "Would you use a tool that did X?" | "Walk me through the last time you had to do X." |
| "Would you pay $50/month for this?" | "What do you spend on this today — tools, hours, contractors?" |
| "Is this a big problem for you?" | "When did it last happen? What did it cost you?" |
| "Do you think this is a good idea?" | "What have you already tried? Why did you stop?" |
| "How often does this happen?" | "How many times in the last month? What was the most recent?" |

The pattern: anchor every question to a specific, dated, remembered event. "Tell me
about the last time" is the single most productive sentence in a discovery
interview.

## Do not pitch

The moment you describe your solution, the interview is over. The person switches
from informant to reviewer, starts being polite about your baby, and everything
after that is contaminated.

If you must show something, do it in the last five minutes, after every behavioral
question is answered. Say out loud that you want the harsh version. Then discount
whatever they say anyway.

## Questions that actually discriminate

**The cost question.** "What does this problem cost you today?" — in money, hours,
or missed work. An answer of "not much" is a complete finding: the problem is real
and not worth paying to solve. That is the most common true outcome and the one
people hardest resist hearing.

**The workaround question.** "How are you handling it now?" Everyone with a real
problem has a workaround — a spreadsheet, an intern, a Zapier chain, a recurring
Sunday evening. No workaround usually means no problem. A baroque, maintained
workaround means a problem worth money.

**The budget question.** "Who would have to approve spending on this, and what have
they approved before?" This separates a personal annoyance from a funded priority.
In a business context an enthusiastic user with no budget authority is a very
expensive lead.

**The switching question.** "What would have to be true for you to stop using what
you use now?" Surfaces the real switching costs — data migration, retraining,
contracts, the colleague who built the current thing.

**The failed-search question.** "Have you looked for something to fix this? What did
you find?" Someone who searched and rejected three products is telling you the
category exists and why the incumbents lose. Someone who never searched is telling
you the pain is below the threshold that motivates action.

## Sample for disconfirmation

Twelve interviews with people who already like you is not evidence.

- **Include people who should need this and do not.** They explain the boundary of
  the market, which is what sizing depends on.
- **Include people who tried a competitor and churned**, and people who evaluated
  the category and bought nothing. The second group is usually the largest and the
  least interviewed.
- **Avoid friends and anyone with a stake.** Their bias is not correctable by asking
  them to be honest.
- **Stop at saturation, not at a round number.** When three consecutive interviews
  surface nothing new about the problem, that segment is done. This often happens
  around eight to twelve within a narrow segment, and it is a signal to observe
  rather than a target to hit.
- **Segment before you aggregate.** Ten interviews across four unrelated segments is
  not ten data points about anything. It is four sets of two or three, each too
  small to support a claim.

## Running the conversation

- **Shut up.** The interviewer should be talking well under a quarter of the time.
  Silence after an answer is the cheapest way to get the more honest second half of
  it.
- **Chase the emotion.** Frustration, resignation, and a lowered voice mark the
  places worth five more minutes.
- **Ask "why" up to three times**, then stop. The third why usually reaches the real
  constraint; the fourth makes people defensive.
- **Record what they said, not what you concluded.** Verbatim quotes in the notes,
  interpretation clearly separated. Six weeks later you cannot tell the two apart
  from memory.
- **Note what you did not ask.** A question you ran out of time for is a known gap,
  and writing it down keeps it from silently becoming an assumption.

## Synthesis

Interviews become evidence only after a deliberate synthesis pass. Do it within a
day of the conversation, while the tone is still recoverable.

Grade every finding by what it can support:

| Grade | Means | Example |
|:---|:---|:---|
| `[fact]` | Observed behavior or a verifiable number, stated by someone with direct knowledge | "They pay a contractor $1,800/month to do this manually" |
| `[est]` | Derived across interviews — show the arithmetic and the sample | "6 of 9 in this segment maintain a manual workaround" |
| `[assum]` | A judgment you are making, not something you were told | "We assume the mid-market segment behaves like the two enterprises we spoke to" |

A pattern needs a count and a denominator. "Users want X" is not a finding; "6 of 9
solo operators, 0 of 4 agencies" is one, and the split is usually the more
interesting half.

**Write down what would have changed your mind, and whether it showed up.** A
discovery round that confirmed everything you expected either found a genuinely
obvious problem or was not designed to fail. Say which, in the write-up.

## Traps

- **Counting enthusiasm as demand.** The only reliable signals are money, time
  already spent, and a maintained workaround. Excitement in an interview predicts
  nothing.
- **Interviewing users when buyers decide.** In business sales these are often
  different people with different problems. Talk to both, and label which you are
  quoting.
- **Letting one vivid conversation set the direction.** The most articulate
  interviewee is not the most representative one.
- **Treating "I'd definitely use that" as a finding.** Note it, then ask what they
  currently spend. The gap between the two answers is the real result.
- **Skipping the people who said no.** A sample of the interested is a sample of the
  interested.
- **Synthesizing straight into a recommendation.** Findings first, with grades and
  counts. The recommendation is a separate document and a separate argument.
