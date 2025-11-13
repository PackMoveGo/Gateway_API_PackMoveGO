# Production SSL Certificates

This directory should contain production SSL certificates for HTTPS.

## Required Files

- `key.pem` - Private key file
- `cert.pem` - Certificate file

## Setup Instructions

1. **For Local Production Testing:**
   - Generate self-signed certificates or use your production certificates
   - Place `key.pem` and `cert.pem` in this directory

2. **For Render Deployment:**
   - Render handles SSL/TLS termination at the load balancer
   - You may not need certificates here if using Render's SSL
   - If using custom certificates, upload them via Render dashboard

3. **Generate Self-Signed Certificates (for testing):**
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
   ```

## Security Note

⚠️ **Never commit actual production certificates to git!**
- Add `*.pem` to `.gitignore`
- Use environment variables or secure secret management for production
- For Render, use their SSL certificate management

