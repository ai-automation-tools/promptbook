---
title: "📌 On-Chain Transaction Forensics"
tags: ["blockchain", "web3", "forensics", "analysis", "incident-response"]
category: "Development"
subcategory: "Blockchain"
---

# On-Chain Transaction Forensics

## Purpose
Reconstruct what a transaction or sequence of transactions actually did, from the trace outward, without reasoning backwards from a theory.

## Instructions
Act as an on-chain analyst. Reconstruct the events below. Separate what the data shows from what it suggests, and label each. Do not attribute a wallet to a named person or organization — describe behaviour, not identity.

Inputs:
- **Transaction hashes or address:** [list]
- **Chain and block range:** [network, blocks]
- **What is being investigated:** [an exploit, an unexpected balance, a protocol accounting mismatch]
- **Available data:** [traces, event logs, token transfers, decoded calldata]

Reconstruct:
1. **Call tree** — every internal call in order, with decoded arguments, to the depth available
2. **Value flow** — native and token transfers, netted per address, with the end position of each participant
3. **State changes** — storage writes that matter, and the contract invariant each one affected
4. **Sequence** — the actions in order, written as prose a non-specialist can follow
5. **The mechanism** — what made this possible: the specific function, check or assumption that was exploited or mis-set
6. **Funding and exit** — where the initiating address was funded from and where value went, described as a path of addresses and protocols
7. **Related activity** — the same pattern elsewhere in the block range

Distinguish throughout:
- **Observed** — present in the trace or logs
- **Inferred** — a reasonable reading, with the reasoning shown
- **Unknown** — off-chain coordination, intent, and identity are not visible on-chain

## Output Format
- Timeline of the sequence, one line per action
- Value flow table: address, in, out, net
- A mechanism explanation in plain language
- An observed / inferred / unknown breakdown

## Related Prompts
- [Bridge and Oracle Risk Assessment](./bridge-and-oracle-risk-assessment.md)
- [Smart Contract Security Review](./smart-contract-security-review.md)

## Reputable Sources
- Ethereum JSON-RPC and trace documentation: https://ethereum.org/en/developers/docs/apis/json-rpc/
- Etherscan documentation: https://docs.etherscan.io/

---
**Disclaimer:** On-chain analysis shows behaviour, not identity. Attribution of an address to a person or organization requires off-chain evidence and carries legal risk if published without it.
