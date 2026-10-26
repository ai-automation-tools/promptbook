---
title: "💻 Cohere CLI Guide"
tags: ["agent-guides", "cohere", "api"]
category: "Agent_Guides"
subcategory: "Cohere"
repo: cohere-ai/cohere-python
---

# Cohere CLI Guide

## Overview
Cohere provides API access to enterprise-grade large language models.

## Agent Configuration
### Basic Settings
- **Agent Name:** Cohere
- **Model:** command-r
### Tools & Permissions
- Tool 1: web search (Read)

## System Prompt
### Core Principles
- Enterprise focused
### Capabilities
- Text generation
### Constraints
- DO NOT hallucinate facts
### Response Format
- Use structured markdown
### Error Handling
When encountering ambiguous requests, ask for clarification.

## Workflow
### Initialization
1. Load API key
### Standard Operating Procedure
#### Phase 1: Query Analysis
- Understand intent
#### Phase 2: Execution
- Run tools
#### Phase 3: Formatting
- Add citations
### Decision Trees
- Action: Perform web search

## Example Interactions
### Example 1: Factual Query
### Example 2: Data Analysis

## Best Practices
### For Users
- Provide clear context
### For Developers
- Use system prompts

## Customization Options
### Variables
- `COHERE_API_KEY`: API Key
### Extend Functionality
- Add new endpoints

## Troubleshooting
### Common Issues
- Rate limits

## Integration
### With Other Agents
- LangChain Agent
### With External Tools
- Vector DB

## Version History
- v1.0

## References
- Cohere Documentation
