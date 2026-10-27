---
title: 🔥 Firebase MCP Server Prompts
section: Prompt_Library
category: Mcp_Servers
subcategory: Firebase
tags: ["featured", "collections", "firebase", "firestore", "auth", "cloud-functions", "storage"]
created: 2026-03-25T21:32:00.000Z
source: My Prompt Library
---

# Firebase MCP Server Prompt Library

## 1. Add Document to Firestore
```
Add a new document to the "users" collection in Firestore with the following data:
- email: "john.doe@example.com"
- displayName: "John Doe"
- createdAt: server timestamp
- isActive: true
- preferences: { theme: "dark", notifications: true }

Return the auto-generated document ID.
```

## 2. Query Firestore Collection
```
Query the "posts" collection where:
- status equals "published"
- publishedAt is within the last 7 days
- Order by publishedAt descending
- Limit to 20 results

Return document IDs with their data (title, author, publishedAt, views).
```

## 3. Update Firestore Document
```
Update the document "users/user123" in Firestore to:
- Set lastLogin to current server timestamp
- Increment loginCount by 1
- Update status.online to true

Use a transaction to ensure atomic updates and return the updated document.
```

## 4. Delete Firestore Document
```
Delete the document at path "posts/post456" from Firestore. Also delete any subcollections (comments, likes) associated with this post. Confirm deletion and return number of documents deleted.
```

## 5. Batch Write Operations
```
Perform a batch write to create multiple documents atomically:

1. Create 3 new user documents in "users" collection
2. Create a "groups/team-alpha" document
3. Add all 3 users to "groups/team-alpha/members" subcollection
4. Update "groups/team-alpha" with member count

Execute as single atomic batch operation and confirm all writes succeeded.
```

## 6. Firebase Auth - Create User
```
Create a new Firebase Authentication user with:
- Email: newuser@example.com
- Password: (auto-generate secure password)
- Display name: "New User"
- Email verified: false

Send verification email and create corresponding user profile in Firestore "users" collection with additional fields:
- role: "member"
- onboardingCompleted: false
- createdAt: server timestamp

Return the user UID and profile document reference.
```

## 7. Upload File to Cloud Storage
```
Upload the file "profile-photo.jpg" from local path to Firebase Cloud Storage at:
- Bucket: "user-uploads"
- Path: "profiles/user123/avatar.jpg"

Set metadata:
- contentType: "image/jpeg"
- customMetadata: { uploadedBy: "user123", purpose: "profile-photo" }

Make file publicly accessible and return the download URL.
```

## 8. Firestore Real-time Listener
```
Set up a real-time listener on the "messages" collection where:
- chatRoomId equals "room123"
- createdAt is after [current time]

When new messages arrive:
1. Log the message data
2. Check if message mentions current user
3. If mentioned, create notification in "notifications" collection
4. Return real-time message updates

Show me the first 5 messages received.
```

## 9. Cloud Function Trigger
```
Create and deploy a Cloud Function that triggers when a new document is created in "orders" collection:

Function logic:
1. Extract order details
2. Validate order data
3. Calculate total with tax
4. Send order confirmation email
5. Create entry in "orderHistory" collection
6. Update inventory for purchased items
7. If high-value order (>$1000), notify sales team

Deploy the function and test with a sample order document.
```

## 10. Complex: User Onboarding Flow
```
Implement complete user onboarding workflow in Firebase:

1. **Create Auth User**:
   - Email/password authentication
   - Send verification email
   
2. **Create User Profile** (Firestore "users/{uid}"):
   - username, email, displayName
   - createdAt: server timestamp
   - onboarding: { completed: false, step: 1 }
   - settings: { notifications: true, language: "en" }

3. **Initialize User Data**:
   - Create "users/{uid}/preferences" document with defaults
   - Create "users/{uid}/stats" document (posts: 0, followers: 0)
   - Create welcome notification in "notifications" collection

4. **Setup Cloud Storage**:
   - Create user-specific folder in storage
   - Upload default avatar image

5. **Welcome Email**:
   - Trigger Cloud Function to send welcome email
   - Include getting started guide

6. **Track Onboarding**:
   - Create document in "onboardingProgress/{uid}" with steps:
     * emailVerification: pending
     * profileSetup: incomplete
     * firstPost: incomplete
     * firstFollow: incomplete

7. **Setup User Roles**:
   - Add custom claims to auth token (role: "user")
   - Create entry in "roles" collection

Return complete user profile with all created documents and storage references.
```

