---
title: "🔧 Vitest Test Runner"
tags: ["skill", "vitest", "testing", "vite"]
category: "Skills"
subcategory: "Development"
name: vitest-test-runner
description: "Execute and configure Vitest, the blazing fast unit test framework powered by Vite."
---

# Vitest Test Runner

Execute unit and component tests using Vitest. It shares the exact same configuration and transformation pipeline as Vite, making it incredibly fast for modern web projects.

## Prerequisites
- **Required Tool:** `vitest` installed as a devDependency.
- **Environment:** Node.js project, ideally already using Vite.

## Usage
Invoke this skill to run test suites, generate coverage reports, or set up the testing environment (like DOM mocking via happy-dom or jsdom).

## Configuration
Vitest can be configured inside the existing `vite.config.ts` under the `test` property, or in a separate `vitest.config.ts`.

## Examples
- Run tests: `npx vitest`
- Run tests in watch mode: `npx vitest watch`
- Generate coverage: `npx vitest run --coverage`

**Basic Config:**
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

## Advanced Usage
Using Vitest for in-source testing by writing tests in the same file as the implementation (requires configuring `includeSource`).

## Integration
Integrates seamlessly with Vue Test Utils and React Testing Library.

## Troubleshooting
- **"document is not defined":** You are testing DOM elements but haven't set the environment. Set `test: { environment: 'jsdom' }` in the config.
- **Module not found:** Ensure your Vite path aliases (e.g., `@/components/`) are correctly resolved in the config.

## Best Practices
- Use `happy-dom` instead of `jsdom` for significantly faster test execution, unless you need highly specific legacy browser APIs.
- Enable `globals: true` to avoid importing `describe` and `it` in every test file.

## Performance Considerations
Vitest uses worker threads. For CI environments, you may need to limit workers using `--poolOptions.threads.maxThreads`.

## Security & Safety
Tests run in an isolated environment. Be cautious when mocking the file system or executing shell commands within tests.

## API Reference
https://vitest.dev/api/

## File Structure
- Tests usually follow `*.spec.ts` or `*.test.ts` naming conventions.
- `vitest.config.ts`: Configuration file.

## References
- Vitest Official Documentation.

## Changelog
- 1.0.0: Initial Vitest skill.

## Contributing
Contributions welcome for adding E2E test integrations.

## License
MIT
