---
title: "🤖 Table in PDF to CSV conversion"
tags: ["awesome-chatgpt", "table", "pdf", "csv", "conversion"]
category: "Awesome_ChatGPT"
subcategory: "General"
upstream:
  match: similar
  repo: f/awesome-chatgpt-prompts
  checked: 2026-10-26
---

# Table in PDF to CSV conversion

"Attached is an image of a table listing the model parameters for the ${insert_model_name} model (from [Insert Author/Paper Name]).
Please extract the data and convert it into a CSV code block that I can copy and save directly.
Requirements:
Use the first row as the header.
If cells are merged, repeat the value for each row to ensure the CSV is flat and processable.
Do not include units in the numeric columns (e.g., remove 'ms' or '%'), or keep them consistent in a separate column.
If any text is unclear due to image quality, mark it as '${unclear}' rather than guessing.
Ensure all fields containing commas are properly quoted."


---

Contributed by [@Bornduck](https://github.com/Bornduck) to [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).
