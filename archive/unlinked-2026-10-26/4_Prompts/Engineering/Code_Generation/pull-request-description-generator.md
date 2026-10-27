---
title: "📌 Goal"
tags:
- collections
- engineering
- pull
- request
- description
- generator
category: Collections
subcategory: Engineering
---
# Goal
Generate a clear, comprehensive, and professional pull request description.

# Inputs
- **Branch Name:** The name of the source branch.
- **Diff:** The code changes in the pull request.
- **Related Issue:** (Optional) The issue that this pull request addresses.
- **Project Context:** (Optional) A brief description of the project.

# Instructions
1.  Analyze the provided code diff and branch name.
2.  Write a clear and concise title for the pull request.
3.  Write a "Description" section that explains the purpose of the pull request and the changes made.
4.  Write a "Related Issue" section that links to the related issue if one is provided.
5.  Write a "Testing" section that describes how the changes were tested.
6.  Write a "Checklist" section that includes items for the author and reviewer to verify.

# Output format
```markdown
## Description

[A clear and concise description of the changes.]

## Related Issue

- Closes #[issue-number]

## Testing

[Describe the testing that has been done.]

## Checklist

### Author
- [ ] I have self-reviewed my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] New and existing unit tests pass locally with my changes.

### Reviewer
- [ ] The code follows the project's style guidelines.
- [ ] The code is easy to understand.
- [ ] The changes are well-documented.
- [ ] The tests are adequate.
```

# Examples

## Example 1: Bug fix

**Branch Name:** `fix/login-button-bug`
**Diff:** A diff that fixes a login button bug.
**Related Issue:** `78`

**Output:**
```markdown
## Description

This PR fixes a bug where the login button was not properly disabled after being clicked, allowing for multiple form submissions.

## Related Issue

- Closes #78

## Testing

- Manually tested the login form to ensure the button is disabled after the first click.
- Added a unit test to verify the disabled state of the button.

## Checklist

### Author
- [x] I have self-reviewed my own code.
- [x] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings.
- [x] I have added tests that prove my fix is effective or that my feature works.
- [x] New and existing unit tests pass locally with my changes.

### Reviewer
- [ ] The code follows the project's style guidelines.
- [ ] The code is easy to understand.
- [ ] The changes are well-documented.
- [ ] The tests are adequate.
```

# What not to do
- Do not leave any sections blank.
- Do not write a vague description.
- Do not forget to link to the related issue.
- Do not submit a pull request without testing the changes.
