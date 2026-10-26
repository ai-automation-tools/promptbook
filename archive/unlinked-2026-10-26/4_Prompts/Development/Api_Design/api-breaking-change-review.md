---
title: "🔀 API Breaking Change Review"
tags: ["api", "versioning", "backward-compatibility", "review", "contracts"]
category: "Development"
subcategory: "Api_Design"
---

# API Breaking Change Review

## Purpose
Decide whether a proposed API change breaks existing clients, by reading the diff from the consumer's side instead of the implementer's.

## Instructions
Act as an API platform reviewer. Compare the old and new contracts below and classify every difference as `breaking`, `risky`, or `safe`. Judge by what an existing client does today, not by what the documentation promised. If you cannot tell how clients behave, say so and name the evidence you would need rather than assuming the generous reading.

Inputs:
- **Old contract:** [OpenAPI/GraphQL schema/proto, or the endpoint descriptions]
- **New contract:** [the proposed version]
- **Known clients:** [SDKs, mobile apps, partners, internal services, and how tightly each is typed]
- **Client update speed:** [how long old client versions stay in the wild, e.g. mobile apps pinned for 18 months]

Check each of these, because the non-obvious ones are where releases break:
1. **Removed or renamed** — fields, endpoints, enum values, query parameters, headers
2. **Tightened inputs** — a newly required field, a shorter max length, a narrower type, a stricter validator
3. **Changed outputs** — a field that can now be `null`, a new enum value (breaks clients with exhaustive switches), a different date format, a changed sort order or default page size
4. **Changed semantics under the same shape** — same field name, different meaning or units; idempotency, ordering, or retry behaviour that clients rely on
5. **Errors** — new status codes, changed error body shape, a 200 that is now a 4xx
6. **Auth and limits** — new scopes, stricter rate limits, shorter token lifetimes
7. **Transport** — added redirects, changed content types, tighter CORS, a pagination switch from offset to cursor

For each `breaking` or `risky` finding, state which client from the list above fails and how it fails (crash, wrong data silently, rejected request).

## Output Format
1. A table: change, classification, who breaks, how (silent wrong data is worse than a crash, so flag it)
2. A verdict: ship as-is, ship behind a version, or redesign — with the reason in one line
3. For each breaking change, the least disruptive alternative (additive field, opt-in flag, new endpoint alongside the old)
4. A short list of contract tests that would have caught each finding

## Related Prompts
- [API Deprecation and Sunset Plan](./api-deprecation-and-sunset-plan.md)
- [REST API Spec Generator](../../Engineering/Api_Design/rest-api-spec-generator.md)

## Reputable Sources
- Semantic Versioning 2.0.0: https://semver.org/
- OpenAPI Initiative specification: https://spec.openapis.org/oas/latest.html

---
**Disclaimer:** This review reasons from the contracts you supply. Test against real client traffic and SDK builds before relying on a "safe" classification.
