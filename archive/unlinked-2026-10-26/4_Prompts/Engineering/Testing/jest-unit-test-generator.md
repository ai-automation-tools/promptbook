---
title: "🃏 Jest Unit Test Generator"
tags: ["testing", "jest", "javascript", "typescript", "qa"]
category: "Prompts"
subcategory: "Development/Testing"
---

# Jest Unit Test Generator

## Purpose
This prompt directs the AI to generate robust, comprehensive Jest unit tests for a given JavaScript or TypeScript function/module. It ensures high code coverage by testing happy paths, edge cases, and error handling.

## Instructions

I want you to act as an expert QA automation engineer specializing in JavaScript/TypeScript testing using Jest.

When I provide a piece of code, you should analyze it and write a complete Jest test suite for it.

Your response should include:
- A clear `describe` block wrapping the tests.
- Setup and teardown functions (`beforeEach`, `afterEach`) if mocking or state reset is required.
- Clear `it` or `test` block descriptions explaining *what* is being tested.
- Tests for the "happy path" (expected behavior).
- Tests for edge cases (e.g., null, undefined, empty arrays, extreme values).
- Tests for error handling (using `expect(() => {}).toThrow()`).
- Appropriate mocking for external dependencies using `jest.mock()` or `jest.spyOn()`.

Here is the code to test:
```javascript
[INSERT CODE HERE]
```

## Output Format
- Use markdown formatting.
- Provide the final code in a single `javascript` or `typescript` code block.
- Briefly explain the testing strategy and any mocks used below the code block.
- Keep the code clean, strictly typed (if TS), and well-commented.

## Example

**Input:**
```javascript
export function calculateDiscount(price, discountPercentage) {
  if (typeof price !== 'number' || typeof discountPercentage !== 'number') {
    throw new Error('Inputs must be numbers');
  }
  if (price < 0 || discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Invalid input range');
  }
  return price - (price * (discountPercentage / 100));
}
```

**Output:**
```javascript
import { calculateDiscount } from './discount';

describe('calculateDiscount', () => {
  it('should calculate the correct discounted price for valid inputs', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
    expect(calculateDiscount(50, 10)).toBe(45);
  });

  it('should return the original price when discount is 0', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should return 0 when discount is 100', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  it('should throw an error if inputs are not numbers', () => {
    expect(() => calculateDiscount('100', 20)).toThrow('Inputs must be numbers');
    expect(() => calculateDiscount(100, null)).toThrow('Inputs must be numbers');
  });

  it('should throw an error for negative prices or invalid percentages', () => {
    expect(() => calculateDiscount(-100, 20)).toThrow('Invalid input range');
    expect(() => calculateDiscount(100, 110)).toThrow('Invalid input range');
  });
});
```
*Testing Strategy:* The suite covers the happy path, zero/max discounts, type validation, and range validation to ensure 100% coverage.

## Tips for Use
- Tip 1: If the code has complex imports, provide the file structure context so the AI mocks them correctly.
- Tip 2: Specify if you prefer `it` or `test` for block naming.
- Tip 3: For asynchronous functions, remind the AI to use `async/await` in the test blocks.
