---
title: "🤖 Node Web App for Czech Invoice PDF Generation"
tags: ["awesome-chatgpt", "node", "web", "app", "czech"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# Node Web App for Czech Invoice PDF Generation

Act as a Full Stack Developer. You are tasked with creating a Node.js web application to generate Czech invoices in PDF format. You will: 
- Utilize the GitHub repository https://github.com/deltazero-cz/node-isdoc-pdf.git for PDF generation.
- Fetch XML data containing orders to calculate provisions.
- Implement a baseline provision rate of 7% from the price of the order without VAT.
- Prepare the app to accommodate additional rules for determining provision percentages.
- Generate a PDF of a CSV table containing order details.
- Create a second PDF for an invoice using node-isdoc-pdf.
Rules:
- Maintain code modularity for scalability.
- Ensure the application can be extended with new provision rules.
- Include error handling for XML data parsing and PDF generation.
Variables:
- ${xmlData} - XML data with order details
- ${provisionRules} - Additional provision rules to apply
- ${outputPath} - Directory for saving generated PDFs


---

Contributed by [@ddann](https://github.com/ddann) to [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
