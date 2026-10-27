---
title: "💻 rate-limit-and-quota-management"
name: rate-limit-and-quota-management
description: Stay inside a third-party API's rate limits and quotas on purpose rather than by accident — reading the limit headers, client-side throttling with a token bucket, budgeting a finite daily or monthly allowance across callers, handling 429 and Retry-After correctly, and detecting silent throttling. Use when an integration is getting rate-limited or blocked, when planning call volume against a paid quota, or when several jobs share one API key.
tags: ["skill","development","api","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/api/rate-limit-and-quota-management/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Rate Limit and Quota Management

## Two different constraints

They get conflated and they need different mechanisms.

- **A rate limit** is about *speed*. Requests per second, minute, or hour. Exceeding
  it gets you a `429` now and a normal response a moment later. The fix is pacing.
- **A quota** is about *total volume*. Calls per day or month, often tied to money.
  Exhausting it stops you until the window resets. The fix is budgeting.

A client that paces perfectly can still burn a monthly quota by lunchtime on the
first of the month. Handle both.

## Read the limit from the response

Most providers report your standing in headers. Read them on every response, not
just on failures — that is how you find out you are approaching a limit rather than
discovering you crossed it.

| Header | Meaning |
|:---|:---|
| `RateLimit-Limit` / `X-RateLimit-Limit` | The ceiling for the current window |
| `RateLimit-Remaining` / `X-RateLimit-Remaining` | Calls left in this window |
| `RateLimit-Reset` / `X-RateLimit-Reset` | When the window resets — epoch seconds or delta seconds, and providers disagree on which |
| `Retry-After` | On a `429` or `503`: seconds, or an HTTP date |

Two details cause real bugs:

- **`RateLimit-Reset` is ambiguous.** Some providers send an absolute epoch, some a
  relative number of seconds. A value under about 10,000 is almost certainly a
  delta; larger is an epoch. Check the documentation and pin the interpretation in
  the adapter, with a comment saying which one this provider uses.
- **`Retry-After` accepts an HTTP date**, not only an integer. Parsing it as an int
  and falling back to a default on failure silently converts a 300-second wait into
  your default backoff.

## Client-side throttling

Do not rely on the provider to tell you to slow down. By the time it does, you have
already spent a request and possibly annoyed a rate-limiter that counts rejected
calls against you.

A token bucket is the right shape: it enforces an average rate while allowing a
bounded burst, which matches how most providers actually measure.

```python
import threading, time


class TokenBucket:
    """Average `rate` requests/second, bursting up to `capacity`."""

    def __init__(self, rate: float, capacity: float):
        self.rate, self.capacity = rate, capacity
        self._tokens = capacity
        self._last = time.monotonic()
        self._lock = threading.Lock()

    def acquire(self, tokens: float = 1.0) -> None:
        """Block until `tokens` are available."""
        while True:
            with self._lock:
                now = time.monotonic()
                self._tokens = min(
                    self.capacity, self._tokens + (now - self._last) * self.rate
                )
                self._last = now
                if self._tokens >= tokens:
                    self._tokens -= tokens
                    return
                deficit = (tokens - self._tokens) / self.rate
            time.sleep(deficit)
```

Use `time.monotonic()`, never wall-clock time. A clock adjustment mid-run makes a
wall-clock bucket either stall or release a flood.

Set the configured rate **below** the documented limit. Eighty percent is a
reasonable default. The margin absorbs clock skew, retries, and the fact that the
provider's window boundaries do not line up with yours.

### One limiter per key, not per process

The limit applies to the credential, so the limiter must too. Three worker processes
each running their own 80%-of-limit bucket against one key is 240% of the limit.

Within a process, share one limiter instance per upstream. Across processes sharing
a key, you need shared state — a Redis-backed counter, or a single gateway process
that owns the credential. If neither exists, divide the limit by the number of
workers and document that you did.

## Budgeting a finite quota

When the allowance is daily or monthly, pacing is not enough. Decide up front who
gets to spend it.

- **Compute the sustainable burn rate.** Monthly quota divided by the days left,
  then by the hours you actually run. Compare that to projected demand *before*
  building, not after the first overage invoice.
- **Reserve headroom for interactive work.** If batch jobs are allowed to consume
  100% of the quota, a user-triggered request on the 28th fails. Cap batch usage at
  a fraction and let interactive traffic draw on the rest.
- **Track consumption yourself.** Provider dashboards lag, sometimes by hours. Count
  calls locally, per key, per day, and alert at a threshold you choose rather than
  at exhaustion.
- **Prefer conditional requests.** An `ETag` or `If-Modified-Since` request that
  returns `304` is often free or cheap against the quota. Check whether this
  provider counts them.
- **Cache aggressively at the quota boundary.** The cheapest call is the one you do
  not make. Size the TTL by the data's real update cadence.
- **Degrade deliberately when the budget is spent.** Serve cached data with a
  staleness warning, or fail with a clear message. Silently returning nothing looks
  identical to "there is no data".

## Handling 429

A `429` is information, not just an error.

1. **Honor `Retry-After` when present.** It is the provider's own answer to "how
   long". A generic exponential backoff that waits less is how a temporary limit
   becomes an account block.
2. **Fall back to jittered exponential backoff** only when the header is absent.
3. **Count rate-limit responses as a distinct metric.** A rising rate means the
   pacing is wrong, and it is visible well before it becomes an outage.
4. **Do not retry indefinitely.** After a small number of attempts, the answer is
   that you are over budget. Surface that instead of hiding it in a retry loop.
5. **Feed the signal back into the limiter.** A rate-limit response should lower the
   effective rate for a cooldown, not just delay one request.

## Detect silent throttling

Not every provider returns `429`. Some degrade quietly, and these are harder to
catch because everything looks successful:

- **Truncated results** — the response carries fewer records than requested with no
  pagination cursor. Compare the returned count against the requested limit and warn
  on a mismatch.
- **Stale responses** — an unchanging `last_updated` across calls while the upstream
  data moves.
- **Latency cliffs** — a sudden step change in p50 latency with no error-rate change
  often means request queueing on the provider's side.
- **Empty successes** — `200` with an empty array on a query that previously matched.

Assert on the shape of a successful response, not only on its status code. A `200`
is not evidence that you got the data.

## Checklist

- [ ] Documented limits recorded next to the adapter, with the units and the window
- [ ] Rate-limit headers parsed, with the `Reset` interpretation pinned and commented
- [ ] `Retry-After` parsed for both integer-seconds and HTTP-date forms
- [ ] Token bucket configured below the documented limit, shared per credential
- [ ] Cross-process sharing handled, or the per-worker division documented
- [ ] Local call counting per key, with an alert threshold below exhaustion
- [ ] Batch workloads capped so interactive traffic keeps headroom
- [ ] Cache TTL matched to the data's update cadence
- [ ] Rate-limit responses tracked as their own metric
- [ ] Response-shape assertions that catch silent truncation
