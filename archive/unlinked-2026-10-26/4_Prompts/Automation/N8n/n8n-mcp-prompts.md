---
title: 🔄 n8n Workflow Automation MCP Server Prompts
section: Prompt_Library
category: Mcp_Servers
subcategory: N8n
tags: ["collections", "n8n", "workflow", "automation", "integration"]
created: 2026-03-25T21:32:00.000Z
source: My Prompt Library
---

# n8n Workflow Automation MCP Server Prompt Library

## 1. Create Simple Workflow
```
Create a new n8n workflow named "GitHub to Slack Notifier" with two nodes:
1. GitHub Trigger node listening for new issues
2. Slack node that posts a message to #dev-updates channel

Activate the workflow when done.
```

## 2. List Workflows
```
Show me all my n8n workflows, including their names, active/inactive status, and last execution time. Highlight any workflows that failed in the last 24 hours.
```

## 3. Execute Workflow
```
Manually execute the workflow named "Daily Report Generator". Wait for completion and show me the execution results, including any errors or output data.
```

## 4. Activate/Deactivate Workflow
```
Deactivate the workflow "Email Newsletter Sender" temporarily while I update the email template. I'll reactivate it later today.
```

## 5. Get Workflow Execution History
```
Retrieve the last 20 executions of the workflow "Customer Data Sync". For each execution, show me the status (success/error), start time, duration, and if it errored, show the error message.
```

## 6. Create Webhook Workflow
```
Create a workflow named "Form Submission Handler" that:
1. Starts with a Webhook node (POST endpoint)
2. Has a Function node to validate the incoming data (check for required fields: name, email, message)
3. If validation passes, send the data to a Google Sheet node
4. Send a confirmation email using Gmail node
5. Return a success response to the webhook caller

Provide me with the webhook URL once created.
```

## 7. Update Workflow Node
```
In the workflow "Data Pipeline", find the HTTP Request node and update its URL from "https://api-old.example.com/data" to "https://api-new.example.com/v2/data". Also add a header "API-Version: 2.0".
```

## 8. Clone Workflow
```
Create a copy of the workflow "Production Data Sync" and name it "Staging Data Sync". Update the database connection node in the cloned workflow to point to the staging database instead of production.
```

## 9. Delete Workflow
```
Delete the workflow named "Deprecated Import Process" and confirm the deletion. Make sure to archive its last 10 execution logs before deleting.
```

## 10. Complex: Multi-Step Data Pipeline
```
Create a comprehensive data processing workflow named "Customer Analytics Pipeline":

1. **Schedule Trigger**: Run daily at 2 AM
2. **PostgreSQL Node**: Query to fetch all customer records updated in the last 24 hours
3. **Function Node**: Transform and clean the data:
   - Remove any records with null email addresses
   - Normalize phone numbers to consistent format
   - Calculate customer lifetime value
4. **Split Node**: Split records into two paths:
   - High-value customers (LTV > $1000)
   - Regular customers
5. **For high-value customers path**:
   - Enrich data with external API (HTTP Request node to enrichment service)
   - Update CRM (Salesforce node)
   - Add to marketing campaign (Mailchimp node for VIP list)
6. **For regular customers path**:
   - Update basic CRM fields (Salesforce node)
   - Add to general newsletter list (Mailchimp node)
7. **Merge Node**: Combine both paths back together
8. **Google Sheets Node**: Log all processed records with timestamp
9. **Slack Node**: Post summary message with counts of high-value vs regular customers processed
10. **Error Handler**: If any node fails, send error details to #engineering-alerts Slack channel

Activate the workflow and schedule a test run for tomorrow at 2 AM.
```

## 11. Complex: E-commerce Order Processing
```
Build an order fulfillment automation workflow called "Order Processor":

1. **Webhook Trigger**: Receives order data from e-commerce platform
2. **Function Node**: Validate order data (check all required fields, verify product IDs exist)
3. **Inventory Check**: Query database to verify stock availability for all items
4. **If Statement Node**: Check if all items are in stock
   
   **If in stock**:
   5a. Update inventory levels (decrease stock counts)
   5b. Create shipping label via ShipStation API
   5c. Send order confirmation email to customer (Gmail node)
   5d. Post to #orders-fulfilled Slack channel
   5e. Update order status to "Processing" in database
   
   **If out of stock**:
   6a. Send notification to #inventory-alerts
   6b. Create backorder record in database
   6c. Send email to customer about delay
   6d. Update order status to "Awaiting Stock"

7. **Create Invoice**: Generate PDF invoice using template
8. **Store Invoice**: Upload to Google Drive in "Invoices/2026" folder
9. **Logging**: Record all steps in execution log table
10. **Return Response**: Send success/failure response back to webhook caller

Test the workflow with sample order data and show me the execution path.
```

