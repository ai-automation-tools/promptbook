---
title: "🔧 Vite Config Builder"
tags: ["skill", "vite", "build-tool", "bundler"]
category: "Skills"
subcategory: "Development"
name: vite-config-builder
description: "Generates and modifies Vite configurations for ultra-fast frontend tooling."
---

# Vite Config Builder

Generates `vite.config.ts` or `vite.config.js` files, configuring plugins, server proxies, and build options for modern frontend frameworks.

## Prerequisites
- **Required Tool:** Node.js, `vite` package installed.
- **Knowledge:** Understanding of ES modules and Rollup build options.

## Usage
Use this skill when initializing a new frontend project, adding a new framework plugin (like Vue, React, or Svelte), or when setting up a proxy to bypass CORS during local development.

## Configuration
The primary configuration file is `vite.config.ts` located in the root of the project.

## Examples
**Basic Vue Setup:**
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

## Advanced Usage
**Setting up a local API Proxy:**
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## Integration
Vite integrates with nearly all modern UI frameworks via specific plugins (e.g., `@vitejs/plugin-react`).

## Troubleshooting
- **HMR Not Working:** Ensure your components are properly exported and that file paths case exactly match the import statements (Vite is case-sensitive).
- **CORS Errors on local API:** Ensure the `server.proxy` configuration is correctly formatting the target URL.

## Best Practices
- Prefer `vite.config.ts` over `.js` for better intellisense.
- Use environment variables (`.env` files) for API keys, ensuring they are prefixed with `VITE_` to be exposed to the client.

## Performance Considerations
Vite is inherently fast due to native ESM in development. For production builds, ensure chunks are split properly using Rollup manualChunks configuration.

## Security & Safety
Do not expose sensitive keys to the client. Only variables prefixed with `VITE_` are bundled.

## API Reference
https://vitejs.dev/config/

## File Structure
- `vite.config.ts`: Main config file.
- `index.html`: Must be in the project root, acting as the entry point.

## References
- Vite Docs

## Changelog
- 1.0.0: Initial setup.

## Contributing
Add specific framework presets via PR.

## License
MIT
