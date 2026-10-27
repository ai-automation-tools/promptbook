---
title: "🕵️ JWT Token Inspector"
tags: ["jwt", "security", "authentication", "inspector"]
category: "Skills"
subcategory: "Security"
---

# JWT Token Inspector

## Prerequisites
- Node.js installed or a modern web browser.

## Usage
Decodes, inspects, and validates JSON Web Tokens (JWTs) to ensure they are properly formatted and securely configured.

## Configuration
Requires the JWT string. Optionally requires the secret key or public key for signature validation.

## Examples
```bash
# Decode a token
node inspect-jwt.js --token eyJhbG...
```

## Advanced Usage
Can verify tokens against specific algorithms (RS256, HS256) and check expiration (`exp`) and not-before (`nbf`) claims.

## Integration
Integrates into API gateways or backend middleware for request authentication.

## Troubleshooting
- "Invalid signature" indicates the token was tampered with or the wrong key was provided.
- "Token expired" indicates the `exp` claim is in the past.

## Best Practices
- Never store sensitive data (like passwords) in the payload, as it is only base64 encoded, not encrypted.
- Always validate the signature and standard claims (`exp`, `iss`, `aud`).

## Performance Considerations
- Asymmetric signature validation (e.g., RS256) is more CPU-intensive than symmetric (HS256).

## Security & Safety
### Permissions Required
- None for basic decoding. Access to secret/public keys for validation.

### Safety Considerations
⚠️ **Important Warnings:**
- Do not expose your secret keys when using this tool.

### Data Handling
- Token decoding happens locally.

## API Reference
### Functions
#### `decodeToken(token)`
**Description:** Decodes the JWT header and payload without verifying the signature.
**Parameters:**
- `token` (string): The JWT string.
**Returns:**
- (object): Header and payload objects.

## File Structure
```
jwt-inspector/
├── SKILL.md
└── inspect-jwt.js
```

## References
- [JWT.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

## Changelog
### Version 1.0.0 - 2026-05-15
- Initial release with decoding and verification features.

## Contributing
1. Implement support for encrypted JWTs (JWE).

## License
MIT License
