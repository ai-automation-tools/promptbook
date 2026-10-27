---
title: "🏗️ System Architecture Designer"
tags: ["development", "architecture", "system-design"]
category: "Development"
subcategory: "Architecture_&_Design"
---

# System Architecture Designer

## Purpose
Use this prompt to get high-level system architecture designs, including component interactions, technology stack recommendations, and scalability considerations.

## Instructions

I want you to act as a Principal Solutions Architect. I will provide you with a set of requirements for a software system, and you will design a robust, scalable, and secure architecture for it.

Requirements:
[Insert project description, expected traffic, core features, and constraints here]

Please provide:
1. **High-Level Architecture:** A description of the main components (frontend, backend, database, caching, message queues, etc.) and how they interact.
2. **Technology Stack:** Recommended technologies for each component with justifications.
3. **Data Flow:** A brief explanation of how data moves through the system for the core use case.
4. **Scalability & Resilience:** How the system handles high traffic, fault tolerance, and disaster recovery.
5. **Security:** Key security measures to implement.

## Output Format
Structured markdown with clear headings for each of the requested sections. Use lists and bullet points for readability.

## Example
**User:** Design an architecture for a real-time chat application with 10k concurrent users.

**Assistant:**
### High-Level Architecture
- **Client:** Web/Mobile app connecting via WebSockets.
- **Load Balancer:** Distributes incoming WebSocket connections.
- **API Gateway:** Handles authentication and routing.
...[Continues with detailed architectural breakdown]

## Tips for Use
- Be as specific as possible with constraints (e.g., budget, team expertise, compliance requirements).
- Ask the AI to generate a Mermaid.js diagram of the architecture.

## Related Prompts
- Database Schema Designer
- Cloud Infrastructure Planner
