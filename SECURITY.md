# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security problems.

Use GitHub's private reporting instead: **Security → Report a vulnerability** on this
repository. That opens a private advisory only the maintainer can see. If that option is
unavailable to you, email the address listed under *Support* in the README with
`[security]` in the subject.

Include what you found, how to reproduce it, and what you think the impact is. You will get
an acknowledgement within a few days. Fixes ship as ordinary commits to `main`, which
deploys to `promptbook-demo.ai-automation-tools.dev`, and are noted in `docs/CHANGELOG.md`.

## Threat model

Promptbook has no accounts and no database. It runs in two shapes:

- **A local app.** You clone it and run it. The server listens on `127.0.0.1` and stores
  My Library as markdown files in a folder on your disk. Whoever can reach the port can
  read and edit that folder through the API; binding to loopback is the access control.
  Setting `HOST` to a public address without `READ_ONLY=true` or your own auth in front is
  a configuration choice, not a vulnerability.
- **The hosted demo** at `promptbook-demo.ai-automation-tools.dev`. It is read-only:
  on Vercel every write route returns `403`, and it serves only the committed Public
  Library.

## Scope

In scope:

- The application under `site/` (`api/`, `lib/`, `server.ts`, `src/`) and the hosted demo.
- Any way to write, delete or change data through the hosted demo, or to make a read-only
  instance accept a write.
- Path traversal: reading files outside `site/library/` through the API, or reading or
  writing outside the My Library folder through a prompt id.
- Anything in the local app that a web page you visit could use against it (for example a
  cross-site request that writes to My Library).
- Secrets or personal data committed to the repository.

Out of scope:

- The content of prompts and skills under `site/library/`. They are text. If a vendored
  skill ships sample code with a vulnerability, report it upstream (see the `upstream:`
  block in its frontmatter) and open a normal issue here so we can resync.
- Access to a local instance by someone who can already reach its port, including an
  instance deliberately bound to a public address.
- Denial of service against the public Vercel deployment.

## What is already in place

- The server binds to `127.0.0.1` unless `HOST` says otherwise.
- Read-only mode (`READ_ONLY=true`, or automatic on Vercel) is enforced on the server, not
  only by hiding buttons in the UI. It refuses every write and stops serving My Library
  (checked by `npm run test:read-only`).
- One middleware in front of every route refuses a `Host` that is not `localhost`,
  `*.localhost`, an IP address or a name in `ALLOWED_HOSTS` (DNS rebinding), and a
  cross-site `Origin` on any write, skill packs included (checked by `npm run test:my-library`).
- My Library writes are field-checked in one place, replace files atomically, and refuse an
  update made from a stale version of the file.
- My Library ids must match `^[a-z0-9-]+$`, so an id can never name a path outside the
  folder (`site/lib/my-library.ts`, checked by `npm run test:my-library`).
- Public Library, skill and skill-pack reads are confined to the library root, by real path,
  so a symlink or junction pointing outside it is refused; ZIPs leave links out
  (`site/lib/safe-path.ts`, checked by `npm run test:safe-path`).
- `helmet` sets the standard response headers on the API, with CSP off there (see the comment
  in `site/api/index.ts`). The demo's pages get a CSP, a frame policy and `nosniff` from
  `site/vercel.json`, checked in a real browser by `npm run test:browser`. Request bodies are
  capped at 1 MB.
- Dependabot watches `site/`, and CI fails on a type error, a changed route table, a broken
  My Library store or boundary check, read-only mode serving private files, a broken
  download or failed-load path, a path or link escaping the library, an MCP regression, a
  CSP that blocks the built page (or no longer matches its inline script), or a stale
  prompt index.

## Supported versions

Only `main` is supported. There are no tagged releases.
