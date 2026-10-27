---
title: 📧 Google Workspace MCP Server Prompts
section: Prompt_Library
category: Mcp_Servers
subcategory: Google_Workspace
tags: ["featured", "collections", "google", "gmail", "drive", "calendar", "docs", "sheets"]
created: 2026-03-25T21:32:00.000Z
source: My Prompt Library
---

# Google Workspace MCP Server Prompt Library

## 1. Send Email (Gmail)
```
Send an email to john@example.com with the subject "Q1 Planning Meeting" and body "Hi John, Let's schedule our Q1 planning session for next week. Are you available Tuesday afternoon? Best regards". Send a copy to sarah@example.com as CC.
```

## 2. Search Emails
```
Search my Gmail inbox for all emails from the past 7 days that contain the word "invoice" in the subject line. Return the sender, subject, date, and first 100 characters of each email.
```

## 3. Create Google Doc
```
Create a new Google Doc titled "Project Requirements - Mobile App Redesign" in my "Work Projects" folder. Add the following sections as headers: Overview, User Stories, Technical Requirements, Timeline, and Resources.
```

## 4. Upload File to Google Drive
```
Upload the file "budget-2026.xlsx" from my local Downloads folder to my Google Drive in the folder "Finance/2026". Set sharing permissions so anyone in my organization can view it.
```

## 5. Create Calendar Event
```
Create a Google Calendar event titled "Team Standup" for tomorrow at 10:00 AM, duration 30 minutes. Add the description "Daily sync meeting via Zoom" and invite team@company.com. Set it to recur every weekday.
```

## 6. List Files in Drive
```
List all PDF files in my Google Drive folder "Contracts/2026" and show their names, last modified dates, and sharing status. Sort by most recently modified.
```

## 7. Create Google Sheet
```
Create a new Google Sheet named "Sales Tracker Q1 2026" with columns: Date, Lead Name, Company, Deal Size, Status, Owner. Add it to my "Sales" folder in Drive.
```

## 8. Share Drive File
```
Share the Google Doc titled "Company Handbook 2026" with editing access to hr-team@company.com and viewing access to all-staff@company.com. Enable the option to prevent editors from changing access and sharing.
```

## 9. Get Calendar Events
```
Show me all my calendar events for the next 3 days, including event titles, start times, durations, and attendees. Highlight any conflicts (overlapping events).
```

## 10. Complex: Weekly Report Automation
```
Create a weekly report workflow:

1. Search Gmail for all emails from the past week with label "Client Communication"
2. Extract sender names and subject lines
3. Check my Google Calendar for all meetings from the past week
4. Extract meeting titles, attendees, and durations
5. Find all Google Docs in my "Meeting Notes" folder modified in the past week
6. Create a new Google Doc titled "Weekly Report - [Current Date]"
7. In the document, create sections for:
   - Client Communications (list of emails)
   - Meetings Attended (list with attendees and durations)
   - Documents Updated (list of docs with modification dates)
8. Share the report with my-manager@company.com
9. Send an email to my-manager@company.com with subject "Weekly Report - [Current Date]" and a link to the Google Doc

Automate this entire workflow and confirm each step.
```

## 11. Complex: Email Inbox Cleanup
```
Help me organize my Gmail inbox:

1. Find all emails older than 90 days with no responses (I sent the original email but never got a reply)
2. Create a Gmail label called "Follow-up Needed"
3. Apply this label to all those emails
4. Search for all emails with attachments larger than 10MB from the past year
5. Create a list in a Google Sheet titled "Large Attachments Audit" with columns: Sender, Subject, Date, Attachment Size, File Name
6. Find all emails from "noreply@" addresses older than 30 days
7. Create a Gmail filter to automatically archive future emails from "noreply@" addresses
8. Generate a summary report showing:
   - Total emails needing follow-up
   - Total storage used by large attachments
   - Number of automated emails archived

Present this as a Google Doc summary.
```

