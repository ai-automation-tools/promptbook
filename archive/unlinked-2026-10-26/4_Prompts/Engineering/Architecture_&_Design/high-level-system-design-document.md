---
title: "📌 High Level System Design Document"
tags: ["collections", "engineering", "high", "level", "system"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt: High-Level System Design Document

## Goal
To generate a comprehensive high-level system design document for a software application based on a set of functional and non-functional requirements.

## Inputs
- **Application Description:** A brief overview of the application's purpose and primary function.
- **Functional Requirements:** A list of specific features and capabilities the system must have.
- **Non-Functional Requirements:** A list of constraints and quality attributes, such as performance, scalability, security, and reliability.
- **User Personas:** (Optional) A description of the target users.
- **Technology Stack:** (Optional) Any preferred or existing technologies to be used.

## Instructions
1.  **Analyze the requirements:** Thoroughly review the functional and non-functional requirements to understand the system's goals and constraints.
2.  **Propose an architecture:** Based on the requirements, propose a high-level architecture (e.g., microservices, monolithic, serverless).
3.  **Identify key components:** Break down the system into its major components (e.g., web server, application server, database, cache, message queue).
4.  **Data model:** Describe the high-level data model, including key entities and their relationships.
5.  **API design:** Define the main API endpoints and their request/response formats.
6.  **Scalability and performance:** Explain how the design will address scalability and performance requirements.
7.  **Security and reliability:** Describe the measures taken to ensure the system is secure and reliable.
8.  **Deployment and operations:** Briefly outline the deployment strategy and operational considerations.

## Output Format
The output should be a well-structured Markdown document with the following sections:
- **1. Overview:** A summary of the proposed system design.
- **2. Architecture:** A description of the chosen architectural pattern.
- **3. System Components:** A diagram and description of the key components.
- **4. Data Model:** A description of the data schema and relationships.
- **5. API Endpoints:** A list of major API endpoints with examples.
- **6. Scalability and Performance:** Strategies for scaling and performance.
- **7. Security and Reliability:** Security measures and reliability patterns.
- **8. Deployment and Operations:** The deployment and monitoring plan.

## Examples

### Example 1: Photo-Sharing Application

**Inputs:**
- **Application Description:** A mobile application for users to share photos with friends.
- **Functional Requirements:** User registration/login, photo uploads, news feed, friend requests.
- **Non-Functional Requirements:** High availability, low latency for image loading, ability to handle 1 million daily active users.

**Output:**
A detailed system design document outlining a microservices-based architecture with services for user management, photo storage, and social graph management. It would include details on using a CDN for image delivery, a NoSQL database for scalability, and asynchronous processing for tasks like generating thumbnails.

## What Not to Do
- **Do not provide low-level implementation details:** Avoid writing code or specifying minor configuration settings.
- **Do not make technology choices without justification:** Explain why a particular technology is being recommended.
- **Do not ignore non-functional requirements:** The design must explicitly address scalability, performance, security, and reliability.
- **Do not create a design that is overly complex:** Strive for simplicity and clarity.