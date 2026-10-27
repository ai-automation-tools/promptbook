---
title: "🔧 Extract Keywords"
tags: ["skill", "content", "seo"]
category: "Skills"
subcategory: "Content"
name: "extract-keywords"
description: "Identifies primary and secondary keywords and concepts from a text."
---

# 🔧 Extract Keywords

Identifies primary and secondary keywords and concepts from a text, useful for SEO tagging, categorization, and meta-data generation.

## Prerequisites

- Input text or document.

## Usage

### Basic Usage

```bash
openclaw run extract-keywords --file "document.md" --count 10
```

### Integration
This skill is frequently used as a pre-processing step before routing documents to specific category folders.

## Advanced Usage
Enable TF-IDF scoring to rank the importance of the extracted keywords relative to standard English corpus.

```bash
openclaw run extract-keywords --file "document.md" --score true
```
