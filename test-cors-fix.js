#!/usr/bin/env node

const https = require('https');

const API_BASE = 'https://api.packmovego.com';

async function testCorsHeaders() {
  console.log('🔍 Testing CORS headers for /v0/ routes...\n');
  
  const testRoutes = [
    '/v0/services',
    '/v0/testimonials', 
    '/v0/nav'
  ];
  
  for (const route of testRoutes) {
    console.log(`📡 Testing: ${route}`);
    
    try {
      const response = await makeRequest(route);
      
      console.log(`✅ Status: ${response.statusCode}`);
      console.log(`📋 CORS Headers:`);
      console.log(`   Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || 'NOT SET'}`);
      console.log(`   Access-Control-Allow-Credentials: ${response.headers['access-control-allow-credentials'] || 'NOT SET'}`);
      console.log(`   Access-Control-Allow-Headers: ${response.headers['access-control-allow-headers'] || 'NOT SET'}`);
      console.log(`   Access-Control-Allow-Methods: ${response.headers['access-control-allow-methods'] || 'NOT SET'}`);
      console.log(`   Vary: ${response.headers['vary'] || 'NOT SET'}`);
      console.log('');
      
    } catch (error) {
      console.log(`❌ Error testing ${route}:`, error.message);
      console.log('');
    }
  }
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.packmovego.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Origin': 'https://www.packmovego.com',
        'User-Agent': 'CORS-Test/1.0'
      }
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

// Run the test
testCorsHeaders().catch(console.error); 