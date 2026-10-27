---
title: "🛡️ security-metrics-and-posture"
name: security-metrics-and-posture
description: Measure a security program over time instead of one point in it — choosing metrics that drive a decision rather than decorate a dashboard, tracking remediation SLAs and mean-time-to-remediate, keeping a risk register that reflects reality, and reporting a trend to leadership honestly. Use when building a security dashboard, setting remediation SLAs, preparing a posture report for leadership or a board, or turning a pile of findings into a program you can steer.
tags: ["skill","security","practice","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/security/security-metrics-and-posture/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Security Metrics and Posture

## Measure to decide, not to decorate

A security dashboard usually fills up with numbers that are easy to collect and
change nothing: total alerts, patches applied, training completion. They go green,
leadership relaxes, and the org is no safer, because none of those numbers is tied to
a decision anyone makes differently based on its value.

A metric earns its place only if a specific person changes a specific action when it
moves. Everything that fails that test is noise on a screen. Start from the decisions
the program actually makes, then find the smallest number that informs each one.

## Metrics that drive a decision

| Metric | Decision it informs |
|:---|:---|
| Mean time to remediate, by severity | Whether remediation capacity matches inflow |
| Percentage of findings past SLA | Where to escalate or add people |
| Open critical/high count, trend | Whether risk is accumulating or draining |
| Recurrence rate of a finding class | Whether fixes address root cause or symptom |
| Coverage: assets under monitoring / total | Where the blind spots are |
| Time from disclosure to patch, for external CVEs | Whether the patch pipeline keeps up with the threat |

Each of these has an owner and an action attached. Contrast the vanity versions:
total alerts (rises with logging, not with risk), patches applied (says nothing about
what is still unpatched), training completion (measures attendance, not behavior).

**Prefer a trend to a snapshot.** "42 open highs" means nothing alone. "42, down from
70 last quarter" means the program is working; "42, up from 20" means it is falling
behind. The direction is the finding.

**Prefer a rate to a count** where volume varies. "12% of criticals breach SLA" is
comparable across quarters; "8 breached SLA" is not, if the total tripled.

## Remediation SLAs

An SLA turns "we should fix that" into a commitment with a clock, which is what makes
remediation measurable at all.

- **Set the window by severity**, from the moment of confirmation, not discovery.
  Critical in days, high in weeks, medium in a quarter, low as capacity allows — tuned
  to what the org can actually sustain. An SLA nobody can meet is theater that
  everyone learns to ignore.
- **Measure mean-time-to-remediate against it**, and track the breach rate. The breach
  rate is the honest signal: a rising one means capacity is short, not that people are
  lazy, and the fix is usually resourcing, not exhortation.
- **Define "remediated" precisely** — verified fixed, not "ticket closed." A fix
  marked done but never confirmed is how the same finding reappears next quarter and
  the recurrence-rate metric catches it.
- **Track accepted risk separately.** A finding the business consciously chose not to
  fix is a decision with an owner and a review date, not an open finding aging past
  SLA. Conflating the two makes both metrics lie.

## The risk register

The register is the program's memory. Its failure mode is going stale — becoming a
document that was true once, that nobody trusts, and that gets rebuilt from scratch
every audit.

Keep it real by keeping it small and owned:

- **One row per risk**, with a plain description, a likelihood and impact
  assessment, an owner, a treatment decision (mitigate / accept / transfer / avoid),
  and a review date.
- **Score consistently** so rows are comparable. Whatever scale you use, apply it the
  same way to every row; an inconsistent scale makes the ranking meaningless.
- **Every row has an owner who is a person**, not a team. A risk owned by "IT" is
  owned by no one.
- **Review on the date, and record that you did.** A register with review dates in the
  past is a register nobody is using. The review is what keeps likelihoods honest as
  the environment changes.
- **Close risks explicitly.** A risk that is genuinely gone is closed with a note, not
  deleted. The history is evidence for the next audit and the next incident.

## Reporting to leadership

The board and the executive team decide funding and risk tolerance. They need a story
they can act on, in their language, not a screenshot of the SIEM.

- **Lead with the trend and the decision.** "Remediation is keeping pace with critical
  inflow; the medium backlog is growing and will need either more capacity or a
  formal risk acceptance next quarter" is a board sentence. A chart with no sentence is
  not.
- **Translate to business consequence.** Not "300 vulnerabilities," but "three of them
  could expose customer data; here is the plan and timeline for those three."
- **Report honestly, including the bad direction.** A posture report that is always
  green is a report that is not being read critically, and the first real incident
  destroys its credibility. Naming what is getting worse is what makes the green parts
  believable.
- **Show what a decision buys.** If more remediation capacity would move
  mean-time-to-remediate from weeks to days on criticals, say so with the number. That
  is the sentence that funds the program.
- **Keep it stable quarter to quarter.** The same handful of metrics, reported the
  same way, so the trend is legible. Changing the dashboard every quarter hides the
  trend, which is usually the point when the trend is bad.

## Traps

- **Vanity metrics that only rise.** Total alerts, logs ingested, tools deployed — all
  go up and none map to risk.
- **A snapshot with no baseline.** A single number with nothing to compare it to
  cannot tell anyone whether things are improving.
- **SLAs nobody can meet.** They train the org to treat every deadline as optional,
  including the ones that matter.
- **A risk register maintained only for audits.** It becomes fiction between them and
  misleads exactly when an incident makes people go read it.
- **An always-green report.** It is either not measuring the right things or not being
  honest about them, and it fails catastrophically at the worst moment.
- **Measuring activity instead of outcome.** "We ran 40 scans" is activity. "Reachable
  critical risk fell 30%" is outcome. Fund the second.
