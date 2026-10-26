---
title: "📌 Bridge and Oracle Risk Assessment"
tags: ["blockchain", "web3", "bridge", "oracle", "security"]
category: "Development"
subcategory: "Blockchain"
---

# Bridge and Oracle Risk Assessment

## Purpose
Assess a cross-chain bridge or price oracle by the honest question: who or what must stay honest and online for this to keep working?

## Instructions
Act as a protocol risk analyst. Assess the dependency below. Resolve every "decentralized" and "trustless" claim into a concrete list of parties and the threshold at which they can act together.

Inputs:
- **Dependency:** [bridge or oracle name, and the version or deployment]
- **What depends on it:** [contracts, and the value at risk]
- **Mechanism as documented:** [paste or describe]
- **Failure tolerance:** [what your protocol does if this returns wrong data or stops]

Assess:
1. **Trust set** — the validators, signers, relayers or reporters; how many there are; the threshold; who they are; whether the set can be changed and by whom
2. **Upgrade authority** — who can change the bridge or oracle contracts, behind what delay
3. **Data path** — where the value originates, how it is aggregated, and every point at which a single party could influence it
4. **Staleness and liveness** — the update cadence, the heartbeat, what your contract reads if the feed stops, and whether it checks the timestamp
5. **Manipulation cost** — the capital required to move the reported value far enough to profit, against the value your protocol would lose
6. **Circuit breakers** — the deviation threshold at which your protocol should refuse to act, and what it does instead
7. **Historical record** — past incidents, pauses and postmortems for this specific dependency
8. **Concentration** — what else in your system depends on the same trust set

## Output Format
- Trust set table: party type, count, threshold, identifiability, change authority
- Risk register: scenario, likelihood reasoning, impact, mitigation, residual risk
- A recommended set of on-chain guards with concrete thresholds
- A plain statement of the worst case, in one sentence

## Related Prompts
- [Smart Contract Security Review](./smart-contract-security-review.md)
- [On-Chain Transaction Forensics](./onchain-transaction-forensics.md)

## Reputable Sources
- Chainlink documentation, data feeds and risk: https://docs.chain.link/data-feeds
- Ethereum.org, bridges and their risks: https://ethereum.org/en/developers/docs/bridges/

---
**Disclaimer:** Risk framework only, not a security guarantee or investment advice. Bridges have been the single largest source of protocol losses; treat any assessment as provisional.
