# Environment Variables Sync to Render

This guide shows you how to sync your local `.env` file with your Render environment variables.

## Method 1: Using the provided scripts

### Option A: Node.js script
```bash
node sync-env.js
```

### Option B: Shell script
```bash
./sync-env.sh [SERVICE_ID]
```

## Method 2: Manual commands

### Step 1: Get your service ID
```bash
render services list
```

### Step 2: Set environment variables one by one
```bash
# Example commands (replace SERVICE_ID with your actual service ID)
render env set NODE_ENV=production --service-id SERVICE_ID
render env set PORT=3000 --service-id SERVICE_ID
render env set ALLOWED_IPS="76.76.21.21,172.58.117.103,172.58.119.213" --service-id SERVICE_ID
render env set ADMIN_PASSWORD=packmovego2024 --service-id SERVICE_ID
render env set SSH_PORT=2222 --service-id SERVICE_ID
render env set SSH_HOST=0.0.0.0 --service-id SERVICE_ID
render env set RENDER=true --service-id SERVICE_ID
render env set LOG_DIR=./logs --service-id SERVICE_ID
render env set MONGODB_URI="mongodb+srv://admin:nJPb6TTiYqfjjexI@packmovego.9yxraau.mongodb.net/?retryWrites=true&w=majority&appName=PackMoveGo" --service-id SERVICE_ID
render env set DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza191ZjVadVdRRmR1MFRJQkNNQmVaQjQiLCJhcGlfa2V5IjoiMDFLMEE3NEdZQVgzM0VNWjdFQkU0RjhUWFciLCJ0ZW5hbnRfaWQiOiJiOTQ3NWNmNGM4ZTc0MDI5OTE5Yzg0NDgyYjZmYzQ0ZDkwYmIzMDg4YWY0MDQ4ODhkNmUzMjcwYzAwZDY2N2Q0IiwiaW50ZXJuYWxfc2VjcmV0IjoiODBiNTRmNGYtZGRkMi00YWMzLWI5MjUtNTM0NTlkMDIyMWJmIn0.qC3Edzhp6cKoURWAM5mV2M6zAN24Y-iDbrcJDrhZSXg" --service-id SERVICE_ID
render env set CORS_ORIGIN="https://www.packmovego.com,https://packmovego.com" --service-id SERVICE_ID
render env set CORS_METHODS="GET,POST,PUT,DELETE,OPTIONS" --service-id SERVICE_ID
render env set CORS_ALLOWED_HEADERS="Content-Type,Authorization" --service-id SERVICE_ID
render env set JWT_SECRET="a131fba4ee1366460f9b1da9ae09e620076459338f7248af25eb09c3b9a613fc33e2b8b9a2b931246f74c6e7f7844a66214363d625e65cd138aa92e5d4691ce0" --service-id SERVICE_ID
render env set STRIPE_SECRET_KEY="sk_test_51RQf97G30oP5XDB4K2qGGlvmrVakLAvI9yA1wSv7MOgKHlVP0kWF2kpX1PHkDkUDpAItx02nTTXv8nklBlt47s0k00htF0jNc5" --service-id SERVICE_ID
render env set STRIPE_PUBLISHABLE_KEY="pk_test_51RQf97G30oP5XDB4roLF2jQJDPBv164W3ctElUIcrhiixITNJQOpzN24wHxJCSXRPXqNxVXv3E0BmWu6dSnjGlYL00ZqqJn1wS" --service-id SERVICE_ID
render env set EMAIL_USER=support@packmovego.com --service-id SERVICE_ID
render env set EMAIL_PASSWORD=rE7WDXudXYCQscG --service-id SERVICE_ID
render env set EMAIL_HOST=127.0.0.1 --service-id SERVICE_ID
render env set EMAIL_PORT=1025 --service-id SERVICE_ID
render env set EMAIL_SECURE=false --service-id SERVICE_ID
render env set GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here --service-id SERVICE_ID
render env set DEBUG=false --service-id SERVICE_ID
render env set LOG_LEVEL=info --service-id SERVICE_ID
render env set PRODUCTION_DOMAIN=https://www.packmovego.com --service-id SERVICE_ID
render env set API_URL=https://api.packmovego.com --service-id SERVICE_ID
render env set SSL_KEY_PATH=/path/to/ssl/key.pem --service-id SERVICE_ID
render env set SSL_CERT_PATH=/path/to/ssl/cert.pem --service-id SERVICE_ID
render env set SENTRY_DSN=your_sentry_dsn_here --service-id SERVICE_ID
render env set GA_TRACKING_ID=your_google_analytics_id_here --service-id SERVICE_ID
render env set REDIS_URL=redis://localhost:6379 --service-id SERVICE_ID
render env set SESSION_SECRET=your_session_secret_here --service-id SERVICE_ID
render env set TWILIO_ACCOUNT_SID=your_twilio_account_sid --service-id SERVICE_ID
render env set TWILIO_AUTH_TOKEN=your_twilio_auth_token --service-id SERVICE_ID
render env set TWILIO_PHONE_NUMBER=+1234567890 --service-id SERVICE_ID
render env set WEBHOOK_SECRET=your_webhook_secret_here --service-id SERVICE_ID
render env set RATE_LIMIT_WINDOW_MS=900000 --service-id SERVICE_ID
render env set RATE_LIMIT_MAX_REQUESTS=100 --service-id SERVICE_ID
render env set BACKUP_SCHEDULE="0 2 * * *" --service-id SERVICE_ID
render env set BACKUP_RETENTION_DAYS=30 --service-id SERVICE_ID
render env set MAINTENANCE_MODE=false --service-id SERVICE_ID
render env set MAINTENANCE_MESSAGE="Site is under maintenance. Please check back soon." --service-id SERVICE_ID
```

## Method 3: Bulk update script

I've also created a simple script that reads your `.env` file and sets all variables:

```bash
# Make sure you're logged in
render login

# Get your service ID first
render services list

# Then run the sync script
./sync-env.sh YOUR_SERVICE_ID
```

## Notes

- Replace `SERVICE_ID` with your actual Render service ID
- Some variables with special characters might need to be escaped
- The scripts will automatically handle quotes and special characters
- You can also use the Render dashboard to bulk import environment variables

## Troubleshooting

If you get authentication errors:
```bash
render login
```

If you can't find your service:
```bash
render services list --format json
```

To check current environment variables:
```bash
render env list --service-id YOUR_SERVICE_ID
``` 