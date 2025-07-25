#!/usr/bin/env node

const https = require('https');

const API_BASE = 'https://api.packmovego.com';

console.log(`
🎯 WATCHING FOR DEPLOYMENT FIX
===============================
Your IP: 173.230.100.254
Expected: Should be in ALLOWED_IPS list
Current Status: Being deployed...

`);

function makeRequest(endpoint, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(endpoint, API_BASE);
    const requestOptions = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Deployment-Watcher',
        ...headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ status: res.statusCode, data: response });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', () => resolve({ status: 'ERROR' }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT' });
    });

    req.end();
  });
}

let attempt = 1;

async function checkDeploymentStatus() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Check #${attempt}:`);
  
  // Test 1: Core API (should work regardless)
  const coreTest = await makeRequest('/v0/services');
  console.log(`   ✅ Core API: ${coreTest.status} ${coreTest.status === 200 ? '(Working)' : '(Issue)'}`);
  
  // Test 2: Direct IP access (main test)
  const ipTest = await makeRequest('/api/analytics/health');
  if (ipTest.status === 200) {
    console.log(`   🎉 IP WHITELIST: WORKING! (Analytics accessible)`);
    console.log(`\n🎊 SUCCESS! Your IP (173.230.100.254) is now whitelisted!`);
    console.log(`✅ Backend is fully operational for your IP address.`);
    console.log(`🔗 Test URL: ${API_BASE}/v0/services`);
    process.exit(0);
  } else if (ipTest.status === 403) {
    console.log(`   🔄 IP Whitelist: Still deploying (403 - Access denied)`);
  } else if (ipTest.status === 302) {
    console.log(`   🔄 IP Whitelist: Deploying (302 - Redirecting)`);
  } else {
    console.log(`   ❓ IP Whitelist: Status ${ipTest.status}`);
  }
  
  // Test 3: Health check
  const healthTest = await makeRequest('/api/health');
  console.log(`   ✅ Health Check: ${healthTest.status} ${healthTest.status === 200 ? '(Healthy)' : ''}`);
  
  attempt++;
  console.log(`   ⏳ Checking again in 15 seconds...\n`);
}

async function startWatching() {
  console.log('🔍 Starting deployment monitoring...');
  console.log('Press Ctrl+C to stop\n');
  
  // Check immediately
  await checkDeploymentStatus();
  
  // Then check every 15 seconds
  const interval = setInterval(async () => {
    await checkDeploymentStatus();
    
    // Stop after 40 checks (10 minutes)
    if (attempt > 40) {
      console.log('\n⏰ Monitoring timeout reached (10 minutes)');
      console.log('📧 Please check Render dashboard for deployment status');
      console.log('🔧 Manual verification: curl https://api.packmovego.com/v0/services');
      clearInterval(interval);
      process.exit(1);
    }
  }, 15000);
}

startWatching().catch(console.error); 