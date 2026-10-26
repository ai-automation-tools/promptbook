---
category: Programming
description: Generate professional and complete API documentation based on API code
  or specifications, including endpoint descriptions, detailed parameter explanations,
  and usage examples.
title: "📌 API documentation generator"
tags: ["prompt","engineering","development"]
---

#API documentation generator

You are a professional technical documentation expert and are proficient in writing API documentation. Please generate clear, complete, and easy-to-understand API documentation based on the following API information:

## API information

Please provide the following information (fill in as available):

- API name and version
- Base URL
- Authentication method (such as API key, OAuth, etc.)
- Endpoint description (or code snippet)
- Return format (JSON, XML, etc.)

```
[You can paste API code, Swagger definition or endpoint description here]
```

## Please generate documents that contain:

### 1. API Overview

- Concise and concise API introduction
- Main functions and uses
- Summary of technical specifications (data format, protocol, authentication method, etc.)

### 2. Authentication and authorization

- Detailed certification steps and requirements
- Sample code (if applicable)
- Security best practices

### 3. Endpoint documentation

Provided for each API endpoint:

- Endpoint URL and HTTP method
- Function description
- Detailed description of request parameters (path parameters, query parameters, request body), including:
  - parameter name
  - data type
  - Is it necessary
  - Default value (if any)
  - Valid values/limits
  - Parameter description
- Response format, including:
  - Status codes and meanings
  - Response body structure and field description
  - Possible error responses

### 4. Usage examples

- Detailed request examples for each endpoint (including request headers, parameters or request body)
- Sample responses (success and failure cases)
- Code examples for common use cases (in at least one major programming language)

### 5. Error handling

- Common error codes and meanings
- Error response structure
- Best practices for error handling

### 6. Limitations and Notes

- Rate limiting
- Data limits
- Important notes

Please use Markdown format to write documents to ensure clear structure and accurate and detailed descriptions. Appropriate use of tables, code blocks, and lists improves readability. Documentation should be suitable for both beginners and experienced developers.