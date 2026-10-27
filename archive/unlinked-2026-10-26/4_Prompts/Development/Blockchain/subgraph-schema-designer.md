---
title: "📌 Subgraph Schema Designer"
tags: ["blockchain", "web3", "the-graph", "indexing", "graphql"]
category: "Development"
subcategory: "Blockchain"
---

# Subgraph Schema Designer

## Purpose
Design an indexing schema from the queries the app will actually run, rather than mirroring the contract and discovering later that the interesting question needs a full scan.

## Instructions
Act as a blockchain data engineer. Design a subgraph schema and mapping plan for the protocol below. Start from the queries, then derive the entities.

Inputs:
- **Contracts and events:** [ABI or event signatures]
- **Queries the app needs:** [list them concretely — "show a user their open positions sorted by value"]
- **Chains:** [networks to index]
- **History needed:** [current state only, or full history]

Produce:
1. **Entities** — derived from the queries, with the immutable ones marked as such since they index far more cheaply
2. **Relationships** — one-to-many and many-to-many, with derived fields where the reverse lookup is needed
3. **Event handlers** — which event maps to which entity mutation, and the handler order where two events land in the same transaction
4. **Derived values** — running totals, counts and aggregates maintained incrementally, with the note that a subgraph cannot cheaply recompute them
5. **Reorg safety** — what the schema assumes about finality, and which values would be wrong for a block or two
6. **Historical snapshots** — hourly or daily entities if time-series queries are needed, since they cannot be reconstructed after the fact
7. **Indexing cost** — the handlers likely to dominate sync time, and what can be dropped

For each query listed in the input, show the GraphQL that answers it against the proposed schema. A query that cannot be expressed is a schema defect, not a client problem.

## Output Format
- `schema.graphql` as written
- Handler table: event, entities touched, fields updated
- One GraphQL query per requirement, with the entity path it traverses

## Related Prompts
- [dApp Wallet Integration Plan](./dapp-wallet-integration.md)
- [On-Chain Transaction Forensics](./onchain-transaction-forensics.md)

## Reputable Sources
- The Graph documentation, developing a subgraph: https://thegraph.com/docs/en/subgraphs/developing/
- GraphQL specification: https://spec.graphql.org/
