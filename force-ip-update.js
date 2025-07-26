#!/usr/bin/env node

const https = require('https');

const API_KEY = 'rnd_wOZgFErNsChIOOOdEis4njApGbX1';
const SERVICE_ID = 'srv-d1rvk9vdiees73ajsuog';
const YOUR_IP = '173.230.100.254';

console.log('🔧 AGGRESSIVE IP WHITELIST UPDATE SCRIPT');
console.log('=========================================');
console.log(`Target IP: ${YOUR_IP}`);
console.log(`Service: ${SERVICE_ID}\n`);

function makeRequest(options, data) {
  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => resolve({ status: 'ERROR', error: err.message }));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT' });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function getCurrentEnvVars() {
  console.log('1. 📋 Getting current environment variables...');
  
  const options = {
    hostname: 'api.render.com',
    port: 443,
    path: `/v1/services/${SERVICE_ID}/env-vars`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const result = await makeRequest(options);
  
  if (result.status === 200) {
    console.log('✅ Current env vars retrieved');
    if (result.data && result.data.envVars) {
      const allowedIPs = result.data.envVars.find(env => env.key === 'ALLOWED_IPS');
      if (allowedIPs) {
        console.log(`   Current ALLOWED_IPS: ${allowedIPs.value}`);
        return allowedIPs.value;
      } else {
        console.log('   ⚠️ ALLOWED_IPS not found in environment variables');
        return '';
      }
    }
  } else {
    console.log(`❌ Failed to get env vars: ${result.status}`);
  }
  return null;
}

async function updateAllowedIPs() {
  console.log('\n2. 🔧 Updating ALLOWED_IPS with your IP...');
  
  const newIPList = '76.76.21.21,172.58.117.103,172.58.119.213,79.127.231.179,185.159.156.71,127.0.0.1,::1,185.159.156.121,173.230.100.254';
  
  // Method 1: PATCH request
  console.log('   Trying PATCH method...');
  const patchOptions = {
    hostname: 'api.render.com',
    port: 443,
    path: `/v1/services/${SERVICE_ID}/env-vars`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const patchData = {
    envVars: {
      ALLOWED_IPS: newIPList,
      ENABLE_IP_WHITELIST: 'true',
      API_KEY_ENABLED: 'true'
    }
  };

  const patchResult = await makeRequest(patchOptions, patchData);
  console.log(`   PATCH result: ${patchResult.status}`);

  if (patchResult.status === 200) {
    console.log('✅ PATCH update successful!');
    return true;
  }

  // Method 2: PUT request
  console.log('   Trying PUT method...');
  const putOptions = {
    hostname: 'api.render.com',
    port: 443,
    path: `/v1/services/${SERVICE_ID}/env-vars`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const putData = {
    envVars: [
      { key: 'ALLOWED_IPS', value: newIPList },
      { key: 'ENABLE_IP_WHITELIST', value: 'true' },
      { key: 'API_KEY_ENABLED', value: 'true' }
    ]
  };

  const putResult = await makeRequest(putOptions, putData);
  console.log(`   PUT result: ${putResult.status}`);

  if (putResult.status === 200) {
    console.log('✅ PUT update successful!');
    return true;
  }

  console.log('❌ Both PATCH and PUT methods failed');
  return false;
}

async function testIPAccess() {
  console.log('\n3. 🧪 Testing IP access...');
  
  const testOptions = {
    hostname: 'api.packmovego.com',
    port: 443,
    path: '/api/analytics/health',
    method: 'GET',
    headers: {
      'User-Agent': 'IP-Test-Script'
    }
  };

  const testResult = await makeRequest(testOptions);
  
  if (testResult.status === 200) {
    console.log('🎉 SUCCESS! Your IP is now whitelisted!');
    return true;
  } else if (testResult.status === 403) {
    console.log('🔄 Still blocked (403) - IP not yet whitelisted');
    return false;
  } else {
    console.log(`❓ Unexpected status: ${testResult.status}`);
    return false;
  }
}

async function runAggressiveUpdate() {
  try {
    // Get current state
    const currentIPs = await getCurrentEnvVars();
    
    if (currentIPs && currentIPs.includes(YOUR_IP)) {
      console.log('✅ Your IP is already in the list, checking if it works...');
    } else {
      console.log('❌ Your IP is missing, attempting update...');
      const updated = await updateAllowedIPs();
      
      if (!updated) {
        console.log('\n🚨 MANUAL ACTION REQUIRED:');
        console.log('The API updates failed. You MUST manually update on Render dashboard:');
        console.log('1. Go to: https://dashboard.render.com/');
        console.log('2. Click "PackMoveGO-API" service');
        console.log('3. Click "Environment" tab');
        console.log('4. Set ALLOWED_IPS to:');
        console.log(`   ${newIPList.split(',').join(',\n   ')}`);
        console.log('5. Click "Save Changes"');
        return;
      }
    }
    
    // Test if it works
    console.log('\n⏳ Waiting 30 seconds for deployment...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    const works = await testIPAccess();
    
    if (works) {
      console.log('\n🎊 SUCCESS! IP whitelist is now working!');
    } else {
      console.log('\n🔄 Still not working, may need more time or manual intervention');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runAggressiveUpdate(); 