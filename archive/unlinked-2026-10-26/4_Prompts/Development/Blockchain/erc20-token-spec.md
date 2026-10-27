---
title: "📌 ERC-20 Token Specification"
tags: ["blockchain", "web3", "erc20", "token", "solidity"]
category: "Development"
subcategory: "Blockchain"
---

# ERC-20 Token Specification

## Purpose
Write the specification for a token before writing the contract, so the supply mechanics and privileged powers are decisions rather than accidents.

## Instructions
Act as a protocol engineer. Produce a specification for the token described below. Every privileged capability must be named explicitly, together with who holds it and how it can be given up.

Inputs:
- **Purpose of the token:** [what it is for — governance, payment, access, points]
- **Supply model:** [fixed / mintable / burnable, and the cap if any]
- **Distribution:** [allocations, vesting, and to whom]
- **Chain:** [target network]
- **Regulatory posture:** [jurisdiction and counsel position, if any]

Specify:
1. **Metadata** — name, symbol, decimals, and the reason for the decimals choice
2. **Supply mechanics** — initial mint, who can mint afterwards, burn rules, cap enforcement
3. **Privileged roles** — every role, its powers, how it is assigned, and the renunciation path
4. **Transfer behaviour** — any pause, blocklist, allowlist or fee; if there is none, say so explicitly, since integrators need to know
5. **Standard conformance** — which parts of ERC-20 are implemented exactly, and any deviation, stated loudly because deviations break integrators
6. **Permit** — ERC-2612 support or not, and the domain separator handling across chain reorganizations
7. **Upgradeability** — upgradeable or immutable, and the admin trust assumption either way
8. **Events** — what is emitted, so indexers can reconstruct state

Call out the integrator hazards this token creates: fee-on-transfer, rebasing, non-standard return values, non-18 decimals.

## Output Format
- Specification document in the sections above
- A privileged-powers table: role, power, holder, renunciation path
- An integrator notes section listing every non-standard behaviour

## Related Prompts
- [Smart Contract Security Review](./smart-contract-security-review.md)
- [Tokenomics Model Review](./tokenomics-model-review.md)

## Reputable Sources
- EIP-20 token standard: https://eips.ethereum.org/EIPS/eip-20
- OpenZeppelin Contracts, ERC-20: https://docs.openzeppelin.com/contracts/erc20

---
**Disclaimer:** Token design can carry securities, tax and money-transmission consequences that vary by jurisdiction. This prompt produces an engineering specification, not legal advice.
