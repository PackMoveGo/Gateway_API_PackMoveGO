#!/usr/bin/env node

/**
 * 📊 PackMoveGO API Deployment Monitor
 * 
 * This script monitors the deployment progress and tests endpoints
 * once the new deployment is live.
 */

const https = require('https');
const { URL } = require('url');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PackMoveGO-Deployment-Monitor/1.0',
        ...options.headers
      }
    };
    
    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    
    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = data;
        }
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsedData,
          rawData: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testEndpoint(url, name, expectedStatus = 200) {
  try {
    const response = await makeRequest(url, {
      headers: {
        'Origin': 'https://www.packmovego.com'
      }
    });
    
    const corsHeader = response.headers['access-control-allow-origin'];
    const hasCORS = corsHeader && (corsHeader === '*' || corsHeader.includes('packmovego.com'));
    
    if (response.statusCode === expectedStatus) {
      log(`✅ ${name}: Status ${response.statusCode}, CORS: ${hasCORS ? '✅' : '❌'}`, 'green');
      return true;
    } else if (response.statusCode === 500) {
      log(`❌ ${name}: Status ${response.statusCode} - Server Error`, 'red');
      if (response.data && response.data.error) {
        log(`   Error: ${response.data.error}`, 'yellow');
      }
      return false;
    } else {
      log(`❌ ${name}: Status ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${name}: ${error.message}`, 'red');
    return false;
  }
}

async function monitorDeployment() {
  log('📊 PackMoveGO API Deployment Monitor', 'bright');
  log('Monitoring deployment progress...', 'cyan');
  log('='.repeat(60), 'bright');
  
  const endpoints = [
    { url: 'https://api.packmovego.com/health', name: 'Health Check' },
    { url: 'https://api.packmovego.com/api/health', name: 'API Health' },
    { url: 'https://api.packmovego.com/api/heartbeat', name: 'Heartbeat' },
    { url: 'https://api.packmovego.com/api/ping', name: 'Ping' },
    { url: 'https://api.packmovego.com/v0/nav', name: 'Navigation Data' },
    { url: 'https://api.packmovego.com/v0/about', name: 'About Data' },
    { url: 'https://api.packmovego.com/v0/services', name: 'Services Data' },
    { url: 'https://api.packmovego.com/api/auth/status', name: 'Auth Status' }
  ];
  
  let successCount = 0;
  let totalCount = endpoints.length;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint.url, endpoint.name);
    if (success) successCount++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const successRate = ((successCount / totalCount) * 100).toFixed(1);
  
  log('\n' + '='.repeat(60), 'bright');
  log('📊 DEPLOYMENT TEST RESULTS', 'bright');
  log('='.repeat(60), 'bright');
  
  log(`✅ Successful: ${successCount}/${totalCount}`, 'green');
  log(`❌ Failed: ${totalCount - successCount}/${totalCount}`, 'red');
  log(`📈 Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');
  
  if (successRate >= 80) {
    log('\n🎉 Deployment appears successful!', 'green');
    log('Your frontend should now work without CORS errors.', 'green');
  } else {
    log('\n⚠️  Some issues remain. Check the failed endpoints above.', 'yellow');
  }
  
  log('\n🔍 Frontend Test:', 'cyan');
  log('Visit https://www.packmovego.com and check the browser console', 'cyan');
  log('You should see no CORS errors and successful API calls.', 'cyan');
  
  log('\n📋 Next Steps:', 'yellow');
  if (successRate >= 80) {
    log('✅ Test your frontend application', 'green');
    log('✅ Monitor for any remaining issues', 'green');
    log('✅ Check browser console for errors', 'green');
  } else {
    log('⚠️  Wait a few more minutes for deployment to complete', 'yellow');
    log('⚠️  Run this script again in 2-3 minutes', 'yellow');
    log('⚠️  Check Render dashboard for deployment status', 'yellow');
  }
  
  log('\n' + '='.repeat(60), 'bright');
}

// Run the monitor
monitorDeployment(); 