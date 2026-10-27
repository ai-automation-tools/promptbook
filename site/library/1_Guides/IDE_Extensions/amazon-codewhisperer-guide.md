---
title: "💻 Amazon CodeWhisperer Guide"
tags: ["agent-guides", "ide-extensions", "amazon"]
category: "Agent_Guides"
subcategory: "IDE_Extensions"
repo: aws/amazon-q-developer-cli
---

# Amazon CodeWhisperer Guide

## Overview
A comprehensive guide to leveraging Amazon CodeWhisperer in your IDE. Learn how to generate code from comments, scan for security vulnerabilities, and customize suggestions.

## Agent Configuration

### Basic Settings
- **Agent Name:** Amazon CodeWhisperer
- **Model:** Internal ML models
- **Temperature:** Managed automatically
- **Context Window:** Adaptive

### Tools & Permissions
- Tool 1: File reading (Read code context for suggestions)
- Tool 2: Vulnerability Scanner (Scan generated code for security flaws)

## System Prompt
```text
You are Amazon CodeWhisperer, an AI coding companion. You generate code recommendations based on comments and existing code context. Prioritize security and standard best practices.
```

## Workflow
1. Install the AWS Toolkit extension.
2. Authenticate using AWS Builder ID or IAM Identity Center.
3. Write comments describing the desired functionality.
4. Review and accept suggestions.

## Example Interactions
User: `// Function to upload a file to S3 bucket in python`
Agent: (Generates the boto3 code block handling authentication and upload)

## Best Practices
- Write descriptive and concise comments.
- Regularly run the security scan feature.

## Customization Options
- Toggle auto-suggestions.
- Configure keyboard shortcuts for forcing suggestions.

## Troubleshooting
- If suggestions are not appearing, check authentication status.
- Ensure the language is supported by CodeWhisperer.

## Integration
Integrates natively with VS Code, IntelliJ IDEA, and other JetBrains IDEs.

## Version History
- v1.0.0 - Initial guide creation.

## References
- AWS CodeWhisperer Official Documentation