## 12. Create Presentation
```
Create a Google Slides presentation titled "Q1 2026 Marketing Review" with the following slides:

1. Title slide with the title and subtitle "Prepared by Marketing Team"
2. Agenda slide listing: Performance Overview, Campaign Results, Budget Analysis, Next Steps
3. A blank slide titled "Performance Overview" (ready for charts)
4. A blank slide titled "Key Metrics"
5. A slide titled "Next Steps" with bullet points: Review feedback, Adjust strategy, Launch Q2 campaigns

Save it to my "Presentations/2026" folder in Google Drive.
```

## 13. Copy File
```
Make a copy of the Google Doc titled "Project Template" and rename the copy to "New Client Onboarding - Acme Corp". Move it to the "Active Projects" folder. Share it with the project team: project-team@company.com with editing access.
```

## 14. Complex: Meeting Preparation Workflow
```
I have an important client meeting tomorrow at 2 PM with Acme Corp. Help me prepare:

1. Search Gmail for all emails from "@acmecorp.com" domain from the past 60 days
2. Create a summary of key discussion topics from those email subject lines
3. Find the Google Doc titled "Acme Corp - Account Overview" in my Drive and extract the last modified date
4. Check if there are any Google Sheets with "Acme" in the filename and list them
5. Find all calendar events with "Acme" in the title from the past 3 months and list meeting dates
6. Create a new Google Doc titled "Meeting Prep - Acme Corp [Tomorrow's Date]" with sections:
   - Meeting Details (date, time, attendees)
   - Recent Email Correspondence Summary
   - Previous Meeting History
   - Related Documents (links to relevant docs/sheets)
   - Discussion Topics
   - Action Items to Review
7. Populate each section with the gathered information
8. Send an email to myself with the subject "Tomorrow's Meeting Prep - Acme Corp" with a link to the prep doc
```

## 15. Batch Email Sending
```
I need to send personalized emails to 5 clients. From the Google Sheet "Client Contact List" in my Drive, read the following columns: Name, Email, Company, Project.

For each row, send an email with:
- To: Email address from the sheet
- Subject: "Project Update - [Project Name]"
- Body: "Hi [Name], I wanted to update you on the progress of [Project] at [Company]. We've completed the initial phase and are ready for your review. Please let me know a good time to discuss next steps. Best regards"

Track which emails were sent successfully and create a log in a new Google Sheet titled "Email Campaign Log - [Today's Date]".
```

## 16. Complex: Document Collaboration Setup
```
Set up a collaborative workspace for a new project "Website Redesign":

1. Create a new folder in Google Drive called "Website Redesign Project"
2. Inside that folder, create subfolders: "Design Mockups", "Content", "Development Docs", "Meeting Notes"
3. Create a Google Doc in "Meeting Notes" titled "Project Kickoff Meeting" with agenda items
4. Create a Google Sheet in the main project folder titled "Project Timeline" with columns: Task, Owner, Start Date, End Date, Status, Notes
5. Create another Google Sheet titled "Budget Tracker" with columns: Category, Item, Estimated Cost, Actual Cost, Variance
6. Share the entire "Website Redesign Project" folder with project-team@company.com with editing access
7. Share it with stakeholders@company.com with viewing access only
8. Create a Google Calendar event for "Website Redesign Kickoff" next Monday at 10 AM, 1 hour duration
9. In the calendar event description, include links to all the created documents and the shared folder
10. Send a calendar invite to project-team@company.com and stakeholders@company.com
11. Send a welcome email to project-team@company.com with subject "Website Redesign Project - Getting Started" with:
    - Link to the shared folder
    - Brief overview of the folder structure
    - Calendar invite for kickoff meeting
    - Request to review the kickoff meeting agenda

Provide a summary of all created resources with links.
```

