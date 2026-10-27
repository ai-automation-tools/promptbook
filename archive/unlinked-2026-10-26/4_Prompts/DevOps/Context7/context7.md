---
title: "Context7 Prompt Pack (Mike)"
tags: ["mcp-servers", "tools", "context7"]
category: "MCP_Servers"
subcategory: "Tools"
---
# Context7 Prompt Pack (Mike)  
**Targets:** SailPoint IdentityIQ (IIQ), Python, React, PowerShell, + misc scripting  
**Use:** Copy a prompt, replace the `[PLACEHOLDERS]`, run it with Context7.

---

## How to use these prompts
- Replace:
  - `[PRODUCT/LIB]` with *SailPoint IdentityIQ*, *React*, *Python*, *PowerShell*, etc.
  - `[GOAL]` with what youâ€™re trying to do
  - `[VERSION]` if you know it (ex: IIQ 8.x / 8.3)
  - `[CODE/ERROR]` with your snippet or error output
- When you want *only verified info*, add: **â€œUse Context7 sources only.â€**
- When you want *exact output structure*, add: **â€œOutput exactly in the format requested.â€**

---

# 1) SailPoint IdentityIQ (IIQ) Prompts

## 1.1 Admin / Configuration
- **â€œUsing Context7 sources only: explain how to configure `[FEATURE]` in SailPoint IdentityIQ `[VERSION]`. Include admin UI path + required objects/settings.â€**
- **â€œShow the correct configuration steps to enable `[CONNECTOR / APPLICATION TYPE]` in IdentityIQ. Include required attributes and common failures.â€**
- **â€œWhat are best practices for IdentityIQ aggregation scheduling, deltas, and avoiding performance impact?â€**

## 1.2 Lifecycle Manager (LCM)
- **â€œUsing Context7, show how to implement an LCM workflow for `[JOINER/MOVER/LEAVER]`. Include example workflow steps and object model references.â€**
- **â€œHow do approvals work in IIQ LCM for `[ACCESS REQUEST / ROLE REQUEST]`? Provide an example approval chain design.â€**
- **â€œExplain the difference between IdentityIQ Access Request vs Role Request vs Entitlement Request. Give examples.â€**

## 1.3 Identity / Account Aggregation
- **â€œUsing Context7: explain how IdentityIQ correlates accounts to identities. Include correlation rules, identity attributes, and common mis-correlation fixes.â€**
- **â€œHow do you troubleshoot account aggregation failures in IIQ? Provide a step-by-step checklist.â€**
- **â€œShow the correct way to build a correlation rule for `[SOURCE]` (ex: AD, AzureAD, Workday). Provide sample logic and pitfalls.â€**

## 1.4 Roles / Entitlements / Policies
- **â€œUsing Context7: describe best practices for role modeling in IdentityIQ (IT roles vs business roles). Include anti-patterns.â€**
- **â€œHow do you design and validate Separation of Duties (SoD) policies in IIQ? Provide example policy structures.â€**
- **â€œExplain identity risk scoring in IdentityIQ and what inputs affect it.â€**

## 1.5 Rules (Beanshell / Java-ish logic)
- **â€œUsing Context7: show a safe example of a SailPoint IdentityIQ rule for `[RULE TYPE]` (ex: Correlation, BuildMap, Customization). Include required imports and object usage.â€**
- **â€œGive a minimal working example of an IdentityIQ rule that reads an identity attribute and sets a provisioning plan value.â€**
- **â€œExplain how IIQ rules execute (context objects available, performance impacts, logging) and how to debug them.â€**

## 1.6 Workflows
- **â€œUsing Context7: show an IdentityIQ workflow example for `[USE CASE]` including transitions and approval steps.â€**
- **â€œHow do you pass variables between workflow steps in IIQ? Provide example XML and explanation.â€**
- **â€œExplain common workflow failures (stuck approvals, timeouts, missing variables) and remediation steps.â€**

