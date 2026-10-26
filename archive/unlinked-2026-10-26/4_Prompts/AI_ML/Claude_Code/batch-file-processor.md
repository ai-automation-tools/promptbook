---
title: "📌 Batch File Processor"
tags: ["files", "batch", "transformation", "automation", "read", "write"]
category: "File_and_Code_Operations"
subcategory: "Batch_Processing"
---

Apply a transformation to many files in parallel.

## Prompt

```
Find all [FILE_PATTERN] files in [DIRECTORY]. For each file, [TRANSFORMATION]. Use Read and Write tools. Process them in parallel where possible. Report a summary of changes made.
```

## Usage Notes

- Replace `[FILE_PATTERN]` with a glob like `*.ts`, `*.md`, etc.
- Replace `[DIRECTORY]` with the target path
- Replace `[TRANSFORMATION]` with the operation (e.g., "add a header comment", "convert to ESM imports")
- Request a summary report to verify changes
