# Hosted Demo

The demo at [promptbook-demo.ai-automation-tools.dev](https://promptbook-demo.ai-automation-tools.dev)
is a read-only browser for the Public Library. It runs the same `site/` app as a local
clone, on Vercel, with every write turned off. To keep your own prompts, clone the repo and
run it locally ([Setup Guide](SETUP.md)).

The project homepage, [promptbook.ai-automation-tools.dev](https://promptbook.ai-automation-tools.dev),
is a separate static site in `homepage/` served by GitHub Pages. Nothing here changes it.

---

## How Vercel builds it

| Setting | Value |
|:---|:---|
| Root Directory | `site` (the repo root holds docs and utility scripts only) |
| Production branch | `main`. Work happens on `mike_desktop` and lands via PR. |
| Build command | default; Vercel runs the `vercel-build` script: `build:index`, then `tsc`, then `vite build` |
| Environment variables | none required |

`build:index` regenerates `api/prompt-index.json` from `library/` on every deploy, so the
listing always matches the committed library.

`site/vercel.json` does the routing:

- `/api/skill-packs/*` goes to its own function, `api/skill-packs.ts`, which bundles
  `library/3_Skills/**` via `includeFiles`.
- Every other `/api/*` path goes to `api/index.ts` (the Express app).
- Everything else falls through to `index.html` for the SPA.

Locally, `server.ts` mounts both handlers on one Express process, so the route table is the
same in both places. `npm run test:routes` pins it.

---

## Read-only, automatically

Vercel sets `VERCEL` in every build and function. The app treats that the same as
`READ_ONLY=true`:

- **Server** (`site/lib/my-library.ts`): every write route (create, update, delete, copy to
  My Library, add or remove a skill pack) returns `403` with
  `"This copy of the library is read-only. Clone the repo to keep your own prompts."`
  The My Library reads are closed as well: its list and installed packs are empty, and a
  My Library id is not served.
- **UI** (`site/vite.config.ts` bakes `__READ_ONLY__` into the bundle; `site/src/lib/mode.ts`
  reads it): the Public / My Library switch, **New item**, **Save to My Library**, and
  skill-pack add/remove are hidden.

There is no writable disk on Vercel and the demo is shared by every visitor, so there is no
My Library there at all.

---

## Cleaning up old Vercel settings

Earlier versions used accounts in Neon Postgres and an optional GitHub-backed library. The
app no longer reads any of these, and they can be deleted from the Vercel project
(Settings → Environment Variables):

- `DATABASE_URL`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

`USE_GITHUB_MODE` and `NODE_ENV`, if still set, are also unused and can go.

---

## Self-hosting

You can deploy your own copy the same way (import the repo on Vercel, Root Directory
`site`). It will be read-only too.

If you host it anywhere else and expose it beyond `localhost`, remember there are no
accounts: anyone who can reach it can edit My Library. Either set `READ_ONLY=true` (in the
environment of both the build and the server; see the note in [SETUP.md](SETUP.md#exposing-it-beyond-localhost))
or put your own authentication in front of it.

---

## Troubleshooting

**Build fails:** run `npm run build` in `site/` locally; it is the same sequence as
`vercel-build`. Check the Vercel build log for the `tsc` step.

**The demo shows write buttons, or saving returns 403:** the bundle and the server disagree
on read-only mode. On Vercel both come from `VERCEL`, so this points at a build made
elsewhere and uploaded; redeploy from Git.

**Hosting looks wrong:** before trusting anything above, `curl -I` the live URL and check
the `Server:` header.