## 11. Complex: E-Commerce Cart Management
```
Build a shopping cart system with Firebase:

1. **Create Cart Document** (Firestore "carts/{userId}"):
   - userId
   - items: [] (array of product objects)
   - subtotal: 0
   - tax: 0
   - total: 0
   - lastUpdated: server timestamp

2. **Add Item to Cart**:
   - Fetch product details from "products/{productId}"
   - Validate product availability and price
   - Add to cart.items array or update quantity if exists
   - Recalculate subtotal, tax (8.5%), total
   - Use transaction to ensure consistency

3. **Remove Item from Cart**:
   - Remove item from array
   - Recalculate totals
   - Update lastUpdated timestamp

4. **Checkout Process**:
   - Validate all cart items still available
   - Create "orders/{orderId}" document with:
     * userId, items, totals
     * status: "pending"
     * createdAt: server timestamp
   - Create payment intent (simulate with doc)
   - Decrement inventory for each product (transaction)

5. **Order Confirmation**:
   - Update order status to "confirmed"
   - Clear user's cart
   - Send confirmation email (Cloud Function)
   - Create order in "orderHistory/{userId}/orders"

6. **Error Handling**:
   - If inventory insufficient: rollback, notify user
   - If payment fails: cancel order, restore inventory
   - Log all errors to "errorLogs" collection

Simulate complete flow from cart creation to order confirmation.
```

## 12. Firestore Security Rules Testing
```
Test Firestore security rules for the "posts" collection:

Current rules should enforce:
1. Authenticated users can read all published posts
2. Users can only create posts with their own userId
3. Users can only update/delete their own posts
4. Admins can update/delete any post

Test scenarios:
- Unauthenticated read attempt (should fail for draft posts)
- User creates post with different userId (should fail)
- User updates own post (should succeed)
- User updates another user's post (should fail)
- Admin updates any post (should succeed)

Run all test cases and report pass/fail for each scenario.
```

## 13. Complex: Social Media Feed
```
Build a social media feed system:

1. **Create Post** (Firestore "posts/{postId}"):
   - authorId, content, mediaUrls[], hashtags[]
   - createdAt: server timestamp
   - stats: { likes: 0, comments: 0, shares: 0 }
   - visibility: "public"

2. **Fan-out to Followers**:
   - Query "followers/{authorId}/followersList" for all followers
   - For each follower:
     * Add post reference to "feeds/{followerId}/posts"
     * Limit feed to 100 most recent posts
   - Use batch writes for efficiency

3. **Like Post**:
   - Add document to "posts/{postId}/likes/{userId}"
   - Increment "posts/{postId}" stats.likes
   - Create notification for post author
   - Use transaction for atomic update

4. **Add Comment**:
   - Create "posts/{postId}/comments/{commentId}" with:
     * userId, text, createdAt
   - Increment post stats.comments
   - Notify post author (if not self)
   - Notify mentioned users (@username)

5. **Get User Feed**:
   - Query "feeds/{userId}/posts" ordered by createdAt desc
   - Limit to 20 posts
   - For each post, fetch:
     * Author details from "users"
     * Like status for current user
     * Comment count
   - Return formatted feed data

6. **Trending Posts**:
   - Query posts from last 24 hours
   - Calculate engagement score (likes * 2 + comments * 3)
   - Return top 10 trending posts

Implement and test feed creation, posting, and retrieval for 3 users.
```

## 14. File Upload with Progress
```
Upload a large file (video) to Firebase Cloud Storage with progress tracking:

1. **Start Upload**:
   - File: "demo-video.mp4" (assume 50MB)
   - Destination: "videos/uploads/{userId}/{videoId}.mp4"
   
2. **Track Progress**:
   - Update "uploadProgress/{uploadId}" document with:
     * bytesTransferred
     * totalBytes
     * percentComplete
     * state: "running"
   
3. **On Completion**:
   - Update state to "success"
   - Generate thumbnail using Cloud Function
   - Create "videos/{videoId}" metadata document:
     * userId, fileName, size, uploadedAt
     * downloadURL, thumbnailURL
     * duration, resolution (extracted via processing)
   
4. **On Error**:
   - Update state to "error"
   - Log error details
   - Allow retry mechanism

Simulate upload and show progress updates at 0%, 25%, 50%, 75%, 100%.
```

