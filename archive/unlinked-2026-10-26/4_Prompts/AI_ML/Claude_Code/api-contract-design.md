---
title: "📌 API Contract Design"
tags: ["api", "contract", "design", "openapi", "schema"]
category: "Architecture_and_Design"
subcategory: "API_Design"
---

Design a clean API contract before any implementation begins.

## Prompt

```
Design the API contract for [SERVICE/MODULE]. Specify: endpoints or function signatures, request/response schemas, error codes and messages, authentication/authorization, and versioning strategy. Produce an OpenAPI spec or TypeScript types. No implementation yet.
```

## Usage Notes

- Replace `[SERVICE/MODULE]` with what you are designing
- Contract-first prevents API design being driven by implementation convenience
- OpenAPI spec enables mock servers, validation, and client generation
- Review and iterate on the contract before writing any handlers
