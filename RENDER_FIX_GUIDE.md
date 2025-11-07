# Render Deployment Fix Guide

## Problem

Render services are failing with:
```
Error: Cannot find module '/opt/render/project/src/index.js'
```

This happens because Render dashboard has a hardcoded **Start Command** that overrides what's in the code.

---

## Solution: Update Render Dashboard Settings

You must manually update the Start Command in Render's dashboard for each service.

### Step 1: Update Private API Service

1. Go to https://dashboard.render.com
2. Click on **API_PackMoveGO** service
3. Click **Settings** tab
4. Scroll to **Build & Deploy** section
5. Find **Start Command** field
6. **Current value**: `node index.js` ❌
7. **Change to**: `npm run start:render:server` ✅
8. Click **Save Changes**
9. Service will automatically redeploy with correct command

### Step 2: Update Gateway Service

1. Go to https://dashboard.render.com
2. Click on **Gateway_API_PackMoveGO** service
3. Click **Settings** tab
4. Scroll to **Build & Deploy** section
5. Find **Start Command** field
6. **Change to**: `npm run start:render:gateway` ✅
7. Click **Save Changes**
8. Service will automatically redeploy

---

## Alternative: Use Direct Node Commands

If you prefer not to use npm scripts, you can set:

**Private API Service**:
```
node dist/src/server-entry.js
```

**Gateway Service**:
```
node dist/src/gateway/gateway-entry.js
```

---

## Why This Happens

1. **Render Dashboard Priority**: Start commands configured in Render's dashboard override everything else
2. **render.yaml Limitation**: The `render.yaml` file only applies when creating NEW services via Blueprint
3. **Existing Services**: Must be updated manually through the dashboard

---

## Verification

After updating the Start Command, check the deployment logs:

**Should see**:
```
==> Running 'npm run start:render:server'
> pack-go-movers-backend@1.0.0 start:render:server
> NODE_ENV=production node dist/src/server-entry.js

✅ Server started successfully
```

**Should NOT see**:
```
==> Running 'node index.js'
Error: Cannot find module '/opt/render/project/src/index.js'
```

---

## Package.json Scripts (Already Correct)

The npm scripts are already configured correctly:

```json
{
  "scripts": {
    "start:render:server": "NODE_ENV=production node dist/src/server-entry.js",
    "start:render:gateway": "NODE_ENV=production node dist/src/gateway/gateway-entry.js",
    "postinstall": "npm run build"
  }
}
```

- ✅ **postinstall**: Automatically builds TypeScript during `npm install`
- ✅ **start:render:server**: Runs the private API service
- ✅ **start:render:gateway**: Runs the gateway service

---

## Build Process (Already Working)

The build is working correctly:
```
==> Running build command 'npm install'...
> pack-go-movers-backend@1.0.0 postinstall
> npm run build
> pack-go-movers-backend@1.0.0 build
> tsc

==> Build successful 🎉
```

Only the **Start Command** needs to be fixed in the dashboard.

---

## Screenshots Guide

### Finding the Start Command Setting

1. **Dashboard** → Select your service
2. **Settings** tab
3. **Build & Deploy** section
4. Look for **Start Command** field (it will show `node index.js`)
5. Click the field to edit
6. Enter the correct command
7. Click **Save Changes** button at the bottom

---

## After Making Changes

1. Render will automatically trigger a new deployment
2. Watch the logs for the correct start command
3. Service should start successfully
4. Health checks should pass:
   - Private API: Check internal health endpoint
   - Gateway: Visit `https://api.packmovego.com/health`

---

## Support

If you continue to have issues:
- Check the deployment logs in Render dashboard
- Verify the Start Command was saved correctly
- Ensure environment variables are set
- Contact Render support if the setting won't save

---

## Summary

**The ONLY fix needed**: Update the **Start Command** in Render's dashboard for each service. Everything else in the code is already correct.

