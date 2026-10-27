## What

<!-- One or two sentences. Link the issue if there is one. -->

## Type

- [ ] Content (prompts / agents / skills / system prompts)
- [ ] Code (app, API, tooling)
- [ ] Docs

## Checklist

- [ ] `npm run lint` and the `npm run test:*` scripts pass (from `site/`; `test:browser` after `npm run build`)
- [ ] If the listing, detail read or ZIPs changed: `npm run bench` is within the budgets in `docs/development/PERFORMANCE.md`
- [ ] If `site/library/` changed: `npm run build:index` run and `site/api/prompt-index.json` committed
- [ ] If a skill was vendored: its LICENSE kept and an `upstream:` block added
- [ ] No personal contact details or credentials, including sample ones
- [ ] `docs/CHANGELOG.md` updated if this is user-visible
