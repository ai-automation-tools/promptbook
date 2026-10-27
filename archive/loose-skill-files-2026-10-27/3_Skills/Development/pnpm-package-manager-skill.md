---
title: "🔧 PNPM Package Manager"
tags: ["skill", "pnpm", "node", "dependencies"]
category: "Skills"
subcategory: "Development"
name: pnpm-package-manager
description: "Manage Node.js dependencies using pnpm for faster, disk-efficient package installations."
---

# PNPM Package Manager

PNPM is a fast, disk space-efficient package manager. This skill allows an agent to use `pnpm` to install, update, and manage project dependencies using hard links and a global store.

## Prerequisites
- **Required Tool:** `pnpm` CLI installed globally (`npm install -g pnpm`).
- **Files:** `package.json` must exist in the working directory.

## Usage
Invoke this skill when setting up a new Node.js project, adding new libraries, or running package scripts. It is preferred over `npm` or `yarn` when speed and disk space are priorities.

## Configuration
PNPM is configured via the `.npmrc` file in the project root. Key settings include `shamefully-hoist=true` if required by specific legacy frameworks.

## Examples
- `pnpm install`: Install all dependencies.
- `pnpm add lodash`: Add a package to dependencies.
- `pnpm add -D typescript`: Add a package to devDependencies.
- `pnpm run build`: Execute a script defined in package.json.

## Advanced Usage
Using pnpm workspaces for monorepo management:
`pnpm add lodash --filter @my-workspace/package-a`

## Integration
Integrates natively with Node.js ecosystems. Vite and Next.js heavily recommend pnpm.

## Troubleshooting
- **Missing Dependencies Error:** If a package complains about a missing dependency that is installed, you may be experiencing strict peer dependency resolution. Use `pnpm install --shamefully-hoist` as a workaround.

## Best Practices
- Always commit the `pnpm-lock.yaml` file to version control.
- Use `pnpm up --latest` to interactive update packages.

## Performance Considerations
PNPM uses a content-addressable store. The first install on a machine takes normal time, but subsequent installs of the same packages across different projects are nearly instantaneous.

## Security & Safety
PNPM's strict node_modules structure prevents packages from accessing dependencies they didn't explicitly declare, inherently improving security over flat node_modules structures.

## API Reference
Refer to `pnpm help <command>` for detailed CLI flags.

## File Structure
- `/node_modules/.pnpm/`: Virtual store containing hard links.
- `pnpm-lock.yaml`: Deterministic lockfile.

## References
- PNPM Official Documentation: https://pnpm.io/

## Changelog
- 1.0.0: Initial skill definition.

## Contributing
Submit PRs to update flags or add monorepo best practices.

## License
MIT
