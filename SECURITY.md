# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of PackMoveGO API seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to security@packmovego.com.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Measures

Our API implements several security measures:

1. **IP Whitelisting**: Only authorized domains can access the API
2. **Rate Limiting**: Prevents abuse and DDoS attacks
3. **CORS Protection**: Secure cross-origin requests
4. **Input Validation**: All user inputs are validated and sanitized
5. **Secure Headers**: Using Helmet.js for security headers
6. **JWT Authentication**: Secure token-based authentication
7. **HTTPS Only**: All communications are encrypted

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2) and will be clearly marked in the release notes.

## Best Practices

When using our API, please follow these security best practices:

1. Always use HTTPS for API requests
2. Keep your API keys and tokens secure
3. Implement proper error handling
4. Use the latest version of the API
5. Follow the rate limiting guidelines
6. Implement proper authentication
7. Validate all user inputs

## Contact

For security-related questions or concerns, please contact:

- Email: security@packmovego.com
- Website: https://www.packmovego.com/security 