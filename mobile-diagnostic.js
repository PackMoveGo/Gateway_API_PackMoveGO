#!/usr/bin/env node

const https = require('https');
const dns = require('dns').promises;

async function mobileDiagnostic() {
  console.log('🔍 Mobile API Diagnostic Tool');
  console.log('=============================\n');
  
  // 1. DNS Resolution
  console.log('1️⃣ Testing DNS Resolution...');
  try {
    const addresses = await dns.resolve4('api.packmovego.com');
    console.log(`✅ DNS Resolution: ${addresses.join(', ')}`);
  } catch (error) {
    console.log(`❌ DNS Resolution failed: ${error.message}`);
  }
  
  // 2. SSL Certificate
  console.log('\n2️⃣ Testing SSL Certificate...');
  try {
    const response = await makeRequest('/api/health', {}, 'GET');
    console.log(`✅ SSL Certificate: Valid`);
    console.log(`   Server: ${response.headers.server || 'Unknown'}`);
    console.log(`   Powered by: ${response.headers['x-powered-by'] || 'Unknown'}`);
  } catch (error) {
    console.log(`❌ SSL Certificate failed: ${error.message}`);
  }
  
  // 3. Basic Connectivity
  console.log('\n3️⃣ Testing Basic Connectivity...');
  try {
    const response = await makeRequest('/api/health', {}, 'GET');
    console.log(`✅ Basic Connectivity: ${response.statusCode}`);
  } catch (error) {
    console.log(`❌ Basic Connectivity failed: ${error.message}`);
  }
  
  // 4. CORS with different scenarios
  console.log('\n4️⃣ Testing CORS Scenarios...');
  
  const scenarios = [
    { name: 'Desktop Chrome', origin: 'https://www.packmovego.com' },
    { name: 'Mobile Safari', origin: 'https://www.packmovego.com' },
    { name: 'No Origin', origin: null },
    { name: 'Wrong Origin', origin: 'https://google.com' }
  ];
  
  for (const scenario of scenarios) {
    try {
      const headers = scenario.origin ? { 'Origin': scenario.origin } : {};
      const response = await makeRequest('/v0/nav', headers, 'GET');
      console.log(`✅ ${scenario.name}: ${response.statusCode} (CORS: ${response.headers['access-control-allow-origin'] || 'NOT SET'})`);
    } catch (error) {
      console.log(`❌ ${scenario.name}: ${error.message}`);
    }
  }
  
  // 5. Network latency
  console.log('\n5️⃣ Testing Network Latency...');
  const startTime = Date.now();
  try {
    await makeRequest('/api/health', {}, 'GET');
    const latency = Date.now() - startTime;
    console.log(`✅ Network Latency: ${latency}ms`);
  } catch (error) {
    console.log(`❌ Network Latency test failed: ${error.message}`);
  }
  
  console.log('\n📱 Mobile Troubleshooting Tips:');
  console.log('1. Clear your phone browser cache');
  console.log('2. Try opening in incognito/private mode');
  console.log('3. Check if you\'re on WiFi or mobile data');
  console.log('4. Try a different browser on your phone');
  console.log('5. Check if your phone has any VPN or proxy');
  console.log('6. Try accessing the website directly: https://www.packmovego.com');
}

function makeRequest(path, headers = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.packmovego.com',
      port: 443,
      path: path,
      method: method,
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

// Run the diagnostic
mobileDiagnostic().catch(console.error); 