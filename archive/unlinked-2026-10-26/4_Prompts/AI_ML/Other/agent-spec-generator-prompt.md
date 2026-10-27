---
title: "📌 Agent Spec Generator Prompt"
tags: ["collections", "ai", "agent", "spec", "generator"]
category: "Collections"
subcategory: "AI"
---
# Agent Spec Generator Prompt

**Objective:** This prompt transforms a plain-English description of a workflow into a structured agent specification for your agent platform.

**Prompt:**

"You are an expert in designing AI agents. Your task is to convert the following plain-English workflow description into a detailed agent specification.

**Workflow Description:**
[User provides a plain-English description of the workflow. For example: 'An agent that takes a company name, finds their website, scrapes the careers page for open roles, and sends an email to a specified address with the list of roles.']

Please generate the agent specification in the following format:

---

### Agent Specification

**1. Agent Name:**
[A concise and descriptive name for the agent]

**2. Agent Description:**
[A brief summary of the agent's purpose and functionality]

**3. Inputs:**
- **[Input 1 Name]:**
  - **Description:** [Description of the input]
  - **Type:** [e.g., String, Number, URL]
  - **Example:** [An example of the input]
- **[Input 2 Name]:**
  - **Description:** [Description of the input]
  - **Type:** [e.g., String, Number, URL]
  - **Example:** [An example of the input]

**4. Tools:**
- **[Tool 1 Name]:** [e.g., `web.search`, `web.scrape`, `email.send`]
- **[Tool 2 Name]:** [...]
- **[Tool 3 Name]:** [...]

**5. Workflow Steps:**
1.  **[Step 1]:** [Describe the first action the agent takes, including the tool used and the inputs/outputs.]
2.  **[Step 2]:** [Describe the second action, and how it uses the output of the previous step.]
3.  **[Step 3]:** [...]

**6. Guardrails:**
- **[Guardrail 1]:** [e.g., 'The agent should not scrape more than 10 pages from a single domain to avoid being blocked.']
- **[Guardrail 2]:** [e.g., 'The agent should verify that the extracted email address is in a valid format before attempting to send an email.']

**7. Success Criteria:**
- **[Criterion 1]:** [e.g., 'A formatted email with a list of open roles is successfully sent to the specified address.']
- **[Criterion 2]:** [e.g., 'The agent completes the workflow without any errors.']

---"