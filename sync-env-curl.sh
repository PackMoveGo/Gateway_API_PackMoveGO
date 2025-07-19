#!/bin/bash

# Script to sync environment variables using curl commands
# Service ID: srv-d1rvk9vdiees73ajsuog

API_KEY="rnd_wOZgFErNsChIOOOdEis4njApGbX1"
SERVICE_ID="srv-d1rvk9vdiees73ajsuog"

echo "Syncing environment variables to Render..."
echo "Service ID: $SERVICE_ID"
echo ""

# Set each environment variable
echo "Setting NODE_ENV..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"NODE_ENV":"production"}}'

echo ""
echo "Setting PORT..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"PORT":"3000"}}'

echo ""
echo "Setting ALLOWED_IPS..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"ALLOWED_IPS":"76.76.21.21,172.58.117.103,172.58.119.213"}}'

echo ""
echo "Setting ADMIN_PASSWORD..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"ADMIN_PASSWORD":"packmovego2024"}}'

echo ""
echo "Setting SSH_PORT..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"SSH_PORT":"2222"}}'

echo ""
echo "Setting SSH_HOST..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"SSH_HOST":"0.0.0.0"}}'

echo ""
echo "Setting RENDER..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"RENDER":"true"}}'

echo ""
echo "Setting LOG_DIR..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"LOG_DIR":"./logs"}}'

echo ""
echo "Setting MONGODB_URI..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"MONGODB_URI":"mongodb+srv://admin:nJPb6TTiYqfjjexI@packmovego.9yxraau.mongodb.net/?retryWrites=true&w=majority&appName=PackMoveGo"}}'

echo ""
echo "Setting DATABASE_URL..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"DATABASE_URL":"prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza191ZjVadVdRRmR1MFRJQkNNQmVaQjQiLCJhcGlfa2V5IjoiMDFLMEE3NEdZQVgzM0VNWjdFQkU0RjhUWFciLCJ0ZW5hbnRfaWQiOiJiOTQ3NWNmNGM4ZTc0MDI5OTE5Yzg0NDgyYjZmYzQ0ZDkwYmIzMDg4YWY0MDQ4ODhkNmUzMjcwYzAwZDY2N2Q0IiwiaW50ZXJuYWxfc2VjcmV0IjoiODBiNTRmNGYtZGRkMi00YWMzLWI5MjUtNTM0NTlkMDIyMWJmIn0.qC3Edzhp6cKoURWAM5mV2M6zAN24Y-iDbrcJDrhZSXg"}'

echo ""
echo "Setting CORS_ORIGIN..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"CORS_ORIGIN":"https://www.packmovego.com,https://packmovego.com"}}'

echo ""
echo "Setting CORS_METHODS..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"CORS_METHODS":"GET,POST,PUT,DELETE,OPTIONS"}}'

echo ""
echo "Setting CORS_ALLOWED_HEADERS..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"CORS_ALLOWED_HEADERS":"Content-Type,Authorization"}}'

echo ""
echo "Setting JWT_SECRET..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"JWT_SECRET":"a131fba4ee1366460f9b1da9ae09e620076459338f7248af25eb09c3b9a613fc33e2b8b9a2b931246f74c6e7f7844a66214363d625e65cd138aa92e5d4691ce0"}}'

echo ""
echo "Setting STRIPE_SECRET_KEY..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"STRIPE_SECRET_KEY":"sk_test_51RQf97G30oP5XDB4K2qGGlvmrVakLAvI9yA1wSv7MOgKHlVP0kWF2kpX1PHkDkUDpAItx02nTTXv8nklBlt47s0k00htF0jNc5"}}'

echo ""
echo "Setting STRIPE_PUBLISHABLE_KEY..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"STRIPE_PUBLISHABLE_KEY":"pk_test_51RQf97G30oP5XDB4roLF2jQJDPBv164W3ctElUIcrhiixITNJQOpzN24wHxJCSXRPXqNxVXv3E0BmWu6dSnjGlYL00ZqqJn1wS"}}'

echo ""
echo "Setting EMAIL_USER..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"EMAIL_USER":"support@packmovego.com"}}'

echo ""
echo "Setting EMAIL_PASSWORD..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"EMAIL_PASSWORD":"rE7WDXudXYCQscG"}}'

echo ""
echo "Setting EMAIL_HOST..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"EMAIL_HOST":"127.0.0.1"}}'

echo ""
echo "Setting EMAIL_PORT..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"EMAIL_PORT":"1025"}}'

echo ""
echo "Setting EMAIL_SECURE..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"EMAIL_SECURE":"false"}}'

echo ""
echo "Setting GOOGLE_MAPS_API_KEY..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"GOOGLE_MAPS_API_KEY":"your_google_maps_api_key_here"}}'

echo ""
echo "Setting DEBUG..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"DEBUG":"false"}}'

echo ""
echo "Setting LOG_LEVEL..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"LOG_LEVEL":"info"}}'

echo ""
echo "Setting PRODUCTION_DOMAIN..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"PRODUCTION_DOMAIN":"https://www.packmovego.com"}}'

echo ""
echo "Setting API_URL..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"API_URL":"https://api.packmovego.com"}}'

echo ""
echo "Setting SSL_KEY_PATH..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"SSL_KEY_PATH":"/path/to/ssl/key.pem"}}'

echo ""
echo "Setting SSL_CERT_PATH..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"SSL_CERT_PATH":"/path/to/ssl/cert.pem"}}'

echo ""
echo "Setting SENTRY_DSN..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"SENTRY_DSN":"your_sentry_dsn_here"}}'

echo ""
echo "Setting GA_TRACKING_ID..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"GA_TRACKING_ID":"your_google_analytics_id_here"}}'

echo ""
echo "Setting REDIS_URL..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"REDIS_URL":"redis://localhost:6379"}}'

echo ""
echo "Setting SESSION_SECRET..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"SESSION_SECRET":"your_session_secret_here"}}'

echo ""
echo "Setting TWILIO_ACCOUNT_SID..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"TWILIO_ACCOUNT_SID":"your_twilio_account_sid"}}'

echo ""
echo "Setting TWILIO_AUTH_TOKEN..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"TWILIO_AUTH_TOKEN":"your_twilio_auth_token"}}'

echo ""
echo "Setting TWILIO_PHONE_NUMBER..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"TWILIO_PHONE_NUMBER":"+1234567890"}}'

echo ""
echo "Setting WEBHOOK_SECRET..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"WEBHOOK_SECRET":"your_webhook_secret_here"}}'

echo ""
echo "Setting RATE_LIMIT_WINDOW_MS..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"RATE_LIMIT_WINDOW_MS":"900000"}}'

echo ""
echo "Setting RATE_LIMIT_MAX_REQUESTS..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"RATE_LIMIT_MAX_REQUESTS":"100"}}'

echo ""
echo "Setting BACKUP_SCHEDULE..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"BACKUP_SCHEDULE":"0 2 * * *"}}'

echo ""
echo "Setting BACKUP_RETENTION_DAYS..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"BACKUP_RETENTION_DAYS":"30"}}'

echo ""
echo "Setting MAINTENANCE_MODE..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"MAINTENANCE_MODE":"false"}}'

echo ""
echo "Setting MAINTENANCE_MESSAGE..."
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"envVars":{"MAINTENANCE_MESSAGE":"Site is under maintenance. Please check back soon."}}'

echo ""
echo "Environment variables sync completed!" 