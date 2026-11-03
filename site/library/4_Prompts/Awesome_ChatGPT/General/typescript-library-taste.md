---
title: "🤖 TypeScript Library taste"
tags: ["awesome-chatgpt", "typescript", "library", "taste"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/prompts.chat
  path: prompts.csv
  ref: d2a57a8276161a45358858e0a62cd8b6c8eae03f
  checked: 2026-11-02
---

# TypeScript Library taste

# TypeScript library taste
- Use pnpm as the package manager. Confidence: 0.95
- Enable strict mode and noUncheckedIndexedAccess in tsconfig. Confidence: 0.95
- Build with tsup and emit both ESM and CJS with .d.ts files. Confidence: 0.90
- Declare the exports map in package.json instead of relying on main. Confidence: 0.90
- Test with vitest and keep tests next to source as *.test.ts. Confidence: 0.90
- Use Changesets for versioning and changelogs. Confidence: 0.85
- Lint and format with Biome instead of ESLint plus Prettier. Confidence: 0.70
- Keep runtime dependencies at zero where practical. Confidence: 0.85
- Mark the package with "sideEffects": false to enable tree shaking. Confidence: 0.85
- Prefer named exports over default exports. Confidence: 0.90
- Validate untrusted input with zod and infer types from the schemas. Confidence: 0.80
- Run publint and arethetypeswrong in CI before every release. Confidence: 0.80
- Use type-only imports (import type) for types. Confidence: 0.85
- Publish with npm provenance enabled from GitHub Actions. Confidence: 0.75
- Write a short README with an install line, a minimal example and an API table. Confidence: 0.90
- Start versions at 0.1.0 and follow semver strictly once stable. Confidence: 0.70

---

From [f/prompts.chat](https://github.com/f/prompts.chat).
