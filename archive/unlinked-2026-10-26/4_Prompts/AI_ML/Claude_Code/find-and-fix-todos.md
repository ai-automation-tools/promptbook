---
title: "📌 Find And Fix All Todos"
tags: ["todo", "fixme", "debt", "cleanup", "code-quality"]
category: "File_and_Code_Operations"
subcategory: "Code_Cleanup"
---

Resolve all TODO/FIXME/HACK comments across the codebase.

## Prompt

```
Search the entire codebase for TODO, FIXME, HACK, and XXX comments. List them all first. Then for each one: assess complexity, implement a fix if straightforward, or leave a detailed note if it requires design decisions. Report what was fixed vs. deferred.
```

## Usage Notes

- The list-first step gives you a chance to prioritize before changes are made
- Straightforward fixes get implemented; complex ones get annotated
- Ask for a fix/defer summary at the end
- Good to run before a release or sprint cleanup
