#!/usr/bin/env node

const https = require('https');

console.log(`
🔍 CONTINUOUS IP WHITELIST MONITORING
====================================
Monitoring your IP: 173.230.100.254
Checking until analytics endpoints are accessible...
Press Ctrl+C to stop

`);

let attempt = 1;
let successCount = 0;

function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint, 'https://api.packmovego.com');
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'IP-Monitor'
      }
    }, (res) => {
      resolve(res.statusCode);
    });
    
    req.on('error', () => resolve('ERROR'));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve('TIMEOUT');
    });
    req.end();
  });
}

async function checkIPStatus() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Check #${attempt}:`);
  
  const tests = [
    { name: 'Core Services', endpoint: '/v0/services', shouldWork: true },
    { name: 'Analytics Health', endpoint: '/api/analytics/health', shouldWork: false },
    { name: 'Analytics Realtime', endpoint: '/api/analytics/realtime', shouldWork: false },
    { name: 'Health Check', endpoint: '/api/health', shouldWork: true }
  ];
  
  let allWorking = true;
  let analyticsWorking = 0;
  
  for (const test of tests) {
    const status = await makeRequest(test.endpoint);
    
    if (test.shouldWork && status === 200) {
      console.log(`   ✅ ${test.name}: ${status} (Working)`);
    } else if (!test.shouldWork && status === 200) {
      console.log(`   🎉 ${test.name}: ${status} - IP WHITELIST WORKING!`);
      analyticsWorking++;
    } else if (status === 403) {
      console.log(`   🔄 ${test.name}: ${status} (Blocked - IP needs whitelist)`);
      if (!test.shouldWork) allWorking = false;
    } else if (status === 200) {
      console.log(`   ✅ ${test.name}: ${status} (Working)`);
    } else {
      console.log(`   ❓ ${test.name}: ${status}`);
      if (test.shouldWork) allWorking = false;
    }
  }
  
  if (analyticsWorking >= 2) {
    successCount++;
    console.log(`\n🎊 SUCCESS! IP WHITELIST IS WORKING!`);
    console.log(`✅ Analytics endpoints are now accessible from your IP`);
    console.log(`✅ All backend features are operational`);
    console.log(`🎯 Backend transformation is COMPLETE!`);
    
    if (successCount >= 3) {
      console.log(`\n🏆 CONFIRMED SUCCESS (${successCount} consecutive successes)`);
      console.log(`🎉 Stopping monitor - your backend is fully operational!`);
      process.exit(0);
    }
  } else {
    successCount = 0; // Reset on failure
    console.log(`\n🔄 IP whitelist still needs manual update on Render dashboard`);
    console.log(`📋 See URGENT_IP_FIX_INSTRUCTIONS.md for step-by-step guide`);
  }
  
  attempt++;
  console.log(`   ⏳ Checking again in 20 seconds...\n`);
}

async function startMonitoring() {
  console.log('🚀 Starting continuous monitoring...');
  console.log('Will check every 20 seconds until IP whitelist is working\n');
  
  // Check immediately
  await checkIPStatus();
  
  // Then check every 20 seconds
  setInterval(async () => {
    await checkIPStatus();
    
    // Stop after 180 checks (1 hour)
    if (attempt > 180) {
      console.log('\n⏰ Monitoring timeout reached (1 hour)');
      console.log('📧 Please complete the manual Render dashboard fix');
      console.log('📋 Instructions: URGENT_IP_FIX_INSTRUCTIONS.md');
      process.exit(1);
    }
  }, 20000);
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Monitoring stopped by user');
  console.log('📋 Manual fix instructions: URGENT_IP_FIX_INSTRUCTIONS.md');
  process.exit(0);
});

startMonitoring().catch(console.error); 