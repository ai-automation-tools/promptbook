---
title: "🔧 JWT Authentication Skill"
tags: ["skill", "security", "backend"]
category: "Skills"
subcategory: "Development"
name: jwt-auth
description: "Implement secure JSON Web Token authentication. Use when: (1) securing APIs, (2) maintaining stateless auth, (3) single sign-on. NOT for: storing highly sensitive long-term data inside the token."
---

# JWT Authentication Skill

Standard practice for implementing token-based API authentication.

## Prerequisites

- **Required Tool:** jsonwebtoken library
- **Environment:** Node.js

### Setup Instructions

1. `npm install jsonwebtoken`

**Verification:**
```bash
npm list jsonwebtoken
```

## Usage

### Basic Usage

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 1 }, process.env.SECRET);
```

### Common Workflows

#### Workflow 1: Verify Token

**Steps:**
1. Extract token from header
2. Verify
   ```javascript
   jwt.verify(token, secret, (err, decoded) => { ... });
   ```

## Configuration

### Required Configuration
**Environment Variables:**
```bash
export JWT_SECRET="your-super-secret-key"
```

## Examples

### Example 1: Login

**Context:** User authenticates

**Commands:**
```javascript
const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
```

## Advanced Usage

### Refresh Tokens
Implement short-lived access tokens and long-lived refresh tokens.

## Integration

### With Other Skills
- **express**: Use as middleware.

## Troubleshooting

### Common Issues
**Issue 1: Token expired**
- **Cause:** Time passed
- **Solution:** Issue refresh token

## Best Practices

### Do's ✅
- Set expiration times
- Keep secret safe

### Don'ts ❌
- Store passwords in token

## Performance Considerations

### Optimization Tips
- Keep payloads small.

## Security & Safety

### Data Handling
- Tokens are base64 encoded, NOT encrypted. Don't put PII in them.

## API Reference

### Functions
#### `jwt.sign(payload, secret)`
Creates a token.

## File Structure
N/A

## References
- [JWT.io](https://jwt.io)

## Changelog
- Version 1.0.0 - Initial

## Contributing
- Submit PRs

## License
MIT
