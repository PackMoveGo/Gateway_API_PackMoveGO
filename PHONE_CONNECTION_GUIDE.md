# Phone Connection Guide

## Current Status
✅ **Production API Working**: Your phone can access `https://api.packmovego.com`
❌ **Local Development**: Phone can't connect to your local server

## Solutions

### Option 1: Use Production API (Recommended)
Since your phone can already access the production API, use that for testing:

**Mobile API Endpoints:**
- `https://api.packmovego.com/mobile/health`
- `https://api.packmovego.com/mobile/test`
- `https://api.packmovego.com/mobile/api`
- `https://api.packmovego.com/mobile/v0/blog`
- `https://api.packmovego.com/mobile/v0/services`

### Option 2: Connect to Local Server

#### Step 1: Check Network Connection
```bash
# On your Mac, find your IP address
ifconfig | grep "inet " | grep -v 127.0.0.1
```

#### Step 2: Start Server on All Interfaces
```bash
# Start server on all network interfaces
PORT=3001 npm run dev:backend
```

#### Step 3: Configure Firewall
```bash
# Allow incoming connections on port 3001
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/local/bin/node
```

#### Step 4: Test Connection
Try these URLs on your phone:
- `http://YOUR_MAC_IP:3001/mobile/health`
- `http://YOUR_MAC_IP:3001/mobile/test`

### Option 3: Use ngrok (Tunnel)
```bash
# Install ngrok
brew install ngrok

# Start your server
PORT=3001 npm run dev:backend

# In another terminal, create tunnel
ngrok http 3001

# Use the ngrok URL on your phone
# Example: https://abc123.ngrok.io/mobile/health
```

### Option 4: Use Production for Development
Since the production API is working, you can:

1. **Deploy frequently** to test changes
2. **Use production endpoints** for mobile testing
3. **Test locally** only for backend logic

## Quick Test Commands

### Test Production API from Phone
```bash
# These should work on your phone
curl https://api.packmovego.com/mobile/health
curl https://api.packmovego.com/mobile/test
curl https://api.packmovego.com/mobile/api
```

### Test Local API from Computer
```bash
# Test local server
curl http://localhost:3001/mobile/health
curl http://localhost:3001/mobile/test
```

## Mobile App Integration

### Use Production API in Your App
```javascript
// Use production API for mobile testing
const API_BASE = 'https://api.packmovego.com';

async function testMobileAPI() {
  try {
    const response = await fetch(`${API_BASE}/mobile/health`);
    const data = await response.json();
    console.log('Mobile API working:', data);
    return data;
  } catch (error) {
    console.error('Mobile API failed:', error);
    throw error;
  }
}

async function getMobileData(dataName) {
  try {
    const response = await fetch(`${API_BASE}/mobile/v0/${dataName}`);
    const data = await response.json();
    console.log(`Mobile Data (${dataName}):`, data);
    return data;
  } catch (error) {
    console.error('Mobile Data Error:', error);
    throw error;
  }
}
```

## Troubleshooting

### If Production API Stops Working
1. Check if server is running: `curl https://api.packmovego.com/api/health`
2. Check mobile endpoints: `curl https://api.packmovego.com/mobile/health`
3. Check server logs on Render dashboard

### If Local Connection Fails
1. Ensure phone and computer are on same WiFi
2. Check firewall settings
3. Try different port (3002, 3003, etc.)
4. Use ngrok as alternative

### Network Issues
- Some corporate networks block device-to-device communication
- Some public WiFi networks isolate devices
- Try using mobile hotspot from your phone

## Recommended Approach

**For Mobile Development:**
1. Use production API endpoints for testing
2. Deploy changes frequently to test
3. Use local server only for backend development
4. Test mobile app with production API

**For Backend Development:**
1. Use local server for API development
2. Test with curl/Postman locally
3. Deploy to test mobile integration
4. Use production for final mobile testing

## Current Working Endpoints

Your phone can access these production endpoints:
- ✅ `https://api.packmovego.com/mobile/health`
- ✅ `https://api.packmovego.com/mobile/test`
- ✅ `https://api.packmovego.com/mobile/api`
- ✅ `https://api.packmovego.com/mobile/v0/blog`
- ✅ `https://api.packmovego.com/mobile/v0/services`

Use these for your mobile app development! 