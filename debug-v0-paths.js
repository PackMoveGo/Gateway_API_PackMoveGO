#!/usr/bin/env node

/**
 * 🔍 Debug V0 Paths Script
 * Tests the v0 endpoints to see what's happening with file paths
 */

const https = require('https');

function testV0Endpoint(endpoint) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.packmovego.com',
      port: 443,
      path: `/v0/${endpoint}`,
      method: 'GET',
      headers: {
        'Origin': 'https://www.packmovego.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`\n🔍 ${endpoint}:`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response:`, jsonData);
        } catch (e) {
          console.log(`\n🔍 ${endpoint}:`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Raw Response: ${data.substring(0, 200)}...`);
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`\n❌ ${endpoint}: ${error.message}`);
      resolve();
    });
    
    req.end();
  });
}

async function debugV0Paths() {
  console.log('🔍 Debugging V0 Endpoints...\n');
  
  const endpoints = ['about', 'services', 'testimonials', 'blog', 'contact', 'reviews', 'locations', 'supplies'];
  
  for (const endpoint of endpoints) {
    await testV0Endpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ Debug complete!');
}

debugV0Paths(); 