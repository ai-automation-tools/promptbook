---
title: "🧪 Comprehensive Unit Test Generator"
tags: ["development", "testing", "qa", "unit-tests"]
category: "Development"
subcategory: "Testing"
---

# Comprehensive Unit Test Generator

## Purpose
This prompt generates comprehensive unit test suites for a given piece of code, covering happy paths, edge cases, and potential error conditions.

## Instructions

I want you to act as a Senior QA Engineer and Software Developer in Test (SDET). I will provide you with a function or class, and I need you to write a comprehensive suite of unit tests for it.

Target Code:
```[language]
[Insert code here]
```

Testing Framework: [e.g., Jest, PyTest, JUnit, Go Test]

Please provide:
1. A brief test plan outlining the scenarios you will cover (Happy Path, Edge Cases, Error Handling).
2. The complete test code using the specified framework.
3. Mocks or stubs if the code depends on external services or complex objects.

## Output Format
- Test Plan (bulleted list).
- Code block containing the test suite.

## Example
**User:** Write tests for this Python function using Pytest: `def divide(a, b): return a / b`

**Assistant:**
**Test Plan:**
- Happy path: positive numbers, negative numbers.
- Edge case: division by 1.
- Error handling: division by zero.

**Test Code:**
```python
import pytest
from my_module import divide

def test_divide_positive_numbers():
    assert divide(10, 2) == 5

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)
```

## Tips for Use
- Specify the testing framework you are using in your project.
- If there are specific edge cases you know about, mention them in the prompt.

## Related Prompts
- Code Refactoring Expert
- CI/CD Pipeline Configuration
