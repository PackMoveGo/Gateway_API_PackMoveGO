# 🔐 Render Security Setup

## Quick Setup for Render

### 1. Environment Variables to Add in Render Dashboard

Go to your Render dashboard → Your API service → Environment → Add these variables:

```bash
# Security Configuration (Choose one mode)

# 🌐 PUBLIC MODE (Recommended for now)
ENABLE_IP_WHITELIST=false
REDIRECT_URL=https://www.packmovego.com
LOG_BLOCKED_REQUESTS=true

# OR

# 🔒 STRICT MODE (When you want to restrict access)
ENABLE_IP_WHITELIST=true
ALLOWED_IPS=YOUR_FRONTEND_IP,YOUR_OFFICE_IP
REDIRECT_URL=https://www.packmovego.com
LOG_BLOCKED_REQUESTS=true
```

### 2. Recommended Configuration

For now, use **PUBLIC MODE** to ensure your API works:

```bash
ENABLE_IP_WHITELIST=false
REDIRECT_URL=https://www.packmovego.com
LOG_BLOCKED_REQUESTS=true
```

### 3. How to Find Your Frontend IP

If you want to use STRICT MODE later, find your frontend IP:

```bash
# From your frontend server, run:
curl ifconfig.me
# or
curl ipinfo.io/ip
```

Then add that IP to `ALLOWED_IPS`:
```bash
ALLOWED_IPS=203.0.113.25,198.51.100.50
```

### 4. Testing Your Setup

After deploying to Render, test the security:

```bash
# Test local development
npm run test:security

# Test production
npm run test:security:prod
```

### 5. Monitoring

Watch your Render logs for security events:

- ✅ `Development mode - allowing IP` (in dev)
- ✅ `Public API mode - allowing IP` (in prod with public mode)
- 🚫 `BLOCKED: IP accessing path` (when IP whitelist is enabled)
- 🤖 `Bot detected` (when bots are detected)

### 6. Switching Modes

#### From Public to Strict:
1. Set `ENABLE_IP_WHITELIST=true`
2. Add your frontend IP to `ALLOWED_IPS`
3. Deploy and test
4. Monitor logs for blocked requests

#### From Strict to Public:
1. Set `ENABLE_IP_WHITELIST=false`
2. Remove or empty `ALLOWED_IPS`
3. Deploy and test

### 7. Current Status

Your API is currently configured as a **Web Service** on Render, which is correct for:
- ✅ Public API access
- ✅ Custom domain (api.packmovego.com)
- ✅ SSL certificate
- ✅ Health checks

### 8. Security Features Active

- ✅ IP Whitelisting (configurable)
- ✅ Rate Limiting (50 req/15min in prod)
- ✅ Attack Prevention
- ✅ Security Headers
- ✅ Request Validation
- ✅ Redirect for unauthorized access

### 9. Next Steps

1. **Deploy with PUBLIC MODE first**
2. **Test your frontend can access the API**
3. **Monitor logs for any issues**
4. **Switch to STRICT MODE later if needed**

### 10. Troubleshooting

If your frontend can't access the API:
1. Check Render logs for blocked requests
2. Add your frontend IP to `ALLOWED_IPS`
3. Or switch back to `ENABLE_IP_WHITELIST=false`

If health checks fail:
- Health checks are always allowed
- Check other server issues in logs 