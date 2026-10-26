---
title: "📌 Test Case Generation"
tags: ["collections", "engineering", "test", "case", "generation"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt: Test Case Generation

## Goal
To generate a comprehensive set of test cases for a new software feature, based on its description and user stories.

## Inputs
- **Feature Description:** A detailed explanation of the new feature, including its purpose, functionality, and scope.
- **User Stories:** A list of user stories that describe how different users will interact with the feature.
- **Acceptance Criteria:** The specific criteria that must be met for the feature to be considered complete and ready for release.

## Instructions
1.  **Analyze the Feature:** Carefully review the feature description, user stories, and acceptance criteria to understand the feature's intended behavior.
2.  **Identify Test Scenarios:** Brainstorm a list of high-level scenarios that need to be tested. Consider both positive and negative paths, as well as edge cases.
3.  **Generate Test Cases:** For each scenario, create a set of detailed test cases. Each test case should include:
    *   **Test Case ID:** A unique identifier for the test case.
    *   **Test Case Title:** A brief, descriptive title for the test case.
    *   **Test Steps:** A step-by-step description of how to execute the test.
    *   **Expected Results:** The expected outcome of the test.
4.  **Categorize Test Cases:** Group the test cases into logical categories, such as:
    *   **Functional Tests:** Verify that the feature works as expected.
    *   **UI/UX Tests:** Verify that the user interface is intuitive and easy to use.
    *   **Performance Tests:** Verify that the feature performs well under load.
    *   **Security Tests:** Verify that the feature is secure and does not introduce any vulnerabilities.
5.  **Prioritize Test Cases:** Assign a priority to each test case (e.g., High, Medium, Low) based on its importance and the risk of not testing it.

## Output Format
The test cases should be presented in a clear and organized format, such as a table or a list.

### Example Table Format
| Test Case ID | Test Case Title                  | Test Steps                                                                                             | Expected Results                                    | Priority | Category      |
| :----------- | :------------------------------- | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------- | :------- | :------------ |
| TC-001       | Verify successful login          | 1. Open the login page.<br>2. Enter a valid username and password.<br>3. Click the "Login" button.      | The user is successfully logged in and redirected to the dashboard. | High     | Functional    |
| TC-002       | Verify unsuccessful login        | 1. Open the login page.<br>2. Enter an invalid username and password.<br>3. Click the "Login" button.      | An error message is displayed, and the user is not logged in.       | High     | Functional    |
| TC-003       | Verify "Remember Me" functionality | 1. Open the login page.<br>2. Enter a valid username and password.<br>3. Check the "Remember Me" box.<br>4. Click the "Login" button.<br>5. Close and reopen the browser.<br>6. Navigate to the login page. | The user is still logged in.                       | Medium   | UI/UX         |

## What Not to Do
-   Do not generate vague or ambiguous test cases.
-   Do not forget to include negative test cases and edge cases.
-   Do not skip the prioritization of test cases.
-   Do not generate test cases that are not directly related to the feature being tested.