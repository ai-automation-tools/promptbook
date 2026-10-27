---
title: "🛠️ CSV Data Cleaner"
tags: ["skills", "data", "cleaning"]
category: "Skills"
subcategory: "Data"
---

# CSV Data Cleaner

## Description
A skill that provides instructions on how to parse, clean, and standardize CSV data using Python/Pandas.

## Prerequisites
- Basic Python and Pandas knowledge.

## Implementation Guidelines

### Step 1: Load Data
Use `pandas.read_csv()` to load the data.

### Step 2: Handle Missing Values
Identify nulls (`df.isnull().sum()`) and decide whether to drop or impute them.

### Step 3: Standardize Formats
Convert date strings to datetime objects, lowercase string columns, etc.

## Code Example

```python
import pandas as pd

def clean_csv(filepath):
    df = pd.read_csv(filepath)
    # Fill missing values
    df.fillna({'status': 'unknown'}, inplace=True)
    # Standardize dates
    df['date'] = pd.to_datetime(df['date'])
    return df
```

## Usage Constraints
- Very large CSVs might require chunking to avoid memory issues.

## Verification Steps
1. Check `df.info()` after cleaning to verify data types.
