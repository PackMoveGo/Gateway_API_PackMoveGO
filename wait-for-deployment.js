#!/usr/bin/env node

const https = require('https');

let attempts = 0;
const maxAttempts = 30; // 5 minutes at 10-second intervals

function checkCORS() {
  attempts++;
  console.log(`\n🔍 Attempt ${attempts}/${maxAttempts} - Checking CORS headers...`);
  
  const options = {
    hostname: 'api.packmovego.com',
    port: 443,
    path: '/v0/nav',
    method: 'GET',
    headers: {
      'Origin': 'https://www.packmovego.com'
    }
  };

  const req = https.request(options, (res) => {
    const hasOrigin = res.headers['access-control-allow-origin'];
    
    if (hasOrigin) {
      console.log('✅ SUCCESS! CORS headers are now present:');
      console.log(`   - access-control-allow-origin: ${hasOrigin}`);
      console.log(`   - Status: ${res.statusCode}`);
      console.log('\n🎉 Your API is now fully functional!');
      console.log('\nYou can test it with:');
      console.log('curl -H "Origin: https://www.packmovego.com" https://api.packmovego.com/v0/nav');
      process.exit(0);
    } else {
      console.log(`❌ No CORS headers yet (Status: ${res.statusCode})`);
      
      if (attempts < maxAttempts) {
        console.log('⏳ Waiting 10 seconds before next check...');
        setTimeout(checkCORS, 10000);
      } else {
        console.log('\n⏰ Timeout reached. The deployment may need more time.');
        console.log('Please check manually or wait a few more minutes.');
        process.exit(1);
      }
    }
  });

  req.on('error', (err) => {
    console.log(`❌ Request failed: ${err.message}`);
    if (attempts < maxAttempts) {
      setTimeout(checkCORS, 10000);
    } else {
      process.exit(1);
    }
  });

  req.end();
}

console.log('🚀 Waiting for CORS deployment...');
console.log('This will check every 10 seconds for CORS headers in GET requests.');
checkCORS(); 