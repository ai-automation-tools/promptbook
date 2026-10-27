---
title: "🔧 Summarize Text"
tags: ["skill", "content", "analysis"]
category: "Skills"
subcategory: "Content"
name: "summarize-text"
description: "Condenses long-form text into key takeaways and an executive summary."
---

# 🔧 Summarize Text

Condenses long-form text into key takeaways and an executive summary, preserving the core message while removing fluff.

## Prerequisites

- A text file or direct text input containing at least 500 words.

## Usage

### Basic Usage

```bash
cat article.txt | openclaw run summarize-text --format bullet-points
```

### Configuration
- `max_length`: Set the maximum number of words for the summary (default: 200).
- `focus_area`: Instruct the summarizer to focus on a specific aspect (e.g., "financial impact").

## Example Output
- **Executive Summary**: A two-sentence overview.
- **Key Takeaways**: 3-5 bullet points highlighting the most important facts.
