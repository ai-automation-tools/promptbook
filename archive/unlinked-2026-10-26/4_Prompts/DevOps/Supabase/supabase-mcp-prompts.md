---
title: 🗄️ Supabase MCP Server Prompts
section: Prompt_Library
category: Mcp_Servers
subcategory: Supabase
tags: ["featured", "collections", "supabase", "database", "postgres", "auth", "storage"]
created: 2026-03-25T21:32:00.000Z
source: My Prompt Library
---

# Supabase MCP Server Prompt Library

## 1. Query Table Data
```
Query all records from the "users" table in my Supabase database and return the first 50 results ordered by created_at descending. Include columns: id, email, username, created_at.
```

## 2. Insert Record
```
Insert a new record into the "posts" table with the following data:
- title: "Getting Started with Supabase"
- content: "Supabase is an open-source Firebase alternative..."
- author_id: "user123"
- status: "published"
- created_at: current timestamp

Return the newly created record with its generated ID.
```

## 3. Update Record
```
Update the "users" table record where id = 'abc123' and set:
- last_login: current timestamp
- login_count: increment by 1
- is_active: true

Return the updated record.
```

## 4. Delete Record
```
Delete the record from the "comments" table where id = 'comment456' and the author_id matches the current user. Confirm deletion and return the number of rows affected.
```

## 5. Filter and Search
```
Query the "products" table where:
- category = 'electronics'
- price is between $100 and $500
- in_stock = true

Sort results by price ascending and return the top 20 matches with columns: name, price, description, image_url.
```

## 6. Join Tables
```
Query data from the "orders" table and join with "customers" table on customer_id. Return:
- order.id
- order.total_amount
- order.created_at
- customer.name
- customer.email

Filter for orders created in the last 30 days and total_amount > $1000. Sort by total_amount descending.
```

## 7. Aggregate Data
```
From the "sales" table, calculate and return:
- Total revenue (sum of amount)
- Average order value
- Number of transactions
- Minimum and maximum order amounts

Group by month for the current year and return results as a monthly breakdown.
```

## 8. Create Storage Bucket
```
Create a new storage bucket named "user-avatars" with the following settings:
- Public: false (requires authentication)
- File size limit: 5MB
- Allowed file types: jpg, png, webp

Return the bucket configuration details.
```

## 9. Upload File to Storage
```
Upload the file "profile-picture.jpg" from my local system to the Supabase storage bucket "user-avatars" under the path "users/user123/avatar.jpg". Set the file to be publicly accessible and return the public URL.
```

## 10. Complex: User Registration Flow
```
Implement a complete user registration workflow:

1. **Create Auth User**:
   - Email: newuser@example.com
   - Password: (securely generated)
   - Send verification email

2. **Create User Profile**:
   - Insert into "profiles" table:
     * user_id: (from auth user)
     * username: "newuser"
     * full_name: "John Doe"
     * created_at: current timestamp
     * onboarding_completed: false

3. **Initialize User Settings**:
   - Insert into "user_settings" table with defaults:
     * notifications_enabled: true
     * theme: "light"
     * language: "en"

4. **Create Welcome Notification**:
   - Insert into "notifications" table:
     * user_id: (new user)
     * type: "welcome"
     * message: "Welcome to our platform!"
     * read: false

5. **Assign Default Role**:
   - Insert into "user_roles" table:
     * user_id: (new user)
     * role: "member"

6. **Generate API Key**:
   - Create entry in "api_keys" table for the user
   - Generate secure random key

7. **Trigger Welcome Email**:
   - Call edge function to send welcome email

Return complete user profile with all created records.
```

## 11. Implement Real-time Subscription
```
Set up a real-time subscription to monitor changes in the "messages" table where:
- room_id = 'room123'
- created_at > (last 24 hours)

Listen for INSERT events and when a new message arrives:
1. Fetch the message details including sender info
2. Check if message mentions current user (@username)
3. If mentioned, create a notification
4. Return the new message data

Show me how to set this up and provide a sample message notification.
```

## 12. Complex: E-commerce Order Processing
```
Process a new e-commerce order with the following workflow:

1. **Validate Inventory**:
   - Query "products" table for each item in order
   - Check if quantity_available >= order_quantity
   - If insufficient, return error with out-of-stock items

2. **Create Order**:
   - Insert into "orders" table:
     * customer_id
     * total_amount
     * status: "pending"
     * payment_intent_id
     * created_at: current timestamp

3. **Create Order Items**:
   - For each item, insert into "order_items":
     * order_id (from step 2)
     * product_id
     * quantity
     * unit_price
     * subtotal

4. **Update Inventory**:
   - For each product, decrement quantity_available by order_quantity
   - Set "low_stock" flag if quantity_available < 10

5. **Create Invoice**:
   - Generate invoice record in "invoices" table
   - Calculate tax, shipping, total

6. **Trigger Fulfillment**:
   - Insert into "fulfillment_queue":
     * order_id
     * status: "pending"
     * priority: based on shipping method

7. **Send Confirmations**:
   - Insert order confirmation to "notifications"
   - Call edge function to send email

8. **Update Customer Stats**:
   - Update "customers" table:
     * total_orders: increment
     * total_spent: add order amount
     * last_order_date: current timestamp

Return complete order summary with all created records and updated inventory status.
```

