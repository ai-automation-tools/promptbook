---
title: "📌 dApp Wallet Integration Plan"
tags: ["blockchain", "web3", "dapp", "wallet", "frontend"]
category: "Development"
subcategory: "Blockchain"
---

# dApp Wallet Integration Plan

## Purpose
Plan the wallet layer of a dApp around the states that actually happen: wrong network, rejected signature, pending forever, and a page reloaded mid-transaction.

## Instructions
Act as a web3 frontend engineer. Plan the wallet integration for the application below. Enumerate states before components — the UI is mostly a function of how many states you admit exist.

Inputs:
- **App:** [what the user is trying to do]
- **Chains supported:** [list, including testnets]
- **Contract interactions:** [reads and writes, and which need approvals first]
- **Stack:** [framework and library — wagmi, viem, ethers, or other]

Cover:
1. **Connection states** — no wallet installed, wallet locked, connected, wrong network, account switched mid-session, disconnected by the wallet
2. **Transaction lifecycle** — simulated, awaiting signature, rejected by user, submitted, pending, replaced or sped up, confirmed, reverted on chain. Each needs its own UI state and its own copy
3. **Approvals** — the two-step approve-then-act flow, existing allowance checks, and why an infinite approval is a user-facing risk decision rather than a convenience default
4. **Reads** — caching, stale data after a write, and the block-confirmation depth at which the UI updates
5. **Errors** — mapping a raw revert to language a user can act on, and never showing a raw hex error as the primary message
6. **Recovery** — page reloaded with a transaction in flight, transaction hash persisted, resume on return
7. **Safety** — the transaction summary shown before signing, and how a user verifies they are on the right contract
8. **Testing** — what is mocked, what runs against a local fork

## Output Format
- State table: state, trigger, UI, user action available
- Component and hook breakdown
- Error mapping table: condition, raw error, user-facing message, recovery action

## Related Prompts
- [Subgraph Schema Designer](./subgraph-schema-designer.md)
- [Smart Contract Security Review](./smart-contract-security-review.md)

## Reputable Sources
- viem documentation: https://viem.sh/
- MetaMask developer documentation: https://docs.metamask.io/
