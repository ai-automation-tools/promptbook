---
title: "📌 Upgradeable Proxy Review"
tags: ["blockchain", "web3", "solidity", "proxy", "upgradeability"]
category: "Development"
subcategory: "Blockchain"
---

# Upgradeable Proxy Review

## Purpose
Review an upgradeable deployment for the failure modes unique to proxies — storage collisions, uninitialized implementations, and an admin key that is a single point of total loss.

## Instructions
Act as a smart contract auditor specializing in upgradeable systems. Review the setup below. Treat "who can upgrade this, and what stops them taking everything" as the first question, not the last.

Inputs:
- **Proxy pattern:** [transparent / UUPS / beacon / diamond]
- **Proxy and implementation source:** [paste]
- **Previous implementation, if this is an upgrade:** [paste or describe]
- **Admin setup:** [EOA, multisig with threshold, timelock with delay, governance]
- **Value at risk:** [what the contract custodies]

Review:
1. **Storage layout** — slot-by-slot comparison against the previous implementation; any reordered, retyped, removed or inserted variable; gap variables present and correctly sized; inherited contract order unchanged
2. **Initialization** — initializer protected against a second call, parent initializers chained, the implementation contract itself initialized or disabled so nobody can claim it
3. **Upgrade authorization** — UUPS `_authorizeUpgrade` present and restricted; the path by which a new implementation without an upgrade function bricks the proxy permanently
4. **Constructor and immutable** — values set in a constructor do not exist for the proxy; every one of them flagged
5. **`selfdestruct` and `delegatecall`** — any path that could destroy or hijack the implementation
6. **Admin key risk** — EOA, multisig threshold, timelock delay; state the worst case for each in one sentence
7. **Function clashes** — transparent proxy selector collisions between admin and implementation functions

## Output Format
- Storage layout comparison table: slot, before, after, verdict
- Findings table: severity, issue, consequence, fix
- A plain statement of the upgrade trust assumption, in the words a user would need to hear
- A go/no-go on the upgrade as proposed

## Related Prompts
- [Smart Contract Security Review](./smart-contract-security-review.md)
- [Foundry Test Suite Generator](./foundry-test-suite-generator.md)

## Reputable Sources
- OpenZeppelin, proxy upgrade pattern: https://docs.openzeppelin.com/upgrades-plugins/proxies
- EIP-1967 standard proxy storage slots: https://eips.ethereum.org/EIPS/eip-1967
