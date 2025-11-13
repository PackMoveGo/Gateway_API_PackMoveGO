# 📋 Backend Deployment Checklist

Use this checklist when deploying the backend to Render.

---

## ✅ Pre-Deployment

- [ ] Local testing works (`npm run dev`)
- [ ] MongoDB Atlas database created
- [ ] MongoDB connection string obtained
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

---

## 🔧 Render Configuration

### Gateway Service (Public Web Service)

**Service Settings**:
- [ ] Type: **Web Service**
- [ ] Name: `packmovego-gateway`
- [ ] Environment: **Node**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm run start:render:gateway`
- [ ] Plan: **Starter** (recommended) or Free

**Environment Variables** (Required):

```bash
NODE_ENV=production
SERVICE_TYPE=gateway

# Security
API_KEY_FRONTEND=pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6
API_KEY_ADMIN=pmg_admin_live_sk_m9x2c8v5b1n7q4w8e3r6t9y2u5i8o1p4
API_KEY_ENABLED=true

# IMPORTANT: Generate this - see docs
JWT_SECRET=[YOUR_32_CHAR_RANDOM_STRING]

# Database
MONGODB_URI=[YOUR_MONGODB_CONNECTION_STRING]

# Gateway connection (set after creating private service)
PRIVATE_API_URL=http://packmovego-api-private:10000

# CORS
CORS_ORIGIN=https://www.packmovego.com,https://packmovego.com
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,x-api-key

# Optional but recommended
ARCJET_KEY=[YOUR_ARCJET_KEY]
STRIPE_SECRET_KEY=[YOUR_STRIPE_KEY]
EMAIL_USER=[YOUR_EMAIL]
EMAIL_PASSWORD=[YOUR_EMAIL_PASSWORD]
```

### Private API Service (Optional - Advanced)

**Service Settings**:
- [ ] Type: **Private Service**
- [ ] Name: `packmovego-api-private`
- [ ] Environment: **Node**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm run start:render:server`
- [ ] Plan: **Starter**

**Note**: For simpler deployment, you can use just the Gateway service initially.

---

## 🌐 Domain Configuration

### Add Custom Domain in Render
- [ ] Go to Gateway service → Settings → Custom Domain
- [ ] Add: `api.packmovego.com`
- [ ] Copy CNAME value provided by Render

### DNS Records (Add in your domain registrar)

```
Type: CNAME
Name: api
Value: [your-render-service].onrender.com
TTL: Auto
```

---

## 🚀 Deployment

- [ ] Create service in Render
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~3-5 minutes)
- [ ] Check deployment logs for errors

---

## ✅ Post-Deployment Verification

### Test Render URL
- [ ] Health endpoint works:
  ```bash
  curl https://[your-service].onrender.com/health
  # Expected: {"status":"ok","timestamp":"..."}
  ```

- [ ] Protected endpoint without key fails:
  ```bash
  curl https://[your-service].onrender.com/v0/services
  # Expected: 401 Unauthorized
  ```

- [ ] Protected endpoint with key works:
  ```bash
  curl -H "x-api-key: pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6" \
    https://[your-service].onrender.com/v0/services
  # Expected: Service data
  ```

### Test Custom Domain (After DNS Propagation)
- [ ] `curl https://api.packmovego.com/health`
- [ ] Returns proper response
- [ ] SSL certificate active
- [ ] No redirect errors

---

## 🧪 Integration Testing

### Database Connection
- [ ] Check Render logs for "MongoDB connected"
- [ ] Test data retrieval endpoints
- [ ] Test data creation endpoints

### Security
- [ ] Requests without API key rejected
- [ ] Requests with valid API key accepted
- [ ] CORS headers present
- [ ] Arcjet protection active (if configured)

---

## 📊 Monitoring Setup

- [ ] Health check configured: `/health`
- [ ] Auto-deploy enabled
- [ ] Email notifications enabled
- [ ] Review Render metrics dashboard

---

## 🐛 Troubleshooting

### Build Fails
**Check**: Build logs in Render dashboard
**Common issues**:
- `npm install` fails → Check `package.json`
- TypeScript errors → Fix in code
- Missing dependencies → Add to `package.json`

### Service Crashes on Start
**Check**: Service logs in Render dashboard
**Common issues**:
- Wrong start command → Should be `npm run start:render:gateway`
- Missing `MONGODB_URI` → Add in environment variables
- Invalid connection string → Verify MongoDB URI

### "Cannot find module" Error
**Cause**: Build succeeded but files not in expected location
**Fix**: Verify start command is correct:
```bash
npm run start:render:gateway
```

### Database Connection Fails
**Check**: 
1. MongoDB URI format correct
2. MongoDB network access allows `0.0.0.0/0`
3. Database user credentials correct

**Fix**: Update MongoDB network access in Atlas dashboard

### Health Check Fails
**Check**: `/health` endpoint responds
**Fix**: 
1. Verify service is running (check logs)
2. Check health check path in Render settings
3. Ensure port is correct (default: 10000)

---

## 🔄 Updates & Redeployment

### After Environment Variable Changes
1. Go to Render Dashboard
2. Update environment variable
3. Click "Save"
4. Service automatically redeploys

### After Code Changes
1. Push to GitHub
2. Render automatically detects changes
3. Builds and deploys
4. Monitor in Render dashboard

### Manual Redeploy
1. Go to Render Dashboard
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"

---

## ✅ Success Criteria

Deployment is successful when:
- [ ] Build completes without errors
- [ ] Service shows "Live" status
- [ ] Health endpoint returns 200
- [ ] MongoDB connected (check logs)
- [ ] API key validation works
- [ ] CORS configured correctly
- [ ] Custom domain accessible (after DNS)
- [ ] SSL certificate active

---

## 🔐 Security Verification

- [ ] API key required for protected endpoints
- [ ] Invalid keys rejected (401)
- [ ] CORS only allows specified origins
- [ ] HTTPS enforced
- [ ] Rate limiting active (if Arcjet configured)
- [ ] Error messages don't leak sensitive info

---

## 📝 Post-Deployment Tasks

- [ ] Test all API endpoints
- [ ] Verify frontend can connect
- [ ] Set up monitoring alerts
- [ ] Configure database backups
- [ ] Document any custom configuration
- [ ] Share API documentation with team

---

**Need Help?** See parent directory's `DEPLOYMENT_PLAN.md` for detailed troubleshooting.

**Important Commands**:
```bash
# Test health
curl https://api.packmovego.com/health

# Test with API key
curl -H "x-api-key: pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6" \
  https://api.packmovego.com/v0/services

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

