---
title: "🏷️ SEO Meta Generator"
tags: ["skill", "seo", "content", "metadata"]
category: "Skills"
subcategory: "Business"
---

# SEO Meta Generator

A skill for automatically generating optimized SEO titles, meta descriptions, and keywords based on page content.

## Prerequisites
- Text analysis capabilities.

## Usage
Provide the main content of an article or web page to generate SEO metadata.

## Configuration
Specify target keywords or character limits if required.

## Examples
**Input Content:** "A comprehensive guide on how to grow tomatoes in your backyard..."
**Output:**
- **Title:** The Ultimate Guide to Growing Tomatoes in Your Backyard
- **Meta Description:** Learn step-by-step how to grow juicy, healthy tomatoes in your backyard garden. Perfect for beginners and experienced gardeners alike.

## Advanced Usage
Generating metadata localized for different regions or languages.

## Integration
Can be used alongside CMS management tools to auto-fill SEO fields.

## Troubleshooting
- **Generated content too long:** Adjust character limit parameters.

## Best Practices
- Keep titles under 60 characters.
- Keep meta descriptions under 160 characters.
- Include primary keywords naturally.

## Performance Considerations
Minimal performance impact.

## Security & Safety

### Permissions Required
- None.

### Safety Considerations
⚠️ **Important Warnings:**
- Ensure generated content accurately reflects the page to avoid search engine penalties.

### Data Handling
- Processes text content locally.

## API Reference

### Functions

#### `generate_meta(content, primary_keyword)`
**Description:** Generates SEO title and description.
**Parameters:**
- `content` (string): The page content.
- `primary_keyword` (string): The main keyword to target.
**Returns:**
- (dict): Containing `title` and `description`.

## File Structure
```
seo-meta-generator/
└── SKILL.md
```

## References
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## Changelog
### Version 1.0.0 - 2024-05-20
- Initial release.

## Contributing
Contributions welcome for expanding support for different search engine guidelines.

## License
MIT License
