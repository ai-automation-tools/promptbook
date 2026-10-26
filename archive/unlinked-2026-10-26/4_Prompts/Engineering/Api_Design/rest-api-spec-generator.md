---
title: "📜 REST API Spec Generator"
tags: ["api", "openapi", "swagger", "rest", "backend"]
category: "Prompts"
subcategory: "Development/Api_Design"
---

# REST API Spec Generator

## Purpose
This prompt helps generate standard OpenAPI (Swagger) 3.0 specifications in YAML format from high-level business requirements or feature descriptions. It ensures that the API design is RESTful, consistent, and well-documented.

## Instructions

I want you to act as an expert API Architect.

When I describe a set of features or a domain model, you will generate a complete OpenAPI 3.0 specification for a RESTful API covering those requirements.

Your response should adhere to these principles:
- Use standard RESTful conventions (GET for retrieval, POST for creation, PUT/PATCH for updates, DELETE for removal).
- Include standard HTTP status codes (200, 201, 400, 401, 403, 404, 500).
- Group operations logically using `tags`.
- Define reusable data structures in the `components/schemas` section.
- Include query parameters for pagination (`limit`, `offset`) on list endpoints.
- Provide descriptive `summary` and `description` fields for every endpoint and schema property.
- Include security schemes (e.g., Bearer Auth) if authentication is implied.

Here are the requirements for the API:
```
[INSERT API REQUIREMENTS / DOMAIN DESCRIPTION HERE]
```

## Output Format
- Provide the output exclusively as a valid YAML code block representing the OpenAPI 3.0 specification.
- Ensure proper indentation.

## Example

**Input:**
```
I need an API to manage a library system.
Resources:
- Books (title, author, isbn, published_year)
Features:
- List books (with pagination)
- Get a single book by ID
- Add a new book
- Delete a book
```

**Output:**
```yaml
openapi: 3.0.0
info:
  title: Library Management API
  version: 1.0.0
  description: API for managing books in a library system.
servers:
  - url: https://api.library.example.com/v1
paths:
  /books:
    get:
      summary: List all books
      description: Retrieves a paginated list of books.
      tags:
        - Books
      parameters:
        - in: query
          name: limit
          schema:
            type: integer
            default: 20
          description: Number of items to return.
        - in: query
          name: offset
          schema:
            type: integer
            default: 0
          description: Number of items to skip.
      responses:
        '200':
          description: A list of books.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Book'
    post:
      summary: Add a new book
      tags:
        - Books
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookInput'
      responses:
        '201':
          description: Book created successfully.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '400':
          description: Invalid input.

  /books/{id}:
    get:
      summary: Get a book by ID
      tags:
        - Books
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: The book details.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '404':
          description: Book not found.
    delete:
      summary: Delete a book
      tags:
        - Books
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Book deleted successfully.
        '404':
          description: Book not found.

components:
  schemas:
    Book:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        author:
          type: string
        isbn:
          type: string
        published_year:
          type: integer
      required:
        - id
        - title
        - author
    BookInput:
      type: object
      properties:
        title:
          type: string
        author:
          type: string
        isbn:
          type: string
        published_year:
          type: integer
      required:
        - title
        - author
```

## Tips for Use
- Tip 1: Be specific about relationships (e.g., One-to-Many) so the AI structures nested objects or references correctly.
- Tip 2: Mention specific authentication methods (e.g., OAuth2, API Key) if required.
- Tip 3: You can pipe the output of this prompt directly into tools like Swagger UI or Redoc to visualize the API immediately.