## 1.7 Provisioning / Connectors
- **â€œUsing Context7: explain how provisioning works in IIQ (provisioning plans, identity refresh, request objects). Provide a clean mental model.â€**
- **â€œShow an example of provisioning an entitlement to `[TARGET SYSTEM]` from IIQ, including plan construction and error handling.â€**
- **â€œWhat are the recommended connector settings for performance and reliability for `[TARGET]`?â€**

## 1.8 Reports / Audit / Compliance
- **â€œUsing Context7: list the audit events captured by IdentityIQ and how to query/report on `[EVENT TYPE]`.â€**
- **â€œHow do certifications work in IIQ? Provide a certification campaign design checklist.â€**
- **â€œShow best practices for access reviews/certifications in IIQ for SOX/SOC2 alignment.â€**

## 1.9 Troubleshooting / Operations
- **â€œUsing Context7: give me a structured troubleshooting runbook for `[IIQ ISSUE]` (aggregation failures / stuck tasks / slow UI).â€**
- **â€œWhere do logs show `[PROBLEM]` in IdentityIQ and how do I enable debug logging safely?â€**
- **â€œWhat are the common causes of task failures in IIQ and what data should be captured for root cause analysis?â€**

---

# 2) Python Prompts (Automation + IAM-friendly)

## 2.1 API Calls / SDK Usage
- **â€œUsing Context7 docs: show the correct way to call `[API]` in Python using `[LIBRARY]` (requests/httpx). Include retries, timeouts, and safe logging.â€**
- **â€œGive a minimal example of OAuth2 client credentials flow in Python for `[IDP]` (Azure AD/Okta/etc).â€**

## 2.2 Identity + Directory Automation
- **â€œUsing Context7: show a Python example to read users/groups from `[DIRECTORY]` (AD/AzureAD/Google) and output JSON/CSV.â€**
- **â€œProvide a Python script pattern to reconcile HR source `[SYSTEM]` to IAM target `[SYSTEM]` with diff logic.â€**

## 2.3 Secure Coding Defaults
- **â€œUsing Context7: give secure defaults for TLS verification, secrets management, and logging redaction in Python.â€**
- **â€œShow a safe way to store and rotate API credentials for this script: `[USE CASE]`.â€**

## 2.4 Packaging + CLI Tools
- **â€œUsing Context7: create a Python CLI tool design (argparse/typer) for `[TASK]` with examples.â€**
- **â€œShow how to structure a Python project for automation: config, logging, retries, tests.â€**

## 2.5 Debug / Fix
- **â€œUsing Context7: debug this Python error and provide a corrected minimal example: `[CODE/ERROR]`.â€**
- **â€œExplain the likely causes of this exception and how to harden the code: `[TRACEBACK]`.â€**

---

# 3) React Prompts (UI + IAM Dashboards)

## 3.1 Project Setup / Patterns
- **â€œUsing Context7 sources only: show the recommended setup for a React app using `[TOOLING]` (Vite/Next.js). Include folder structure.â€**
- **â€œGive best practices for React state management for a dashboard that shows identities, entitlements, and approvals.â€**

## 3.2 Components + Data Fetching
- **â€œUsing Context7: show a React example that fetches from `[API]` with proper loading/error states and abort handling.â€**
- **â€œProvide an example table UI for identities/entitlements with pagination, search, and filters.â€**

## 3.3 Auth / Security
- **â€œUsing Context7: show how to implement authentication in React with `[OIDC/OAuth2 provider]`. Include secure token handling guidance.â€**
- **â€œWhat are common React security pitfalls (XSS, token storage) and how do I avoid them?â€**

## 3.4 Debug / Fix
- **â€œUsing Context7: fix this React error and explain the root cause: `[ERROR]`.â€**
- **â€œOptimize this React component for performance and avoid unnecessary renders: `[CODE]`.â€**

---

# 4) PowerShell Prompts (Enterprise + IAM Ops)

## 4.1 AD / Windows IAM Automation
- **â€œUsing Context7: show PowerShell examples for enumerating AD users/groups and exporting to CSV securely.â€**
- **â€œProvide a PowerShell script template to disable users, remove from groups, and log actions for audit.â€**

