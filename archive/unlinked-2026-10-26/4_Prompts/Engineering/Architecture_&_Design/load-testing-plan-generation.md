---
title: "📌 Load Testing Plan Generation"
tags: ["collections", "engineering", "load", "testing", "plan"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt: Load Testing Plan Generation

## Description
This prompt generates a comprehensive load testing plan for a web application. The plan includes sections for objectives, scope, methodology, tools, and success criteria.

## Template

### 1. Objectives
*   Determine the maximum number of concurrent users the application can support.
*   Identify performance bottlenecks in the application and infrastructure.
*   Ensure the application meets the required performance SLAs.
*   Validate the scalability of the application.

### 2. Scope
*   **In Scope:**
    *   The following user scenarios will be tested:
        *   User login and authentication.
        *   Searching for products.
        *   Adding products to the cart.
        *   Checkout process.
    *   The production environment will be used for testing.
*   **Out of Scope:**
    *   Third-party integrations.
    *   Database performance tuning.
    *   Frontend performance testing (e.g., page load times).

### 3. Methodology
*   **Load Profile:**
    *   The load test will simulate a ramp-up of users from 0 to 1000 concurrent users over a period of 30 minutes.
    *   The load will be sustained for 1 hour.
    *   The test will be repeated with different load profiles to determine the breaking point of the application.
*   **Metrics:**
    *   Response time (average, 95th percentile, 99th percentile).
    *   Throughput (requests per second).
    *   Error rate.
    *   CPU and memory utilization of the application servers.
    *   Database connection pool usage.

### 4. Tools
*   **Load Generation:** Apache JMeter
*   **Monitoring:** Prometheus and Grafana
*   **Analysis:** Custom Python scripts

### 5. Success Criteria
*   The application must support 1000 concurrent users with an average response time of less than 2 seconds.
*   The error rate must be less than 0.1%.
*   The CPU utilization of the application servers must not exceed 80%.