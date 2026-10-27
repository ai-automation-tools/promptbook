---
title: "📌 Tokenomics Model Review"
tags: ["blockchain", "web3", "tokenomics", "incentives", "economics"]
category: "Development"
subcategory: "Blockchain"
---

# Tokenomics Model Review

## Purpose
Review a token economic design for the incentive it actually creates, which is frequently not the one the document describes.

## Instructions
Act as a token economics reviewer. Analyse the model below. For each mechanism, work out what a rational self-interested participant does, and whether that is what the designer intended.

Inputs:
- **Token purpose:** [governance, fee capture, access, staking, rewards]
- **Supply schedule:** [initial supply, emission curve, cap, burn mechanisms]
- **Allocations and vesting:** [each bucket, percentage, cliff, vesting period]
- **Demand drivers:** [what makes someone need to hold this, as opposed to want to]
- **Incentive mechanisms:** [staking rewards, fee sharing, liquidity mining]

Analyse:
1. **Sell pressure over time** — emissions plus unlocks per period against any structural demand, month by month through the vesting schedule
2. **The unlock cliff** — what happens on the largest single unlock date
3. **Circular value** — rewards paid in the token to attract capital that is there for the rewards; identify it explicitly where it exists
4. **Mercenary capital** — how much of the target liquidity or stake leaves when emissions stop
5. **Governance capture** — the cost of acquiring a controlling share against the value controlled
6. **Fee capture reality** — does value actually reach holders, through what mechanism, and what could divert it
7. **Failure scenarios** — price down 90%, emissions unchanged; a large holder exiting; a competing protocol paying more
8. **Stated purpose against observed incentive** — for each mechanism, what it rewards in practice

## Output Format
- Supply and unlock schedule table by period
- Mechanism table: mechanism, intended behaviour, rational behaviour, gap
- Three failure scenarios worked through
- A list of the assumptions the model depends on, ranked by how load-bearing they are

## Related Prompts
- [ERC-20 Token Specification](./erc20-token-spec.md)
- [DAO Governance Proposal Drafter](./dao-governance-proposal.md)

## Reputable Sources
- BIS research on crypto-asset markets: https://www.bis.org/topic/fintech.htm
- IMF, crypto assets policy analysis: https://www.imf.org/en/Topics/fintech

---
**Disclaimer:** Analytical framework only, not investment advice. Token designs can carry securities and tax consequences that vary by jurisdiction.
