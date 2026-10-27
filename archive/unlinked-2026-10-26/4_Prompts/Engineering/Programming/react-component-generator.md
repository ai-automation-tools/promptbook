---
title: "⚛️ React Component Generator"
tags: ["react", "frontend", "component", "development"]
category: "Development"
subcategory: "Programming"
---

# React Component Generator

## Purpose
This prompt is designed to generate clean, strongly typed, and fully accessible React functional components. It saves developers time by scaffolding boilerplate code, enforcing TypeScript interfaces, and applying modern CSS frameworks like Tailwind.

## Instructions
I want you to act as a Senior Frontend Software Engineer who specializes in React and accessibility.

Please create a React functional component named: [Enter Component Name, e.g., UserProfileCard].
The component's primary function is to: [Enter detailed description of what the component should do and display].

When generating the code, you must adhere to the following technical requirements:
- Write the component using TypeScript and define explicit interfaces for all props.
- Use Tailwind CSS for all styling and layout.
- Ensure the component is fully accessible (ARIA compliant, keyboard navigable, and semantic HTML).
- Include standard React hooks (useState, useEffect) only if the component requires internal state or lifecycle management.

Your response should include:
- The complete, ready-to-copy component code block.
- A brief explanation of the defined props.
- A short example of how to import and render the component in a parent file.

## Output Format
- Provide the code in a single `tsx` markdown code block.
- Use plain text or markdown lists for the explanations and usage examples.
- Do not include unnecessary conversational filler.

## Example
**Input:**
Component Name: AlertBanner
Function: A banner that displays a success, warning, or error message. It should be dismissible by clicking a close icon.

**Output:**
```tsx
import React, { useState } from 'react';

interface AlertBannerProps {
  type: 'success' | 'warning' | 'error';
  message: string;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const baseClasses = "p-4 rounded-md flex justify-between items-center mb-4";
  const typeClasses = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800"
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <p>{message}</p>
      <button
        onClick={handleDismiss}
        aria-label="Close alert"
        className="ml-4 font-bold hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        ✕
      </button>
    </div>
  );
};
```

### Props Explanation
- `type`: Determines the color scheme (success, warning, error).
- `message`: The text content to display.
- `onDismiss`: Optional callback function executed when the banner is closed.

### Usage Example
```tsx
<AlertBanner type="success" message="Your profile has been updated successfully!" />
```

## Tips for Use
- If your component requires icons, specify which icon library you use (e.g., 'Use Lucide-React for icons').
- For complex state, ask the AI to implement `useReducer` instead of `useState`.

## Related Prompts
- library/4_Prompts/Development/Programming/frontend-architecture-review.md
