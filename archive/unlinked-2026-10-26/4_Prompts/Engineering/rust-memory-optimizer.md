---
title: "🦀 Rust Memory Optimizer"
tags: ["rust", "memory", "optimization", "performance"]
category: "Prompts"
subcategory: "Engineering"
---

# Rust Memory Optimizer

## Purpose
This prompt helps developers identify and resolve memory inefficiencies in Rust code, focusing on avoiding unnecessary allocations, utilizing borrowing effectively, and optimizing data structures.

## Instructions
1. Provide the Rust code snippet that requires optimization.
2. Describe the current context, expected performance, and any identified bottlenecks.
3. State constraints (e.g., "must use stable Rust", "cannot change the public API").

## Output Format
- **Analysis:** Identify current memory allocations and inefficiencies.
- **Optimized Code:** The improved Rust code snippet.
- **Explanation:** Detailed explanation of the changes made and why they improve memory usage (e.g., replacing `String` with `&str`, using `Cow`, pre-allocating vectors).

## Example

**User Prompt:**
"Optimize this Rust function. It processes a large list of strings and filters them based on a prefix, but it seems to be allocating too much memory.
```rust
fn filter_prefixes(data: Vec<String>, prefix: &str) -> Vec<String> {
    let mut result = Vec::new();
    for item in data {
        if item.starts_with(prefix) {
            result.push(item.clone());
        }
    }
    result
}
```"

**AI Response:**
**Analysis:**
The current code takes ownership of a `Vec<String>`, iterates over it, and then explicitly `.clone()`s the items that match, causing unnecessary memory allocation.

**Optimized Code:**
```rust
fn filter_prefixes<'a>(data: &'a [String], prefix: &str) -> Vec<&'a str> {
    data.iter()
        .filter(|s| s.starts_with(prefix))
        .map(|s| s.as_str())
        .collect()
}
```

**Explanation:**
- Changed the input to take a slice `&[String]` instead of taking ownership, avoiding moving the whole vector if it's needed elsewhere.
- The return type is changed to `Vec<&'a str>`. Instead of cloning the strings, we return a vector of string slices (`&str`) that borrow from the original data. This eliminates the allocation of new strings entirely.
- Used idiomatic iterator methods (`filter` and `map`) which are often optimized better by the compiler than manual loops.

## Tips for Use
- If modifying the return type to use references isn't possible, ask the AI to optimize using `into_iter()` to consume the input vector without cloning.

## Related Prompts
- Rust Concurrency Expert
- C++ Memory Leak Analyzer
