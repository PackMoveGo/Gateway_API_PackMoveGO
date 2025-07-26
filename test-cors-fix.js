#!/usr/bin/env node

const https = require('https');

let attempts = 0;
const maxAttempts = 20; // 3-4 minutes

function testCORS() {
  attempts++;
  console.log(`\n🔍 Test ${attempts}/${maxAttempts} - Checking CORS fix...`);
  
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
    const corsOrigin = res.headers['access-control-allow-origin'];
    const corsCredentials = res.headers['access-control-allow-credentials'];
    const corsHeaders = res.headers['access-control-allow-headers'];
    const corsMethods = res.headers['access-control-allow-methods'];
    
    console.log(`Status: ${res.statusCode}`);
    
    if (corsOrigin) {
      console.log('✅ SUCCESS! CORS headers found:');
      console.log(`   🌐 Origin: ${corsOrigin}`);
      console.log(`   🔐 Credentials: ${corsCredentials}`);
      console.log(`   📝 Headers: ${corsHeaders || 'Not set'}`);
      console.log(`   ⚡ Methods: ${corsMethods || 'Not set'}`);
      
      console.log('\n🎉 CORS IS NOW WORKING!');
      console.log('\nYour frontend should now be able to connect to the API.');
      console.log('Test it by refreshing your website: https://www.packmovego.com');
      
      process.exit(0);
    } else {
      console.log('❌ No CORS headers yet');
      
      if (attempts < maxAttempts) {
        console.log('⏳ Waiting 10 seconds for deployment...');
        setTimeout(testCORS, 10000);
      } else {
        console.log('\n⏰ Max attempts reached.');
        console.log('The fix may need a few more minutes to deploy.');
        console.log('\nYou can manually test with:');
        console.log('curl -I -H "Origin: https://www.packmovego.com" https://api.packmovego.com/v0/nav');
        process.exit(1);
      }
    }
  });

  req.on('error', (err) => {
    console.log(`❌ Error: ${err.message}`);
    if (attempts < maxAttempts) {
      setTimeout(testCORS, 10000);
    }
  });

  req.end();
}

console.log('🚀 Testing CORS Fix Deployment');
console.log('=============================');
console.log('Monitoring for CORS headers on GET requests...');
testCORS(); 