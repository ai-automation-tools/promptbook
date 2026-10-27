---
title: "💻 api-client-resilience"
name: api-client-resilience
description: Write HTTP clients for third-party APIs that fail predictably instead of hanging — timeouts on every call, retries with exponential backoff and jitter, circuit breaking, idempotency keys, pagination that terminates, and caching that respects the provider's terms. Use when integrating any external API, debugging a client that hangs or retries a storm, or reviewing integration code before it reaches production.
tags: ["skill","development","api","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/api/api-client-resilience/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# API Client Resilience

## The default failure

An HTTP client written without deliberate failure handling does not fail. It hangs.
The request goes out, the provider is degraded rather than down, no response comes
back, and the caller waits forever holding a connection, a worker, and a lock. The
outage propagates to you even though nothing in your code is wrong.

Every rule below exists to turn an unbounded wait into a bounded, observable error.

## Timeouts on every call, without exception

There is no such thing as a request that is fine without a timeout. Most HTTP
libraries default to none.

Set two separate values:

- **Connect timeout** — how long to wait for the TCP and TLS handshake. Short; a
  few seconds. A provider that cannot accept a connection quickly is not going to
  answer quickly either.
- **Read timeout** — how long to wait for the response body after the request is
  sent. Sized to the endpoint's real behavior, not to a round number.

Measure the endpoint's p99 before choosing the read timeout. A timeout below the
real p99 converts a slow success into a failure and then retries it, which is worse
than waiting.

```python
# httpx — separate connect and read budgets, and a ceiling on the whole operation
timeout = httpx.Timeout(connect=3.0, read=10.0, write=10.0, pool=5.0)
```

## Retry only what is retryable

A retry is correct when the failure was transient and the request is safe to repeat.
It is wrong, and sometimes destructive, otherwise.

| Retry | Do not retry |
|:---|:---|
| Connection errors, read timeouts | `400`, `401`, `403`, `404`, `422` |
| `429` — honor `Retry-After` when present | Anything non-idempotent without an idempotency key |
| `500`, `502`, `503`, `504` | A request whose body you have already consumed as a stream |

`429` deserves its own path. A rate-limit response is the provider telling you the
correct delay; guessing a shorter one is how a client gets blocked.

## Backoff with jitter

Fixed-interval retries from many clients synchronize into a thundering herd that
keeps a recovering service down. Exponential backoff alone still synchronizes,
because every client computes the same delays. Jitter is the part that actually
spreads the load.

```python
import random

def backoff_delay(attempt: int, base: float = 0.5, cap: float = 30.0) -> float:
    """Full-jitter exponential backoff. attempt is 0-indexed."""
    return random.uniform(0, min(cap, base * 2 ** attempt))
```

Cap both the delay and the attempt count. Three to five attempts is usually the
whole useful range — beyond that the provider is down, not flaky, and the right
move is to fail and say so.

## Circuit breaking

Retries help with a blip. They make a sustained outage worse, because every caller
keeps paying the full timeout before failing.

A circuit breaker tracks the recent failure rate per upstream and short-circuits
when it crosses a threshold:

- **Closed** — requests flow normally, failures are counted.
- **Open** — requests fail immediately without a network call, for a cooldown.
- **Half-open** — a single probe request is allowed. Success closes the circuit,
  failure re-opens it.

The value is the immediate failure. A caller that learns in a microsecond that the
upstream is down can serve stale data, degrade gracefully, or return a useful error.
A caller that learns after ten seconds can only time out.

Keep one breaker per upstream, not one global breaker. A down weather API should not
open the circuit to the payments API.

## Idempotency for writes

A retry after a timeout is indistinguishable, from your side, from a retry after a
success you never saw. If the request creates or charges something, that ambiguity
is a duplicate.

Send an idempotency key — a client-generated unique value, stable across retries of
the *same logical operation*:

- Generate the key once, before the first attempt. Regenerating it per retry defeats
  the purpose entirely.
- Reuse it for every retry of that operation.
- Check whether the provider supports one. If it does not, writes are not safely
  retryable and the client must surface the ambiguity rather than hide it.

## Pagination that terminates

Every paginated fetch needs a stop condition that does not depend on the provider
behaving.

- **Cap the page count.** An off-by-one on the server side, or a cursor that returns
  itself, becomes an infinite loop and an unbounded memory allocation.
- **Detect a repeated cursor.** If the next cursor equals the current one, stop and
  raise. This is a real provider bug, not a theoretical one.
- **Stop on an empty page**, and on a page shorter than the requested size, only if
  the provider documents that as the terminal signal. Some do not.
- **Stream rather than accumulate** when the total is unbounded. Yield records as
  they arrive instead of building one enormous list.

## Caching

Cache to reduce load and cost, but only where the terms permit it — some providers
restrict storage duration, and that is a licensing question before it is a technical
one.

- Respect `Cache-Control` and `ETag` when the provider sends them. A conditional
  request returning `304` is cheaper than a full fetch and usually does not count
  against the quota the same way.
- Key the cache on the full normalized request, including query parameters and the
  auth scope. A cache shared across users of different permission levels leaks data.
- Set a TTL no longer than the data's real update cadence. Caching an hourly feed
  for a day serves stale data confidently.
- Cache negative results briefly. Repeatedly re-fetching a `404` burns quota.

## Observability

A client you cannot see is a client you cannot debug.

Log, per outbound call: the upstream name, the operation, the status code, the
duration, the attempt number, and whether a retry or the breaker fired. Never log
the request headers wholesale — that is how keys reach log aggregators.

Emit metrics for request count by upstream and status class, latency distribution,
retry rate, and breaker state changes. The retry rate is the early warning; it rises
well before the error rate does.

## Review checklist

Before an integration ships:

- [ ] Connect and read timeouts set explicitly, sized from measured latency
- [ ] Retry set restricted to transient failures and idempotent operations
- [ ] Backoff is exponential with jitter, with an attempt cap
- [ ] `429` honors `Retry-After` rather than the generic backoff
- [ ] Circuit breaker per upstream, with a half-open probe
- [ ] Idempotency key generated once per logical write, reused across retries
- [ ] Pagination has a page cap and a repeated-cursor guard
- [ ] Cache TTL is at or below the data's update cadence, and caching is permitted
- [ ] Secrets never reach logs; headers are redacted before logging
- [ ] Errors surface the upstream name and status, not a bare `None`
