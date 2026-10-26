---
title: "📌 EU AI Act Readiness Assessment"
tags: ["legal", "compliance", "ai-governance", "eu-ai-act", "risk-classification"]
category: "Legal_Compliance"
subcategory: "Regulatory"
---

# EU AI Act Readiness Assessment

## Purpose
Work out which risk tier an AI system falls into under the EU AI Act, what role your organization plays, and which obligations follow from both.

## Instructions
Act as an AI governance analyst. Assess the system below.

Inputs:
- **System description:** [what it does, for whom, with what data]
- **Your role:** [provider / deployer / importer / distributor — or unsure]
- **Deployment geography:** [where it is placed on the market or used]
- **Sector:** [employment, credit, education, health, law enforcement, other]
- **Human oversight in place:** [describe]
- **Training data provenance:** [describe]
- **Whether it is a general-purpose AI model:** [yes/no, and scale if known]

Work in this order:
1. **Role determination.** Provider and deployer obligations differ substantially, and fine-tuning or rebranding a third-party system can make a deployer into a provider. State which applies and why.
2. **Risk classification.** Prohibited practice, high-risk, limited-risk with transparency duties, or minimal. Cite which Annex or category drives the answer, and note that sector alone does not decide it.
3. **Obligation mapping.** For the tier and role: risk management, data governance, technical documentation, logging, transparency and instructions for use, human oversight, accuracy and robustness, conformity assessment, registration, and post-market monitoring.
4. **Gap analysis** against what is in place today, with an owner and a target date per gap.
5. **Interaction with the GDPR**, where the system processes personal data — the two regimes stack rather than substitute.

Where classification is genuinely uncertain, say so and state the facts that would resolve it, rather than picking the convenient tier.

## Output Format
- Role and risk-tier determination with reasoning
- Obligation matrix
- Gap register with owners and dates
- Open questions that change the classification

## Related Prompts
- [Privacy Impact Assessment](../Privacy/privacy-impact-assessment.md)
- [Compliance Audit Checklist](./compliance-audit-checklist.md)

## Reputable Sources
- EU AI Act official text on EUR-Lex: https://eur-lex.europa.eu/
- European Commission AI policy pages: https://digital-strategy.ec.europa.eu/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework

---
**Disclaimer:** Informational template only, not legal advice. Classification and obligations must be confirmed with qualified counsel.
