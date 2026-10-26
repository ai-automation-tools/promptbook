---
title: "📌 RAG/KB Ingestion Prompt"
tags:
- collections
- ai_agents
- rag
- ingestion
- prompt
category: Collections
subcategory: AI_Agents
---
# RAG/KB Ingestion Prompt

## 1. Objective

This prompt is designed to analyze a collection of documents and generate a comprehensive retrieval plan. This plan will be used to ingest the documents into a Retrieval Augmented Generation (RAG) or Knowledge Base (KB) system.

## 2. The Prompt

You are an expert in data ingestion and retrieval systems. Your task is to analyze the provided set of documents and generate a detailed retrieval plan. The plan should include the following components:

**Input:**
*   A set of documents (e.g., text files, PDFs, etc.).
*   A brief description of the domain and intended use case of the RAG/KB system.

**Output:**
A JSON object containing the following keys:

*   `chunking_strategy`:
    *   `strategy`: (e.g., "fixed_size", "recursive_character_text_splitter", "semantic")
    *   `parameters`: A dictionary of parameters for the chosen strategy (e.g., `chunk_size`, `chunk_overlap`).
*   `metadata_schema`:
    *   A JSON schema defining the metadata to be extracted from each chunk. This should include fields that will be useful for filtering and retrieval.
*   `freshness_rules`:
    *   `update_frequency`: (e.g., "daily", "weekly", "on_change")
    *   `versioning_strategy`: (e.g., "overwrite", "new_version")
*   `test_queries`:
    *   An array of at least 5 representative queries that can be used to test the retrieval quality of the ingested documents. These queries should cover a range of topics and complexities.

**Example:**

**Input:**
*   **Documents:** A collection of technical support articles for a software product.
*   **Domain:** Customer support for "Product X". The RAG system will be used by support agents to quickly find answers to customer questions.

**Output:**
```json
{
  "chunking_strategy": {
    "strategy": "recursive_character_text_splitter",
    "parameters": {
      "chunk_size": 1000,
      "chunk_overlap": 200
    }
  },
  "metadata_schema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "The title of the support article."
      },
      "product_version": {
        "type": "string",
        "description": "The version of the product the article applies to."
      },
      "last_updated": {
        "type": "string",
        "format": "date-time",
        "description": "The date the article was last updated."
      }
    },
    "required": ["title", "product_version", "last_updated"]
  },
  "freshness_rules": {
    "update_frequency": "weekly",
    "versioning_strategy": "new_version"
  },
  "test_queries": [
    "How do I reset my password?",
    "What are the system requirements for version 3.2?",
    "I'm getting error code 503, what should I do?",
    "How do I configure the new 'Super-Widget' feature?",
    "What is the process for upgrading from version 2.x to 3.x?"
  ]
}
```