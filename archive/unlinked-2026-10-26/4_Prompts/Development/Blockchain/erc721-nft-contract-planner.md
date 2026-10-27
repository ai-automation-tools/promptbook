---
title: "📌 ERC-721 NFT Contract Planner"
tags: ["blockchain", "web3", "nft", "erc721", "solidity"]
category: "Development"
subcategory: "Blockchain"
---

# ERC-721 NFT Contract Planner

## Purpose
Plan an NFT contract including the parts that usually get decided by accident: where metadata lives, who can change it, and what the mint does under load.

## Instructions
Act as a protocol engineer. Plan the contract for the collection described below. Treat metadata permanence and royalty enforcement as design decisions to be stated, not defaults to inherit.

Inputs:
- **Collection:** [size, what the tokens represent]
- **Mint mechanics:** [allowlist, public, auction, free, and the expected demand]
- **Metadata:** [static or revealed later, and where it is hosted]
- **Royalty intention:** [percentage and recipient]
- **Chain:** [target network]

Plan:
1. **Standard and extensions** — ERC-721 base, enumerable or not with the gas reasoning, ERC-2981 royalties
2. **Mint design** — supply cap enforcement, per-wallet limits and how they are enforced against a user with many wallets, allowlist mechanism (Merkle proof or signature) and its trade-offs, reentrancy on a `safeMint` callback
3. **Metadata** — base URI, IPFS or Arweave or a server, whether the URI is frozen and when, the provenance hash for a delayed reveal, and what happens if the host disappears
4. **Randomness** — if the assignment is random, where the randomness comes from and why it cannot be predicted or reverted by the minter
5. **Royalties** — ERC-2981 signalling and the honest statement that it is not enforceable on-chain by most marketplaces
6. **Admin powers** — every one, with the renunciation path
7. **Withdrawals** — pull over push, and the failure mode if the recipient is a contract that reverts

## Output Format
- Design document in the sections above
- Decisions table: decision, option chosen, alternative, why
- A pre-launch checklist including the mint dry run on a testnet

## Related Prompts
- [Smart Contract Security Review](./smart-contract-security-review.md)
- [Solidity Gas Optimizer](./solidity-gas-optimizer.md)

## Reputable Sources
- EIP-721 non-fungible token standard: https://eips.ethereum.org/EIPS/eip-721
- EIP-2981 NFT royalty standard: https://eips.ethereum.org/EIPS/eip-2981
