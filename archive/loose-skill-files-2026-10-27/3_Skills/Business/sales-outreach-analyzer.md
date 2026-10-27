---
title: "📧 Sales Outreach Analyzer"
tags: ["sales", "outreach", "email", "analyzer", "business"]
category: "Skills"
subcategory: "Business"
---

# Sales Outreach Analyzer

## Prerequisites
- Basic understanding of B2B sales metrics and cold email best practices.

## Usage
Analyzes cold email templates or LinkedIn outreach messages to predict response rates, identify spam triggers, and suggest improvements for personalization and clarity.

## Configuration
Requires the outreach message text. Optionally requires the target audience description (e.g., "VP of Marketing at mid-sized SaaS").

## Examples
```bash
# Analyze a cold email
node analyze-outreach.js --message "Hi there, we offer great software..." --target "CTOs"
```

## Advanced Usage
Can process batches of email templates from a CSV to score and rank them based on predicted performance.

## Integration
Integrates with CRM platforms (like Salesforce or HubSpot) to score drafted emails before they are sent.

## Troubleshooting
- "Low personalization score": The message relies too heavily on generic variables (e.g., just `{{First Name}}`).
- "Spam trigger warning": The message contains words like "Free", "Guarantee", or excessive capitalization.

## Best Practices
- Always test the revised messages provided by the analyzer in small batches.
- Keep the call to action (CTA) clear and singular.

## Performance Considerations
- Batch processing of thousands of templates may take several minutes.

## Security & Safety
### Permissions Required
- None for basic text analysis.

### Safety Considerations
⚠️ **Important Warnings:**
- Ensure PII (Personally Identifiable Information) is redacted before sending messages to external APIs for analysis.

### Data Handling
- Processed text should not be stored permanently to ensure data privacy.

## API Reference
### Functions
#### `analyzeMessage(messageText, targetAudience)`
**Description:** Analyzes the sales outreach message.
**Parameters:**
- `messageText` (string): The text of the email or message.
- `targetAudience` (string, optional): A description of the recipient.
**Returns:**
- (object): Analysis results including spam score, personalization score, and suggested edits.

## File Structure
```
sales-analyzer/
├── SKILL.md
└── analyze-outreach.js
```

## References
- [HubSpot Sales Email Best Practices](https://blog.hubspot.com/sales)

## Changelog
### Version 1.0.0 - 2026-05-15
- Initial release with spam detection and personalization scoring.

## Contributing
1. Provide new examples of high-performing cold emails to improve the scoring algorithm.

## License
MIT License
