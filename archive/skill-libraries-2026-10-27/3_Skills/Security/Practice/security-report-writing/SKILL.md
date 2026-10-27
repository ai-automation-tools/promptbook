---
title: "🛡️ security-report-writing"
name: security-report-writing
description: Turn verified findings into a client-ready security report that gets read and acted on — an executive summary a non-technical decision-maker can act from, findings structured so each carries impact, evidence, and a verifiable fix, correct severity communication, and redaction that keeps secrets and raw exploit detail out of a document that will be forwarded. Use when writing up an assessment, drafting the executive summary, structuring findings, or reviewing a report before it leaves.
tags: ["skill","security","practice","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/security/security-report-writing/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Security Report Writing

## The report is the deliverable

The testing is not the product. The report is. A brilliant assessment written up
badly gets skimmed, misunderstood, and shelved, and the risk you found stays
unfixed. Two audiences read it and they need different things from the same
document: an executive who decides whether and how much to spend, and an engineer
who has to apply the fix and verify it.

Write for both, in the right order, without making either read the other's section.

## Structure

```
1. Executive summary        one page, non-technical, decision-oriented
2. Scope and methodology     what was and was not tested, and how
3. Findings                  one per issue, ranked most-severe first
4. Remediation roadmap       what to fix, in what order, by when
5. Appendices                evidence, tooling, raw output
```

The order is not negotiable. The reader who can authorize the fixes reads the first
page and stops. Everything that reader needs is on it.

## The executive summary

One page. No jargon that a business decision-maker would have to look up. It answers
four questions and nothing else:

1. **What was assessed, and what was the state of it?** One or two sentences of plain
   framing.
2. **What is the overall risk?** A clear statement, not a color. "Three issues would
   let an unauthenticated attacker read other customers' data" beats "posture is
   moderate."
3. **What are the few things that matter most?** The two or three findings that carry
   the real risk, each in one sentence of business consequence — data exposed,
   service disruptable, compliance obligation breached.
4. **What should happen now?** The decision being asked for, and the rough shape of
   the effort.

Write it last, after the findings exist, and resist the reflex to make it
comprehensive. A summary that lists all fourteen findings is not a summary; it is a
table of contents that buried the three that matter.

## Anatomy of a finding

Every finding is the same shape, so a reader learns the pattern once and can navigate
the rest by scanning.

| Section | Contains |
|:---|:---|
| Title | The issue in a plain phrase, not a CWE number |
| Severity | The rating, and the one-line reason for it |
| Affected | The specific component, endpoint, host, or code path |
| Impact | What an attacker gains — in business terms, not mechanism |
| Description | How it works and why it is reachable |
| Evidence | The redacted proof it is real |
| Remediation | The root-cause fix, concretely, plus how to verify it worked |

Two of these are where reports usually fall down:

**Impact is a business consequence, not a mechanism.** "SQL injection in the login
form" is the mechanism. "An unauthenticated attacker can read the entire customer
table, including password hashes" is the impact. The reader deciding whether to
prioritize this needs the second one.

**Remediation names the root cause and how to verify.** "Fix the SQL injection" is
half a finding. "Replace string concatenation with a parameterized query in
`auth.py:82`; verify by confirming the payload in the evidence now returns a login
error rather than a row" is a finding an engineer can close and a reviewer can
confirm. A fix the client cannot verify is a fix they cannot trust they applied.

## Severity, communicated honestly

A rating exists to order the reader's attention, and it only works if it is
defensible.

- **Rank by reachable, realistic risk**, not by the scariest label available. A
  critical-rated issue that requires physical access to an air-gapped host is not
  what the reader should fix first, and rating it critical trains them to distrust
  your criticals.
- **Show the reasoning.** A severity with a one-line justification — reachability,
  what it exposes, what an attacker realistically achieves — is one the client can
  act on. A bare "High" invites an argument.
- **A short ordered list beats a wall of criticals.** Ten findings all rated critical
  tell the reader nothing about where to start, which is the one thing the rating was
  supposed to do.
- **Label the unconfirmed as suspected.** A lead you could not fully demonstrate
  belongs in the report as exactly that. Presenting it at the same confidence as a
  proven finding is the fastest way to lose credibility on the ones you did prove.

## Redaction

The report will be forwarded — to a vendor, a board, an auditor, a group chat. Write
it as a document that leaves the room.

- **Never include a live secret.** A discovered credential is reported as "exposed at
  `<location>`, rotate immediately" — its location and the fact of exposure, never its
  value. The same for tokens, keys, and connection strings.
- **Redact personal data** in evidence. A screenshot proving access to a customer
  record proves it just as well with the personal fields masked.
- **Trim exploit detail to what proves the point.** Evidence shows the door opens; it
  is not a runnable weapon. Enough to reproduce and confirm the fix, no more.
- **Redact at capture, not at review.** The gap between capturing a screenshot with a
  secret in it and remembering to blur it later is where secrets leak into the final
  PDF.

## Evidence

Evidence turns a claim into a finding. It has to actually support the specific claim.

- Attach the minimum that demonstrates the issue is real and reachable — a request
  and response, a redacted screenshot, the relevant log line.
- Label what each artifact proves. An unlabeled screenshot makes the reader do the
  work of connecting it to the claim, and some will not.
- Keep the raw, high-volume material in an appendix and reference it. The finding
  stays readable; the detail stays available.

## Before it leaves

- [ ] Executive summary is one page, jargon-free, and leads with the decision
- [ ] Findings are ordered most-severe first
- [ ] Every finding states business impact, not just mechanism
- [ ] Every remediation names the root cause and how to verify the fix
- [ ] Severities each carry a one-line justification
- [ ] Unconfirmed items are labeled suspected, not stated as proven
- [ ] No live secret, credential, or token value appears anywhere
- [ ] Personal data in evidence is masked
- [ ] Scope section states what was *not* tested, so a gap is not read as a clean bill
- [ ] The report reads correctly to someone who was not in the engagement
