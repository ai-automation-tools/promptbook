# Open questions

## Open

_None._

## Answered

### Keep repowise-dev/claude-code-prompts as an accepted prompts source?

- Asked: 2026-11-18 by promptbook-find-prompts
- Context: DISCOVERY.md marks it `accept`, and it is MIT. Its `complete-prompts/` mirror Claude Code's own internal prompts section by section (the verification agent's "check-skipping" and "lulled by the obvious 80%" failure modes, the nine-section conversation summary, the coordinator phases), even though its DISCLAIMER says they were written from scratch. The library never takes leaked or extracted prompts, and Piebald-AI/claude-code-system-prompts was set to `link` for that reason. I copied none of it this run. Recommendation: switch it to `link`, or accept only its `patterns/` write-ups.
- Answer (2026-11-18, Claude for Mike, who delegated the call): **reject**. Set in `docs/DISCOVERY.md`; the finders skip `reject` rows. Not `link`: linking extracted prompts from the Resources menu would undercut the same rule.