## 17. Archive and Organize
```
Help me organize old emails:

1. Find all emails in Gmail older than 1 year with the label "Projects/Completed"
2. For each project label found, create a corresponding folder in Google Drive under "Archive/2025 Projects"
3. Search for any attachments in those emails
4. Download and organize attachments into the appropriate Google Drive archive folders based on project labels
5. Archive all those emails (remove from inbox, keep in All Mail)
6. Create a Google Doc titled "Archived Projects Index - 2025" listing all archived projects and their Drive folder locations
7. Generate a summary report showing how many emails were archived, total attachments saved, and storage space freed
```

## 18. Complex: Travel Planning Coordination
```
I'm planning a business trip to San Francisco next month. Coordinate my travel arrangements:

1. Create a Google Calendar event titled "Business Trip - San Francisco" as an all-day event covering the trip dates (March 15-18)
2. Create a new Google Doc titled "SF Trip Itinerary - March 2026" with sections: Flight Details, Hotel, Meetings, Expenses, Notes
3. Search my Gmail for any emails mentioning "San Francisco meeting" or "SF visit" from the past 30 days
4. Extract meeting request details from those emails (who, when, where)
5. Create individual calendar events for each confirmed meeting during those dates
6. Create a Google Sheet titled "SF Trip Expenses" with columns: Date, Category, Description, Amount, Receipt (link)
7. Create a shared Drive folder "Business Trip - SF March 2026"
8. Move the itinerary doc and expense sheet into this folder
9. Share the folder with my-assistant@company.com with editing access
10. Send an email to my-assistant@company.com with subject "SF Business Trip - March 15-18" including:
    - Link to the shared folder
    - List of confirmed meetings
    - Request to book flights and hotel
11. Set a calendar reminder 3 days before the trip to review the itinerary
```

## 19. Smart Label Organization
```
Analyze my Gmail and create an intelligent labeling system:

1. Find the top 10 most frequent email senders in my inbox (by email count)
2. For each frequent sender, create a Gmail label with their company name (e.g., if emails are from john@acme.com, create label "Clients/Acme Corp")
3. Apply appropriate labels to all existing emails from those senders
4. Create Gmail filters for each sender to auto-apply labels to future emails
5. Find all emails with PDF attachments from the past 6 months
6. Create a Gmail label "Has PDF Attachments"
7. Create a filter to auto-label future emails with PDF attachments
8. Generate a Google Doc report showing:
   - All new labels created
   - Number of emails re-organized
   - Filters created
   - Recommendations for additional organization
```

## 20. Complex: Team Onboarding Automation
```
Automate the onboarding process for a new team member (name: Alex Johnson, email: alex.johnson@company.com):

1. Create a Google Drive folder "Onboarding - Alex Johnson"
2. Copy the template doc "Employee Onboarding Checklist Template" to this folder and rename it "Onboarding Checklist - Alex"
3. Copy the template "Company Handbook" to this folder
4. Share the entire folder with alex.johnson@company.com with editing access
5. Create a Google Calendar event "Welcome Meeting - Alex Johnson" for their first day at 9 AM (Monday next week), 1 hour duration
6. Invite: alex.johnson@company.com, hr@company.com, manager@company.com
7. In the calendar description, include links to the onboarding folder and checklist
8. Create a Google Sheet "Alex Johnson - Training Schedule" with columns: Date, Topic, Trainer, Status, Notes
9. Add 5 rows for the first week of training sessions (topics: Company Overview, Team Introductions, Systems Access, Product Training, First Project Assignment)
10. Send a welcome email to alex.johnson@company.com with subject "Welcome to [Company Name]!" including:
    - Welcome message
    - Link to onboarding folder
    - Calendar invite for welcome meeting
    - Training schedule link
    - Contact information for questions (hr@company.com)
11. CC hr@company.com and manager@company.com on the welcome email
12. Create a follow-up calendar reminder for hr@company.com 3 days after start date to check in on progress

Provide a summary of all resources created and actions completed.
```
