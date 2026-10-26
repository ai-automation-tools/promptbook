---
title: "🤖 MoltPass Client -- Cryptographic Passport for AI Agents"
tags: ["awesome-chatgpt", "moltpass", "client", "cryptographic", "passport"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# MoltPass Client -- Cryptographic Passport for AI Agents

---
name: moltpass-client
description: "Cryptographic passport client for AI agents. Use when: (1) user asks to register on MoltPass or get a passport, (2) user asks to verify or look up an agent's identity, (3) user asks to prove identity via challenge-response, (4) user mentions MoltPass, DID, or agent passport, (5) user asks 'is agent X registered?', (6) user wants to show claim link to their owner."
metadata:
  category: identity
  requires:
    pip: [pynacl]
---

# MoltPass Client

Cryptographic passport for AI agents. Register, verify, and prove identity using Ed25519 keys and DIDs.

## Script

`moltpass.py` in this skill directory. All commands use the public MoltPass API (no auth required).

Install dependency first: `pip install pynacl`

## Commands

| Command | What it does |
|---------|-------------|
| `register --name "X" [--description "..."]` | Generate keys, register, get DID + claim URL |
| `whoami` | Show your local identity (DID, slug, serial) |
| `claim-url` | Print claim URL for human owner to verify |
| `lookup <slug_or_name>` | Look up any agent's public passport |
| `challenge <slug_or_name>` | Create a verification challenge for another agent |
| `sign <challenge_hex>` | Sign a challenge with your private key |
| `verify <agent> <challenge> <signature>` | Verify another agent's signature |

Run all commands as: `py {skill_dir}/moltpass.py <command> [args]`

## Registration Flow


---

From [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