## 13. Implement Row Level Security (RLS)
```
Set up Row Level Security policies for the "documents" table:

1. Create policy "Users can view their own documents":
   - SELECT permission
   - USING (auth.uid() = owner_id)

2. Create policy "Users can insert their own documents":
   - INSERT permission
   - WITH CHECK (auth.uid() = owner_id)

3. Create policy "Users can update their own documents":
   - UPDATE permission
   - USING (auth.uid() = owner_id)

4. Create policy "Users can delete their own documents":
   - DELETE permission
   - USING (auth.uid() = owner_id)

5. Create policy "Shared documents are viewable":
   - SELECT permission
   - USING (auth.uid() IN (SELECT user_id FROM document_shares WHERE document_id = id))

Enable RLS on the table and test the policies with sample queries.
```

## 14. Complex: Analytics Dashboard Data
```
Build a comprehensive analytics query for an admin dashboard:

1. **User Metrics** (last 30 days):
   - Total new signups
   - Daily active users (distinct users with activity each day)
   - User retention rate (users who returned after signup)

2. **Content Metrics**:
   - Total posts created
   - Average posts per user
   - Most active users (top 10 by post count)
   - Trending topics (most used tags)

3. **Engagement Metrics**:
   - Total likes/reactions
   - Total comments
   - Average engagement rate per post
   - Most engaged posts (top 20)

4. **Revenue Metrics** (if applicable):
   - Total revenue
   - Revenue by product category
   - Average order value
   - Customer lifetime value (top 100 customers)

5. **Performance Metrics**:
   - Average query response times (from logs)
   - Error rates by endpoint
   - Peak usage hours

Combine all metrics into a single structured response with:
- Summary stats
- Time-series data for charts
- Top performers lists
- Trend indicators (up/down compared to previous period)
```

## 15. Full-Text Search Implementation
```
Implement full-text search across multiple tables:

1. **Create Search Query** for term "artificial intelligence":
   - Search in "posts" table: title, content
   - Search in "comments" table: content
   - Search in "users" table: username, bio
   - Search in "tags" table: name, description

2. **Rank Results** by relevance:
   - Exact matches rank highest
   - Title matches rank higher than content matches
   - Recent content ranks higher

3. **Filter Options**:
   - Date range: last 6 months
   - Content type: posts only
   - Minimum engagement: >10 likes

4. **Return Results** with:
   - Matched content with highlighted search terms
   - Result type (post/comment/user)
   - Relevance score
   - Metadata (author, date, engagement)
   - Total results count

5. **Pagination**:
   - Page size: 20 results
   - Include total pages
   - Include next/previous page indicators

Return first page of results with search metadata.
```

## 16. Database Migration
```
Execute a database migration to add a new feature:

1. **Create New Table** "user_subscriptions":
   - id (uuid, primary key)
   - user_id (uuid, foreign key to users)
   - plan_type (text: 'free', 'pro', 'enterprise')
   - status (text: 'active', 'cancelled', 'expired')
   - start_date (timestamp)
   - end_date (timestamp)
   - auto_renew (boolean)

2. **Add Indexes**:
   - Index on user_id for fast lookups
   - Index on status for filtering
   - Composite index on (user_id, status) for common queries

3. **Add Constraints**:
   - Check constraint: end_date > start_date
   - Check constraint: plan_type in allowed values

4. **Migrate Existing Data**:
   - For all existing users, create 'free' tier subscription
   - Set status to 'active'
   - Set start_date to user's created_at date

5. **Create RLS Policies**:
   - Users can only view their own subscriptions
   - Only admins can update subscription status

6. **Create Helper Functions**:
   - Function to check if user has active subscription
   - Function to upgrade/downgrade subscription
   - Function to handle subscription expiration

Execute migration and verify all data migrated correctly.
```

