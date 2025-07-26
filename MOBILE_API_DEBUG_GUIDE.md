# 📱 Mobile API Debug Guide

## 🔍 **Problem Analysis**

Your API works on desktop browsers but fails on mobile devices. This is a common issue with several possible causes:

### **Common Causes:**

1. **CORS Configuration Issues**
   - Mobile browsers have stricter CORS policies
   - Different origin handling on mobile
   - Preflight request failures

2. **User-Agent Detection Problems**
   - Mobile detection logic too restrictive
   - Different user agent patterns on mobile

3. **Network/Connectivity Issues**
   - Mobile network restrictions
   - DNS resolution differences
   - SSL/TLS certificate issues

4. **Request Header Differences**
   - Mobile browsers send different headers
   - Missing required headers
   - Header format differences

## 🛠️ **Debugging Steps**

### **Step 1: Run the Mobile Debug Test**

```bash
# Run the comprehensive mobile API test
node test-mobile-api.js
```

This will test your API with different user agents and identify specific issues.

### **Step 2: Test Individual Endpoints**

Open your mobile browser and test these URLs directly:

```
https://api.packmovego.com/api/health
https://api.packmovego.com/v0/nav
https://api.packmovego.com/mobile/health
https://api.packmovego.com/mobile/v0/nav
```

### **Step 3: Check Browser Developer Tools**

1. **On Desktop:**
   - Open Chrome DevTools
   - Go to Network tab
   - Toggle device simulation (mobile view)
   - Test your API calls

2. **On Mobile:**
   - Use browser's developer tools if available
   - Check console for error messages
   - Monitor network requests

### **Step 4: Test with Different Mobile Browsers**

Test your API with:
- Safari (iOS)
- Chrome (Android)
- Firefox (Mobile)
- Samsung Internet

## 🔧 **Quick Fixes**

### **Fix 1: Universal CORS Headers**

Your server now has universal CORS headers that should work for all devices:

```javascript
// This is already implemented in your server.ts
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-api-key,X-Requested-With,Accept,Origin');
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,HEAD');
```

### **Fix 2: Mobile-Specific Endpoints**

Use these mobile-optimized endpoints:

```javascript
// Instead of /v0/nav, try:
fetch('https://api.packmovego.com/mobile/v0/nav')

// Instead of /api/health, try:
fetch('https://api.packmovego.com/mobile/health')
```

### **Fix 3: Enhanced Mobile Detection**

Your server now has better mobile detection:

```javascript
const isMobile = userAgent.includes('Mobile') || 
                 userAgent.includes('iPhone') || 
                 userAgent.includes('Android') || 
                 userAgent.includes('iPad') ||
                 userAgent.includes('Safari') || 
                 userAgent.includes('Chrome') || 
                 userAgent.includes('Firefox') ||
                 userAgent.includes('Edge') ||
                 userAgent.includes('Opera');
```

## 🧪 **Testing Tools**

### **1. Mobile Debug HTML Page**

Open `mobile-debug.html` in your mobile browser to test:

```bash
# Serve the debug page locally
python -m http.server 8000
# Then visit http://localhost:8000/mobile-debug.html on your phone
```

### **2. Node.js Test Script**

Run the comprehensive test:

```bash
node test-mobile-api.js
```

### **3. Browser Console Tests**

Open your mobile browser console and run:

```javascript
// Test basic connectivity
fetch('https://api.packmovego.com/api/health')
  .then(response => response.json())
  .then(data => console.log('✅ Health check:', data))
  .catch(error => console.error('❌ Error:', error));

// Test navigation data
fetch('https://api.packmovego.com/v0/nav')
  .then(response => response.json())
  .then(data => console.log('✅ Nav data:', data))
  .catch(error => console.error('❌ Error:', error));

// Test mobile endpoint
fetch('https://api.packmovego.com/mobile/health')
  .then(response => response.json())
  .then(data => console.log('✅ Mobile health:', data))
  .catch(error => console.error('❌ Error:', error));
```

## 📊 **Common Error Patterns**

### **Error 1: CORS Error**
```
Access to fetch at 'https://api.packmovego.com/api/health' from origin 'https://www.packmovego.com' has been blocked by CORS policy
```

**Solution:** Check CORS headers in server response

### **Error 2: Network Error**
```
Failed to fetch
```

**Solution:** Check network connectivity and DNS resolution

### **Error 3: Timeout Error**
```
Request timeout
```

**Solution:** Check server response time and mobile network speed

### **Error 4: SSL Error**
```
SSL certificate error
```

**Solution:** Check SSL certificate validity

## 🔍 **Server Log Analysis**

Check your server logs for these patterns:

```
📱 MOBILE REQUEST DETECTED: [User-Agent]
✅ CORS: Set origin header for [Origin]
✅ RESPONSE: [Method] [Path] - Status: [Code] - Mobile: Yes
```

If you see these logs, mobile requests are being processed correctly.

## 🚀 **Deployment Checklist**

### **Before Testing:**

1. ✅ Server is running and accessible
2. ✅ CORS headers are properly set
3. ✅ Mobile endpoints are implemented
4. ✅ SSL certificate is valid
5. ✅ DNS is properly configured

### **Testing Checklist:**

1. ✅ Test with different mobile browsers
2. ✅ Test on different mobile networks (WiFi, 4G, 5G)
3. ✅ Test with different mobile devices
4. ✅ Check server logs for mobile requests
5. ✅ Verify CORS headers in responses

## 🎯 **Quick Diagnostic Commands**

### **Test Basic Connectivity:**
```bash
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" https://api.packmovego.com/api/health
```

### **Test CORS Headers:**
```bash
curl -H "Origin: https://www.packmovego.com" -H "Access-Control-Request-Method: GET" -X OPTIONS https://api.packmovego.com/api/health
```

### **Test Mobile Endpoint:**
```bash
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" https://api.packmovego.com/mobile/health
```

## 📱 **Mobile-Specific Endpoints**

Your server now provides these mobile-optimized endpoints:

- `/mobile/health` - Mobile health check
- `/mobile/v0/nav` - Mobile navigation data
- `/mobile/v0/services` - Mobile services data
- `/mobile/v0/testimonials` - Mobile testimonials
- `/mobile/v0/contact` - Mobile contact data

## 🔧 **Frontend Integration**

Update your frontend to use mobile-specific endpoints when on mobile:

```javascript
// Detect mobile device
const isMobile = /Mobile|iPhone|Android|iPad/.test(navigator.userAgent);

// Use appropriate endpoint
const endpoint = isMobile ? '/mobile/v0/nav' : '/v0/nav';

fetch(`https://api.packmovego.com${endpoint}`)
  .then(response => response.json())
  .then(data => {
    // Handle data
  });
```

## 📞 **Next Steps**

1. **Run the test script** to identify specific issues
2. **Check server logs** for mobile request patterns
3. **Test with different mobile browsers**
4. **Update frontend** to use mobile endpoints if needed
5. **Monitor performance** and response times

## 🆘 **Still Having Issues?**

If the problem persists:

1. **Check server logs** for detailed error messages
2. **Test with different mobile devices**
3. **Verify network connectivity**
4. **Check SSL certificate validity**
5. **Test with different mobile browsers**

The debugging tools provided will help identify the exact cause of the mobile API issues. 