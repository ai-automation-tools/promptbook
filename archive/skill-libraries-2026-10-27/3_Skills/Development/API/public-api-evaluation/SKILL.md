---
title: "💻 public-api-evaluation"
name: public-api-evaluation
description: Vet a third-party or public API before writing code against it — auth model, rate limits, licensing and commercial-use terms, data freshness, response stability, and the attribution the terms of service require. Use when choosing between candidate APIs, adding a new data source to a project, reviewing whether an existing dependency is still safe to rely on, or answering "can we actually use this one in production".
tags: ["skill","development","api","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/api/public-api-evaluation/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Public API Evaluation

## Why this exists

The cost of an API is almost never the integration. It is the thing you find out in
month four: the free tier was a trial, the data is refreshed quarterly and you
promised daily, the license forbids the commercial use you built, or the response
shape changes without a version bump. All of that is knowable in twenty minutes
before you write a line of client code.

Evaluate first. Integrate second.

## The seven questions

Answer all seven in writing before the API is approved. An unanswered question is a
finding, not a blank.

### 1. Auth model

What does a caller need, and what does getting it cost?

| Model | What to check |
|:---|:---|
| No auth | Is it really unauthenticated, or unauthenticated-until-popular? Check for a stated policy. |
| API key | Free or paid? Self-serve or approval queue? How long does issuance take? |
| OAuth | Which grant? Does it need a registered app, a review, or a verified domain? |
| Signed requests | HMAC or mTLS means key rotation and clock-skew handling become your problem. |

Record the environment-variable name the key will live under. Never record the key.

### 2. Rate limits and quotas

Get the real numbers, not the marketing ones. Look for:

- The per-second, per-minute, and per-day ceilings, and which one binds first.
- Whether the limit is per key, per IP, per account, or per endpoint.
- What a violation returns — `429` with `Retry-After` is workable, a silent `200`
  with truncated data is not.
- Whether there is a burst allowance, and whether it refills.

If the documentation does not state a limit, that is not "unlimited". It means the
limit is undocumented and you will discover it in production.

### 3. License and commercial use

Read the terms, not the pricing page. The three that bite:

- **Commercial use** — permitted, prohibited, or permitted-on-a-paid-tier.
- **Redistribution and caching** — may you store results? For how long? May you show
  them to your own users?
- **Derived data** — may you compute on it and publish the result?

Classify the answer as `permitted`, `prohibited`, `requires-paid-tier`, or
`unclear`. `unclear` is a real and common answer; treat it as a blocker for anything
customer-facing until someone reads the contract.

### 4. Attribution

Many otherwise-free APIs require a visible credit line, a link back, or a specific
logo. OpenStreetMap-derived services and most government open-data portals do.

Capture the exact required string and where it has to appear. An attribution you
discover after launch is a UI change, a legal review, and a bad week.

### 5. Data freshness

Ask what the underlying update cadence is, not how fast the endpoint responds.

- Real-time, hourly, daily, monthly, annual, or ad-hoc?
- Is there a `last_updated` field in the payload? If not, you cannot tell a stale
  response from a fresh one.
- What is the lag between a real-world event and its appearance in the API?

A 200ms response carrying 2023 data is slow data served quickly. Say so plainly.

### 6. Stability and versioning

- Is the API versioned in the path, a header, or not at all?
- Is there a deprecation policy with a notice period?
- Does the provider publish a changelog or status page?
- Search for recent breaking-change complaints. An unversioned API with an active
  issue tracker full of "this broke overnight" is a maintenance commitment.

### 7. Failure behavior

Call it once with a deliberately bad request. What comes back?

- A structured error with a code you can branch on, or an HTML error page?
- Does a not-found return `404`, or `200` with an empty array, or `200` with
  `{"error": "..."}`? All three exist and they need different client code.
- Is there a status page, and does it have history?

## The scoring pass

Rank candidates on what actually decides the choice, not on feature count.

| Weight | Criterion |
|:---|:---|
| Blocking | License permits your use; auth is obtainable; freshness meets the requirement |
| Heavy | Rate limit supports projected volume; failure modes are structured |
| Moderate | Versioning and deprecation policy; documentation accuracy |
| Light | Response shape convenience, SDK availability |

An API that fails a blocking criterion does not get a score. It gets rejected with a
one-line reason.

## Record the verdict

Write the evaluation down next to wherever the integration will live. The minimum
useful record:

```yaml
api: <name>
base_url: <https://...>
evaluated: <YYYY-MM-DD>
status: validated | limited | requires-key | rejected
auth: none | api-key | oauth2 | signed
env_var: <NAME_OF_VARIABLE>       # the name only, never the value
rate_limit: <the real numbers, and which binds first>
commercial_use: permitted | prohibited | requires-paid-tier | unclear
attribution: <exact required string, or none>
freshness: <update cadence, and the lag>
versioning: <path | header | none> ; deprecation policy: <yes/no>
risk_notes: <what will bite, in one or two sentences>
```

Date the record. An evaluation with no date is a claim about an API as it was at
some unknown time, which is not much of a claim.

## Traps

- **Judging by the docs alone.** Documentation lags implementation. Make one real
  call before approving.
- **Treating a generous free tier as a commitment.** It is a business decision the
  provider can reverse. Ask what happens to your project if it does.
- **Assuming HTTPS means trustworthy.** Transport security says nothing about data
  quality, licensing, or uptime.
- **Skipping the terms because the API is "public".** Public means reachable. It
  does not mean unrestricted.
- **Evaluating one candidate.** Without a second option you are not choosing, you
  are rationalizing.
