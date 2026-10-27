---
title: "📌 Solidity Gas Optimizer"
tags: ["blockchain", "web3", "solidity", "gas", "optimization"]
category: "Development"
subcategory: "Blockchain"
---

# Solidity Gas Optimizer

## Purpose
Reduce gas cost without trading away safety, and be explicit when an optimization does trade something away.

## Instructions
Act as a Solidity engineer. Propose gas optimizations for the contract below, ordered by saving. For each one, state the estimated saving, where it applies, and what it costs in readability or safety. Reject any optimization that weakens a check.

Inputs:
- **Contract source:** [paste]
- **Hot paths:** [the functions called most often, and roughly how often]
- **Deployment vs runtime priority:** [which matters more for this contract]
- **Compiler settings:** [version, optimizer runs, via-IR on or off]

Look at:
1. **Storage** — variable packing into slots, `constant` and `immutable` where values never change, caching a storage read in memory inside a loop
2. **Calldata and memory** — `calldata` over `memory` for external function arguments, avoiding unnecessary copies
3. **Loops** — length cached outside the loop, unchecked increment where overflow is impossible, and whether the loop should be bounded at all
4. **Errors** — custom errors over revert strings
5. **Visibility and dispatch** — `external` over `public` where appropriate, function ordering effects on selector dispatch
6. **Events** — indexed parameters chosen for what is actually filtered on
7. **Compiler settings** — optimizer runs tuned to the deployment/runtime trade-off

For each proposal, note whether it changes observable behaviour. Anything that does belongs in a separate list.

## Output Format
- Optimization table: change, location, estimated saving, readability cost, behaviour change (yes/no)
- A rewritten version of the two or three hottest functions
- A list of optimizations considered and rejected, with the safety reason

## Related Prompts
- [Smart Contract Security Review](./smart-contract-security-review.md)
- [Foundry Test Suite Generator](./foundry-test-suite-generator.md)

## Reputable Sources
- Solidity documentation, internals and the optimizer: https://docs.soliditylang.org/en/latest/internals/optimizer.html
- Foundry Book, gas reports: https://book.getfoundry.sh/forge/gas-reports
