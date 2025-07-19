# 🔐 Security Setup Guide

## Overview
This guide explains how to configure the security features for your PackMoveGo API, including IP whitelisting and redirect functionality.

## 🚀 Quick Start

### 1. Environment Variables

Add these environment variables to your `.env` file or Render dashboard:

```bash
# Security Configuration
ENABLE_IP_WHITELIST=false          # Set to 'true' to enable strict IP whitelisting
ALLOWED_IPS=                       # Comma-separated list of allowed IPs
REDIRECT_URL=https://www.packmovego.com  # Where to redirect unauthorized access
LOG_BLOCKED_REQUESTS=true          # Set to 'false' to disable logging of blocked requests
```

### 2. Security Modes

#### 🌐 Public Mode (Default)
```bash
ENABLE_IP_WHITELIST=false
```
- Allows all IPs to access your API
- No restrictions
- Good for public APIs

#### 🔒 Strict Mode
```bash
ENABLE_IP_WHITELIST=true
ALLOWED_IPS=192.168.1.100,10.0.0.50,203.0.113.25
```
- Only allows specified IPs
- Redirects unauthorized access to main website
- Blocks all other IPs

## 📋 Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_IP_WHITELIST` | `false` | Enable strict IP whitelisting |
| `ALLOWED_IPS` | `''` | Comma-separated list of allowed IPs |
| `REDIRECT_URL` | `https://www.packmovego.com` | Redirect URL for unauthorized access |
| `LOG_BLOCKED_REQUESTS` | `true` | Log blocked requests |

### Trusted IP Ranges

The system automatically trusts these IP ranges:

#### Render Internal IPs
- `10.0.0.0/8` - Private network
- `172.16.0.0/12` - Private network  
- `172.58.0.0/16` - Render specific
- `192.168.0.0/16` - Private network
- `127.0.0.1` - Localhost
- `::1` - IPv6 localhost

#### Vercel IPs (if using Vercel)
- `76.76.21.0/24` - Vercel's main range
- Various specific Vercel IPs

#### Cloudflare IPs (if using Cloudflare)
- Multiple Cloudflare IP ranges

## 🔧 Setup Instructions

### For Development
```bash
# .env file
ENABLE_IP_WHITELIST=false
LOG_BLOCKED_REQUESTS=true
```

### For Production (Public API)
```bash
# Render Environment Variables
ENABLE_IP_WHITELIST=false
REDIRECT_URL=https://www.packmovego.com
LOG_BLOCKED_REQUESTS=true
```

### For Production (Restricted API)
```bash
# Render Environment Variables
ENABLE_IP_WHITELIST=true
ALLOWED_IPS=203.0.113.25,198.51.100.50,192.168.1.100
REDIRECT_URL=https://www.packmovego.com
LOG_BLOCKED_REQUESTS=true
```

## 🛡️ Security Features

### 1. IP Whitelisting
- Restricts access to specific IP addresses
- Redirects unauthorized access to main website
- Supports CIDR notation for IP ranges

### 2. Rate Limiting
- 50 requests per 15 minutes in production
- 100 requests per 15 minutes in development
- Exempts health checks and trusted IPs

### 3. Attack Prevention
- Blocks common attack patterns
- Prevents path traversal attacks
- Blocks malicious scripts and SQL injection

### 4. Security Headers
- XSS protection
- Clickjacking prevention
- MIME type sniffing prevention
- HSTS in production

### 5. Request Validation
- Validates request size (1MB limit)
- Checks for malicious patterns
- Logs suspicious activity

## 📊 Monitoring

### Logs to Watch For

#### ✅ Allowed Requests
```
✅ Development mode - allowing 192.168.1.100 for /api/v0/nav
✅ IP 203.0.113.25 explicitly allowed for /api/v0/services
✅ IP 10.228.21.128 in trusted range for /api/health
```

#### 🚫 Blocked Requests
```
🚫 BLOCKED: IP 203.0.113.50 accessing /api/v0/nav (User-Agent: Mozilla/5.0...)
```

#### 🤖 Bot Detection
```
🤖 Bot detected: Googlebot/2.1 from 66.249.66.1 accessing /api/v0/services
```

#### ⚠️ Security Warnings
```
⚠️ Sensitive endpoint accessed: /api/admin/config by 192.168.1.100
🚫 Attack detected from IP: 203.0.113.25, Path: /api/v0/nav
```

## 🔍 Testing

### Test IP Whitelisting
```bash
# Test from different IPs
curl -H "X-Forwarded-For: 203.0.113.25" https://api.packmovego.com/api/v0/nav
curl -H "X-Forwarded-For: 203.0.113.50" https://api.packmovego.com/api/v0/nav
```

### Test Redirect
```bash
# Should redirect to main website
curl -I https://api.packmovego.com/api/v0/nav
```

## 🚨 Troubleshooting

### Common Issues

1. **API not accessible from frontend**
   - Check if frontend IP is in `ALLOWED_IPS`
   - Verify `ENABLE_IP_WHITELIST` is set correctly

2. **Health checks failing**
   - Health checks are always allowed
   - Check Render logs for other issues

3. **Rate limiting too strict**
   - Adjust rate limit settings in `security.ts`
   - Add more IPs to trusted ranges

### Debug Commands

```bash
# Check current security configuration
npm run dev
# Look for security configuration logs at startup

# Test specific IP
curl -H "X-Forwarded-For: YOUR_IP" https://api.packmovego.com/api/health
```

## 📝 Best Practices

1. **Start with Public Mode** - Test your API works before enabling restrictions
2. **Monitor Logs** - Watch for blocked requests and adjust accordingly
3. **Use CIDR Notation** - For IP ranges, use CIDR notation (e.g., `192.168.1.0/24`)
4. **Test Thoroughly** - Test from different networks and devices
5. **Keep Logs Enabled** - Helps with debugging and monitoring

## 🔄 Migration Guide

### From Public to Restricted
1. Set `ENABLE_IP_WHITELIST=true`
2. Add your frontend IPs to `ALLOWED_IPS`
3. Test thoroughly
4. Monitor logs for blocked requests
5. Adjust as needed

### From Restricted to Public
1. Set `ENABLE_IP_WHITELIST=false`
2. Remove `ALLOWED_IPS` or set to empty
3. Test that all clients can access the API

## 📞 Support

If you encounter issues:
1. Check the logs for error messages
2. Verify environment variable configuration
3. Test with different IP addresses
4. Review the security configuration logs at startup 