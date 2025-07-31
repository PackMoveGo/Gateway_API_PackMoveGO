# 🚀 Quick Setup Guide - PackMoveGO API

Your code is now uploaded to GitHub and ready for Render deployment!

## ✅ What's Done

- ✅ Code pushed to GitHub: https://github.com/SereneAura2/PackMoveGO-API
- ✅ Render configuration files created
- ✅ Deployment scripts ready
- ✅ Environment variables documented

## 🎯 Next Steps - Deploy to Render

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Sign in with your GitHub account

### Step 2: Create Blueprint
1. Click "New +" button
2. Select "Blueprint"
3. Connect your GitHub account if not already connected
4. Select the `PackMoveGO-API` repository

### Step 3: Render Will Auto-Detect Configuration
Render will automatically detect your `render.yaml` file and create:
- **Private API Service** (`pack-go-movers-api-private`)
- **Public Gateway Service** (`pack-go-movers-gateway`)

### Step 4: Set Environment Variables

#### For Private API Service:
Go to the private service → Environment tab and add:

```
NODE_ENV=production
SERVICE_TYPE=private
MONGODB_URI=mongodb+srv://admin:AOXFyNT4VT9II9zc@packmovego.9yxraau.mongodb.net/?retryWrites=true&w=majority&appName=PackMoveGo
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza191ZjVadVdRRmR1MFRJQkNNQmVaQjQiLCJhcGlfa2V5IjoiMDFLMEE3NEdZQVgzM0VNWjdFQkU0RjhUWFciLCJ0ZW5hbnRfaWQiOiJiOTQ3NWNmNGM4ZTc0MDI5OTE5Yzg0NDgyYjZmYzQ0ZDkwYmIzMDg4YWY0MDQ4ODhkNmUzMjcwYzAwZDY2N2Q0IiwiaW50ZXJuYWxfc2VjcmV0IjoiODBiNTRmNGYtZGRkMi00YWMzLWI5MjUtNTM0NTlkMDIyMWJmIn0.qC3Edzhp6cKoURWAM5mV2M6zAN24Y-iDbrcJDrhZSXg
JWT_SECRET=a131fba4ee1366460f9b1da9ae09e620076459338f7248af25eb09c3b9a613fc33e2b8b9a2b931246f74c6e7f7844a66214363d625e65cd138aa92e5d4691ce0
JWT_ACCESS_SECRET=a131fba4ee1366460f9b1da9ae09e620076459338f7248af25eb09c3b9a613fc33e2b8b9a2b931246f74c6e7f7844a66214363d625e65cd138aa92e5d4691ce0
JWT_REFRESH_SECRET=a131fba4ee1366460f9b1da9ae09e620076459338f7248af25eb09c3b9a613fc33e2b8b9a2b931246f74c6e7f7844a66214363d625e65cd138aa92e5d4691ce0
STRIPE_SECRET_KEY=sk_test_51RQf97G30oP5XDB4K2qGGlvmrVakLAvI9yA1wSv7MOgKHlVP0kWF2kpX1PHkDkUDpAItx02nTTXv8nklBlt47s0k00htF0jNc5
STRIPE_PUBLISHABLE_KEY=pk_test_51RQf97G30oP5XDB4roLF2jQJDPBv164W3ctElUIcrhiixITNJQOpzN24wHxJCSXRPXqNxVXv3E0BmWu6dSnjGlYL00ZqqJn1wS
EMAIL_USER=support@packmovego.com
EMAIL_PASSWORD=rE7WDXudXYCQscG
EMAIL_HOST=127.0.0.1
EMAIL_PORT=1025
EMAIL_SECURE=false
API_KEY_FRONTEND=pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6
API_KEY_ADMIN=pmg_admin_live_sk_m9x2c8v5b1n7q4w8e3r6t9y2u5i8o1p4
ADMIN_PASSWORD=packmovego2024
SSH_PASSWORD=packmovego2024
WEBHOOK_SECRET=packmovego_webhook_secret_2024
```

#### For Gateway Service:
Go to the gateway service → Environment tab and add:

```
NODE_ENV=production
SERVICE_TYPE=gateway
PRIVATE_API_URL=http://pack-go-movers-api-private:3000
JWT_SECRET=a131fba4ee1366460f9b1da9ae09e620076459338f7248af25eb09c3b9a613fc33e2b8b9a2b931246f74c6e7f7844a66214363d625e65cd138aa92e5d4691ce0
API_KEY_ENABLED=true
API_KEY_FRONTEND=pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6
```

### Step 5: Monitor Deployment
1. Watch the build logs in Render Dashboard
2. Check that both services start successfully
3. Test the health endpoints:
   - Gateway: `https://your-gateway-url.onrender.com/health`
   - Private API: `https://your-private-api-url.onrender.com/api/health`

## 🔗 Your URLs

After deployment, you'll get:
- **Gateway URL**: `https://pack-go-movers-gateway.onrender.com`
- **Private API URL**: `https://pack-go-movers-api-private.onrender.com`

## 🐛 If Something Goes Wrong

1. **Check Build Logs**: Look for TypeScript compilation errors
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Check Service Logs**: Monitor the runtime logs for errors
4. **Test Locally**: Run `npm run build` locally to catch issues

## 📞 Need Help?

- Check `RENDER_DEPLOYMENT.md` for detailed instructions
- Review the logs in Render Dashboard
- Test endpoints to ensure they're working

## 🎉 Success!

Once deployed, your API will be available at:
- **Public Gateway**: `https://pack-go-movers-gateway.onrender.com`
- **API Endpoints**: `https://pack-go-movers-gateway.onrender.com/api/*`

Your PackMoveGO API is now ready for production! 🚀 