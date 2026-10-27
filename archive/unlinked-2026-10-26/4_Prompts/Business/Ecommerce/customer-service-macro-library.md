---
title: "📌 Customer Service Macro Library"
tags: ["ecommerce", "customer-service", "support", "macros", "tone"]
category: "Business"
subcategory: "Ecommerce"
---

# Customer Service Macro Library

## Purpose
Build a macro set that resolves the common contacts in one reply, with the decision rules agents need so a macro does not become a template for saying nothing.

## Instructions
Act as a support operations lead building a macro library.

Inputs:
- **Contact reasons by volume:** [top ten, with share]
- **Policies that govern each:** [returns, shipping, warranty, price]
- **Agent authority levels:** [what an agent can approve without escalation, and up to what value]
- **Channels:** [email, chat, social, phone]
- **Brand voice:** [paste a sample of how you want to sound]

For each contact reason produce:
- The macro text, written to resolve rather than acknowledge. A reply that restates the problem and promises to look into it doubles the contact count.
- The decision rule that tells the agent which variant applies, stated as conditions on facts the agent can see
- The variables to personalize, and which ones must never be guessed
- The escalation trigger, with what to hand over
- A channel-length variant where the channel demands it

Write the apology once, at the top, and then move to the remedy. Repeated apology language across a thread reads as evasion.

Include the harder ones explicitly: a policy exception denied, a delivery the carrier lost, a price that dropped after purchase, and a customer who is right but outside the window. Those four generate the escalations, and a library that only covers the easy cases leaves agents improvising exactly where it matters.

## Output Format
- Macros by contact reason with variants
- Decision rules and escalation triggers
- Variable list with must-verify flags
- Coverage gaps: contact reasons with no macro

## Related Prompts
- [Returns Policy Generator](./returns-policy-generator.md)
- [Customer Retention](./customer-retention.md)

## Reputable Sources
- Harvard Business Review research on customer effort: https://hbr.org/
- Nielsen Norman Group support UX research: https://www.nngroup.com/
