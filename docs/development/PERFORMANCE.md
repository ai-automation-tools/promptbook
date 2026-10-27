# Performance: the expensive endpoints

[↩ Docs home](../README.md)

`npm run bench` (from `site/`) measures the endpoints that do real work and prints the table
below. The server runs in a child process, so the client's own work, such as parsing a 10 MB
body, doesn't count against it. Run it before and after a change that touches the listing, the
detail read or the ZIPs, and compare against the budgets.

What the columns mean:

- **Cold:** the first request, before any cache is warm.
- **p50 / p95:** 20 more requests, five at a time (10 for the heavy rows).
- **Stall:** the longest the server's event loop went without a turn during the row. While it
  is stalled, the server answers nothing else. This is the number that shows one request
  blocking everyone else's.

All runs below are on Node 24.21, an AMD Ryzen 5 3600 and Windows 11, with the library at
2,811 indexed prompts (37 MB on disk). Expect the absolute numbers to move between machines;
the ratios between rows shouldn't.

## Baseline (2026-10-23, before roadmap item F12)

| Endpoint | Cold ms | p50 ms | p95 ms | Stall ms | Bytes |
|:--|--:|--:|--:|--:|--:|
| List, lightweight (what the UI loads) | 18 | 61 | 84 | 55 | 876.2 KB |
| List, full bodies (the export) | 878 | 3647 | 3971 | 3100 | 10.6 MB |
| Detail read | 8 | 4 | 6 | 5 | 0.9 KB |
| Card previews (50 ids) | 25 | 4 | 5 | 3 | 12.4 KB |
| Skill ZIP, median (analytics-tracking, 11 KB) | 25 | 14 | 19 | 9 | 4.7 KB |
| Skill ZIP, largest (canvas-design, 5.5 MB) | 503 | 483 | 631 | 12 | 2.6 MB |
| Pack ZIP, median (finance-investing-pack, 10 skills) | 69 | 91 | 127 | 11 | 165.6 KB |
| Pack ZIP, largest (finance-portfolio-management-pack, 34 skills) | 80 | 249 | 305 | 8 | 290.7 KB |
| Detail read during a cold full listing (listing took 1,039 ms) | – | 3 | 927 | 989 | 0.9 KB |

Three problems, in order of how much they hurt:

1. **The full listing blocked the server.** Every request walked the whole library with
   synchronous reads, then stringified 10 MB in one go. A detail read that arrived meanwhile
   waited almost a second, and five concurrent exports queued behind each other for 3.6 s each.
2. **Every listing was re-serialized on each hit.** Even the cached lightweight list stalled
   the loop for about 50 ms per request while it re-stringified and re-hashed 876 KB for its ETag.
3. **ZIPs compressed at level 9.** On the largest skill, level 9 took 340 ms against 203 ms at
   level 6, for a ZIP 0.15% smaller (2,630 KB against 2,634 KB). The deflate runs off the
   main thread, so it slowed downloads without stalling other requests.

## After F12 (2026-10-23)

| Endpoint | Cold ms | p50 ms | p95 ms | Stall ms | Bytes |
|:--|--:|--:|--:|--:|--:|
| List, lightweight (what the UI loads) | 13 | 14 | 22 | 9 | 876.2 KB |
| List, full bodies (the export) | 36 | 149 | 174 | 18 | 10.6 MB |
| Detail read | 3 | 4 | 5 | 4 | 0.9 KB |
| Card previews (50 ids) | 19 | 2 | 4 | 3 | 12.4 KB |
| Skill ZIP, median (analytics-tracking, 11 KB) | 34 | 16 | 25 | 15 | 4.7 KB |
| Skill ZIP, largest (canvas-design, 5.5 MB) | 252 | 473 | 515 | 12 | 2.6 MB |
| Pack ZIP, median (finance-investing-pack, 10 skills) | 46 | 121 | 133 | 5 | 165.7 KB |
| Pack ZIP, largest (finance-portfolio-management-pack, 34 skills) | 91 | 253 | 276 | 10 | 291.2 KB |
| Detail read during a cold full listing (listing took 632 ms) | – | 9 | 128 | 126 | 0.9 KB |

