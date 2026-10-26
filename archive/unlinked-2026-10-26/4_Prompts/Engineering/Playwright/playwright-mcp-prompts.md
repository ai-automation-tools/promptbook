---
title: 🎭 Playwright MCP Server Prompts
section: Prompt_Library
category: Mcp_Servers
subcategory: Playwright
tags: ["featured", "collections", "playwright", "testing", "automation", "web-scraping"]
created: 2026-03-25T21:32:00.000Z
source: My Prompt Library
---

# Playwright MCP Server Prompt Library

## 1. Navigate to URL
```
Navigate to https://example.com and wait for the page to fully load. Take a screenshot of the page and save it as "homepage.png".
```

## 2. Fill Form and Submit
```
Go to the login page at https://myapp.com/login, fill in the username field with "testuser@example.com", the password field with "securePassword123", click the "Sign In" button, and wait for navigation to the dashboard.
```

## 3. Click Element
```
Navigate to https://shopping-site.com and click on the "Add to Cart" button for the first product in the featured products section. Wait for the cart icon to update showing "1 item".
```

## 4. Extract Text Content
```
Go to https://news-website.com and extract the text content of all article headlines on the homepage. Return them as a numbered list.
```

## 5. Take Screenshot of Element
```
Navigate to https://documentation-site.com/api-reference and take a screenshot of just the API endpoint table (the element with class "api-table"). Save it as "api-endpoints.png".
```

## 6. Wait for Selector
```
Open https://dynamic-app.com, wait for the element with id "data-loaded" to appear (timeout 30 seconds), then extract the text content from the div with class "results-summary".
```

## 7. Handle Dialog/Alert
```
Navigate to https://interactive-demo.com/alerts, click the button that triggers a JavaScript confirm dialog, accept the dialog, and verify that the page shows "You clicked OK".
```

## 8. Scroll and Interact
```
Go to https://infinite-scroll-site.com, scroll down 5 times (with 2 second pauses between scrolls) to load more content, then count how many article cards are visible on the page.
```

## 9. Select Dropdown Option
```
Navigate to https://form-example.com/contact, select "Technical Support" from the "Department" dropdown menu, select "High" from the "Priority" dropdown, and take a screenshot of the form showing these selections.
```

## 10. Complex: E2E Shopping Flow
```
Automate a complete shopping journey on https://e-commerce-demo.com:

1. Navigate to the homepage
2. Use the search bar to search for "wireless headphones"
3. Wait for search results to load
4. Click on the third product in the results
5. On the product page, select "Blue" color and "Large" size
6. Click "Add to Cart"
7. Navigate to the cart page
8. Verify the product is in the cart with correct color and size
9. Click "Proceed to Checkout"
10. Fill in shipping information (use test data)
11. Take a screenshot of the order review page
12. Extract the total price from the order summary

Report back each step's status and provide the final total price.
```

## 11. Complex: Data Extraction from Table
```
Navigate to https://data-portal.com/statistics and perform the following:

1. Locate the data table with id "sales-report"
2. Extract all rows from the table
3. Parse the data into a structured format (JSON array of objects)
4. Filter rows where "Revenue" column value is greater than $10,000
5. Sort the filtered results by "Date" in descending order
6. Calculate the total revenue from the filtered results
7. Take a screenshot of the table
8. Return the processed data and total revenue
```

## 12. Monitor Page Changes
```
Open https://real-time-dashboard.com and monitor the element with id "status-indicator" for 60 seconds. Record every time it changes (from "Online" to "Offline" or vice versa) and report the frequency of status changes.
```

## 13. Multi-Page Navigation
```
Start at https://documentation-site.com/getting-started, click through all the "Next" navigation links to visit each page in sequence, and create a list of all page titles in the order visited. Stop when you reach a page without a "Next" link.
```

## 14. Complex: Form Validation Testing
```
Test the contact form at https://mywebsite.com/contact:

1. Submit the form with all fields empty and verify error messages appear
2. Fill only the email field with an invalid email (e.g., "notanemail") and submit - verify email validation error
3. Fill all required fields with valid data except leave phone number empty (if it's optional) and submit
4. Verify success message appears
5. Take screenshots of each validation state (empty form errors, email error, success)
6. Extract all error messages that appeared during testing
7. Generate a test report with all validation scenarios and their outcomes
```

## 15. Complex: Authentication and Protected Routes
```
Test the authentication flow on https://app-under-test.com:

1. Navigate to the login page
2. Attempt to access a protected route directly (https://app-under-test.com/dashboard) - verify it redirects to login
3. Go back to login and enter invalid credentials - verify error message
4. Enter valid credentials (username: "demo@example.com", password: "demo123")
5. After successful login, verify redirect to dashboard
6. Check that the user profile menu shows the logged-in user's email
7. Navigate to different protected routes (/profile, /settings, /reports) and verify each loads successfully
8. Click logout button
9. Verify redirect back to login page
10. Try to access /dashboard again - verify it redirects to login (session ended)

Create a detailed test report with pass/fail status for each step.
```

## 16. Extract and Download File
```
Navigate to https://reports-portal.com/downloads, click on the "Download Monthly Report" link, wait for the download to complete, and verify the downloaded file exists in the downloads folder. Report the filename and file size.
```

## 17. Hover and Tooltip Extraction
```
Go to https://interactive-chart.com, hover over each data point on the chart, extract the tooltip content that appears for each point, and create a list of all tooltip values.
```

## 18. Complex: Web Scraping with Pagination
```
Scrape product listings from https://product-catalog.com/laptops with pagination:

1. Navigate to the laptops category page
2. Extract all product names, prices, and ratings from the current page
3. Check if there's a "Next Page" button
4. If yes, click it and wait for new products to load
5. Repeat steps 2-4 until there's no more "Next Page" button (max 10 pages)
6. Compile all extracted data into a structured JSON format
7. Calculate average price and average rating across all products
8. Identify the highest and lowest priced products
9. Return the complete dataset and analytics

Handle pagination gracefully and report total number of products scraped.
```

## 19. Cookie and Session Handling
```
Visit https://preferences-demo.com and:

1. Accept the cookie consent banner
2. Navigate to the preferences page
3. Enable dark mode and select "Compact" view
4. Save preferences
5. Take a screenshot showing dark mode enabled
6. Refresh the page
7. Verify that dark mode and compact view are still active (preferences persisted)
8. Extract and display all cookies set by the site
```

## 20. Complex: Performance Testing
```
Conduct a performance analysis of https://webapp-to-test.com:

1. Navigate to the homepage and measure page load time
2. Use Chrome DevTools to capture network requests
3. Identify the slowest loading resources (top 5)
4. Take performance metrics: First Contentful Paint, Largest Contentful Paint, Time to Interactive
5. Navigate to the search page and perform 3 different searches, measuring response time for each
6. Check for any console errors or warnings
7. Verify all images loaded successfully (check for broken images)
8. Generate a performance report with:
   - Load times for each page
   - Resource loading bottlenecks
   - Console errors/warnings
   - Overall performance score based on Web Vitals

Provide recommendations for performance improvements based on findings.
```
