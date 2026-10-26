---
title: "Startup Document Prompt Library"
tags: ["prompt","content","create-documentation"]
---

# Startup Document Prompt Library

> Copy-ready LLM prompts for every document needed to build and formalize a web app into a profitable business. 
> Replace all `[bracketed placeholders]` with your specific details before using.

---

## Table of Contents

1. [Phase 1 — Product & Design Docs](#phase-1--product--design-docs)
2. [Phase 2 — Engineering Docs](#phase-2--engineering-docs)
3. [Phase 3 — Legal & Compliance](#phase-3--legal--compliance)
4. [Phase 4 — Business & Finance Docs](#phase-4--business--finance-docs)
5. [Phase 5 — Marketing & Sales Docs](#phase-5--marketing--sales-docs)
6. [Phase 6 — Team & Operations Docs](#phase-6--team--operations-docs)

---

## Phase 1 — Product & Design Docs

### 1.1 Product Requirements Document (PRD)
`Required`

**Prompt — Full PRD:**
```
Create a detailed Product Requirements Document (PRD) for a [SaaS / web app / marketplace] called [App Name]. It solves [problem] for [target user]. Include: executive summary, problem statement, goals & success metrics, user personas, feature list with priority tiers (P0/P1/P2), user stories in "As a [user], I want to [action] so that [outcome]" format, out-of-scope items, and open questions. Format it as a professional document with clear sections.
```

**Prompt — Lean MVP PRD:**
```
Write a lean one-page PRD for an MVP of [App Name]. Focus only on core features that validate the primary hypothesis: [hypothesis]. Include: problem, proposed solution, 3–5 must-have features, definition of done, and how we'll measure success.
```

---

### 1.2 Wireframes & Design Specs
`Required`

**Prompt — Full Design Spec:**
```
Write a UI/UX design specification document for [App Name]. Include: design principles, color palette, typography scale, component library overview (buttons, inputs, modals, cards), spacing system, key user flows with step-by-step screen descriptions, and accessibility requirements (WCAG 2.1 AA). Format each screen as a numbered wireframe description with layout notes.
```

**Prompt — User Flow Doc:**
```
Create a user flow document for the [onboarding / checkout / dashboard] experience of [App Name]. Map each step the user takes from entry point to goal completion, including decision branches, error states, and empty states. Use a numbered list format with sub-steps and notes on UI elements at each step.
```

---

### 1.3 Technical Architecture Document
`Required`

**Prompt — Full Architecture Doc:**
```
Create a technical architecture document for [App Name], a [describe app]. Tech stack: [frontend / backend / database / infra]. Include: system overview, architecture diagram description, component breakdown, data flow narrative, API design approach, database schema overview, authentication strategy, third-party integrations, scalability considerations, and known technical risks. Write it for a technical audience (senior engineers).
```

**Prompt — Architecture Decision Record (ADR):**
```
Write an Architecture Decision Record (ADR) for why we chose [technology/approach] over [alternatives] for [App Name]. Include: context, decision, considered alternatives with pros/cons, consequences, and status (proposed/accepted).
```

---

### 1.4 User Personas
`Recommended`

**Prompt — Full Persona Set:**
```
Create 3 detailed user personas for [App Name], which targets [describe market]. For each persona include: name, age, job title, company size, goals, frustrations, current tools they use, how they'd discover our product, and a short narrative day-in-the-life. Make them feel like real people, not archetypes.
```

---

## Phase 2 — Engineering Docs

### 2.1 README.md
`Required`

**Prompt — Full README:**
```
Write a professional README.md for a GitHub repository called [repo-name]. The project is: [brief description]. Tech stack: [stack]. Include: project badges, one-line description, features list, prerequisites, installation steps, environment variable setup (.env.example reference), how to run locally, how to run tests, deployment instructions, API reference overview, contributing guide, and license. Use proper Markdown formatting.
```

---

### 2.2 API Documentation
`Required`

**Prompt — OpenAPI Spec:**
```
Generate a complete OpenAPI 3.0 YAML specification for a REST API called [API Name]. The API handles: [describe functionality]. Include these endpoints: [list endpoints]. For each endpoint document: HTTP method, path, summary, request parameters, request body schema, response schemas (200, 400, 401, 404, 500), and authentication (Bearer token). Use proper OpenAPI 3.0 structure with components/schemas for reusable models.
```

**Prompt — Developer-Facing API Docs:**
```
Write human-readable API documentation for [API Name] aimed at developers integrating our service. Include: overview, authentication setup, base URL, rate limits, error code reference, and detailed docs for each endpoint with request/response examples in JSON. Format it like Stripe or Twilio's developer docs.
```

---

### 2.3 Database Schema Doc
`Required`

**Prompt — Full Schema Documentation:**
```
Create a database schema documentation document for [App Name] using [PostgreSQL / MySQL / MongoDB]. The app handles: [describe data needs]. Include: all table/collection definitions with column names, data types, constraints, default values, indexes, and foreign key relationships. Add a written narrative explaining the relationships and any important design decisions. Format table definitions as Markdown tables.
```

---

### 2.4 Code Style Guide
`Recommended`

**Prompt — Engineering Standards Doc:**
```
Write a code style guide for a [TypeScript / Python / JavaScript] project called [App Name]. Include: file and folder naming conventions, variable/function/class naming rules, import ordering, commenting standards (JSDoc/docstrings), maximum line length, linting config recommendations (ESLint/Prettier/Black), Git commit message format (Conventional Commits), PR size guidelines, and code review checklist. Format it as a CONTRIBUTING.md document.
```

---

### 2.5 Deployment Runbook
`Recommended`

**Prompt — Ops Runbook:**
```
Create a deployment runbook for [App Name] hosted on [AWS / GCP / Vercel / Railway]. Include: environment overview (dev/staging/prod), all environment variables with descriptions, step-by-step deployment process, CI/CD pipeline description ([GitHub Actions / CircleCI]), health check URLs, rollback procedure (step-by-step), common failure scenarios with fixes, and on-call escalation path. Write it so a new engineer can deploy without help.
```

---

### 2.6 QA & Test Plan
`Recommended`

**Prompt — QA Strategy Doc:**
```
Write a QA and test plan for [App Name]. Include: testing strategy overview, types of tests used (unit, integration, E2E, smoke), testing tools ([Jest / Playwright / Cypress / Pytest]), coverage targets by layer, test environment setup, critical user journeys to cover in E2E tests, edge cases and error scenarios to test, performance testing approach, and definition of "ready to ship." Format it as a team reference document.
```

---

## Phase 3 — Legal & Compliance

> ⚠️ All legal prompts generate starting drafts only. Have a licensed attorney review before publishing or signing.

### 3.1 Terms of Service
`Required`

**Prompt — ToS Draft:**
```
Draft a Terms of Service agreement for [App Name], a [SaaS / web app] operated by [Company Name] incorporated in [State/Country]. Users are [B2C consumers / B2B businesses]. Include sections on: acceptance of terms, description of service, user accounts and responsibilities, acceptable use policy, intellectual property ownership, payment and subscription terms (if applicable), disclaimers and limitation of liability, termination, governing law ([jurisdiction]), and contact information. Write in clear, plain English while remaining legally robust. Note: this is a starting draft to be reviewed by a lawyer.
```

---

### 3.2 Privacy Policy
`Required`

**Prompt — GDPR/CCPA Privacy Policy:**
```
Write a Privacy Policy for [App Name] operated by [Company Name]. We collect: [list data types e.g. email, usage data, payment info]. We use: [analytics tools, e.g. Google Analytics, Mixpanel], [payment processors, e.g. Stripe]. Our users include people from [regions, e.g. US, EU]. Include GDPR-compliant sections (lawful basis, data subject rights, DPO contact), CCPA compliance (California residents' rights), cookie usage, data retention periods, third-party sharing, security measures, and how to contact us. Write in plain English.
```

---

### 3.3 Cookie Policy
`Required`

**Prompt — EU-Compliant Cookie Policy:**
```
Write a Cookie Policy for [App Name]. We use the following cookies: [list them, e.g. session cookies for auth, Google Analytics for traffic, Intercom for support chat, Stripe for payments]. For each cookie type explain: what it is, why we use it, who sets it (first vs third party), how long it persists, and how users can opt out. Include instructions for disabling cookies in major browsers. Ensure the policy meets EU ePrivacy Directive requirements.
```

---

### 3.4 DMCA / IP Policy
`Recommended`

**Prompt — DMCA Takedown Policy:**
```
Write a DMCA (Digital Millennium Copyright Act) policy for [App Name]. Include: our designated DMCA agent contact details (placeholder), how to submit a takedown notice (required elements), how we process notices, counter-notification process, repeat infringer policy, and a statement about our platform's approach to intellectual property. Format it as a standalone policy page.
```

---

### 3.5 MSA / SaaS Agreement
`Optional`

**Prompt — B2B Enterprise Contract:**
```
Draft a Master Service Agreement (MSA) for [Company Name] selling [App Name] as a B2B SaaS product. The typical customer is a [company size/type]. Include: subscription and payment terms, service description and scope, SLA (uptime commitment: [e.g. 99.9%], response times, credits), data processing obligations (GDPR DPA addendum), intellectual property ownership, confidentiality obligations, limitations of liability, indemnification, term and termination, and governing law ([jurisdiction]). Flag any clauses that require attorney customization.
```

---

## Phase 4 — Business & Finance Docs

### 4.1 Business Plan
`Required`

**Prompt — Investor-Ready Business Plan:**
```
Write a concise startup business plan for [App Name], a [describe product] targeting [market]. Include: executive summary, problem and solution, product description, target market and TAM/SAM/SOM sizing, business model and revenue streams, competitive analysis (3–4 competitors with differentiation table), go-to-market strategy, team overview, financial highlights (revenue projections year 1–3, key assumptions), and funding ask (if applicable). Keep it to 8–10 pages. Write for a seed-stage investor audience.
```

---

### 4.2 Financial Model & Projections
`Required`

**Prompt — SaaS Financial Model:**
```
Build a 3-year financial model for [App Name], a SaaS product. Pricing: [e.g. $49/mo basic, $99/mo pro]. Starting MRR: $0. Key assumptions: [e.g. 15% MoM growth year 1, 10% churn, 3-person team]. Create: monthly revenue projections for year 1 (MRR, ARR, new customers, churned customers), annual summaries for years 2–3, COGS breakdown, operating expense categories (salaries, infrastructure, marketing, G&A), monthly burn rate, cumulative cash burn, and runway assuming [$X] raised. Format as a structured table with labeled rows and months as columns.
```

---

### 4.3 Articles of Incorporation
`Required`

**Prompt — Incorporation Readiness Guide:**
```
Explain what I need to incorporate [Company Name] as a Delaware C-Corporation. List: (1) all required documents with what each one covers, (2) the incorporation process step by step, (3) decisions I need to make before filing (authorized shares, par value, registered agent), (4) what a founders' stock purchase agreement covers and why it's needed, (5) the 83(b) election and why founders should file it within 30 days. Then provide a checklist I can hand to a startup attorney.
```

---

### 4.4 Cap Table
`Recommended`

**Prompt — Seed-Stage Cap Table with SAFE:**
```
Create a cap table spreadsheet template for a startup with 2 founders and a 10% option pool. Total authorized shares: 10,000,000. Founders split is 60/40. Show: pre-money table (founder shares, option pool, total), then model a $500K seed round at $4M pre-money valuation using a SAFE. Show post-money fully diluted ownership percentages for all stakeholders. Include formulas/notes explaining how each number is calculated. Format as a clean Markdown table with columns: Stakeholder | Security Type | Shares | % Ownership.
```

---

### 4.5 Pricing Strategy Doc
`Recommended`

**Prompt — SaaS Pricing Strategy:**
```
Create a pricing strategy document for [App Name], a [describe product] for [target customer]. Include: chosen pricing model (per seat / usage-based / flat / freemium) with rationale, value metric justification, proposed tier structure with 3 plans (feature comparison table), pricing psychology considerations, competitive pricing benchmarks from [competitor 1, 2, 3], unit economics (LTV, CAC target, gross margin target), freemium or free trial strategy, and pricing page copy recommendations.
```

---

### 4.6 Pitch Deck
`Optional`

**Prompt — Seed Pitch Deck Content:**
```
Write slide-by-slide content for a 12-slide seed-stage pitch deck for [App Name]. Context: [describe company, stage, traction]. Follow this structure: (1) Cover, (2) Problem, (3) Solution, (4) Product demo narrative, (5) Market size (TAM/SAM/SOM), (6) Business model, (7) Traction, (8) Competitive landscape, (9) Go-to-market, (10) Team, (11) Financials summary, (12) Ask & use of funds. For each slide write: headline, 3–5 bullet points, and a presenter note explaining what to say and what to emphasize.
```

---

## Phase 5 — Marketing & Sales Docs

### 5.1 GTM Strategy
`Required`

**Prompt — Product Launch GTM Plan:**
```
Create a go-to-market strategy document for [App Name] launching in [timeline]. Target customer: [ICP description]. Include: ICP definition and buyer personas, positioning statement, key messaging pillars, acquisition channel strategy (rank channels by priority with rationale), launch phases (pre-launch, launch week, post-launch), first 90-day customer acquisition plan with weekly milestones, partnership strategy, content strategy overview, and success metrics (MQL, SQL, activation rate, MRR targets). Write it as an actionable team playbook.
```

---

### 5.2 Competitive Analysis
`Recommended`

**Prompt — Sales & Positioning Analysis:**
```
Write a competitive analysis for [App Name] in the [market category] space. Analyze these competitors: [Competitor 1, 2, 3, 4]. For each competitor cover: target customer, core value proposition, pricing, key features, known weaknesses, and customer sentiment. Then provide: a feature comparison matrix (us vs. each competitor), our differentiation narrative, positioning map description (two axes: [axis 1] vs [axis 2]), and recommended messaging based on gaps in the market. Format for a sales and marketing audience.
```

---

### 5.3 Brand & Messaging Guide
`Recommended`

**Prompt — Brand Voice & Messaging Foundation:**
```
Create a brand messaging guide for [App Name]. We are a [describe product] for [target audience]. Our differentiators are [1, 2, 3]. Our tone should feel [e.g. technical but approachable / bold and direct / calm and trustworthy]. Include: one-sentence elevator pitch, one-paragraph company description, tagline options (5 variations), 3 core value propositions with supporting proof points, tone of voice guidelines (do/don't examples), headline formulas for the website, and boilerplate text for press and investor materials.
```

---

### 5.4 Sales Playbook
`Optional`

**Prompt — First Sales Hire Playbook:**
```
Write a sales playbook for [App Name] targeting [buyer title] at [company type]. Average deal size: [amount]. Sales motion: [PLG self-serve / inbound demo / outbound]. Include: ideal customer profile, discovery call framework (5 key questions), product demo script (15-minute structure), top 5 objections with recommended responses, deal stages with entry/exit criteria, email templates for follow-up sequences, and a one-page battlecard against [top competitor]. Write it so a first-time sales hire can use it immediately.
```

---

## Phase 6 — Team & Operations Docs

### 6.1 Security Policy
`Required`

**Prompt — SOC 2-Aligned Security Policy:**
```
Write an information security policy for [Company Name], a [SaaS startup]. We handle [describe data sensitivity, e.g. PII, financial data, enterprise customer data]. Include: scope and purpose, access control policy (least privilege, MFA requirements, offboarding checklist), data classification framework (public / internal / confidential / restricted), data handling and storage requirements, encryption standards (in transit and at rest), incident response procedure (detection → triage → containment → notification → post-mortem), vulnerability management process, and employee security training requirements. Write it to satisfy basic SOC 2 Type I requirements.
```

---

### 6.2 Onboarding & Support Docs
`Recommended`

**Prompt — New User Onboarding Content:**
```
Write a user onboarding guide for [App Name]. The user has just signed up and needs to reach their first "aha moment": [describe it, e.g. "send their first campaign", "connect their first integration"]. Create: a welcome email sequence (3 emails with subject lines and copy), an in-app onboarding checklist (5–7 steps with descriptions), a getting started guide (walkthrough format), and a top-10 FAQ based on common questions new users have about [core feature area].
```

---

### 6.3 Vendor / Contractor Agreements
`Recommended`

**Prompt — Standard Contractor Agreement:**
```
Draft an independent contractor agreement for [Company Name] engaging a freelance [developer / designer / marketer]. Include: services description (to be filled in as SOW), payment terms, IP assignment clause (all work product belongs to company), confidentiality / NDA provisions, non-solicitation clause, contractor status acknowledgment (no employment relationship), term and termination, and governing law ([state]). Make it short (1–2 pages), plain-English, and suitable for US-based contractors. Flag clauses to have a lawyer review.
```

---

### 6.4 SLA Document
`Optional`

**Prompt — Enterprise SLA Addendum:**
```
Write a Service Level Agreement (SLA) for [App Name] offered to [SMB / enterprise] customers. Include: uptime commitment ([e.g. 99.9%] monthly uptime), how uptime is calculated and what counts as downtime, scheduled maintenance exclusions, support tiers (response time SLAs by severity: critical / high / medium / low), service credit structure for SLA breaches, how customers report incidents, escalation path, and exclusions (force majeure, customer-caused issues). Format it as a standalone addendum to the MSA.
```

---

## Quick Reference

| # | Document | Priority | Phase |
|---|----------|----------|-------|
| 1.1 | Product Requirements Document (PRD) | Required | Product |
| 1.2 | Wireframes & Design Specs | Required | Product |
| 1.3 | Technical Architecture Document | Required | Product |
| 1.4 | User Personas | Recommended | Product |
| 2.1 | README.md | Required | Engineering |
| 2.2 | API Documentation | Required | Engineering |
| 2.3 | Database Schema Doc | Required | Engineering |
| 2.4 | Code Style Guide | Recommended | Engineering |
| 2.5 | Deployment Runbook | Recommended | Engineering |
| 2.6 | QA & Test Plan | Recommended | Engineering |
| 3.1 | Terms of Service | Required | Legal |
| 3.2 | Privacy Policy | Required | Legal |
| 3.3 | Cookie Policy | Required | Legal |
| 3.4 | DMCA / IP Policy | Recommended | Legal |
| 3.5 | MSA / SaaS Agreement | Optional | Legal |
| 4.1 | Business Plan | Required | Business |
| 4.2 | Financial Model & Projections | Required | Business |
| 4.3 | Articles of Incorporation | Required | Business |
| 4.4 | Cap Table | Recommended | Business |
| 4.5 | Pricing Strategy Doc | Recommended | Business |
| 4.6 | Pitch Deck | Optional | Business |
| 5.1 | GTM Strategy | Required | Marketing |
| 5.2 | Competitive Analysis | Recommended | Marketing |
| 5.3 | Brand & Messaging Guide | Recommended | Marketing |
| 5.4 | Sales Playbook | Optional | Marketing |
| 6.1 | Security Policy | Required | Operations |
| 6.2 | Onboarding & Support Docs | Recommended | Operations |
| 6.3 | Vendor / Contractor Agreements | Recommended | Operations |
| 6.4 | SLA Document | Optional | Operations |

---

*Replace all `[bracketed placeholders]` before use.*
