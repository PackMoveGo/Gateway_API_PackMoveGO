#!/usr/bin/env node

/**
 * Deployment Status Test
 * Checks if our latest changes are actually deployed
 */

const https = require('https');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Origin': 'https://www.packmovego.com',
        'User-Agent': 'DEPLOYMENT-STATUS-TEST',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
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

async function checkDeploymentStatus() {
  console.log('🔍 DEPLOYMENT STATUS CHECK');
  console.log('==========================');
  
  try {
    // Test 1: Check API root for deployment info
    console.log('\n1️⃣ Checking API root for deployment info...');
    const rootResponse = await makeRequest('https://api.packmovego.com/');
    
    try {
      const rootData = JSON.parse(rootResponse.body);
      console.log(`   ✅ Uptime: ${rootData.uptime} seconds`);
      console.log(`   ✅ Timestamp: ${rootData.timestamp}`);
      console.log(`   ✅ Environment: ${rootData.environment}`);
    } catch (e) {
      console.log(`   ❌ Could not parse root response`);
    }
    
    // Test 2: Check for CORS headers
    console.log('\n2️⃣ Checking for CORS headers...');
    const corsResponse = await makeRequest('https://api.packmovego.com/v0/nav');
    
    const corsHeaders = Object.keys(corsResponse.headers).filter(h => 
      h.toLowerCase().startsWith('access-control')
    );
    
    if (corsHeaders.length > 0) {
      console.log('   ✅ CORS headers found:');
      corsHeaders.forEach(h => {
        console.log(`      ${h}: ${corsResponse.headers[h]}`);
      });
    } else {
      console.log('   ❌ No CORS headers found');
    }
    
    // Test 3: Check server headers for deployment info
    console.log('\n3️⃣ Checking server headers...');
    console.log(`   Server: ${corsResponse.headers.server || 'Unknown'}`);
    console.log(`   Render ID: ${corsResponse.headers['rndr-id'] || 'Unknown'}`);
    console.log(`   X-Powered-By: ${corsResponse.headers['x-powered-by'] || 'Unknown'}`);
    console.log(`   CF-Ray: ${corsResponse.headers['cf-ray'] || 'Unknown'}`);
    
    // Test 4: Check if our debug endpoint exists
    console.log('\n4️⃣ Testing commit verification...');
    console.log('Latest commit: d166226 (DEFINITIVE CORS FIX)');
    
    if (rootData?.uptime < 300) {
      console.log('   ✅ Recent deployment (uptime < 5 minutes)');
    } else {
      console.log('   ⚠️  Older deployment (uptime > 5 minutes)');
    }
    
    console.log('\n📊 SUMMARY:');
    console.log('============');
    
    if (corsHeaders.length > 0) {
      console.log('🎉 SUCCESS! CORS headers are present.');
      console.log('Your frontend should now work correctly.');
    } else {
      console.log('❌ ISSUE: CORS headers still missing.');
      console.log('\nPossible causes:');
      console.log('1. Cloudflare is caching old responses');
      console.log('2. Cloudflare is stripping CORS headers');
      console.log('3. Deployment is not updating properly');
      console.log('4. Our middleware is not running');
      
      console.log('\n🔧 MANUAL SOLUTIONS:');
      console.log('1. Clear Cloudflare cache in your dashboard');
      console.log('2. Add CORS headers in Cloudflare settings');
      console.log('3. Contact Render support about deployment issues');
      console.log('4. Try bypassing Cloudflare temporarily');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

checkDeploymentStatus(); 