## 4.2 Graph / Cloud Automation
- **â€œUsing Context7: show how to call Microsoft Graph from PowerShell for `[TASK]` using modern auth.â€**
- **â€œGive me a robust PowerShell pattern for API pagination, throttling handling, and retries.â€**

## 4.3 Security + Logging
- **â€œUsing Context7: show best practices for secure credential handling in PowerShell (no plaintext).â€**
- **â€œHow should I structure logging so the script is audit-friendly and doesnâ€™t leak secrets?â€**

## 4.4 Troubleshooting
- **â€œUsing Context7: debug this PowerShell error and provide corrected code: `[ERROR/CODE]`.â€**
- **â€œExplain what this output means and how to remediate: `[OUTPUT]`.â€**

---

# 5) Other Scripting Languages (Bash, JS/Node, Go, etc.)

## 5.1 Bash
- **â€œUsing Context7: write a Bash script for `[TASK]` with strict mode, safe error handling, and clean logging.â€**
- **â€œShow secure ways to handle secrets in Bash without exposing them in process lists.â€**

## 5.2 Node.js / JavaScript
- **â€œUsing Context7: show a Node.js script to call `[API]` with retries, timeouts, and structured logging.â€**
- **â€œProvide an example of validating incoming JSON payloads safely (schema validation) in Node.â€**

## 5.3 Go
- **â€œUsing Context7: create a Go CLI tool skeleton for `[TASK]` with config + logging + retries.â€**
- **â€œShow an example of OAuth2 client credentials flow in Go for `[IDP]`.â€**

## 5.4 SQL
- **â€œUsing Context7: write SQL queries to detect orphaned accounts, duplicate identities, and risky entitlements from `[TABLES/SCHEMA]`.â€**
- **â€œGive a safe query pattern for audit reporting with time-bounded filtering and least-privilege assumptions.â€**

---

# 6) Universal â€œMake It Production-Readyâ€ Prompts

- **â€œUsing Context7 sources only: rewrite this into production-ready code with secure defaults and explain key changes: `[CODE]`.â€**
- **â€œAdd structured logging, input validation, and safe error handling to this script: `[CODE]`.â€**
- **â€œConvert this POC into an enterprise-safe version: retries, backoff, timeouts, secrets handling: `[CODE]`.â€**
- **â€œGenerate a runbook + troubleshooting checklist for this automation: `[SCRIPT PURPOSE]`.â€**

---

# 7) Output Format Controllers (Highly Recommended)

## 7.1 â€œChecklist + Codeâ€
- **â€œUsing Context7: Output exactly: (1) checklist, (2) minimal code, (3) common pitfalls, (4) validation steps.â€**

## 7.2 â€œOnly Codeâ€
- **â€œUsing Context7 sources only: output only the final code block. No explanation.â€**

## 7.3 â€œExplain Like Iâ€™m Busyâ€
- **â€œUsing Context7: give me the shortest correct answer + one example.â€**

---

# 8) Quick Copy Templates

## 8.1 Debug Template
**Prompt:**  
â€œUse Context7 sources only. Debug this issue.  
- Goal: `[GOAL]`  
- Error/output:  
`[PASTE ERROR]`  
- Current code:  
```  
[PASTE CODE]  
```  
Return: root cause + corrected code + prevention checklist.â€

## 8.2 Build Template
**Prompt:**  
â€œUse Context7 sources only. Build `[THING]` for `[GOAL]` using `[LIB]`.  
Constraints: `[ENV / SECURITY / PERFORMANCE]`  
Output: minimal example + best practices + pitfalls.â€

---

## If you want, I can also generate:
- a **IIQ-specific runbook prompt pack** (rules/workflows/provisioning deep dive)
- a **Cloud IAM prompt pack** (Azure AD / Entra, Okta, Ping, Duo)
- a **â€œContext7 prompt style guideâ€** (how to get consistent citations + code quality)

