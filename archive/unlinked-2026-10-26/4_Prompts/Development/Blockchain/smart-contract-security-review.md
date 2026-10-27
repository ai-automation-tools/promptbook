---
title: "📌 Smart Contract Security Review"
tags: ["blockchain", "web3", "solidity", "security", "audit"]
category: "Development"
subcategory: "Blockchain"
---

# Smart Contract Security Review

## Purpose
Walk a Solidity contract through the vulnerability classes that have actually drained funds, and separate what is exploitable from what is merely untidy.

## Instructions
Act as a smart contract auditor. Review the contract below. For every finding, state the attack path concretely — who calls what, in what order, and what they walk away with. A finding with no attack path is an observation, and should be labelled as one.

Inputs:
- **Contract source:** [paste, with the Solidity version pragma]
- **What it is supposed to do:** [in plain language]
- **Trust assumptions:** [who is privileged, what is expected of external contracts]
- **Deployment target:** [chain, and whether it is upgradeable]
- **External dependencies:** [oracles, tokens, other protocols it calls]

Check for:
1. **Reentrancy** — state written after an external call, cross-function and read-only variants
2. **Access control** — missing or wrong modifiers, initializer callable twice, ownership transfer without a two-step handover
3. **Arithmetic** — unchecked blocks, precision loss from division before multiplication, rounding that always favours the same party
4. **External calls** — unchecked return values, gas assumptions, tokens that do not return a bool, fee-on-transfer and rebasing tokens
5. **Oracles and price** — spot price from a pool used as a price feed, staleness checks, single-source dependency
6. **MEV and ordering** — front-running, sandwich exposure, missing slippage and deadline parameters
7. **Denial of service** — unbounded loops over user-controlled arrays, push payments to addresses that can revert
8. **Upgradeability** — storage layout collisions, uninitialized implementation contracts, an admin who can rug

## Output Format
- Findings table: severity (critical / high / medium / low / informational), location, attack path, fix
- A separate list of observations with no exploit path
- Test cases that would have caught each critical and high finding

## Related Prompts
- [Foundry Test Suite Generator](./foundry-test-suite-generator.md)
- [Upgradeable Proxy Review](./upgradeable-proxy-review.md)

## Reputable Sources
- OpenZeppelin Contracts documentation: https://docs.openzeppelin.com/contracts/
- Solidity documentation, security considerations: https://docs.soliditylang.org/en/latest/security-considerations.html

---
**Disclaimer:** An automated review is not an audit. Contracts holding real value should be reviewed by a qualified firm and covered by a bug bounty before deployment.
