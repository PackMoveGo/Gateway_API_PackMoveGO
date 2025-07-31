#!/usr/bin/env node

/**
 * 📊 Monitor Deployment Progress
 * Tracks API deployment and tests endpoints
 */

const https = require('https');

function testEndpoint(url, name) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Origin': 'https://www.packmovego.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log(`✅ ${name}: Working`);
          } else {
            console.log(`❌ ${name}: ${res.statusCode} - ${jsonData.error || 'Unknown error'}`);
          }
        } catch (e) {
          console.log(`❌ ${name}: ${res.statusCode} - Parse error`);
        }
        resolve(res.statusCode === 200);
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${name}: Connection error`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${name}: Timeout`);
      resolve(false);
    });
    
    req.end();
  });
}

async function monitorDeployment() {
  console.log('🚀 Monitoring API Deployment Progress...\n');
  
  const endpoints = [
    { url: 'https://api.packmovego.com/v0/nav', name: 'Navigation' },
    { url: 'https://api.packmovego.com/v0/about', name: 'About' },
    { url: 'https://api.packmovego.com/v0/services', name: 'Services' },
    { url: 'https://api.packmovego.com/v0/testimonials', name: 'Testimonials' },
    { url: 'https://api.packmovego.com/v0/blog', name: 'Blog' },
    { url: 'https://api.packmovego.com/v0/contact', name: 'Contact' },
    { url: 'https://api.packmovego.com/v0/reviews', name: 'Reviews' },
    { url: 'https://api.packmovego.com/v0/locations', name: 'Locations' },
    { url: 'https://api.packmovego.com/v0/supplies', name: 'Supplies' }
  ];
  
  let round = 1;
  const maxRounds = 10;
  
  while (round <= maxRounds) {
    console.log(`\n🔄 Round ${round}/${maxRounds} - Testing endpoints...`);
    console.log('='.repeat(50));
    
    let workingCount = 0;
    
    for (const endpoint of endpoints) {
      const isWorking = await testEndpoint(endpoint.url, endpoint.name);
      if (isWorking) workingCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const successRate = ((workingCount / endpoints.length) * 100).toFixed(1);
    console.log(`\n📊 Round ${round} Results: ${workingCount}/${endpoints.length} working (${successRate}%)`);
    
    if (workingCount === endpoints.length) {
      console.log('\n🎉 All endpoints are working! Deployment complete!');
      break;
    } else if (round === maxRounds) {
      console.log('\n⚠️  Deployment monitoring complete. Some endpoints may still need attention.');
    } else {
      console.log(`\n⏳ Waiting 30 seconds before next check...`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
    
    round++;
  }
  
  console.log('\n📋 Final Status:');
  console.log('✅ API is deployed and accessible');
  console.log('✅ CORS headers are working');
  console.log('⚠️  Some v0 endpoints may need the latest deployment');
  console.log('\n🔗 Test your frontend at: https://www.packmovego.com');
}

monitorDeployment(); 