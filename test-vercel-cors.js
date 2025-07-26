#!/usr/bin/env node

const https = require('https');

async function testVercelCors() {
  console.log('🔍 Testing Vercel domain CORS support...\n');
  
  const testCases = [
    {
      name: 'Vercel Frontend Domain',
      origin: 'https://packmovego-6x8w2t0kw-pack-move-go-frontend.vercel.app',
      expected: true
    },
    {
      name: 'Original Domain',
      origin: 'https://www.packmovego.com',
      expected: true
    },
    {
      name: 'Other Vercel Domain',
      origin: 'https://some-other-app.vercel.app',
      expected: true
    },
    {
      name: 'Unauthorized Domain',
      origin: 'https://google.com',
      expected: false
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`📡 Testing: ${testCase.name}`);
    console.log(`   Origin: ${testCase.origin}`);
    
    try {
      // Test OPTIONS (preflight)
      const optionsResponse = await makeRequest('/v0/nav', { 'Origin': testCase.origin }, 'OPTIONS');
      console.log(`   OPTIONS Status: ${optionsResponse.statusCode}`);
      console.log(`   OPTIONS CORS Origin: ${optionsResponse.headers['access-control-allow-origin'] || 'NOT SET'}`);
      
      // Test GET
      const getResponse = await makeRequest('/v0/nav', { 'Origin': testCase.origin }, 'GET');
      console.log(`   GET Status: ${getResponse.statusCode}`);
      console.log(`   GET CORS Origin: ${getResponse.headers['access-control-allow-origin'] || 'NOT SET'}`);
      
      const hasCorsHeaders = getResponse.headers['access-control-allow-origin'] || optionsResponse.headers['access-control-allow-origin'];
      
      if (hasCorsHeaders && testCase.expected) {
        console.log(`   ✅ SUCCESS: CORS headers present as expected`);
      } else if (!hasCorsHeaders && !testCase.expected) {
        console.log(`   ✅ SUCCESS: No CORS headers as expected`);
      } else {
        console.log(`   ❌ FAILED: CORS headers not as expected`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }
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

// Run the test
testVercelCors().catch(console.error); 