---
title: "📌 Foundry Test Suite Generator"
tags: ["blockchain", "web3", "foundry", "testing", "solidity"]
category: "Development"
subcategory: "Blockchain"
---

# Foundry Test Suite Generator

## Purpose
Generate a Foundry test suite that covers the adversarial cases, not just the path the contract was written for.

## Instructions
Act as a Solidity test engineer. Write a Foundry test suite for the contract below. Balance the suite so that at least half the tests describe something going wrong.

Inputs:
- **Contract source:** [paste]
- **Invariants:** [the properties that must always hold — if none are stated, propose them first and confirm before writing tests]
- **Privileged roles:** [who can do what]
- **External dependencies:** [contracts to mock or fork]

Produce tests in four groups:
1. **Happy path** — one per external function, asserting state changes and emitted events
2. **Access control** — every privileged function called by an unauthorized address, asserting the specific revert
3. **Edge cases** — zero amounts, zero address, maximum values, empty arrays, duplicate entries, calling twice, calling out of order
4. **Fuzz and invariant** — `testFuzz_` for numeric inputs with sensible `bound()` calls, and an invariant suite with handler contracts for the stated properties

Also include:
- Fork tests against a pinned block number where an external protocol is involved, with the reason the block was pinned
- Malicious-actor tests: a reentrant caller, a token that returns no bool, a receiver that reverts
- `vm.expectRevert` with the specific custom error, never a bare revert expectation

## Output Format
- Complete test file or files, compilable as written
- A coverage note: which functions and branches are exercised and which are not
- A list of properties that could not be tested, and why

## Related Prompts
- [Smart Contract Security Review](./smart-contract-security-review.md)
- [Upgradeable Proxy Review](./upgradeable-proxy-review.md)

## Reputable Sources
- Foundry Book, writing tests: https://book.getfoundry.sh/forge/writing-tests
- Foundry Book, invariant testing: https://book.getfoundry.sh/forge/invariant-testing
