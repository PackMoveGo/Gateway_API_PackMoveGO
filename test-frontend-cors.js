#!/usr/bin/env node

/**
 * Frontend CORS Test
 * Exactly simulates browser behavior
 */

const https = require('https');

function makeBrowserRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'Origin': 'https://www.packmovego.com',
        'Referer': 'https://www.packmovego.com/',
        ...headers
      }
    };

    console.log(`\n🌐 Making browser-like request to ${url}`);
    console.log(`📤 Headers being sent:`);
    Object.entries(options.headers).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    const req = https.request(options, (res) => {
      console.log(`\n📥 Response Status: ${res.statusCode}`);
      console.log(`📥 Response Headers:`);
      
      let hasCorsHeaders = false;
      Object.entries(res.headers).forEach(([key, value]) => {
        if (key.toLowerCase().startsWith('access-control')) {
          console.log(`   ✅ ${key}: ${value}`);
          hasCorsHeaders = true;
        } else {
          console.log(`   📄 ${key}: ${value}`);
        }
      });
      
      if (!hasCorsHeaders) {
        console.log(`   ❌ No CORS headers found`);
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          hasCorsHeaders
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testFrontendCors() {
  console.log('🚀 FRONTEND CORS TEST');
  console.log('====================');
  console.log('Simulating exact browser behavior...\n');

  try {
    const result = await makeBrowserRequest('https://api.packmovego.com/v0/nav');
    
    console.log(`\n📊 RESULT SUMMARY:`);
    console.log(`   Status: ${result.status}`);
    console.log(`   CORS Headers: ${result.hasCorsHeaders ? '✅ Present' : '❌ Missing'}`);
    
    if (result.hasCorsHeaders) {
      console.log('\n🎉 SUCCESS! CORS is working!');
      console.log('Your frontend should now be able to connect.');
    } else {
      console.log('\n❌ CORS headers still missing.');
      console.log('The backend needs more debugging.');
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
}

testFrontendCors(); 