#!/usr/bin/env node

const https = require('https');

async function mobileWebsiteDiagnostic() {
  console.log('📱 Mobile Website Diagnostic Tool');
  console.log('================================\n');
  
  // Test 1: Check if the frontend is accessible
  console.log('1️⃣ Testing Frontend Accessibility...');
  try {
    const frontendResponse = await makeRequest('https://packmovego-6x8w2t0kw-pack-move-go-frontend.vercel.app', '/');
    console.log(`✅ Frontend Status: ${frontendResponse.statusCode}`);
    console.log(`   Content-Type: ${frontendResponse.headers['content-type'] || 'Unknown'}`);
  } catch (error) {
    console.log(`❌ Frontend Error: ${error.message}`);
  }
  
  // Test 2: Check API endpoints from mobile perspective
  console.log('\n2️⃣ Testing API from Mobile Perspective...');
  const mobileHeaders = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  };
  
  const apiEndpoints = [
    '/v0/nav',
    '/v0/services', 
    '/v0/testimonials'
  ];
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await makeApiRequest(endpoint, mobileHeaders);
      console.log(`✅ ${endpoint}: ${response.statusCode} (CORS: ${response.headers['access-control-allow-origin'] || 'NOT SET'})`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
  
  // Test 3: Test with different mobile scenarios
  console.log('\n3️⃣ Testing Different Mobile Scenarios...');
  
  const scenarios = [
    {
      name: 'iPhone Safari (No Origin)',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json, text/plain, */*'
      }
    },
    {
      name: 'Android Chrome (No Origin)',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    },
    {
      name: 'Mobile with Vercel Origin',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        'Origin': 'https://packmovego-6x8w2t0kw-pack-move-go-frontend.vercel.app',
        'Accept': 'application/json, text/plain, */*'
      }
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`   📱 ${scenario.name}:`);
    try {
      const response = await makeApiRequest('/v0/nav', scenario.headers);
      console.log(`      Status: ${response.statusCode}`);
      console.log(`      CORS: ${response.headers['access-control-allow-origin'] || 'NOT SET'}`);
    } catch (error) {
      console.log(`      Error: ${error.message}`);
    }
  }
  
  // Test 4: Check for common mobile issues
  console.log('\n4️⃣ Checking Common Mobile Issues...');
  
  // Test network connectivity
  try {
    const startTime = Date.now();
    await makeApiRequest('/api/health', {});
    const latency = Date.now() - startTime;
    console.log(`✅ Network Latency: ${latency}ms`);
  } catch (error) {
    console.log(`❌ Network Issue: ${error.message}`);
  }
  
  // Test SSL certificate
  try {
    const response = await makeApiRequest('/api/health', {});
    console.log(`✅ SSL Certificate: Valid`);
  } catch (error) {
    console.log(`❌ SSL Certificate Issue: ${error.message}`);
  }
  
  console.log('\n📱 Mobile Troubleshooting Steps:');
  console.log('1. Clear your phone browser cache completely');
  console.log('2. Try opening in incognito/private browsing mode');
  console.log('3. Switch between WiFi and mobile data');
  console.log('4. Try a different browser on your phone');
  console.log('5. Check if you have any VPN or proxy enabled');
  console.log('6. Try accessing the website directly: https://packmovego-6x8w2t0kw-pack-move-go-frontend.vercel.app');
  console.log('7. Check your phone\'s date/time settings');
  console.log('8. Try disabling any content blockers or ad blockers');
  console.log('9. Check if JavaScript is enabled in your browser');
  console.log('10. Try restarting your phone');
  
  console.log('\n🔍 If the issue persists, try these URLs directly on your phone:');
  console.log('• https://api.packmovego.com/v0/nav');
  console.log('• https://api.packmovego.com/v0/services');
  console.log('• https://api.packmovego.com/v0/testimonials');
}

function makeRequest(hostname, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname.replace('https://', ''),
      port: 443,
      path: path,
      method: 'GET',
      headers: headers
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

function makeApiRequest(path, headers = {}) {
  return makeRequest('api.packmovego.com', path, headers);
}

// Run the diagnostic
mobileWebsiteDiagnostic().catch(console.error); 