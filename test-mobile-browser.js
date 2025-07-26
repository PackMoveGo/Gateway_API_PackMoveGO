#!/usr/bin/env node

const https = require('https');

async function testMobileBrowser() {
  console.log('📱 Testing mobile browser behavior...\n');
  
  const testCases = [
    {
      name: 'iPhone Safari',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': 'https://www.packmovego.com',
        'Referer': 'https://www.packmovego.com/',
        'Connection': 'keep-alive'
      }
    },
    {
      name: 'Android Chrome',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': 'https://www.packmovego.com',
        'Referer': 'https://www.packmovego.com/',
        'Connection': 'keep-alive'
      }
    },
    {
      name: 'Mobile with no Origin',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.packmovego.com/',
        'Connection': 'keep-alive'
      }
    }
  ];
  
  const testRoutes = ['/v0/nav', '/v0/services', '/v0/testimonials'];
  
  for (const testCase of testCases) {
    console.log(`📱 Testing: ${testCase.name}`);
    
    for (const route of testRoutes) {
      try {
        console.log(`  📡 Testing route: ${route}`);
        
        // First test OPTIONS (preflight)
        const optionsResponse = await makeRequest(route, { ...testCase.headers }, 'OPTIONS');
        console.log(`    OPTIONS Status: ${optionsResponse.statusCode}`);
        console.log(`    OPTIONS CORS Origin: ${optionsResponse.headers['access-control-allow-origin'] || 'NOT SET'}`);
        
        // Then test GET
        const getResponse = await makeRequest(route, testCase.headers, 'GET');
        console.log(`    GET Status: ${getResponse.statusCode}`);
        console.log(`    GET CORS Origin: ${getResponse.headers['access-control-allow-origin'] || 'NOT SET'}`);
        
        if (getResponse.statusCode === 200) {
          console.log(`    ✅ SUCCESS: Route accessible`);
        } else {
          console.log(`    ❌ FAILED: Status ${getResponse.statusCode}`);
        }
        
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
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
testMobileBrowser().catch(console.error); 