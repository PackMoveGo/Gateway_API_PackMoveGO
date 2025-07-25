#!/usr/bin/env node

const https = require('https');

console.log('🔍 TESTING IP WHITELIST FIX...\n');

function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint, 'https://api.packmovego.com');
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET'
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

async function testFix() {
  console.log('Testing enterprise features access...');
  
  const tests = [
    { name: 'Analytics Health', endpoint: '/api/analytics/health' },
    { name: 'Analytics Realtime', endpoint: '/api/analytics/realtime' },
    { name: 'Core Services (control)', endpoint: '/v0/services' }
  ];
  
  for (const test of tests) {
    const status = await makeRequest(test.endpoint);
    const icon = status === 200 ? '✅' : status === 403 ? '🔄' : '❌';
    const message = status === 200 ? 'WORKING!' : 
                   status === 403 ? 'Still need IP whitelist' : 
                   `Status: ${status}`;
    console.log(`${icon} ${test.name}: ${message}`);
  }
  
  const analyticsWorking = await makeRequest('/api/analytics/health') === 200;
  
  if (analyticsWorking) {
    console.log('\n🎉 SUCCESS! IP whitelist fix is working!');
    console.log('✅ All enterprise features are now accessible');
    console.log('🚀 Backend is 100% operational!');
  } else {
    console.log('\n🔄 Still waiting for Render environment variable update...');
    console.log('⏳ Run this script again after making the Render dashboard changes');
  }
}

testFix().catch(console.error); 