## 15. Complex: Multi-User Collaborative Document
```
Build real-time collaborative document editing:

1. **Document Structure** (Firestore "documents/{docId}"):
   - title, content, ownerId
   - collaborators: [{ userId, role, joinedAt }]
   - version: number
   - lastModified: server timestamp

2. **Access Control**:
   - Owner has full access
   - Collaborators have read/write based on role
   - Create "documents/{docId}/permissions/{userId}" for each user

3. **Real-time Sync**:
   - Set up listener on document
   - When content changes:
     * Detect which user made change
     * Show active editors in UI
     * Highlight concurrent edit conflicts

4. **Version History**:
   - On each save, create "documents/{docId}/versions/{versionId}":
     * content snapshot
     * modifiedBy, modifiedAt
     * changes: diff from previous version

5. **Conflict Resolution**:
   - Use operational transform for concurrent edits
   - Lock mechanism for critical sections
   - Last-write-wins with notification

6. **Comments/Suggestions**:
   - Create "documents/{docId}/comments/{commentId}":
     * userId, text, position in document
     * resolved: boolean
     * replies: subcollection

7. **Presence**:
   - Track active users in "documents/{docId}/presence"
   - Update cursor positions in real-time
   - Show who's viewing/editing

Simulate 3 users collaborating on same document with concurrent edits.
```

## 16. Complex: Analytics and Reporting
```
Implement analytics system with Firebase:

1. **Event Tracking**:
   - Create "analytics/events/{eventId}" for each user action:
     * eventType: "page_view", "button_click", "purchase", etc.
     * userId, sessionId, timestamp
     * metadata: { page, action, value }

2. **Session Tracking**:
   - Create "analytics/sessions/{sessionId}":
     * userId, startTime, endTime, duration
     * pageViews: count
     * events: count
     * device, browser, location

3. **User Journey**:
   - Query events for specific userId
   - Build timeline of actions
   - Identify conversion paths
   - Calculate funnel drop-off points

4. **Aggregate Metrics** (Cloud Functions):
   - Run daily aggregation at midnight:
     * Total users active
     * New signups
     * Revenue generated
     * Top pages visited
     * Average session duration
   - Store in "analytics/daily/{date}" documents

5. **Real-time Dashboard**:
   - Current active users (listeners on sessions)
   - Events per minute
   - Live conversion tracking
   - Error rate monitoring

6. **Custom Reports**:
   - Query builder for date ranges, filters
   - Export data to Cloud Storage as CSV
   - Schedule weekly/monthly email reports

Build sample analytics data for 7 days and generate summary report.
```

## 17. Complex: Content Moderation Pipeline
```
Implement automated content moderation using Firebase:

1. **Content Submission**:
   - User submits post to "pendingContent/{contentId}"
   - Trigger Cloud Function on create

2. **Automated Checks** (Cloud Function):
   - Text Analysis:
     * Check for profanity (filter list)
     * Sentiment analysis
     * Language detection
   - Image Analysis (if media):
     * Safe search detection
     * Label detection
     * Text extraction from images

3. **Scoring**:
   - Assign safety score (0-100)
   - Categorize: safe (80-100), review (40-79), unsafe (0-39)

4. **Workflow**:
   - Safe content:
     * Auto-publish to "posts" collection
     * Delete from pending
     * Notify user of publication
   
   - Needs review:
     * Move to "moderationQueue/{contentId}"
     * Assign to moderator
     * Create notification for mod team
   
   - Unsafe content:
     * Move to "blockedContent/{contentId}"
     * Notify user of rejection
     * Log reason in "moderationLogs"

5. **Moderator Actions**:
   - Approve: publish to posts
   - Reject: add to blocked, notify user
   - Edit: modify content, then publish
   - Ban user: update user status

6. **Appeal Process**:
   - User can appeal rejection
   - Create "appeals/{appealId}"
   - Escalate to senior moderator
   - Track appeal history

Process 10 sample submissions through the moderation pipeline.
```

