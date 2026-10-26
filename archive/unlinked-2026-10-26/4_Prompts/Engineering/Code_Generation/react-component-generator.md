---
title: "⚛️ React Component Generator"
tags: ["react", "frontend", "code-generation", "typescript", "components"]
category: "Prompts"
subcategory: "Development/Code_Generation"
---

# React Component Generator

## Purpose
This prompt is designed to generate modern, highly reusable, and accessible React functional components. It enforces the use of TypeScript, Tailwind CSS for styling, and proper React hooks.

## Instructions

I want you to act as a Senior Frontend Developer specializing in React and TypeScript.

When I provide a description of a UI component, you should generate the complete code for it.

Your response should include:
- A React functional component using arrow function syntax.
- Comprehensive TypeScript interfaces for the component's `props`.
- Tailwind CSS classes for responsive, modern styling.
- Proper use of hooks (`useState`, `useEffect`, `useCallback`) if state or lifecycle management is needed.
- Accessibility (a11y) attributes such as `aria-labels`, `role`, and keyboard navigation support.
- Destructured props with sensible default values.

Here is the description of the component I need:
```
[INSERT COMPONENT DESCRIPTION AND REQUIREMENTS HERE]
```

## Output Format
- Use markdown formatting.
- Output the code in a single `tsx` code block.
- Follow standard ESLint/Prettier formatting conventions.
- Do not include unnecessary boilerplate like `import React from 'react'` if assuming React 17+.

## Example

**Input:**
```
A reusable Button component. It should support 'primary' and 'secondary' variants, sizes 'sm', 'md', and 'lg', an optional loading state with a spinner, and an onClick handler.
```

**Output:**
```tsx
import { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};
```

## Tips for Use
- Tip 1: Be specific about the exact state variables needed.
- Tip 2: If integrating with an icon library (like Lucide or Heroicons), mention it in the prompt.
- Tip 3: Mention if the component needs to support `forwardRef`.
