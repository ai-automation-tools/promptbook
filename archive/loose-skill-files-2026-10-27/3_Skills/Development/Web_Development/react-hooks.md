---
title: "🔧 React Hooks Skill"
tags: ["skill", "react", "frontend"]
category: "Skills"
subcategory: "Development"
name: react-hooks
description: "Expertly use React hooks for state and lifecycle management. Use when: (1) managing component state, (2) fetching data, (3) subscribing to events. NOT for: class components."
---

# React Hooks Skill

Provides advanced patterns and usage examples for React Hooks.

## Prerequisites

- **Required Tool:** React 16.8+
- **Environment:** Node.js

### Setup Instructions

1. Install React
2. Setup Vite or Create React App

**Verification:**
```bash
npm list react
```

## Usage

### Basic Usage

```javascript
import { useState, useEffect } from 'react';
```

### Common Workflows

#### Workflow 1: Data Fetching

**Steps:**
1. Setup state
   ```javascript
   const [data, setData] = useState(null);
   ```
2. Setup effect
   ```javascript
   useEffect(() => { fetch('/api').then(r => r.json()).then(setData) }, []);
   ```

## Configuration

### Required Configuration
N/A

## Examples

### Example 1: Counter

**Context:** Basic state

**Commands:**
```javascript
const [count, setCount] = useState(0);
```

**Output:**
Updates UI on click.

## Advanced Usage

### Custom Hooks
Create reusable logic blocks.

```javascript
function useWindowSize() { /* ... */ }
```

## Integration

### With Other Skills
- **react-router**: Managing navigation state.

## Troubleshooting

### Common Issues
**Issue 1: Infinite loop**
- **Cause:** Missing dependency array
- **Solution:** Add `[]` or variables to useEffect.

## Best Practices

### Do's ✅
- Call hooks at the top level
- Use exhaustive-deps linter

### Don'ts ❌
- Call inside loops/conditions

## Performance Considerations

### Optimization Tips
1. **useMemo**: Memoize expensive calculations.

## Security & Safety

### Data Handling
- Avoid storing sensitive secrets in state.

## API Reference

### Functions
#### `useState(initialValue)`
**Returns:** [state, setState]

## File Structure
N/A

## References
- [React Docs](https://react.dev)

## Changelog
- Version 1.0.0 - Initial

## Contributing
- Submit PRs

## License
MIT