## 12. Create Error Handling Workflow
```
Create a workflow named "Global Error Handler" that can be called by other workflows when they encounter errors:

1. Trigger: Webhook (receives error data from other workflows)
2. Parse error details (workflow name, node name, error message, timestamp)
3. Determine error severity (critical/warning) based on keywords
4. If critical:
   - Send PagerDuty alert
   - Post to #critical-alerts Slack with @channel mention
   - Send email to engineering-leads@company.com
5. If warning:
   - Log to error tracking system (Sentry)
   - Post to #errors Slack channel
6. Store error in error log database
7. Return acknowledgment

Provide the webhook URL so other workflows can call this error handler.
```

## 13. Complex: Social Media Cross-Posting
```
Create "Social Media Manager" workflow for content distribution:

1. **Google Sheets Trigger**: Monitor "Content Calendar" sheet for new rows
2. **Function Node**: Extract content details (post text, image URLs, scheduled time, target platforms)
3. **Schedule Node**: Wait until scheduled time to post
4. **Split Into Platforms**:
   - Twitter path: Post tweet with image, track tweet ID
   - LinkedIn path: Create LinkedIn post, track post ID
   - Facebook path: Post to Facebook page, track post ID
5. **Image Handling**:
   - Download images from provided URLs
   - Optimize images for each platform (different sizes)
   - Upload to each platform
6. **Function Node**: Collect all posted URLs and IDs
7. **Update Google Sheet**: Add posted URLs and IDs back to the row
8. **Slack Notification**: Post confirmation with links to all published posts
9. **Analytics Setup**: Schedule follow-up workflow to check engagement after 24 hours
10. **Error Handling**: If posting fails on any platform, retry 3 times, then notify #marketing-team

Set this up to process 5 scheduled posts per day.
```

## 14. API Integration Workflow
```
Create a workflow named "Multi-API Data Aggregator" that consolidates data from different sources:

1. **HTTP Request**: Fetch data from CRM API (customer info)
2. **HTTP Request**: Fetch data from Analytics API (website metrics)
3. **HTTP Request**: Fetch data from Support API (ticket data)
4. **Function Node**: Merge all data by customer ID
5. **Function Node**: Calculate derived metrics:
   - Customer engagement score
   - Support ticket resolution rate
   - Website activity level
6. **Filter Node**: Identify at-risk customers (low engagement + high tickets)
7. **Airtable Node**: Update customer health scores
8. **For at-risk customers**:
   - Create task in project management tool (Asana)
   - Assign to account manager
   - Send notification email
9. **Generate Report**: Create summary statistics
10. **Google Sheets**: Export full dataset to "Customer Health Dashboard"

Run this workflow weekly and show me the last execution results.
```

## 15. Complex: Content Moderation Pipeline
```
Build an automated content moderation workflow "Content Moderator":

1. **Webhook**: Receive user-generated content submissions
2. **Function Node**: Extract text and images from submission
3. **Text Analysis Path**:
   - Call OpenAI API to analyze text for:
     * Inappropriate language
     * Spam indicators  
     * Sentiment analysis
   - Assign text safety score (0-100)
4. **Image Analysis Path**:
   - Call Google Vision API to analyze images for:
     * Explicit content
     * Violent imagery
     * Brand safety
   - Assign image safety score (0-100)
5. **Merge Results**: Combine text and image analysis
6. **Decision Logic**:
   - If both scores > 90: Auto-approve, publish immediately
   - If scores 70-90: Flag for human review
   - If scores < 70: Auto-reject, send explanation to user
7. **For auto-approved**:
   - Publish to content database
   - Send confirmation to user
   - Post to public feed
8. **For flagged content**:
   - Add to moderation queue (Airtable)
   - Notify moderator team in Slack
   - Send "under review" message to user
9. **For rejected**:
   - Store in rejected content log
   - Send rejection email with specific reasons
   - Update user's content violation count
10. **Analytics**: Log all moderation decisions to BigQuery for reporting

Process 100 test submissions and show me the distribution (approved/flagged/rejected).
```

## 16. Database Sync Workflow
```
Create a "Database Sync Manager" workflow:

1. **Cron Trigger**: Run every hour
2. **PostgreSQL**: Fetch all records modified since last sync (track timestamp)
3. **Function Node**: Transform data format for target database
4. **MongoDB**: Upsert records (update if exists, insert if new)
5. **Compare Counts**: Verify source and destination record counts match
6. **If counts don't match**:
   - Identify missing records
   - Retry sync for missing records
   - Log discrepancies
7. **Update Sync Metadata**: Store last sync timestamp and record count
8. **Health Check**: Query both databases to verify data integrity
9. **Send Report**: Email daily summary of sync operations
10. **Monitoring**: Post metrics to monitoring dashboard (Datadog)

Show me the sync status and any errors from the last 24 hours.
```