## 17. Complex: Content Moderation System
```
Implement an automated content moderation workflow:

1. **Monitor New Content**:
   - Set up real-time trigger on "posts" and "comments" tables for INSERT events

2. **Automatic Checks**:
   - Check content length (min/max)
   - Check for banned words/phrases (query "moderation_rules" table)
   - Check for excessive caps, special characters
   - Check user reputation score from "user_stats" table

3. **Scoring System**:
   - Assign risk score (0-100) based on checks
   - Low risk (0-30): Auto-approve
   - Medium risk (31-70): Flag for review
   - High risk (71-100): Auto-hide, notify moderators

4. **For Flagged Content**:
   - Insert into "moderation_queue":
     * content_id
     * content_type
     * risk_score
     * flags (array of issues found)
     * status: 'pending_review'
   - Insert notification for moderator team
   - Update content status to 'under_review'

5. **For Auto-Hidden Content**:
   - Update content visibility to false
   - Insert into "moderation_actions":
     * action: 'auto_hide'
     * reason: flags description
     * timestamp
   - Notify content creator
   - Create moderator notification

6. **Update User Stats**:
   - Track moderation history in "user_moderation_history"
   - If multiple violations: decrease user trust score
   - If trust score drops below threshold: restrict posting

7. **Logging**:
   - Log all moderation decisions to "moderation_logs"

Process 5 sample posts through this workflow and show the outcomes.
```

## 18. Backup and Export Data
```
Create a complete data export for user "user789":

1. **Export User Data**:
   - User profile from "profiles"
   - User settings from "user_settings"
   - Authentication metadata (login history)

2. **Export User Content**:
   - All posts from "posts" table
   - All comments from "comments" table
   - All uploads from "media" table
   - Get file URLs from storage bucket

3. **Export Relationships**:
   - Following/followers from "user_follows"
   - Liked posts from "post_likes"
   - Saved content from "saved_items"

4. **Export Activity**:
   - Login history from "auth_logs"
   - Activity timeline from "user_activities"

5. **Format Export**:
   - Create JSON structure with all data
   - Include metadata (export date, version)
   - Calculate total storage used

6. **Store Export**:
   - Upload JSON to storage bucket "user-exports"
   - Generate secure download URL (expires in 7 days)

7. **Notify User**:
   - Insert notification with download link
   - Send email with export details

Return export summary and download URL.
```

## 19. Complex: Multi-Tenant Data Isolation
```
Implement multi-tenant architecture with data isolation:

1. **Setup Tenant Tables**:
   - Create "tenants" table with:
     * id, name, subdomain, status, created_at

2. **Add Tenant Column**:
   - Add tenant_id to all multi-tenant tables:
     * users, posts, comments, settings

3. **Create RLS Policies** for each table:
   - Policy: Users can only access data where tenant_id matches their tenant
   - Policy: System admins can access all tenants

4. **Implement Tenant Context**:
   - Create function get_current_tenant() that returns tenant_id from JWT
   - Create function set_tenant_context(tenant_id)

5. **Test Isolation**:
   - Create 2 test tenants: "acme-corp", "beta-company"
   - Create test users in each tenant
   - Create test posts in each tenant
   - Query as user from tenant A - verify they can't see tenant B data
   - Query as admin - verify they can see all data

6. **Create Tenant Admin Functions**:
   - Function to create new tenant with initialization:
     * Create tenant record
     * Create default admin user
     * Set up default settings
     * Create tenant-specific storage bucket

7. **Setup Cross-Tenant Features** (if needed):
   - Create "shared_resources" table for cross-tenant data
   - Implement permission system for shared access

Execute setup and run isolation tests to verify security.
```

## 20. Complex: Event-Driven Architecture
```
Implement comprehensive event-driven system using Supabase:

1. **Create Event Log Table**:
   - id, event_type, entity_type, entity_id, actor_id, metadata (jsonb), created_at

2. **Setup Event Triggers** for key tables:
   
   **For "users" table**:
   - On INSERT: Log 'user.created' event
   - On UPDATE: Log 'user.updated' event
   - Track specific field changes in metadata
   
   **For "posts" table**:
   - On INSERT: Log 'post.created' event
   - On UPDATE (status='published'): Log 'post.published' event
   - On DELETE: Log 'post.deleted' event
   
   **For "orders" table**:
   - On INSERT: Log 'order.created' event
   - On UPDATE (status='completed'): Log 'order.completed' event
   - On UPDATE (status='cancelled'): Log 'order.cancelled' event

3. **Event Handlers** (Edge Functions):
   
   **On 'user.created'**:
   - Send welcome email
   - Create default settings
   - Trigger onboarding workflow
   
   **On 'post.published'**:
   - Notify followers
   - Update user stats
   - Trigger content indexing
   - Check for trending status
   
   **On 'order.completed'**:
   - Send confirmation email
   - Update inventory
   - Generate invoice
   - Trigger fulfillment
   - Update analytics

4. **Event Stream Processing**:
   - Query events by type for analytics
   - Calculate event frequency and patterns
   - Identify anomalies (unusual event patterns)

5. **Event Replay**:
   - Function to replay events (for testing or recovery)
   - Filter events by date range or type
   - Apply events to rebuild state

6. **Monitoring Dashboard**:
   - Events per second
   - Event type distribution
   - Failed event handlers
   - Event processing latency

Simulate 20 user actions triggering various events and show the event log and resulting side effects.
```
