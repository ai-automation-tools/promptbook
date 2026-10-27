---
title: "🔧 CSS Grid Layout Skill"
tags: ["skill", "css", "layout"]
category: "Skills"
subcategory: "Development"
name: css-grid
description: "Build complex, responsive web layouts using CSS Grid. Use when: (1) creating 2D layouts, (2) building dashboards, (3) arranging galleries. NOT for: simple 1D lists (use flexbox)."
---

# CSS Grid Layout Skill

Provides comprehensive layout capabilities using native CSS Grid.

## Prerequisites

- **Required Tool:** Modern web browser
- **Environment:** HTML/CSS setup

### Setup Instructions

1. Create HTML file
2. Add CSS file

**Verification:**
```css
display: grid;
```

## Usage

### Basic Usage

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
```

### Common Workflows

#### Workflow 1: Holy Grail Layout

**Steps:**
1. Define grid
   ```css
   .grid { display: grid; grid-template: auto 1fr auto / 200px 1fr 200px; }
   ```

## Configuration

### Required Configuration
N/A

## Examples

### Example 1: Image Gallery

**Context:** Grid of photos

**Commands:**
```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```

**Output:**
Responsive grid of images.

## Advanced Usage

### Grid Areas
Name areas for semantic layout.

```css
grid-template-areas: "header header" "sidebar main";
```

## Integration

### With Other Skills
- **flexbox**: Mix grid and flexbox for micro-layouts.

## Troubleshooting

### Common Issues
**Issue 1: Overflow**
- **Cause:** minmax issue
- **Solution:** Use `minmax(0, 1fr)`

## Best Practices

### Do's ✅
- Use `gap` instead of margins
- Use `fr` units

### Don'ts ❌
- Overuse for simple alignments

## Performance Considerations

### Optimization Tips
- CSS Grid is highly optimized by browsers.

## Security & Safety
N/A

## API Reference

### Properties
#### `grid-template-columns`
Defines columns.

## File Structure
N/A

## References
- [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

## Changelog
- Version 1.0.0 - Initial

## Contributing
- Submit PRs

## License
MIT
