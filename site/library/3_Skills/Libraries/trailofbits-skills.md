---
title: "trailofbits/skills"
description: "Trail of Bits skills for security research, vulnerability detection, and audit workflows"
repo: trailofbits/skills
tags: ["skill","skill-library","security","audit","code-review"]
---
# trailofbits/skills

Trail of Bits skills for security research, vulnerability detection, and audit workflows

A skill library: browse and install its skills from [the repo on GitHub](https://github.com/trailofbits/skills). Promptbook keeps one card for it rather than a copy of each skill.

---

*The repo's README, copied 2026-11-18:*

# Trail of Bits Skills Marketplace

Trail of Bits skills and plugins for AI-assisted security analysis, testing, and development. Install this marketplace in Claude Code or Codex, or import it into your ChatGPT workspace marketplace.

> Also see: [claude-code-config](https://github.com/trailofbits/claude-code-config) · [codex-config](https://github.com/trailofbits/codex-config) · [skills-curated](https://github.com/trailofbits/skills-curated) · [trailmark](https://github.com/trailofbits/trailmark) · [calcifier](https://github.com/trailofbits/calcifier) · [coop](https://github.com/trailofbits/coop)

## Installation

### Claude Code Marketplace

```
/plugin marketplace add trailofbits/skills
```

### Browse and Install Plugins

```
/plugin menu
```

### Codex

Codex supports Claude plugin marketplaces directly, so this repository does not need Codex-specific sidecar metadata.

Install the marketplace with:

```sh
codex plugin marketplace add trailofbits/skills
codex plugin list
codex plugin add <plugin-name>@trailofbits
```

### ChatGPT Workspace Marketplace

Use this repository's `.claude-plugin/marketplace.json` for workspace imports.
Skills that include `agents/openai.yaml` also need `interface.display_name` and
`interface.short_description` in that YAML file; plugin metadata does not supply them.
After a metadata fix is published, sync the repository again in your workspace
marketplace to retry failed imports.

### Local Development

To add the marketplace locally (e.g., for testing or development), navigate to the **parent directory** of this repository:

```
cd /path/to/parent  # e.g., if repo is at ~/projects/skills, be in ~/projects
/plugins marketplace add ./skills
```

## Available Plugins

### Smart Contract Security

| Plugin | Description |
|--------|-------------|
| [building-secure-contracts](https://github.com/trailofbits/skills/blob/main/plugins/building-secure-contracts/) | Smart contract security toolkit with vulnerability scanners for 6 blockchains and 5 development guideline assistants |
| [entry-point-analyzer](https://github.com/trailofbits/skills/blob/main/plugins/entry-point-analyzer/) | Identify state-changing entry points in smart contracts for security auditing |

### Code Auditing

| Plugin | Description |
|--------|-------------|
| [agentic-actions-auditor](https://github.com/trailofbits/skills/blob/main/plugins/agentic-actions-auditor/) | Audit GitHub Actions workflows for AI agent security vulnerabilities |
| [audit-context-building](https://github.com/trailofbits/skills/blob/main/plugins/audit-context-building/) | Understand a codebase before looking for bugs in it, one function at a time |
| [burpsuite-project-parser](https://github.com/trailofbits/skills/blob/main/plugins/burpsuite-project-parser/) | Search and extract data from Burp Suite project files |
| [c-review](https://github.com/trailofbits/skills/blob/main/plugins/c-review/) | Comprehensive C/C++ security code review, with coverage verified against a parse of the source |
| [cvss-scoring](https://github.com/trailofbits/skills/blob/main/plugins/cvss-scoring/) | Produce CVSS v4.0 vectors with metric justifications and a calculator link |
| [differential-review](https://github.com/trailofbits/skills/blob/main/plugins/differential-review/) | Security-focused differential review of code changes with git history analysis |
| [dimensional-analysis](https://github.com/trailofbits/skills/blob/main/plugins/dimensional-analysis/) | Annotate codebases with dimensional analysis comments to detect unit mismatches and formula bugs |
| [fp-check](https://github.com/trailofbits/skills/blob/main/plugins/fp-check/) | Systematic false positive verification for security bug analysis with mandatory gate reviews |
| [insecure-defaults](https://github.com/trailofbits/skills/blob/main/plugins/insecure-defaults/) | Parallel audit workflow for fail-open insecure defaults, with a refuting verifier per candidate file |
| [rust-review](https://github.com/trailofbits/skills/blob/main/plugins/rust-review/) | Comprehensive Rust security review covering safe/unsafe boundary, memory safety, concurrency, panic-DoS, FFI, and async runtime with SARIF output |
| [semgrep-rule-creator](https://github.com/trailofbits/skills/blob/main/plugins/semgrep-rule-creator/) | Create and refine Semgrep rules for custom vulnerability detection |
| [semgrep-rule-variant-creator](https://github.com/trailofbits/skills/blob/main/plugins/semgrep-rule-variant-creator/) | Port existing Semgrep rules to new target languages with test-driven validation |
| [sharp-edges](https://github.com/trailofbits/skills/blob/main/plugins/sharp-edges/) | Identify error-prone APIs, dangerous configurations, and footgun designs |
| [static-analysis](https://github.com/trailofbits/skills/blob/main/plugins/static-analysis/) | Static analysis toolkit with CodeQL, Semgrep, and SARIF parsing |
| [supply-chain-risk-auditor](https://github.com/trailofbits/skills/blob/main/plugins/supply-chain-risk-auditor/) | Audit npm, PyPI, and Go dependencies for version-matched advisories, abandoned upstreams, publisher concentration, and install scripts |
| [testing-handbook-skills](https://github.com/trailofbits/skills/blob/main/plugins/testing-handbook-skills/) | Skills from the [Testing Handbook](https://appsec.guide): fuzzers, static analysis, sanitizers, coverage |
| [trailmark](https://github.com/trailofbits/skills/blob/main/plugins/trailmark/) | Code graph analysis, native taint analyzer modeling, bounded subagent context slicing, Mermaid diagrams, mutation testing triage, and protocol verification |
| [variant-analysis](https://github.com/trailofbits/skills/blob/main/plugins/variant-analysis/) | Find similar vulnerabilities across codebases using pattern-based analysis |
| [vulnerability-triage-brocards](https://github.com/trailofbits/skills/blob/main/plugins/vulnerability-triage-brocards/) | Triage vulnerability reports using 7 brocards to accept, dismiss, or request more info before deeper analysis |

### Malware Analysis

| Plugin | Description |
|--------|-------------|
| [yara-authoring](https://github.com/trailofbits/skills/blob/main/plugins/yara-authoring/) | YARA detection rule authoring with linting, atom analysis, and best practices |

### Verification

| Plugin | Description |
|--------|-------------|
| [constant-time-analysis](https://github.com/trailofbits/skills/blob/main/plugins/constant-time-analysis/) | Detect compiler-induced timing side-channels in cryptographic code |
| [mutation-testing](https://github.com/trailofbits/skills/blob/main/plugins/mutation-testing/) | Configure mutation testing, analyze surviving mutants, and investigate bugs in weakly tested code |
| [patching-bugs](https://github.com/trailofbits/skills/blob/main/plugins/patching-bugs/) | Reproduce and validate one known bug, commit a scoped patch, and produce reviewable proof and regression reports |
| [post-patch-validation](https://github.com/trailofbits/skills/blob/main/plugins/post-patch-validation/) | Help patch authors find missed variants and regressions, with reproducible failures and explicit validation gaps |
| [property-based-testing](https://github.com/trailofbits/skills/blob/main/plugins/property-based-testing/) | Write, review, and triage property-based tests — Hypothesis, fast-check, proptest, and Echidna or Medusa for Solidity invariants |
| [regression-hunt](https://github.com/trailofbits/skills/blob/main/plugins/regression-hunt/) | Find and validate regressions across PRs and commits using discovery, reproduction, and replayed evidence |
| [spec-to-code-compliance](https://github.com/trailofbits/skills/blob/main/plugins/spec-to-code-compliance/) | Check code against the documentation that specifies it, across contracts, C/C++, services, and firmware |
| [writing-lean-proofs](https://github.com/trailofbits/skills/blob/main/plugins/writing-lean-proofs/) | Write structured Lean 4 proofs and design Lean libraries following Mathlib conventions |
| [zeroize-audit](https://github.com/trailofbits/skills/blob/main/plugins/zeroize-audit/) | Detect missing or compiler-eliminated zeroization of secrets in C/C++ and Rust |

### Reverse Engineering

| Plugin | Description |
|--------|-------------|
| [dwarf-expert](https://github.com/trailofbits/skills/blob/main/plugins/dwarf-expert/) | Analyze DWARF debug info: parse and search DIEs, verify integrity, write DWARF parsing code |

### Mobile Security

| Plugin | Description |
|--------|-------------|
| [firebase-apk-scanner](https://github.com/trailofbits/skills/blob/main/plugins/firebase-apk-scanner/) | Scan Android APKs for Firebase security misconfigurations |

### Development

| Plugin | Description |
|--------|-------------|
| [code-improver](https://github.com/trailofbits/skills/blob/main/plugins/code-improver/) | Autonomous review-and-fix workflow over skills, plugins, or a branch, with a pluggable reviewer, findings ledger, escalation, and scope guard |
| [devcontainer-setup](https://github.com/trailofbits/skills/blob/main/plugins/devcontainer-setup/) | Create pre-configured devcontainers with Claude Code and language-specific tooling |
| [gh-cli](https://github.com/trailofbits/skills/blob/main/plugins/gh-cli/) | Intercept GitHub URL fetches — `WebFetch`, MCP fetch tools, and curl/wget — and redirect to the authenticated `gh` CLI |
| [git-cleanup](https://github.com/trailofbits/skills/blob/main/plugins/git-cleanup/) | Safely clean up git worktrees and local branches: a dynamic workflow gathers merge evidence and tries to refute its own delete recommendations, behind gated confirmation |
| [goal-prompt](https://github.com/trailofbits/skills/blob/main/plugins/goal-prompt/) | Draft `/goal` commands for goal mode in Claude Code and Codex — verifiable completion conditions formatted to a copy-ready single line |
| [github-triage](https://github.com/trailofbits/skills/blob/main/plugins/github-triage/) | Triage open GitHub issues and PRs: merge ready bot/approved PRs, review unreviewed ones via subagents, close resolved issues with cited comments, cross-link pending fixes, and score the rest with local-only priority and change-size estimates |
| [let-fate-decide](https://github.com/trailofbits/skills/blob/main/plugins/let-fate-decide/) | Draw Tarot cards using cryptographic randomness to add entropy to vague planning |
| [modern-cpp](https://github.com/trailofbits/skills/blob/main/plugins/modern-cpp/) | Modern C++ best practices (C++20/23/26) with compiler hardening and safe idioms |
| [modern-python](https://github.com/trailofbits/skills/blob/main/plugins/modern-python/) | Modern Python tooling and best practices with uv, ruff, and pytest |
| [open-sourcing](https://github.com/trailofbits/skills/blob/main/plugins/open-sourcing/) | Prepare a repository for public release: secrets hygiene, licensing, CI readiness, and release automation |
| [review-walkthrough](https://github.com/trailofbits/skills/blob/main/plugins/review-walkthrough/) | Generate an interactive walkthrough of branch changes with ordered diffs, explanations, and anchored review findings |
| [second-opinion](https://github.com/trailofbits/skills/blob/main/plugins/second-opinion/) | Get independent reviews from Codex or Antigravity for uncommitted changes, branch diffs, and commits |

### Team Management

| Plugin | Description |
|--------|-------------|
| [culture-index](https://github.com/trailofbits/skills/blob/main/plugins/culture-index/) | Interpret Culture Index survey results for individuals and teams |

### Tooling

| Plugin | Description |
|--------|-------------|
| [chrome-mcp-troubleshooting](https://github.com/trailofbits/skills/blob/main/plugins/chrome-mcp-troubleshooting/) | Diagnose and fix Claude in Chrome MCP extension connectivity issues |

## Trophy Case

Bugs discovered using Trail of Bits Skills. Found something? [Let us know!](https://github.com/trailofbits/skills/issues/new?template=trophy-case.yml)

When reporting bugs you've found, feel free to mention:
> Found using [Trail of Bits Skills](https://github.com/trailofbits/skills)

| Skill | Bug |
|-------|-----|
| constant-time-analysis | [Timing side-channel in ML-DSA signing](https://github.com/RustCrypto/signatures/pull/1144) |

## Contributing

We welcome contributions! See [AGENTS.md](https://github.com/trailofbits/skills/blob/main/AGENTS.md) for skill authoring guidelines, and
run `make check` before you push — it runs most of CI locally (see AGENTS.md for
what it does not cover).

Codex provides advisory fast reviews for eligible PRs from this repository. Maintainers
with write access can request another fast review by commenting `@codex review`, or a
deeper review by applying the `deep-review` label. Fork PRs are excluded.

## License

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/). Made by [Trail of Bits](https://www.trailofbits.com/).