What changed, all in `site/api/index.ts` and `site/api/skill-packs.ts`:

- **The library walk is async** (`walkLibrary`), so it yields between files. It keeps the old
  walk's directory order, and the listing came back byte-identical in all three modes
  (full, lightweight, no `library` parameter).
- **Listings are cached as bytes, with their ETag,** for five minutes (`cachedListing`). The
  cached value is the promise, so requests that arrive mid-build share one build instead of each
  starting their own. Setting the ETag up front stops Express hashing 10 MB again on every send,
  and conditional requests still get a `304`. Serialization goes row by row and yields every 200
  rows. The remaining ~120 ms stall comes once per five minutes, on the first export.
- **ZIPs use zlib's default level 6.** The cold time on the largest skill roughly halved. Under
  five concurrent downloads the p50 barely moves, because libuv's four-thread pool is the
  bottleneck there.

The cache trade-off: a file edited in `site/library/` shows up in the listing within five
minutes, not immediately. The demo's library never changes between deploys. Locally, restart
the server or wait out the five minutes.

## After the skill library cards (2026-10-27)

The new baseline. The skills and packs the earlier rows measured were archived when each skill
library became one card (see the 2026-10-27 CHANGELOG entry), so the ZIP rows moved to what
is left: the largest remaining skill is `diagram-design` (1.1 MB), and the three remaining packs
hold 2 or 3 skills each. The library is now 2,166 indexed items (18 MB on disk), which is why
the listings got smaller. Same machine as above.

| Endpoint | Cold ms | p50 ms | p95 ms | Stall ms | Bytes |
|:--|--:|--:|--:|--:|--:|
| List, lightweight (what the UI loads) | 10 | 11 | 15 | 16 | 681.7 KB |
| List, full bodies (the export; cold row above) | 20 | 105 | 115 | 16 | 8.1 MB |
| Detail read | 3 | 6 | 8 | 6 | 5.1 KB |
| Card previews (50 ids) | 16 | 2 | 4 | 16 | 12.4 KB |
| Skill ZIP, small (copy-editing, 16 KB) | 15 | 10 | 13 | 5 | 5.6 KB |
| Skill ZIP, largest (diagram-design, 1.1 MB) | 77 | 202 | 241 | 8 | 382.8 KB |
| Pack ZIP, small (developer-essentials-pack, 2 skills) | 7 | 15 | 16 | 2 | 8.8 KB |
| Pack ZIP, largest (writing-documentation-pack, 3 skills) | 7 | 21 | 22 | 2 | 28.3 KB |
| Detail read during a cold full listing (listing took 603 ms) | – | 3 | 26 | 108 | 0.9 KB |

Every row is inside the budgets below. The ZIP rows are lighter than before only because their
subjects are smaller, so they no longer test the worst case the budgets were set for: a pack or
skill as large as `finance-portfolio-management-pack` (34 skills) or `canvas-design` (5.5 MB)
should be re-measured if one is added.

## Budgets

These are about twice the "after" numbers, so a normal run passes and a regression of the
kind F12 fixed doesn't. They're a reading guide, not a CI gate: timing on shared CI runners is
too noisy to fail a build on.

| Measure | Budget |
|:--|--:|
| Stall, any row except the cold full listing | ≤ 50 ms |
| Stall during a cold full listing | ≤ 250 ms |
| Detail read p95 during a cold full listing | ≤ 300 ms |
| Lightweight list p95 | ≤ 50 ms |
| Full list p95, warm | ≤ 400 ms |
| Detail read and previews p95 | ≤ 20 ms |
| Largest skill ZIP, cold | ≤ 500 ms |
| Largest pack ZIP p95 | ≤ 600 ms |
