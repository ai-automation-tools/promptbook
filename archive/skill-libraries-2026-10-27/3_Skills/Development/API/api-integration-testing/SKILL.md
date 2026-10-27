---
title: "💻 api-integration-testing"
name: api-integration-testing
description: Test code that calls third-party APIs without hammering live services or writing tests that pass against a fantasy — recorded fixtures, contract tests that pin the shape you depend on, a separate opt-in live smoke suite, and error-path coverage for timeouts, rate limits and malformed payloads. Use when adding an API integration, when a test suite needs network isolation, or when an upstream change broke production without any test noticing.
tags: ["skill","development","api","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/api/api-integration-testing/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# API Integration Testing

## The two failure modes

**Tests that hit the live API.** They are slow, they fail when the provider has a
bad morning, they burn quota, and they cannot run in CI without credentials. Worst
of all, a red build now means "someone else's service is down", so people learn to
ignore it.

**Tests that mock everything by hand.** The mock returns what the developer believed
the API returns. It passes forever, including after the provider changes the
response shape, because the mock is a record of an assumption rather than of
reality.

The way out is a layered suite where each layer answers a different question.

## Four layers

| Layer | Question it answers | Network | Runs in CI |
|:---|:---|:---|:---|
| **Unit** | Does my parsing and normalization logic handle this payload? | No | Always |
| **Fixture / replay** | Does my client produce the right request and handle a real recorded response? | No | Always |
| **Contract** | Does the live API still return the shape I depend on? | Yes | Scheduled, not per-commit |
| **Live smoke** | Does the whole path work end to end with real credentials? | Yes | Manual or scheduled |

The first two gate every commit. The second two run on a schedule and alert a human
without blocking anyone's merge. That split is the whole design: a provider outage
must never be able to turn the build red.

## Record fixtures from reality

A fixture is only worth having if it came from the live API. Capture it once, commit
it, and replay it.

```
tests/
  fixtures/
    <provider>/
      search_books__ok.json
      search_books__empty.json
      search_books__rate_limited.json
      search_books__malformed.json
```

Rules that keep fixtures honest:

- **Capture the whole response**, including status code and the headers you branch
  on. A body-only fixture cannot test rate-limit handling.
- **Redact credentials at capture time.** Strip auth headers and any key in a query
  string before the file is written, not before it is committed. The gap between
  those two moments is where secrets leak.
- **Redact personal data too**, and note in the fixture that you did. A test fixture
  is a permanent, widely-copied artifact.
- **Date the capture.** A comment or a sidecar field recording when this was real.
  A three-year-old fixture passing tells you nothing about today.
- **Re-capture deliberately.** When a contract test fails, re-record rather than
  hand-editing the fixture to match. Hand-editing is how a fixture drifts back into
  fantasy.

Assert on the *outgoing request* as well as the parsed result. Most integration bugs
are a wrong parameter name or a missing header, and a test that only checks the
parse will not see them.

## Contract tests

A contract test calls the live API and asserts only the narrow shape your code
actually depends on. It is not a test of the provider's correctness — it is an alarm
for the day their response stops matching your assumptions.

Assert the minimum:

- The fields you read exist, at the path you read them from.
- Their types are what you parse them as.
- The documented error shape still appears for a deliberately bad request.
- Pagination still signals its end the way you detect it.

Do not assert on values. `records[0].name == "Canada"` is a test of the world, not of
the contract, and it will fail for reasons that are not your problem.

Keep these out of the per-commit path. Run them nightly or weekly, and route a
failure to a person rather than to a pull request.

## The live smoke suite

One end-to-end call per operation, with real credentials, run on demand.

Design it so a missing credential skips rather than fails. A contributor without a
key should be able to run the whole suite and see honest skips, not a wall of red
that trains them to stop running it.

```python
import os, pytest

requires_key = pytest.mark.skipif(
    not os.getenv("PROVIDER_API_KEY"),
    reason="PROVIDER_API_KEY not set - live smoke skipped",
)
```

Give the suite a dry-run mode that enumerates what it *would* call without making a
request. That is what you run in CI: it catches an operation that exists in the
catalog but has no adapter behind it, with no network at all.

## Cover the error paths

The happy path is the part that already works. These are the ones that reach
production untested:

| Case | What the test proves |
|:---|:---|
| Connection timeout | The client raises a typed error rather than hanging |
| Read timeout mid-body | A partial response does not parse as a success |
| `429` with `Retry-After` | The documented delay is honored, not the generic backoff |
| `429` without `Retry-After` | Falls back to jittered backoff and stops at the attempt cap |
| `500` then `200` | The retry succeeds and the result is correct |
| `500` repeatedly | Fails with the upstream named, after the cap, without an infinite loop |
| Malformed JSON | Raises a parse error naming the provider, not a bare `JSONDecodeError` |
| `200` with an error body | Treated as a failure, not as an empty success |
| Empty result set | Returns no records plus a warning, not an error |
| Truncated page | Warns rather than silently returning a short list |
| Repeated pagination cursor | Terminates rather than looping |

Simulate timeouts by having the transport raise, not by actually sleeping. A test
suite that waits ten seconds to prove a ten-second timeout is a test suite people
will delete.

## Isolating the network

Whatever the language, the goal is the same: make an accidental live call in the
unit or fixture layer impossible rather than merely unlikely.

- Inject the HTTP client so tests can pass a stub. A module-level client constructed
  at import time cannot be replaced cleanly.
- Add a session-scoped guard that fails any test in those layers which attempts a
  real socket connection. An accidental live call should break loudly the first
  time, not become a flake six months later.
- Keep the replay transport in one place. Every test building its own mock is how
  the suite ends up with fifteen slightly different ideas of what the provider
  returns.

## Checklist

- [ ] Unit and fixture layers run with no network and no credentials
- [ ] Fixtures captured from real responses, with credentials and personal data
      stripped at capture time
- [ ] Fixtures carry a capture date
- [ ] Tests assert the outgoing request, not only the parsed result
- [ ] Contract tests assert shape and types, never values
- [ ] Contract and live suites run on a schedule, not on every commit
- [ ] Live smoke skips cleanly when a credential is absent
- [ ] A dry-run mode enumerates operations without calling them
- [ ] Every error path in the table above has a test
- [ ] A guard fails any offline-layer test that opens a real connection
