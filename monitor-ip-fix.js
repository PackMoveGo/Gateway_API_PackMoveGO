#!/usr/bin/env node

const https = require('https');

const API_BASE = 'https://api.packmovego.com';
const ADMIN_API_KEY = 'pmg_admin_live_sk_m9x2c8v5b1n7q4w8e3r6t9y2u5i8o1p4';

console.log('🎯 Monitoring IP Whitelist Fix Deployment');
console.log('👀 Watching for when your IP (173.230.100.254) gets whitelisted...\n');

let attempt = 1;

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
        'User-Agent': 'IP-Fix-Monitor',
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

    req.on('error', (err) => resolve({ status: 'ERROR', error: err.message }));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT' });
    });

    req.end();
  });
}

async function checkIPAccess() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Check #${attempt}:`);
  
  // Test multiple endpoints to see if IP is whitelisted
  const tests = [
    { name: 'Analytics Health', endpoint: '/api/analytics/health' },
    { name: 'Analytics Real-time', endpoint: '/api/analytics/realtime' },
    { name: 'Admin Analytics', endpoint: '/api/analytics/performance', 
      headers: { 'x-api-key': ADMIN_API_KEY } },
    { name: 'Core Services (control)', endpoint: '/v0/services' }
  ];

  let ipFixed = false;
  
  for (const test of tests) {
    const result = await makeRequest(test.endpoint, test.headers);
    
    if (test.name === 'Core Services (control)') {
      // This should always work - it's our control test
      const icon = result.status === 200 ? '✅' : '❌';
      console.log(`   ${icon} ${test.name}: ${result.status} (control test)`);
    } else {
      // These are the tests for IP whitelist
      if (result.status === 200) {
        console.log(`   🎉 ${test.name}: ${result.status} - IP WHITELIST WORKING!`);
        ipFixed = true;
      } else if (result.status === 403) {
        console.log(`   🚫 ${test.name}: ${result.status} (still blocked)`);
      } else if (result.status === 302) {
        console.log(`   🔄 ${test.name}: ${result.status} (still redirecting - not deployed yet)`);
      } else {
        console.log(`   ❓ ${test.name}: ${result.status} (unexpected)`);
      }
    }
  }
  
  if (ipFixed) {
    console.log('\n🎉 SUCCESS! IP WHITELIST FIX DEPLOYED!');
    console.log('✅ Your IP (173.230.100.254) now has access to analytics endpoints');
    console.log('🚀 Enterprise features should now be accessible!');
    console.log('\n🔗 Test commands:');
    console.log(`   curl ${API_BASE}/api/analytics/health`);
    console.log(`   curl -H "x-api-key: ${ADMIN_API_KEY}" ${API_BASE}/api/analytics/performance`);
    process.exit(0);
  }
  
  attempt++;
  console.log('   ⏳ Still deploying, checking again in 15 seconds...\n');
}

// Start monitoring
async function startMonitoring() {
  console.log('Starting IP whitelist fix monitoring...');
  console.log('Press Ctrl+C to stop\n');
  
  // Check immediately
  await checkIPAccess();
  
  // Then check every 15 seconds
  const interval = setInterval(async () => {
    await checkIPAccess();
    
    // Stop after 20 attempts (5 minutes)
    if (attempt > 20) {
      console.log('\n⏰ Monitoring timeout reached');
      console.log('📝 Environment variables may need more time to deploy');
      console.log('🔧 You can manually check: https://api.packmovego.com/api/analytics/health');
      clearInterval(interval);
      process.exit(1);
    }
  }, 15000);
}

startMonitoring().catch(console.error); 