# Security

## Reporting a problem

This is a ⟨private⟩ workspace. If you find a leaked secret, an unsafe default, or a way to
make an agent here act outside its guardrails, tell ⟨owner⟩ directly
(⟨GitHub private vulnerability reporting, or a contact⟩). Don't open a public issue.

## Guardrails in this repo

| Guardrail | Where | What it stops |
|:---|:---|:---|
| Permission deny rules | `.claude/settings.json` (rationale in `.claude/settings.md`) | ⟨destructive and outward-facing actions⟩ |
| ⟨Hook⟩ | `.claude/hooks/⟨name⟩` | ⟨what it blocks; whether it fails open or closed⟩ |
| Held paths | the merge gate | Automated PRs that touch settings, hooks or `.mcp.json` wait for a person |

## Secrets

Never commit `.env*`, keys, tokens or credentials. Real values go in `.env` (gitignored); `.env.example` (committed) holds names only.
If a secret is committed, rotate it first, then clean up; rewriting history comes last.
