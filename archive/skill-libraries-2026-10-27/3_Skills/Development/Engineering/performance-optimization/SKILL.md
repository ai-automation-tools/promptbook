---
title: "💻 performance-optimization"
name: performance-optimization
description: "Make a slow app faster without guessing where the time goes — measure and profile before changing anything, fix the biggest bottleneck first, and cover the usual suspects: N+1 queries and missing indexes, oversized payloads, blocking work on the request path, and frontend bundle and render cost. Use when something is slow, a page or endpoint misses a latency target, a database is under load, or someone proposes an optimization before profiling."
tags: ["skill","development","engineering","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/engineering/performance-optimization/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Performance Optimization

## Measure first, or you are guessing

The instinct on a slow system is to find the code that *looks* expensive and optimize
it. That instinct is wrong often enough to be dangerous, because the slow part is
rarely where it feels like it should be, and time spent optimizing code that was
never the bottleneck is time that made nothing faster and possibly made the code
worse.

The discipline is fixed: **measure, find the biggest cost, fix that one thing,
measure again.** Repeat until fast enough, then stop. Every step is against numbers,
not intuition.

## Set a target, then profile

- **Define "fast enough" as a number** before you start — a p95 latency, a page load
  budget, a throughput floor. Without a target you cannot tell when to stop, and
  optimization has no natural end.
- **Measure the real thing** — production-like data volume, realistic concurrency,
  a representative request. A query that is instant on ten rows and dies on ten
  million is a bug you will only see at scale, and a profile on toy data points you at
  the wrong code.
- **Profile to find where the time actually goes.** A profiler or the framework's
  timing shows the distribution. The result is routinely surprising: the expensive
  function is fine and a trivial one called ten thousand times is the problem.
- **Optimize the biggest cost first.** Amdahl's law is unforgiving — shaving 50% off
  something that is 5% of the time buys you 2.5%. Halving the thing that is 60% of the
  time buys you 30%. Rank by contribution and start at the top.

## The usual suspects, backend

**N+1 queries.** The most common backend bottleneck by a wide margin. Code fetches a
list, then loops and fetches each item's related data one query at a time — one query
becomes five hundred. Look for a query inside a loop. The fix is to fetch the related
data in one query (a join, an eager load, or a batched `IN`). This alone resolves a
large share of "the app got slow as it grew."

**Missing indexes.** A query filtering, joining, or sorting on an unindexed column
scans the whole table, and the cost grows with the table. Read the query plan
(`EXPLAIN ANALYZE`) — a sequential scan on a large table where you filter is the
signal. Index the columns in `WHERE`, `JOIN`, and `ORDER BY`. Indexes cost write speed
and space, so index for the queries you actually run, not every column.

**Oversized queries.** `SELECT *` pulling columns you discard, a list endpoint with no
pagination returning everything, fetching a whole row to read one field. Select what
you use; paginate every list; push filtering into the database rather than loading
and filtering in application code.

**Blocking work on the request path.** Sending an email, calling a slow third-party
API, resizing an image, or generating a report inside the request makes the user wait
for work they did not ask to wait for. Move it to a background job and return
immediately. The request should do the minimum to answer and defer the rest.

**Missing caching.** The same expensive computation or query repeated for identical
inputs. Cache the result, keyed on the full input, with a TTL no longer than the
data's real freshness. Cache correctness is harder than it looks — a stale or
mis-keyed cache serves wrong data confidently — so cache deliberately, not
everywhere.

## The usual suspects, frontend

**Bundle size.** JavaScript is downloaded, parsed, and executed before the page is
interactive, and it is the most common cause of a slow load. Measure the bundle;
code-split so routes load their own code on demand; lazy-load below-the-fold and
heavy components; drop or replace oversized dependencies. A charting library pulled in
for one page that ships on every page is a frequent and expensive mistake.

**Render cost.** Unnecessary re-renders, work in the render path, huge un-virtualized
lists. Profile with the framework's render tools before reaching for memoization —
`useMemo` and `useCallback` everywhere is its own performance and readability problem,
and often addresses a cost that was not there. Virtualize long lists so only the
visible rows render.

**Network waterfalls.** Requests that could run in parallel running in series, each
waiting for the last. Fetch independent data concurrently; prefetch what the next
navigation will need; collapse chatty request chains.

**Images and assets.** Unoptimized images are often the largest bytes on a page.
Right-size and compress them, serve modern formats, set explicit dimensions to avoid
layout shift, and lazy-load off-screen images.

**Core Web Vitals.** LCP (largest content paint), CLS (layout shift), and INP
(interaction responsiveness) are measurable and each has direct fixes — a slow LCP is
usually a large image or render-blocking resource; CLS is usually missing dimensions
or late-injected content; poor INP is usually main-thread work blocking input.
Measure them against a budget rather than eyeballing "feels fast."

## Confirm the win, and watch for regressions

- **Measure after every change** against the same benchmark as before. An optimization
  you did not measure is a change you hope helped, and hope is not a result.
- **Confirm you did not break correctness.** Fast and wrong is worse than slow and
  right. Run the tests; a cache or a query rewrite is exactly where a subtle behavior
  change hides.
- **Keep the numbers.** Before and after, so the improvement is a fact you can state
  and defend, not a vibe.
- **Stop when you hit the target.** Optimization past "fast enough" trades readability
  and maintainability for speed nobody asked for and no user will feel.

## Traps

- **Optimizing before profiling.** The single most common waste. The bottleneck is
  almost never where it feels like it is.
- **Micro-optimizing the trivial.** Rewriting a loop that is 1% of the runtime while a
  missing index is 70% of it.
- **Profiling on toy data.** The scaling bug only appears at production volume, and
  small-data profiles point at the wrong code.
- **Caching to hide a slow query** instead of fixing it. Now you have a slow query and
  a cache-invalidation problem.
- **Memoizing everything on the frontend** on reflex. It has a cost, and it usually
  addresses a re-render that was not actually expensive.
- **Reporting a speedup without a number.** If you cannot state the before and after,
  you did not measure, and you may have optimized nothing.
