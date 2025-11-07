# Render Deployment Instructions

## Quick Fix for Current Deployment Error

Your services are failing because Render is using the wrong start command. Follow these steps:

### 🔧 Fix Private API Service (2 minutes)

1. Open https://dashboard.render.com
2. Click on **API_PackMoveGO** service
3. Go to **Settings** tab
4. Find **Start Command** (under Build & Deploy)
5. Change from `node index.js` to:
   ```
   npm run start:render:server
   ```
6. Click **Save Changes** at the bottom
7. Wait for automatic redeploy (~2 minutes)

### 🔧 Fix Gateway Service (2 minutes)

1. In Render dashboard, click on **Gateway_API_PackMoveGO** service
2. Go to **Settings** tab  
3. Find **Start Command** (under Build & Deploy)
4. Change to:
   ```
   npm run start:render:gateway
   ```
5. Click **Save Changes**
6. Wait for automatic redeploy (~2 minutes)

---

## ✅ Verify Deployment

After both services redeploy, check:

**Private API Service Logs** should show:
```
==> Running 'npm run start:render:server'
> NODE_ENV=production node dist/src/server-entry.js
✓ Server listening on port 10000
✓ MongoDB connected
```

**Gateway Service** should be accessible at:
```
https://api.packmovego.com/health
```

---

## 📋 Complete Service Configuration

### Private Service (API_PackMoveGO)

| Setting | Value |
|---------|-------|
| **Name** | `packmovego-api-private` or `API_PackMoveGO` |
| **Type** | Private Service |
| **Repo** | https://github.com/PackMoveGo/API_PackMoveGO |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start:render:server` |
| **Plan** | Starter (for load balancing) |
| **Health Check Path** | `/api/health` |

**Environment Variables** (Required):
```bash
NODE_ENV=production
SERVICE_TYPE=private
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
CORS_ORIGIN=https://www.packmovego.com,https://packmovego.com
API_KEY_FRONTEND=pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6
```

### Gateway Service (Gateway_API_PackMoveGO)

| Setting | Value |
|---------|-------|
| **Name** | `packmovego-gateway` or `Gateway_API_PackMoveGO` |
| **Type** | Web Service |
| **Repo** | https://github.com/PackMoveGo/Gateway_API_PackMoveGO |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start:render:gateway` |
| **Plan** | Starter |
| **Health Check Path** | `/health` |
| **Custom Domain** | `api.packmovego.com` |

**Environment Variables** (Required):
```bash
NODE_ENV=production
SERVICE_TYPE=gateway
PRIVATE_API_URL=http://api-packmovego-13vw:10000
JWT_SECRET=your_secret_here
API_KEY_FRONTEND=pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6
API_KEY_ENABLED=true
ARCJET_KEY=your_arcjet_key
CORS_ORIGIN=https://www.packmovego.com,https://packmovego.com
```

---

## 🚨 Common Issues

### Issue: "Cannot find module '/opt/render/project/src/index.js'"

**Cause**: Start Command in dashboard is set to `node index.js`

**Fix**: Update Start Command to `npm run start:render:server` (for private) or `npm run start:render:gateway` (for gateway)

### Issue: "concurrently: not found"

**Cause**: This should be fixed now (concurrently moved to dependencies)

**Verify**: Check package.json has concurrently in dependencies, not devDependencies

### Issue: Build succeeds but deploy fails

**Cause**: Wrong start command or missing environment variables

**Fix**: 
1. Verify Start Command is correct
2. Check all required environment variables are set
3. Review deployment logs for specific error

---

## 📦 How the Build Works

1. **npm install** runs (triggers postinstall hook)
2. **postinstall** runs `npm run build`
3. **npm run build** compiles TypeScript with `tsc`
4. **Build Output**: Files created in `dist/` directory
   - `dist/src/server-entry.js` (Private API entry point)
   - `dist/src/gateway/gateway-entry.js` (Gateway entry point)
5. **Start Command** runs and uses the compiled files

---

## 🔄 Future Deployments

After fixing the Start Command once:
- Push code to GitHub
- Render automatically detects changes
- Builds and deploys with correct Start Command
- No manual intervention needed

---

## 📞 Need Help?

1. **Check Logs**: Render Dashboard → Your Service → Logs tab
2. **Verify Settings**: Settings tab → Build & Deploy section
3. **GitHub Status**: Ensure latest commits are pushed
4. **Environment Variables**: Settings tab → Environment section

If issues persist, see `RENDER_FIX_GUIDE.md` for detailed troubleshooting.