## 17. Complex: Lead Scoring and Routing
```
Build "Lead Qualification Engine" workflow:

1. **Webhook**: Receive new lead data from website form
2. **Enrichment**:
   - Call Clearbit API to enrich company data
   - Call Hunter.io to verify email
   - Call LinkedIn API for professional info
3. **Scoring Function**:
   - Company size score (employees, revenue)
   - Industry fit score
   - Engagement level (email opens, downloads)
   - Budget indicators (from form data)
   - Calculate total lead score (0-100)
4. **Route Based on Score**:
   - Score 80-100 (Hot Lead):
     * Create high-priority Salesforce lead
     * Assign to senior sales rep
     * Schedule immediate follow-up call
     * Send Slack notification to sales manager
     * Send personalized welcome email
   - Score 50-79 (Warm Lead):
     * Create medium-priority Salesforce lead
     * Add to nurture email campaign
     * Assign to inside sales team
     * Schedule follow-up in 2 days
   - Score 0-49 (Cold Lead):
     * Add to general lead database
     * Enroll in educational email series
     * No immediate human follow-up
5. **Logging**: Store all scores and routing decisions
6. **Analytics**: Update lead source performance metrics
7. **Notification Summary**: Daily digest of lead quality by source

Test with 10 sample leads and show me the scoring breakdown.
```

## 18. File Processing Workflow
```
Create "Document Processor" workflow:

1. **Google Drive Trigger**: Monitor "Inbox" folder for new files
2. **File Type Detection**: Identify file type (PDF, Word, Excel, Image)
3. **Branching by Type**:
   
   **For PDFs**:
   - Extract text using OCR if needed
   - Classify document type (invoice, contract, report)
   - Move to appropriate folder
   - Extract metadata (dates, amounts, parties)
   - Store metadata in database
   
   **For Images**:
   - Run through Google Vision API
   - Extract text if present
   - Categorize image content
   - Generate thumbnails
   - Move to appropriate folder
   
   **For Spreadsheets**:
   - Parse data
   - Validate data quality
   - Import to database if validated
   - Flag for review if validation fails
   
   **For Word Docs**:
   - Convert to PDF
   - Extract metadata
   - Move to archive folder

4. **Update Index**: Add processed file to searchable index
5. **Notification**: Email summary of processed files to admin
6. **Cleanup**: Delete files from inbox after 30 days

Process the current inbox and show me categorization results.
```

## 19. Complex: Customer Journey Automation
```
Build "Customer Lifecycle Manager" workflow that manages the entire customer journey:

1. **Event Triggers**: Multiple sub-workflows for different events:
   - New signup
   - First purchase
   - Product activation
   - 30-day milestone
   - Subscription renewal

2. **For New Signup**:
   - Create CRM record
   - Send welcome email series (day 0, 1, 3, 7)
   - Create onboarding tasks
   - Track activation metrics
   
3. **For First Purchase**:
   - Tag customer segment
   - Send thank you email
   - Add to customer success nurture
   - Schedule check-in after 14 days
   
4. **For Product Activation**:
   - Mark milestone in CRM
   - Send tips and tricks email
   - Offer advanced features trial
   - Request feedback survey
   
5. **For 30-Day Milestone**:
   - Calculate usage metrics
   - Assess customer health score
   - If high score: Request review/referral
   - If low score: Assign to CSM for outreach
   
6. **For Subscription Renewal**:
   - Send renewal reminder (30, 7, 1 days before)
   - Offer renewal incentive
   - Track renewal decision
   - If churns: Exit survey and feedback

7. **Cross-Event Logic**:
   - Track customer across all touchpoints
   - Adjust messaging based on behavior
   - Calculate customer lifetime value
   - Identify upsell opportunities

8. **Reporting**: Weekly cohort analysis and journey analytics

Set this up and simulate a customer going through the full journey.
```

## 20. Complex: Incident Response Automation
```
Create "Incident Response Orchestrator" workflow:

1. **Multiple Triggers**:
   - Webhook from monitoring system (Datadog, New Relic)
   - Email from error@company.com
   - Slack command /incident

2. **Incident Intake**:
   - Parse incident details (severity, affected system, error message)
   - Auto-categorize (infrastructure, application, database, API)
   - Assign severity level (P0-P4)

3. **Immediate Response** (for P0-P1):
   - Create PagerDuty incident
   - Page on-call engineer
   - Create Slack incident channel #incident-[ID]
   - Start Zoom war room
   - Post initial status to status page

4. **Investigation**:
   - Query relevant logs (Splunk)
   - Fetch recent deployments (GitHub)
   - Check system metrics (Datadog)
   - Compile incident context document

5. **Communication**:
   - Post updates to incident channel every 15 min
   - Update status page
   - If customer-facing: Send email to affected customers
   - Notify stakeholders based on severity

6. **Resolution Workflow**:
   - When marked resolved:
     * Update status page
     * Close PagerDuty incident
     * Archive incident channel
     * Schedule post-mortem meeting
     * Create post-mortem template doc

7. **Post-Mortem**:
   - Gather timeline from Slack messages
   - Compile action items
   - Track follow-ups in project management
   - Send summary to engineering team

8. **Metrics Collection**:
   - Time to acknowledge
   - Time to resolve
   - Impact duration
   - Update incident database

Simulate a P1 incident and walk through the entire workflow.
```
