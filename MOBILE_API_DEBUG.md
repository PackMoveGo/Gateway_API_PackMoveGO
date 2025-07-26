# Mobile API Debugging Guide

## Current Issues Fixed

### 1. SSH Server Disabled
- ✅ Removed SSH server import from main server
- ✅ SSH server no longer auto-starts in production
- ✅ Deployment should now work without SSH key file errors

### 2. MongoDB Connection Improved
- ✅ Made MongoDB connection more robust
- ✅ App continues working even if MongoDB is not available
- ✅ Increased connection timeout and added retry logic

### 3. Mobile API Endpoints Enhanced
- ✅ Simplified CORS headers for mobile requests
- ✅ Added multiple mobile test endpoints
- ✅ Improved error handling and logging

## Mobile API Endpoints

### Test Endpoints (No Authentication Required)

1. **Health Check**: `https://api.packmovego.com/mobile/health`
   ```json
   {
     "status": "ok",
     "mobile": true,
     "userAgent": "...",
     "timestamp": "2025-07-26T05:34:42.654Z",
     "backend": "active",
     "ip": "client_ip"
   }
   ```

2. **Simple Test**: `https://api.packmovego.com/mobile/test`
   ```json
   {
     "message": "Mobile test endpoint working",
     "timestamp": "2025-07-26T05:34:42.654Z",
     "status": "ok"
   }
   ```

3. **API Root**: `https://api.packmovego.com/mobile/api`
   ```json
   {
     "message": "PackMoveGO Mobile API",
     "version": "1.0.0",
     "status": "active",
     "timestamp": "2025-07-26T05:34:42.654Z",
     "endpoints": {
       "health": "/mobile/health",
       "test": "/mobile/test",
       "data": "/mobile/v0/:name",
       "root": "/mobile"
     }
   }
   ```

4. **Mobile Root**: `https://api.packmovego.com/mobile`
   ```json
   {
     "message": "Mobile API working",
     "timestamp": "2025-07-26T05:34:42.654Z",
     "userAgent": "...",
     "ip": "client_ip"
   }
   ```

### Data Endpoints

5. **Mobile Data**: `https://api.packmovego.com/mobile/v0/:name`
   - Available names: `blog`, `about`, `nav`, `contact`, `referral`, `reviews`, `locations`, `supplies`, `services`, `testimonials`

## Testing Commands

### Local Testing
```bash
# Test health endpoint
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" http://localhost:3001/mobile/health

# Test simple endpoint
curl http://localhost:3001/mobile/test

# Test API root
curl http://localhost:3001/mobile/api

# Test mobile root
curl http://localhost:3001/mobile
```

### Production Testing
```bash
# Test health endpoint
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" https://api.packmovego.com/mobile/health

# Test simple endpoint
curl https://api.packmovego.com/mobile/test

# Test API root
curl https://api.packmovego.com/mobile/api

# Test mobile root
curl https://api.packmovego.com/mobile
```

## Mobile App Integration

### JavaScript/Fetch Example
```javascript
// Test mobile API
async function testMobileAPI() {
  try {
    const response = await fetch('https://api.packmovego.com/mobile/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PackMoveGO-Mobile/1.0'
      }
    });
    
    const data = await response.json();
    console.log('Mobile API Response:', data);
    return data;
  } catch (error) {
    console.error('Mobile API Error:', error);
    throw error;
  }
}

// Test mobile data endpoint
async function getMobileData(dataName) {
  try {
    const response = await fetch(`https://api.packmovego.com/mobile/v0/${dataName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log(`Mobile Data (${dataName}):`, data);
    return data;
  } catch (error) {
    console.error('Mobile Data Error:', error);
    throw error;
  }
}
```

### React Native Example
```javascript
// React Native mobile API test
const testMobileAPI = async () => {
  try {
    const response = await fetch('https://api.packmovego.com/mobile/health');
    const data = await response.json();
    console.log('Mobile API working:', data);
    return data;
  } catch (error) {
    console.error('Mobile API failed:', error);
    throw error;
  }
};
```

## Troubleshooting

### If Mobile API is Not Working

1. **Check Server Status**
   ```bash
   curl https://api.packmovego.com/api/health
   ```

2. **Check Mobile Health**
   ```bash
   curl https://api.packmovego.com/mobile/health
   ```

3. **Check CORS Headers**
   ```bash
   curl -I -H "Origin: https://your-app.com" https://api.packmovego.com/mobile/health
   ```

4. **Check Network Connectivity**
   ```bash
   ping api.packmovego.com
   nslookup api.packmovego.com
   ```

### Common Issues

1. **CORS Errors**: All mobile endpoints now use `Access-Control-Allow-Origin: *`
2. **Network Timeout**: Increased MongoDB connection timeout
3. **Authentication**: Mobile endpoints don't require authentication
4. **SSL/HTTPS**: All production endpoints use HTTPS

### Debug Logs

The server logs will show:
- `📱 MOBILE HEALTH: Request from IP - User-Agent`
- `📱 MOBILE DATA: GET /mobile/v0/name from IP`
- `📱 SIMPLE MOBILE: Request from IP - User-Agent`
- `📱 MOBILE API ROOT: Request from IP - User-Agent`

## Deployment Status

- ✅ Build process working
- ✅ SSH server disabled
- ✅ MongoDB connection improved
- ✅ Mobile endpoints enhanced
- ✅ CORS headers simplified
- ✅ Error handling improved

## Next Steps

1. **Deploy the updated code**
2. **Test mobile endpoints from your phone**
3. **Check server logs for mobile requests**
4. **Verify CORS headers are working**
5. **Test data endpoints if needed**

The mobile API should now work properly with your phone app! 