## 18. Database Migration
```
Migrate data from old structure to new optimized structure:

1. **Old Structure**:
   - "users/{userId}" with nested fields
   - "posts" with author data duplicated

2. **New Structure**:
   - "users/{userId}" normalized
   - "userProfiles/{userId}" for extended data
   - "posts" with authorId reference only
   - "postStats/{postId}" for engagement metrics

3. **Migration Steps**:
   - Read all documents from old collections
   - Transform data to new structure
   - Batch write to new collections (max 500 docs per batch)
   - Verify data integrity
   - Update security rules for new structure
   - Update client code references

4. **Rollback Plan**:
   - Keep old data during migration
   - Create mapping between old and new IDs
   - If issues found, restore from backup

5. **Validation**:
   - Compare document counts
   - Verify random samples match
   - Test all queries work with new structure

Execute migration for 100 users and 500 posts, report success/errors.
```

## 19. Complex: Real-Time Chat Application
```
Build full-featured chat application with Firebase:

1. **Chat Room Structure**:
   - "chatRooms/{roomId}":
     * name, type (direct/group), createdBy
     * members: [{ userId, role, joinedAt }]
     * lastMessage: { text, timestamp, senderId }

2. **Messages**:
   - "chatRooms/{roomId}/messages/{messageId}":
     * senderId, text, timestamp: server timestamp
     * type: "text", "image", "file", "system"
     * metadata: { fileURL, fileName, fileSize }
     * reactions: { emoji: [userIds] }
     * readBy: [userIds]

3. **Send Message**:
   - Add message to subcollection
   - Update chatRoom.lastMessage
   - Increment unread count for all members except sender
   - Send push notification to offline members (Cloud Function)

4. **Mark as Read**:
   - Add current userId to message.readBy array
   - Decrement user's unread count for this room
   - Update "users/{userId}/chatStats"

5. **Typing Indicators**:
   - Use "chatRooms/{roomId}/typing/{userId}" ephemeral docs
   - Set with short TTL (5 seconds)
   - Listen for presence in real-time

6. **File Sharing**:
   - Upload file to Storage "chat-files/{roomId}/{messageId}/{fileName}"
   - Create message with file metadata
   - Generate download URL with expiration

7. **Message Search**:
   - Index messages for full-text search
   - Query by keyword, sender, date range
   - Return messages with context (before/after)

8. **Group Features**:
   - Add/remove members (with permissions)
   - Rename group
   - Set group avatar
   - Admin roles and permissions

9. **Notifications**:
   - New message notifications
   - @mention notifications
   - Message reactions
   - Member added/removed

10. **Presence**:
    - Track user online/offline status
    - Last seen timestamp
    - Currently active chat room

Set up chat room, send 20 messages between 3 users, test all features.
```

## 20. Complex: Serverless Backend with Cloud Functions
```
Build comprehensive serverless backend using Firebase Cloud Functions:

1. **HTTP Endpoints**:
   
   **POST /api/users** - Create new user:
   - Validate request body
   - Create Auth user
   - Create Firestore profile
   - Send welcome email
   - Return user data with token
   
   **GET /api/posts** - List posts with pagination:
   - Query Firestore with filters
   - Include author details
   - Calculate engagement metrics
   - Return paginated results
   
   **POST /api/posts/:id/like** - Like a post:
   - Verify authentication
   - Check not already liked
   - Update like count (transaction)
   - Create notification
   - Return updated stats

2. **Firestore Triggers**:
   
   **onCreate (orders)** - New order processing:
   - Validate order data
   - Check inventory
   - Process payment
   - Send confirmation email
   - Update analytics
   
   **onUpdate (users)** - Profile change notification:
   - Detect what changed
   - Notify relevant users
   - Update search index
   - Sync with external services

3. **Scheduled Functions** (Cron):
   
   **Daily at midnight** - Cleanup:
   - Delete expired sessions
   - Archive old data
   - Generate daily reports
   - Send digest emails
   
   **Hourly** - Analytics aggregation:
   - Calculate metrics
   - Update dashboards
   - Check for anomalies

4. **Auth Triggers**:
   
   **onCreate (user)** - New user setup:
   - Create profile document
   - Send verification email
   - Initialize preferences
   
   **onDelete (user)** - Cleanup:
   - Delete user data
   - Remove from groups
   - Archive content

5. **Storage Triggers**:
   
   **onFinalize (uploads)** - Process uploaded files:
   - Generate thumbnails for images
   - Transcode videos
   - Extract metadata
   - Update Firestore records

6. **Pubsub Triggers** - Background processing:
   - Email queue processing
   - Report generation
   - Data export jobs

Deploy all functions and test complete workflow from user signup to order completion.
```
