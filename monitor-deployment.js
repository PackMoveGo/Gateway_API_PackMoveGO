#!/usr/bin/env node

/**
 * Monitor API Deployment
 * Checks deployment status and tests API functionality
 */

const https = require('https');

const API_BASE = 'https://api.packmovego.com';
const CHECK_INTERVAL = 10000; // 10 seconds
let deploymentStartTime = Date.now();

function makeRequest(endpoint, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.packmovego.com',
        ...headers
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

async function checkDeployment() {
  const elapsed = Date.now() - deploymentStartTime;
  
  console.log(`\n⏱️  Checking deployment... (${formatTime(elapsed)} elapsed)`);
  
  try {
    // Test health endpoint
    const healthResponse = await makeRequest('/api/health');
    
    if (healthResponse.status === 200) {
      console.log('✅ API is responding');
      
      // Test CORS with origin header
      const corsResponse = await makeRequest('/api/health', {
        'Origin': 'https://www.packmovego.com'
      });
      
      if (corsResponse.headers['access-control-allow-origin']) {
        console.log('✅ CORS is working');
        
        // Test a data endpoint 
        try {
          const dataResponse = await makeRequest('/v0/nav', {
            'Origin': 'https://www.packmovego.com'
          });
          
          if (dataResponse.status === 200) {
            console.log('✅ Data endpoints working');
            console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
            console.log(`Total deployment time: ${formatTime(elapsed)}`);
            console.log('\n🔬 Running full test suite...\n');
            
            // Run the full test
            const { spawn } = require('child_process');
            const testProcess = spawn('node', ['test-api-auth.js'], { stdio: 'inherit' });
            
            testProcess.on('close', (code) => {
              if (code === 0) {
                console.log('\n✅ All tests passed! Your API is fully functional.');
              } else {
                console.log('\n❌ Some tests failed. Check the output above.');
              }
              process.exit(code);
            });
            
            return;
          } else {
            console.log(`❌ Data endpoint returned ${dataResponse.status}`);
          }
        } catch (e) {
          console.log('❌ Data endpoint test failed:', e.message);
        }
      } else {
        console.log('❌ CORS headers missing');
      }
    } else {
      console.log(`❌ Health check failed: ${healthResponse.status}`);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
  
  // Continue monitoring
  if (elapsed < 300000) { // Stop after 5 minutes
    setTimeout(checkDeployment, CHECK_INTERVAL);
  } else {
    console.log('\n⏰ Deployment monitoring timed out after 5 minutes');
    console.log('Please check the Render dashboard manually:');
    console.log('https://dashboard.render.com/');
    process.exit(1);
  }
}

console.log('🚀 MONITORING API DEPLOYMENT');
console.log('=============================');
console.log('Waiting for new deployment to complete...');
console.log('This will check every 10 seconds for up to 5 minutes.');
console.log('\nIf this is your first deployment, you may also need to:');
console.log('1. Go to https://dashboard.render.com/');
console.log('2. Find your PackMoveGO-API service');
console.log('3. Add these environment variables:');
console.log('   - API_KEY_ENABLED = true');
console.log('   - API_KEY_FRONTEND = pmg_frontend_live_sk_a7f8e2d9c1b4x6m9p3q8r5t2w7y1z4a6');
console.log('   - API_KEY_ADMIN = pmg_admin_live_sk_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4');
console.log('   - ENABLE_IP_WHITELIST = true');

// Start monitoring
checkDeployment(); 