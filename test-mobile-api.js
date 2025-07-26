#!/usr/bin/env node

const http = require('http');

// Test your API from your phone
const serverUrl = 'http://localhost:3001'; // Change this to your server URL

const tests = [
  {
    name: 'Health Check',
    path: '/health',
    method: 'GET'
  },
  {
    name: 'Mobile Test',
    path: '/mobile-test',
    method: 'GET'
  },
  {
    name: 'Blog Data',
    path: '/v0/blog',
    method: 'GET'
  },
  {
    name: 'Services Data',
    path: '/v0/services',
    method: 'GET'
  },
  {
    name: 'About Data',
    path: '/v0/about',
    method: 'GET'
  }
];

function makeRequest(test) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: test.path,
      method: test.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            test: test.name,
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            test: test.name,
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (err) => {
      reject({
        test: test.name,
        error: err.message
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing Mobile API Endpoints...\n');
  
  for (const test of tests) {
    try {
      const result = await makeRequest(test);
      if (result.success) {
        console.log(`✅ ${result.test}: ${result.status}`);
        if (result.data && typeof result.data === 'object') {
          console.log(`   Response keys: ${Object.keys(result.data).join(', ')}`);
        }
      } else {
        console.log(`❌ ${result.test}: ${result.status}`);
        console.log(`   Error: ${JSON.stringify(result.data)}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Connection failed`);
      console.log(`   Error: ${error.error}`);
    }
    console.log('');
  }
  
  console.log('📱 To test from your phone:');
  console.log(`   1. Make sure your phone is on the same WiFi network`);
  console.log(`   2. Find your computer's IP address: ifconfig | grep "inet " | grep -v 127.0.0.1`);
  console.log(`   3. Replace localhost with your IP: http://YOUR_IP:3001/mobile-test`);
  console.log(`   4. Test these URLs on your phone:`);
  tests.forEach(test => {
    console.log(`      - http://YOUR_IP:3001${test.path}`);
  });
}

runTests().catch(console.error); 