---
title: "💻 api-response-normalization"
name: api-response-normalization
description: Turn heterogeneous API payloads into one consistent envelope that carries its own provenance — source, request, retrieval timestamp, records, warnings, and a pointer to the raw response — so downstream code and generated citations can always trace a value back to where it came from. Use when integrating multiple data sources, designing a result schema, building a research or aggregation pipeline, or fixing output where nobody can tell which API produced which number.
tags: ["skill","development","api","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/domain/api/api-response-normalization/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# API Response Normalization

## The problem

Five APIs answering the same question return five shapes. One nests records under
`data.items`, one under `results`, one returns a bare array. One dates things
`2026-01-15`, one `15/01/2026`, one a Unix epoch in milliseconds. One signals
not-found with `404`, one with an empty list, one with `200` and an `error` key.

If that heterogeneity reaches the rest of your system, every consumer re-implements
the same five special cases, and the moment a value is copied into a report nobody
can say which source it came from or when. Normalize once, at the boundary.

## The envelope

Every operation against every source returns the same outer shape. The records
inside stay source-faithful; the envelope around them is universal.

```python
@dataclass
class ResultEnvelope:
    source_api: str          # stable identifier for the provider
    source_url: str          # the exact URL called, credentials stripped
    operation: str           # which allowlisted operation ran
    query: dict              # the normalized parameters that produced this
    retrieved_at: str        # ISO 8601 with timezone, when the call returned
    records: list[dict]      # the normalized records
    warnings: list[str]      # non-fatal problems the caller should see
    raw_ref: str | None      # pointer to the cached raw payload, if kept
```

Four fields carry the provenance — `source_api`, `source_url`, `retrieved_at`, and
`query`. Together they let anyone reconstruct where a number came from and re-run
the call that produced it. Drop any one of them and the citation becomes a claim.

### Why `raw_ref` is a pointer

Keep the raw payload out of the envelope itself. Envelopes get logged, passed
between processes, and held in memory; raw payloads can be megabytes. Write the raw
response to a content-addressed cache and store the key.

Skip the cache entirely for sensitive payloads. A provenance pointer is not worth
persisting personal data you did not need.

## Normalize these five things

Everything else can stay source-shaped. These five cannot, because downstream code
compares across sources.

**Timestamps.** Everything becomes ISO 8601 with an explicit offset. A naive
datetime is ambiguous, and the ambiguity surfaces as an off-by-one-day bug in
whichever timezone you are not in.

**Numbers.** Parse to a real numeric type at the boundary. An API that returns
`"1,234.5"` as a string, or `1.2345e3`, has handed you a parsing decision; make it
once, here, not in every consumer.

**Missing values.** Pick one representation — `None` — and convert every provider's
dialect to it: `""`, `"N/A"`, `"null"`, `-1`, `-999`, `0` used as a sentinel. The
last one is the dangerous case, because it silently averages into real data.

**Identifiers.** When two sources describe the same entity, record both the source's
native identifier and any shared identifier you can map to. Never overwrite the
native one — it is what you need to re-query that source.

**Not-found.** A successful call that matched nothing is `records: []` with a
warning, not an error and not `None`. An error is when the call itself failed.

## Warnings are part of the result

A warning is something the caller needs to know that did not prevent the call from
succeeding:

- The provider truncated the result set and more exists.
- A requested field was absent from the response.
- The data is older than the freshness the source claims.
- A value failed its parse and was set to `None`.
- The response used a shape the adapter did not recognize and fell back.

Returning warnings in the envelope beats logging them, because the consumer that has
to decide what the result means is the one that sees them. A silent fallback is how
a normalization bug survives for months.

## Citations fall out of the envelope

Once every result carries its provenance, a citation is a projection, not a separate
bookkeeping exercise:

```
<source_api> — <operation>, retrieved <retrieved_at>
<source_url>
<attribution string, when the provider's terms require one>
```

Two rules keep them honest:

- **Strip credentials from `source_url` before it is stored.** An API key in a query
  string ends up in the citation, in the report, and in whatever the report is
  pasted into. Redact at the moment the envelope is built, not at render time.
- **Cite retrieval, not publication.** `retrieved_at` is the timestamp you can
  actually vouch for. If the payload also carries the provider's own `last_updated`,
  keep it as a record field and cite both.

## Aggregating across sources

When several envelopes answer one question, the aggregate keeps the parts visible:

- **Do not merge records into an undifferentiated list.** Keep the per-source
  grouping, or tag each record with its `source_api`. A merged list is a list you
  cannot cite.
- **Show conflicts; do not average them.** Two sources disagreeing on a population
  figure is a finding. The mean of the two is a number no source supports and nobody
  can defend.
- **Carry every source's warnings forward.** An aggregate that drops its inputs'
  warnings looks cleaner and is less true.
- **The aggregate's `retrieved_at` is the oldest of its inputs**, not the newest.
  The result is only as fresh as its stalest part.

## Traps

- **Typed fields across incompatible sources.** Forcing books, CVEs, exchange rates,
  and weather into one flat record schema means every field means something
  different per source. Keep records source-faithful and let the envelope do the
  unifying. Add cross-source typed fields only for a defined reporting use, with
  explicit semantics and stated missing-data rules.
- **Normalizing in the consumer.** The second consumer will do it differently and
  the two will drift. One boundary, one place.
- **Dropping the raw payload because the parse succeeded.** The parse succeeding is
  not evidence it was correct. The raw reference is how you find out later.
- **Timestamping at render.** `retrieved_at` is set when the response arrives. Set
  later, it records when someone looked at the result, which is not the same fact.
- **Silent coercion.** A value that would not parse becomes `None` *and* a warning.
  `None` alone is indistinguishable from a field the provider never sent.
