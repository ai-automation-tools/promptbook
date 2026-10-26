---
title: "📌 DAO Governance Proposal Drafter"
tags: ["blockchain", "web3", "dao", "governance", "proposal"]
category: "Development"
subcategory: "Blockchain"
---

# DAO Governance Proposal Drafter

## Purpose
Draft an on-chain proposal that voters can evaluate and that executes as described, with the calldata and the prose saying the same thing.

## Instructions
Act as a governance contributor. Draft the proposal described below. The single most important property is that the executable actions match the written summary exactly — a reader must be able to check one against the other.

Inputs:
- **What the proposal does:** [in plain language]
- **Governance system:** [Governor contract, Snapshot, or other; quorum and threshold rules]
- **On-chain actions required:** [target contracts, functions, parameters, values]
- **Treasury impact:** [amounts, tokens, recipients]
- **Prior discussion:** [forum thread, temperature check result]

Draft:
1. **Title** — one line, stating the action, not the aspiration
2. **Summary** — what passes if this passes, in three sentences
3. **Motivation** — the problem, with evidence; if the evidence is a forum consensus rather than data, say so
4. **Specification** — each on-chain action as target, function signature, decoded parameters, and value, in execution order
5. **Verification** — how a voter checks the calldata matches the specification, step by step
6. **Treasury impact** — amounts in both token and stated fiat terms, with the price source and date
7. **Risks** — what this makes irreversible, what it grants to whom, and what a malicious execution of these exact actions could achieve
8. **Rollback** — the proposal that would undo this, or a statement that none exists
9. **Timeline** — voting period, timelock delay, execution window

Flag explicitly any action that grants a role, moves funds to an EOA, or changes an upgrade path.

## Output Format
- Proposal document in the sections above
- Action table: target, signature, decoded parameters, value
- A voter verification checklist

## Related Prompts
- [Tokenomics Model Review](./tokenomics-model-review.md)
- [Upgradeable Proxy Review](./upgradeable-proxy-review.md)

## Reputable Sources
- OpenZeppelin Governance documentation: https://docs.openzeppelin.com/contracts/governance
- EIP-5805, voting with delegation: https://eips.ethereum.org/EIPS/eip-5805
